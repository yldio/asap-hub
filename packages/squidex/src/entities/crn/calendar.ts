import { GoogleLegacyCalendarColor } from '@asap-hub/model';
import { Entity, Graphql, Rest, RestPayload } from '../common';
import { GraphqlGroup } from './group';

export interface Calendar {
  googleCalendarId: string;
  color: GoogleLegacyCalendarColor;
  name: string;
  syncToken?: string;
  resourceId?: string | null;
  expirationDate?: number;
}

export interface RestCalendar extends Entity, Rest<Calendar> {}

export interface InputCalendar extends Entity, RestPayload<Calendar> {}
/**
 * @deprecated while we wait for group work
 */
export interface GraphqlCalendar extends Entity, Graphql<Calendar> {
  referencingGroupsContents?: GraphqlGroup[];
}
