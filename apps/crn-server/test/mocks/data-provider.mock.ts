export const getDataProviderMock = () => ({
  fetch: jest.fn(),
  fetchById: jest.fn(),
  fetchByCollectionTitle: jest.fn(),
  fetchByTeamId: jest.fn(),
  fetchByUserId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  createFromUrl: jest.fn(),
});
