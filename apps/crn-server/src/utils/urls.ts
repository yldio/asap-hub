import buildQuery, { Filter } from 'odata-query';
import { createUrlFactory } from '@asap-hub/squidex';
import { appName, baseUrl } from '../config';

export const createUrl = createUrlFactory({ appName, baseUrl });

export const buildODataFilter = (filterObj: Filter): string =>
  buildQuery({ filter: filterObj }).replace('?$filter=', '');
