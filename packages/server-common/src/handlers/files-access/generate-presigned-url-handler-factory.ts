import { framework as lambda } from '@asap-hub/services-common';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Logger } from '../../utils';

export const generatePresignedUrlHandlerFactory =
  (
    logger: Logger,
    bucket: string,
    region: string,
  ): ((request: lambda.Request) => Promise<{
    statusCode: number;
    payload:
      | {
          presignedURL: string;
        }
      | {
          error: string;
          details?: string;
        };
  }>) =>
  async (request) => {
    logger.debug(`request: ${JSON.stringify(request)}`);

    if (!request.params?.filename) {
      return {
        statusCode: 400,
        payload: { error: 'filename is required' },
      };
    }

    logger.info(`Received request: ${JSON.stringify(request)}`);

    try {
      const s3 = new S3Client({ region });
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: request.params.filename,
      });

      const presignedURL = await getSignedUrl(s3, command, { expiresIn: 300 });

      logger.info(`Generated pre-signed URL: ${presignedURL}`);

      return {
        statusCode: 200,
        payload: { presignedURL },
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
