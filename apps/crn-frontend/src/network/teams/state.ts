import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  ListTeamResponse,
  TeamPatchRequest,
  TeamResponse,
  TeamListItemResponse,
  ManuscriptPostRequest,
  ManuscriptResponse,
  ManuscriptFileType,
  ComplianceReportPostRequest,
  ManuscriptPutRequest,
  DiscussionRequest,
  DiscussionResponse,
  ListPartialManuscriptResponse,
  ManuscriptVersion,
} from '@asap-hub/model';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { useCallback } from 'react';
import {
  atom,
  atomFamily,
  DefaultValue,
  RecoilState,
  selectorFamily,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { authorizationState } from '../../auth/state';
import { CARD_VIEW_PAGE_SIZE } from '../../hooks';
import {
  createComplianceReport,
  createManuscript,
  getDiscussion,
  getManuscript,
  getTeam,
  getTeams,
  patchTeam,
  updateManuscript,
  updateDiscussion,
  uploadManuscriptFile,
  resubmitManuscript,
  createComplianceDiscussion,
  endDiscussion,
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

export const patchedTeamState = atomFamily<TeamResponse | undefined, string>({
  key: 'patchedTeam',
  default: undefined,
});

export const teamState = selectorFamily<TeamResponse | undefined, string>({
  key: 'team',
  get:
    (id) =>
    ({ get }) =>
      get(patchedTeamState(id)) ?? get(initialTeamState(id)),
  set:
    (id: string) =>
    ({ set, reset }, newValue: TeamResponse | DefaultValue | undefined) => {
      if (newValue === undefined || newValue instanceof DefaultValue) {
        reset(patchedTeamState(id) ?? initialTeamState(id));
      } else {
        set(patchedTeamState(id) ?? initialTeamState(id), (prev) => {
          if (prev) {
            return { ...prev, ...newValue };
          }
          return newValue;
        });
      }
    },
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

const fetchManuscriptState = selectorFamily<
  ManuscriptResponse | undefined,
  string
>({
  key: 'fetchManuscript',
  get:
    (id) =>
    ({ get }) => {
      get(refreshManuscriptState(id));
      const authorization = get(authorizationState);
      return getManuscript(id, authorization);
    },
});

export const manuscriptState = atomFamily<
  ManuscriptResponse | undefined,
  string
>({
  key: 'manuscript',
  default: fetchManuscriptState,
});

export const useInvalidateManuscriptIndex = () => {
  const [refresh, setRefresh] = useRecoilState(refreshManuscriptIndex);

  return useCallback(() => {
    setRefresh(refresh + 1);
  }, [refresh, setRefresh]);
};

export const useManuscriptById = (id: string) =>
  useRecoilValue(manuscriptState(id));

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

export const useResubmitManuscript = () => {
  const authorization = useRecoilValue(authorizationState);
  const setManuscriptItem = useSetManuscriptItem();
  return async (id: string, payload: ManuscriptPostRequest) => {
    const manuscript = await resubmitManuscript(id, payload, authorization);
    setManuscriptItem(manuscript);
    return manuscript;
  };
};

export const usePutManuscript = () => {
  const authorization = useRecoilValue(authorizationState);
  const setManuscriptItem = useSetManuscriptItem();
  const invalidateManuscriptIndex = useInvalidateManuscriptIndex();

  return async (id: string, payload: ManuscriptPutRequest) => {
    const manuscript = await updateManuscript(id, payload, authorization);
    setManuscriptItem(manuscript);
    invalidateManuscriptIndex();
    return manuscript;
  };
};

export const usePostComplianceReport = () => {
  const authorization = useRecoilValue(authorizationState);
  return async (payload: ComplianceReportPostRequest) => {
    const complianceReport = await createComplianceReport(
      payload,
      authorization,
    );
    return complianceReport;
  };
};

export const useIsComplianceReviewer = (): boolean => {
  const { role, openScienceTeamMember } = useCurrentUserCRN() ?? {};
  return role === 'Staff' && !!openScienceTeamMember;
};

export const useUploadManuscriptFile = () => {
  const authorization = useRecoilValue(authorizationState);

  return (
    file: File,
    fileType: ManuscriptFileType,
    handleError: (errorMessage: string) => void,
  ) => uploadManuscriptFile(file, fileType, authorization, handleError);
};

export const refreshDiscussionState = atomFamily<number, string>({
  key: 'refreshDiscussion',
  default: 0,
});

const fetchDiscussionState = selectorFamily<
  DiscussionResponse | undefined,
  string
>({
  key: 'fetchDiscussion',
  get:
    (id) =>
    ({ get }) => {
      get(refreshDiscussionState(id));
      const authorization = get(authorizationState);
      return getDiscussion(id, authorization);
    },
});

export const discussionState = atomFamily<
  DiscussionResponse | undefined,
  string
>({
  key: 'discussion',
  default: fetchDiscussionState,
});

export const useSetDiscussion = () =>
  useRecoilCallback(({ set }) => (discussion: DiscussionResponse) => {
    set(discussionState(discussion.id), discussion);
  });

export const useDiscussionById = (id: string) =>
  useRecoilValue(discussionState(id));

export const useReplyToDiscussion = () => {
  const authorization = useRecoilValue(authorizationState);
  const setDiscussion = useSetDiscussion();

  return async (id: string, patch: DiscussionRequest) => {
    const discussion = await updateDiscussion(id, patch, authorization);
    setDiscussion(discussion);
  };
};

export const useEndDiscussion = () => {
  const authorization = useRecoilValue(authorizationState);
  const setDiscussion = useSetDiscussion();

  return async (id: string) => {
    const discussion = await endDiscussion(id, authorization);
    setDiscussion(discussion);
  };
};

export const useManuscripts = (
  options: GetListOptions,
): ListPartialManuscriptResponse => ({
  total: 0,
  items: [],
});

export const versionSelector = selectorFamily<
  ManuscriptVersion | undefined,
  { teamId: string; manuscriptId: string; versionId: string }
>({
  key: 'versionSelector',
  get:
    (params) =>
    ({ get }) => {
      const { teamId, manuscriptId, versionId } = params;

      const team = get(teamState(teamId));
      if (!team) return undefined;

      const currentManuscript = team.manuscripts.find(
        (manuscript) => manuscript.id === manuscriptId,
      );
      if (!currentManuscript) return undefined;

      return currentManuscript.versions.find(
        (version) => version.id === versionId,
      );
    },
  set:
    (params) =>
    ({ set, get }, newValue: ManuscriptVersion | DefaultValue | undefined) => {
      const { teamId, manuscriptId, versionId } = params;

      const team = get(teamState(teamId));
      if (!team) return;

      const manuscript = team.manuscripts.find(
        (item) => item.id === manuscriptId,
      );
      if (!manuscript) return;

      const version = manuscript.versions.find((item) => item.id === versionId);
      if (!version) return;

      set(
        teamState(teamId) as RecoilState<TeamResponse>,
        (prev: TeamResponse) => ({
          ...prev,
          manuscripts: team.manuscripts.map((manuscriptItem) => {
            if (manuscriptItem.id === manuscriptId) {
              return {
                ...manuscriptItem,
                versions: manuscriptItem.versions.map((versionItem) =>
                  versionItem.id === versionId
                    ? (newValue as ManuscriptVersion)
                    : versionItem,
                ),
              };
            }
            return manuscriptItem;
          }),
        }),
      );
    },
});

export const useVersionById = (params: {
  teamId: string;
  manuscriptId: string;
  versionId: string;
}): [
  ManuscriptVersion | undefined,
  (callback: (prev: ManuscriptVersion) => ManuscriptVersion) => void,
] => {
  const [version, setVersion] = useRecoilState(versionSelector(params));
  const setVersionCallback = (
    callback: (prev: ManuscriptVersion) => ManuscriptVersion,
  ) => {
    setVersion((prev) => (prev ? callback(prev) : prev));
  };
  return [version, setVersionCallback];
};

export const useCreateComplianceDiscussion = () => {
  const authorization = useRecoilValue(authorizationState);

  return async (
    complianceReportId: string,
    message: string,
  ): Promise<string> => {
    const discussion = await createComplianceDiscussion(
      complianceReportId,
      message,
      authorization,
    );
    return discussion.id;
  };
};
