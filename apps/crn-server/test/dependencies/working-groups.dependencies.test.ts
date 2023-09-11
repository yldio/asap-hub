describe('Working Groups Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Should resolve Working Group Contentful Data Provider', async () => {
    const { WorkingGroupContentfulDataProvider } = await import(
      '../../src/data-providers/contentful/working-group.data-provider'
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
