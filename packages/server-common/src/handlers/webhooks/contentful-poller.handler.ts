import { getCDAClient, pollContentfulDeliveryApi } from '@asap-hub/contentful';
import { framework as lambda } from '@asap-hub/services-common';
import { EventBridge } from '@aws-sdk/client-eventbridge';
import { SQSEvent, SQSRecord } from 'aws-lambda';
import { Logger } from '../../utils';

type Config = {
  eventBus: string;
  eventSource: string;
  space: string;
  environment: string;
  accessToken: string;
};

export const contentfulPollerHandlerFactory = (
  eventBridge: EventBridge,
  config: Config,
  logger: Logger,
): ((
  sqsEvent: lambda.Request<SQSEvent>,
) => Promise<{ statusCode: number }>) => {
  const cdaClient = getCDAClient({
    accessToken: config.accessToken,
    space: config.space,
    environment: config.environment,
  });

  return async (sqsEvent) => {
    try {
      logger.debug(`sqsEvent: ${JSON.stringify(sqsEvent)}`);
      await Promise.all(
        sqsEvent.payload.Records.map(async (record: SQSRecord) => {
          const detailTypeAttribute = record.messageAttributes.DetailType;
          const detailType = detailTypeAttribute?.stringValue;
          const actionAttribute = record.messageAttributes.Action;
          const action = actionAttribute?.stringValue;
          const detail = JSON.parse(record.body);
          if (!(detail.sys.revision && detailType && action)) {
            throw new Error('Invalid payload');
          }
          const entryVersion = detail.sys.revision;

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
              logger.error(error, 'Error while fetching entry');
              throw error;
            }
          };
          try {
            await pollContentfulDeliveryApi(fetchEntryById, entryVersion);
          } catch (error) {
            logger.error(error, 'Error during polling the entry');

            // skip if the entry is not found as it may have been deleted
            if (!(error instanceof Error && error.message === 'Not found')) {
              if (error instanceof Error) {
                logger.error(`The error message: ${error.message}`);
              }
              throw error;
            }
          }
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
        }),
      );
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
    return {
      statusCode: 200,
    };
  };
};
