import { gp2 } from '@asap-hub/model';
import {
  atom,
  atomFamily,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { authorizationState } from '../auth/state';
import { getExternalUsers, getUsers } from '../users/api';
import { createOutput, getOutput, getOutputs, updateOutput } from './api';

export const outputsState = selectorFamily<
  gp2.ListOutputResponse,
  gp2.FetchOutputOptions
>({
  key: 'outputState',
  get:
    (options) =>
    ({ get }) =>
      getOutputs(get(authorizationState), options),
});

const refreshOutputsState = atom<number>({
  key: 'refreshOutputsState',
  default: 0,
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

export const useOutputs = (options: gp2.FetchOutputOptions) =>
  useRecoilValue(outputsState(options));

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

  return async (searchQuery: string) => {
    const users = await getUsers(
      { search: searchQuery, skip: 0, take: 10 },
      authorization,
    );
    const externalUsers = await getExternalUsers(
      { search: searchQuery, skip: 0, take: 10 },
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
