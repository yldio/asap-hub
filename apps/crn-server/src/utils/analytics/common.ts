import { Maybe, ResearchOutputs, Sys } from '@asap-hub/contentful';
import {
  TeamOutputDocumentType,
  teamOutputDocumentTypes,
  TimeRangeOption,
} from '@asap-hub/model';

type AnalyticOutput = Maybe<
  Pick<ResearchOutputs, 'sharingStatus' | 'addedDate' | 'createdDate'> & {
    authorsCollection?: Maybe<{
      items: Array<
        Maybe<
          | { __typename: 'ExternalAuthors' }
          | ({ __typename: 'Users' } & {
              sys: Pick<Sys, 'id'>;
            })
        >
      >;
    }>;
  }
>;

export const getRangeFilterParams = (
  rangeKey?: TimeRangeOption,
): string | null => {
  const now = new Date();
  const options: Record<TimeRangeOption, string | null> = {
    '30d': new Date(new Date().setDate(now.getDate() - 30)).toISOString(),
    '90d': new Date(new Date().setDate(now.getDate() - 90)).toISOString(),
    'current-year': new Date(now.getFullYear(), 0, 1).toISOString(),
    'last-year': new Date(
      new Date().setDate(now.getDate() - 365),
    ).toISOString(),
    all: null,
  };
  if (rangeKey && rangeKey in options) {
    return options[rangeKey];
  }
  return options['30d'];
};

export const getFilterOutputByRange =
  (rangeKey?: TimeRangeOption) => (item: AnalyticOutput) => {
    const filter = getRangeFilterParams(rangeKey);
    if (item && filter) {
      return item.addedDate
        ? item.addedDate >= filter
        : item.createdDate >= filter;
    }
    return true;
  };

export const isTeamOutputDocumentType = (
  documentType: string,
): documentType is TeamOutputDocumentType =>
  teamOutputDocumentTypes.includes(documentType as TeamOutputDocumentType);

// remove string from one array that are present in another array and return a new array of strings
export const removeDuplicates = (arr1: string[], arr2: string[]): string[] => [
  ...arr1.filter((elem) => !arr2.includes(elem)),
];

export const getUniqueIdCount = (arr: (string | undefined)[]): number =>
  [...new Set(arr.filter((elem) => !!elem))].length;
