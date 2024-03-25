describe('Analytics Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Should resolve Analytics Contentful Data Provider', async () => {
    const { AnalyticsContentfulDataProvider } = await import(
      '../../src/data-providers/contentful/analytics.data-provider'
    );
    const getAnalyticsDataProviderModule = await import(
      '../../src/dependencies/analytics.dependencies'
    );
    const analyticsDataProvider =
      getAnalyticsDataProviderModule.getAnalyticsDataProvider();

    expect(analyticsDataProvider).toBeInstanceOf(
      AnalyticsContentfulDataProvider,
    );
  });
});

// necessary to avoid " cannot be compiled under '--isolatedModules' because it is considered a global script file"
export {};
