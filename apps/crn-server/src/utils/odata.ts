import buildQuery, { Filter } from 'odata-query';

const FILTER_URL_QUERY_PARAM = '?$filter=';

export type ResearchOutputFilter = {
  documentType?: string | string[];
  title?: string;
  link?: string;
};

export const buildODataFilter = (filterObj: Filter): string =>
  buildQuery({ filter: filterObj }).replace(FILTER_URL_QUERY_PARAM, '');

export const getFirstOrAll = <T>(
  arr: Array<T>,
):
  | T
  | {
      or: T[];
    }
  | undefined => (arr.length === 1 ? arr[0] : { or: arr });

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
