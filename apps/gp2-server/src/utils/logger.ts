import { getLogger } from '@asap-hub/server-common';
import { logLevel, logEnabled } from '../config';

const logger = getLogger({ logEnabled, logLevel });

export default logger;
