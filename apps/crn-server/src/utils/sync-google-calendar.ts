import { google, calendar_v3 as calendarV3, Auth } from 'googleapis';
import { DateTime } from 'luxon';
import { GetJWTCredentials } from './aws-secret-manager';
import logger from './logger';
import { SyncEvent } from './sync-google-event';

type GaxiosError = Error & {
  code: string;
};
const isGaxiosError = (error: unknown): error is GaxiosError =>
  !!(error as GaxiosError)?.code; // We should upgrade google apis past version 70 so we can import Gaxios Error class and use instanceof instead.

export type SyncCalendar = (
  googleCalendarId: string,
  squidexCalendarId: string,
  syncToken: string | undefined,
) => Promise<string | null | undefined>;

export const syncCalendarFactory = (
  syncEvent: SyncEvent,
  getJWTCredentials: GetJWTCredentials,
): SyncCalendar => {
  const fetchEvents = async (
    googleCalendarId: string,
    squidexCalendarId: string,
    syncToken: string | undefined,
    pageToken?: string,
  ): Promise<string | undefined | null> => {
    let credentials: Auth.JWTInput;

    try {
      credentials = await getJWTCredentials();
    } catch (error) {
      logger.error(error, 'Error fetching AWS credentials');
      throw error;
    }

    const auth = new Auth.GoogleAuth({
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
    }).fromJSON(credentials) as Auth.JWT;

    const params: calendarV3.Params$Resource$Events$List = {
      pageToken: pageToken || undefined,
      calendarId: googleCalendarId,
      singleEvents: true, // recurring events come returned as single events
      showDeleted: true,
    };

    if (!syncToken) {
      params.timeMin = new Date('2020-10-01').toISOString();
      params.timeMax = DateTime.utc().plus({ months: 6 }).toISO();
    }

    const calendar = google.calendar({ version: 'v3', auth });

    let data: calendarV3.Schema$Events;
    try {
      const res = await calendar.events.list(params);
      data = res.data;
    } catch (error) {
      if (isGaxiosError(error) && error.code === '410') {
        logger.warn(error, 'Token is Gone, doing full sync');
        return fetchEvents(googleCalendarId, squidexCalendarId, undefined); // syncToken "Gone", do full sync
      }
      logger.error(error, 'The API returned an error');
      throw error;
    }

    const eventItems = data.items ?? [];
    const defaultCalendarTimezone = data.timeZone || 'America/New_York';

    const syncResults = await Promise.allSettled(
      eventItems.map((e) =>
        syncEvent(
          e,
          googleCalendarId,
          squidexCalendarId,
          defaultCalendarTimezone,
        ),
      ),
    );
    logger.debug({ syncResults }, 'Sync events results');

    if (data.nextPageToken) {
      // get next page
      return fetchEvents(
        googleCalendarId,
        squidexCalendarId,
        data.nextPageToken,
      );
    }

    return data.nextSyncToken;
  };

  return async (
    googleCalendarId: string,
    squidexCalendarId: string,
    syncToken: string | undefined,
  ) => fetchEvents(googleCalendarId, squidexCalendarId, syncToken);
};
