import { framework as lambda } from '@asap-hub/services-common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Logger } from '../../utils';

type Input = {
  filename?: string;
  contentType?: string;
};

type Output =
  | {
      uploadUrl: string;
    }
  | {
      error: string;
      details?: string;
    };

export const getPresignedUrlHandlerFactory =
  (
    logger: Logger,
    bucket: string,
    region: string,
  ): ((request: lambda.Request<Input>) => Promise<lambda.Response<Output>>) =>
  async (request) => {
    const { filename, contentType } = request.payload;

    logger.info(`Received request: ${JSON.stringify(request)}`);

    if (!filename || !contentType) {
      return {
        statusCode: 400,
        payload: {
          error: 'filename and contentType are required',
        },
      };
    }

    try {
      const s3 = new S3Client({ region });
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: filename,
        ContentType: contentType,
      });

      // Generate the pre-signed URL
      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3000 });

      logger.info(`Generated pre-signed URL: ${uploadUrl}`);

      return {
        statusCode: 200,
        payload: { uploadUrl },
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
