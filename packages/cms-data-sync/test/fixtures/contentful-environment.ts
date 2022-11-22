import { Environment } from 'contentful-management';
import { getSquidexAndContentfulClients } from '../../src/utils';

export const getContentfulEnvironmentMock = async () => {
  const { contentfulEnvironment } = await getSquidexAndContentfulClients();

  return {
    ...contentfulEnvironment,
    update: jest.fn(),
    createAsset: jest.fn(),
    delete: jest.fn(),
    getEntries: jest.fn(),
  };
};
