import { getCDAClient, pollContentfulDeliveryApi } from '@asap-hub/contentful';
import { EventBridge } from '@aws-sdk/client-eventbridge';
import { SQSEvent } from 'aws-lambda';
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
): ((sqsEvent: SQSEvent) => Promise<{ statusCode: number }>) => {
  const cdaClient = getCDAClient({
    accessToken: config.accessToken,
    space: config.space,
    environment: config.environment,
  });
  const fetchEntryById = (id: string, action: string) => async () => {
    try {
      const entry = await cdaClient.getEntry(id, {
        include: 1,
      });
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
      logger.error(`Error while fetching entry ${id}`);
      if (error instanceof Error) {
        logger.error(`The error message: ${error.message}`);
      }
      throw error;
    }
  };

  return async (sqsEvent) => {
    try {
      logger.debug(`sqsEvent: ${JSON.stringify(sqsEvent)}`);
      const record = sqsEvent.Records[0];
      if (!(record && sqsEvent.Records.length === 1)) {
        throw new Error('Invalid record length. BatchSize is set to 1.');
      }
      const detailType = record.messageAttributes.DetailType?.stringValue;
      const action = record.messageAttributes.Action?.stringValue;
      const detail = JSON.parse(record.body);
      const entryVersion = detail.sys.revision;
      if (!(entryVersion && detailType && action)) {
        throw new Error('Invalid payload');
      }

      try {
        await pollContentfulDeliveryApi(
          fetchEntryById(detail.resourceId, action),
          entryVersion,
        );
      } catch (error) {
        logger.error(
          error,
          `Error during polling the entry ${detail.resourceId}`,
        );

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
