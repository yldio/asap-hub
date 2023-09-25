import {
  ContentfulWebhookPayload,
  getCDAClient,
  pollContentfulDeliveryApi,
} from '@asap-hub/contentful';
import { WebhookDetail, WebhookDetailType } from '@asap-hub/model';
import { framework as lambda } from '@asap-hub/services-common';
import { EventBridge } from '@aws-sdk/client-eventbridge';
import { Logger } from '../../utils';
import { validateContentfulRequest } from '../../utils/validate-contentful-request';

const getActionFromRequest = (
  request: lambda.Request<ContentfulWebhookPayload>,
): 'publish' | 'unpublish' => {
  const actions = request.headers['x-contentful-topic']?.split('.') ?? [];
  return actions[actions.length - 1] as 'publish' | 'unpublish';
};

const getDetailTypeFromRequest = (
  request: lambda.Request<ContentfulWebhookPayload>,
): WebhookDetailType => {
  const action = getActionFromRequest(request);
  const contentType = request.payload.sys.contentType.sys.id;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return `${contentType[0]!.toUpperCase()}${contentType.slice(
    1,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  )}${action[0]!.toUpperCase()}${action.slice(1)}ed` as WebhookDetailType;
};

const getDetailFromRequest = (
  request: lambda.Request<ContentfulWebhookPayload>,
): WebhookDetail<ContentfulWebhookPayload> => ({
  resourceId: request.payload.sys.id,
  ...request.payload,
});
type Config = {
  eventBus: string;
  eventSource: string;
  space: string;
  environment: string;
  accessToken: string;
};
export const contentfulHandlerFactory =
  (
    webhookAuthenticationToken: string,
    eventBridge: EventBridge,
    config: Config,
    logger: Logger,
  ): ((
    request: lambda.Request<ContentfulWebhookPayload>,
  ) => Promise<{ statusCode: number }>) =>
  async (request) => {
    validateContentfulRequest(request, webhookAuthenticationToken);
    logger.debug(`request: ${JSON.stringify(request)}`);

    const detailType = getDetailTypeFromRequest(request);
    const detail = getDetailFromRequest(request);
    const action = getActionFromRequest(request);

    if (!detail.sys.revision) {
      throw new Error('Invalid payload');
    }
    const entryVersion = detail.sys.revision;
    const cdaClient = getCDAClient({
      accessToken: config.accessToken,
      space: config.space,
      environment: config.environment,
    });
    const fetchEntryById = async () => {
      try {
        const entry = await cdaClient.getEntry(detail.resourceId);
        logger.debug(`entry ${JSON.stringify(entry)}`);
        return entry;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.match(/The resource could not be found/) &&
          action === 'unpublish'
        ) {
          return undefined;
        }
        throw error;
      }
    };

    try {
      await pollContentfulDeliveryApi(fetchEntryById, entryVersion);
    } catch (error) {
      // skip if the entry is not found as it may have been deleted
      if (!(error instanceof Error && error.message === 'Not found')) {
        if (error instanceof Error) {
          logger.error(`The error message: ${error.message}`);
        }
        return {
          statusCode: 500,
        };
      }
    }

    try {
      await eventBridge.putEvents({
        Entries: [
          {
            EventBusName: config.eventBus,
            Source: config.eventSource,
            DetailType: detailType,
            Detail: JSON.stringify(detail),
          },
        ],
      });
      logger.debug(
        `Event added to ${
          config.eventBus
        } detail Type: ${detailType} detail: ${JSON.stringify(detail)}`,
      );

      return {
        statusCode: 200,
      };
    } catch (err) {
      logger.error(
        `An error occurred putting onto the event bus ${config.eventBus}`,
      );
      if (err instanceof Error) {
        logger.error(`The error message: ${err.message}`);
      }
      return {
        statusCode: 500,
      };
    }
  };
