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
        // Errors re-throw to the error boundary; non-Error rejections
        // become an empty list.
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
    // Deliberate change from the legacy behavior, which refreshed no list on
    // create: invalidate so new outputs show up.
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
    // Write the mutation response straight into the detail cache (never
    // refetched). updateOutput may resolve undefined; cache null so the
    // queryFn contract holds and useOutputById maps it back.
    queryClient.setQueryData(outputQueryKeys.detail(id), output ?? null);
    // Deliberate change from the legacy behavior, which refreshed no list on
    // update: invalidate so the updated output shows through.
    await queryClient.invalidateQueries({
      queryKey: outputQueryKeys.lists(),
    });
    return output;
  };
};
