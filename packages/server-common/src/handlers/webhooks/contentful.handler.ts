import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import { WebhookDetail, WebhookDetailType } from '@asap-hub/model';
import { framework as lambda } from '@asap-hub/services-common';
import { EventBridge } from '@aws-sdk/client-eventbridge';
import { Logger } from '../../utils';
import { validateContentfulRequest } from '../../utils/validate-contentful-request';

const getDetailTypeFromRequest = (
  request: lambda.Request<ContentfulWebhookPayload>,
): WebhookDetailType => {
  const actions = request.headers['x-contentful-topic']?.split('.') ?? [];
  const action = actions[actions.length - 1] as 'publish' | 'unpublish';
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
export const contentfulHandlerFactory =
  (
    webhookAuthenticationToken: string,
    eventBridge: EventBridge,
    eventBus: string,
    eventSource: string,
    logger: Logger,
  ): ((
    request: lambda.Request<ContentfulWebhookPayload>,
  ) => Promise<{ statusCode: number }>) =>
  async (request) => {
    validateContentfulRequest(request, webhookAuthenticationToken);

    try {
      const detailType = getDetailTypeFromRequest(request);
      const detail = getDetailFromRequest(request);

      await eventBridge.putEvents({
        Entries: [
          {
            EventBusName: eventBus,
            Source: eventSource,
            DetailType: detailType,
            Detail: JSON.stringify(detail),
          },
        ],
      });
      logger.debug(
        `Event added to ${eventBus} detail Type: ${detailType} detail: ${JSON.stringify(
          detail,
        )}`,
      );

      return {
        statusCode: 200,
      };
    } catch (err) {
      logger.error(`An error occurred putting onto the event bus ${eventBus}`);
      if (err instanceof Error) {
        logger.error(`The error message: ${err.message}`);
      }
      return {
        statusCode: 500,
      };
    }
  };
