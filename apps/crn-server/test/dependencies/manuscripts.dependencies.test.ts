describe('Manuscripts Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Should resolve Manuscript Contentful Data Provider', async () => {
    const { ManuscriptContentfulDataProvider } = await import(
      '../../src/data-providers/contentful/manuscript.data-provider'
    );
    const getManuscriptDataProviderModule = await import(
      '../../src/dependencies/manuscripts.dependencies'
    );
    const manuscriptDataProvider =
      getManuscriptDataProviderModule.getManuscriptsDataProvider();

    expect(manuscriptDataProvider).toBeInstanceOf(
      ManuscriptContentfulDataProvider,
    );
  });
});

// necessary to avoid " cannot be compiled under '--isolatedModules' because it is considered a global script file"
export {};
