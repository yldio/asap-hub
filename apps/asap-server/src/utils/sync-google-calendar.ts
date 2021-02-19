import { google, calendar_v3, Auth } from 'googleapis';
import { CalendarController } from '../controllers/calendars';

// Try to get syncToken from squidex
// - if syncToken => set that in the params
// - else => do full sync
//
// Iterate over the received pages
//   if 410 ? full sync again
// forEach update => do squidex update
//
// Finally store nextSyncToken on squidex calendar

export const syncCalendarFactory = (
  syncEvent: (event: calendar_v3.Schema$Event) => Promise<void>,
  calendarsController: CalendarController,
) => async (calendarId: string): Promise<void> => {
  const auth = new google.auth.GoogleAuth({
    keyFile: '../google-credentials.json',
    scopes: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ],
  });

  const syncToken = await calendarsController
    .getSyncToken(calendarId)
    .catch((err) => {
      console.log('Error fetching syncToken', err);
      return undefined;
    });

  const nextSyncToken = await listEvents(
    calendarId,
    auth,
    syncEvent,
    syncToken,
  );

  if (nextSyncToken) {
    await calendarsController
      .update(calendarId, { syncToken: nextSyncToken })
      .catch((err) => {
        console.log('Error updated syncToken', err);
      });
  }
};

const listEvents = async (
  calendarId: string,
  auth: Auth.GoogleAuth,
  syncEvent: Function,
  syncToken?: string,
  pageToken?: string,
): Promise<string | undefined | null> => {
  const params: calendar_v3.Params$Resource$Events$List = {
    pageToken: pageToken || undefined,
    calendarId,
    singleEvents: true, // recurring events come returned as single events
  };

  // If not syncToken is passed then we make full sync starting from 3 months ago
  if (!syncToken) {
    const today = new Date();
    params.timeMin = new Date(
      today.setMonth(today.getMonth() - 3),
    ).toISOString();
  }

  const calendar = google.calendar({ version: 'v3', auth });
  const res = await calendar.events.list(params).catch((err) => {
    if (err.code === '410') {
      console.log('Token is Gone, doing full sync', err);
      return listEvents(calendarId, auth, syncEvent); // syncToken "Gone", do full sync
    }
    console.log('The API returned an error: ', err);
    throw err;
  });

  if (res && typeof res === 'object') {
    const eventItems = res.data.items ?? [];
    await Promise.all(eventItems.map((e) => syncEvent(e))).catch((e) => {
      console.log('Error updating event:', e);
    });

    if (res.data.nextPageToken) {
      // get next page
      return listEvents(
        calendarId,
        auth,
        syncEvent,
        syncToken,
        res.data.nextPageToken,
      );
    }

    return res.data.nextSyncToken;
  }

  return res;
};
