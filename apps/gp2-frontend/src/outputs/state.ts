import { GetListOptions } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { atom, selectorFamily, useRecoilState, useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { createOutput, getOutputs } from './api';

export const outputsState = selectorFamily<
  gp2.ListOutputResponse,
  GetListOptions
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

export const useOutputs = (options: GetListOptions) =>
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
