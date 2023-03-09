import { gp2 } from '@asap-hub/model';

export const eventControllerMock: jest.Mocked<gp2.EventController> = {
  create: jest.fn(),
  fetch: jest.fn(),
  fetchById: jest.fn(),
  fetchByGoogleId: jest.fn(),
  update: jest.fn(),
};
