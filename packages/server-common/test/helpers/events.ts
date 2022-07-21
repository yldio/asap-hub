import { framework as lambda } from '@asap-hub/services-common';
import { WebhookPayload } from '@asap-hub/squidex';
import {
  APIGatewayProxyEventV2,
  Context,
  EventBridgeEvent,
  ScheduledEvent,
} from 'aws-lambda';
import { URLSearchParams } from 'url';

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export const getLambdaRequest = <T>(
  payload: WebhookPayload<T>,
  headers: Record<string, string>,
): lambda.Request<WebhookPayload<T>> => {
  return {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    method: 'post',
    payload,
  };
};

export const getApiGatewayEvent = (
  event: RecursivePartial<APIGatewayProxyEventV2> = {},
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

export const createEventBridgeScheduledEventMock = (): EventBridgeEvent<
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

export const createEventBridgeEventMock = <T, P extends string>(
  detail: T,
  detailType: P,
  id?: string,
): EventBridgeEvent<P, T> => ({
  id: id ?? 'test-id',
  version: '1',
  account: 'test-account',
  time: '3234234234',
  region: 'eu-west-1',
  resources: [],
  source: 'asap.user',
  'detail-type': detailType,
  detail,
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
