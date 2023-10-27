import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import { WebhookDetail, WebhookDetailType } from '@asap-hub/model';
import { framework as lambda } from '@asap-hub/services-common';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
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
  contentfulPollerQueueUrl: string;
};

export const contentfulHandlerFactory =
  (
    webhookAuthenticationToken: string,
    sqs: SQSClient,
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

    try {
      const command = new SendMessageCommand({
        QueueUrl: config.contentfulPollerQueueUrl,
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
        `Event added to queue ${
          config.contentfulPollerQueueUrl
        } detail Type: ${detailType} detail: ${JSON.stringify(detail)}`,
      );

      return {
        statusCode: 200,
      };
    } catch (err) {
      logger.error(
        `An error occurred putting onto the SQS ${config.contentfulPollerQueueUrl}`,
      );
      if (err instanceof Error) {
        logger.error(`The error message: ${err.message}`);
      }
      return {
        statusCode: 500,
      };
    }
  };
