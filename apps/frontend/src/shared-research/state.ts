import useDeepCompareEffect from 'use-deep-compare-effect';
import {
  atomFamily,
  selectorFamily,
  useRecoilValue,
  DefaultValue,
  useRecoilState,
} from 'recoil';
import {
  ListResearchOutputResponse,
  ResearchOutputResponse,
} from '@asap-hub/model';

import { getResearchOutput, getResearchOutputs } from './api';
import { GetListOptions } from '../api-util';
import { authorizationState } from '../auth/state';
import { CARD_VIEW_PAGE_SIZE } from '../hooks';

const researchOutputIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  GetListOptions
>({
  key: 'researchOutputIndex',
  default: undefined,
});
export const researchOutputsState = selectorFamily<
  ListResearchOutputResponse | Error | undefined,
  GetListOptions
>({
  key: 'researchOutputs',
  get:
    (options) =>
    ({ get }) => {
      const index = get(researchOutputIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const researchOutputs: ResearchOutputResponse[] = [];
      for (const id of index.ids) {
        const researchOutput = get(researchOutputState(id));
        if (researchOutput === undefined) return undefined;
        researchOutputs.push(researchOutput);
      }
      return { total: index.total, items: researchOutputs };
    },
  set:
    (options) =>
    ({ get, set, reset }, researchOutput) => {
      if (
        researchOutput === undefined ||
        researchOutput instanceof DefaultValue
      ) {
        const oldOutputs = get(researchOutputIndexState(options));
        if (!(oldOutputs instanceof Error)) {
          oldOutputs?.ids?.forEach((id) => reset(researchOutputState(id)));
        }
        reset(researchOutputIndexState(options));
      } else if (researchOutput instanceof Error) {
        set(researchOutputIndexState(options), researchOutput);
      } else {
        researchOutput.items.forEach((output) =>
          set(researchOutputState(output.id), output),
        );
        set(researchOutputIndexState(options), {
          total: researchOutput.total,
          ids: researchOutput.items.map((output) => output.id),
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

export const usePrefetchResearchOutputs = (
  options: GetListOptions = {
    currentPage: 0,
    pageSize: CARD_VIEW_PAGE_SIZE,
    searchQuery: '',
    filters: new Set(),
  },
) => {
  const authorization = useRecoilValue(authorizationState);
  const [researchOutputs, setResearchOutputs] = useRecoilState(
    researchOutputsState(options),
  );
  useDeepCompareEffect(() => {
    if (researchOutputs === undefined) {
      getResearchOutputs(options, authorization)
        .then(setResearchOutputs)
        .catch();
    }
  }, [authorization, researchOutputs, options, setResearchOutputs]);
};
export const useResearchOutputs = (options: GetListOptions) => {
  const authorization = useRecoilValue(authorizationState);
  const [researchOutputs, setResearchOutputs] = useRecoilState(
    researchOutputsState(options),
  );
  if (researchOutputs === undefined) {
    throw getResearchOutputs(options, authorization)
      .then(setResearchOutputs)
      .catch(setResearchOutputs);
  }
  if (researchOutputs instanceof Error) {
    throw researchOutputs;
  }
  return researchOutputs;
};
