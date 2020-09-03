import Boom from '@hapi/boom';
import crypto from 'crypto';
import { framework as lambda } from '@asap-hub/services-common';
import { squidexSharedSecret } from '../config';

export default function validateRequest(request: lambda.Request): boolean {
  const headers = request.headers as {
    'X-Signature': string;
  };
  const signature = headers['X-Signature'];

  if (!signature) {
    throw Boom.unauthorized();
  }

  const computedSignature = crypto
    .createHash('SHA256')
    .update(
      new Buffer(JSON.stringify(request.payload) + squidexSharedSecret, 'utf8'),
    )
    .digest('base64');

  if (signature !== computedSignature) {
    throw Boom.forbidden();
  }

  return true;
}
