import { framework as lambda } from '@asap-hub/services-common';
import Boom from '@hapi/boom';

export function validateAuth0Request(
  request: lambda.Request,
  auth0SharedSecret: string,
): boolean {
  const headers = request.headers as {
    authorization: string;
  };

  if (!headers.authorization) {
    throw Boom.unauthorized();
  }

  const [type, secret] = headers.authorization.split(' ');

  if (type?.toLowerCase() !== 'basic') {
    throw Boom.unauthorized();
  }

  if (secret !== auth0SharedSecret) {
    throw Boom.forbidden('basic');
  }

  return true;
}
