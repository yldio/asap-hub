/* istanbul ignore file */
import serverlessHttp from 'serverless-http';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Request as RequestExpress } from 'express';
import * as LightStep from 'lightstep-tracer';
import AWSXray from 'aws-xray-sdk';
import { appFactory } from '../app';
import { lightstepToken, environment } from '../config';
import logger from '../utils/logger';

const lsTracer = new LightStep.Tracer({
  access_token: lightstepToken || '',
  component_name: `asap-hub-express-${environment}`,
  nodejs_instrumentation: true,
});

const app = appFactory({
  tracer: lsTracer,
  xRay: AWSXray,
});

interface RequestWithContext extends RequestExpress {
  context: APIGatewayProxyEventV2['requestContext'];
}

export const apiHandler = serverlessHttp(app, {
  request(
    request: RequestWithContext,
    event: APIGatewayProxyEventV2,
    context: { awsRequestId: string },
  ) {
    request.context = event.requestContext;
    logger.withRequest(event, context);
  },
});
