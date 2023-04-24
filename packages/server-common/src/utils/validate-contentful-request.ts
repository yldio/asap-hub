import { framework as lambda } from '@asap-hub/services-common';
import Boom from '@hapi/boom';

export function validateContentfulRequest(
  request: lambda.Request,
  authenticationToken: string,
): boolean {
  const { authorization } = request.headers;

  if (!authorization) {
    throw Boom.unauthorized();
  }

  if (authorization !== authenticationToken) {
    throw Boom.forbidden();
  }

  return true;
}
