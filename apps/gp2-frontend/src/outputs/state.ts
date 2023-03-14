import { gp2 } from '@asap-hub/model';
import { atom, selectorFamily, useRecoilState, useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { getExternalUsers, getUsers } from '../users/api';
import { createOutput, getOutputs } from './api';

export const outputsState = selectorFamily<
  gp2.ListOutputResponse,
  gp2.FetchOutputOptions
>({
  key: 'outputState',
  get:
    (options) =>
    ({ get }) => {
      get(refreshOutputsState);
      return getOutputs(get(authorizationState), options);
    },
});

export const refreshOutputsState = atom<number>({
  key: 'refreshOutputsState',
  default: 0,
});

export const useOutputs = (options: gp2.FetchOutputOptions) =>
  useRecoilValue(outputsState(options));

export const useCreateOutput = () => {
  const [refresh, setRefresh] = useRecoilState(refreshOutputsState);
  const authorization = useRecoilValue(authorizationState);
  return async (payload: gp2.OutputPostRequest) => {
    const output = await createOutput(payload, authorization);
    setRefresh(refresh + 1);
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
