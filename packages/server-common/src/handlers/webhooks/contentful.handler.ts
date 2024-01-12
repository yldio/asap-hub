import {
  ContentfulWebhookPayload,
  ContentfulWebhookPayloadType,
  WebhookPayloadTypeFirstLetterCapitalized,
} from '@asap-hub/contentful';
import { WebhookDetail, WebhookDetailType } from '@asap-hub/model';
import { framework as lambda } from '@asap-hub/services-common';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from '../../utils';
import { validateContentfulRequest } from '../../utils/validate-contentful-request';

type ContentfulActions =
  | 'publish'
  | 'unpublish'
  | 'create'
  | 'save'
  | 'autosave'
  | 'archive'
  | 'unarchive'
  | 'delete'
  | 'complete';

const getActionFromRequest = (
  request: lambda.Request<ContentfulWebhookPayload>,
): ContentfulActions => {
  const actions = request.headers['x-contentful-topic']?.split('.') ?? [];
  return actions[actions.length - 1] as ContentfulActions;
};

const getWebhookAction = (action: 'publish' | 'unpublish') =>
  `${action[0]!.toUpperCase()}${action.slice(1)}ed` as
    | 'Published'
    | 'Unpublished';

const getWebhookContentType = (
  contentType: ContentfulWebhookPayloadType,
): WebhookPayloadTypeFirstLetterCapitalized =>
  (contentType[0]!.toUpperCase() +
    contentType.slice(1)) as WebhookPayloadTypeFirstLetterCapitalized;

const getDetailTypeFromRequest = (
  request: lambda.Request<ContentfulWebhookPayload>,
): WebhookDetailType => {
  const action = getActionFromRequest(request);
  const contentType = request.payload.sys.contentType.sys.id;

  if (action !== 'publish' && action !== 'unpublish') {
    throw Error(`Action ${action} not supported by handlers.`);
  }

  return `${getWebhookContentType(contentType)}${getWebhookAction(action)}`;
};

const getDetailFromRequest = (
  request: lambda.Request<ContentfulWebhookPayload>,
): WebhookDetail<ContentfulWebhookPayload> => ({
  resourceId: request.payload.sys.id,
  ...request.payload,
});
type Config = {
  contentfulPollerQueueUrl: string;
  webhookAuthenticationToken: string;
};

export const contentfulHandlerFactory =
  (
    sqs: SQSClient,
    { webhookAuthenticationToken, contentfulPollerQueueUrl }: Config,
    logger: Logger,
  ): ((
    request: lambda.Request<ContentfulWebhookPayload>,
  ) => Promise<APIGatewayProxyResult>) =>
  async (request) => {
    validateContentfulRequest(request, webhookAuthenticationToken);
    logger.debug(`request: ${JSON.stringify(request)}`);
    const detailType = getDetailTypeFromRequest(request);
    const detail = getDetailFromRequest(request);
    const action = getActionFromRequest(request);

    try {
      const command = new SendMessageCommand({
        QueueUrl: contentfulPollerQueueUrl,
        MessageAttributes: {
          DetailType: {
            DataType: 'String',
            StringValue: detailType,
          },
          Action: {
            DataType: 'String',
            StringValue: action,
          },
        },
        MessageBody: JSON.stringify(detail),
      });
      await sqs.send(command);
      logger.debug(
        `Event added to queue ${contentfulPollerQueueUrl} detail Type: ${detailType} detail: ${JSON.stringify(
          detail,
        )}`,
      );

      return {
        statusCode: 200,
        body: 'Success',
      };
    } catch (err) {
      logger.error(
        `An error occurred putting onto the SQS ${contentfulPollerQueueUrl}`,
      );
      if (err instanceof Error) {
        logger.error(`The error message: ${err.message}`);
      }
      return {
        statusCode: 500,
        body: 'Failure',
      };
    }
  };
