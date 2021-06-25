/* istanbul ignore file */
import 'source-map-support/register';
import serverlessHttp from 'serverless-http';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Request as RequestExpress } from 'express';
import * as LightStep from 'lightstep-tracer';
import AWSXray from 'aws-xray-sdk';
import http from 'http';
import https from 'https';
import * as Sentry from '@sentry/serverless';
import { appFactory } from '../app';
import {
  lightstepToken,
  environment,
  currentRevision,
  sentryDsn,
} from '../config';
import logger from '../utils/logger';

const lsTracer = new LightStep.Tracer({
  access_token: lightstepToken || '',
  component_name: `asap-hub-express-${environment}`,
  nodejs_instrumentation: true,
});

AWSXray.captureHTTPsGlobal(http, true);
AWSXray.captureHTTPsGlobal(https, true);
AWSXray.capturePromise();

Sentry.AWSLambda.init({
  dsn: sentryDsn,
  tracesSampleRate: 1.0,
  environment,
  release: currentRevision,
});

const app = appFactory({
  tracer: lsTracer,
  xRay: AWSXray,
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
    logger.withRequest(event, context);
  },
});

export const apiHandler = Sentry.AWSLambda.wrapHandler(httpHandler);
