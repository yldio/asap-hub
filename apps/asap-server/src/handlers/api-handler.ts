/* istanbul ignore file */
import serverlessHttp from 'serverless-http';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
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

AWSXray.captureHTTPsGlobal(require('http'), true);
AWSXray.captureHTTPsGlobal(require('https'), true);
AWSXray.capturePromise();

const app = appFactory({
  tracer: lsTracer,
  xRay: AWSXray,
});

interface RequestWithContext extends RequestExpress {
  context: Context;
}

export const apiHandler = serverlessHttp(app, {
  request(
    request: RequestWithContext,
    event: APIGatewayProxyEvent,
    context: Context,
  ) {
    logger.debug({ event }, 'Event');
    logger.debug({ context }, 'Context');
    const segment = AWSXray.getSegment();
    logger.debug({ segment }, 'Segment');

    if (segment) {
      const subsegment = segment?.addNewSubsegment('some subsegment');
      subsegment.addAnnotation('some-key', 'some-val');
      logger.debug('doing something');
      subsegment.close();
    }

    logger.debug({ segment }, 'Segment');

    request.context = context;
    logger.withRequest(event, context);
  },
});
