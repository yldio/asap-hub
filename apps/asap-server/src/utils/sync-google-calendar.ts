import { google, calendar_v3 as calendarV3, Auth } from 'googleapis';
import logger from './logger';

export type SyncCalendarFactory = (
  syncToken: string | undefined,
  syncEvent: (event: calendarV3.Schema$Event) => Promise<void>,
  auth: Auth.GoogleAuth | Auth.OAuth2Client,
) => (googleCalendarId: string) => Promise<string | undefined | null>;

export const syncCalendarFactory: SyncCalendarFactory = (
  syncToken: string | undefined,
  syncEvent: (event: calendarV3.Schema$Event) => Promise<void>,
  auth: Auth.GoogleAuth | Auth.OAuth2Client,
) => {
  const syncCalendar = async (
    googleCalendarId: string,
  ): Promise<string | undefined | null> => {
    return fetchEvents(googleCalendarId, auth, syncEvent, syncToken);
  };

  return syncCalendar;
};

const fetchEvents = async (
  googleCalendarId: string,
  auth: Auth.GoogleAuth | Auth.OAuth2Client,
  syncEvent: (event: calendarV3.Schema$Event) => Promise<void>,
  syncToken: string | undefined,
  pageToken?: string,
): Promise<string | undefined | null> => {
  const params: calendarV3.Params$Resource$Events$List = {
    pageToken: pageToken || undefined,
    calendarId: googleCalendarId,
    singleEvents: true, // recurring events come returned as single events
  };

  const calendar = google.calendar({ version: 'v3', auth });

  const res = await calendar.events.list(params).catch((err) => {
    if (err.code === '410') {
      logger('Token is Gone, doing full sync', err);
      return fetchEvents(googleCalendarId, auth, syncEvent, undefined); // syncToken "Gone", do full sync
    }
    logger('The API returned an error: ', err);
    throw err;
  });

  if (res && typeof res === 'object') {
    const eventItems = res.data.items ?? [];
    await Promise.all(eventItems.map((e) => syncEvent(e))).catch((e) => {
      logger('Error updating event:', e);
    });

    if (res.data.nextPageToken) {
      // get next page
      return fetchEvents(
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
