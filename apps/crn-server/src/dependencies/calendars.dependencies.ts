import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import { CalendarDataProvider } from '@asap-hub/model';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { CalendarContentfulDataProvider } from '../data-providers/contentful/calendar.data-provider';
import { getContentfulRestClientFactory } from './clients.dependencies';

export const getCalendarDataProvider = (): CalendarDataProvider => {
  const contentfulGraphQLClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

  return new CalendarContentfulDataProvider(
    contentfulGraphQLClient,
    getContentfulRestClientFactory,
  );
};
