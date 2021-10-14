import { GoogleLegacyCalendarColor } from '@asap-hub/model';
import { Rest, Entity, Graphql } from './common';
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

/**
 * @deprecated while we wait for group work
 */
export interface GraphqlCalendar extends Entity, Graphql<Calendar> {
  referencingGroupsContents?: GraphqlGroup[];
}
