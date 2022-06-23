import {
  authorizeWithSsoFactory,
  authorizeWithEmailPasswordFactory,
  sendPasswordResetLinkFactory,
} from '@asap-hub/auth';
import { WebAuth } from 'auth0-js';
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '../config';

const webAuth = new WebAuth({
  clientID: AUTH0_CLIENT_ID,
  domain: AUTH0_DOMAIN,
});

export const authorizeWithSso = authorizeWithSsoFactory(webAuth);

export const authorizeWithEmailPassword =
  authorizeWithEmailPasswordFactory(webAuth);

export const sendPasswordResetLink = sendPasswordResetLinkFactory(webAuth);
