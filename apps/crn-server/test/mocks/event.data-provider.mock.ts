import { EventDataProvider } from '../../src/data-providers/types';

export const eventDataProviderMock = {
  fetchById: jest.fn(),
  fetch: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  updateEventDetails: jest.fn(),
} as unknown as jest.Mocked<EventDataProvider>;
