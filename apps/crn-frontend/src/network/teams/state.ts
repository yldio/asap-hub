import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  ListTeamResponse,
  TeamPatchRequest,
  TeamResponse,
  TeamListItemResponse,
  ManuscriptPostRequest,
  ManuscriptResponse,
} from '@asap-hub/model';
import {
  atom,
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { authorizationState } from '../../auth/state';
import { CARD_VIEW_PAGE_SIZE } from '../../hooks';
import { createManuscript, getTeam, getTeams, patchTeam } from './api';

const teamIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  GetListOptions
>({
  key: 'teamIndex',
  default: undefined,
});
export const teamsState = selectorFamily<
  ListTeamResponse | Error | undefined,
  GetListOptions
>({
  key: 'teams',
  get:
    (options) =>
    ({ get }) => {
      const index = get(teamIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const teams: TeamListItemResponse[] = [];
      for (const id of index.ids) {
        const team = get(teamListState(id));
        if (team === undefined) return undefined;
        teams.push(team);
      }
      return { total: index.total, items: teams };
    },
  set:
    (options) =>
    ({ get, set, reset }, newTeams) => {
      if (newTeams === undefined || newTeams instanceof DefaultValue) {
        reset(teamIndexState(options));
      } else if (newTeams instanceof Error) {
        set(teamIndexState(options), newTeams);
      } else {
        newTeams?.items.forEach((team) => set(teamListState(team.id), team));
        set(teamIndexState(options), {
          total: newTeams.total,
          ids: newTeams.items.map((team) => team.id),
        });
      }
    },
});
export const refreshTeamState = atomFamily<number, string>({
  key: 'refreshTeam',
  default: 0,
});
const initialTeamState = selectorFamily<TeamResponse | undefined, string>({
  key: 'initialTeam',
  get:
    (id) =>
    async ({ get }) => {
      get(refreshTeamState(id));
      const authorization = get(authorizationState);
      return getTeam(id, authorization);
    },
});

const patchedTeamState = atomFamily<TeamResponse | undefined, string>({
  key: 'patchedTeam',
  default: undefined,
});

export const teamState = selectorFamily<TeamResponse | undefined, string>({
  key: 'team',
  get:
    (id) =>
    ({ get }) =>
      get(patchedTeamState(id)) ?? get(initialTeamState(id)),
});

export const teamListState = atomFamily<
  TeamListItemResponse | undefined,
  string
>({
  key: 'teamList',
  default: undefined,
});

export const usePrefetchTeams = (
  options: GetListOptions = {
    filters: new Set(),
    searchQuery: '',
    pageSize: CARD_VIEW_PAGE_SIZE,
    currentPage: 0,
  },
) => {
  const authorization = useRecoilValue(authorizationState);
  const [teams, setTeams] = useRecoilState(teamsState(options));
  useDeepCompareEffect(() => {
    if (teams === undefined) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getTeams(options, authorization).then(setTeams).catch();
    }
  }, [options, authorization, teams, setTeams]);
};
export const useTeams = (options: GetListOptions): ListTeamResponse => {
  const authorization = useRecoilValue(authorizationState);
  const [teams, setTeams] = useRecoilState(teamsState(options));
  if (teams === undefined) {
    throw getTeams(options, authorization).then(setTeams).catch(setTeams);
  }
  if (teams instanceof Error) {
    throw teams;
  }
  return teams;
};

export const useTeamById = (id: string) => useRecoilValue(teamState(id));
export const usePatchTeamById = (id: string) => {
  const authorization = useRecoilValue(authorizationState);
  const setPatchedTeam = useSetRecoilState(patchedTeamState(id));
  return async (patch: TeamPatchRequest) => {
    setPatchedTeam(await patchTeam(id, patch, authorization));
  };
};

export const refreshManuscriptIndex = atom<number>({
  key: 'refreshManuscriptIndex',
  default: 0,
});

export const refreshManuscriptState = atomFamily<number, string>({
  key: 'refreshManuscript',
  default: 0,
});

export const manuscriptState = atomFamily<
  ManuscriptResponse | undefined,
  string
>({
  key: 'manuscript',
  default: undefined,
});

export const useSetManuscriptItem = () => {
  const [refresh, setRefresh] = useRecoilState(refreshManuscriptIndex);
  return useRecoilCallback(({ set }) => (manuscript: ManuscriptResponse) => {
    setRefresh(refresh + 1);
    set(manuscriptState(manuscript.id), manuscript);
  });
};

export const usePostManuscript = () => {
  const authorization = useRecoilValue(authorizationState);
  const setManuscriptItem = useSetManuscriptItem();
  return async (payload: ManuscriptPostRequest) => {
    const manuscript = await createManuscript(payload, authorization);
    setManuscriptItem(manuscript);
    return manuscript;
  };
};
