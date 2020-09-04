import Boom from '@hapi/boom';
import crypto from 'crypto';
import { framework as lambda } from '@asap-hub/services-common';
import { squidexSharedSecret } from '../config';

export default function validateRequest(request: lambda.Request): boolean {
  const headers = request.headers as {
    'x-signature': string;
  };
  const signature = headers['x-signature'];

  if (!signature) {
    throw Boom.unauthorized();
  }

  const computedSignature = crypto
    .createHash('SHA256')
    .update(
      Buffer.from(JSON.stringify(request.payload) + squidexSharedSecret, 'utf8'),
    )
    .digest('base64');

  if (signature !== computedSignature) {
    throw Boom.forbidden();
  }

  return true;
}
