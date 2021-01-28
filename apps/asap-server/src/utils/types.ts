import type { APIGatewayProxyHandlerV2, Context } from 'aws-lambda';

export type Handler = APIGatewayProxyHandlerV2 &
  ((
    event: Parameters<APIGatewayProxyHandlerV2>[0],
    context?: Context,
  ) => ReturnType<APIGatewayProxyHandlerV2>);

export type FetchOptions = {
  take?: number;
  skip?: number;
  search?: string;
  filter?: string;
};
