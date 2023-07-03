describe('Calendars Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Should resolve Calendar Squidex Data Provider when the Contentful feature flag is off', async () => {
    process.env.IS_CONTENTFUL_ENABLED_V2 = 'false';

    const { CalendarSquidexDataProvider } = await import(
      '../../src/data-providers/calendar.data-provider'
    );
    const getCalendarDataProviderModule = await import(
      '../../src/dependencies/calendars.dependencies'
    );
    const calendarDataProvider =
      getCalendarDataProviderModule.getCalendarDataProvider();

    expect(calendarDataProvider).toBeInstanceOf(CalendarSquidexDataProvider);
  });

  it('Should resolve Calendar Contentful Data Provider when the Contentful feature flag is on', async () => {
    process.env.IS_CONTENTFUL_ENABLED_V2 = 'true';
    const { CalendarContentfulDataProvider } = await import(
      '../../src/data-providers/contentful/calendars.data-provider'
    );
    const getCalendarDataProviderModule = await import(
      '../../src/dependencies/calendars.dependencies'
    );
    const calendarDataProvider =
      getCalendarDataProviderModule.getCalendarDataProvider();

    expect(calendarDataProvider).toBeInstanceOf(CalendarContentfulDataProvider);
  });
});

// necessary to avoid " cannot be compiled under '--isolatedModules' because it is considered a global script file"
export {};
