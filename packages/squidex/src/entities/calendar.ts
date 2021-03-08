import { GoogleLegacyCalendarColor } from '@asap-hub/model';
import { Rest, Entity, Graphql } from './common';
import { GraphqlGroup } from './group';

export interface Calendar {
  id: string;
  color: GoogleLegacyCalendarColor;
  name: string;
  syncToken?: string;
  resourceId?: string | null;
  expirationDate?: number;
}

export interface RestCalendar extends Entity, Rest<Calendar> {}
export interface GraphqlCalendar extends Entity, Graphql<Calendar> {
  referencingGroupsContents?: GraphqlGroup[];
}
