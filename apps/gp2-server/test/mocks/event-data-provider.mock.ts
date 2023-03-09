import { gp2 } from '@asap-hub/model';

export const eventDataProviderMock: jest.Mocked<gp2.EventDataProvider> = {
  fetchById: jest.fn(),
  fetch: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
};
