import { mapLimit } from 'async';
import {
  calendar_v3 as calendarV3,
  calendar as googleCalendar,
} from '@googleapis/calendar';
import { DateTime } from 'luxon';
import { GetJWTCredentials } from './aws-secret-manager';
import { getAuthClient } from './google-auth-client';
import { Logger } from './logger';
import { SyncEvent } from './sync-google-event';

type SyncToken = calendarV3.Schema$Events['nextSyncToken'];
type PageToken = calendarV3.Schema$Events['nextPageToken'];
export type SyncCalendar = (
  googleCalendarId: string,
  cmsCalendarId: string,
  syncToken: SyncToken,
) => Promise<SyncToken>;

export const syncCalendarFactory = (
  syncEvent: SyncEvent,
  getJWTCredentials: GetJWTCredentials,
  logger: Logger,
): SyncCalendar => {
  const getCalendarEvent = async (
    googleCalendarId: string,
    syncToken: SyncToken,
    pageToken?: PageToken,
  ): Promise<calendarV3.Schema$Events | null> => {
    const auth = await getAuthClient(getJWTCredentials);
    const calendar = googleCalendar({ version: 'v3', auth });
    try {
      const { data } = await calendar.events.list({
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
      return data;
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        error.status === 410
      ) {
        logger.warn(error, 'Token is Gone, doing full sync');
        return null;
      }
      logger.error(error, 'The API returned an error');
      throw error;
    }
  };
  const fetchEvents = async (
    googleCalendarId: string,
    cmsCalendarId: string,
    syncToken: SyncToken,
    pageToken?: PageToken,
  ): Promise<SyncToken> => {
    const data = await getCalendarEvent(googleCalendarId, syncToken, pageToken);

    if (!data) {
      return fetchEvents(googleCalendarId, cmsCalendarId, undefined);
    }
    const { items = [], timeZone, nextPageToken, nextSyncToken } = data;

    await mapLimit(items, 5, async (event: calendarV3.Schema$Event) => {
      try {
        const syncedEvent = await syncEvent(
          event,
          googleCalendarId,
          cmsCalendarId,
          timeZone || 'America/New_York',
        );
        logger.debug({ syncedEvent }, 'Synced event');
      } catch (error) {
        logger.error(error, 'Error syncing event');
      }
    });

    return nextPageToken
      ? fetchEvents(googleCalendarId, cmsCalendarId, syncToken, nextPageToken)
      : nextSyncToken;
  };

  return (googleCalendarId, cmsCalendarId, syncToken) =>
    fetchEvents(googleCalendarId, cmsCalendarId, syncToken);
};
