import { framework as lambda } from '@asap-hub/services-common';
import { Client, API } from '@opensearch-project/opensearch';
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import {
  Logger,
  getOpenSearchEndpoint,
  extractDomainFromEndpoint,
} from '../../utils';

export type OpenSearchRequest = API.Search_RequestBody;
export type OpenSearchResponse = API.Search_ResponseBody;

const getClient = async (region: string): Promise<Client> => {
  const endpoint = await getOpenSearchEndpoint();
  const domainEndpoint = extractDomainFromEndpoint(endpoint);

  return new Client({
    ...AwsSigv4Signer({
      getCredentials: defaultProvider(),
      region,
    }),
    node: `https://${domainEndpoint}`,
  });
};

type Input = {
  query: OpenSearchRequest;
};

type Output =
  | {
      data: OpenSearchResponse;
    }
  | {
      error: string;
      details?: string;
    };

export const opensearchHandlerFactory =
  (
    logger: Logger,
    region: string,
  ): ((request: lambda.Request<Input>) => Promise<lambda.Response<Output>>) =>
  async (request) => {
    logger.info(`Received request: ${JSON.stringify(request)}`);

    const { query } = request.payload;
    const index = request.params?.index;

    if (!index) {
      return {
        statusCode: 400,
        payload: {
          error: 'Missing index path parameter',
        },
      };
    }
    try {
      const client = await getClient(region);

      const response = await client.search({
        index,
        body: query || { query: { match_all: {} } },
      });

      if (!response.statusCode?.toString().startsWith('2')) {
        return {
          statusCode: response.statusCode || 500,
          payload: {
            error: 'OpenSearch error',
            details: JSON.stringify(response.body),
          },
        };
      }

      return {
        statusCode: 200,
        payload: { data: response.body },
      };
    } catch (error) {
      logger.error('Error executing OpenSearch query', { error });

      return {
        statusCode: 500,
        payload: {
          error: 'Error executing search',
          details: (error as Error).message,
        },
      };
    }
  };
