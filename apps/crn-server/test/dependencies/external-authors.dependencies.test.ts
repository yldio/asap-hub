describe('External Authors Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Should resolve External-Author Squidex Data Provider when the Contentful feature flag is off', async () => {
    process.env.IS_CONTENTFUL_ENABLED_V2 = 'false';

    const { ExternalAuthorSquidexDataProvider } = await import(
      '../../src/data-providers/external-authors.data-provider'
    );
    const getExternalAuthorDataProviderModule = await import(
      '../../src/dependencies/external-authors.dependencies'
    );
    const externalAuthorDataProvider =
      getExternalAuthorDataProviderModule.getExternalAuthorDataProvider();

    expect(externalAuthorDataProvider).toBeInstanceOf(
      ExternalAuthorSquidexDataProvider,
    );
  });

  it('Should resolve External-Author Contentful Data Provider when the Contentful feature flag is on', async () => {
    process.env.IS_CONTENTFUL_ENABLED_V2 = 'true';
    const { ExternalAuthorContentfulDataProvider } = await import(
      '../../src/data-providers/contentful/external-authors.data-provider'
    );
    const getExternalAuthorDataProviderModule = await import(
      '../../src/dependencies/external-authors.dependencies'
    );
    const externalAuthorDataProvider =
      getExternalAuthorDataProviderModule.getExternalAuthorDataProvider();

    expect(externalAuthorDataProvider).toBeInstanceOf(
      ExternalAuthorContentfulDataProvider,
    );
  });
});

// necessary to avoid " cannot be compiled under '--isolatedModules' because it is considered a global script file"
export {};
