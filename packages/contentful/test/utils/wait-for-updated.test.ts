import { waitForUpdated } from '../../src/utils/wait-for-updated';

describe('waitForUpdated', () => {
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

    await waitForUpdated(2, fetchData, 'users');
    expect(fetchData).toHaveBeenCalledTimes(3);
  });

  test('throws if polling query does not return a value', async () => {
    const fetchData = jest.fn().mockResolvedValueOnce({
      users: null,
    });

    expect(
      async () => await waitForUpdated(2, fetchData, 'users'),
    ).rejects.toThrow();
  });
});
