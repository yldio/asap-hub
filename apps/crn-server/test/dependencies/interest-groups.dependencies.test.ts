describe('Interest Groups Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Should resolve Interest Group Contentful Data Provider', async () => {
    const { InterestGroupContentfulDataProvider } = await import(
      '../../src/data-providers/contentful/interest-group.data-provider'
    );
    const getInterestGroupDataProviderModule = await import(
      '../../src/dependencies/interest-groups.dependencies'
    );
    const interestGroupDataProvider =
      getInterestGroupDataProviderModule.getInterestGroupDataProvider();

    expect(interestGroupDataProvider).toBeInstanceOf(
      InterestGroupContentfulDataProvider,
    );
  });
});

// necessary to avoid " cannot be compiled under '--isolatedModules' because it is considered a global script file"
export {};
