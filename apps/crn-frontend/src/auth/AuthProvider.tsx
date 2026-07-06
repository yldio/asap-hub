import { Auth0ContextCRN } from '@asap-hub/react-context';
import { createAuthProvider } from '@asap-hub/react-context/src/createAuthProvider';

import { AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '../config';

/* istanbul ignore file */
export default createAuthProvider({
  context: Auth0ContextCRN,
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  audience: AUTH0_AUDIENCE,
});
