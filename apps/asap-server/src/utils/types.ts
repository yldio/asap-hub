import type { APIGatewayProxyHandlerV2, Context } from 'aws-lambda';

export type Handler = APIGatewayProxyHandlerV2 &
  ((
    event: Parameters<APIGatewayProxyHandlerV2>[0],
    context?: Context,
  ) => ReturnType<APIGatewayProxyHandlerV2>);

export type FetchPaginationOptions = {
  take?: number;
  skip?: number;
};

export type FetchOptions = {
  search?: string;
  filter?: string[];
} & FetchPaginationOptions;

export type AllOrNone<T> = T | { [K in keyof T]?: never };
