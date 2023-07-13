import { GraphQLClient } from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';
import { CalendarContentfulDataProvider } from '../data-providers/calendar.data-provider';
import {
  getContentfulGraphQLClientFactory,
  getContentfulRestClientFactory,
} from './clients.dependency';

export const getCalendarDataProvider = (
  contentfulGraphQLClient: GraphQLClient = getContentfulGraphQLClientFactory(),
): gp2Model.CalendarDataProvider =>
  new CalendarContentfulDataProvider(
    contentfulGraphQLClient,
    getContentfulRestClientFactory,
  );
