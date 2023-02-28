import { EventController } from '../../src';

export const eventControllerMock: jest.Mocked<EventController> = {
  create: jest.fn(),
  fetch: jest.fn(),
  fetchById: jest.fn(),
  fetchByGoogleId: jest.fn(),
  update: jest.fn(),
};
