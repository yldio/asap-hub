import { APIGatewayProxyEventV2 } from 'aws-lambda';

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
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
    rawQueryString: new URLSearchParams(
      event.queryStringParameters as Record<string, string>,
    ).toString(),
    ...event,
    body:
      typeof event.body === 'object'
        ? JSON.stringify(event.body || {})
        : event.body,
  } as APIGatewayProxyEventV2;
};
