import { CalendarResponse } from './calendar';
import { ListResponse } from './common';
import { BasicEvent } from './event-common';
import { GroupResponse } from './group';
import { TeamResponse } from './team';
import { WorkingGroupResponse } from './working-group';

export interface EventSpeakerUserData {
  alumniSinceDate?: string;
  id: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  avatarUrl?: string;
}

export interface EventSpeakerExternalUserData {
  name: string;
  orcid: string;
}

export type EventSpeakerTeam = {
  team: Pick<TeamResponse, 'displayName' | 'id' | 'inactiveSince'>;
};

export type EventSpeakerUser = {
  team: Pick<TeamResponse, 'displayName' | 'id' | 'inactiveSince'>;
  user: EventSpeakerUserData;
  role: string;
};

export type EventSpeakerExternalUser = {
  externalUser: EventSpeakerExternalUserData;
};

export type EventSpeaker =
  | EventSpeakerTeam
  | EventSpeakerUser
  | EventSpeakerExternalUser;

export interface EventDataObject extends BasicEvent {
  calendar: CalendarResponse;
  group?: GroupResponse;
  workingGroup?: WorkingGroupResponse;
  speakers: EventSpeaker[];
}

export type ListEventDataObject = ListResponse<EventDataObject>;
export type EventResponse = EventDataObject;
export type ListEventResponse = ListResponse<EventResponse>;

export type EventConstraint = {
  workingGroupId?: string;
  groupId?: string;
  userId?: string;
  teamId?: string;
  notStatus?: string;
};

export type EventCreateDataObject = Pick<
  EventDataObject,
  | 'title'
  | 'description'
  | 'startDate'
  | 'startDateTimeZone'
  | 'endDate'
  | 'endDateTimeZone'
  | 'status'
  | 'tags'
  | 'meetingLink'
  | 'hideMeetingLink'
> & {
  googleId: string;
  calendar: string;
  hidden: boolean;
  speakers?: {
    user: string[];
    team: string[];
  }[];
};

export type EventUpdateDataObject = Partial<
  Omit<EventDataObject, 'calendar'> & {
    calendar: string;
  }
>;

export type EventCreateRequest = EventCreateDataObject;
export type EventUpdateRequest = EventUpdateDataObject;
