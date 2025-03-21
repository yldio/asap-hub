import { CalendarResponse } from './calendar';
import { FetchOptions, ListResponse } from './common';
import { BasicEvent, SortOptions } from './event-common';
import { InterestGroupResponse } from './interest-group';
import {
  ResearchOutputResponse,
  ResearchOutputWorkingGroupResponse,
} from './research-output';
import { ResearchTagDataObject } from './research-tag';
import { TeamResponse } from './team';
import { TutorialsDataObject } from './tutorials';
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
  interestGroup?: Pick<
    InterestGroupResponse,
    'id' | 'name' | 'active' | 'tools'
  >;
  workingGroup?: Pick<WorkingGroupResponse, 'id' | 'title'>;
  speakers: EventSpeaker[];
  relatedTutorials: Array<
    Pick<TutorialsDataObject, 'id' | 'title' | 'created'>
  >;
  tags: Pick<ResearchTagDataObject, 'id' | 'name'>[];
  relatedResearch: (Pick<
    ResearchOutputResponse,
    'documentType' | 'type' | 'id' | 'title'
  > & {
    teams: Pick<
      ResearchOutputResponse['teams'][number],
      'displayName' | 'id'
    >[];
    workingGroups?:
      | Pick<
          ResearchOutputWorkingGroupResponse['workingGroups'][0],
          'id' | 'title'
        >[]
      | ResearchOutputResponse['workingGroups'];
  })[];
}

export type ListEventDataObject = ListResponse<EventDataObject>;
export type EventResponse = EventDataObject;
export type ListEventResponse = ListResponse<EventResponse>;

export type EventConstraint = {
  workingGroupId?: string;
  interestGroupId?: string;
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
  | 'hideMeetingLink'
> & {
  googleId: string;
  calendar: string;
  hidden: boolean;
};

export type EventUpdateDataObject = Partial<
  Omit<EventDataObject, 'calendar'> & {
    calendar: string;
  }
>;

export type EventCreateRequest = EventCreateDataObject;
export type EventUpdateRequest = EventUpdateDataObject;

type BaseFilterOptions = {
  workingGroupId?: never;
  interestGroupId?: never;
  userId?: never;
  externalAuthorId?: never;
  teamId?: never;
  googleId?: never;
  hidden?: never;
};

type ExclusiveFilterOption<T> = Omit<BaseFilterOptions, keyof T> & T;

type FilterOptions =
  | ExclusiveFilterOption<{ workingGroupId?: string }>
  | ExclusiveFilterOption<{ interestGroupId?: string }>
  | ExclusiveFilterOption<{ userId?: string }>
  | ExclusiveFilterOption<{ externalAuthorId?: string }>
  | ExclusiveFilterOption<{ teamId?: string }>
  | ExclusiveFilterOption<{
      googleId?: string;
      hidden?: boolean;
    }>;

export type FetchEventsOptions = {
  after?: string;
  before?: string;
} & SortOptions &
  FetchOptions<FilterOptions>;
