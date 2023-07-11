import { gp2 } from '@asap-hub/model';
import { Router } from 'express';
import ContributingCohortController from '../controllers/contributing-cohort.controller';

export const contributingCohortRouteFactory = (
  contributingCohortController: ContributingCohortController,
): Router => {
  const contributingCohortRoutes = Router();

  contributingCohortRoutes.get<unknown, gp2.ListContributingCohortResponse>(
    '/contributing-cohorts',
    async (_req, res) => {
      const contributingCohorts = await contributingCohortController.fetch();

      res.json(contributingCohorts);
    },
  );

  return contributingCohortRoutes;
};
