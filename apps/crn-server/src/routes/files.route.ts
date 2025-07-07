import Boom from '@hapi/boom';
import { Router, Response, Request } from 'express';
import FileController from '../controllers/files.controller';
import logger from '../utils/logger';
import { validateFilePostRequestInput } from '../validation/file.validation';

export const fileRouteFactory = (fileController: FileController): Router => {
  const fileRoutes = Router();

  fileRoutes.post('/files/get-url', async (req: Request, res: Response) => {
    const { body, loggedInUser } = req;
    const payload = validateFilePostRequestInput(body);

    const { filename, contentType, action } = payload;
    const isUploadAction = action === 'upload';

    if (isUploadAction && !contentType) {
      throw Boom.badRequest('Filename and Content-Type are required.');
    }

    try {
      let presignedUrl;
      if (isUploadAction && contentType) {
        presignedUrl = await fileController.getPresignedUrl(
          filename,
          'upload',
          contentType,
        );
      } else {
        presignedUrl = await fileController.getPresignedUrl(
          filename,
          'download',
        );
      }

      logger.info({
        message: 'Successfully generated pre-signed URL',
        user: loggedInUser?.id,
        filename,
        presignedUrl,
      });

      res.json({ presignedUrl });
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
