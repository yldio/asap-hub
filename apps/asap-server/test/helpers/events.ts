import {
  APIGatewayProxyEventV2,
  EventBridgeEvent,
  ScheduledEvent,
  Context,
} from 'aws-lambda';
import { URLSearchParams } from 'url';

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export const apiGatewayEvent = (
  event: RecursivePartial<APIGatewayProxyEventV2>,
): APIGatewayProxyEventV2 => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
      ...event.headers,
    },
    requestContext: {
      accountId: '12345',
      apiId: '12345',
      domainName: 'asap.science',
      domainPrefix: '',
      requestId: '12345',
      routeKey: '',
      stage: 'dev',
      time: '',
      timeEpoch: 123456,
      http: {
        method: 'GET',
        path: '/api',
        protocol: 'http',
        sourceIp: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
      },
    },
    version: '2.0',
    pathParameters: undefined,
    rawQueryString: new URLSearchParams(event.queryStringParameters).toString(),
    ...event,
    body:
      typeof event.body === 'object'
        ? JSON.stringify(event.body || {})
        : event.body,
  } as APIGatewayProxyEventV2;
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
