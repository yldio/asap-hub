import { EventController } from '../../src/controllers/events';

export const eventControllerMock: jest.Mocked<EventController> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
};
