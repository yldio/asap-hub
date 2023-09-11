describe('Events Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Should resolve Event Contentful Data Provider', async () => {
    const { EventContentfulDataProvider } = await import(
      '../../src/data-providers/contentful/event.data-provider'
    );
    const getEventDataProviderModule = await import(
      '../../src/dependencies/events.dependencies'
    );
    const eventDataProvider = getEventDataProviderModule.getEventDataProvider();

    expect(eventDataProvider).toBeInstanceOf(EventContentfulDataProvider);
  });
});

// necessary to avoid " cannot be compiled under '--isolatedModules' because it is considered a global script file"
export {};
