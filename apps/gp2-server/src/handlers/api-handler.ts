/* istanbul ignore file */
import 'source-map-support/register';
import { Request as RequestExpress } from 'express';
import serverlessHttp from 'serverless-http';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { withRequest } from '@asap-hub/server-common';
import { appFactory } from '../app';
import { sentryWrapper } from '../utils/sentry-wrapper';

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
    withRequest(event, context);
  },
});

/* istanbul ignore next */
export const apiHandler = sentryWrapper(httpHandler);
