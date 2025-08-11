import {
  getOpenSearchEndpoint,
  extractDomainFromEndpoint,
} from '../../src/utils/opensearch-endpoint';

export const mockOpensearchEndpoint = {
  getOpenSearchEndpoint: jest.fn() as jest.MockedFunction<typeof getOpenSearchEndpoint>,
  extractDomainFromEndpoint: jest.fn() as jest.MockedFunction<typeof extractDomainFromEndpoint>,
};
