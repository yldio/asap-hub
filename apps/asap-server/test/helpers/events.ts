import {
  EventBridgeEvent,
  ScheduledEvent,
  Context,
  APIGatewayProxyEvent,
} from 'aws-lambda';

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export const apiGatewayEvent = (
  event: RecursivePartial<APIGatewayProxyEvent>,
): APIGatewayProxyEvent => {
  return {
    httpMethod: 'GET',
    isBase64Encoded: false,
    path: 'some-path/',
    multiValueHeaders: {},
    pathParameters: null,
    queryStringParameters: {},
    multiValueQueryStringParameters: {},
    stageVariables: {},
    resource: 'resource',
    body:
      typeof event.body === 'object'
        ? JSON.stringify(event.body || {})
        : event.body || null,
    ...(event as any),
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
      ...event.headers,
    },
    requestContext: {
      authorizer: null,
      protocol: 'http',
      httpMethod: 'GET',
      identity: {} as any,
      path: 'some-path/',
      requestTimeEpoch: 912839128,
      resourceId: 'resourceId',
      resourcePath: 'resource-path',
      accountId: '12345',
      apiId: '12345',
      domainName: 'asap.science',
      domainPrefix: '',
      requestId: '12345',
      routeKey: '',
      stage: 'dev',
      ...event.requestContext,
    },
  };
};

export const createEventBridgeEventMock = (): EventBridgeEvent<
  'Scheduled Event',
  ScheduledEvent
> => ({
  id: 'some-id',
  version: 'some-version',
  account: 'some-account',
  time: 'some-time',
  region: 'eu-west-1',
  resources: [],
  source: 'some-source',
  'detail-type': 'Scheduled Event',
  detail: {} as any,
});

export const createHandlerContext = () =>
  ({
    callbackWaitsForEmptyEventLoop: false,
    functionName: 'function-name',
    functionVersion: 'function-version',
    invokedFunctionArn: 'invoked-function-arn',
    memoryLimitInMB: '1024MB',
    awsRequestId: 'aws-request-id',
    logGroupName: 'some-log-group',
    logStreamName: 'some-log-stream',
  } as Context);
