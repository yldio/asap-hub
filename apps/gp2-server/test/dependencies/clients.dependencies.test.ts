import { Environment } from '@asap-hub/contentful';
import { getContentfulRestClientFactory } from '../../src/dependencies/clients.dependencies';

const mockEnvironment = {} as Environment;

jest.mock('@asap-hub/contentful', () => ({
  ...jest.requireActual('@asap-hub/contentful'),
  getRestClient: () => mockEnvironment,
}));

describe('Contentful Rest Client Factory', () => {
  test('Should return Contentful Environment', async () => {
    const environment = await getContentfulRestClientFactory();

    expect(environment).toBe(mockEnvironment);
  });
});
