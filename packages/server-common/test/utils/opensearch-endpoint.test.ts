import {
  OpenSearchClient,
  DescribeDomainCommand,
} from '@aws-sdk/client-opensearch';
import {
  getOpenSearchEndpoint,
  extractDomainFromEndpoint,
} from '../../src/utils/opensearch-endpoint';

jest.mock('@aws-sdk/client-opensearch');

const mockOpenSearchClient = OpenSearchClient as jest.MockedClass<
  typeof OpenSearchClient
>;
const mockDescribeDomainCommand = DescribeDomainCommand as jest.MockedClass<
  typeof DescribeDomainCommand
>;

describe('OpenSearch Endpoint Utils', () => {
  let mockSend: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSend = jest.fn();
    mockOpenSearchClient.mockImplementation(
      () =>
        ({
          send: mockSend,
        }) as any,
    );
  });

  describe('getOpenSearchEndpoint', () => {
    test('should get endpoint for dev environment', async () => {
      const mockResponse = {
        DomainStatus: {
          Endpoint:
            'search-asap-hub-dev-search-xyz789.us-east-1.es.amazonaws.com',
        },
      };
      mockSend.mockResolvedValueOnce(mockResponse);

      const result = await getOpenSearchEndpoint();

      expect(result).toBe(
        'https://search-asap-hub-dev-search-xyz789.us-east-1.es.amazonaws.com',
      );
      expect(mockDescribeDomainCommand).toHaveBeenCalledWith({
        DomainName: 'asap-hub-dev-search',
      });
    });

    test('should get endpoint for production environment', async () => {
      const originalEnvironment = process.env.ENVIRONMENT;
      process.env.ENVIRONMENT = 'production';

      const mockResponse = {
        DomainStatus: {
          Endpoint:
            'search-asap-hub-production-search-abc123.us-east-1.es.amazonaws.com',
        },
      };
      mockSend.mockResolvedValueOnce(mockResponse);

      const result = await getOpenSearchEndpoint();

      expect(result).toBe(
        'https://search-asap-hub-production-search-abc123.us-east-1.es.amazonaws.com',
      );
      expect(mockDescribeDomainCommand).toHaveBeenCalledWith({
        DomainName: 'asap-hub-production-search',
      });

      process.env.ENVIRONMENT = originalEnvironment;
    });

    test('should throw error when endpoint is not found', async () => {
      const mockResponse = { DomainStatus: {} };
      mockSend.mockResolvedValueOnce(mockResponse);

      await expect(getOpenSearchEndpoint()).rejects.toThrow(
        'Could not determine OpenSearch endpoint for asap-hub-dev-search',
      );
    });

    test('should throw error when AWS SDK call fails', async () => {
      mockSend.mockRejectedValueOnce(new Error('AWS service unavailable'));

      await expect(getOpenSearchEndpoint()).rejects.toThrow(
        'Could not determine OpenSearch endpoint for asap-hub-dev-search',
      );
    });
  });

  describe('extractDomainFromEndpoint', () => {
    test('should extract domain from full HTTPS URL', () => {
      const endpoint =
        'https://search-domain-abc123.us-east-1.es.amazonaws.com';
      const result = extractDomainFromEndpoint(endpoint);

      expect(result).toBe('search-domain-abc123.us-east-1.es.amazonaws.com');
    });

    test('should handle domain without protocol', () => {
      const endpoint = 'search-domain-abc123.us-east-1.es.amazonaws.com';
      const result = extractDomainFromEndpoint(endpoint);

      expect(result).toBe('search-domain-abc123.us-east-1.es.amazonaws.com');
    });

    test('should handle invalid URL gracefully', () => {
      const endpoint = 'not-a-valid-url';
      const result = extractDomainFromEndpoint(endpoint);

      expect(result).toBe('not-a-valid-url');
    });
  });
});
