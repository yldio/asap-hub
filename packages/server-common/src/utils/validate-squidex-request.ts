import { framework as lambda } from '@asap-hub/services-common';
import Boom from '@hapi/boom';
import crypto from 'crypto';

export const signPayload = (
  payload: lambda.Request['payload'],
  squidexSharedSecret: string,
): string =>
  crypto
    .createHash('SHA256')
    .update(Buffer.from(payload + squidexSharedSecret, 'utf8'))
    .digest('base64');

export function validateSquidexRequest(
  request: lambda.Request,
  squidexSharedSecret: string,
): boolean {
  const headers = request.headers as {
    'x-signature': string;
  };
  const signature = headers['x-signature'];

  if (!signature) {
    throw Boom.unauthorized();
  }

  const computedSignature = signPayload(
    request.rawPayload,
    squidexSharedSecret,
  );

  if (signature !== computedSignature) {
    throw Boom.forbidden();
  }

  return true;
}
