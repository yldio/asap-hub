import Boom from '@hapi/boom';
import { Router, Response } from 'express';
import FileController from '../controllers/files.controller';

export const fileRouteFactory = (fileController: FileController): Router => {
  const fileRoutes = Router();
  fileRoutes.post('/files/upload-url', async (req, res: Response) => {
    const { body, loggedInUser } = req;

    if (!loggedInUser) throw Boom.forbidden();

    const { filename, contentType } = body;
    if (!filename || !contentType) {
      throw Boom.badRequest('Filename and Content-Type are required.');
    }

    try {
      const uploadUrl = await fileController.getPresignedUrl(
        filename,
        contentType,
      );
      res.json({ uploadUrl });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error generating pre-signed URL', error });
    }
  });

  return fileRoutes;
};
