import { OpenSearchResponse } from '@asap-hub/server-common';
import { Router, Response } from 'express';
import OpenSearchController from '../controllers/opensearch.controller';
import logger from '../utils/logger';

export const opensearchRouteFactory = (
  opensearchController: OpenSearchController,
): Router => {
  const opensearchRoutes = Router();

  opensearchRoutes.post<{ index: string }>(
    '/opensearch/search/:index',
    async (
      req,
      res: Response<OpenSearchResponse | { error: string; message: string }>,
    ) => {
      const {
        body,
        params: { index },
        loggedInUser,
      } = req;

      try {
        const result = await opensearchController.search(index, body);

        logger.info({
          message: 'Successfully called OpenSearch search',
          index,
          body,
          result,
        });

        res.json(result as OpenSearchResponse);
      } catch (error) {
        logger.error({
          message: 'Error calling OpenSearch search',
          user: loggedInUser?.id,
          index,
          error: error instanceof Error ? error.message : error,
        });

        res.status(500).json({
          message: 'Error calling OpenSearch search',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    },
  );

  return opensearchRoutes;
};
