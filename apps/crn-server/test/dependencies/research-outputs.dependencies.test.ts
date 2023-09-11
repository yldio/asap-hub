describe('Research Outputs Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Should resolve Research Output Contentful Data Provider', async () => {
    const { ResearchOutputContentfulDataProvider } = await import(
      '../../src/data-providers/contentful/research-output.data-provider'
    );
    const getResearchOutputDataProviderModule = await import(
      '../../src/dependencies/research-outputs.dependencies'
    );
    const ResearchOutputDataProvider =
      getResearchOutputDataProviderModule.getResearchOutputDataProvider();

    expect(ResearchOutputDataProvider).toBeInstanceOf(
      ResearchOutputContentfulDataProvider,
    );
  });
});

// necessary to avoid " cannot be compiled under '--isolatedModules' because it is considered a global script file"
export {};
