import pify from 'pify';
import { WebAuth } from 'auth0-js';
import camelCase from 'camelcase';

const getOptionsFromLocation = (location: Location | URL) =>
  Object.fromEntries(
    [...new URLSearchParams(location.search).entries()].map(([key, value]) => [
      camelCase(key),
      value,
    ]),
  );

type SsoConnection = 'google-oauth2' | 'ORCID';

export const authorizeWithSsoFactory = (
  clientID: string,
  domain: string,
): ((location: Location | URL, connection: SsoConnection) => void) => {
  const webAuth = new WebAuth({ clientID, domain });
  return (location: Location | URL, connection: SsoConnection): void =>
    webAuth.authorize({
      ...getOptionsFromLocation(location),
      connection,
    });
};

export const authorizeWithEmailPasswordFactory = (
  clientID: string,
  domain: string,
): ((
  location: Location | URL,
  email: string,
  password: string,
  signup: boolean,
<<<<<<< HEAD:packages/auth-frontend-utils/src/web-auth.ts
) => Promise<void>) => {
=======
) => void) => {
>>>>>>> 0fb2473a (moving auth funtions to frontend utils):packages/frontend-utils/src/auth-util/web-auth.ts
  const webAuth = new WebAuth({ clientID, domain });
  return async (
    location: Location | URL,
    email: string,
    password: string,
    signup: boolean,
  ): Promise<void> => {
    if (signup) {
      await pify(webAuth.signup.bind(webAuth))({
        email,
        password,
        connection: 'Username-Password-Authentication',
      });
    }

    await pify(webAuth.login.bind(webAuth))({
      ...getOptionsFromLocation(location),
      realm: 'Username-Password-Authentication',
      email,
      password,
    });
  };
};

export const sendPasswordResetLinkFactory = (
  clientID: string,
  domain: string,
): ((email: string) => Promise<void>) => {
  const webAuth = new WebAuth({ clientID, domain });
  return async (email: string): Promise<void> => {
    await pify(webAuth.changePassword.bind(webAuth))({
      email,
      connection: 'Username-Password-Authentication',
    });
  };
};
