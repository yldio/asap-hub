import { GetListOptions } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { atom, selectorFamily, useRecoilValue } from 'recoil';
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
  const authorization = useRecoilValue(authorizationState);
  return (payload: gp2.OutputPostRequest) =>
    createOutput(payload, authorization);
};
