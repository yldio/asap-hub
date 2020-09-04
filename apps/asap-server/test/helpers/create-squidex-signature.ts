import crypto from 'crypto';
import { squidexSharedSecret } from '../../src/config';

export default function createSquidexSignature(payload: object): string {
  return crypto
  .createHash('SHA256')
  .update(
    Buffer.from(JSON.stringify(request.payload) + squidexSharedSecret, 'utf8'),
  )
  .digest('base64');
}
