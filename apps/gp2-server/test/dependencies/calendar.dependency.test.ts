import { CalendarContentfulDataProvider } from '../../src/data-providers/calendar.data-provider';
import { getCalendarDataProvider } from '../../src/dependencies/calendar.dependency';
describe('Calendar Dependencies', () => {
  it('Should resolve Calendar Contentful Data Provider when the Contentful feature flag is on', async () => {
    const calendarDataProvider = getCalendarDataProvider();

    expect(calendarDataProvider).toBeInstanceOf(CalendarContentfulDataProvider);
  });
});
