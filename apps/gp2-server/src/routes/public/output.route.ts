import { Router, Response } from 'express';
import { gp2 as gp2Model } from '@asap-hub/model';
import { validateFetchPaginationOptions } from '@asap-hub/server-common';
import { NotFoundError } from '@asap-hub/errors';
import OutputController from '../../controllers/output.controller';

export const outputRouteFactory = (
  outputController: OutputController,
): Router => {
  const outputRoutes = Router();

  outputRoutes.get(
    '/outputs',
    async (req, res: Response<gp2Model.ListPublicOutputResponse>) => {
      const { query } = req;

      const options = validateFetchPaginationOptions(query);

      const result = await outputController.fetch({
        ...options,
        filter: { sharingStatus: 'Public', gp2Supported: 'Yes' },
      });

      res.json({
        total: result.total,
        items: result.items.map(mapOutputToPublicOutput),
      });
    },
  );

  outputRoutes.get(
    '/outputs/:outputId',
    async (req, res: Response<gp2Model.PublicOutputResponse>) => {
      const { outputId } = req.params;

      const output = await outputController.fetchById(outputId);

      if (output.sharingStatus !== 'Public' || output.gp2Supported !== 'Yes') {
        throw new NotFoundError(
          undefined,
          `output with id ${outputId} not found`,
        );
      }

      res.json(mapOutputToPublicOutput(output));
    },
  );

  return outputRoutes;
};

const mapOutputToPublicOutput = (
  output: gp2Model.OutputResponse,
): gp2Model.PublicOutputResponse => ({
  addedDate: output.addedDate,
  authors: output.authors.map((author) => {
    if ('onboarded' in author) {
      return {
        id: author.id,
        firstName: author.firstName,
        lastName: author.lastName,
        displayName: author.displayName,
        avatarUrl: author.avatarUrl,
      };
    }
    return {
      displayName: author.displayName,
    };
  }),
  documentType: output.documentType,
  id: output.id,
  lastModifiedDate: output.lastUpdatedPartial,
  publishDate: output.publishDate,
  shortDescription: output.shortDescription,
  systemPublishedVersion: output.systemPublishedVersion,
  tags: output.tags,
  title: output.title,
  type: output.type,
  workingGroups: output.workingGroups,
});
