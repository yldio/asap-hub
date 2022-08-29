import buildQuery, { Filter } from 'odata-query';
import { createUrlFactory } from '@asap-hub/squidex';
import { appName, baseUrl } from '../config';

export const createUrl = createUrlFactory({ appName, baseUrl });

export const buildODataFilter = (filterObj: Filter): string =>
  buildQuery({ filter: filterObj }).replace('?$filter=', '');

export const buildEqFilterForWords = (
  field: string,
  words?: string[],
  subField?: string,
): Filter => {
  const filterKey = `data/${field}/iv${subField ? `/${subField}` : ''}`;
  const filters = (words || []).reduce(
    (acc: Filter[], word: string) => acc.concat({ [filterKey]: word }),
    [],
  );

  if (!filters.length) {
    return '';
  }

  return filters.length === 1 ? (filters[0] as Filter) : { or: filters };
};
