import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export type Handler = APIGatewayProxyHandlerV2 &
  ((
    // complaining about `event` here is a lint rule bug
    // eslint-disable-next-line no-unused-vars
    event: Parameters<APIGatewayProxyHandlerV2>[0],
  ) => ReturnType<APIGatewayProxyHandlerV2>);
