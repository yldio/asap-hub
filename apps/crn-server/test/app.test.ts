import supertest from 'supertest';
import { authHandlerMock } from './mocks/auth-handler.mock';

jest.mock('../src/data-providers/news.data-provider', () => ({
  NewsSquidexDataProvider: jest.fn().mockImplementation(() => ({
    fetch: jest.fn(),
  })),
}));

jest.mock('../src/data-providers/contentful/news.data-provider', () => ({
  NewsContentfulDataProvider: jest.fn().mockImplementation(() => ({
    fetch: jest.fn(),
  })),
}));

describe('app is set with correct data provider for news', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('news controller uses squidex data provider when IS_CONTENTFUL_ENABLED is false', async () => {
    process.env.IS_CONTENTFUL_ENABLED = 'false';

    const { appFactory } = require('../src/app');
    const {
      NewsSquidexDataProvider,
    } = require('../src/data-providers/news.data-provider');

    const {
      NewsContentfulDataProvider,
    } = require('../src/data-providers/contentful/news.data-provider');

    const app = appFactory({
      authHandler: authHandlerMock,
    });
    await supertest(app).get('/news');

    expect(
      NewsSquidexDataProvider.mock.results[0].value.fetch,
    ).toHaveBeenCalledTimes(1);

    expect(
      NewsContentfulDataProvider.mock.results[0].value.fetch,
    ).not.toHaveBeenCalled();
  });

  test('news controller uses squidex data provider when IS_CONTENTFUL_ENABLED undefined', async () => {
    process.env.IS_CONTENTFUL_ENABLED = undefined;

    const { appFactory } = require('../src/app');
    const {
      NewsSquidexDataProvider,
    } = require('../src/data-providers/news.data-provider');

    const {
      NewsContentfulDataProvider,
    } = require('../src/data-providers/contentful/news.data-provider');

    const app = appFactory({
      authHandler: authHandlerMock,
    });
    await supertest(app).get('/news');

    expect(
      NewsSquidexDataProvider.mock.results[0].value.fetch,
    ).toHaveBeenCalledTimes(1);

    expect(
      NewsContentfulDataProvider.mock.results[0].value.fetch,
    ).not.toHaveBeenCalled();
  });

  test('news controller uses contentful data provider when IS_CONTENTFUL_ENABLED is true', async () => {
    process.env.IS_CONTENTFUL_ENABLED = 'true';

    const { appFactory } = require('../src/app');
    const {
      NewsSquidexDataProvider,
    } = require('../src/data-providers/news.data-provider');

    const {
      NewsContentfulDataProvider,
    } = require('../src/data-providers/contentful/news.data-provider');

    const app = appFactory({
      authHandler: authHandlerMock,
    });
    await supertest(app).get('/news');

    expect(
      NewsSquidexDataProvider.mock.results[0].value.fetch,
    ).not.toHaveBeenCalledTimes(1);

    expect(
      NewsContentfulDataProvider.mock.results[0].value.fetch,
    ).toHaveBeenCalled();
  });
});
