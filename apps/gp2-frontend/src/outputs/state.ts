import { normalizeListOptions } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

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
  const { mutateAsync } = useMutation({
    mutationFn: async (payload: gp2.OutputPostRequest) =>
      createOutput(payload, await getAuthorization()),
    onSuccess: () => {
      // Mark lists stale without refetching now: search indexing lags the
      // mutation, so an immediate refetch would cache pre-mutation results.
      void queryClient.invalidateQueries({
        queryKey: outputQueryKeys.lists(),
        refetchType: 'none',
      });
    },
  });
  return mutateAsync;
};

export const useUpdateOutput = (id: string) => {
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (payload: gp2.OutputPutRequest) =>
      updateOutput(id, payload, await getAuthorization()),
    onSuccess: (output) => {
      // Write the mutation response straight into the detail cache (never
      // refetched). updateOutput may resolve undefined; cache null so the
      // queryFn contract holds and useOutputById maps it back.
      queryClient.setQueryData(outputQueryKeys.detail(id), output ?? null);
      // Mark lists stale without refetching now: search indexing lags the
      // mutation, so an immediate refetch would cache pre-mutation results.
      void queryClient.invalidateQueries({
        queryKey: outputQueryKeys.lists(),
        refetchType: 'none',
      });
    },
  });
  return mutateAsync;
};
