export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      context: APIGatewayProxyEventV2['requestContext'];
      span?: Span;
    }

    interface Response {
      log?: Logger;
    }
  }
}
