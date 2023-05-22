describe('Events Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Should resolve Event Squidex Data Provider when the Contentful feature flag is off', async () => {
    process.env.IS_CONTENTFUL_ENABLED_V2 = 'false';

    const { EventSquidexDataProvider } = await import(
      '../../src/data-providers/event.data-provider'
    );
    const getEventDataProviderModule = await import(
      '../../src/dependencies/events.dependencies'
    );
    const eventDataProvider = getEventDataProviderModule.getEventDataProvider();

    expect(eventDataProvider).toBeInstanceOf(EventSquidexDataProvider);
  });

  it('Should resolve Event Contentful Data Provider when the Contentful feature flag is on', async () => {
    process.env.IS_CONTENTFUL_ENABLED_V2 = 'true';
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
