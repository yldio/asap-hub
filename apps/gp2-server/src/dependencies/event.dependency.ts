import { GraphQLClient } from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';
import { EventContentfulDataProvider } from '../data-providers/event.data-provider';
import {
  getContentfulGraphQLClientFactory,
  getContentfulRestClientFactory,
} from './clients.dependency';

export const getEventDataProvider = (
  contentfulGraphQLClient: GraphQLClient = getContentfulGraphQLClientFactory(),
): gp2Model.EventDataProvider =>
  new EventContentfulDataProvider(
    contentfulGraphQLClient,
    getContentfulRestClientFactory,
  );
