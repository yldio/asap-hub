import {
  ImpactDataObject,
  ImpactResponse,
  ListImpactDataObject,
  ListImpactsResponse,
} from '@asap-hub/model';
import { FetchImpactsQuery } from '@asap-hub/contentful';

export const getImpactDataObject = (): ImpactDataObject => ({
  name: 'Impact 1',
  id: '1',
});

export const getListImpactDataObject = (): ListImpactDataObject => ({
  total: 1,
  items: [getImpactDataObject()],
});

export const getImpactResponse = (): ImpactResponse => getImpactDataObject();

export const getListImpactsResponse = (): ListImpactsResponse => ({
  total: 1,
  items: [getImpactResponse()],
});

export const getContentfulGraphqlImpacts = (): NonNullable<
  NonNullable<FetchImpactsQuery['impactCollection']>['items'][number]
> => ({
  sys: {
    id: '1',
  },
  name: 'Impact 1',
});

export const getContentfulGraphqlImpactsResponse = (): FetchImpactsQuery => ({
  impactCollection: {
    total: 1,
    items: [getContentfulGraphqlImpacts()],
  },
});
