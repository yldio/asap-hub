jest.mock('../src/controllers/news');
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
    const News = require('../src/controllers/news').default;

    appFactory();

    expect(News).toHaveBeenCalledTimes(1);
    expect(News).toHaveBeenCalledWith(
      expect.objectContaining({ newsSquidexRestClient: expect.anything() }),
    );
  });

  test('news controller uses squidex data provider when IS_CONTENTFUL_ENABLED undefined', async () => {
    process.env.IS_CONTENTFUL_ENABLED = undefined;

    const { appFactory } = require('../src/app');
    const News = require('../src/controllers/news').default;

    appFactory();

    expect(News).toHaveBeenCalledTimes(1);
    expect(News).toHaveBeenCalledWith(
      expect.objectContaining({ newsSquidexRestClient: expect.anything() }),
    );
  });

  test('news controller uses contentful data provider when IS_CONTENTFUL_ENABLED is true', async () => {
    process.env.IS_CONTENTFUL_ENABLED = 'true';

    const { appFactory } = require('../src/app');
    const News = require('../src/controllers/news').default;

    appFactory();

    expect(News).toHaveBeenCalledTimes(1);
    expect(News).toHaveBeenCalledWith(
      expect.objectContaining({ contentfulClient: expect.anything() }),
    );
  });
});

export {};
