/* istanbul ignore file */
import { RateLimiter } from 'limiter';
import { Handler } from 'aws-lambda';
import {
  getRestClient,
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
import { getContentfulGraphQLClientFactory } from '../../dependencies/clients.dependency';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const getJWTCredentials = getJWTCredentialsFactory({
  googleApiCredentialsSecretId,
  region,
});

export const rateLimiter = new RateLimiter({
  tokensPerInterval: 3,
  interval: 'second',
});

class ApiAdapter extends RestAdapter {
  async makeRequest<R>(options: MakeRequestOptions): Promise<R> {
    await rateLimiter.removeTokens(1);
    return super.makeRequest(options);
  }
}

const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
const contentfulRestClient = getRestClient({
  space: contentfulSpaceId,
  accessToken: contentfulManagementAccessToken,
  environment: contentfulEnvId,
  apiAdapter: new ApiAdapter({
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
    getCalendarDataProvider(contentfulGraphQLClient),
    syncCalendar,
    logger,
    { googleApiToken },
  ),
);
