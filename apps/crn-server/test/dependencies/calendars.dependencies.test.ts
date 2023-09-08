describe('Calendars Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Should resolve Calendar Contentful Data Provider', async () => {
    const { CalendarContentfulDataProvider } = await import(
      '../../src/data-providers/contentful/calendar.data-provider'
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
