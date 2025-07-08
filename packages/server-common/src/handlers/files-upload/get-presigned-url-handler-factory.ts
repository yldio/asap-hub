import { FileAction } from '@asap-hub/model';
import { framework as lambda } from '@asap-hub/services-common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { format } from 'date-fns';
import { Logger } from '../../utils';

type Input = {
  action?: FileAction;
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
  ): ((request: Input) => Promise<lambda.Response<Output>>) =>
  async (request) => {
    logger.info(`Received request: ${JSON.stringify(request)}`);

    const { action, filename, contentType } = request;

    if (!action) {
      return {
        statusCode: 400,
        payload: {
          error: 'action is required',
        },
      };
    }

    const s3 = new S3Client({ region });

    let command;

    if (action === 'upload') {
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
      if (!filename) {
        return {
          statusCode: 400,
          payload: { error: 'filename is required' },
        };
      }
      const currentDate = format(new Date(), 'yyMMdd');
      command = new GetObjectCommand({
        Bucket: downloadBucket,
        Key: filename,
        ResponseContentDisposition: `attachment; filename="${filename}_${currentDate}.csv"`,
      });
    }

    try {
      const presignedUrl = await getSignedUrl(s3, command, {
        expiresIn:
          action === 'upload'
            ? UPLOAD_PRESIGNED_URL_DURATION
            : DOWNLOAD_PRESIGNED_URL_DURATION,
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
