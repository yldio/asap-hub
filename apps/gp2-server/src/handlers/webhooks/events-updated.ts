/* istanbul ignore file */
import { RateLimiter } from 'limiter';
import { Handler } from 'aws-lambda';
import {
  getRestClient,
  GraphQLClient,
  MakeRequestOptions,
  RestAdapter,
} from '@asap-hub/contentful';
import {
  getJWTCredentialsFactory,
  syncCalendarFactory,
  syncEventFactory,
  webhookEventUpdatedHandlerFactory,
} from '@asap-hub/server-common';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulManagementAccessToken,
  contentfulSpaceId,
  googleApiCredentialsSecretId,
  googleApiToken,
  region,
} from '../../config';
import Events from '../../controllers/event.controller';
import { EventContentfulDataProvider } from '../../data-providers/event.data-provider';
import { getCalendarDataProvider } from '../../dependencies/calendar.dependency';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const getJWTCredentials = getJWTCredentialsFactory({
  googleApiCredentialsSecretId,
  region,
});

const contentfulManagementApiRateLimiter = new RateLimiter({
  tokensPerInterval: 3,
  interval: 'second',
});

const contentDeliveryApiRateLimiter = new RateLimiter({
  tokensPerInterval: 15,
  interval: 'second',
});

class RateLimitedRestAdapter extends RestAdapter {
  async makeRequest<R>(options: MakeRequestOptions): Promise<R> {
    await contentfulManagementApiRateLimiter.removeTokens(1);
    return super.makeRequest(options);
  }
}

class RateLimitedGraphqlClient extends GraphQLClient {
  request = (async (
    ...args: Parameters<GraphQLClient['request']>
  ): Promise<ReturnType<GraphQLClient['request']>> => {
    await contentDeliveryApiRateLimiter.removeTokens(1);
    return super.request(...args);
  }) as GraphQLClient['request'];
}

const contentfulGraphQLClient = new RateLimitedGraphqlClient(
  `https://graphql.contentful.com/content/v1/spaces/${contentfulSpaceId}/environments/${contentfulEnvId}`,
  {
    errorPolicy: 'ignore',
    headers: {
      authorization: `Bearer ${contentfulAccessToken}`,
    },
  },
);

const contentfulRestClient = getRestClient({
  space: contentfulSpaceId,
  accessToken: contentfulManagementAccessToken,
  environment: contentfulEnvId,
  apiAdapter: new RateLimitedRestAdapter({
    accessToken: contentfulManagementAccessToken,
  }),
});

const eventDataProvider = new EventContentfulDataProvider(
  contentfulGraphQLClient,
  () => contentfulRestClient,
);

const eventController = new Events(eventDataProvider);
const syncCalendar = syncCalendarFactory(
  syncEventFactory(eventController, logger),
  getJWTCredentials,
  logger,
);

export const handler: Handler = sentryWrapper(
  webhookEventUpdatedHandlerFactory(
    getCalendarDataProvider(
      contentfulGraphQLClient,
      () => contentfulRestClient,
    ),
    syncCalendar,
    logger,
    { googleApiToken },
  ),
);
