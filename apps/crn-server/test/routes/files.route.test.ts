import supertest from 'supertest';
import { createUserResponse } from '@asap-hub/fixtures';
import { AuthHandler } from '@asap-hub/server-common';

import { appFactory } from '../../src/app';
import { loggerMock } from '../mocks/logger.mock';

import FilesController from '../../src/controllers/files.controller';

const filesController = {
  getPresignedUrl: jest.fn(),
} as unknown as jest.Mocked<FilesController>;

describe('/files route', () => {
  const userMockFactory = jest.fn();
  const authHandlerMock: AuthHandler = (req, _res, next) => {
    req.loggedInUser = userMockFactory();
    next();
  };

  let app: ReturnType<typeof appFactory>;

  beforeEach(() => {
    jest.resetAllMocks();
    userMockFactory.mockReturnValue(createUserResponse());

    app = appFactory({
      filesController,
      authHandler: authHandlerMock,
      logger: loggerMock,
    });
  });

  describe('POST /files/upload-url', () => {
    const endpoint = '/files/upload-url';
    const validBody = {
      filename: 'test.pdf',
      contentType: 'application/pdf',
    };

    test('returns 403 if no user is logged in', async () => {
      userMockFactory.mockReturnValue(undefined);

      const response = await supertest(app).post(endpoint).send(validBody);

      expect(response.status).toBe(403);
    });

    test('returns 400 if filename or contentType is missing', async () => {
      const response = await supertest(app).post(endpoint).send({
        contentType: 'application/pdf',
      });

      expect(response.status).toBe(400);
    });

    test('logs warning and returns 403 if user is not authenticated', async () => {
      userMockFactory.mockReturnValue(undefined);

      const response = await supertest(app).post('/files/upload-url').send({
        filename: 'test.pdf',
        contentType: 'application/pdf',
      });

      expect(loggerMock.warn).toHaveBeenCalledWith(
        'No transaction id on request to /files/upload-url',
      );
      expect(response.status).toBe(403);
    });

    test('returns 200 and the presigned URL on success', async () => {
      const mockUrl = 'https://presigned-url.com';
      filesController.getPresignedUrl.mockResolvedValueOnce(mockUrl);

      const response = await supertest(app).post(endpoint).send(validBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ uploadUrl: mockUrl });
      expect(filesController.getPresignedUrl).toHaveBeenCalledWith(
        'test.pdf',
        'application/pdf',
      );
    });

    test('returns 500 when the controller throws', async () => {
      filesController.getPresignedUrl.mockRejectedValueOnce(
        new Error('Something broke'),
      );

      const response = await supertest(app).post(endpoint).send(validBody);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error generating pre-signed URL',
        error: 'Something broke',
      });
    });
  });
});
