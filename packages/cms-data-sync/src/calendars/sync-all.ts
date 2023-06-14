import { Logger } from '@asap-hub/server-common';
import { CalendarDataProvider } from '@asap-hub/model';
import { Entry } from 'contentful-management';

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

  const updateCalendar = async (
    calendar: Entry,
    retries = 0,
  ): Promise<void> => {
    try {
      await dataProvider.update(calendar.sys.id, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        googleApiMetadata: {
          ...calendar.fields?.googleApiMetadata?.['en-US'],
          associatedGoogleCalendarId: undefined,
        },
      });
    } catch (error) {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      if ((error as any)?.name === 'RateLimitExceeded' && retries < 3) {
        const attempts = retries + 1;
        await updateCalendar(calendar, attempts);
      } else {
        throw error;
      }
    }
  };

  let hasErrored = false;

  for (const calendar of calendars) {
    try {
      await updateCalendar(calendar);
    } catch (error) {
      hasErrored = true;
      logger.error(error, `Failed to sync calendar: ${calendar.sys.id}`);
    }
  }

  if (hasErrored) {
    throw new Error('Calendar Syncing Error');
  }

  logger.info('Calendar syncing done');
}
