import { FileAction } from '@asap-hub/model';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { getPresignedUrlHandlerFactory } from '../../../src/handlers/files-upload/get-presigned-url-handler-factory';
import { Logger } from '../../../src/utils';

jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-request-presigner');

const logger = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as jest.Mocked<Logger>;

const uploadBucket = 'test-upload-bucket';
const downloadBucket = 'test-download-bucket';
const region = 'eu-west-1';

const handler = getPresignedUrlHandlerFactory(
  logger,
  uploadBucket,
  downloadBucket,
  region,
);

describe('getPresignedUrlHandlerFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('upload', () => {
    const action = 'upload' as FileAction;
    test('returns 400 if filename is missing', async () => {
      const request = { action, contentType: 'application/pdf' };

      const response = await handler(request);

      expect(response.statusCode).toBe(400);
      expect(response.payload).toEqual({
        error: 'filename and contentType are required',
      });
    });

    test('returns 400 if contentType is missing', async () => {
      const request = { action, filename: 'file.pdf' };

      const response = await handler(request);

      expect(response.statusCode).toBe(400);
      expect(response.payload).toEqual({
        error: 'filename and contentType are required',
      });
    });

    test('returns presigned URL when request is valid', async () => {
      (getSignedUrl as jest.Mock).mockResolvedValueOnce('https://signed-url');

      const request = {
        action,
        filename: 'file.pdf',
        contentType: 'application/pdf',
      };

      const response = await handler(request);

      expect(S3Client).toHaveBeenCalledWith({ region });
      expect(PutObjectCommand).toHaveBeenCalledWith({
        Bucket: uploadBucket,
        Key: 'file.pdf',
        ContentType: 'application/pdf',
      });
      expect(getSignedUrl).toHaveBeenCalled();

      expect(response.statusCode).toBe(200);
      expect(response.payload).toEqual({ presignedUrl: 'https://signed-url' });
    });
  });

  describe('download', () => {
    const action = 'download' as FileAction;
    it('should return 400 if filename is not passed', async () => {
      const request = { action };

      const response = await handler(request);

      expect(response.statusCode).toBe(400);
      expect(response.payload).toEqual({ error: 'filename is required' });
    });

    test('returns presigned URL when request is valid', async () => {
      (getSignedUrl as jest.Mock).mockResolvedValueOnce('https://signed-url');

      const request = {
        action,
        filename: 'file.pdf',
      };

      const response = await handler(request);

      expect(S3Client).toHaveBeenCalledWith({ region });
      expect(GetObjectCommand).toHaveBeenCalledWith({
        Bucket: downloadBucket,
        Key: 'file.pdf',
        ResponseContentDisposition: expect.stringMatching(
          /attachment; filename="file.pdf_\d+\.csv"/,
        ),
      });
      expect(getSignedUrl).toHaveBeenCalled();

      expect(response.statusCode).toBe(200);
      expect(response.payload).toEqual({ presignedUrl: 'https://signed-url' });
    });
  });

  test('returns 400 if action is missing', async () => {
    const request = {};

    const response = await handler(request);

    expect(response.statusCode).toBe(400);
    expect(response.payload).toEqual({
      error: 'action is required',
    });
  });

  test('returns 500 if getSignedUrl throws error', async () => {
    const errorMessage = 'S3 error';
    (getSignedUrl as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const request = {
      action: 'upload' as FileAction,
      filename: 'file.pdf',
      contentType: 'application/pdf',
    };

    const response = await handler(request);

    expect(response.statusCode).toBe(500);
    expect(response.payload).toEqual({
      error: 'Error generating URL',
      details: errorMessage,
    });

    expect(logger.error).toHaveBeenCalledWith(
      'Error generating pre-signed URL',
      {
        error: expect.any(Error),
      },
    );
  });
});
