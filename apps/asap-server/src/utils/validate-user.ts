import Boom from '@hapi/boom';
import { decodeToken, Auth0User } from '@asap-hub/auth';
import { framework as lambda } from '@asap-hub/services-common';

export default async function validateUser(
  request: lambda.Request,
): Promise<Auth0User> {
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

  return decodeToken(token).catch(() => {
    throw Boom.unauthorized();
  });
}
