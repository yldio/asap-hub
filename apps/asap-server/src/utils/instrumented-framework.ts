/* istanbul ignore file */
import * as opentracing from 'opentracing';
import lightstep from 'lightstep-tracer';
import { PinoLambdaLogger } from 'pino-lambda';
import { promisify } from 'util';
import {
  APIGatewayProxyStructuredResultV2,
  APIGatewayProxyResultV2,
  APIGatewayProxyEventV2,
  Context,
} from 'aws-lambda';
import { framework as lambda } from '@asap-hub/services-common';

import { lightstepToken, environment } from '../config';

const { NODE_ENV = 'production' } = process.env;

interface LightstepTracer extends opentracing.Tracer {
  flush(): Promise<void>;
}

let LsTracer: LightstepTracer;

if (lightstepToken && NODE_ENV !== 'test') {
  LsTracer = new lightstep.Tracer({
    access_token: lightstepToken,
    component_name: `asap-hub-${environment}`,
  }) as LightstepTracer;
  opentracing.initGlobalTracer(LsTracer);
}

export const http =
  <T = unknown>(
    fn: (request: lambda.Request<T>) => Promise<lambda.Response>,
    logger?: PinoLambdaLogger,
  ) =>
  async (
    event: APIGatewayProxyEventV2,
    context?: Context,
  ): Promise<APIGatewayProxyResultV2> => {
    if (logger && 'withRequest' in logger) {
      logger.withRequest(event, context || { awsRequestId: 'none' });
    }
    if (!context) {
      return lambda.http(fn)(event);
    }

    const span = opentracing
      .globalTracer()
      .startSpan(context.functionName.split('-').pop() || context.functionName);

    // Inject current context into request
    const headersCarrier = {};
    opentracing
      .globalTracer()
      .inject(span.context(), opentracing.FORMAT_HTTP_HEADERS, headersCarrier);

    // eslint-disable-next-line no-param-reassign
    event.headers = { ...event.headers, ...headersCarrier };

    const response = (await lambda.http(fn)(
      event,
    )) as APIGatewayProxyStructuredResultV2;

    if (response.statusCode && response.statusCode >= 400) {
      const { statusCode, body } = response;
      span.setTag(opentracing.Tags.ERROR, true);
      span.setTag('statusCode', statusCode);

      try {
        if (body) {
          span.log({ event: 'error', ...JSON.parse(body) });
        } else {
          span.log({ event: 'error', error: body });
        }
      } catch (e) {
        span.log({ event: 'error', error: body });
      }
    }

    span.finish();

    if (LsTracer?.flush) {
      const flushTracing = promisify(LsTracer.flush).bind(LsTracer);
      await flushTracing();
    }

    return response;
  };
