import { GetListOptions } from '@asap-hub/frontend-utils';
import { EngagementResponse, ListEngagementResponse } from '@asap-hub/model';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { authorizationState } from '../../auth/state';
import { getEngagement } from './api';

const analyticsEngagementIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  Pick<GetListOptions, 'currentPage' | 'pageSize'>
>({
  key: 'analyticsEngagementIndex',
  default: undefined,
});

export const analyticsEngagementListState = atomFamily<
  EngagementResponse | undefined,
  string
>({
  key: 'analyticsEngagementList',
  default: undefined,
});

export const analyticsEngagementState = selectorFamily<
  ListEngagementResponse | Error | undefined,
  Pick<GetListOptions, 'currentPage' | 'pageSize'>
>({
  key: 'engagement',
  get:
    (options) =>
    ({ get }) => {
      const index = get(analyticsEngagementIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const teams: EngagementResponse[] = [];
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
  options: Pick<GetListOptions, 'currentPage' | 'pageSize'>,
) => {
  const authorization = useRecoilValue(authorizationState);
  const [engagement, setEngagement] = useRecoilState(
    analyticsEngagementState(options),
  );
  if (engagement === undefined) {
    throw getEngagement(options, authorization)
      .then(setEngagement)
      .catch(setEngagement);
  }
  if (engagement instanceof Error) {
    throw engagement;
  }
  return engagement;
};
