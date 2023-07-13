import { EventContentfulDataProvider } from '../../src/data-providers/event.data-provider';
import { getEventDataProvider } from '../../src/dependencies/event.dependency';
describe('Events Dependencies', () => {
  it('Should resolve Event Contentful Data Provider when the Contentful feature flag is on', async () => {
    const eventDataProvider = getEventDataProvider();

    expect(eventDataProvider).toBeInstanceOf(EventContentfulDataProvider);
  });
});
