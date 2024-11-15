import { NotFoundError } from '@asap-hub/errors';
import {
  ListPublicOutputResponse,
  PublicResearchOutputResponse,
  ResearchOutputResponse,
} from '@asap-hub/model';
import { validateFetchPaginationOptions } from '@asap-hub/server-common';
import { Response, Router } from 'express';
import ResearchOutputController from '../../controllers/research-output.controller';

export const researchOutputRouteFactory = (
  researchOutputController: ResearchOutputController,
): Router => {
  const researchOutputRoutes = Router();

  researchOutputRoutes.get(
    '/research-outputs',
    async (req, res: Response<ListPublicOutputResponse>) => {
      const { query } = req;

      const options = validateFetchPaginationOptions(query);

      const result = await researchOutputController.fetch({
        ...options,
        filter: { sharingStatus: 'Public', asapFunded: 'Yes' },
      });

      res.json({
        total: result.total,
        items: result.items.map(mapToPublicResearchOutput),
      });
    },
  );

  researchOutputRoutes.get(
    '/research-outputs/:researchOutputId',
    async (req, res: Response<PublicResearchOutputResponse>) => {
      const { researchOutputId } = req.params;

      const researchOutput =
        await researchOutputController.fetchById(researchOutputId);

      if (
        researchOutput.sharingStatus !== 'Public' ||
        !researchOutput.asapFunded
      ) {
        throw new NotFoundError(
          undefined,
          `researchOutput with id ${researchOutputId} not found`,
        );
      }

      res.json(mapToPublicResearchOutput(researchOutput));
    },
  );

  return researchOutputRoutes;
};

const mapToPublicResearchOutput = (
  researchOutput: ResearchOutputResponse,
): PublicResearchOutputResponse => ({
  id: researchOutput.id,
  sharingStatus: researchOutput.sharingStatus,
  asapFunded: researchOutput.asapFunded,
  teams: researchOutput.teams.map((team) => team.displayName),
  authors: researchOutput.authors.map((author) => author.displayName),
  title: researchOutput.title,
  description: researchOutput.descriptionMD || researchOutput.description,
  shortDescription: researchOutput.shortDescription,
  tags: [
    ...researchOutput.methods,
    ...researchOutput.organisms,
    ...researchOutput.environments,
    ...(researchOutput.subtype ? [researchOutput.subtype] : []),
    ...researchOutput.keywords,
  ],
  hyperlink: researchOutput.link,
  type: researchOutput.type,
  persistentIdentifier: researchOutput.doi,
  relatedResearch: researchOutput.relatedResearch,
  created: researchOutput.created,
  researchTheme: researchOutput.researchTheme,
  finalPublishDate:
    researchOutput.type === 'Published'
      ? researchOutput.publishDate
      : undefined,
  preprintPublishDate:
    researchOutput.type === 'Preprint' ? researchOutput.publishDate : undefined,
});
