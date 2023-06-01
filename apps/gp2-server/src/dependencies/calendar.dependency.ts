import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';
import { RestCalendar, SquidexGraphql, SquidexRest } from '@asap-hub/squidex';
import {
  appName,
  baseUrl,
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
  isContentfulEnabled,
} from '../config';
import { CalendarSquidexDataProvider } from '../data-providers/calendar.data-provider';
import { CalendarContentfulDataProvider } from '../data-providers/contentful/calendar.data-provider';
import { getAuthToken } from '../utils/auth';
import { getContentfulRestClientFactory } from './clients.dependency';

export const getCalendarDataProvider = (): gp2Model.CalendarDataProvider => {
  if (isContentfulEnabled) {
    const contentfulGraphQLClient = getContentfulGraphQLClient({
      space: contentfulSpaceId,
      accessToken: contentfulAccessToken,
      environment: contentfulEnvId,
    });

    return new CalendarContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );
  }

  const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
    appName,
    baseUrl,
  });
  const calendarRestClient = new SquidexRest<RestCalendar>(
    getAuthToken,
    'calendars',
    { appName, baseUrl },
  );

  return new CalendarSquidexDataProvider(
    calendarRestClient,
    squidexGraphqlClient,
  );
};
