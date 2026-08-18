/* istanbul ignore file */
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Request as RequestExpress } from 'express';
import serverlessHttp from 'serverless-http';
import { appFactory } from '../app';

const app = appFactory();

interface RequestWithContext extends RequestExpress {
  context: APIGatewayProxyEventV2['requestContext'];
}

export const apiHandler = serverlessHttp(app, {
  request(request: RequestWithContext, event: APIGatewayProxyEventV2) {
    request.context = event.requestContext;
  },
});
