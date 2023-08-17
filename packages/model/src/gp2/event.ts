import { FetchOptions, ListResponse } from '../common';
import { BasicEvent, SortOptions } from '../event-common';
import { CalendarResponse } from './calendar';
import { KeywordDataObject } from './keywords';
import { ProjectResponse } from './project';
import { WorkingGroupResponse } from './working-group';

export interface EventSpeakerUser {
  id: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  avatarUrl?: string;
}
export interface EventSpeakerExternalUser {
  name: string;
  orcid?: string;
}
export interface SpeakerInfo {
  speaker: EventSpeakerUser | EventSpeakerExternalUser | undefined;
}
export type EventSpeaker = SpeakerInfo & { topic?: string };

export interface EventDataObject extends BasicEvent {
  calendar: CalendarResponse;
  project?: Pick<ProjectResponse, 'id' | 'title'>;
  workingGroup?: Pick<WorkingGroupResponse, 'id' | 'title'>;
  speakers: EventSpeaker[];
  keywords: KeywordDataObject[];
}

export type ListEventDataObject = ListResponse<EventDataObject>;
export type EventResponse = EventDataObject;
export type ListEventResponse = ListResponse<EventResponse>;

export type EventConstraint = {
  userId?: string;
  workingGroupId?: string;
  projectId?: string;
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
  | 'meetingLink'
  | 'hideMeetingLink'
> & {
  googleId: string;
  calendar: string;
  hidden: boolean;
};

export type EventUpdateDataObject = Partial<
  Omit<EventDataObject, 'calendar' | 'keywords'> & {
    calendar: string;
    keywords?: Omit<KeywordDataObject, 'name'>[] | null;
  }
>;

export type EventCreateRequest = EventCreateDataObject;
export type EventUpdateRequest = EventUpdateDataObject;

type BaseFilterOptions = {
  workingGroupId?: never;
  projectId?: never;
  userId?: never;
  externalUserId?: never;
  googleId?: never;
  hidden?: never;
  hasTags?: boolean;
};

type ExclusiveFilterOption<T> = Omit<BaseFilterOptions, keyof T> & T;

type FilterOptions =
  | ExclusiveFilterOption<{ workingGroupId?: string }>
  | ExclusiveFilterOption<{ projectId?: string }>
  | ExclusiveFilterOption<{ userId?: string }>
  | ExclusiveFilterOption<{ externalUserId?: string }>
  | ExclusiveFilterOption<{
      googleId?: string;
      hidden?: boolean;
    }>;

export type FetchEventsOptions = {
  after?: string;
  before?: string;
} & SortOptions &
  FetchOptions<FilterOptions>;
