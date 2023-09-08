describe('External Authors Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Should resolve External-Author Contentful Data Provider', async () => {
    const { ExternalAuthorContentfulDataProvider } = await import(
      '../../src/data-providers/contentful/external-author.data-provider'
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
