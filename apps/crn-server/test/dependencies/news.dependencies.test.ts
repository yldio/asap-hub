describe('News Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Should resolve News Contentful Data Provider', async () => {
    const { NewsContentfulDataProvider } = await import(
      '../../src/data-providers/contentful/news.data-provider'
    );
    const getNewsDataProviderModule = await import(
      '../../src/dependencies/news.dependencies'
    );
    const NewsDataProvider = getNewsDataProviderModule.getNewsDataProvider();

    expect(NewsDataProvider).toBeInstanceOf(NewsContentfulDataProvider);
  });
});

// necessary to avoid " cannot be compiled under '--isolatedModules' because it is considered a global script file"
export {};
