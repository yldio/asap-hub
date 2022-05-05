/* istanbul ignore file */
import 'source-map-support/register';
import { Request as RequestExpress } from 'express';
import serverlessHttp from 'serverless-http';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { appFactory } from '../app';
import logger from '../utils/logger';

const app = appFactory({});

interface RequestWithContext extends RequestExpress {
  context: APIGatewayProxyEventV2['requestContext'];
}

const httpHandler = serverlessHttp(app, {
  request(
    request: RequestWithContext,
    event: APIGatewayProxyEventV2,
    context: { awsRequestId: string },
  ) {
    request.context = event.requestContext;
    logger.withRequest(event, context);
  },
});

export const apiHandler = httpHandler;
