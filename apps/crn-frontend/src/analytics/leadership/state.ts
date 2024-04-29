import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  AnalyticsTeamLeadershipResponse,
  ListAnalyticsTeamLeadershipResponse,
  SortLeadershipAndMembership,
} from '@asap-hub/model';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
} from 'recoil';
import { getAnalyticsLeadership } from './api';
import { ANALYTICS_ALGOLIA_INDEX } from '../../config';
import { useAnalyticsAlgolia } from '../../hooks/algolia';

type Options = GetListOptions & { sort: SortLeadershipAndMembership };

const analyticsLeadershipIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  Pick<Options, 'currentPage' | 'pageSize' | 'sort'>
>({
  key: 'analyticsLeadershipIndex',
  default: undefined,
});

export const analyticsLeadershipListState = atomFamily<
  AnalyticsTeamLeadershipResponse | undefined,
  string
>({
  key: 'analyticsLeadershipList',
  default: undefined,
});

export const analyticsLeadershipState = selectorFamily<
  ListAnalyticsTeamLeadershipResponse | Error | undefined,
  Pick<Options, 'currentPage' | 'pageSize' | 'sort'>
>({
  key: 'teams',
  get:
    (options) =>
    ({ get }) => {
      const index = get(analyticsLeadershipIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const teams: AnalyticsTeamLeadershipResponse[] = [];
      for (const id of index.ids) {
        const team = get(analyticsLeadershipListState(id));
        if (team === undefined) return undefined;
        teams.push(team);
      }
      return { total: index.total, items: teams };
    },
  set:
    (options) =>
    ({ get, set, reset }, newTeams) => {
      if (newTeams === undefined || newTeams instanceof DefaultValue) {
        reset(analyticsLeadershipIndexState(options));
      } else if (newTeams instanceof Error) {
        set(analyticsLeadershipIndexState(options), newTeams);
      } else {
        newTeams?.items.forEach((team) =>
          set(analyticsLeadershipListState(team.id), team),
        );
        set(analyticsLeadershipIndexState(options), {
          total: newTeams.total,
          ids: newTeams.items.map((team) => team.id),
        });
      }
    },
});

export const useAnalyticsLeadership = (options: Options) => {
  const indexName =
    options.sort === 'team_asc'
      ? ANALYTICS_ALGOLIA_INDEX
      : `${ANALYTICS_ALGOLIA_INDEX}_${options.sort}`;

  const algoliaClient = useAnalyticsAlgolia(indexName);

  const [leadership, setLeadership] = useRecoilState(
    analyticsLeadershipState(options),
  );
  if (leadership === undefined) {
    throw getAnalyticsLeadership(algoliaClient.client, options)
      .then(setLeadership)
      .catch(setLeadership);
  }
  if (leadership instanceof Error) {
    throw leadership;
  }
  return leadership;
};
