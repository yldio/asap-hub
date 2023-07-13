import supertest from 'supertest';
import { authHandlerMock } from './mocks/auth-handler.mock';

import { PageDataProvider } from '../src/data-providers/types';
import { appFactory } from '../src/app';
import { loggerMock } from './mocks/logger.mock';

describe('Contentful feature flag', () => {
  jest.setTimeout(30000);
  beforeEach(jest.resetAllMocks);

  describe('Page Data Provider', () => {
    test('page controller uses data provider', async () => {
      const pageContentfulDataProviderMock = {
        fetch: jest.fn().mockResolvedValue({ items: [{}], total: 0 }),
      } as unknown as jest.Mocked<PageDataProvider>;

      const app = appFactory({
        pageContentfulDataProvider: pageContentfulDataProviderMock,
        authHandler: authHandlerMock,
        logger: loggerMock,
      });
      await supertest(app).get('/pages/privacy-policy');

      expect(pageContentfulDataProviderMock.fetch).toHaveBeenCalled();
    });
  });
});
