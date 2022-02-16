import { ListResponse } from '@asap-hub/model';

export const loopOverCustomCollection = async <TResponse>(
  fetcher: (skip: number) => Promise<ListResponse<TResponse>>,
  processEntities: (result: ListResponse<TResponse>) => Promise<void>,
): Promise<void> => {
  let pointer = 0;
  let results: ListResponse<TResponse>;

  do {
    results = await fetcher(pointer);

    await processEntities(results);

    pointer += 10;
  } while (pointer < results.total);
};
