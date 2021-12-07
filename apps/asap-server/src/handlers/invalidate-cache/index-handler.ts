import { S3Event } from 'aws-lambda';
import { CloudFront } from 'aws-sdk';
import { cloudfrontDistributionId } from '../../config';
import logger from '../../utils/logger';

export const createHandler =
  (distributionId: string) =>
  async (event: S3Event): Promise<string> => {
    logger.info(`event: ${JSON.stringify(event)}`);
    logger.info(`Invalidating cache: ${cloudfrontDistributionId}`);
    const cloudfront = new CloudFront({ apiVersion: '2020-05-31' });

    const response = await cloudfront
      .createInvalidation({
        DistributionId: distributionId,
        InvalidationBatch: {
          CallerReference: new Date().toISOString(),
          Paths: { Quantity: 1, Items: ['/index.html'] },
        },
      })
      .promise();

    logger.info(JSON.stringify(response));
    return 'changed';
  };

export const handler = createHandler(cloudfrontDistributionId);
