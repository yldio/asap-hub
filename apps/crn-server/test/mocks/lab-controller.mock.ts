import { LabsController } from '../../src/controllers/labs';

export const labControllerMock: jest.Mocked<LabsController> = {
  fetch: jest.fn(),
};
