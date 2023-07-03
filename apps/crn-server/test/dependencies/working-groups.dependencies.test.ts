describe('Working Groups Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Should resolve Working Group Squidex Data Provider when the Contentful feature flag is off', async () => {
    process.env.IS_CONTENTFUL_ENABLED_V2 = 'false';

    const { WorkingGroupSquidexDataProvider } = await import(
      '../../src/data-providers/working-group.data-provider'
    );
    const getWorkingGroupDataProviderModule = await import(
      '../../src/dependencies/working-groups.dependencies'
    );
    const WorkingGroupDataProvider =
      getWorkingGroupDataProviderModule.getWorkingGroupDataProvider();

    expect(WorkingGroupDataProvider).toBeInstanceOf(
      WorkingGroupSquidexDataProvider,
    );
  });

  it('Should resolve Working Group Contentful Data Provider when the Contentful feature flag is on', async () => {
    process.env.IS_CONTENTFUL_ENABLED_V2 = 'true';
    const { WorkingGroupContentfulDataProvider } = await import(
      '../../src/data-providers/contentful/working-groups.data-provider'
    );
    const getWorkingGroupDataProviderModule = await import(
      '../../src/dependencies/working-groups.dependencies'
    );
    const WorkingGroupDataProvider =
      getWorkingGroupDataProviderModule.getWorkingGroupDataProvider();

    expect(WorkingGroupDataProvider).toBeInstanceOf(
      WorkingGroupContentfulDataProvider,
    );
  });
});

// necessary to avoid " cannot be compiled under '--isolatedModules' because it is considered a global script file"
export {};
