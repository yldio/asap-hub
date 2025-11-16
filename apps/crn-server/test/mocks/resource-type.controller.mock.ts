import ResourceTypeController from '../../src/controllers/resource-type.controller';

export const resourceTypeControllerMock: jest.Mocked<ResourceTypeController> = {
  fetch: jest.fn(),
} as unknown as jest.Mocked<ResourceTypeController>;

