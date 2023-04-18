/* istanbul ignore file */
import { withRequest } from '@asap-hub/server-common';
import * as Sentry from '@sentry/serverless';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Request as RequestExpress } from 'express';
import serverlessHttp from 'serverless-http';
import 'source-map-support/register';
import { appFactory } from '../app';
import { sentryWrapper } from '../utils/sentry-wrapper';

const app = appFactory({
  sentryErrorHandler: Sentry.Handlers.errorHandler,
  sentryRequestHandler: Sentry.Handlers.requestHandler,
});

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
