import {
  ListResearchOutputResponse,
  ResearchOutputPostRequest,
  ResearchOutputResponse,
} from '@asap-hub/model';
import {
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
import { createTeamResearchOutput } from '../network/teams/api';
import {
  getResearchOutput,
  getResearchOutputs,
  ResearchOutputListOptions,
} from './api';

const researchOutputIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  ResearchOutputListOptions
>({
  key: 'researchOutputIndex',
  default: undefined,
});
export const researchOutputsState = selectorFamily<
  ListResearchOutputResponse | Error | undefined,
  ResearchOutputListOptions
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

export const setResearchOutput = selector<ResearchOutputResponse | undefined>({
  key: 'setResearchOutput',
  get: ({ get }) => get(researchOutputState('te')),
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

export const usePostTeamResearchOutput = () => {
  const authorization = useRecoilValue(authorizationState);
  const setResearchOutputItem = useSetRecoilState(setResearchOutput);
  return async (payload: ResearchOutputPostRequest) => {
    const researchOutput = await createTeamResearchOutput(
      payload,
      authorization,
    );
    setResearchOutputItem(researchOutput);
    return researchOutput;
  };
};
