import { ListResponse } from '@asap-hub/model';

export type LoopOverCustomCollectionFetchOptions = {
  skip: number;
  take: number;
};

export const loopOverCustomCollection = async <TResponse>(
  fetcher: ({
    skip,
    take,
  }: LoopOverCustomCollectionFetchOptions) => Promise<ListResponse<TResponse>>,
  processEntities: (result: ListResponse<TResponse>) => Promise<void>,
  batchSize: number,
): Promise<void> => {
  let pointer = 0;
  let results: ListResponse<TResponse>;

  do {
    results = await fetcher({ skip: pointer, take: batchSize });

    await processEntities(results);

    pointer += batchSize;
  } while (pointer < results.total);
};
