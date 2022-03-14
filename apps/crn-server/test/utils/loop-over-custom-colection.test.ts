import { ListResponse } from '@asap-hub/model';
import { loopOverCustomCollection } from '../../src/utils/loop-over-custom-colection';

export const xxloopOverCustomCollection = async <TResponse>(
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

describe('LoopOverCustomCollection', () => {
  test('should iterate over empty collection', async () => {
    const fetcher = jest
      .fn()
      .mockReturnValueOnce({ items: [], total: 0 } as ListResponse<{}>);
    const processEntities = jest.fn();

    await loopOverCustomCollection(fetcher, processEntities, 8);

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toBeCalledWith({ skip: 0, take: 8 });

    expect(processEntities).toHaveBeenCalledTimes(1);
    expect(processEntities).toBeCalledWith({ items: [], total: 0 });
  });

  test('should iterate over small collection', async () => {
    const fetcher = jest.fn().mockReturnValueOnce({
      items: Array(8).fill({}),
      total: 8,
    } as ListResponse<{}>);
    const processEntities = jest.fn();

    await loopOverCustomCollection(fetcher, processEntities, 8);

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toBeCalledWith({ skip: 0, take: 8 });

    expect(processEntities).toHaveBeenCalledTimes(1);
    expect(processEntities).toBeCalledWith({
      items: Array(8).fill({}),
      total: 8,
    });
  });

  test('should iterate over large collection', async () => {
    const returnedValue = {
      items: Array(8).fill({}),
      total: 24,
    } as ListResponse<{}>;
    const fetcher = jest.fn().mockReturnValue(returnedValue);
    const processEntities = jest.fn();

    await loopOverCustomCollection(fetcher, processEntities, 8);

    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(fetcher).toHaveBeenNthCalledWith(1, { skip: 0, take: 8 });
    expect(fetcher).toHaveBeenNthCalledWith(2, { skip: 8, take: 8 });
    expect(fetcher).toHaveBeenNthCalledWith(3, { skip: 16, take: 8 });

    expect(processEntities).toHaveBeenCalledTimes(3);
    expect(processEntities).toHaveBeenNthCalledWith(1, returnedValue);
    expect(processEntities).toHaveBeenNthCalledWith(2, returnedValue);
    expect(processEntities).toHaveBeenNthCalledWith(3, returnedValue);
  });
});
