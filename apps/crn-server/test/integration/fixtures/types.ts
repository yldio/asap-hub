import {
  CalendarCreateDataObject as CommonCalendarCreateDataObject,
  EventCreateDataObject as CommonEventCreateDataObject,
  EventUpdateDataObject as CommonEventUpdateDataObject,
  UserCreateDataObject as CommonUserCreateDataObject,
  TeamCreateDataObject as CommonTeamCreateDataObject,
  ResearchOutputCreateDataObject as CommonResearchOutputCreateDataObject,
  GroupDataObject,
  GroupRole,
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
  | 'createdBy'
> & {
  teams: string[];
  published: boolean;
  methods: string[];
  organisms: string[];
  environments: string[];
  keywords: string[];
  labs: string[];
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

type EntryFixture<T> = T & { id: string };

export type CalendarFixture = EntryFixture<CalendarCreateDataObject>;
export type EventFixture = EntryFixture<EventCreateDataObject>;
export type UserFixture = EntryFixture<UserCreateDataObject>;
export type TeamFixture = EntryFixture<TeamCreateDataObject>;
export type InterestGroupFixture = EntryFixture<InterestGroupCreateDataObject>;

export interface Fixture {
  createCalendar: (
    calendar: CalendarCreateDataObject,
  ) => Promise<CalendarFixture>;
  createEvent: (event: EventCreateDataObject) => Promise<EventFixture>;
  updateEvent: (
    id: string,
    event: EventUpdateDataObject,
  ) => Promise<EventFixture>;
  publishEvent: (id: string, status?: 'Published' | 'Draft') => Promise<void>;
  deleteEvents: () => Promise<void>;
  createUser: (user: UserCreateDataObject) => Promise<UserFixture>;
  createTeam: (team: TeamCreateDataObject) => Promise<TeamFixture>;
  createInterestGroup: (
    InterestGroup: InterestGroupCreateDataObject,
  ) => Promise<InterestGroupFixture>;
  teardown: () => Promise<void>;
}
