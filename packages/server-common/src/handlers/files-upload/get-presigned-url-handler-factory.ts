import { framework as lambda } from '@asap-hub/services-common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Logger } from '../../utils';

type Input = {
  filename?: string;
  contentType?: string;
};

type Output =
  | {
      presignedUrl: string;
    }
  | {
      error: string;
      details?: string;
    };

const UPLOAD_PRESIGNED_URL_DURATION = 3000;
const DOWNLOAD_PRESIGNED_URL_DURATION = 300;

export const getPresignedUrlHandlerFactory =
  (
    logger: Logger,
    uploadBucket: string,
    downloadBucket: string,
    region: string,
  ): ((request: lambda.Request) => Promise<lambda.Response<Output>>) =>
  async (request) => {
    logger.info(`Received request: ${JSON.stringify(request)}`);

    const method = request.method.toUpperCase();
    const s3 = new S3Client({ region });

    let command;

    if (method === 'POST') {
      const { filename, contentType } = request.payload as Input;
      if (!filename || !contentType) {
        return {
          statusCode: 400,
          payload: {
            error: 'filename and contentType are required',
          },
        };
      }
      command = new PutObjectCommand({
        Bucket: uploadBucket,
        Key: filename,
        ContentType: contentType,
      });
    } else {
      if (!request.params?.filename) {
        return {
          statusCode: 400,
          payload: { error: 'filename is required' },
        };
      }
      command = new GetObjectCommand({
        Bucket: downloadBucket,
        Key: request.params.filename,
      });
    }

    try {
      const presignedUrl = await getSignedUrl(s3, command, {
        expiresIn:
          method === 'GET'
            ? DOWNLOAD_PRESIGNED_URL_DURATION
            : UPLOAD_PRESIGNED_URL_DURATION,
      });

      logger.info(`Generated pre-signed URL: ${presignedUrl}`);

      return {
        statusCode: 200,
        payload: { presignedUrl },
      };
    } catch (error) {
      logger.error('Error generating pre-signed URL', { error });

      return {
        statusCode: 500,
        payload: {
          error: 'Error generating URL',
          details: (error as Error).message,
        },
      };
    }
  };
