import buildQuery, { Filter } from 'odata-query';
import { ResearchOutputFilter } from '../types';
import { getFirstOrAll } from './arrays';

const FILTER_URL_QUERY_PARAM = '?$filter=';

export const makeODataFilter = (
  filter?: ResearchOutputFilter,
): Filter | null => {
  if (!filter) {
    return null;
  }

  const entries = Object.entries(filter).reduce<Filter[]>((res, [key, val]) => {
    if (Array.isArray(val)) {
      return res.concat({
        or: val.map((valElement) => ({
          [`data/${key}/iv`]: valElement,
        })),
      });
    }

    return res.concat({ [`data/${key}/iv`]: val });
  }, []);

  return entries.length === 1 ? (entries[0] as Filter) : entries;
};

export const buildODataFilter = (filterObj: Filter): string =>
  buildQuery({ filter: filterObj }).replace(FILTER_URL_QUERY_PARAM, '');

export const buildEqFilterForWords = (
  field: string,
  words?: string[],
  subField?: string,
): Filter => {
  if (!words || !words.length) {
    return '';
  }

  const filterKey = `data/${field}/iv${subField ? `/${subField}` : ''}`;
  const filters = words.reduce(
    (acc: Filter[], word: string) => acc.concat({ [filterKey]: word }),
    [],
  );

  return getFirstOrAll(filters) as Filter;
};
