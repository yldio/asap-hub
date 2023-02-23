import buildQuery, { Filter } from 'odata-query';

const FILTER_URL_QUERY_PARAM = '?$filter=';

export const buildODataFilter = (filterObj: Filter): string =>
  buildQuery({ filter: filterObj }).replace(FILTER_URL_QUERY_PARAM, '');
