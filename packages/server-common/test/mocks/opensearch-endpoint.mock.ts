import {
  getOpensearchEndpoint,
  extractDomainFromEndpoint,
} from '../../src/utils/opensearch-endpoint';

export const mockOpensearchEndpoint = {
  getOpensearchEndpoint: jest.fn() as jest.MockedFunction<
    typeof getOpensearchEndpoint
  >,
  extractDomainFromEndpoint: jest.fn() as jest.MockedFunction<
    typeof extractDomainFromEndpoint
  >,
};
