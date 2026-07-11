import { normalizeListOptions } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { useAuthorization } from '../auth/useAuthorization';
import { useAlgolia } from '../hooks/algolia';
import {
  createOutput,
  getOutput,
  getOutputs,
  OutputListOptions,
  updateOutput,
} from './api';

export const outputQueryKeys = {
  all: ['outputs'] as const,
  lists: () => [...outputQueryKeys.all, 'list'] as const,
  list: (options: OutputListOptions) =>
    [...outputQueryKeys.lists(), normalizeListOptions(options)] as const,
  details: () => [...outputQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...outputQueryKeys.details(), id] as const,
};

export const useOutputs = (
  options: OutputListOptions,
): gp2.ListOutputResponse => {
  const { client } = useAlgolia();
  return useSuspenseQuery({
    queryKey: outputQueryKeys.list(options),
    queryFn: async (): Promise<gp2.ListOutputResponse> => {
      try {
        const data = await getOutputs(client, options);
        return {
          total: data.nbHits ?? 0,
          items: data.hits,
          algoliaQueryId: data.queryID,
          algoliaIndexName: data.index,
        };
      } catch (error) {
        // Preserved from the recoil hook's `.catch(setOutputs)`: an Error
        // rejection was cached and re-thrown to the error boundary, while a
        // non-Error rejection was swallowed. Map non-Errors to an empty list.
        if (error instanceof Error) {
          throw error;
        }
        return { total: 0, items: [] };
      }
    },
  }).data;
};

export const useOutputById = (id: string): gp2.OutputResponse | undefined => {
  const getAuthorization = useAuthorization();
  const { data } = useSuspenseQuery({
    queryKey: outputQueryKeys.detail(id),
    // getOutput resolves undefined on a 404, but a queryFn must not return
    // undefined — cache null and map it back below. This detail cache is also
    // the patched-overlay target for useUpdateOutput (§6.1), so its value is
    // never refetched over a fresh mutation write.
    queryFn: async () =>
      (await getOutput(id, await getAuthorization())) ?? null,
  });
  return data ?? undefined;
};

export const useCreateOutput = () => {
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  return async (payload: gp2.OutputPostRequest) => {
    const output = await createOutput(payload, await getAuthorization());
    // SANCTIONED BEHAVIOR CHANGE (§6.1 / R5): the recoil hook bumped a
    // `refreshOutputsState` counter that nothing ever read, so creating an
    // output refreshed no list. Wire up the invalidation the code intended.
    await queryClient.invalidateQueries({
      queryKey: outputQueryKeys.lists(),
    });
    return output;
  };
};

export const useUpdateOutput = (id: string) => {
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  return async (payload: gp2.OutputPutRequest) => {
    const output = await updateOutput(id, payload, await getAuthorization());
    // R3 patched-overlay: write the mutation response straight into the detail
    // cache (never refetched — §6.1). updateOutput may resolve undefined; cache
    // null so the queryFn contract holds and useOutputById maps it back.
    queryClient.setQueryData(outputQueryKeys.detail(id), output ?? null);
    // SANCTIONED BEHAVIOR CHANGE (§6.1 / R5): the recoil hook also bumped the
    // vestigial `refreshOutputsState` counter (never read). Invalidate the
    // lists so an updated output shows through where the counter intended to.
    await queryClient.invalidateQueries({
      queryKey: outputQueryKeys.lists(),
    });
    return output;
  };
};
