import {
  ManuscriptVersionEvent,
  TeamEvent,
  UserEvent,
  ManuscriptEvent,
  ComplianceReportEvent,
} from '@asap-hub/model';
import {
  EventBridgeHandler,
  ManuscriptVersionPayload,
  UserPayload,
  TeamPayload,
  ManuscriptPayload,
  ComplianceReportPayload,
} from '@asap-hub/server-common';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { complianceDocSyncQueueUrl, contentfulEnvId } from '../../config';
import { getEntryDataProvider } from '../../dependencies/users.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import EntryController from '../../controllers/entry.controller';
import ManuscriptVersionController from '../../controllers/manuscript-version.controller';
import { getManuscriptVersionsDataProvider } from '../../dependencies/manuscript-versions.dependencies';

const shouldSyncEntry = async (
  entryController: EntryController,
  entityType: string,
  resourceId: string,
  isProd: boolean,
): Promise<boolean> => {
  if (!isProd) return true;

  const FIELD_FILTERS: Record<string, string[] | null> = {
    users: ['lastName', 'nickname', 'firstName', 'middleName'],
    teams: ['displayName'],
    projects: ['title', 'projectId', 'grantId'],
    manuscripts: null,
    complianceReports: null,
  };

  const allowedFields = FIELD_FILTERS[entityType];

  // no filtering rules → always sync
  if (!allowedFields) return true;

  const changedFields = await entryController.getChangedFields(resourceId);

  return changedFields.some((f) => allowedFields.includes(f));
};
/* istanbul ignore next */
export const complianceEntryHandler =
  (
    sqs: SQSClient,
    manuscriptVersionsController: ManuscriptVersionController,
    entryController: EntryController,
    options?: { isProd?: boolean },
  ): EventBridgeHandler<
    | ManuscriptVersionEvent
    | UserEvent
    | TeamEvent
    | ManuscriptEvent
    | ComplianceReportEvent,
    | ManuscriptVersionPayload
    | UserPayload
    | TeamPayload
    | ManuscriptPayload
    | ComplianceReportPayload
  > =>
  async (event) => {
    logger.debug(event);
    logger.debug(`Event ${event['detail-type']}`);

    const detailType = event['detail-type'];
    const base = detailType.replace(/(Published|Unpublished)$/, '');

    const isUnpublished = detailType.includes('Unpublished');
    const isProd = options?.isProd ?? false;

    const entityType = base.charAt(0).toLowerCase() + base.slice(1);

    let manuscriptVersionIds: string[] = [];

    try {
      if (detailType.includes('ManuscriptVersions')) {
        manuscriptVersionIds = [event.detail.resourceId];
      } else {
        if (!isUnpublished) {
          const shouldSync = await shouldSyncEntry(
            entryController,
            entityType,
            event.detail.resourceId,
            isProd,
          );

          if (!shouldSync) {
            logger.debug(
              { resourceId: event.detail.resourceId, entityType },
              'No relevant field changes, skipping sync',
            );
            return;
          }
        }
        manuscriptVersionIds =
          await manuscriptVersionsController.fetchManuscriptVersionIdsByLinkedEntry(
            event.detail.resourceId,
            entityType,
          );
      }

      if (manuscriptVersionIds.length === 0) {
        logger.debug(
          { resourceId: event.detail.resourceId, detailType },
          'No manuscript version IDs found, skipping queue',
        );
        return;
      }

      await sqs.send(
        new SendMessageCommand({
          QueueUrl: complianceDocSyncQueueUrl,
          MessageBody: JSON.stringify({
            manuscriptVersionIds,
            sourceEvent: detailType,
          }),
        }),
      );
    } catch (e) {
      logger.error(e, `Error while pushing manuscript version ids to queue.`);
      throw e;
    }
  };

/* istanbul ignore next */
const sqs = new SQSClient({});

export const handler = sentryWrapper(
  complianceEntryHandler(
    sqs,
    new ManuscriptVersionController(getManuscriptVersionsDataProvider()),
    new EntryController(getEntryDataProvider()),
    { isProd: contentfulEnvId === 'Production' },
  ),
);
