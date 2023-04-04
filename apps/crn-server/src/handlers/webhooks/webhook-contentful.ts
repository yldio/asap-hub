import 'source-map-support/register';
import Boom from '@hapi/boom';
import { EventBridge } from 'aws-sdk';
import { APIGatewayEvent, Handler } from 'aws-lambda';
import { WebhookDetail, WebhookDetailType } from '@asap-hub/model';
import { framework as lambda } from '@asap-hub/services-common';
import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import {
  contentfulWebhookAuthenticationToken,
  eventBridgeAccessKey,
  eventBridgeEndpoint,
  eventBridgeSecret,
  eventBus,
  eventSource,
} from '../../config';

export const contentfulWebhookFactory = (
  webhookAuthenticationToken: string,
  eventBridge: EventBridge,
): lambda.Handler =>
  lambda.http<Record<string, string>, void>(
    async (request: lambda.Request<Record<string, string>>) => {
      if (!validateContentfulRequest(request, webhookAuthenticationToken)) {
        throw Boom.unauthorized();
      }

      const detailType = getDetailTypeFromRequest(request);
      const detail = getDetailFromRequest(request);

      await eventBridge
        .putEvents({
          Entries: [
            {
              EventBusName: eventBus,
              Source: eventSource,
              DetailType: detailType,
              Detail: JSON.stringify(detail),
            },
          ],
        })
        .promise();

      return {
        statusCode: 200,
      };
    },
  );

const eventBridge = new EventBridge({
  endpoint: eventBridgeEndpoint,
  accessKeyId: eventBridgeAccessKey,
  secretAccessKey: eventBridgeSecret,
});

export const handler: Handler<APIGatewayEvent> = sentryWrapper(
  contentfulWebhookFactory(contentfulWebhookAuthenticationToken, eventBridge),
);

export const validateContentfulRequest = (
  request: lambda.Request,
  webhookAuthenticationToken: string,
): request is lambda.Request<ContentfulWebhookPayload> => {
  if (!request.headers.authorization) {
    return false;
  }

  if (request.headers.authorization !== webhookAuthenticationToken) {
    return false;
  }

  return true;
};

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
