import { keys as crnProdPubKeys } from './crn-auth0-pubkeys.prod.json';
import { keys as crnDevPubKeys } from './crn-auth0-pubkeys.dev.json';
import { keys as crnPrPubKeys } from './crn-auth0-pubkeys.pr.json';
import { keys as gp2ProdPubKeys } from './gp2-auth0-pubkeys.prod.json';
import { keys as gp2DevPubKeys } from './gp2-auth0-pubkeys.dev.json';
import { keys as gp2PrPubKeys } from './gp2-auth0-pubkeys.pr.json';

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
  ...crnPrPubKeys,
  ...gp2ProdPubKeys,
  ...gp2DevPubKeys,
  ...gp2PrPubKeys,
];

export default keys;
