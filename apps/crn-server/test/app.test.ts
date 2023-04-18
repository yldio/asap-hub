import supertest from 'supertest';
import { authHandlerMock } from './mocks/auth-handler.mock';
import { appFactory as appFactoryDefault } from '../src/app';

import {
  DashboardDataProvider,
  NewsDataProvider,
  PageDataProvider,
  UserDataProvider,
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
      fetchById: jest.fn(),
    } as unknown as jest.Mocked<NewsDataProvider>;

    const newsContentfulDataProviderMock = {
      fetch: jest.fn(),
      fetchById: jest.fn(),
    } as unknown as jest.Mocked<NewsDataProvider>;

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
    }, 10_000);

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
    const pageSquidexDataProviderMock = {
      fetch: jest.fn(),
    } as unknown as jest.Mocked<PageDataProvider>;

    const pageContentfulDataProviderMock = {
      fetch: jest.fn(),
    } as unknown as jest.Mocked<PageDataProvider>;

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

  describe('User Data Provider', () => {
    const response: Awaited<ReturnType<UserDataProvider['fetch']>> = {
      items: [],
      total: 0,
    };
    const userSquidexDataProviderMock = {
      fetch: jest.fn(),
    } as unknown as jest.Mocked<UserDataProvider>;
    const userContentfulDataProviderMock = {
      fetch: jest.fn(),
    } as unknown as jest.Mocked<UserDataProvider>;

    beforeEach(() => {
      userSquidexDataProviderMock.fetch.mockResolvedValue(response);
      userContentfulDataProviderMock.fetch.mockResolvedValue(response);
    });

    describe('Switching with the cookie', () => {
      const app = appFactoryDefault({
        userSquidexDataProvider: userSquidexDataProviderMock,
        userContentfulDataProvider: userContentfulDataProviderMock,
        authHandler: authHandlerMock,
      });

      afterEach(() => jest.clearAllMocks());

      test('user controller uses squidex data provider when the feature flag is set to false', async () => {
        const response = await supertest(app)
          .get('/users')
          .set('X-Contentful-Enabled', 'false');

        expect(response.status).toBe(200);
        expect(userSquidexDataProviderMock.fetch).toHaveBeenCalledTimes(1);
        expect(userContentfulDataProviderMock.fetch).not.toHaveBeenCalled();
      });

      test('user controller uses squidex data provider when the feature flag is set to false', async () => {
        const response = await supertest(app)
          .get('/users')
          .set('X-Contentful-Enabled', 'true');

        expect(response.status).toBe(200);
        expect(userSquidexDataProviderMock.fetch).not.toHaveBeenCalled();
        expect(userContentfulDataProviderMock.fetch).toHaveBeenCalledTimes(1);
      });
    });

    test('user controller uses contentful data provider when the environment var is true', async () => {
      process.env.IS_CONTENTFUL_ENABLED_V2 = 'true';

      const { appFactory } = require('../src/app');

      const app = appFactory({
        userSquidexDataProvider: userSquidexDataProviderMock,
        userContentfulDataProvider: userContentfulDataProviderMock,
        authHandler: authHandlerMock,
      });
      const response = await supertest(app).get('/users');

      expect(response.status).toBe(200);
      expect(userSquidexDataProviderMock.fetch).not.toHaveBeenCalled();
      expect(userContentfulDataProviderMock.fetch).toHaveBeenCalledTimes(1);
    });

    test('user controller uses squidex data provider when the environment var is false', async () => {
      process.env.IS_CONTENTFUL_ENABLED_V2 = 'false';

      const { appFactory } = require('../src/app');

      const app = appFactory({
        userSquidexDataProvider: userSquidexDataProviderMock,
        userContentfulDataProvider: userContentfulDataProviderMock,
        authHandler: authHandlerMock,
      });
      const response = await supertest(app).get('/users');

      expect(response.status).toBe(200);
      expect(userContentfulDataProviderMock.fetch).not.toHaveBeenCalled();
      expect(userSquidexDataProviderMock.fetch).toHaveBeenCalledTimes(1);
    });

    test('user controller uses contentful data provider when the environment var is false but the cookie is set to true', async () => {
      process.env.IS_CONTENTFUL_ENABLED_V2 = 'false';

      const { appFactory } = require('../src/app');

      const app = appFactory({
        userSquidexDataProvider: userSquidexDataProviderMock,
        userContentfulDataProvider: userContentfulDataProviderMock,
        authHandler: authHandlerMock,
      });
      const response = await supertest(app)
        .get('/users')
        .set('X-Contentful-Enabled', 'true');

      expect(response.status).toBe(200);
      expect(userSquidexDataProviderMock.fetch).not.toHaveBeenCalled();
      expect(userContentfulDataProviderMock.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
