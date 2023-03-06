import { EventDataProvider } from '@asap-hub/model';

export const eventDataProviderMock: jest.Mocked<EventDataProvider> = {
  fetchById: jest.fn(),
  fetch: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
};
