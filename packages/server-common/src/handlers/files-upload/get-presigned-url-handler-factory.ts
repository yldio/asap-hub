import { framework as lambda } from '@asap-hub/services-common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Logger } from '../../utils';

export const getPresignedUrlHandlerFactory =
  (logger: Logger, bucket: string, region: string) =>
  async (
    request: lambda.Request<{ filename?: string; contentType?: string }>,
  ) => {
    const s3 = new S3Client({ region, apiVersion: '2006-03-01' });

    logger.debug(`Used region: ${region}`);
    logger.debug(`Full request: ${JSON.stringify(request)}`);

    try {
      const { filename, contentType } = request.payload;

      if (!filename || !contentType) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'filename and contentType are required',
          }),
        };
      }

      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: filename,
        ContentType: contentType,
      });

      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

      logger.info(`Generated pre-signed URL: ${uploadUrl}`);

      return {
        statusCode: 200,
        body: JSON.stringify({ uploadUrl }),
      };
    } catch (error) {
      logger.error('Error generating pre-signed URL', { error });
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error generating URL',
          details: (error as Error).message,
        }),
      };
    }
  };
