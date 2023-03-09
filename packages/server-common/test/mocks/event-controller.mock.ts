import { EventController } from '@asap-hub/model';

export const eventControllerMock: jest.Mocked<EventController> = {
  create: jest.fn(),
  fetch: jest.fn(),
  fetchById: jest.fn(),
  fetchByGoogleId: jest.fn(),
  update: jest.fn(),
};
