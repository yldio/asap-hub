import { getGraphQLClient } from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { CalendarContentfulDataProvider } from '../data-providers/calendar.data-provider';
import { getContentfulRestClientFactory } from './clients.dependency';

export const getCalendarDataProvider = (): gp2Model.CalendarDataProvider => {
  const contentfulGraphQLClient = getGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

  return new CalendarContentfulDataProvider(
    contentfulGraphQLClient,
    getContentfulRestClientFactory,
  );
};
