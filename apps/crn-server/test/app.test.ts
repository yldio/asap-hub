import supertest from 'supertest';
import { authHandlerMock } from './mocks/auth-handler.mock';

import { NewsDataProvider } from '../src/data-providers/types';

describe('app is set with correct data provider for news', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

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
