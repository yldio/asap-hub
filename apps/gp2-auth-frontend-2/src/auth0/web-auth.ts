import {
  authorizeWithSsoFactory,
  authorizeWithEmailPasswordFactory,
  sendPasswordResetLinkFactory,
} from '@asap-hub/auth-frontend-utils';

const AUTH0_DOMAIN = 'dev-asap-hub.us.auth0.com';
const AUTH0_CLIENT_ID = 'xRDvgZe3Ql3LSZDs2dWQYzcohFnLyeL2';

export const authorizeWithSso = authorizeWithSsoFactory(
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN,
);

export const authorizeWithEmailPassword = authorizeWithEmailPasswordFactory(
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN,
);

export const sendPasswordResetLink = sendPasswordResetLinkFactory(
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN,
);
