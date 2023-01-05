import { getCloudWatchLogger } from '@asap-hub/server-common';
import { logLevel, logEnabled } from '../config';

const logger = getCloudWatchLogger({ logEnabled, logLevel });

export default logger;
