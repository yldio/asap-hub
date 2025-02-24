import {
  ManuscriptFileResponse,
  ManuscriptFileType,
  ManuscriptPostCreateRequest,
  ManuscriptPostResubmitRequest,
  ManuscriptResponse,
} from '@asap-hub/model';
import Boom from '@hapi/boom';
import { RequestHandler, Response, Router } from 'express';
import multer from 'multer';

import ManuscriptController from '../controllers/manuscript.controller';
import {
  validateManuscriptParameters,
  validateManuscriptPostRequestParameters,
  validateManuscriptPutRequestParameters,
} from '../validation/manuscript.validation';

const upload = multer();

export const manuscriptRouteFactory = (
  manuscriptController: ManuscriptController,
): Router => {
  const manuscriptRoutes = Router();

  manuscriptRoutes.get<{ manuscriptId: string }>(
    '/manuscripts/:manuscriptId',
    async (req, res: Response<ManuscriptResponse>) => {
      const { params, loggedInUser } = req;

      if (!loggedInUser) throw Boom.forbidden();

      const { manuscriptId } = validateManuscriptParameters(params);

      const result = await manuscriptController.fetchById(manuscriptId);

      res.json(result);
    },
  );

  manuscriptRoutes.post<unknown, ManuscriptFileResponse>(
    '/manuscripts/file-upload',
    upload.single('file') as RequestHandler<unknown, ManuscriptFileResponse>,
    async (req, res) => {
      const { file, body } = req;
      const fileType = body.fileType as ManuscriptFileType;

      if (
        fileType === 'Manuscript File' &&
        (!file || file.mimetype !== 'application/pdf')
      ) {
        throw Boom.badRequest('No file provided or file is not a PDF.');
      }
      if (
        fileType === 'Key Resource Table' &&
        (!file || file.mimetype !== 'text/csv')
      ) {
        throw Boom.badRequest('No file provided or file is not a CSV.');
      }
      if (
        fileType === 'Additional Files' &&
        (!file ||
          (file.mimetype !== 'text/csv' && file.mimetype !== 'application/pdf'))
      ) {
        throw Boom.badRequest('No file provided or file is not a CSV or PDF.');
      }
      if (!file) {
        throw Boom.badRequest('No file provided.');
      }

      const manuscript = await manuscriptController.createFile({
        fileType,
        content: file.buffer,
        contentType: file.mimetype,
        filename: file.originalname,
      });

      res.status(201).json(manuscript);
    },
  );

  manuscriptRoutes.post('/manuscripts', async (req, res) => {
    const { body, loggedInUser } = req;
    const createRequest = validateManuscriptPostRequestParameters(
      body,
    ) as ManuscriptPostCreateRequest;

    const userBelongsToTeam = loggedInUser?.teams.some(
      (team) => team.id === createRequest.teamId,
    );

    if (!loggedInUser || !userBelongsToTeam) throw Boom.forbidden();

    try {
      const manuscript = await manuscriptController.create({
        ...createRequest,
        userId: loggedInUser.id,
      });

      res.status(201).json(manuscript);
    } catch (error) {
      if (error instanceof Error) {
        try {
          const errorMessage = error.message as string;
          const contentfulError = JSON.parse(errorMessage);
          res.status(Number(contentfulError.status) || 500).json({
            message: contentfulError.message || 'An error occurred',
            errors: contentfulError.details?.errors || [],
          });
          return;
        } catch {
          throw error;
        }
      }
      res.status(500).json({ message: 'Unexpected error' });
    }
  });

  manuscriptRoutes.post<{ manuscriptId: string }>(
    '/manuscripts/:manuscriptId',
    async (req, res) => {
      const { body, loggedInUser, params } = req;
      const createRequest = validateManuscriptPostRequestParameters(
        body,
      ) as ManuscriptPostResubmitRequest;

      if (!loggedInUser) throw Boom.forbidden();

      try {
        const manuscript = await manuscriptController.createVersion(
          params.manuscriptId,
          {
            ...createRequest,
            userId: loggedInUser.id,
          },
        );

        res.status(201).json(manuscript);
      } catch (error) {
        if (error instanceof Error) {
          try {
            const errorMessage = error.message as string;
            const contentfulError = JSON.parse(errorMessage);
            res.status(Number(contentfulError.status) || 500).json({
              message: contentfulError.message || 'An error occurred',
              errors: contentfulError.details?.errors || [],
            });
            return;
          } catch {
            throw error;
          }
        }
        res.status(500).json({ message: 'Unexpected error' });
      }
    },
  );

  manuscriptRoutes.put<{ manuscriptId: string }>(
    '/manuscripts/:manuscriptId',
    async (
      req,
      res: Response<
        | ManuscriptResponse
        | {
            message: string;
            errors?: { message: string; path: string }[];
          }
      >,
    ) => {
      const { params, loggedInUser, body } = req;
      const payload = validateManuscriptPutRequestParameters(body);
      if (
        !loggedInUser ||
        ('status' in payload &&
          payload.status &&
          !(
            loggedInUser.role === 'Staff' && loggedInUser.openScienceTeamMember
          ))
      )
        throw Boom.forbidden();

      const { manuscriptId } = params;
      try {
        const result = await manuscriptController.update(
          manuscriptId,
          payload,
          loggedInUser.id,
        );

        res.json(result);
      } catch (error) {
        if (error instanceof Error) {
          try {
            const errorMessage = error.message as string;
            const contentfulError = JSON.parse(errorMessage);
            res.status(Number(contentfulError.status) || 500).json({
              message: contentfulError.message || 'An error occurred',
              errors: contentfulError.details?.errors || [],
            });
            return;
          } catch {
            throw error;
          }
        }
        res.status(500).json({ message: 'Unexpected error' });
      }
    },
  );

  return manuscriptRoutes;
};
