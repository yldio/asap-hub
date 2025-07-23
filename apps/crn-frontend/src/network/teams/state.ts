import { getOverrides } from '@asap-hub/flags';
import { GetListOptions, BackendError } from '@asap-hub/frontend-utils';
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
  PartialManuscriptResponse,
  ManuscriptDataObject,
} from '@asap-hub/model';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { useCallback, useState } from 'react';
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
import { getPresignedUrl } from '../../shared-api/files';
import { authorizationState } from '../../auth/state';
import { CARD_VIEW_PAGE_SIZE } from '../../hooks';
import { useAlgolia } from '../../hooks/algolia';
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
  createDiscussion,
  getManuscripts,
  ManuscriptsOptions,
  uploadManuscriptFileViaPresignedUrl,
  markDiscussionAsRead,
  downloadFullComplianceDataset,
  getManuscriptVersions,
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
  useRecoilState(manuscriptState(id));

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
    const notificationList = getOverrides()
      .COMPLIANCE_NOTIFICATION_LIST as string;
    const manuscript = await createManuscript(
      { ...payload, notificationList },
      authorization,
    );
    setManuscriptItem(manuscript);
    return manuscript;
  };
};

export const useResubmitManuscript = () => {
  const authorization = useRecoilValue(authorizationState);
  const setManuscriptItem = useSetManuscriptItem();
  return async (id: string, payload: ManuscriptPostRequest) => {
    const notificationList = getOverrides()
      .COMPLIANCE_NOTIFICATION_LIST as string;
    const manuscript = await resubmitManuscript(
      id,
      { ...payload, notificationList },
      authorization,
    );
    setManuscriptItem(manuscript);
    return manuscript;
  };
};

export const usePutManuscript = () => {
  const authorization = useRecoilValue(authorizationState);
  const setManuscriptItem = useSetManuscriptItem();
  const invalidateManuscriptIndex = useInvalidateManuscriptIndex();

  return async (id: string, payload: ManuscriptPutRequest) => {
    const notificationList = getOverrides()
      .COMPLIANCE_NOTIFICATION_LIST as string;
    const manuscript = await updateManuscript(
      id,
      { ...payload, notificationList },
      authorization,
    );
    setManuscriptItem(manuscript);
    invalidateManuscriptIndex();
    return manuscript;
  };
};

