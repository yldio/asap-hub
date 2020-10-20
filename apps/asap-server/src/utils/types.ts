import type { APIGatewayProxyHandler } from 'aws-lambda';

export type Handler = APIGatewayProxyHandler &
  ((
    event: Parameters<APIGatewayProxyHandler>[0],
  ) => ReturnType<APIGatewayProxyHandler>);
