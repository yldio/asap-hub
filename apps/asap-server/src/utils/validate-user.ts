import * as opentracing from 'opentracing';
import Boom from '@hapi/boom';
import Intercept from 'apr-intercept';
import { User } from '@asap-hub/auth';
import { framework as lambda } from '@asap-hub/services-common';
import { origin } from '../config';

import decodeToken from './validate-token';

export default async function validateUser(
  request: lambda.Request,
): Promise<User> {
  const tracer = opentracing.globalTracer();
  const tracingContext =
    tracer.extract(opentracing.FORMAT_HTTP_HEADERS, request.headers) ||
    undefined;
  const span = tracer.startSpan('authorization', { childOf: tracingContext });

  const headers = request.headers as {
    authorization: string;
  };

  if (!headers.authorization) {
    throw Boom.unauthorized();
  }

  const [type, token] = headers.authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    throw Boom.unauthorized();
  }

  const [err, payload] = await Intercept(decodeToken(token));

  if (err) {
    throw Boom.unauthorized();
  }

  const user = payload[`${origin}/user`] as User;

  if (user) {
    span.setTag('userId', user.id);
    span.log({ event: 'validated_user', ...user });
  }

  span.finish();
  return user;
}
