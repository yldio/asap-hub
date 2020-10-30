import { keys as prodPubKeys } from './auth0-pubkeys.prod.json';
import { keys as devPubKeys } from './auth0-pubkeys.dev.json';

interface JWK {
  alg: string;
  kty: string;
  use: string;
  n: string;
  e: string;
  kid: string;
  x5t: string;
  x5c: string[];
}

const keys: JWK[] = [...prodPubKeys, ...devPubKeys];

export default keys;
