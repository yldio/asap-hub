import { gp2 } from '@asap-hub/model';
import {
  atom,
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { authorizationState } from '../auth/state';
import { useAlgolia } from '../hooks/algolia';
import { getExternalUsers, getUsers } from '../users/api';
import {
  createOutput,
  getOutput,
  getOutputs,
  OutputListOptions,
  updateOutput,
} from './api';

const outputIndexState = atomFamily<
  | {
      ids: ReadonlyArray<string>;
      total: number;
      algoliaQueryId?: string;
      algoliaIndexName?: string;
    }
  | Error
  | undefined,
  OutputListOptions
>({
  key: 'outputIndex',
  default: undefined,
});
export const outputsState = selectorFamily<
  gp2.ListOutputResponse | Error | undefined,
  OutputListOptions
>({
  key: 'outputs',
  get:
    (options) =>
    ({ get }) => {
      const index = get(
        outputIndexState({
          ...options,
        }),
      );
      if (index === undefined || index instanceof Error) return index;
      const outputs: gp2.OutputResponse[] = [];
      for (const id of index.ids) {
        const output = get(outputState(id));
        if (output === undefined) return undefined;
        outputs.push(output);
      }
      return {
        total: index.total,
        items: outputs,
        algoliaQueryId: index.algoliaQueryId,
        algoliaIndexName: index.algoliaIndexName,
      };
    },
  set:
    (options) =>
    ({ get, set, reset }, outputs) => {
      const indexStateOptions = { ...options };
      if (outputs === undefined || outputs instanceof DefaultValue) {
        const oldOutputs = get(outputIndexState(indexStateOptions));
        if (!(oldOutputs instanceof Error)) {
          oldOutputs?.ids?.forEach((id) => reset(outputState(id)));
        }
        reset(outputIndexState(indexStateOptions));
      } else if (outputs instanceof Error) {
        set(outputIndexState(indexStateOptions), outputs);
      } else {
        outputs.items.forEach((output) => set(outputState(output.id), output));
        set(outputIndexState(indexStateOptions), {
          total: outputs.total,
          ids: outputs.items.map(({ id }) => id),
          algoliaIndexName: outputs.algoliaIndexName,
          algoliaQueryId: outputs.algoliaQueryId,
        });
      }
    },
});

const fetchOutputState = selectorFamily<gp2.OutputResponse | undefined, string>(
  {
    key: 'fetchOutput',
    get:
      (id) =>
      async ({ get }) => {
        const authorization = get(authorizationState);
        return getOutput(id, authorization);
      },
  },
);
export const outputState = atomFamily<gp2.OutputResponse | undefined, string>({
  key: 'output',
  default: fetchOutputState,
});
const refreshOutputsState = atom<number>({
  key: 'refreshOutputsState',
  default: 0,
});

const patchedOutputState = atomFamily<gp2.OutputResponse | undefined, string>({
  key: 'patchedOutput',
  default: undefined,
});

const OutputState = selectorFamily<gp2.OutputResponse | undefined, string>({
  key: 'output',
  get:
    (id) =>
    ({ get }) =>
      get(patchedOutputState(id)) ?? get(fetchOutputState(id)),
});

export const useOutputs = (options: OutputListOptions) => {
  const [outputs, setOutputs] = useRecoilState(outputsState(options));
  const { client } = useAlgolia();
  if (outputs === undefined) {
    throw getOutputs(client, options)
      .then(
        (data): gp2.ListOutputResponse => ({
          total: data.nbHits,
          items: data.hits,
          algoliaQueryId: data.queryID,
          algoliaIndexName: data.index,
        }),
      )
      .then(setOutputs)
      .catch(setOutputs);
  }
  if (outputs instanceof Error) {
    throw outputs;
  }
  return outputs;
};

export const useOutputById = (id: string) => useRecoilValue(OutputState(id));

export const useCreateOutput = () => {
  const [refresh, setRefresh] = useRecoilState(refreshOutputsState);
  const authorization = useRecoilValue(authorizationState);
  return async (payload: gp2.OutputPostRequest) => {
    const output = await createOutput(payload, authorization);
    setRefresh(refresh + 1);
    return output;
  };
};

export const useUpdateOutput = (id: string) => {
  const [refresh, setRefresh] = useRecoilState(refreshOutputsState);
  const authorization = useRecoilValue(authorizationState);
  const setPatchedOutput = useSetRecoilState(patchedOutputState(id));
  return async (payload: gp2.OutputPutRequest) => {
    const output = await updateOutput(id, payload, authorization);
    setRefresh(refresh + 1);
    setPatchedOutput(output);
    return output;
  };
};

export const useAuthorSuggestions = () => {
  const authorization = useRecoilValue(authorizationState);

  return async (search: string) => {
    const users = await getUsers({ search, skip: 0, take: 10 }, authorization);
    const externalUsers = await getExternalUsers(
      { search, skip: 0, take: 10 },
      authorization,
    );
    return [...users.items, ...externalUsers.items]
      .map((author) => ({
        author,
        label: author.displayName,
        value: author.id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  };
};
