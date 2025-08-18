import { framework as lambda } from '@asap-hub/services-common';
import { API } from '@opensearch-project/opensearch';
import { Logger, getClient } from '../../utils';

export type OpensearchRequest = API.Search_RequestBody;
export type OpensearchResponse = API.Search_ResponseBody;
export type OpensearchTotalHits = API.Search_ResponseBody['hits']['total'];

export type SearchInput = API.Search_RequestBody;

type SearchOutput =
  | {
      data: OpensearchResponse;
      totalHits?: number;
      maxScore?: string | number;
    }
  | {
      error: string;
      details?: string;
    };

export const opensearchSearchHandlerFactory =
  (
    logger: Logger,
    awsRegion: string,
    stage: string,
    opensearchUsername: string | undefined,
    opensearchPassword: string | undefined,
  ): ((
    request: lambda.Request<SearchInput>,
  ) => Promise<lambda.Response<SearchOutput>>) =>
  async (
    request: lambda.Request<SearchInput>,
  ): Promise<lambda.Response<SearchOutput>> => {
    logger.info(`Received search request: ${JSON.stringify(request)}`);

    const payload = request.payload || {};
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
      const client = await getClient(
        awsRegion,
        stage,
        opensearchUsername,
        opensearchPassword,
      );

      const searchBody: API.Search_RequestBody = {
        query: { match_all: {} },
        ...payload,
      };

      logger.info(`Searching index "${index}" with body:`, {
        index,
        searchBody: JSON.stringify(searchBody),
      });

      const response = await client.search({
        index,
        body: searchBody,
      });

      if (!response.statusCode?.toString().startsWith('2')) {
        logger.error('Opensearch search failed', {
          statusCode: response.statusCode,
          body: response.body,
          index,
          searchBody,
        });

        return {
          statusCode: response.statusCode || 500,
          payload: {
            error: 'Opensearch search error',
            details: JSON.stringify(response.body),
          },
        };
      }

      // Extract useful metadata from response
      const responseBody = response.body as OpensearchResponse;
      const totalHits =
        typeof responseBody.hits?.total === 'object'
          ? responseBody.hits.total.value
          : responseBody.hits?.total;
      const maxScore = responseBody.hits?.max_score;

      logger.info(`Search completed successfully`, {
        index,
        totalHits,
        maxScore,
        returnedHits: responseBody.hits?.hits?.length || 0,
      });

      return {
        statusCode: 200,
        payload: {
          data: responseBody,
          totalHits,
          maxScore,
        },
      };
    } catch (error) {
      logger.error('🚨 RAW ERROR:', error);
      logger.error('🚨 FORMATED Error - logger:', {
        error: JSON.stringify(error, null, 2),
        index,
        payload,
      });

      logger.error('Error executing Opensearch search operation', {
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : String(error),
        index,
        payload,
      });

      return {
        statusCode: 500,
        payload: {
          error: 'Error executing Opensearch search operation',
          details: error instanceof Error ? error.message : String(error),
        },
      };
    }
  };
