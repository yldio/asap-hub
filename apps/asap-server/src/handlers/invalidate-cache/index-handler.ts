import { S3Event } from 'aws-lambda';
import { cloudfrontDistributionId } from '../../config';
import logger from '../../utils/logger';

export const handler = async (event: S3Event): Promise<string> => {
  logger.info(JSON.stringify(event));
  logger.info('Invalidating cache', cloudfrontDistributionId);
  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createInvalidation-property
  return 'changed';
};
