import { mapLimit } from 'async';
import { Auth, calendar_v3 as calendarV3, google } from 'googleapis';
import { DateTime } from 'luxon';
import { GetJWTCredentials } from './aws-secret-manager';
import { Logger } from './logger';
import { SyncEvent } from './sync-google-event';

type GaxiosError = Error & {
  code: string;
};
const isGaxiosError = (error: unknown): error is GaxiosError =>
  !!(error as GaxiosError)?.code; // We should upgrade google apis past version 70 so we can import Gaxios Error class and use instanceof instead.

export type SyncCalendar = (
  googleCalendarId: string,
  cmsCalendarId: string,
  syncToken: string | undefined,
) => Promise<string | null | undefined>;

export const syncCalendarFactory = (
  syncEvent: SyncEvent,
  getJWTCredentials: GetJWTCredentials,
  logger: Logger,
): SyncCalendar => {
  async function getCredentials() {
    try {
      return await getJWTCredentials();
    } catch (error) {
      logger.error(error, 'Error fetching AWS credentials');
      throw error;
    }
  }
  const fetchEvents = async (
    googleCalendarId: string,
    cmsCalendarId: string,
    syncToken: string | undefined,
    pageToken?: string,
  ): Promise<string | undefined | null> => {
    const credentials = await getCredentials();

    const auth = new Auth.GoogleAuth({
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
    }).fromJSON(credentials) as Auth.JWT;

    const calendar = google.calendar({ version: 'v3', auth });

    let data: calendarV3.Schema$Events;
    try {
      const res = await calendar.events.list({
        pageToken: pageToken || undefined,
        calendarId: googleCalendarId,
        singleEvents: true, // recurring events come returned as single events
        showDeleted: true,
        ...(syncToken
          ? { syncToken }
          : {
              timeMin: new Date('2020-10-01').toISOString(),
              timeMax: DateTime.utc().plus({ months: 6 }).toISO(),
            }),
      });
      data = res.data;
    } catch (error) {
      if (isGaxiosError(error) && error.code === '410') {
        logger.warn(error, 'Token is Gone, doing full sync');
        return fetchEvents(googleCalendarId, cmsCalendarId, undefined); // syncToken "Gone", do full sync
      }
      logger.error(error, 'The API returned an error');
      throw error;
    }

    const eventItems = data.items ?? [];
    const defaultCalendarTimezone = data.timeZone || 'America/New_York';

    await mapLimit(eventItems, 5, async (event: calendarV3.Schema$Event) => {
      try {
        const syncedEvent = await syncEvent(
          event,
          googleCalendarId,
          cmsCalendarId,
          defaultCalendarTimezone,
        );
        logger.debug({ syncedEvent }, 'Synced event');
      } catch (error) {
        logger.error(error, 'Error syncing event');
      }
    });

    if (data.nextPageToken) {
      return fetchEvents(
        googleCalendarId,
        cmsCalendarId,
        syncToken,
        data.nextPageToken,
      );
    }

    return data.nextSyncToken;
  };

  return async (
    googleCalendarId: string,
    cmsCalendarId: string,
    syncToken: string | undefined,
  ) => fetchEvents(googleCalendarId, cmsCalendarId, syncToken);
};
