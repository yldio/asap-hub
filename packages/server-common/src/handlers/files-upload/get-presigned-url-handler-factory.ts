import { framework as lambda } from '@asap-hub/services-common';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Logger } from '../../utils';

export const getPresignedUrlHandlerFactory =
  (logger: Logger, bucket: string, region: string) =>
  async (request: lambda.Request) => {
    const s3 = new S3Client({ apiVersion: '2006-03-01', region });

    try {
      logger.debug(`request: ${JSON.stringify(request)}`);

      const body = request.params;
      if (!body || !body.filename || !body.contentType) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'filename and contentType are required',
          }),
        };
      }

      const command = {
        Bucket: bucket,
        Key: body.filename,
      };

      const uploadUrl = await getSignedUrl(s3, new GetObjectCommand(command), {
        expiresIn: 300,
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ uploadUrl }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error generating URL', details: error }),
      };
    }
  };
