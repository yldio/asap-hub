import {
  ListResearchOutputResponse,
  ResearchOutputResponse,
} from '@asap-hub/model';
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
import { authorizationState } from '../auth/state';
import { useAlgolia } from '../hooks/algolia';
import {
  getResearchOutput,
  getResearchOutputs,
  ResearchOutputListOptions,
} from './api';

type RefreshResearchOutputListOptions = ResearchOutputListOptions & {
  refreshToken: number;
};

const researchOutputIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
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
      return { total: index.total, items: researchOutputs };
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
  if (researchOutputs === undefined) {
    throw getResearchOutputs(client, options)
      .then(
        (data): ListResearchOutputResponse => ({
          total: data.nbHits,
          items: data.hits,
        }),
      )
      .then(setResearchOutputs)
      .catch(setResearchOutputs);
  }
  if (researchOutputs instanceof Error) {
    throw researchOutputs;
  }
  return researchOutputs;
};

const setResearchOutput = selector<ResearchOutputResponse | undefined>({
  key: 'setResearchOutput',
  get: () => undefined,
  set: ({ set }, researchOutput) => {
    if (
      researchOutput instanceof DefaultValue ||
      researchOutput === undefined
    ) {
      return;
    }
    set(researchOutputState(researchOutput.id), researchOutput);
  },
});

export const useSetResearchOutputItem = () => {
  const [refresh, setRefresh] = useRecoilState(refreshResearchOutputIndex);
  const setResearchOutputItem = useSetRecoilState(setResearchOutput);
  return (researhOutput: ResearchOutputResponse) => {
    setResearchOutputItem(researhOutput);
    setRefresh(refresh + 1);
  };
};
