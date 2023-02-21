import { BasicEvent } from './event-common';
import { GroupResponse } from './group';
import { ListResponse } from './common';
import { TeamResponse } from './team';
import { WorkingGroupResponse } from './working-group';
import { CalendarResponse } from './calendar';

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

export interface EventResponse extends BasicEvent {
  calendar: CalendarResponse;
  group?: GroupResponse;
  workingGroup?: WorkingGroupResponse;
  speakers: EventSpeaker[];
}

export type ListEventResponse = ListResponse<EventResponse>;

export type EventConstraint = {
  workingGroupId?: string;
  groupId?: string;
  userId?: string;
  teamId?: string;
  notStatus?: string;
};
