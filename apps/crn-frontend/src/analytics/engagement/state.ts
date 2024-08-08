import { AnalyticsSearchOptionsWithFiltering } from '@asap-hub/algolia';
import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  EngagementAlgoliaResponse,
  ListEngagementAlgoliaResponse,
  SortEngagement,
} from '@asap-hub/model';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
} from 'recoil';

import { ANALYTICS_ALGOLIA_INDEX } from '../../config';
import { useAnalyticsAlgolia } from '../../hooks/algolia';
import { getEngagement } from './api';

const analyticsEngagementIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  Pick<GetListOptions, 'currentPage' | 'pageSize'>
>({
  key: 'analyticsEngagementIndex',
  default: undefined,
});

export const analyticsEngagementListState = atomFamily<
  EngagementAlgoliaResponse | undefined,
  string
>({
  key: 'analyticsEngagementList',
  default: undefined,
});

export const analyticsEngagementState = selectorFamily<
  ListEngagementAlgoliaResponse | Error | undefined,
  Pick<GetListOptions, 'currentPage' | 'pageSize'>
>({
  key: 'engagement',
  get:
    (options) =>
    ({ get }) => {
      const index = get(analyticsEngagementIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const teams: EngagementAlgoliaResponse[] = [];
      for (const id of index.ids) {
        const team = get(analyticsEngagementListState(id));
        if (team === undefined) return undefined;
        teams.push(team);
      }
      return { total: index.total, items: teams };
    },
  set:
    (options) =>
    ({ get, set, reset }, newEngagement) => {
      if (
        newEngagement === undefined ||
        newEngagement instanceof DefaultValue
      ) {
        reset(analyticsEngagementIndexState(options));
      } else if (newEngagement instanceof Error) {
        set(analyticsEngagementIndexState(options), newEngagement);
      } else {
        newEngagement?.items.forEach((engagement) =>
          set(analyticsEngagementListState(engagement.id), engagement),
        );
        set(analyticsEngagementIndexState(options), {
          total: newEngagement.total,
          ids: newEngagement.items.map((engagement) => engagement.id),
        });
      }
    },
});

export const useAnalyticsEngagement = (
  options: AnalyticsSearchOptionsWithFiltering<SortEngagement>,
) => {
  const indexName =
    options.sort === 'team_asc'
      ? ANALYTICS_ALGOLIA_INDEX
      : `${ANALYTICS_ALGOLIA_INDEX}_${options.sort}`;

  const algoliaClient = useAnalyticsAlgolia(indexName);
  const [engagement, setEngagement] = useRecoilState(
    analyticsEngagementState(options),
  );
  if (engagement === undefined) {
    throw getEngagement(algoliaClient.client, options)
      .then(setEngagement)
      .catch(setEngagement);
  }
  if (engagement instanceof Error) {
    throw engagement;
  }
  return engagement;
};
