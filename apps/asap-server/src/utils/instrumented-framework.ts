/* istanbul ignore file */
/* eslint-disable @typescript-eslint/camelcase */

import * as opentracing from 'opentracing';
import lightstep from 'lightstep-tracer';
import { promisify } from 'util';
import {
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

export const http = (
  fn: (request: lambda.Request) => Promise<lambda.Response>,
) => async (
  event: APIGatewayProxyEventV2,
  context?: Context,
): Promise<APIGatewayProxyResultV2> => {
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

  const response = await lambda.http(fn)(event);

  span.finish();

  const flushTracing = promisify(LsTracer.flush).bind(LsTracer);
  await flushTracing();

  return response;
};
