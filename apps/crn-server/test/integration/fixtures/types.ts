import {
  UserCreateDataObject as CommonUserCreateDataObject,
  TeamCreateDataObject as CommonTeamCreateDataObject,
  ResearchOutputCreateDataObject as CommonResearchOutputCreateDataObject,
  GroupDataObject,
  GroupRole,
} from '@asap-hub/model';

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

export type UserFixture = EntryFixture<UserCreateDataObject>;
export type TeamFixture = EntryFixture<TeamCreateDataObject>;
export type InterestGroupFixture = EntryFixture<InterestGroupCreateDataObject>;

export interface Fixture {
  createUser: (user: UserCreateDataObject) => Promise<UserFixture>;
  createTeam: (team: TeamCreateDataObject) => Promise<TeamFixture>;
  createInterestGroup: (
    InterestGroup: InterestGroupCreateDataObject,
  ) => Promise<InterestGroupFixture>;
  teardown: () => Promise<void>;
}
