describe('Research Tags Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Should resolve Research Tag Contentful Data Provider', async () => {
    const { ResearchTagContentfulDataProvider } = await import(
      '../../src/data-providers/contentful/research-tag.data-provider'
    );
    const getResearchTagDataProviderModule = await import(
      '../../src/dependencies/research-tags.dependencies'
    );
    const ResearchTagDataProvider =
      getResearchTagDataProviderModule.getResearchTagDataProvider();

    expect(ResearchTagDataProvider).toBeInstanceOf(
      ResearchTagContentfulDataProvider,
    );
  });
});

// necessary to avoid " cannot be compiled under '--isolatedModules' because it is considered a global script file"
export {};
