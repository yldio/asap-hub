import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import { WebhookDetail, WebhookDetailType } from '@asap-hub/model';
import { framework as lambda } from '@asap-hub/services-common';
import { EventBridge } from '@aws-sdk/client-eventbridge';
import Boom from '@hapi/boom';
import { Logger } from '../../utils';

const validateContentfulRequest = (
  request: lambda.Request,
  webhookAuthenticationToken: string,
): request is lambda.Request<ContentfulWebhookPayload> =>
  !!request.headers.authorization &&
  request.headers.authorization === webhookAuthenticationToken;

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
    if (!validateContentfulRequest(request, webhookAuthenticationToken)) {
      logger.error('Unauthorized request');
      throw Boom.unauthorized();
    }

    try {
      const detailType = getDetailTypeFromRequest(request);
      const detail = getDetailFromRequest(request);

      logger.info(`Event detail type ${detailType}`);
      logger.info(`Event detail ${detail}`);

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
      logger.info(`Event added to ${eventBus}`);

      return {
        statusCode: 200,
      };
    } catch (err) {
      logger.error(
        `An error occurred putting onto the eventBus ${eventBus}`,
        err,
      );
      if (err instanceof Error) {
        logger.error(`The error message: ${err.message}`);
      }
      return {
        statusCode: 500,
      };
    }
  };
