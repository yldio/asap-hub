/* istanbul ignore file */
import { getPrettyLogger } from '@asap-hub/server-common';
import { getCalendarDataProvider } from '@asap-hub/crn-server/src/dependencies/calendars.dependencies';
import { syncCalendars } from '../src/calendars/sync-all';

const logLevel = process.env.LOG_LEVEL || 'info';
const logEnabled = !!process.env.LOG_ENABLED || true;

const logger = getPrettyLogger({ logEnabled, logLevel });
const dataProvider = getCalendarDataProvider();

syncCalendars({ dataProvider, logger }).catch((error) => {
  logger.error(error);
  process.exit(1);
});
