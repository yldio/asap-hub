import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront';
import { S3Event } from 'aws-lambda';
import { Logger } from '../../utils';

export const createInvalidateCacheHandler =
  (distributionId: string, logger: Logger) =>
  async (event: S3Event): Promise<void> => {
    logger.info('distributionId', distributionId);
    logger.debug(`event: ${JSON.stringify(event)}`);
    const client = new CloudFrontClient({ apiVersion: '2020-05-31' });
    const command = new CreateInvalidationCommand({
      DistributionId: distributionId,
      InvalidationBatch: {
        CallerReference: new Date().toISOString(),
        Paths: { Quantity: 1, Items: ['/index.html'] },
      },
    });
    logger.info('command', command);

    await client.send(command);
  };
