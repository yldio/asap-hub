import {
  authorizeWithSsoFactory,
  authorizeWithEmailPasswordFactory,
  sendPasswordResetLinkFactory,
} from '@asap-hub/auth-frontend-utils';
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '../config';

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
