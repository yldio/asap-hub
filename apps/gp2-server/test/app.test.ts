import supertest from 'supertest';
import { authHandlerMock } from './mocks/auth-handler.mock';

import { PageDataProvider } from '../src/data-providers/types';

describe('Contentful feature flag', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe('Page Data Provider', () => {
    const pageSquidexDataProviderMock = {
      fetch: jest.fn(),
    } as unknown as jest.Mocked<PageDataProvider>;

    const pageContentfulDataProviderMock = {
      fetch: jest.fn(),
    } as unknown as jest.Mocked<PageDataProvider>;

    test('page controller uses squidex data provider when GP2_CONTENTFUL_ENABLED is false', async () => {
      process.env.GP2_CONTENTFUL_ENABLED = 'false';

      const { appFactory } = require('../src/app');

      const app = appFactory({
        pageSquidexDataProvider: pageSquidexDataProviderMock,
        pageContentfulDataProvider: pageContentfulDataProviderMock,
        authHandler: authHandlerMock,
      });
      await supertest(app).get('/pages/privacy-policy');

      expect(pageSquidexDataProviderMock.fetch).toHaveBeenCalledTimes(1);
      expect(pageContentfulDataProviderMock.fetch).not.toHaveBeenCalled();
    });

    test('page controller uses squidex data provider when GP2_CONTENTFUL_ENABLED undefined', async () => {
      process.env.GP2_CONTENTFUL_ENABLED = undefined;

      const { appFactory } = require('../src/app');

      const app = appFactory({
        pageSquidexDataProvider: pageSquidexDataProviderMock,
        pageContentfulDataProvider: pageContentfulDataProviderMock,
        authHandler: authHandlerMock,
      });
      await supertest(app).get('/pages/privacy-policy');

      expect(pageSquidexDataProviderMock.fetch).toHaveBeenCalledTimes(1);
      expect(pageContentfulDataProviderMock.fetch).not.toHaveBeenCalled();
    });

    test('page controller uses contentful data provider when GP2_CONTENTFUL_ENABLED is true', async () => {
      process.env.GP2_CONTENTFUL_ENABLED = 'true';

      const { appFactory } = require('../src/app');

      const app = appFactory({
        authHandler: authHandlerMock,
        pageSquidexDataProvider: pageSquidexDataProviderMock,
        pageContentfulDataProvider: pageContentfulDataProviderMock,
      });
      await supertest(app).get('/pages/privacy-policy');

      expect(pageSquidexDataProviderMock.fetch).not.toHaveBeenCalled();
      expect(pageContentfulDataProviderMock.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
