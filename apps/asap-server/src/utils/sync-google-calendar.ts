import { google, calendar_v3 as calendarV3, Auth } from 'googleapis';
import { DateTime } from 'luxon';
import { Logger } from 'winston';

export type SyncCalendarFactory = (
  syncToken: string | undefined,
  syncEvent: SyncEvent,
  auth: Auth.GoogleAuth | Auth.OAuth2Client,
  logger: Logger,
) => (googleCalendarId: string) => Promise<string | undefined | null>;

interface SyncEvent {
  (event: calendarV3.Schema$Event, defaultCalendarTimezone: string): Promise<
    unknown
  >;
}

export const syncCalendarFactory: SyncCalendarFactory = (
  syncToken: string | undefined,
  syncEvent: SyncEvent,
  auth: Auth.GoogleAuth | Auth.OAuth2Client,
  logger: Logger,
) => {
  const syncCalendar = async (googleCalendarId: string) =>
    fetchEvents(logger, googleCalendarId, auth, syncEvent, syncToken);

  return syncCalendar;
};

const fetchEvents = async (
  logger: Logger,
  googleCalendarId: string,
  auth: Auth.GoogleAuth | Auth.OAuth2Client,
  syncEvent: SyncEvent,
  syncToken: string | undefined,
  pageToken?: string,
): Promise<string | undefined | null> => {
  const params: calendarV3.Params$Resource$Events$List = {
    pageToken: pageToken || undefined,
    calendarId: googleCalendarId,
    singleEvents: true, // recurring events come returned as single events
  };

  if (!syncToken) {
    params.timeMin = new Date('2020-10-01').toISOString();
    params.timeMax = DateTime.utc().plus({ months: 6 }).toISO();
  }

  const calendar = google.calendar({ version: 'v3', auth });

  const res = await calendar.events.list(params).catch((err) => {
    if (err.code === '410') {
      logger.info('Token is Gone, doing full sync', err);
      return fetchEvents(logger, googleCalendarId, auth, syncEvent, undefined); // syncToken "Gone", do full sync
    }
    logger.error('The API returned an error: ', err);
    throw err;
  });

  if (res && typeof res === 'object') {
    const eventItems = res.data.items ?? [];
    const defaultCalendarTimezone = res.data.timeZone || 'America/New_York';

    const syncResults = await Promise.allSettled(
      eventItems.map((e) => syncEvent(e, defaultCalendarTimezone)),
    );
    logger.info('Sync events results:', syncResults);

    if (res.data.nextPageToken) {
      // get next page
      return fetchEvents(
        logger,
        googleCalendarId,
        auth,
        syncEvent,
        syncToken,
        res.data.nextPageToken,
      );
    }

    return res.data.nextSyncToken;
  }

  // return the syncToken from a previous iteration
  return res;
};
