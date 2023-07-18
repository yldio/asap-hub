import {
  CalendarCreateDataObject as CommonCalendarCreateDataObject,
  EventCreateDataObject as CommonEventCreateDataObject,
  EventUpdateDataObject as CommonEventUpdateDataObject,
  UserCreateDataObject as CommonUserCreateDataObject,
  TeamCreateDataObject as CommonTeamCreateDataObject,
  ResearchOutputCreateDataObject as CommonResearchOutputCreateDataObject,
  GroupDataObject,
  GroupRole,
  WorkingGroupDataObject,
  WorkingGroupRole,
} from '@asap-hub/model';

export type CalendarCreateDataObject = CommonCalendarCreateDataObject;
export type EventCreateDataObject = CommonEventCreateDataObject & {
  speakers?: {
    user: string[];
    team: string[];
  }[];
  notes?: string | null;
  videoRecording?: string | null;
  presentation?: string | null;
};
export type EventUpdateDataObject = Pick<
  CommonEventUpdateDataObject,
  'notes' | 'presentation' | 'videoRecording'
>;
export type UserCreateDataObject = Omit<CommonUserCreateDataObject, 'labIds'>;
export type TeamCreateDataObject = CommonTeamCreateDataObject;
export type ResearchOutputCreateDataObject = Omit<
  CommonResearchOutputCreateDataObject,
  | 'teamIds'
  | 'methodIds'
  | 'organismIds'
  | 'environmentIds'
  | 'keywordIds'
  | 'labIds'
  | 'relatedResearchIds'
  | 'relatedEventIds'
  | 'createdBy'
> & {
  teams: string[];
  published: boolean;
  methods: string[];
  organisms: string[];
  environments: string[];
  keywords: string[];
  labs: string[];
  relatedResearch: string[];
  relatedEvents: string[];
  authors: { userId: string }[];
};
export type InterestGroupCreateDataObject = Omit<
  GroupDataObject,
  | 'id'
  | 'lastModifiedDate'
  | 'createdDate'
  | 'leaders'
  | 'teams'
  | 'contactEmails'
  | 'calendars'
  | 'tools'
> & {
  leaders: { user: string; role: GroupRole; inactiveSinceDate?: string }[];
  teams: { id: string }[];
  calendar: { id: string } | null;
};
export type WorkingGroupCreateDataObject = Omit<
  WorkingGroupDataObject,
  | 'id'
  | 'lastModifiedDate'
  | 'createdDate'
  | 'calendars'
  | 'leaders'
  | 'members'
> & {
  leaders: {
    user: string;
    role: WorkingGroupRole;
    workstreamRole: string;
    inactiveSinceDate?: string;
  }[];
  members: string[];
};

type EntryFixture<T> = T & { id: string };

export type CalendarFixture = EntryFixture<CalendarCreateDataObject>;
export type EventFixture = EntryFixture<EventCreateDataObject>;
export type UserFixture = EntryFixture<UserCreateDataObject>;
export type TeamFixture = EntryFixture<TeamCreateDataObject>;
export type InterestGroupFixture = EntryFixture<InterestGroupCreateDataObject>;
export type WorkingGroupFixture = EntryFixture<WorkingGroupCreateDataObject>;
export type ResearchOutputFixture =
  EntryFixture<ResearchOutputCreateDataObject>;

export interface Fixture {
  createCalendar: (
    calendar: CalendarCreateDataObject,
  ) => Promise<CalendarFixture>;
  createEvent: (event: EventCreateDataObject) => Promise<EventFixture>;
  publishEvent: (id: string, status?: 'Published' | 'Draft') => Promise<void>;
  deleteEvents: (ids: string[]) => Promise<void>;
  clearAllPreviousEvents: () => Promise<void>;
  createUser: (user: UserCreateDataObject) => Promise<UserFixture>;
  createTeam: (team: TeamCreateDataObject) => Promise<TeamFixture>;
  createInterestGroup: (
    interestGroup: InterestGroupCreateDataObject,
  ) => Promise<InterestGroupFixture>;
  createWorkingGroup: (
    workingGroup: WorkingGroupCreateDataObject,
  ) => Promise<WorkingGroupFixture>;
  teardown: () => Promise<void>;
}
