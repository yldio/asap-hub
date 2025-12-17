import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';

import { Logger } from '../../utils';

/**
 * Creates a DynamoDB client configured for local development or AWS.
 * Uses local DynamoDB if LOCAL_DYNAMODB_ENDPOINT is set, or if we're in local/dev environment.
 */
export const createDynamoDBClient = (logger: Logger): DynamoDBClient => {
  /* istanbul ignore next */
  const isLocalEnv =
    process.env.ENVIRONMENT === 'local' ||
    process.env.NODE_ENV === 'development' ||
    process.env.SLS_STAGE === 'local';
  /* istanbul ignore next */
  const localEndpoint =
    process.env.LOCAL_DYNAMODB_ENDPOINT ||
    (isLocalEnv ? 'http://localhost:8000' : undefined);

  /* istanbul ignore next */
  const dynamoDbConfig: DynamoDBClientConfig = localEndpoint
    ? {
        endpoint: localEndpoint,
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: {
          accessKeyId: 'local',
          secretAccessKey: 'local',
        },
      }
    : {};

  logger.info(
    `DynamoDB config: ${JSON.stringify({
      endpoint: dynamoDbConfig.endpoint || 'default AWS endpoint',
      region: dynamoDbConfig.region || 'default',
      hasLocalEndpoint: !!localEndpoint,
      isLocalEnv,
    })}`,
  );

  return new DynamoDBClient(dynamoDbConfig);
};
