export const getDataProviderMock = () => ({
  fetch: jest.fn(),
  fetchById: jest.fn(),
  fetchByCollectionTitle: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
});
