import { S3Event } from 'aws-lambda';
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront';
import { cloudfrontDistributionId } from '../../config';
import logger from '../../utils/logger';

export const createHandler =
  (distributionId: string) =>
  async (event: S3Event): Promise<void> => {
    logger.debug(`event: ${JSON.stringify(event)}`);
    const client = new CloudFrontClient({ apiVersion: '2020-05-31' });
    const command = new CreateInvalidationCommand({
      DistributionId: distributionId,
      InvalidationBatch: {
        CallerReference: new Date().toISOString(),
        Paths: { Quantity: 1, Items: ['/index.html'] },
      },
    });
    await client.send(command);
  };

export const handler = createHandler(cloudfrontDistributionId);
