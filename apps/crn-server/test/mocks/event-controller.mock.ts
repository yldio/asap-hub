import EventController from '../../src/controllers/events.controller';

export const eventControllerMock = {
  create: jest.fn(),
  fetch: jest.fn(),
  fetchById: jest.fn(),
  fetchByGoogleId: jest.fn(),
  update: jest.fn(),
} as unknown as jest.Mocked<EventController>;
