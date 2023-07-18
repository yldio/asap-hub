import { EventContentfulDataProvider } from '../../src/data-providers/event.data-provider';
import { getEventDataProvider } from '../../src/dependencies/event.dependency';
import { getContentfulGraphqlClientMock } from '../mocks/contentful-graphql-client.mock';
describe('Events Dependencies', () => {
  it('Should resolve Event Contentful Data Provider when the Contentful feature flag is on', async () => {
    const graphQLClient = getContentfulGraphqlClientMock();
    const eventDataProvider = getEventDataProvider(graphQLClient);

    expect(eventDataProvider).toBeInstanceOf(EventContentfulDataProvider);
  });
});