export const usePostComplianceReport = () => {
  const authorization = useRecoilValue(authorizationState);
  return async (payload: ComplianceReportPostRequest) => {
    const notificationList = getOverrides()
      .COMPLIANCE_NOTIFICATION_LIST as string;

    const complianceReport = await createComplianceReport(
      { ...payload, notificationList },
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

// Uses S3 presigned URL to upload file
export const useUploadManuscriptFileViaPresignedUrl = () => {
  const authorization = useRecoilValue(authorizationState);

  return (
    file: File,
    fileType: ManuscriptFileType,
    handleError: (errorMessage: string) => void,
  ) =>
    uploadManuscriptFileViaPresignedUrl(
      file,
      fileType,
      authorization,
      handleError,
    );
};

export const useDownloadFullComplianceDataset = () => {
  const authorization = useRecoilValue(authorizationState);

  return () => downloadFullComplianceDataset(authorization);
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

export const useReplyToDiscussion = () => {
  const authorization = useRecoilValue(authorizationState);
  const setDiscussion = useSetDiscussion();
  const setManuscriptItem = useSetManuscriptItem();

  return async (manuscriptId: string, id: string, patch: DiscussionRequest) => {
    const notificationList = getOverrides()
      .COMPLIANCE_NOTIFICATION_LIST as string;

    try {
      const discussion = await updateDiscussion(
        id,
        { ...patch, notificationList },
        authorization,
      );
      setDiscussion(discussion);
      const updatedManuscript = await getManuscript(
        manuscriptId,
        authorization,
      );
      if (updatedManuscript) setManuscriptItem(updatedManuscript);
    } catch (error) {
      if (
        error instanceof BackendError &&
        (error as BackendError).response?.statusCode === 403
      ) {
        const updatedManuscript = await getManuscript(
          manuscriptId,
          authorization,
        );
        if (updatedManuscript) setManuscriptItem(updatedManuscript);
      }
      throw error;
    }
  };
};

export const useMarkDiscussionAsRead = () => {
  const authorization = useRecoilValue(authorizationState);
  const setDiscussion = useSetDiscussion();
  const setManuscriptItem = useSetManuscriptItem();
  const getManuscriptById = useRecoilCallback(
    ({ snapshot }) =>
      (manuscriptId: string) =>
        snapshot.getLoadable(manuscriptState(manuscriptId)).getValue(),
  );

  return async (manuscriptId: string, discussionId: string) => {
    const manuscript = getManuscriptById(manuscriptId);

    if (manuscript) {
      const discussions = manuscript.discussions.map((discussion) => {
        if (discussion.id === discussionId) {
          return { ...discussion, read: true };
        }
        return discussion;
      });

      setManuscriptItem({ ...manuscript, discussions });
    }

    const discussion = await markDiscussionAsRead(discussionId, authorization);
    setDiscussion(discussion);
  };
};

export const manuscriptListState = atomFamily<
  PartialManuscriptResponse | undefined,
  string
>({
  key: 'manuscriptList',
  default: undefined,
});

const manuscriptIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  ManuscriptsOptions
>({
  key: 'manuscriptIndex',
  default: undefined,
});

export const manuscriptsState = selectorFamily<
  ListPartialManuscriptResponse | Error | undefined,
  ManuscriptsOptions
>({
  key: 'manuscripts',
  get:
    (options) =>
    ({ get }) => {
      const index = get(manuscriptIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const manuscripts: PartialManuscriptResponse[] = [];
      for (const id of index.ids) {
        const manuscript = get(manuscriptListState(id));
        if (manuscript === undefined) return undefined;
        manuscripts.push(manuscript);
      }
      return { total: index.total, items: manuscripts };
    },
  set:
    (options) =>
    ({ get, set, reset }, newManuscripts) => {
      if (
        newManuscripts === undefined ||
        newManuscripts instanceof DefaultValue
      ) {
        reset(manuscriptIndexState(options));
      } else if (newManuscripts instanceof Error) {
        set(manuscriptIndexState(options), newManuscripts);
      } else {
        newManuscripts?.items.forEach((manuscript) =>
          set(manuscriptListState(manuscript.id), manuscript),
        );
        set(manuscriptIndexState(options), {
          total: newManuscripts.total,
          ids: newManuscripts.items.map((team) => team.id),
        });
      }
    },
});

export const useManuscripts = (
  options: ManuscriptsOptions,
): ListPartialManuscriptResponse & {
  refresh: (manuscript: ManuscriptDataObject) => void;
} => {
  const [manuscripts, setManuscripts] = useRecoilState(
    manuscriptsState(options),
  );

  const algoliaClient = useAlgolia();

  const refreshManuscripts = useCallback(
    (updatedManuscriptItem: ManuscriptDataObject) => {
      setManuscripts((previousManuscripts) => {
        /* istanbul ignore next */
        if (!previousManuscripts || previousManuscripts instanceof Error)
          return undefined;

        return {
          ...previousManuscripts,
          items: previousManuscripts.items.map((previousManuscriptItem) =>
            previousManuscriptItem.id === updatedManuscriptItem.id
              ? {
                  ...previousManuscriptItem,
                  status: updatedManuscriptItem.status,
                  assignedUsers: updatedManuscriptItem.assignedUsers,
                  apcAmountPaid: updatedManuscriptItem.apcAmountPaid,
                  apcAmountRequested: updatedManuscriptItem.apcAmountRequested,
                  apcCoverageRequestStatus:
                    updatedManuscriptItem.apcCoverageRequestStatus,
                  apcRequested: updatedManuscriptItem.apcRequested,
                  declinedReason: updatedManuscriptItem.declinedReason,
                }
              : previousManuscriptItem,
          ),
        };
      });
    },
    [setManuscripts],
  );

  if (manuscripts === undefined) {
    throw getManuscripts(algoliaClient.client, options)
      .then(setManuscripts)
      .catch(setManuscripts);
  }
  if (manuscripts instanceof Error) {
    throw manuscripts;
  }
  return { ...manuscripts, refresh: refreshManuscripts };
};

export const useManuscriptVersionSuggestions = () => {
  const algoliaClient = useAlgolia();

  return (searchQuery: string, teamId: string) =>
    getManuscriptVersions(algoliaClient.client, {
      searchQuery,
      currentPage: null,
      pageSize: 100,
      filters: [`teamId:${teamId}`],
    }).then(({ items }) => items);
};

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

export const useCreateDiscussion = () => {
  const authorization = useRecoilValue(authorizationState);
  const setManuscriptItem = useSetManuscriptItem();

  return async (
    manuscriptId: string,
    title: string,
    text: string,
  ): Promise<string | undefined> => {
    const notificationList = getOverrides()
      .COMPLIANCE_NOTIFICATION_LIST as string;

    try {
      const discussion = await createDiscussion(
        {
          manuscriptId,
          title,
          text,
          notificationList,
        },
        authorization,
      );
      const updatedManuscript = await getManuscript(
        manuscriptId,
        authorization,
      );
      if (updatedManuscript) setManuscriptItem(updatedManuscript);
      return discussion.id;
    } catch (error) {
      if (
        error instanceof BackendError &&
        (error as BackendError).response?.statusCode === 403
      ) {
        const updatedManuscript = await getManuscript(
          manuscriptId,
          authorization,
        );
        if (updatedManuscript) setManuscriptItem(updatedManuscript);
      }
      throw error;
    }
  };
};

export const usePresignedUrl = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authorization = useRecoilValue(authorizationState);

  const fetchPresignedUrl = async (filename: string, contentType: string) => {
    setLoading(true);
    setError(null);
    try {
      const { presignedUrl: uploadUrl } = await getPresignedUrl(
        filename,
        authorization,
        contentType,
      );
      return uploadUrl;
    } catch (err) {
      setError('Failed to generate pre-signed URL');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchPresignedUrl, loading, error };
};
