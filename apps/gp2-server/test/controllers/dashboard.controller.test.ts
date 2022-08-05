import Dashboard from '../../src/controllers/dashboard.controller';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';
describe('Dashboard controller', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const userController = new Dashboard(squidexGraphqlClientMock);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('Should return empty dashboard', async () => {
      const result = await userController.fetch();
      expect(result).toEqual({ news: [], pages: [] });
    });
  });
});
