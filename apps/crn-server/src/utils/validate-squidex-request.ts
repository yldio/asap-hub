import Boom from '@hapi/boom';
import crypto from 'crypto';
import { framework as lambda } from '@asap-hub/services-common';
import { squidexSharedSecret } from '../config';

export const signPayload = (payload: lambda.Request['payload']): string =>
  crypto
    .createHash('SHA256')
    .update(Buffer.from(JSON.stringify(payload) + squidexSharedSecret, 'utf8'))
    .digest('base64');

export default function validateRequest(request: lambda.Request): boolean {
  const headers = request.headers as {
    'x-signature': string;
  };
  const signature = headers['x-signature'];

  if (!signature) {
    throw Boom.unauthorized();
  }

  const computedSignature = signPayload(request.payload);

  if (signature !== computedSignature) {
    throw Boom.forbidden();
  }

  return true;
}
