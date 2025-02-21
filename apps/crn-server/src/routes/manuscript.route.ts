import {
  ManuscriptFileResponse,
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
// Store chunks in memory (use a Map for better performance)
const chunksMap = new Map<
  string,
  { chunks: (Buffer | null)[]; totalChunks: number }
>();

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
      const { fileName, fileId, chunkIndex, totalChunks, fileType, mimeType } =
        body;

      if (!file) {
        throw Boom.badRequest('No file provided.');
      }

      const chunkIdx = parseInt(chunkIndex, 10);
      const totalChunksNum = parseInt(totalChunks, 10);

      if (Number.isNaN(chunkIdx) || Number.isNaN(totalChunksNum)) {
        throw Boom.badRequest('Invalid chunk index or total chunks.');
      }

      // Initialize storage if it doesn't exist
      if (!chunksMap.has(fileId)) {
        chunksMap.set(fileId, {
          chunks: new Array(totalChunksNum).fill(null), // Ensure all are empty Buffers
          totalChunks: totalChunksNum,
        });
      }

      // Retrieve chunk storage
      const chunkData = chunksMap.get(fileId);

      if (!chunkData) {
        throw Boom.badRequest('Invalid fileId or chunk data not initialized.');
      }

      chunkData.chunks[chunkIdx] = file.buffer;

      // Check if all chunks have been received
      if (chunkData.chunks.every((chunk) => chunk !== null)) {
        const fileBuffer = Buffer.concat(
          chunkData.chunks.filter((chunk): chunk is Buffer => chunk !== null),
        );

        const manuscript = await manuscriptController.createFile({
          fileType,
          content: fileBuffer,
          contentType: mimeType,
          filename: fileName,
        });

        // Clean up stored chunks
        chunksMap.delete(fileId);

        return res.status(201).json(manuscript);
      }

      // Send response to acknowledge chunk reception
      return res.status(200).send();
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

    const manuscript = await manuscriptController.create({
      ...createRequest,
      userId: loggedInUser.id,
    });

    res.status(201).json(manuscript);
  });

  manuscriptRoutes.post<{ manuscriptId: string }>(
    '/manuscripts/:manuscriptId',
    async (req, res) => {
      const { body, loggedInUser, params } = req;
      const createRequest = validateManuscriptPostRequestParameters(
        body,
      ) as ManuscriptPostResubmitRequest;

      if (!loggedInUser) throw Boom.forbidden();

      const manuscript = await manuscriptController.createVersion(
        params.manuscriptId,
        {
          ...createRequest,
          userId: loggedInUser.id,
        },
      );

      res.status(201).json(manuscript);
    },
  );

  manuscriptRoutes.put<{ manuscriptId: string }>(
    '/manuscripts/:manuscriptId',
    async (req, res: Response<ManuscriptResponse>) => {
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

      const result = await manuscriptController.update(
        manuscriptId,
        payload,
        loggedInUser.id,
      );

      res.json(result);
    },
  );

  return manuscriptRoutes;
};
