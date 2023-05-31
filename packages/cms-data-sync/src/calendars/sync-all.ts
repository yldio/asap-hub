import { Logger } from '@asap-hub/server-common';
import { CalendarDataProvider } from '@asap-hub/model';

import { fetchContentfulEntries, getContentfulClient } from '../utils';

export async function syncCalendars({
  dataProvider,
  logger,
}: {
  dataProvider: CalendarDataProvider;
  logger: Logger;
}) {
  const { contentfulEnvironment } = await getContentfulClient();

  const calendars = await fetchContentfulEntries(
    contentfulEnvironment,
    'calendars',
  );

  if (!calendars.length) {
    logger.info('No calendars to sync');
    return;
  }

  const promises = await Promise.allSettled(
    calendars.map(async (calendar) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await dataProvider.update(calendar.sys.id, { googleApiMetadata: {} });
    }),
  );

  let hasErrored = false;

  promises.forEach((promise, i) => {
    if (promise.status === 'rejected') {
      hasErrored = true;
      const calendar = calendars[i];
      logger.error(
        promise.reason,
        `Failed to sync calendar: ${calendar.sys.id}`,
      );
    }
  });

  if (hasErrored) {
    throw new Error('Calendar Syncing Error');
  }

  logger.info('Calendar syncing done');
}
