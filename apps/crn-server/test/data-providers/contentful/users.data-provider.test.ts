import { UserContentfulDataProvider } from '../../../src/data-providers/contentful/users.data-provider';

describe('User data provider', () => {
  const userDataProvider = new UserContentfulDataProvider();

  describe('Fetch-by-ID', () => {
    test('should receive null', async () => {
      const result = await userDataProvider.fetchById();
      expect(result).toEqual(expect.any(Object));
    });
  });

  describe('Fetch', () => {
    test('should receive a fixed user list', async () => {
      const result = await userDataProvider.fetch();
      expect(result).toEqual({
        items: [expect.any(Object)],
        total: 1,
      });
    });
  });

  describe('Create', () => {
    test('should throw an error', async () => {
      await expect(userDataProvider.create()).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });

  describe('Update', () => {
    test('should throw an error', async () => {
      await expect(userDataProvider.update()).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });
});
