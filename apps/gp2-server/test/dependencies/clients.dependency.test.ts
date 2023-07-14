import { Environment, GraphQLClient } from '@asap-hub/contentful';
import {
  getContentfulGraphQLClientFactory,
  getContentfulRestClientFactory,
} from '../../src/dependencies/clients.dependency';

const mockEnvironment = {} as Environment;
const mockGraphQLClient = {} as GraphQLClient;

jest.mock('@asap-hub/contentful', () => ({
  ...jest.requireActual('@asap-hub/contentful'),
  getRestClient: () => mockEnvironment,
  getGraphQLClient: () => mockGraphQLClient,
}));

describe('Contentful Rest Client Factory', () => {
  test('Should return Contentful Environment', async () => {
    const environment = await getContentfulRestClientFactory();

    expect(environment).toBe(mockEnvironment);
  });
});
describe('Contentful GraphQL Client Factory', () => {
  test('Should return Contentful Environment', async () => {
    const client = getContentfulGraphQLClientFactory();

    expect(client).toBe(mockGraphQLClient);
  });
});
