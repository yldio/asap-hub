import * as Sentry from '@sentry/serverless';
import { getContentfulGraphQLClientFactory } from '../src/dependencies/clients.dependency';

import {
  AlertsSentry,
  calendarCreatedContentfulHandlerFactory,
  getJWTCredentialsFactory,
  subscribeToEventChangesFactory,
  unsubscribeFromEventChangesFactory,
} from '@asap-hub/server-common';
import {
  asapApiUrl,
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
  googleApiCredentialsSecretId,
  googleApiToken,
  region,
} from '../src/config';
import { getCalendarDataProvider } from '../src/dependencies/calendar.dependency';
import logger from '../src/utils/logger';

const getJWTCredentials = getJWTCredentialsFactory({
  googleApiCredentialsSecretId,
  region,
});
const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
const main = async () => {
  console.log(asapApiUrl);
  console.log(googleApiToken);
  const subscribeCalendar = calendarCreatedContentfulHandlerFactory(
    subscribeToEventChangesFactory(getJWTCredentials, logger, {
      asapApiUrl,
      googleApiToken,
    }),
    unsubscribeFromEventChangesFactory(getJWTCredentials, logger),
    getCalendarDataProvider(contentfulGraphQLClient),
    new AlertsSentry(Sentry.captureException.bind(Sentry)),
    logger,
    {
      environment: contentfulEnvId,
      space: contentfulSpaceId,
      accessToken: contentfulAccessToken,
    },
  );
  await subscribeCalendar({
    id: '6939e13f-365b-217a-57d9-c55fcbc5a318',
    version: '0',
    account: '249832953260',
    time: '3234234234',
    region: 'eu-west-1',
    resources: [],
    source: 'gp2.contentful',
    'detail-type': 'CalendarsPublished',
    detail: {
      resourceId: '5bVGLZpEzQHQ0mPVeBe86x',
      metadata: {
        tags: [],
      },
      sys: {
        type: 'Entry',
        id: '5bVGLZpEzQHQ0mPVeBe86x',
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: '6ekgyp1432o9',
          },
        },
        environment: {
          sys: {
            id: 'gp2-3904',
            type: 'Link',
            linkType: 'Environment',
          },
        },
        contentType: {
          sys: {
            type: 'Link',
            linkType: 'ContentType',
            id: 'calendars',
          },
        },
        createdBy: {
          sys: {
            type: 'Link',
            linkType: 'User',
            id: '5rM9ZCnK3jnYzXtk0FOGSP',
          },
        },
        updatedBy: {
          sys: {
            type: 'Link',
            linkType: 'User',
            id: '5rM9ZCnK3jnYzXtk0FOGSP',
          },
        },
        revision: 42,
        createdAt: '2023-04-10T10:33:27.249Z',
        updatedAt: '2023-04-10T10:33:27.249Z',
      },
      fields: {
        name: {
          'en-US': 'Mark Test',
        },
        googleCalendarId: {
          'en-US':
            'c_c25d607083a313d0346f4df3ce322d0fd9bc39f41370b3c21bf08fb206f6637f@group.calendar.google.com',
        },
        color: {
          'en-US': '#BE6D00',
        },
      },
    },
  });
  console.log('done');
};

main().catch(console.error);
