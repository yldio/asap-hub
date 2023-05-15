import { pollContentfulDeliveryApi, pollContentfulGql } from '../../src/utils';

describe('pollContentfulGql', () => {
  test('checks version of published data and polls until they match', async () => {
    const userDataWithPublishedVersion1 = {
      users: {
        sys: {
          publishedVersion: 1,
        },
      },
    };

    const userDataWithPublishedVersion2 = {
      users: {
        sys: {
          publishedVersion: 2,
        },
      },
    };

    const fetchData = jest
      .fn()
      .mockResolvedValueOnce(userDataWithPublishedVersion1)
      .mockResolvedValueOnce(userDataWithPublishedVersion1)
      .mockResolvedValueOnce(userDataWithPublishedVersion2);

    await pollContentfulGql(2, fetchData, 'users');
    expect(fetchData).toHaveBeenCalledTimes(3);
  });

  test('throws if polling query does not return a value', async () => {
    const fetchData = jest.fn().mockResolvedValueOnce({
      users: null,
    });

    expect(
      async () => await pollContentfulGql(2, fetchData, 'users'),
    ).rejects.toThrow();
  });
});

describe('pollContentfulDeliveryApi', () => {
  test('checks version of published counter and polls until they match and return entry', async () => {
    const entryDataWithPublishedCounter1 = {
      sys: {
        revision: 1,
      },
    };

    const entryDataWithPublishedCounter2 = {
      sys: {
        revision: 2,
      },
    };

    const fetchEntry = jest
      .fn()
      .mockResolvedValueOnce(entryDataWithPublishedCounter1)
      .mockResolvedValueOnce(entryDataWithPublishedCounter1)
      .mockResolvedValueOnce(entryDataWithPublishedCounter2);

    const response = await pollContentfulDeliveryApi(fetchEntry, 2);
    expect(fetchEntry).toHaveBeenCalledTimes(3);
    expect(response).toEqual(entryDataWithPublishedCounter2);
  });

  test('throws if polling query does not return a value', async () => {
    const fetchEntry = jest.fn().mockResolvedValueOnce(null);

    expect(
      async () => await pollContentfulDeliveryApi(fetchEntry, 2),
    ).rejects.toThrow();
  });
});
