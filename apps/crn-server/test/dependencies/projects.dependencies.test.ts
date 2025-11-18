describe('Project Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('resolves Project Contentful Data Provider', async () => {
    const { ProjectContentfulDataProvider } = await import(
      '../../src/data-providers/contentful/project.data-provider'
    );
    const { getProjectDataProvider } = await import(
      '../../src/dependencies/projects.dependencies'
    );

    const provider = getProjectDataProvider();

    expect(provider).toBeInstanceOf(ProjectContentfulDataProvider);
  });
});

// necessary to satisfy isolatedModules
export {};
