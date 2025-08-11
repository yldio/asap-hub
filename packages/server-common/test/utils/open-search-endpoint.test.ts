import { getOpenSearchEndpoint } from '../../src/utils/open-search-endpoint';

jest.mock('@aws-sdk/client-opensearch', () => ({
  OpenSearchClient: jest.fn(),
  DescribeDomainCommand: jest.fn(),
}));

const {
  OpenSearchClient,
  DescribeDomainCommand,
} = require('@aws-sdk/client-opensearch');

const mockOpenSearchClient = OpenSearchClient as jest.MockedClass<
  typeof OpenSearchClient
>;
const mockDescribeDomainCommand = DescribeDomainCommand as jest.MockedClass<
  typeof DescribeDomainCommand
>;

describe('OpenSearch Endpoint Utils', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getOpenSearchEndpoint', () => {
    const mockSend = jest.fn();

    beforeEach(() => {
      mockOpenSearchClient.mockImplementation(
        () =>
          ({
            send: mockSend,
          }) as any,
      );
      mockDescribeDomainCommand.mockImplementation(
        (params: any) => params as any,
      );
    });

    it('should return production endpoint for production stage', async () => {
      const mockResponse = {
        DomainStatus: {
          Endpoint: 'search-domain-abc123.us-west-2.es.amazonaws.com',
        },
      };

      mockSend.mockResolvedValue(mockResponse);

      const result = await getOpenSearchEndpoint({
        awsRegion: 'us-west-2',
        stage: 'production',
      });

      expect(result).toBe(
        'https://search-domain-abc123.us-west-2.es.amazonaws.com',
      );
      expect(mockOpenSearchClient).toHaveBeenCalledWith({
        region: 'us-west-2',
      });
      expect(mockDescribeDomainCommand).toHaveBeenCalledWith({
        DomainName: 'asap-hub-production-search',
      });
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('should return dev endpoint for non-production stages', async () => {
      const mockResponse = {
        DomainStatus: {
          Endpoint: 'search-domain-def456.eu-west-1.es.amazonaws.com',
        },
      };

      mockSend.mockResolvedValue(mockResponse);

      const result = await getOpenSearchEndpoint({
        awsRegion: 'eu-west-1',
        stage: 'branch',
      });

      expect(result).toBe(
        'https://search-domain-def456.eu-west-1.es.amazonaws.com',
      );
      expect(mockOpenSearchClient).toHaveBeenCalledWith({
        region: 'eu-west-1',
      });
      expect(mockDescribeDomainCommand).toHaveBeenCalledWith({
        DomainName: 'asap-hub-dev-search',
      });
    });

    it('should throw error when endpoint is not found in response', async () => {
      const mockResponse = {
        DomainStatus: {},
      };

      mockSend.mockResolvedValue(mockResponse);

      await expect(
        getOpenSearchEndpoint({
          awsRegion: 'us-east-1',
          stage: 'dev',
        }),
      ).rejects.toThrow(
        'Could not determine OpenSearch endpoint for asap-hub-dev-search',
      );
    });

    it('should throw error when AWS call fails', async () => {
      mockSend.mockRejectedValue(new Error('AWS API Error'));

      await expect(
        getOpenSearchEndpoint({
          awsRegion: 'us-east-1',
          stage: 'dev',
        }),
      ).rejects.toThrow(
        'Could not determine OpenSearch endpoint for asap-hub-dev-search',
      );
    });
  });
});
