import { Router } from 'express';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import FilesController from '../../src/controllers/files.controller';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';
import Boom from '@hapi/boom';

describe('/files/get-url route', () => {
  const fileControllerMock = {
    getPresignedUrl: jest.fn(),
  } as unknown as jest.Mocked<FilesController>;

  const mockRoutes = Router();
  mockRoutes.post('/files/get-url', async (req, _res, next) => {
    req.body = {
      ...req.body,
      action: 'upload',
      filename: 'some_file_name',
      contentType: 'application/pdf',
    };
    return next();
  });

  const app = appFactory({
    filesController: fileControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
    mockRequestHandlers: [mockRoutes],
  });

  afterEach(() => {
    fileControllerMock.getPresignedUrl.mockReset();
  });

  describe('POST /files/get-url', () => {
    it('should generate and return a presigned url', async () => {
      fileControllerMock.getPresignedUrl.mockResolvedValueOnce(
        'https://aws.s3.some-url.com',
      );

      const response = await supertest(app).post('/files/get-url');

      expect(response.status).toBe(200);
      expect(fileControllerMock.getPresignedUrl).toHaveBeenCalledWith(
        'some_file_name',
        'upload',
        'application/pdf',
      );

      expect(response.body).toEqual({
        presignedUrl: 'https://aws.s3.some-url.com',
      });
    });

    describe('error scenarios', () => {
      it('should throw if user is not logged in', async () => {
        const notLoggedInApp = appFactory({
          filesController: fileControllerMock,
          authHandler: (req, _res, next) => {
            req.loggedInUser = undefined;
            return next();
          },
          logger: loggerMock,
        });

        const response = await supertest(notLoggedInApp).post('/files/get-url');

        expect(response.status).toBe(403);
        expect(fileControllerMock.getPresignedUrl).not.toHaveBeenCalled();
      });

      it('should throw if filename is not provided', async () => {
        const mockRoutes = Router();
        mockRoutes.post('/files/get-url', async (req, _res, next) => {
          req.body = {
            ...req.body,
            action: 'upload',
            filename: undefined,
            contentType: 'application/pdf',
          };
          return next();
        });
        const noFilenameApp = appFactory({
          filesController: fileControllerMock,
          authHandler: authHandlerMock,
          logger: loggerMock,
          mockRequestHandlers: [mockRoutes],
        });

        const response = await supertest(noFilenameApp).post('/files/get-url');

        expect(response.status).toBe(400);
        expect(fileControllerMock.getPresignedUrl).not.toHaveBeenCalled();
      });

      it('should throw if contentType is not provided', async () => {
        const mockRoutes = Router();
        mockRoutes.post('/files/get-url', async (req, _res, next) => {
          req.body = {
            ...req.body,
            action: 'upload',
            filename: 'some_file_name',
            contentType: undefined,
          };
          return next();
        });
        const noContentTypeApp = appFactory({
          filesController: fileControllerMock,
          authHandler: authHandlerMock,
          logger: loggerMock,
          mockRequestHandlers: [mockRoutes],
        });

        const response =
          await supertest(noContentTypeApp).post('/files/get-url');

        expect(response.status).toBe(400);
        expect(fileControllerMock.getPresignedUrl).not.toHaveBeenCalled();
      });

      it('should return a 500 if it fails to generate a pre-signed URL', async () => {
        fileControllerMock.getPresignedUrl.mockRejectedValueOnce(
          Boom.badImplementation(),
        );

        const response = await supertest(app).post('/files/get-url');

        expect(response.status).toBe(500);
        expect(response.body.message).toEqual(
          'Error generating pre-signed URL',
        );
      });
    });
  });
});
