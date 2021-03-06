import pify from 'pify';
import { WebAuth } from 'auth0-js';
import camelCase from 'camelcase';
import { config } from '@asap-hub/auth';

const getOptionsFromLocation = (location: Location | URL) =>
  Object.fromEntries(
    [...new URLSearchParams(location.search).entries()].map(([key, value]) => [
      camelCase(key),
      value,
    ]),
  );

const webAuth = new WebAuth(config);

type SsoConnection = 'google-oauth2' | 'ORCID';
export const authorizeWithSso = (
  location: Location | URL,
  connection: SsoConnection,
): void =>
  webAuth.authorize({
    ...getOptionsFromLocation(location),
    connection,
  });

export const authorizeWithEmailPassword = async (
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

export const sendPasswordResetLink = async (email: string): Promise<void> => {
  await pify(webAuth.changePassword.bind(webAuth))({
    email,
    connection: 'Username-Password-Authentication',
  });
};
