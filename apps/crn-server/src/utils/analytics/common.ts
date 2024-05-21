import { Maybe, ResearchOutputs, Sys } from '@asap-hub/contentful';
import { TimeRangeOption } from '@asap-hub/model';

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
