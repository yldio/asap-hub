describe('Team Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Should resolve Team Contentful Data Provider', async () => {
    const { TeamContentfulDataProvider } = await import(
      '../../src/data-providers/contentful/team.data-provider'
    );
    const getTeamDataProviderModule = await import(
      '../../src/dependencies/team.dependencies'
    );
    const teamDataProvider = getTeamDataProviderModule.getTeamDataProvider();

    expect(teamDataProvider).toBeInstanceOf(TeamContentfulDataProvider);
  });
});

// necessary to avoid " cannot be compiled under '--isolatedModules' because it is considered a global script file"
export {};
