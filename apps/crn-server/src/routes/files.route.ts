import Boom from '@hapi/boom';
import { Router, Response, Request } from 'express';
import FileController from '../controllers/files.controller';
import logger from '../utils/logger';

export const fileRouteFactory = (fileController: FileController): Router => {
  const fileRoutes = Router();

  fileRoutes.post('/files/upload-url', async (req: Request, res: Response) => {
    const { body, loggedInUser } = req;

    if (!loggedInUser) {
      logger.warn({ message: 'Unauthorized attempt to get pre-signed URL' });
      throw Boom.forbidden();
    }

    const { filename, contentType } = body;
    if (!filename || !contentType) {
      logger.warn({ message: 'Missing required fields', body });
      throw Boom.badRequest('Filename and Content-Type are required.');
    }

    try {
      logger.info({
        message: 'Requesting pre-signed URL',
        user: loggedInUser.id,
        filename,
      });

      const uploadUrl = await fileController.getPresignedUrl(
        filename,
        contentType,
      );

      logger.info({
        message: 'Successfully generated pre-signed URL',
        user: loggedInUser.id,
        filename,
        uploadUrl,
      });

      logger.debug(`Upload URL before sending response: ${uploadUrl}`);

      res.json({ uploadUrl });
    } catch (error) {
      logger.error({
        message: 'Error generating pre-signed URL',
        user: loggedInUser?.id,
        filename,
        error: error instanceof Error ? error.message : error,
      });

      res.status(500).json({
        message: 'Error generating pre-signed URL',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  return fileRoutes;
};
