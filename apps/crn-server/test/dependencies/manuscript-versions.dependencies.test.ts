describe('Manuscript Versions Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Should resolve Manuscript Version Contentful Data Provider', async () => {
    const { ManuscriptVersionContentfulDataProvider } = await import(
      '../../src/data-providers/contentful/manuscript-version.data-provider'
    );
    const getManuscriptVersionDataProviderModule = await import(
      '../../src/dependencies/manuscript-versions.dependencies'
    );
    const manuscriptVersionDataProvider =
      getManuscriptVersionDataProviderModule.getManuscriptVersionsDataProvider();

    expect(manuscriptVersionDataProvider).toBeInstanceOf(
      ManuscriptVersionContentfulDataProvider,
    );
  });
});

// necessary to avoid " cannot be compiled under '--isolatedModules' because it is considered a global script file"
export {};
