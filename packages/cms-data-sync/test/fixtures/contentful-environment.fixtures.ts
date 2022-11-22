import { getSquidexAndContentfulClients } from '../../src/utils';

export const getContentfulEnvironmentMock = async () => {
  const { contentfulEnvironment } = await getSquidexAndContentfulClients();

  return {
    ...contentfulEnvironment,
    getEntries: jest.fn(),
  };
};
