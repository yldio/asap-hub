describe('Research Tags Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Should resolve Research Tag Squidex Data Provider when the Contentful feature flag is off', async () => {
    process.env.IS_CONTENTFUL_ENABLED = 'false';

    const { ResearchTagSquidexDataProvider } = await import(
      '../../src/data-providers/research-tag.data-provider'
    );
    const getResearchTagDataProviderModule = await import(
      '../../src/dependencies/research-tags.dependencies'
    );
    const ResearchTagDataProvider =
      getResearchTagDataProviderModule.getResearchTagDataProvider();

    expect(ResearchTagDataProvider).toBeInstanceOf(
      ResearchTagSquidexDataProvider,
    );
  });

  it('Should resolve Research Tag Contentful Data Provider when the Contentful feature flag is on', async () => {
    process.env.IS_CONTENTFUL_ENABLED = 'true';
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
