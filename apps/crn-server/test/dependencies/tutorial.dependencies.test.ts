describe('Tutorials Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Should resolve Tutorial Contentful Data Provider', async () => {
    const { TutorialContentfulDataProvider } = await import(
      '../../src/data-providers/contentful/tutorial.data-provider'
    );
    const getTutorialDataProviderModule = await import(
      '../../src/dependencies/tutorial.dependencies'
    );
    const WorkingGroupDataProvider =
      getTutorialDataProviderModule.getTutorialDataProvider();

    expect(WorkingGroupDataProvider).toBeInstanceOf(
      TutorialContentfulDataProvider,
    );
  });
});

// necessary to avoid " cannot be compiled under '--isolatedModules' because it is considered a global script file"
export {};
