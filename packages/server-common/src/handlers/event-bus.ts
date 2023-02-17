import { RestCalendar } from '@asap-hub/squidex';

export type SquidexEntityEvent =
  | 'Created'
  | 'Published'
  | 'Updated'
  | 'Unpublished'
  | 'Deleted';

export type LabEvent = `Labs${SquidexEntityEvent}`;
export type UserEvent = `Users${SquidexEntityEvent}`;

export type UserPayload = {
  type: UserEvent;
  payload: {
    $type: 'EnrichedContentEvent';
    type: SquidexEntityEvent;
    id: string;
    created: string;
    lastModified: string;
    version: number;
    data: { [x: string]: { iv: unknown } | null };
    dataOld?: { [x: string]: { iv: unknown } | null };
  };
};
export type CalendarEvent = `Calendars${SquidexEntityEvent}`;
type CalendarPayloadData = Pick<
  RestCalendar['data'],
  'googleCalendarId' | 'resourceId' | 'name' | 'color'
>;
export type CalendarPayload = {
  type: CalendarEvent;
  payload: {
    $type: 'EnrichedContentEvent';
    type: SquidexEntityEvent;
    id: string;
    data: CalendarPayloadData;
    dataOld?: CalendarPayloadData;
    version: number;
  };
};
