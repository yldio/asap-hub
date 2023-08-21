/* istanbul ignore file */

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import assert from 'assert';

import {
  createUrlFactory,
  getAccessTokenFactory,
  SquidexGraphql,
} from '@asap-hub/squidex';
import { getRateLimitedClient } from '@asap-hub/contentful';

export const isVerbose = () =>
  process.env.VERBOSE_DATA_SYNC && process.env.VERBOSE_DATA_SYNC === 'true';

export const upsertInPlace =
  (process.env.UPSERT_IN_PLACE && process.env.UPSERT_IN_PLACE === 'true') ||
  process.argv.includes('--upsert');

export const getContentfulClient = async () => {
  [
    'CONTENTFUL_MANAGEMENT_ACCESS_TOKEN',
    'CONTENTFUL_SPACE_ID',
    'CONTENTFUL_ENV_ID',
  ].forEach((env) => {
    assert.ok(process.env[env], `${env} not defined`);
  });

  const {
    CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
    CONTENTFUL_SPACE_ID,
    CONTENTFUL_ENV_ID,
  } = process.env;

  return getRateLimitedClient({
    accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!,
    space: CONTENTFUL_SPACE_ID!,
    environment: CONTENTFUL_ENV_ID!,
    rateLimit: 3, // req/s
  });
};

export const getSquidexClient = () => {
  [
    'CRN_SQUIDEX_APP_NAME',
    'CRN_SQUIDEX_CLIENT_ID',
    'CRN_SQUIDEX_CLIENT_SECRET',
    'SQUIDEX_BASE_URL',
  ].forEach((env) => {
    assert.ok(process.env[env], `${env} not defined`);
  });

  const {
    CRN_SQUIDEX_APP_NAME,
    CRN_SQUIDEX_CLIENT_ID,
    CRN_SQUIDEX_CLIENT_SECRET,
    SQUIDEX_BASE_URL,
  } = process.env;

  const getAuthToken = getAccessTokenFactory({
    clientId: CRN_SQUIDEX_CLIENT_ID!,
    clientSecret: CRN_SQUIDEX_CLIENT_SECRET!,
    baseUrl: SQUIDEX_BASE_URL!,
  });

  return new SquidexGraphql(getAuthToken, {
    appName: CRN_SQUIDEX_APP_NAME!,
    baseUrl: SQUIDEX_BASE_URL!,
  });
};

export const getSquidexAndContentfulClients = async () => {
  const contentfulEnvironment = await getContentfulClient();
  const squidexGraphqlClient = getSquidexClient();

  return { contentfulEnvironment, squidexGraphqlClient };
};

export const createAssetUrl = createUrlFactory({
  appName: process.env.CRN_SQUIDEX_APP_NAME!,
  baseUrl: process.env.SQUIDEX_BASE_URL!,
});
