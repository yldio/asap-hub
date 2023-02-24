import { EventDataProvider } from '../../src/data-providers/event.data-provider';

export const eventDataProviderMock: jest.Mocked<EventDataProvider> = {
  fetchById: jest.fn(),
  fetch: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
};
