import { Router, Response } from 'express';
import { gp2 as gp2Model } from '@asap-hub/model';
import { validateFetchPaginationOptions } from '@asap-hub/server-common';
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

  return outputRoutes;
};

const mapOutputToPublicOutput = (
  output: gp2Model.OutputResponse,
): gp2Model.PublicOutputResponse => ({
  id: output.id,
  title: output.title,
  documentType: output.documentType,
  addedDate: output.addedDate,
  tags: output.tags,
  publishDate: output.publishDate,
  type: output.type,
  workingGroups: output.workingGroups,
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
});
