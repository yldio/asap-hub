import { S3Event } from 'aws-lambda';
import logger from '../../utils/logger';

export const handler = async (event: S3Event): Promise<string> => {
  logger.info(event);
  return 'changed';
};
