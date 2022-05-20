import { isEnabled } from '@asap-hub/flags';
import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  ListTeamResponse,
  ResearchOutputPostRequest,
  ResearchTagResponse,
  TeamPatchRequest,
  TeamResponse,
} from '@asap-hub/model';
import { useCurrentUser } from '@asap-hub/react-context';
import { hasCreateUpdateResearchOutputPermissions } from '@asap-hub/validation';
import {
  atom,
  atomFamily,
  DefaultValue,
  selector,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { authorizationState } from '../../auth/state';
import { CARD_VIEW_PAGE_SIZE } from '../../hooks';
import { useAlgolia } from '../../hooks/algolia';
import { getResearchTags } from '../../shared-research/api';
import { useSetResearchOutputItem } from '../../shared-research/state';
import { getUsersAndExternalAuthors } from '../users/api';
import {
  createTeamResearchOutput,
  getLabs,
  getTeam,
  getTeams,
  patchTeam,
} from './api';

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
export const usePatchTeamById = (id: string) => {
  const authorization = useRecoilValue(authorizationState);
  const setPatchedTeam = useSetRecoilState(patchedTeamState(id));
  return async (patch: TeamPatchRequest) => {
    setPatchedTeam(await patchTeam(id, patch, authorization));
  };
};

export const useLabSuggestions = () => {
  const authorization = useRecoilValue(authorizationState);
  return (searchQuery: string) =>
    getLabs(
      { searchQuery, filters: new Set(), currentPage: null, pageSize: null },
      authorization,
    ).then(({ items }) =>
      items.map(({ id, name }) => ({ label: `${name} Lab`, value: id })),
    );
};

export const useTeamSuggestions = () => {
  const authorization = useRecoilValue(authorizationState);
  return (searchQuery: string) =>
    getTeams(
      { searchQuery, filters: new Set(), currentPage: null, pageSize: null },
      authorization,
    ).then(({ items }) =>
      items.map(({ id, displayName }) => ({
        label: displayName,
        value: id,
      })),
    );
};

export const useAuthorSuggestions = () => {
  const algoliaClient = useAlgolia();

  return (searchQuery: string) =>
    getUsersAndExternalAuthors(algoliaClient.client, {
      searchQuery,
      currentPage: null,
      pageSize: 100,
      filters: new Set(),
    }).then(({ items }) => items);
};

export const usePostTeamResearchOutput = () => {
  const authorization = useRecoilValue(authorizationState);
  const setResearchOutputItem = useSetResearchOutputItem();
  return async (payload: ResearchOutputPostRequest) => {
    const researchOutput = await createTeamResearchOutput(
      payload,
      authorization,
    );
    setResearchOutputItem(researchOutput);
    return researchOutput;
  };
};

export const useCanCreateUpdateResearchOutput = (
  teamIds: string[],
): boolean => {
  const user = useCurrentUser();

  return !!(
    isEnabled('ROMS_FORM') &&
    user &&
    hasCreateUpdateResearchOutputPermissions(user, teamIds)
  );
};

const researchTagsState = atom<ResearchTagResponse[]>({
  key: 'researchTagsState',
  default: [],
});

export const researchTagsSelector = selector({
  key: 'researchTags',
  get: ({ get }) => {
    get(researchTagsState);
    const authorization = get(authorizationState);
    return getResearchTags(authorization);
  },
});

export const useResearchTags = () => useRecoilValue(researchTagsSelector);
