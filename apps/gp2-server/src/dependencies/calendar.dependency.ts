import { GraphQLClient } from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';
import { CalendarContentfulDataProvider } from '../data-providers/calendar.data-provider';
import { getContentfulRestClientFactory } from './clients.dependency';

export const getCalendarDataProvider = (
  contentfulGraphQLClient: GraphQLClient,
): gp2Model.CalendarDataProvider =>
  new CalendarContentfulDataProvider(
    contentfulGraphQLClient,
    getContentfulRestClientFactory,
  );
