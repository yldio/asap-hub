import supertest from 'supertest';
import { authHandlerMock } from './mocks/auth-handler.mock';

import {
  NewsDataProvider,
  PageDataProvider,
} from '../src/data-providers/types';

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

  describe('News Data Provider', () => {
    const newsSquidexDataProviderMock = {
      fetch: jest.fn(),
    } as unknown as jest.Mocked<NewsDataProvider>;

    const newsContentfulDataProviderMock = {
      fetch: jest.fn(),
    } as unknown as jest.Mocked<NewsDataProvider>;

    test.each(['false', undefined])(
      'news controller uses squidex data provider when GP2_CONTENTFUL_ENABLED is %s',
      async (enabled) => {
        process.env.GP2_CONTENTFUL_ENABLED = enabled;

        const { appFactory } = require('../src/app');

        const app = appFactory({
          newsSquidexDataProvider: newsSquidexDataProviderMock,
          newsContentfulDataProvider: newsContentfulDataProviderMock,
          authHandler: authHandlerMock,
        });
        await supertest(app).get('/news');

        expect(newsSquidexDataProviderMock.fetch).toHaveBeenCalledTimes(1);

        expect(newsContentfulDataProviderMock.fetch).not.toHaveBeenCalled();
      },
      10_000,
    );

    test('news controller uses contentful data provider when GP2_CONTENTFUL_ENABLED is true', async () => {
      process.env.GP2_CONTENTFUL_ENABLED = 'true';

      const { appFactory } = require('../src/app');

      const app = appFactory({
        authHandler: authHandlerMock,
        newsSquidexDataProvider: newsSquidexDataProviderMock,
        newsContentfulDataProvider: newsContentfulDataProviderMock,
      });
      await supertest(app).get('/news');

      expect(newsSquidexDataProviderMock.fetch).not.toHaveBeenCalled();

      expect(newsContentfulDataProviderMock.fetch).toHaveBeenCalledTimes(1);
    });
  });
  describe('Page Data Provider', () => {
    const pageSquidexDataProviderMock = {
      fetch: jest.fn(),
    } as unknown as jest.Mocked<PageDataProvider>;

    const pageContentfulDataProviderMock = {
      fetch: jest.fn(),
    } as unknown as jest.Mocked<PageDataProvider>;

    test.each(['false', undefined])(
      'page controller uses squidex data provider when GP2_CONTENTFUL_ENABLED is %s',
      async (enabled) => {
        process.env.GP2_CONTENTFUL_ENABLED = enabled;

        const { appFactory } = require('../src/app');

        const app = appFactory({
          pageSquidexDataProvider: pageSquidexDataProviderMock,
          pageContentfulDataProvider: pageContentfulDataProviderMock,
          authHandler: authHandlerMock,
        });
        await supertest(app).get('/pages/privacy-policy');

        expect(pageSquidexDataProviderMock.fetch).toHaveBeenCalledTimes(1);
        expect(pageContentfulDataProviderMock.fetch).not.toHaveBeenCalled();
      },
    );

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
