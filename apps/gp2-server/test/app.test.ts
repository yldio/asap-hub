import supertest from 'supertest';
import { authHandlerMock } from './mocks/auth-handler.mock';

import { PageDataProvider } from '../src/data-providers/types';

describe('Contentful feature flag', () => {
  const OLD_ENV = process.env;

  jest.setTimeout(30000);
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe('Page Data Provider', () => {
    const pageContentfulDataProviderMock = {
      fetch: jest.fn(),
    } as unknown as jest.Mocked<PageDataProvider>;

    test('page controller uses data provider', async () => {
      const { appFactory } = require('../src/app');

      const app = appFactory({
        pageContentfulDataProvider: pageContentfulDataProviderMock,
        authHandler: authHandlerMock,
      });
      await supertest(app).get('/pages/privacy-policy');

      expect(pageContentfulDataProviderMock.fetch).toHaveBeenCalled();
    });
  });
});
