import Boom from '@hapi/boom';
import Intercept from 'apr-intercept';
import { User } from '@asap-hub/auth';
import { framework as lambda } from '@asap-hub/services-common';
import { origin } from '../config';

import decodeToken from './validate-token';

export default async function validateUser(
  request: lambda.Request,
): Promise<User> {
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

  return payload[`${origin}/user`] as User;
}
