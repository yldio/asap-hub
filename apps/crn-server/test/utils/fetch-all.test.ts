import { fetchAll } from '../../src/utils/fetch-all';
import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('Fetch All', () => {
  const dataProvider = getDataProviderMock();

  test('Should return an empty list when there are no items', async () => {
    dataProvider.fetch.mockResolvedValueOnce({
      total: 0,
      items: [],
    });
    const result = await fetchAll(dataProvider);

    expect(result).toEqual({ items: [], total: 0 });
  });

  test('Should return all items', async () => {
    dataProvider.fetch.mockResolvedValueOnce({
      total: 2,
      items: [{ id: 1 }],
    });
    dataProvider.fetch.mockResolvedValueOnce({
      total: 2,
      items: [{ id: 2 }],
    });

    const result = await fetchAll(dataProvider);

    expect(result).toEqual({
      items: [{ id: 1 }, { id: 2 }],
      total: 2,
    });
  });

  test('Should pass the pagination parameters as expected', async () => {
    const tags = {
      items: Array.from({ length: 100 }),
      total: 400,
    };

    dataProvider.fetch.mockResolvedValue(tags);

    await fetchAll(dataProvider, {
      key1: 'val1',
      key2: 'val2',
    });

    expect(dataProvider.fetch).toHaveBeenCalledWith({
      take: 100,
      skip: 0,
      filter: { key1: 'val1', key2: 'val2' },
    });

    expect(dataProvider.fetch).toHaveBeenCalledWith({
      take: 100,
      skip: 100,
      filter: { key1: 'val1', key2: 'val2' },
    });
  });

  test('Should pass the filter parameter as expected', async () => {
    const tags = {
      items: [],
      total: 0,
    };

    dataProvider.fetch.mockResolvedValue(tags);

    await fetchAll(dataProvider, {
      key: 'val',
    });

    expect(dataProvider.fetch).toHaveBeenCalledWith({
      take: 100,
      skip: 0,
      filter: {
        key: 'val',
      },
    });
  });
});
