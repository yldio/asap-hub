import Boom from '@hapi/boom';
import got from 'got';
import Intercept from 'apr-intercept';
import { config as authConfig } from '@asap-hub/auth';
import { framework as lambda } from '@asap-hub/services-common';

import * as auth0 from '../entities/auth0';

export default async function validateUser(
  request: lambda.Request,
): Promise<auth0.UserInfo> {
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

  const [err, res] = await Intercept(
    got(`https://${authConfig.domain}/userinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }).json<auth0.UserInfo>(),
  );

  if (err) {
    throw Boom.boomify(err, {statusCode: err.response.statusCode})
  } 

  return res;
}
