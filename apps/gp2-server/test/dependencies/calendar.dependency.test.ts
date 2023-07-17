import { CalendarContentfulDataProvider } from '../../src/data-providers/calendar.data-provider';
import { getCalendarDataProvider } from '../../src/dependencies/calendar.dependency';
import { getContentfulGraphqlClientMock } from '../mocks/contentful-graphql-client.mock';
describe('Calendar Dependencies', () => {
  it('Should resolve Calendar Contentful Data Provider when the Contentful feature flag is on', async () => {
    const graphQLClient = getContentfulGraphqlClientMock();
    const calendarDataProvider = getCalendarDataProvider(graphQLClient);

    expect(calendarDataProvider).toBeInstanceOf(CalendarContentfulDataProvider);
  });
});
