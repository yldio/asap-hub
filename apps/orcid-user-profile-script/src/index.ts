import { decode } from 'jsonwebtoken';
import type { Auth0User } from '@asap-hub/auth';

interface UserProfileFetcherContext<IDT> {
  id_token: IDT;
}

type UserProfileFetcher<
  AT = Record<string, never>,
  IDT extends string | undefined = undefined,
> = (
  accessToken: AT,
  ctx: UserProfileFetcherContext<IDT>,
  cb: (err: Error | null | undefined, profile: Auth0User) => void,
) => void;

// inspected the ID token we get from ORCID to write this interface
export interface OrcidIdToken {
  at_hash: string;
  aud: string;
  sub: string;
  auth_time: number;
  iss: string;
  exp: number;
  given_name: string;
  iat: number;
  family_name: string;
  jti: string;
}

const fetchOrcidUserProfile: UserProfileFetcher<
  Record<string, never>,
  string
> = (accessToken, { id_token }, cb) => {
  const idToken = decode(id_token) as OrcidIdToken;
  const profile: Auth0User = {
    user_id: idToken.sub,
    sub: idToken.sub,
    given_name: idToken.given_name,
    family_name: idToken.family_name,
    name: `${idToken.given_name} ${idToken.family_name}`,
    orcid: idToken.sub,
    aud: idToken.aud,
  };
  cb(null, profile);
};
export default fetchOrcidUserProfile;
