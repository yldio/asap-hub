import {
  createQueryKeys,
  nullOnUndefined,
  withEmptyListFallback,
} from '@asap-hub/frontend-utils';
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

export const outputQueryKeys = createQueryKeys<OutputListOptions>('outputs');

export const useOutputs = (
  options: OutputListOptions,
): gp2.ListOutputResponse => {
  const { client } = useAlgolia();
  return useSuspenseQuery({
    queryKey: outputQueryKeys.list(options),
    queryFn: (): Promise<gp2.ListOutputResponse> =>
      withEmptyListFallback<gp2.ListOutputResponse>(
        async () => {
          const data = await getOutputs(client, options);
          return {
            total: data.nbHits ?? 0,
            items: data.hits,
            algoliaQueryId: data.queryID,
            algoliaIndexName: data.index,
          };
        },
        { total: 0, items: [] },
      ),
  }).data;
};

export const useOutputById = (id: string): gp2.OutputResponse | undefined => {
  const getAuthorization = useAuthorization();
  const { data } = useSuspenseQuery({
    queryKey: outputQueryKeys.detail(id),
    // This detail cache is also the patched-overlay target for
    // useUpdateOutput (§6.1), so its value is never refetched over a fresh
    // mutation write.
    queryFn: () =>
      nullOnUndefined(async () => getOutput(id, await getAuthorization())),
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
