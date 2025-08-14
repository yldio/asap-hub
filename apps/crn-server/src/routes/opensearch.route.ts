import { OpensearchResponse } from '@asap-hub/server-common';
import Boom from '@hapi/boom';
import { Router, Response } from 'express';
import OpensearchController from '../controllers/opensearch.controller';
import logger from '../utils/logger';

export const opensearchRouteFactory = (
  opensearchController: OpensearchController,
): Router => {
  const opensearchRoutes = Router();

  opensearchRoutes.post<{ index: string }>(
    '/opensearch/search/:index',
    async (
      req,
      res: Response<OpensearchResponse | { error: string; message: string }>,
    ) => {
      const {
        body,
        params: { index },
        loggedInUser,
      } = req;

      if (!loggedInUser) throw Boom.forbidden();

      try {
        const result = await opensearchController.search(
          index,
          body,
          loggedInUser,
        );

        logger.info({
          message: 'Successfully called Opensearch search',
          index,
          body,
          result,
        });

        res.json(result as OpensearchResponse);
      } catch (error) {
        logger.error({
          message: 'Error calling Opensearch search',
          user: loggedInUser?.id,
          index,
          error: error instanceof Error ? error.message : error,
        });

        res.status(500).json({
          message: 'Error calling Opensearch search',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    },
  );

  return opensearchRoutes;
};
