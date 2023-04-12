/* istanbul ignore file */

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import assert from 'assert';
import {
  createClient,
  RestAdapter,
  MakeRequestOptions,
} from 'contentful-management';

import {
  createUrlFactory,
  getAccessTokenFactory,
  SquidexGraphql,
} from '@asap-hub/squidex';
import { rateLimiter } from './rate-limiter';

export const isVerbose = () =>
  process.env.VERBOSE_DATA_SYNC && process.env.VERBOSE_DATA_SYNC === 'true';

class ApiAdapter extends RestAdapter {
  async makeRequest<R>(options: MakeRequestOptions): Promise<R> {
    await rateLimiter.removeTokens(1);
    return super.makeRequest(options);
  }
}

export const getSquidexAndContentfulClients = async () => {
  [
    'CONTENTFUL_MANAGEMENT_ACCESS_TOKEN',
    'CONTENTFUL_SPACE_ID',
    'CONTENTFUL_ENV_ID',
    'CRN_SQUIDEX_APP_NAME',
    'CRN_SQUIDEX_CLIENT_ID',
    'CRN_SQUIDEX_CLIENT_SECRET',
    'SQUIDEX_BASE_URL',
  ].forEach((env) => {
    assert.ok(process.env[env], `${env} not defined`);
  });

  const {
    CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
    CONTENTFUL_SPACE_ID,
    CONTENTFUL_ENV_ID,
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

  const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
    appName: CRN_SQUIDEX_APP_NAME!,
    baseUrl: SQUIDEX_BASE_URL!,
  });

  const contentfulClient = createClient({
    apiAdapter: new ApiAdapter({
      accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!,
    }),
  });

  const contentfulSpace = await contentfulClient.getSpace(CONTENTFUL_SPACE_ID!);
  const contentfulEnvironment = await contentfulSpace.getEnvironment(
    CONTENTFUL_ENV_ID!,
  );

  return { contentfulEnvironment, squidexGraphqlClient };
};

export const createAssetUrl = createUrlFactory({
  appName: process.env.CRN_SQUIDEX_APP_NAME!,
  baseUrl: process.env.SQUIDEX_BASE_URL!,
});
