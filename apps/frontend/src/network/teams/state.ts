import useDeepCompareEffect from 'use-deep-compare-effect';
import {
  atomFamily,
  selectorFamily,
  useRecoilValue,
  useSetRecoilState,
  DefaultValue,
  useRecoilState,
  atom,
  selector,
} from 'recoil';
import {
  TeamResponse,
  TeamPatchRequest,
  ListTeamResponse,
  ResearchOutput,
} from '@asap-hub/model';

import { getTeam, patchTeam, getTeams, createTeamResearchOutput } from './api';
import { authorizationState } from '../../auth/state';
import { GetListOptions } from '../../api-util';
import { CARD_VIEW_PAGE_SIZE } from '../../hooks';

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
      const teams: TeamResponse[] = [];
      for (const id of index.ids) {
        const team = get(teamState(id));
        if (team === undefined) return undefined;
        teams.push(team);
      }
      return { total: index.total, items: teams };
    },
  set:
    (options) =>
    ({ get, set, reset }, newTeams) => {
      if (newTeams === undefined || newTeams instanceof DefaultValue) {
        const oldTeams = get(teamIndexState(options));
        if (!(oldTeams instanceof Error)) {
          oldTeams?.ids?.forEach((id) => reset(patchedTeamState(id)));
        }
        reset(teamIndexState(options));
      } else if (newTeams instanceof Error) {
        set(teamIndexState(options), newTeams);
      } else {
        newTeams?.items.forEach((team) => set(patchedTeamState(team.id), team));
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

export const postTeamResearchOutputState = atom<ResearchOutput>({
  key: 'postResearchOutput',
  default: {
    type: 'Bioinformatics',
    link: 'https://hub.asap.science/',
    title: 'Output created through the ROMS form',
    asapFunded: false,
    sharingStatus: 'Network Only',
    usedInPublication: false,
    addedDate: new Date().toISOString(),
  },
});

export const teamResearchOutputState = selector<ResearchOutput>({
  key: 'teamResearchOutput',
  get: ({ get }) => get(postTeamResearchOutputState),
});

const teamState = selectorFamily<TeamResponse | undefined, string>({
  key: 'team',
  get:
    (id) =>
    ({ get }) =>
      get(patchedTeamState(id)) ?? get(initialTeamState(id)),
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
      getTeams(options, authorization).then(setTeams).catch();
    }
  }, [options, authorization, teams, setTeams]);
};
export const useTeams = (options: GetListOptions) => {
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
export const useResearchOutput = () => useRecoilValue(teamResearchOutputState);
export const usePatchTeamById = (id: string) => {
  const authorization = useRecoilValue(authorizationState);
  const setPatchedTeam = useSetRecoilState(patchedTeamState(id));
  return async (patch: TeamPatchRequest) => {
    setPatchedTeam(await patchTeam(id, patch, authorization));
  };
};
export const usePostTeamResearchOutput = (teamId: string) => {
  const authorization = useRecoilValue(authorizationState);
  return async (payload: Partial<ResearchOutput>) => {
    await createTeamResearchOutput(teamId, payload, authorization);
  };
};
