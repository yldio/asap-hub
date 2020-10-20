import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export type Handler = APIGatewayProxyHandlerV2 &
  ((
    event: Parameters<APIGatewayProxyHandlerV2>[0],
  ) => ReturnType<APIGatewayProxyHandlerV2>);
