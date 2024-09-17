import { getDataProviderMock } from './data-provider.mock';

export const userDataProviderMock = {
  ...getDataProviderMock(),
  fetchPublicUsers: jest.fn(),
};
