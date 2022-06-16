import { keys as crnProdPubKeys } from './crn-auth0-pubkeys.prod.json';
import { keys as crnDevPubKeys } from './crn-auth0-pubkeys.dev.json';
import { keys as gp2ProdPubKeys } from './gp2-auth0-pubkeys.prod.json';
import { keys as gp2DevPubKeys } from './gp2-auth0-pubkeys.dev.json';

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

const keys: JWK[] = [
  ...crnProdPubKeys,
  ...crnDevPubKeys,
  ...gp2ProdPubKeys,
  ...gp2DevPubKeys,
];

export default keys;
