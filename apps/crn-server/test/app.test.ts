import supertest from 'supertest';
import { authHandlerMock } from './mocks/auth-handler.mock';
import { appFactory as appFactoryDefault } from '../src/app';

import { UserDataProvider } from '../src/data-providers/types';

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
