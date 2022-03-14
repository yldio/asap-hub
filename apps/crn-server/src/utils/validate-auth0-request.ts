import Boom from '@hapi/boom';
import { framework as lambda } from '@asap-hub/services-common';
import { auth0SharedSecret } from '../config';

export default function validateRequest(request: lambda.Request): boolean {
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
