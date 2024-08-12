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
import { AnalyticsSearchOptions, getAnalyticsLeadership } from './api';
import { useAnalyticsAlgolia } from '../../hooks/algolia';
import { getAlgoliaIndexName } from '../utils/state';

type Options = AnalyticsSearchOptions & { sort: SortLeadershipAndMembership };
type StateOptionKeyData = Pick<
  Options,
  'currentPage' | 'pageSize' | 'sort' | 'tags'
>;

const analyticsLeadershipIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  StateOptionKeyData
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
  StateOptionKeyData
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
  const indexName = getAlgoliaIndexName(options.sort, 'team-leadership');
  const algoliaClient = useAnalyticsAlgolia(indexName).client;

  const [leadership, setLeadership] = useRecoilState(
    analyticsLeadershipState(options),
  );
  if (leadership === undefined) {
    throw getAnalyticsLeadership(algoliaClient, options)
      .then(setLeadership)
      .catch(setLeadership);
  }
  if (leadership instanceof Error) {
    throw leadership;
  }
  return {
    ...leadership,
    client: algoliaClient,
  };
};
