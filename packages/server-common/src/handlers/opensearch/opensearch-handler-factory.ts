import { framework as lambda } from '@asap-hub/services-common';
import { Client } from '@opensearch-project/opensearch';
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { Logger } from '../../utils';

const getClient = (domainEndpoint: string, region: string) =>
  new Client({
    ...AwsSigv4Signer({
      getCredentials: defaultProvider(),
      region,
    }),
    node: `https://${domainEndpoint}`,
  });

type SearchResponse = {
  _shards: {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
  };
  hits: {
    total: {
      value: number;
      relation: string;
    };
    max_score: number;
    hits: {
      _index: string;
      _id: string;
      _score: number;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _source: any;
    }[];
  };
};

type Input = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: Record<string, any> | null;
};

type Output =
  | {
      data: SearchResponse;
    }
  | {
      error: string;
      details?: string;
    };

export const opensearchHandlerFactory =
  (
    logger: Logger,
    domainEndpoint: string,
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
      const client = getClient(domainEndpoint, region);

      const response = await client.search({
        index,
        body: query || { match_all: {} },
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
        payload: { data: response.body as SearchResponse },
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
