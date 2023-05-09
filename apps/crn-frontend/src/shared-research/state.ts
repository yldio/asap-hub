import {
  ListResearchOutputResponse,
  ResearchOutputResponse,
} from '@asap-hub/model';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import {
  getUserRole,
  hasShareResearchOutputPermission,
  hasEditResearchOutputPermission,
  hasPublishResearchOutputPermission,
} from '@asap-hub/validation';
import { useCallback } from 'react';
import {
  atom,
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useRecoilCallback,
} from 'recoil';
import { authorizationState } from '../auth/state';
import { useAlgolia } from '../hooks/algolia';
import {
  getDraftResearchOutputs,
  getResearchOutput,
  getResearchOutputs,
  ResearchOutputListOptions,
} from './api';

type RefreshResearchOutputListOptions = ResearchOutputListOptions & {
  refreshToken: number;
};

const researchOutputIndexState = atomFamily<
  | {
      ids: ReadonlyArray<string>;
      total: number;
      algoliaQueryId?: string;
      algoliaIndexName?: string;
    }
  | Error
  | undefined,
  RefreshResearchOutputListOptions
>({
  key: 'researchOutputIndex',
  default: undefined,
});

const refreshResearchOutputIndex = atom<number>({
  key: 'refreshResearchOutputIndex',
  default: 0,
});

export const researchOutputsState = selectorFamily<
  ListResearchOutputResponse | Error | undefined,
  ResearchOutputListOptions
>({
  key: 'researchOutputs',
  get:
    (options) =>
    ({ get }) => {
      const refreshToken = get(refreshResearchOutputIndex);
      const index = get(
        researchOutputIndexState({
          ...options,
          refreshToken,
        }),
      );
      if (index === undefined || index instanceof Error) return index;
      const researchOutputs: ResearchOutputResponse[] = [];
      for (const id of index.ids) {
        const researchOutput = get(researchOutputState(id));
        if (researchOutput === undefined) return undefined;
        researchOutputs.push(researchOutput);
      }
      return {
        total: index.total,
        items: researchOutputs,
        algoliaQueryId: index.algoliaQueryId,
        algoliaIndexName: index.algoliaIndexName,
      };
    },
  set:
    (options) =>
    ({ get, set, reset }, researchOutputs) => {
      const refreshToken = get(refreshResearchOutputIndex);
      const indexStateOptions = { ...options, refreshToken };
      if (
        researchOutputs === undefined ||
        researchOutputs instanceof DefaultValue
      ) {
        const oldOutputs = get(researchOutputIndexState(indexStateOptions));
        if (!(oldOutputs instanceof Error)) {
          oldOutputs?.ids?.forEach((id) => reset(researchOutputState(id)));
        }
        reset(researchOutputIndexState(indexStateOptions));
      } else if (researchOutputs instanceof Error) {
        set(researchOutputIndexState(indexStateOptions), researchOutputs);
      } else {
        researchOutputs.items.forEach((output) =>
          set(researchOutputState(output.id), output),
        );
        set(researchOutputIndexState(indexStateOptions), {
          total: researchOutputs.total,
          ids: researchOutputs.items.map(({ id }) => id),
          algoliaIndexName: researchOutputs.algoliaIndexName,
          algoliaQueryId: researchOutputs.algoliaQueryId,
        });
      }
    },
});

export const refreshResearchOutputState = atomFamily<number, string>({
  key: 'refreshResearchOutput',
  default: 0,
});

const fetchResearchOutputState = selectorFamily<
  ResearchOutputResponse | undefined,
  string
>({
  key: 'fetchResearchOutput',
  get:
    (id) =>
    async ({ get }) => {
      get(refreshResearchOutputState(id));
      const authorization = get(authorizationState);
      return getResearchOutput(id, authorization);
    },
});
export const researchOutputState = atomFamily<
  ResearchOutputResponse | undefined,
  string
>({
  key: 'researchOutput',
  default: fetchResearchOutputState,
});

export const useResearchOutputById = (id: string) =>
  useRecoilValue(researchOutputState(id));

export const useResearchOutputs = (options: ResearchOutputListOptions) => {
  const [researchOutputs, setResearchOutputs] = useRecoilState(
    researchOutputsState(options),
  );
  const { client } = useAlgolia();
  const authorization = useRecoilValue(authorizationState);
  if (researchOutputs === undefined) {
    throw (
      options.draftsOnly
        ? getDraftResearchOutputs(options, authorization)
        : getResearchOutputs(client, options).then(
            (data): ListResearchOutputResponse => ({
              total: data.nbHits,
              items: data.hits,
              algoliaQueryId: data.queryID,
              algoliaIndexName: data.index,
            }),
          )
    )
      .then(setResearchOutputs)
      .catch(setResearchOutputs);
  }
  if (researchOutputs instanceof Error) {
    throw researchOutputs;
  }
  return researchOutputs;
};

export const useSetResearchOutputItem = () => {
  const [refresh, setRefresh] = useRecoilState(refreshResearchOutputIndex);
  return useRecoilCallback(
    ({ set }) =>
      (researchOutput: ResearchOutputResponse) => {
        setRefresh(refresh + 1);
        set(researchOutputState(researchOutput.id), researchOutput);
      },
  );
};

export const useInvalidateResearchOutputIndex = () => {
  const [refresh, setRefresh] = useRecoilState(refreshResearchOutputIndex);

  return useCallback(() => {
    setRefresh(refresh + 1);
  }, [refresh, setRefresh]);
};

export const useCanShareResearchOutput = (
  association: 'teams' | 'workingGroups',
  associationIds: string[],
): boolean => {
  const user = useCurrentUserCRN();
  const userRole = getUserRole(user, association, associationIds);
  return hasShareResearchOutputPermission(userRole);
};

export const useResearchOutputPermissions = (
  association: 'teams' | 'workingGroups',
  associationIds: string[],
  published: boolean,
): {
  canEditResearchOutput: boolean;
  canPublishResearchOutput: boolean;
  canShareResearchOutput: boolean;
} => {
  const user = useCurrentUserCRN();
  const userRole = getUserRole(user, association, associationIds);
  return {
    canEditResearchOutput: hasEditResearchOutputPermission(userRole, published),
    canPublishResearchOutput: hasPublishResearchOutputPermission(userRole),
    canShareResearchOutput: hasShareResearchOutputPermission(userRole),
  };
};
