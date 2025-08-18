import {
  OpenSearchClient,
  DescribeDomainCommand,
} from '@aws-sdk/client-opensearch';
import {
  getOpensearchEndpoint,
  extractDomainFromEndpoint,
} from '../../src/utils/opensearch-endpoint';

jest.mock('@aws-sdk/client-opensearch');

const mockOpensearchClient = OpenSearchClient as jest.MockedClass<
  typeof OpenSearchClient
>;
const mockDescribeDomainCommand = DescribeDomainCommand as jest.MockedClass<
  typeof DescribeDomainCommand
>;

describe('Opensearch Endpoint Utils', () => {
  let mockSend: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSend = jest.fn();
    mockOpensearchClient.mockImplementation(
      () =>
        ({
          send: mockSend,
        }) as any,
    );
  });

  describe('getOpensearchEndpoint', () => {
    const defaultConfig = {
      awsRegion: 'us-east-1',
      stage: 'dev',
    };
    test('should get endpoint for dev environment', async () => {
      const mockResponse = {
        DomainStatus: {
          Endpoint:
            'search-asap-hub-dev-search-xyz789.us-east-1.es.amazonaws.com',
        },
      };
      mockSend.mockResolvedValueOnce(mockResponse);

      const result = await getOpensearchEndpoint(defaultConfig);

      expect(result).toBe(
        'https://search-asap-hub-dev-search-xyz789.us-east-1.es.amazonaws.com',
      );
      expect(mockDescribeDomainCommand).toHaveBeenCalledWith({
        DomainName: 'asap-hub-dev-search',
      });
    });

    test('should return dev endpoint for non-production stages', async () => {
      const mockResponse = {
        DomainStatus: {
          Endpoint: 'search-domain-def456.eu-west-1.es.amazonaws.com',
        },
      };

      mockSend.mockResolvedValue(mockResponse);

      const result = await getOpensearchEndpoint({
        awsRegion: 'eu-west-1',
        stage: 'branch',
      });

      expect(result).toBe(
        'https://search-domain-def456.eu-west-1.es.amazonaws.com',
      );
      expect(mockOpensearchClient).toHaveBeenCalledWith({
        region: 'eu-west-1',
      });
      expect(mockDescribeDomainCommand).toHaveBeenCalledWith({
        DomainName: 'asap-hub-dev-search',
      });
    });

    test('should get endpoint for production environment', async () => {
      const mockResponse = {
        DomainStatus: {
          Endpoint:
            'search-asap-hub-production-search-abc123.us-east-1.es.amazonaws.com',
        },
      };
      mockSend.mockResolvedValueOnce(mockResponse);

      const result = await getOpensearchEndpoint({
        stage: 'production',
        awsRegion: 'us-east-1',
      });

      expect(result).toBe(
        'https://search-asap-hub-production-search-abc123.us-east-1.es.amazonaws.com',
      );
      expect(mockDescribeDomainCommand).toHaveBeenCalledWith({
        DomainName: 'asap-hub-production-search',
      });

      expect(mockOpensearchClient).toHaveBeenCalledWith({
        region: 'us-east-1',
      });
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    test('should throw error when endpoint is not found', async () => {
      const mockResponse = { DomainStatus: {} };
      mockSend.mockResolvedValueOnce(mockResponse);

      await expect(getOpensearchEndpoint(defaultConfig)).rejects.toThrow(
        'Could not determine Opensearch endpoint for asap-hub-dev-search',
      );
    });

    test('should throw error when AWS SDK call fails', async () => {
      mockSend.mockRejectedValueOnce(new Error('AWS service unavailable'));

      await expect(getOpensearchEndpoint(defaultConfig)).rejects.toThrow(
        'Could not determine Opensearch endpoint for asap-hub-dev-search',
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
