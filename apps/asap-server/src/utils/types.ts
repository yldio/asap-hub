import type { APIGatewayProxyHandlerV2, Context } from 'aws-lambda';

export type Handler = APIGatewayProxyHandlerV2 &
  ((
    event: Parameters<APIGatewayProxyHandlerV2>[0],
    context?: Context,
  ) => ReturnType<APIGatewayProxyHandlerV2>);
