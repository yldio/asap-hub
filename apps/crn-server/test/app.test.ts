import supertest from 'supertest';
import { authHandlerMock } from './mocks/auth-handler.mock';

import { NewsDataProvider } from '../src/data-providers/types';
import { PageDataProvider } from '../src/data-providers/pages.data-provider';
import { DashboardDataProvider } from '../src/data-providers/dashboard.data-provider';

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
    const newsSquidexDataProviderMock: jest.Mocked<NewsDataProvider> = {
      fetch: jest.fn(),
      fetchById: jest.fn(),
    };

    const newsContentfulDataProviderMock: jest.Mocked<NewsDataProvider> = {
      fetch: jest.fn(),
      fetchById: jest.fn(),
    };

    test('news controller uses squidex data provider when IS_CONTENTFUL_ENABLED is false', async () => {
      process.env.IS_CONTENTFUL_ENABLED = 'false';

      const { appFactory } = require('../src/app');

      const app = appFactory({
        newsSquidexDataProvider: newsSquidexDataProviderMock,
        newsContentfulDataProvider: newsContentfulDataProviderMock,
        authHandler: authHandlerMock,
      });
      await supertest(app).get('/news');

      expect(newsSquidexDataProviderMock.fetch).toHaveBeenCalledTimes(1);

      expect(newsContentfulDataProviderMock.fetch).not.toHaveBeenCalled();
    });

    test('news controller uses squidex data provider when IS_CONTENTFUL_ENABLED undefined', async () => {
      process.env.IS_CONTENTFUL_ENABLED = undefined;

      const { appFactory } = require('../src/app');

      const app = appFactory({
        newsSquidexDataProvider: newsSquidexDataProviderMock,
        newsContentfulDataProvider: newsContentfulDataProviderMock,
        authHandler: authHandlerMock,
      });
      await supertest(app).get('/news');

      expect(newsSquidexDataProviderMock.fetch).toHaveBeenCalledTimes(1);

      expect(newsContentfulDataProviderMock.fetch).not.toHaveBeenCalled();
    });

    test('news controller uses contentful data provider when IS_CONTENTFUL_ENABLED is true', async () => {
      process.env.IS_CONTENTFUL_ENABLED = 'true';

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
    const pageSquidexDataProviderMock: jest.Mocked<PageDataProvider> = {
      fetch: jest.fn(),
    };

    const pageContentfulDataProviderMock: jest.Mocked<PageDataProvider> = {
      fetch: jest.fn(),
    };

    test('page controller uses squidex data provider when IS_CONTENTFUL_ENABLED is false', async () => {
      process.env.IS_CONTENTFUL_ENABLED = 'false';

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

    test('page controller uses squidex data provider when IS_CONTENTFUL_ENABLED undefined', async () => {
      process.env.IS_CONTENTFUL_ENABLED = undefined;

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

    test('page controller uses contentful data provider when IS_CONTENTFUL_ENABLED is true', async () => {
      process.env.IS_CONTENTFUL_ENABLED = 'true';

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

  describe('Dashboard Data Provider', () => {
    const dashboardSquidexDataProviderMock: jest.Mocked<DashboardDataProvider> =
      {
        fetch: jest.fn(),
      };

    const dashboardContentfulDataProviderMock: jest.Mocked<DashboardDataProvider> =
      {
        fetch: jest.fn(),
      };

    test('Dashboard controller uses squidex data provider when IS_CONTENTFUL_ENABLED is false', async () => {
      process.env.IS_CONTENTFUL_ENABLED = 'false';

      const { appFactory } = require('../src/app');

      const app = appFactory({
        dashboardSquidexDataProvider: dashboardSquidexDataProviderMock,
        dashboardContentfulDataProvider: dashboardContentfulDataProviderMock,
        authHandler: authHandlerMock,
      });
      await supertest(app).get('/dashboard');

      expect(dashboardSquidexDataProviderMock.fetch).toHaveBeenCalledTimes(1);
      expect(dashboardContentfulDataProviderMock.fetch).not.toHaveBeenCalled();
    });

    test('Dashboard controller uses squidex data provider when IS_CONTENTFUL_ENABLED undefined', async () => {
      process.env.IS_CONTENTFUL_ENABLED = undefined;

      const { appFactory } = require('../src/app');

      const app = appFactory({
        dashboardSquidexDataProvider: dashboardSquidexDataProviderMock,
        dashboardContentfulDataProvider: dashboardContentfulDataProviderMock,
        authHandler: authHandlerMock,
      });
      await supertest(app).get('/dashboard');

      expect(dashboardSquidexDataProviderMock.fetch).toHaveBeenCalledTimes(1);
      expect(dashboardContentfulDataProviderMock.fetch).not.toHaveBeenCalled();
    });

    test('Dashboard controller uses contentful data provider when IS_CONTENTFUL_ENABLED is true', async () => {
      process.env.IS_CONTENTFUL_ENABLED = 'true';

      const { appFactory } = require('../src/app');

      const app = appFactory({
        authHandler: authHandlerMock,
        dashboardSquidexDataProvider: dashboardSquidexDataProviderMock,
        dashboardContentfulDataProvider: dashboardContentfulDataProviderMock,
      });
      await supertest(app).get('/dashboard');

      expect(dashboardSquidexDataProviderMock.fetch).not.toHaveBeenCalled();
      expect(dashboardContentfulDataProviderMock.fetch).toHaveBeenCalledTimes(
        1,
      );
    });
  });
});
