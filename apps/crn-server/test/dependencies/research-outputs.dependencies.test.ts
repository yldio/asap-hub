describe('Research Outputs Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Should resolve Research Output Squidex Data Provider when the Contentful feature flag is off', async () => {
    process.env.IS_CONTENTFUL_ENABLED = 'false';

    const { ResearchOutputSquidexDataProvider } = await import(
      '../../src/data-providers/research-output.data-provider'
    );
    const getResearchOutputDataProviderModule = await import(
      '../../src/dependencies/research-outputs.dependencies'
    );
    const ResearchOutputDataProvider =
      getResearchOutputDataProviderModule.getResearchOutputDataProvider();

    expect(ResearchOutputDataProvider).toBeInstanceOf(
      ResearchOutputSquidexDataProvider,
    );
  });

  it('Should resolve Research Output Contentful Data Provider when the Contentful feature flag is on', async () => {
    process.env.IS_CONTENTFUL_ENABLED = 'true';
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
