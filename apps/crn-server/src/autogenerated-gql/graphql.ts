/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `DateTime` scalar type represents a date and time. `DateTime` expects timestamps to be formatted in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
  Instant: any;
  /** Unstructured Json object */
  JsonScalar: any;
  Long: any;
};

/** The app mutations. */
export type ApplicationMutations = {
  /** Change a Calendars content. */
  changeCalendarsContent: Calendars;
  /** Change a Dashboard content. */
  changeDashboardContent: Dashboard;
  /** Change a Discover ASAP content. */
  changeDiscoverContent: Discover;
  /** Change a Events content. */
  changeEventsContent: Events;
  /** Change a External authors content. */
  changeExternalAuthorsContent: ExternalAuthors;
  /** Change a Groups content. */
  changeGroupsContent: Groups;
  /** Change a Labs content. */
  changeLabsContent: Labs;
  /** Change a Migrations content. */
  changeMigrationsContent: Migrations;
  /** Change a News content. */
  changeNewsAndEventsContent: NewsAndEvents;
  /** Change a Pages content. */
  changePagesContent: Pages;
  /** Change a Research Outputs content. */
  changeResearchOutputsContent: ResearchOutputs;
  /** Change a Research Tags content. */
  changeResearchTagsContent: ResearchTags;
  /** Change a Teams content. */
  changeTeamsContent: Teams;
  /** Change a Tutorials content. */
  changeTutorialsContent: Tutorials;
  /** Change a Users content. */
  changeUsersContent: Users;
  /** Creates an Calendars content. */
  createCalendarsContent: Calendars;
  /** Creates an Dashboard content. */
  createDashboardContent: Dashboard;
  /** Creates an Discover ASAP content. */
  createDiscoverContent: Discover;
  /** Creates an Events content. */
  createEventsContent: Events;
  /** Creates an External authors content. */
  createExternalAuthorsContent: ExternalAuthors;
  /** Creates an Groups content. */
  createGroupsContent: Groups;
  /** Creates an Labs content. */
  createLabsContent: Labs;
  /** Creates an Migrations content. */
  createMigrationsContent: Migrations;
  /** Creates an News content. */
  createNewsAndEventsContent: NewsAndEvents;
  /** Creates an Pages content. */
  createPagesContent: Pages;
  /** Creates an Research Outputs content. */
  createResearchOutputsContent: ResearchOutputs;
  /** Creates an Research Tags content. */
  createResearchTagsContent: ResearchTags;
  /** Creates an Teams content. */
  createTeamsContent: Teams;
  /** Creates an Tutorials content. */
  createTutorialsContent: Tutorials;
  /** Creates an Users content. */
  createUsersContent: Users;
  /** Delete an Calendars content. */
  deleteCalendarsContent: EntitySavedResultDto;
  /** Delete an Dashboard content. */
  deleteDashboardContent: EntitySavedResultDto;
  /** Delete an Discover ASAP content. */
  deleteDiscoverContent: EntitySavedResultDto;
  /** Delete an Events content. */
  deleteEventsContent: EntitySavedResultDto;
  /** Delete an External authors content. */
  deleteExternalAuthorsContent: EntitySavedResultDto;
  /** Delete an Groups content. */
  deleteGroupsContent: EntitySavedResultDto;
  /** Delete an Labs content. */
  deleteLabsContent: EntitySavedResultDto;
  /** Delete an Migrations content. */
  deleteMigrationsContent: EntitySavedResultDto;
  /** Delete an News content. */
  deleteNewsAndEventsContent: EntitySavedResultDto;
  /** Delete an Pages content. */
  deletePagesContent: EntitySavedResultDto;
  /** Delete an Research Outputs content. */
  deleteResearchOutputsContent: EntitySavedResultDto;
  /** Delete an Research Tags content. */
  deleteResearchTagsContent: EntitySavedResultDto;
  /** Delete an Teams content. */
  deleteTeamsContent: EntitySavedResultDto;
  /** Delete an Tutorials content. */
  deleteTutorialsContent: EntitySavedResultDto;
  /** Delete an Users content. */
  deleteUsersContent: EntitySavedResultDto;
  /** Patch an Calendars content by id. */
  patchCalendarsContent: Calendars;
  /** Patch an Dashboard content by id. */
  patchDashboardContent: Dashboard;
  /** Patch an Discover ASAP content by id. */
  patchDiscoverContent: Discover;
  /** Patch an Events content by id. */
  patchEventsContent: Events;
  /** Patch an External authors content by id. */
  patchExternalAuthorsContent: ExternalAuthors;
  /** Patch an Groups content by id. */
  patchGroupsContent: Groups;
  /** Patch an Labs content by id. */
  patchLabsContent: Labs;
  /** Patch an Migrations content by id. */
  patchMigrationsContent: Migrations;
  /** Patch an News content by id. */
  patchNewsAndEventsContent: NewsAndEvents;
  /** Patch an Pages content by id. */
  patchPagesContent: Pages;
  /** Patch an Research Outputs content by id. */
  patchResearchOutputsContent: ResearchOutputs;
  /** Patch an Research Tags content by id. */
  patchResearchTagsContent: ResearchTags;
  /** Patch an Teams content by id. */
  patchTeamsContent: Teams;
  /** Patch an Tutorials content by id. */
  patchTutorialsContent: Tutorials;
  /** Patch an Users content by id. */
  patchUsersContent: Users;
  /**
   * Publish a Calendars content.
   * @deprecated Use 'changeCalendarsContent' instead
   */
  publishCalendarsContent: Calendars;
  /**
   * Publish a Dashboard content.
   * @deprecated Use 'changeDashboardContent' instead
   */
  publishDashboardContent: Dashboard;
  /**
   * Publish a Discover ASAP content.
   * @deprecated Use 'changeDiscoverContent' instead
   */
  publishDiscoverContent: Discover;
  /**
   * Publish a Events content.
   * @deprecated Use 'changeEventsContent' instead
   */
  publishEventsContent: Events;
  /**
   * Publish a External authors content.
   * @deprecated Use 'changeExternalAuthorsContent' instead
   */
  publishExternalAuthorsContent: ExternalAuthors;
  /**
   * Publish a Groups content.
   * @deprecated Use 'changeGroupsContent' instead
   */
  publishGroupsContent: Groups;
  /**
   * Publish a Labs content.
   * @deprecated Use 'changeLabsContent' instead
   */
  publishLabsContent: Labs;
  /**
   * Publish a Migrations content.
   * @deprecated Use 'changeMigrationsContent' instead
   */
  publishMigrationsContent: Migrations;
  /**
   * Publish a News content.
   * @deprecated Use 'changeNewsAndEventsContent' instead
   */
  publishNewsAndEventsContent: NewsAndEvents;
  /**
   * Publish a Pages content.
   * @deprecated Use 'changePagesContent' instead
   */
  publishPagesContent: Pages;
  /**
   * Publish a Research Outputs content.
   * @deprecated Use 'changeResearchOutputsContent' instead
   */
  publishResearchOutputsContent: ResearchOutputs;
  /**
   * Publish a Research Tags content.
   * @deprecated Use 'changeResearchTagsContent' instead
   */
  publishResearchTagsContent: ResearchTags;
  /**
   * Publish a Teams content.
   * @deprecated Use 'changeTeamsContent' instead
   */
  publishTeamsContent: Teams;
  /**
   * Publish a Tutorials content.
   * @deprecated Use 'changeTutorialsContent' instead
   */
  publishTutorialsContent: Tutorials;
  /**
   * Publish a Users content.
   * @deprecated Use 'changeUsersContent' instead
   */
  publishUsersContent: Users;
  /** Update an Calendars content by id. */
  updateCalendarsContent: Calendars;
  /** Update an Dashboard content by id. */
  updateDashboardContent: Dashboard;
  /** Update an Discover ASAP content by id. */
  updateDiscoverContent: Discover;
  /** Update an Events content by id. */
  updateEventsContent: Events;
  /** Update an External authors content by id. */
  updateExternalAuthorsContent: ExternalAuthors;
  /** Update an Groups content by id. */
  updateGroupsContent: Groups;
  /** Update an Labs content by id. */
  updateLabsContent: Labs;
  /** Update an Migrations content by id. */
  updateMigrationsContent: Migrations;
  /** Update an News content by id. */
  updateNewsAndEventsContent: NewsAndEvents;
  /** Update an Pages content by id. */
  updatePagesContent: Pages;
  /** Update an Research Outputs content by id. */
  updateResearchOutputsContent: ResearchOutputs;
  /** Update an Research Tags content by id. */
  updateResearchTagsContent: ResearchTags;
  /** Update an Teams content by id. */
  updateTeamsContent: Teams;
  /** Update an Tutorials content by id. */
  updateTutorialsContent: Tutorials;
  /** Update an Users content by id. */
  updateUsersContent: Users;
  /** Upsert an Calendars content by id. */
  upsertCalendarsContent: Calendars;
  /** Upsert an Dashboard content by id. */
  upsertDashboardContent: Dashboard;
  /** Upsert an Discover ASAP content by id. */
  upsertDiscoverContent: Discover;
  /** Upsert an Events content by id. */
  upsertEventsContent: Events;
  /** Upsert an External authors content by id. */
  upsertExternalAuthorsContent: ExternalAuthors;
  /** Upsert an Groups content by id. */
  upsertGroupsContent: Groups;
  /** Upsert an Labs content by id. */
  upsertLabsContent: Labs;
  /** Upsert an Migrations content by id. */
  upsertMigrationsContent: Migrations;
  /** Upsert an News content by id. */
  upsertNewsAndEventsContent: NewsAndEvents;
  /** Upsert an Pages content by id. */
  upsertPagesContent: Pages;
  /** Upsert an Research Outputs content by id. */
  upsertResearchOutputsContent: ResearchOutputs;
  /** Upsert an Research Tags content by id. */
  upsertResearchTagsContent: ResearchTags;
  /** Upsert an Teams content by id. */
  upsertTeamsContent: Teams;
  /** Upsert an Tutorials content by id. */
  upsertTutorialsContent: Tutorials;
  /** Upsert an Users content by id. */
  upsertUsersContent: Users;
};

/** The app mutations. */
export type ApplicationMutationsChangeCalendarsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsChangeDashboardContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsChangeDiscoverContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsChangeEventsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsChangeExternalAuthorsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsChangeGroupsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsChangeLabsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsChangeMigrationsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsChangeNewsAndEventsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsChangePagesContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsChangeResearchOutputsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsChangeResearchTagsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsChangeTeamsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsChangeTutorialsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsChangeUsersContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsCreateCalendarsContentArgs = {
  data: CalendarsDataInputDto;
  id: InputMaybe<Scalars['String']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsCreateDashboardContentArgs = {
  data: DashboardDataInputDto;
  id: InputMaybe<Scalars['String']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsCreateDiscoverContentArgs = {
  data: DiscoverDataInputDto;
  id: InputMaybe<Scalars['String']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsCreateEventsContentArgs = {
  data: EventsDataInputDto;
  id: InputMaybe<Scalars['String']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsCreateExternalAuthorsContentArgs = {
  data: ExternalAuthorsDataInputDto;
  id: InputMaybe<Scalars['String']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsCreateGroupsContentArgs = {
  data: GroupsDataInputDto;
  id: InputMaybe<Scalars['String']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsCreateLabsContentArgs = {
  data: LabsDataInputDto;
  id: InputMaybe<Scalars['String']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsCreateMigrationsContentArgs = {
  data: MigrationsDataInputDto;
  id: InputMaybe<Scalars['String']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsCreateNewsAndEventsContentArgs = {
  data: NewsAndEventsDataInputDto;
  id: InputMaybe<Scalars['String']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsCreatePagesContentArgs = {
  data: PagesDataInputDto;
  id: InputMaybe<Scalars['String']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsCreateResearchOutputsContentArgs = {
  data: ResearchOutputsDataInputDto;
  id: InputMaybe<Scalars['String']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsCreateResearchTagsContentArgs = {
  data: ResearchTagsDataInputDto;
  id: InputMaybe<Scalars['String']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsCreateTeamsContentArgs = {
  data: TeamsDataInputDto;
  id: InputMaybe<Scalars['String']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsCreateTutorialsContentArgs = {
  data: TutorialsDataInputDto;
  id: InputMaybe<Scalars['String']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsCreateUsersContentArgs = {
  data: UsersDataInputDto;
  id: InputMaybe<Scalars['String']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsDeleteCalendarsContentArgs = {
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsDeleteDashboardContentArgs = {
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsDeleteDiscoverContentArgs = {
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsDeleteEventsContentArgs = {
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsDeleteExternalAuthorsContentArgs = {
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsDeleteGroupsContentArgs = {
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsDeleteLabsContentArgs = {
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsDeleteMigrationsContentArgs = {
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsDeleteNewsAndEventsContentArgs = {
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsDeletePagesContentArgs = {
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsDeleteResearchOutputsContentArgs = {
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsDeleteResearchTagsContentArgs = {
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsDeleteTeamsContentArgs = {
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsDeleteTutorialsContentArgs = {
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsDeleteUsersContentArgs = {
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsPatchCalendarsContentArgs = {
  data: CalendarsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsPatchDashboardContentArgs = {
  data: DashboardDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsPatchDiscoverContentArgs = {
  data: DiscoverDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsPatchEventsContentArgs = {
  data: EventsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsPatchExternalAuthorsContentArgs = {
  data: ExternalAuthorsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsPatchGroupsContentArgs = {
  data: GroupsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsPatchLabsContentArgs = {
  data: LabsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsPatchMigrationsContentArgs = {
  data: MigrationsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsPatchNewsAndEventsContentArgs = {
  data: NewsAndEventsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsPatchPagesContentArgs = {
  data: PagesDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsPatchResearchOutputsContentArgs = {
  data: ResearchOutputsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsPatchResearchTagsContentArgs = {
  data: ResearchTagsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsPatchTeamsContentArgs = {
  data: TeamsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsPatchTutorialsContentArgs = {
  data: TutorialsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsPatchUsersContentArgs = {
  data: UsersDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsPublishCalendarsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsPublishDashboardContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsPublishDiscoverContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsPublishEventsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsPublishExternalAuthorsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsPublishGroupsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsPublishLabsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsPublishMigrationsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsPublishNewsAndEventsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsPublishPagesContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsPublishResearchOutputsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsPublishResearchTagsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsPublishTeamsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsPublishTutorialsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsPublishUsersContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsUpdateCalendarsContentArgs = {
  data: CalendarsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpdateDashboardContentArgs = {
  data: DashboardDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpdateDiscoverContentArgs = {
  data: DiscoverDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpdateEventsContentArgs = {
  data: EventsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpdateExternalAuthorsContentArgs = {
  data: ExternalAuthorsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpdateGroupsContentArgs = {
  data: GroupsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpdateLabsContentArgs = {
  data: LabsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpdateMigrationsContentArgs = {
  data: MigrationsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpdateNewsAndEventsContentArgs = {
  data: NewsAndEventsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpdatePagesContentArgs = {
  data: PagesDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpdateResearchOutputsContentArgs = {
  data: ResearchOutputsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpdateResearchTagsContentArgs = {
  data: ResearchTagsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpdateTeamsContentArgs = {
  data: TeamsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpdateTutorialsContentArgs = {
  data: TutorialsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpdateUsersContentArgs = {
  data: UsersDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpsertCalendarsContentArgs = {
  data: CalendarsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: InputMaybe<Scalars['Boolean']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpsertDashboardContentArgs = {
  data: DashboardDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: InputMaybe<Scalars['Boolean']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpsertDiscoverContentArgs = {
  data: DiscoverDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: InputMaybe<Scalars['Boolean']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpsertEventsContentArgs = {
  data: EventsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: InputMaybe<Scalars['Boolean']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpsertExternalAuthorsContentArgs = {
  data: ExternalAuthorsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: InputMaybe<Scalars['Boolean']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpsertGroupsContentArgs = {
  data: GroupsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: InputMaybe<Scalars['Boolean']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpsertLabsContentArgs = {
  data: LabsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: InputMaybe<Scalars['Boolean']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpsertMigrationsContentArgs = {
  data: MigrationsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: InputMaybe<Scalars['Boolean']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpsertNewsAndEventsContentArgs = {
  data: NewsAndEventsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: InputMaybe<Scalars['Boolean']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpsertPagesContentArgs = {
  data: PagesDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: InputMaybe<Scalars['Boolean']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpsertResearchOutputsContentArgs = {
  data: ResearchOutputsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: InputMaybe<Scalars['Boolean']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpsertResearchTagsContentArgs = {
  data: ResearchTagsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: InputMaybe<Scalars['Boolean']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpsertTeamsContentArgs = {
  data: TeamsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: InputMaybe<Scalars['Boolean']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpsertTutorialsContentArgs = {
  data: TutorialsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: InputMaybe<Scalars['Boolean']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpsertUsersContentArgs = {
  data: UsersDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: InputMaybe<Scalars['Boolean']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app queries. */
export type ApplicationQueries = {
  /** Find an asset by id. */
  findAsset: Maybe<Asset>;
  /** Find an Calendars content by id. */
  findCalendarsContent: Maybe<Calendars>;
  /** Find an Dashboard content by id. */
  findDashboardContent: Maybe<Dashboard>;
  /** Find an Discover ASAP content by id. */
  findDiscoverContent: Maybe<Discover>;
  /** Find an Events content by id. */
  findEventsContent: Maybe<Events>;
  /** Find an External authors content by id. */
  findExternalAuthorsContent: Maybe<ExternalAuthors>;
  /** Find an Groups content by id. */
  findGroupsContent: Maybe<Groups>;
  /** Find an Labs content by id. */
  findLabsContent: Maybe<Labs>;
  /** Find an Migrations content by id. */
  findMigrationsContent: Maybe<Migrations>;
  /** Find an News content by id. */
  findNewsAndEventsContent: Maybe<NewsAndEvents>;
  /** Find an Pages content by id. */
  findPagesContent: Maybe<Pages>;
  /** Find an Research Outputs content by id. */
  findResearchOutputsContent: Maybe<ResearchOutputs>;
  /** Find an Research Tags content by id. */
  findResearchTagsContent: Maybe<ResearchTags>;
  /** Find an Teams content by id. */
  findTeamsContent: Maybe<Teams>;
  /** Find an Tutorials content by id. */
  findTutorialsContent: Maybe<Tutorials>;
  /** Find an Users content by id. */
  findUsersContent: Maybe<Users>;
  /** Get assets. */
  queryAssets: Array<Asset>;
  /** Get assets and total count. */
  queryAssetsWithTotal: AssetResultDto;
  /** Query Calendars content items. */
  queryCalendarsContents: Maybe<Array<Calendars>>;
  /** Query Calendars content items with total count. */
  queryCalendarsContentsWithTotal: Maybe<CalendarsResultDto>;
  /** Query Dashboard content items. */
  queryDashboardContents: Maybe<Array<Dashboard>>;
  /** Query Dashboard content items with total count. */
  queryDashboardContentsWithTotal: Maybe<DashboardResultDto>;
  /** Query Discover ASAP content items. */
  queryDiscoverContents: Maybe<Array<Discover>>;
  /** Query Discover ASAP content items with total count. */
  queryDiscoverContentsWithTotal: Maybe<DiscoverResultDto>;
  /** Query Events content items. */
  queryEventsContents: Maybe<Array<Events>>;
  /** Query Events content items with total count. */
  queryEventsContentsWithTotal: Maybe<EventsResultDto>;
  /** Query External authors content items. */
  queryExternalAuthorsContents: Maybe<Array<ExternalAuthors>>;
  /** Query External authors content items with total count. */
  queryExternalAuthorsContentsWithTotal: Maybe<ExternalAuthorsResultDto>;
  /** Query Groups content items. */
  queryGroupsContents: Maybe<Array<Groups>>;
  /** Query Groups content items with total count. */
  queryGroupsContentsWithTotal: Maybe<GroupsResultDto>;
  /** Query Labs content items. */
  queryLabsContents: Maybe<Array<Labs>>;
  /** Query Labs content items with total count. */
  queryLabsContentsWithTotal: Maybe<LabsResultDto>;
  /** Query Migrations content items. */
  queryMigrationsContents: Maybe<Array<Migrations>>;
  /** Query Migrations content items with total count. */
  queryMigrationsContentsWithTotal: Maybe<MigrationsResultDto>;
  /** Query News content items. */
  queryNewsAndEventsContents: Maybe<Array<NewsAndEvents>>;
  /** Query News content items with total count. */
  queryNewsAndEventsContentsWithTotal: Maybe<NewsAndEventsResultDto>;
  /** Query Pages content items. */
  queryPagesContents: Maybe<Array<Pages>>;
  /** Query Pages content items with total count. */
  queryPagesContentsWithTotal: Maybe<PagesResultDto>;
  /** Query Research Outputs content items. */
  queryResearchOutputsContents: Maybe<Array<ResearchOutputs>>;
  /** Query Research Outputs content items with total count. */
  queryResearchOutputsContentsWithTotal: Maybe<ResearchOutputsResultDto>;
  /** Query Research Tags content items. */
  queryResearchTagsContents: Maybe<Array<ResearchTags>>;
  /** Query Research Tags content items with total count. */
  queryResearchTagsContentsWithTotal: Maybe<ResearchTagsResultDto>;
  /** Query Teams content items. */
  queryTeamsContents: Maybe<Array<Teams>>;
  /** Query Teams content items with total count. */
  queryTeamsContentsWithTotal: Maybe<TeamsResultDto>;
  /** Query Tutorials content items. */
  queryTutorialsContents: Maybe<Array<Tutorials>>;
  /** Query Tutorials content items with total count. */
  queryTutorialsContentsWithTotal: Maybe<TutorialsResultDto>;
  /** Query Users content items. */
  queryUsersContents: Maybe<Array<Users>>;
  /** Query Users content items with total count. */
  queryUsersContentsWithTotal: Maybe<UsersResultDto>;
};

/** The app queries. */
export type ApplicationQueriesFindAssetArgs = {
  id: Scalars['String'];
};

/** The app queries. */
export type ApplicationQueriesFindCalendarsContentArgs = {
  id: Scalars['String'];
  version: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesFindDashboardContentArgs = {
  id: Scalars['String'];
  version: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesFindDiscoverContentArgs = {
  id: Scalars['String'];
  version: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesFindEventsContentArgs = {
  id: Scalars['String'];
  version: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesFindExternalAuthorsContentArgs = {
  id: Scalars['String'];
  version: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesFindGroupsContentArgs = {
  id: Scalars['String'];
  version: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesFindLabsContentArgs = {
  id: Scalars['String'];
  version: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesFindMigrationsContentArgs = {
  id: Scalars['String'];
  version: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesFindNewsAndEventsContentArgs = {
  id: Scalars['String'];
  version: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesFindPagesContentArgs = {
  id: Scalars['String'];
  version: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesFindResearchOutputsContentArgs = {
  id: Scalars['String'];
  version: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesFindResearchTagsContentArgs = {
  id: Scalars['String'];
  version: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesFindTeamsContentArgs = {
  id: Scalars['String'];
  version: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesFindTutorialsContentArgs = {
  id: Scalars['String'];
  version: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesFindUsersContentArgs = {
  id: Scalars['String'];
  version: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryAssetsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryAssetsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryCalendarsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryCalendarsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryDashboardContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryDashboardContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryDiscoverContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryDiscoverContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryEventsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryEventsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryExternalAuthorsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryExternalAuthorsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryGroupsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryGroupsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryLabsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryLabsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryMigrationsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryMigrationsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryNewsAndEventsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryNewsAndEventsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryPagesContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryPagesContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryResearchOutputsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryResearchOutputsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryResearchTagsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryResearchTagsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryTeamsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryTeamsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryTutorialsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryTutorialsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryUsersContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryUsersContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

export type ApplicationSubscriptions = {
  /** Subscribe to asset events. */
  assetChanges: Maybe<EnrichedAssetEvent>;
  /** Subscribe to content events. */
  contentChanges: Maybe<EnrichedContentEvent>;
};

export type ApplicationSubscriptionsAssetChangesArgs = {
  type: InputMaybe<EnrichedAssetEventType>;
};

export type ApplicationSubscriptionsContentChangesArgs = {
  schemaName: InputMaybe<Scalars['String']>;
  type: InputMaybe<EnrichedContentEventType>;
};

/** An asset */
export type Asset = {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The edit token. */
  editToken: Maybe<Scalars['String']>;
  /** The hash of the file. Can be null for old files. */
  fileHash: Scalars['String'];
  /** The file name of the asset. */
  fileName: Scalars['String'];
  /** The size of the file in bytes. */
  fileSize: Scalars['Int'];
  /** The file type (file extension) of the asset. */
  fileType: Scalars['String'];
  /** The version of the file. */
  fileVersion: Scalars['Int'];
  /** The ID of the object (usually GUID). */
  id: Scalars['String'];
  /**
   * Determines if the uploaded file is an image.
   * @deprecated Use 'type' field instead.
   */
  isImage: Scalars['Boolean'];
  /** True, when the asset is not public. */
  isProtected: Scalars['Boolean'];
  /** The timestamp when the object was updated the last time. */
  lastModified: Scalars['Instant'];
  /** The user who updated the object the last time. */
  lastModifiedBy: Scalars['String'];
  /** The user who updated the object the last time. */
  lastModifiedByUser: User;
  /** The asset metadata. */
  metadata: Maybe<Scalars['JsonScalar']>;
  /** The type of the image. */
  metadataText: Scalars['String'];
  /** The mime type. */
  mimeType: Scalars['String'];
  /**
   * The height of the image in pixels if the asset is an image.
   * @deprecated Use 'metadata' field instead.
   */
  pixelHeight: Maybe<Scalars['Int']>;
  /**
   * The width of the image in pixels if the asset is an image.
   * @deprecated Use 'metadata' field instead.
   */
  pixelWidth: Maybe<Scalars['Int']>;
  /** The file name as slug. */
  slug: Scalars['String'];
  /** The source URL of the asset. */
  sourceUrl: Scalars['String'];
  /** The asset tags. */
  tags: Array<Scalars['String']>;
  /** The thumbnail URL to the asset. */
  thumbnailUrl: Maybe<Scalars['String']>;
  /** The type of the asset. */
  type: AssetType;
  /** The URL to the asset. */
  url: Scalars['String'];
  /** The version of the objec. */
  version: Scalars['Int'];
};

/** An asset */
export type AssetMetadataArgs = {
  path: InputMaybe<Scalars['String']>;
};

/** List of assets and total count of assets. */
export type AssetResultDto = {
  /** The assets. */
  items: Array<Asset>;
  /** The total count of assets. */
  total: Scalars['Int'];
};

export enum AssetType {
  Audio = 'AUDIO',
  Image = 'IMAGE',
  Unknown = 'UNKNOWN',
  Video = 'VIDEO',
}

/** The structure of a Calendars content type. */
export type Calendars = Content & {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The data of the content. */
  data: CalendarsDataDto;
  /** The edit token. */
  editToken: Maybe<Scalars['String']>;
  /** The flat data of the content. */
  flatData: CalendarsFlatDataDto;
  /** The ID of the object (usually GUID). */
  id: Scalars['String'];
  /** The timestamp when the object was updated the last time. */
  lastModified: Scalars['Instant'];
  /** The user who updated the object the last time. */
  lastModifiedBy: Scalars['String'];
  /** The user who updated the object the last time. */
  lastModifiedByUser: User;
  /** The new status of the content. */
  newStatus: Maybe<Scalars['String']>;
  /** The status color of the content. */
  newStatusColor: Maybe<Scalars['String']>;
  /** Query Events content items. */
  referencingEventsContents: Maybe<Array<Events>>;
  /** Query Events content items with total count. */
  referencingEventsContentsWithTotal: Maybe<EventsResultDto>;
  /** Query Groups content items. */
  referencingGroupsContents: Maybe<Array<Groups>>;
  /** Query Groups content items with total count. */
  referencingGroupsContentsWithTotal: Maybe<GroupsResultDto>;
  /** The status of the content. */
  status: Scalars['String'];
  /** The status color of the content. */
  statusColor: Scalars['String'];
  /** The URL to the content. */
  url: Scalars['String'];
  /** The version of the objec. */
  version: Scalars['Int'];
};

/** The structure of a Calendars content type. */
export type CalendarsReferencingEventsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Calendars content type. */
export type CalendarsReferencingEventsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Calendars content type. */
export type CalendarsReferencingGroupsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Calendars content type. */
export type CalendarsReferencingGroupsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of the Color field of the Calendars content type. */
export type CalendarsDataColorDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Color field of the Calendars content input type. */
export type CalendarsDataColorInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Calendars data type. */
export type CalendarsDataDto = {
  color: Maybe<CalendarsDataColorDto>;
  expirationDate: Maybe<CalendarsDataExpirationDateDto>;
  googleCalendarId: Maybe<CalendarsDataGoogleCalendarIdDto>;
  name: Maybe<CalendarsDataNameDto>;
  resourceId: Maybe<CalendarsDataResourceIdDto>;
  syncToken: Maybe<CalendarsDataSyncTokenDto>;
};

/** The structure of the Google subscription expiration date field of the Calendars content type. */
export type CalendarsDataExpirationDateDto = {
  iv: Maybe<Scalars['Float']>;
};

/** The structure of the Google subscription expiration date field of the Calendars content input type. */
export type CalendarsDataExpirationDateInputDto = {
  iv: InputMaybe<Scalars['Float']>;
};

/** The structure of the Google Calendar ID field of the Calendars content type. */
export type CalendarsDataGoogleCalendarIdDto = {
  /** Make sure this GCal is Public BEFORE adding it. Syncing will NOT work otherwise. */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Google Calendar ID field of the Calendars content input type. */
export type CalendarsDataGoogleCalendarIdInputDto = {
  /** Make sure this GCal is Public BEFORE adding it. Syncing will NOT work otherwise. */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Calendars data input type. */
export type CalendarsDataInputDto = {
  color: InputMaybe<CalendarsDataColorInputDto>;
  expirationDate: InputMaybe<CalendarsDataExpirationDateInputDto>;
  googleCalendarId: InputMaybe<CalendarsDataGoogleCalendarIdInputDto>;
  name: InputMaybe<CalendarsDataNameInputDto>;
  resourceId: InputMaybe<CalendarsDataResourceIdInputDto>;
  syncToken: InputMaybe<CalendarsDataSyncTokenInputDto>;
};

/** The structure of the Name field of the Calendars content type. */
export type CalendarsDataNameDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Name field of the Calendars content input type. */
export type CalendarsDataNameInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Google resource ID field of the Calendars content type. */
export type CalendarsDataResourceIdDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Google resource ID field of the Calendars content input type. */
export type CalendarsDataResourceIdInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Google Last Sync Token field of the Calendars content type. */
export type CalendarsDataSyncTokenDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Google Last Sync Token field of the Calendars content input type. */
export type CalendarsDataSyncTokenInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the flat Calendars data type. */
export type CalendarsFlatDataDto = {
  color: Maybe<Scalars['String']>;
  expirationDate: Maybe<Scalars['Float']>;
  /** Make sure this GCal is Public BEFORE adding it. Syncing will NOT work otherwise. */
  googleCalendarId: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
  resourceId: Maybe<Scalars['String']>;
  syncToken: Maybe<Scalars['String']>;
};

/** List of Calendars items and total count. */
export type CalendarsResultDto = {
  /** The contents. */
  items: Maybe<Array<Calendars>>;
  /** The total count of  contents. */
  total: Scalars['Int'];
};

/** The structure of all content types. */
export type Component = {
  /** The ID of the schema. */
  schemaId: Scalars['String'];
};

/** The structure of all content types. */
export type Content = {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The ID of the object (usually GUID). */
  id: Scalars['String'];
  /** The timestamp when the object was updated the last time. */
  lastModified: Scalars['Instant'];
  /** The user who updated the object the last time. */
  lastModifiedBy: Scalars['String'];
  /** The new status of the content. */
  newStatus: Maybe<Scalars['String']>;
  /** The status color of the content. */
  newStatusColor: Maybe<Scalars['String']>;
  /** The status of the content. */
  status: Scalars['String'];
  /** The status color of the content. */
  statusColor: Scalars['String'];
  /** The URL to the content. */
  url: Scalars['String'];
  /** The version of the objec. */
  version: Scalars['Int'];
};

/** The structure of a Dashboard content type. */
export type Dashboard = Content & {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The data of the content. */
  data: DashboardDataDto;
  /** The edit token. */
  editToken: Maybe<Scalars['String']>;
  /** The flat data of the content. */
  flatData: DashboardFlatDataDto;
  /** The ID of the object (usually GUID). */
  id: Scalars['String'];
  /** The timestamp when the object was updated the last time. */
  lastModified: Scalars['Instant'];
  /** The user who updated the object the last time. */
  lastModifiedBy: Scalars['String'];
  /** The user who updated the object the last time. */
  lastModifiedByUser: User;
  /** The new status of the content. */
  newStatus: Maybe<Scalars['String']>;
  /** The status color of the content. */
  newStatusColor: Maybe<Scalars['String']>;
  /** Query News content items. */
  referencesNewsAndEventsContents: Maybe<Array<NewsAndEvents>>;
  /** Query News content items with total count. */
  referencesNewsAndEventsContentsWithTotal: Maybe<NewsAndEventsResultDto>;
  /** Query Pages content items. */
  referencesPagesContents: Maybe<Array<Pages>>;
  /** Query Pages content items with total count. */
  referencesPagesContentsWithTotal: Maybe<PagesResultDto>;
  /** The status of the content. */
  status: Scalars['String'];
  /** The status color of the content. */
  statusColor: Scalars['String'];
  /** The URL to the content. */
  url: Scalars['String'];
  /** The version of the objec. */
  version: Scalars['Int'];
};

/** The structure of a Dashboard content type. */
export type DashboardReferencesNewsAndEventsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencesNewsAndEventsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencesPagesContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencesPagesContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of the Dashboard data type. */
export type DashboardDataDto = {
  news: Maybe<DashboardDataNewsDto>;
  pages: Maybe<DashboardDataPagesDto>;
};

/** The structure of the Dashboard data input type. */
export type DashboardDataInputDto = {
  news: InputMaybe<DashboardDataNewsInputDto>;
  pages: InputMaybe<DashboardDataPagesInputDto>;
};

/** The structure of the Latest News from ASAP field of the Dashboard content type. */
export type DashboardDataNewsDto = {
  iv: Maybe<Array<NewsAndEvents>>;
};

/** The structure of the Latest News from ASAP field of the Dashboard content input type. */
export type DashboardDataNewsInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Where to Start field of the Dashboard content type. */
export type DashboardDataPagesDto = {
  iv: Maybe<Array<Pages>>;
};

/** The structure of the Where to Start field of the Dashboard content input type. */
export type DashboardDataPagesInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the flat Dashboard data type. */
export type DashboardFlatDataDto = {
  news: Maybe<Array<NewsAndEvents>>;
  pages: Maybe<Array<Pages>>;
};

/** List of Dashboard items and total count. */
export type DashboardResultDto = {
  /** The contents. */
  items: Maybe<Array<Dashboard>>;
  /** The total count of  contents. */
  total: Scalars['Int'];
};

/** The structure of a Discover ASAP content type. */
export type Discover = Content & {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The data of the content. */
  data: DiscoverDataDto;
  /** The edit token. */
  editToken: Maybe<Scalars['String']>;
  /** The flat data of the content. */
  flatData: DiscoverFlatDataDto;
  /** The ID of the object (usually GUID). */
  id: Scalars['String'];
  /** The timestamp when the object was updated the last time. */
  lastModified: Scalars['Instant'];
  /** The user who updated the object the last time. */
  lastModifiedBy: Scalars['String'];
  /** The user who updated the object the last time. */
  lastModifiedByUser: User;
  /** The new status of the content. */
  newStatus: Maybe<Scalars['String']>;
  /** The status color of the content. */
  newStatusColor: Maybe<Scalars['String']>;
  /** Query News content items. */
  referencesNewsAndEventsContents: Maybe<Array<NewsAndEvents>>;
  /** Query News content items with total count. */
  referencesNewsAndEventsContentsWithTotal: Maybe<NewsAndEventsResultDto>;
  /** Query Pages content items. */
  referencesPagesContents: Maybe<Array<Pages>>;
  /** Query Pages content items with total count. */
  referencesPagesContentsWithTotal: Maybe<PagesResultDto>;
  /** Query Teams content items. */
  referencesTeamsContents: Maybe<Array<Teams>>;
  /** Query Teams content items with total count. */
  referencesTeamsContentsWithTotal: Maybe<TeamsResultDto>;
  /** Query Tutorials content items. */
  referencesTutorialsContents: Maybe<Array<Tutorials>>;
  /** Query Tutorials content items with total count. */
  referencesTutorialsContentsWithTotal: Maybe<TutorialsResultDto>;
  /** Query Users content items. */
  referencesUsersContents: Maybe<Array<Users>>;
  /** Query Users content items with total count. */
  referencesUsersContentsWithTotal: Maybe<UsersResultDto>;
  /** The status of the content. */
  status: Scalars['String'];
  /** The status color of the content. */
  statusColor: Scalars['String'];
  /** The URL to the content. */
  url: Scalars['String'];
  /** The version of the objec. */
  version: Scalars['Int'];
};

/** The structure of a Discover ASAP content type. */
export type DiscoverReferencesNewsAndEventsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Discover ASAP content type. */
export type DiscoverReferencesNewsAndEventsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Discover ASAP content type. */
export type DiscoverReferencesPagesContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Discover ASAP content type. */
export type DiscoverReferencesPagesContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Discover ASAP content type. */
export type DiscoverReferencesTeamsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Discover ASAP content type. */
export type DiscoverReferencesTeamsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Discover ASAP content type. */
export type DiscoverReferencesTutorialsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Discover ASAP content type. */
export type DiscoverReferencesTutorialsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Discover ASAP content type. */
export type DiscoverReferencesUsersContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Discover ASAP content type. */
export type DiscoverReferencesUsersContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of the About Us field of the Discover ASAP content type. */
export type DiscoverDataAboutUsDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the About Us field of the Discover ASAP content input type. */
export type DiscoverDataAboutUsInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Discover ASAP data type. */
export type DiscoverDataDto = {
  aboutUs: Maybe<DiscoverDataAboutUsDto>;
  members: Maybe<DiscoverDataMembersDto>;
  membersTeam: Maybe<DiscoverDataMembersTeamDto>;
  pages: Maybe<DiscoverDataPagesDto>;
  scientificAdvisoryBoard: Maybe<DiscoverDataScientificAdvisoryBoardDto>;
  training: Maybe<DiscoverDataTrainingDto>;
  workingGroups: Maybe<DiscoverDataWorkingGroupsDto>;
};

/** The structure of the Discover ASAP data input type. */
export type DiscoverDataInputDto = {
  aboutUs: InputMaybe<DiscoverDataAboutUsInputDto>;
  members: InputMaybe<DiscoverDataMembersInputDto>;
  membersTeam: InputMaybe<DiscoverDataMembersTeamInputDto>;
  pages: InputMaybe<DiscoverDataPagesInputDto>;
  scientificAdvisoryBoard: InputMaybe<DiscoverDataScientificAdvisoryBoardInputDto>;
  training: InputMaybe<DiscoverDataTrainingInputDto>;
  workingGroups: InputMaybe<DiscoverDataWorkingGroupsInputDto>;
};

/** The structure of the ASAP Team Members field of the Discover ASAP content type. */
export type DiscoverDataMembersDto = {
  iv: Maybe<Array<Users>>;
};

/** The structure of the ASAP Team Members field of the Discover ASAP content input type. */
export type DiscoverDataMembersInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the ASAP Team field of the Discover ASAP content type. */
export type DiscoverDataMembersTeamDto = {
  iv: Maybe<Array<Teams>>;
};

/** The structure of the ASAP Team field of the Discover ASAP content input type. */
export type DiscoverDataMembersTeamInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Grantee Guidance field of the Discover ASAP content type. */
export type DiscoverDataPagesDto = {
  iv: Maybe<Array<Pages>>;
};

/** The structure of the Grantee Guidance field of the Discover ASAP content input type. */
export type DiscoverDataPagesInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Scientific Advisory Board field of the Discover ASAP content type. */
export type DiscoverDataScientificAdvisoryBoardDto = {
  iv: Maybe<Array<Users>>;
};

/** The structure of the Scientific Advisory Board field of the Discover ASAP content input type. */
export type DiscoverDataScientificAdvisoryBoardInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Training field of the Discover ASAP content type. */
export type DiscoverDataTrainingDto = {
  iv: Maybe<Array<Tutorials>>;
};

/** The structure of the Training field of the Discover ASAP content input type. */
export type DiscoverDataTrainingInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Working Groups field of the Discover ASAP content type. */
export type DiscoverDataWorkingGroupsDto = {
  iv: Maybe<Array<NewsAndEvents>>;
};

/** The structure of the Working Groups field of the Discover ASAP content input type. */
export type DiscoverDataWorkingGroupsInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the flat Discover ASAP data type. */
export type DiscoverFlatDataDto = {
  aboutUs: Maybe<Scalars['String']>;
  members: Maybe<Array<Users>>;
  membersTeam: Maybe<Array<Teams>>;
  pages: Maybe<Array<Pages>>;
  scientificAdvisoryBoard: Maybe<Array<Users>>;
  training: Maybe<Array<Tutorials>>;
  workingGroups: Maybe<Array<NewsAndEvents>>;
};

/** List of Discover ASAP items and total count. */
export type DiscoverResultDto = {
  /** The contents. */
  items: Maybe<Array<Discover>>;
  /** The total count of  contents. */
  total: Scalars['Int'];
};

/** An asset event */
export type EnrichedAssetEvent = {
  /** The type of the asset. */
  assetType: AssetType;
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The hash of the file. Can be null for old files. */
  fileHash: Scalars['String'];
  /** The file name of the asset. */
  fileName: Scalars['String'];
  /** The size of the file in bytes. */
  fileSize: Scalars['Int'];
  /** The file type (file extension) of the asset. */
  fileType: Scalars['String'];
  /** The version of the file. */
  fileVersion: Scalars['Int'];
  /** The ID of the object (usually GUID). */
  id: Scalars['String'];
  /**
   * Determines if the uploaded file is an image.
   * @deprecated Use 'type' field instead.
   */
  isImage: Scalars['Boolean'];
  /** True, when the asset is not public. */
  isProtected: Scalars['Boolean'];
  /** The timestamp when the object was updated the last time. */
  lastModified: Scalars['Instant'];
  /** The user who updated the object the last time. */
  lastModifiedBy: Scalars['String'];
  /** The user who updated the object the last time. */
  lastModifiedByUser: User;
  /** The asset metadata. */
  metadata: Maybe<Scalars['JsonScalar']>;
  /** The mime type. */
  mimeType: Scalars['String'];
  /**
   * The height of the image in pixels if the asset is an image.
   * @deprecated Use 'metadata' field instead.
   */
  pixelHeight: Maybe<Scalars['Int']>;
  /**
   * The width of the image in pixels if the asset is an image.
   * @deprecated Use 'metadata' field instead.
   */
  pixelWidth: Maybe<Scalars['Int']>;
  /** The file name as slug. */
  slug: Scalars['String'];
  /** The source URL of the asset. */
  sourceUrl: Scalars['String'];
  /** The thumbnail URL to the asset. */
  thumbnailUrl: Maybe<Scalars['String']>;
  /** The type of the event, e.g. 'Created' or 'Updated'. */
  type: Maybe<EnrichedAssetEventType>;
  /** The URL to the asset. */
  url: Scalars['String'];
  /** The version of the objec. */
  version: Scalars['Int'];
};

/** An asset event */
export type EnrichedAssetEventMetadataArgs = {
  path: InputMaybe<Scalars['String']>;
};

export enum EnrichedAssetEventType {
  Annotated = 'ANNOTATED',
  Created = 'CREATED',
  Deleted = 'DELETED',
  Updated = 'UPDATED',
}

/** An content event */
export type EnrichedContentEvent = {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The data of the content. */
  data: Maybe<Scalars['JsonScalar']>;
  /** The previous data of the content. */
  dataOld: Maybe<Scalars['JsonScalar']>;
  /** The ID of the object (usually GUID). */
  id: Scalars['String'];
  /** The timestamp when the object was updated the last time. */
  lastModified: Scalars['Instant'];
  /** The user who updated the object the last time. */
  lastModifiedBy: Scalars['String'];
  /** The user who updated the object the last time. */
  lastModifiedByUser: User;
  /** The new status of the content. */
  newStatus: Maybe<Scalars['String']>;
  /** The status of the content. */
  status: Scalars['String'];
  /** The type of the event, e.g. 'Created' or 'Updated'. */
  type: Maybe<EnrichedContentEventType>;
  /** The version of the objec. */
  version: Scalars['Int'];
};

export enum EnrichedContentEventType {
  Created = 'CREATED',
  Deleted = 'DELETED',
  Published = 'PUBLISHED',
  StatusChanged = 'STATUS_CHANGED',
  Unpublished = 'UNPUBLISHED',
  Updated = 'UPDATED',
}

/** The result of a mutation */
export type EntitySavedResultDto = {
  /** The new version of the item. */
  version: Scalars['Long'];
};

/** The structure of a Events content type. */
export type Events = Content & {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The data of the content. */
  data: EventsDataDto;
  /** The edit token. */
  editToken: Maybe<Scalars['String']>;
  /** The flat data of the content. */
  flatData: EventsFlatDataDto;
  /** The ID of the object (usually GUID). */
  id: Scalars['String'];
  /** The timestamp when the object was updated the last time. */
  lastModified: Scalars['Instant'];
  /** The user who updated the object the last time. */
  lastModifiedBy: Scalars['String'];
  /** The user who updated the object the last time. */
  lastModifiedByUser: User;
  /** The new status of the content. */
  newStatus: Maybe<Scalars['String']>;
  /** The status color of the content. */
  newStatusColor: Maybe<Scalars['String']>;
  /** Query Calendars content items. */
  referencesCalendarsContents: Maybe<Array<Calendars>>;
  /** Query Calendars content items with total count. */
  referencesCalendarsContentsWithTotal: Maybe<CalendarsResultDto>;
  /** Query External authors content items. */
  referencesExternalAuthorsContents: Maybe<Array<ExternalAuthors>>;
  /** Query External authors content items with total count. */
  referencesExternalAuthorsContentsWithTotal: Maybe<ExternalAuthorsResultDto>;
  /** Query Teams content items. */
  referencesTeamsContents: Maybe<Array<Teams>>;
  /** Query Teams content items with total count. */
  referencesTeamsContentsWithTotal: Maybe<TeamsResultDto>;
  /** Query Users content items. */
  referencesUsersContents: Maybe<Array<Users>>;
  /** Query Users content items with total count. */
  referencesUsersContentsWithTotal: Maybe<UsersResultDto>;
  /** The status of the content. */
  status: Scalars['String'];
  /** The status color of the content. */
  statusColor: Scalars['String'];
  /** The URL to the content. */
  url: Scalars['String'];
  /** The version of the objec. */
  version: Scalars['Int'];
};

/** The structure of a Events content type. */
export type EventsReferencesCalendarsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Events content type. */
export type EventsReferencesCalendarsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Events content type. */
export type EventsReferencesExternalAuthorsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Events content type. */
export type EventsReferencesExternalAuthorsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Events content type. */
export type EventsReferencesTeamsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Events content type. */
export type EventsReferencesTeamsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Events content type. */
export type EventsReferencesUsersContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Events content type. */
export type EventsReferencesUsersContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of the Calendar field of the Events content type. */
export type EventsDataCalendarDto = {
  iv: Maybe<Array<Calendars>>;
};

/** The structure of the Calendar field of the Events content input type. */
export type EventsDataCalendarInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Description field of the Events content type. */
export type EventsDataDescriptionDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Description field of the Events content input type. */
export type EventsDataDescriptionInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Events data type. */
export type EventsDataDto = {
  calendar: Maybe<EventsDataCalendarDto>;
  description: Maybe<EventsDataDescriptionDto>;
  endDate: Maybe<EventsDataEndDateDto>;
  endDateTimeZone: Maybe<EventsDataEndDateTimeZoneDto>;
  eventLink: Maybe<EventsDataEventLinkDto>;
  googleId: Maybe<EventsDataGoogleIdDto>;
  hidden: Maybe<EventsDataHiddenDto>;
  hideMeetingLink: Maybe<EventsDataHideMeetingLinkDto>;
  meetingLink: Maybe<EventsDataMeetingLinkDto>;
  meetingMaterials: Maybe<EventsDataMeetingMaterialsDto>;
  meetingMaterialsPermanentlyUnavailable: Maybe<EventsDataMeetingMaterialsPermanentlyUnavailableDto>;
  notes: Maybe<EventsDataNotesDto>;
  notesPermanentlyUnavailable: Maybe<EventsDataNotesPermanentlyUnavailableDto>;
  presentation: Maybe<EventsDataPresentationDto>;
  presentationPermanentlyUnavailable: Maybe<EventsDataPresentationPermanentlyUnavailableDto>;
  presentationUpdatedAt: Maybe<EventsDataPresentationUpdatedAtDto>;
  speakers: Maybe<EventsDataSpeakersDto>;
  startDate: Maybe<EventsDataStartDateDto>;
  startDateTimeZone: Maybe<EventsDataStartDateTimeZoneDto>;
  status: Maybe<EventsDataStatusDto>;
  tags: Maybe<EventsDataTagsDto>;
  thumbnail: Maybe<EventsDataThumbnailDto>;
  title: Maybe<EventsDataTitleDto>;
  videoRecording: Maybe<EventsDataVideoRecordingDto>;
  videoRecordingPermanentlyUnavailable: Maybe<EventsDataVideoRecordingPermanentlyUnavailableDto>;
  videoRecordingUpdatedAt: Maybe<EventsDataVideoRecordingUpdatedAtDto>;
};

/** The structure of the End Date field of the Events content type. */
export type EventsDataEndDateDto = {
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the End Date field of the Events content input type. */
export type EventsDataEndDateInputDto = {
  iv: InputMaybe<Scalars['Instant']>;
};

/** The structure of the End Date Time Zone field of the Events content type. */
export type EventsDataEndDateTimeZoneDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the End Date Time Zone field of the Events content input type. */
export type EventsDataEndDateTimeZoneInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Google Event Link field of the Events content type. */
export type EventsDataEventLinkDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Google Event Link field of the Events content input type. */
export type EventsDataEventLinkInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Google Id field of the Events content type. */
export type EventsDataGoogleIdDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Google Id field of the Events content input type. */
export type EventsDataGoogleIdInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Hide Event field of the Events content type. */
export type EventsDataHiddenDto = {
  /** Hidden events will NOT show on the Hub. (Note: any event cancelled on GCal will be hidden by default. To show a cancelled event on the Hub, you have to manually un-hide the event here) */
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the Hide Event field of the Events content input type. */
export type EventsDataHiddenInputDto = {
  /** Hidden events will NOT show on the Hub. (Note: any event cancelled on GCal will be hidden by default. To show a cancelled event on the Hub, you have to manually un-hide the event here) */
  iv: InputMaybe<Scalars['Boolean']>;
};

/** The structure of the Hide Meeting Link field of the Events content type. */
export type EventsDataHideMeetingLinkDto = {
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the Hide Meeting Link field of the Events content input type. */
export type EventsDataHideMeetingLinkInputDto = {
  iv: InputMaybe<Scalars['Boolean']>;
};

/** The structure of the Events data input type. */
export type EventsDataInputDto = {
  calendar: InputMaybe<EventsDataCalendarInputDto>;
  description: InputMaybe<EventsDataDescriptionInputDto>;
  endDate: InputMaybe<EventsDataEndDateInputDto>;
  endDateTimeZone: InputMaybe<EventsDataEndDateTimeZoneInputDto>;
  eventLink: InputMaybe<EventsDataEventLinkInputDto>;
  googleId: InputMaybe<EventsDataGoogleIdInputDto>;
  hidden: InputMaybe<EventsDataHiddenInputDto>;
  hideMeetingLink: InputMaybe<EventsDataHideMeetingLinkInputDto>;
  meetingLink: InputMaybe<EventsDataMeetingLinkInputDto>;
  meetingMaterials: InputMaybe<EventsDataMeetingMaterialsInputDto>;
  meetingMaterialsPermanentlyUnavailable: InputMaybe<EventsDataMeetingMaterialsPermanentlyUnavailableInputDto>;
  notes: InputMaybe<EventsDataNotesInputDto>;
  notesPermanentlyUnavailable: InputMaybe<EventsDataNotesPermanentlyUnavailableInputDto>;
  presentation: InputMaybe<EventsDataPresentationInputDto>;
  presentationPermanentlyUnavailable: InputMaybe<EventsDataPresentationPermanentlyUnavailableInputDto>;
  presentationUpdatedAt: InputMaybe<EventsDataPresentationUpdatedAtInputDto>;
  speakers: InputMaybe<EventsDataSpeakersInputDto>;
  startDate: InputMaybe<EventsDataStartDateInputDto>;
  startDateTimeZone: InputMaybe<EventsDataStartDateTimeZoneInputDto>;
  status: InputMaybe<EventsDataStatusInputDto>;
  tags: InputMaybe<EventsDataTagsInputDto>;
  thumbnail: InputMaybe<EventsDataThumbnailInputDto>;
  title: InputMaybe<EventsDataTitleInputDto>;
  videoRecording: InputMaybe<EventsDataVideoRecordingInputDto>;
  videoRecordingPermanentlyUnavailable: InputMaybe<EventsDataVideoRecordingPermanentlyUnavailableInputDto>;
  videoRecordingUpdatedAt: InputMaybe<EventsDataVideoRecordingUpdatedAtInputDto>;
};

/** The structure of the Meeting Link field of the Events content type. */
export type EventsDataMeetingLinkDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Meeting Link field of the Events content input type. */
export type EventsDataMeetingLinkInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Additional Meeting Materials nested schema. */
export type EventsDataMeetingMaterialsChildDto = {
  title: Maybe<Scalars['String']>;
  url: Maybe<Scalars['String']>;
};

/** The structure of the Additional Meeting Materials nested schema. */
export type EventsDataMeetingMaterialsChildInputDto = {
  title: InputMaybe<Scalars['String']>;
  url: InputMaybe<Scalars['String']>;
};

/** The structure of the Additional Meeting Materials field of the Events content type. */
export type EventsDataMeetingMaterialsDto = {
  /** If permanently unavailable box is ticked, any content you put here will be ignored. */
  iv: Maybe<Array<EventsDataMeetingMaterialsChildDto>>;
};

/** The structure of the Additional Meeting Materials field of the Events content input type. */
export type EventsDataMeetingMaterialsInputDto = {
  /** If permanently unavailable box is ticked, any content you put here will be ignored. */
  iv: InputMaybe<Array<EventsDataMeetingMaterialsChildInputDto>>;
};

/** The structure of the Mark Additional Meeting Materials as permanently unavailable field of the Events content type. */
export type EventsDataMeetingMaterialsPermanentlyUnavailableDto = {
  /** This box is automatically ticked if no output is added after 14 days from the event's end date. */
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the Mark Additional Meeting Materials as permanently unavailable field of the Events content input type. */
export type EventsDataMeetingMaterialsPermanentlyUnavailableInputDto = {
  /** This box is automatically ticked if no output is added after 14 days from the event's end date. */
  iv: InputMaybe<Scalars['Boolean']>;
};

/** The structure of the Notes field of the Events content type. */
export type EventsDataNotesDto = {
  /** If permanently unavailable box is ticked, any content you put here will be ignored. */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Notes field of the Events content input type. */
export type EventsDataNotesInputDto = {
  /** If permanently unavailable box is ticked, any content you put here will be ignored. */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Mark Notes as permanently unavailable field of the Events content type. */
export type EventsDataNotesPermanentlyUnavailableDto = {
  /** This box is automatically ticked if no output is added after 14 days from the event's end date. */
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the Mark Notes as permanently unavailable field of the Events content input type. */
export type EventsDataNotesPermanentlyUnavailableInputDto = {
  /** This box is automatically ticked if no output is added after 14 days from the event's end date. */
  iv: InputMaybe<Scalars['Boolean']>;
};

/** The structure of the Presentation field of the Events content type. */
export type EventsDataPresentationDto = {
  /** If permanently unavailable box is ticked, any content you put here will be ignored. */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Presentation field of the Events content input type. */
export type EventsDataPresentationInputDto = {
  /** If permanently unavailable box is ticked, any content you put here will be ignored. */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Mark Presentation as permanently unavailable field of the Events content type. */
export type EventsDataPresentationPermanentlyUnavailableDto = {
  /** This box is automatically ticked if no output is added after 14 days from the event's end date. */
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the Mark Presentation as permanently unavailable field of the Events content input type. */
export type EventsDataPresentationPermanentlyUnavailableInputDto = {
  /** This box is automatically ticked if no output is added after 14 days from the event's end date. */
  iv: InputMaybe<Scalars['Boolean']>;
};

/** The structure of the Presentation Updated At field of the Events content type. */
export type EventsDataPresentationUpdatedAtDto = {
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the Presentation Updated At field of the Events content input type. */
export type EventsDataPresentationUpdatedAtInputDto = {
  iv: InputMaybe<Scalars['Instant']>;
};

/** The structure of the Speakers nested schema. */
export type EventsDataSpeakersChildDto = {
  team: Maybe<Array<Teams>>;
  user: Maybe<Array<EventsDataSpeakersUserUnionDto>>;
};

/** The structure of the Speakers nested schema. */
export type EventsDataSpeakersChildInputDto = {
  team: InputMaybe<Array<Scalars['String']>>;
  user: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Speakers field of the Events content type. */
export type EventsDataSpeakersDto = {
  iv: Maybe<Array<EventsDataSpeakersChildDto>>;
};

/** The structure of the Speakers field of the Events content input type. */
export type EventsDataSpeakersInputDto = {
  iv: InputMaybe<Array<EventsDataSpeakersChildInputDto>>;
};

export type EventsDataSpeakersUserUnionDto = ExternalAuthors | Users;

/** The structure of the Start Date field of the Events content type. */
export type EventsDataStartDateDto = {
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the Start Date field of the Events content input type. */
export type EventsDataStartDateInputDto = {
  iv: InputMaybe<Scalars['Instant']>;
};

/** The structure of the Start Date Time Zone field of the Events content type. */
export type EventsDataStartDateTimeZoneDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Start Date Time Zone field of the Events content input type. */
export type EventsDataStartDateTimeZoneInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Status field of the Events content type. */
export type EventsDataStatusDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Status field of the Events content input type. */
export type EventsDataStatusInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Tags field of the Events content type. */
export type EventsDataTagsDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Tags field of the Events content input type. */
export type EventsDataTagsInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Thumbnail field of the Events content type. */
export type EventsDataThumbnailDto = {
  iv: Maybe<Array<Asset>>;
};

/** The structure of the Thumbnail field of the Events content input type. */
export type EventsDataThumbnailInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Title field of the Events content type. */
export type EventsDataTitleDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Title field of the Events content input type. */
export type EventsDataTitleInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Video Recording field of the Events content type. */
export type EventsDataVideoRecordingDto = {
  /** If permanently unavailable box is ticked, any content you put here will be ignored. */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Video Recording field of the Events content input type. */
export type EventsDataVideoRecordingInputDto = {
  /** If permanently unavailable box is ticked, any content you put here will be ignored. */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Mark Video Recording as permanently unavailable field of the Events content type. */
export type EventsDataVideoRecordingPermanentlyUnavailableDto = {
  /** This box is automatically ticked if no output is added after 14 days from the event's end date. */
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the Mark Video Recording as permanently unavailable field of the Events content input type. */
export type EventsDataVideoRecordingPermanentlyUnavailableInputDto = {
  /** This box is automatically ticked if no output is added after 14 days from the event's end date. */
  iv: InputMaybe<Scalars['Boolean']>;
};

/** The structure of the Video Recording Updated At field of the Events content type. */
export type EventsDataVideoRecordingUpdatedAtDto = {
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the Video Recording Updated At field of the Events content input type. */
export type EventsDataVideoRecordingUpdatedAtInputDto = {
  iv: InputMaybe<Scalars['Instant']>;
};

/** The structure of the flat Events data type. */
export type EventsFlatDataDto = {
  calendar: Maybe<Array<Calendars>>;
  description: Maybe<Scalars['String']>;
  endDate: Maybe<Scalars['Instant']>;
  endDateTimeZone: Maybe<Scalars['String']>;
  eventLink: Maybe<Scalars['String']>;
  googleId: Maybe<Scalars['String']>;
  /** Hidden events will NOT show on the Hub. (Note: any event cancelled on GCal will be hidden by default. To show a cancelled event on the Hub, you have to manually un-hide the event here) */
  hidden: Maybe<Scalars['Boolean']>;
  hideMeetingLink: Maybe<Scalars['Boolean']>;
  meetingLink: Maybe<Scalars['String']>;
  /** If permanently unavailable box is ticked, any content you put here will be ignored. */
  meetingMaterials: Maybe<Array<EventsDataMeetingMaterialsChildDto>>;
  /** This box is automatically ticked if no output is added after 14 days from the event's end date. */
  meetingMaterialsPermanentlyUnavailable: Maybe<Scalars['Boolean']>;
  /** If permanently unavailable box is ticked, any content you put here will be ignored. */
  notes: Maybe<Scalars['String']>;
  /** This box is automatically ticked if no output is added after 14 days from the event's end date. */
  notesPermanentlyUnavailable: Maybe<Scalars['Boolean']>;
  /** If permanently unavailable box is ticked, any content you put here will be ignored. */
  presentation: Maybe<Scalars['String']>;
  /** This box is automatically ticked if no output is added after 14 days from the event's end date. */
  presentationPermanentlyUnavailable: Maybe<Scalars['Boolean']>;
  presentationUpdatedAt: Maybe<Scalars['Instant']>;
  speakers: Maybe<Array<EventsDataSpeakersChildDto>>;
  startDate: Maybe<Scalars['Instant']>;
  startDateTimeZone: Maybe<Scalars['String']>;
  status: Maybe<Scalars['String']>;
  tags: Maybe<Array<Scalars['String']>>;
  thumbnail: Maybe<Array<Asset>>;
  title: Maybe<Scalars['String']>;
  /** If permanently unavailable box is ticked, any content you put here will be ignored. */
  videoRecording: Maybe<Scalars['String']>;
  /** This box is automatically ticked if no output is added after 14 days from the event's end date. */
  videoRecordingPermanentlyUnavailable: Maybe<Scalars['Boolean']>;
  videoRecordingUpdatedAt: Maybe<Scalars['Instant']>;
};

/** List of Events items and total count. */
export type EventsResultDto = {
  /** The contents. */
  items: Maybe<Array<Events>>;
  /** The total count of  contents. */
  total: Scalars['Int'];
};

/** The structure of a External authors content type. */
export type ExternalAuthors = Content & {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The data of the content. */
  data: ExternalAuthorsDataDto;
  /** The edit token. */
  editToken: Maybe<Scalars['String']>;
  /** The flat data of the content. */
  flatData: ExternalAuthorsFlatDataDto;
  /** The ID of the object (usually GUID). */
  id: Scalars['String'];
  /** The timestamp when the object was updated the last time. */
  lastModified: Scalars['Instant'];
  /** The user who updated the object the last time. */
  lastModifiedBy: Scalars['String'];
  /** The user who updated the object the last time. */
  lastModifiedByUser: User;
  /** The new status of the content. */
  newStatus: Maybe<Scalars['String']>;
  /** The status color of the content. */
  newStatusColor: Maybe<Scalars['String']>;
  /** Query Events content items. */
  referencingEventsContents: Maybe<Array<Events>>;
  /** Query Events content items with total count. */
  referencingEventsContentsWithTotal: Maybe<EventsResultDto>;
  /** Query Research Outputs content items. */
  referencingResearchOutputsContents: Maybe<Array<ResearchOutputs>>;
  /** Query Research Outputs content items with total count. */
  referencingResearchOutputsContentsWithTotal: Maybe<ResearchOutputsResultDto>;
  /** The status of the content. */
  status: Scalars['String'];
  /** The status color of the content. */
  statusColor: Scalars['String'];
  /** The URL to the content. */
  url: Scalars['String'];
  /** The version of the objec. */
  version: Scalars['Int'];
};

/** The structure of a External authors content type. */
export type ExternalAuthorsReferencingEventsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a External authors content type. */
export type ExternalAuthorsReferencingEventsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a External authors content type. */
export type ExternalAuthorsReferencingResearchOutputsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a External authors content type. */
export type ExternalAuthorsReferencingResearchOutputsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of the External authors data type. */
export type ExternalAuthorsDataDto = {
  name: Maybe<ExternalAuthorsDataNameDto>;
  orcid: Maybe<ExternalAuthorsDataOrcidDto>;
};

/** The structure of the External authors data input type. */
export type ExternalAuthorsDataInputDto = {
  name: InputMaybe<ExternalAuthorsDataNameInputDto>;
  orcid: InputMaybe<ExternalAuthorsDataOrcidInputDto>;
};

/** The structure of the Name field of the External authors content type. */
export type ExternalAuthorsDataNameDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Name field of the External authors content input type. */
export type ExternalAuthorsDataNameInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the ORCID field of the External authors content type. */
export type ExternalAuthorsDataOrcidDto = {
  /** ORCIDs cannot be repeated on the Hub */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the ORCID field of the External authors content input type. */
export type ExternalAuthorsDataOrcidInputDto = {
  /** ORCIDs cannot be repeated on the Hub */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the flat External authors data type. */
export type ExternalAuthorsFlatDataDto = {
  name: Maybe<Scalars['String']>;
  /** ORCIDs cannot be repeated on the Hub */
  orcid: Maybe<Scalars['String']>;
};

/** List of External authors items and total count. */
export type ExternalAuthorsResultDto = {
  /** The contents. */
  items: Maybe<Array<ExternalAuthors>>;
  /** The total count of  contents. */
  total: Scalars['Int'];
};

/** The structure of a Groups content type. */
export type Groups = Content & {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The data of the content. */
  data: GroupsDataDto;
  /** The edit token. */
  editToken: Maybe<Scalars['String']>;
  /** The flat data of the content. */
  flatData: GroupsFlatDataDto;
  /** The ID of the object (usually GUID). */
  id: Scalars['String'];
  /** The timestamp when the object was updated the last time. */
  lastModified: Scalars['Instant'];
  /** The user who updated the object the last time. */
  lastModifiedBy: Scalars['String'];
  /** The user who updated the object the last time. */
  lastModifiedByUser: User;
  /** The new status of the content. */
  newStatus: Maybe<Scalars['String']>;
  /** The status color of the content. */
  newStatusColor: Maybe<Scalars['String']>;
  /** Query Calendars content items. */
  referencesCalendarsContents: Maybe<Array<Calendars>>;
  /** Query Calendars content items with total count. */
  referencesCalendarsContentsWithTotal: Maybe<CalendarsResultDto>;
  /** Query Teams content items. */
  referencesTeamsContents: Maybe<Array<Teams>>;
  /** Query Teams content items with total count. */
  referencesTeamsContentsWithTotal: Maybe<TeamsResultDto>;
  /** Query Users content items. */
  referencesUsersContents: Maybe<Array<Users>>;
  /** Query Users content items with total count. */
  referencesUsersContentsWithTotal: Maybe<UsersResultDto>;
  /** The status of the content. */
  status: Scalars['String'];
  /** The status color of the content. */
  statusColor: Scalars['String'];
  /** The URL to the content. */
  url: Scalars['String'];
  /** The version of the objec. */
  version: Scalars['Int'];
};

/** The structure of a Groups content type. */
export type GroupsReferencesCalendarsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Groups content type. */
export type GroupsReferencesCalendarsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Groups content type. */
export type GroupsReferencesTeamsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Groups content type. */
export type GroupsReferencesTeamsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Groups content type. */
export type GroupsReferencesUsersContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Groups content type. */
export type GroupsReferencesUsersContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of the This group is active field of the Groups content type. */
export type GroupsDataActiveDto = {
  /** Active groups have Subscribe buttons and Calendar and Upcoming Events tabs */
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the This group is active field of the Groups content input type. */
export type GroupsDataActiveInputDto = {
  /** Active groups have Subscribe buttons and Calendar and Upcoming Events tabs */
  iv: InputMaybe<Scalars['Boolean']>;
};

/** The structure of the Calendars field of the Groups content type. */
export type GroupsDataCalendarsDto = {
  iv: Maybe<Array<Calendars>>;
};

/** The structure of the Calendars field of the Groups content input type. */
export type GroupsDataCalendarsInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Description field of the Groups content type. */
export type GroupsDataDescriptionDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Description field of the Groups content input type. */
export type GroupsDataDescriptionInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Groups data type. */
export type GroupsDataDto = {
  active: Maybe<GroupsDataActiveDto>;
  calendars: Maybe<GroupsDataCalendarsDto>;
  description: Maybe<GroupsDataDescriptionDto>;
  leaders: Maybe<GroupsDataLeadersDto>;
  name: Maybe<GroupsDataNameDto>;
  tags: Maybe<GroupsDataTagsDto>;
  teams: Maybe<GroupsDataTeamsDto>;
  thumbnail: Maybe<GroupsDataThumbnailDto>;
  tools: Maybe<GroupsDataToolsDto>;
};

/** The structure of the Groups data input type. */
export type GroupsDataInputDto = {
  active: InputMaybe<GroupsDataActiveInputDto>;
  calendars: InputMaybe<GroupsDataCalendarsInputDto>;
  description: InputMaybe<GroupsDataDescriptionInputDto>;
  leaders: InputMaybe<GroupsDataLeadersInputDto>;
  name: InputMaybe<GroupsDataNameInputDto>;
  tags: InputMaybe<GroupsDataTagsInputDto>;
  teams: InputMaybe<GroupsDataTeamsInputDto>;
  thumbnail: InputMaybe<GroupsDataThumbnailInputDto>;
  tools: InputMaybe<GroupsDataToolsInputDto>;
};

/** The structure of the Leaders nested schema. */
export type GroupsDataLeadersChildDto = {
  role: Maybe<Scalars['String']>;
  user: Maybe<Array<Users>>;
};

/** The structure of the Leaders nested schema. */
export type GroupsDataLeadersChildInputDto = {
  role: InputMaybe<Scalars['String']>;
  user: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Leaders field of the Groups content type. */
export type GroupsDataLeadersDto = {
  iv: Maybe<Array<GroupsDataLeadersChildDto>>;
};

/** The structure of the Leaders field of the Groups content input type. */
export type GroupsDataLeadersInputDto = {
  iv: InputMaybe<Array<GroupsDataLeadersChildInputDto>>;
};

/** The structure of the Name field of the Groups content type. */
export type GroupsDataNameDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Name field of the Groups content input type. */
export type GroupsDataNameInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Expertise (Tags) field of the Groups content type. */
export type GroupsDataTagsDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Expertise (Tags) field of the Groups content input type. */
export type GroupsDataTagsInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Teams field of the Groups content type. */
export type GroupsDataTeamsDto = {
  iv: Maybe<Array<Teams>>;
};

/** The structure of the Teams field of the Groups content input type. */
export type GroupsDataTeamsInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Thumbnail field of the Groups content type. */
export type GroupsDataThumbnailDto = {
  iv: Maybe<Array<Asset>>;
};

/** The structure of the Thumbnail field of the Groups content input type. */
export type GroupsDataThumbnailInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the External Tools nested schema. */
export type GroupsDataToolsChildDto = {
  googleDrive: Maybe<Scalars['String']>;
  slack: Maybe<Scalars['String']>;
};

/** The structure of the External Tools nested schema. */
export type GroupsDataToolsChildInputDto = {
  googleDrive: InputMaybe<Scalars['String']>;
  slack: InputMaybe<Scalars['String']>;
};

/** The structure of the External Tools field of the Groups content type. */
export type GroupsDataToolsDto = {
  iv: Maybe<Array<GroupsDataToolsChildDto>>;
};

/** The structure of the External Tools field of the Groups content input type. */
export type GroupsDataToolsInputDto = {
  iv: InputMaybe<Array<GroupsDataToolsChildInputDto>>;
};

/** The structure of the flat Groups data type. */
export type GroupsFlatDataDto = {
  /** Active groups have Subscribe buttons and Calendar and Upcoming Events tabs */
  active: Maybe<Scalars['Boolean']>;
  calendars: Maybe<Array<Calendars>>;
  description: Maybe<Scalars['String']>;
  leaders: Maybe<Array<GroupsDataLeadersChildDto>>;
  name: Maybe<Scalars['String']>;
  tags: Maybe<Array<Scalars['String']>>;
  teams: Maybe<Array<Teams>>;
  thumbnail: Maybe<Array<Asset>>;
  tools: Maybe<Array<GroupsDataToolsChildDto>>;
};

/** List of Groups items and total count. */
export type GroupsResultDto = {
  /** The contents. */
  items: Maybe<Array<Groups>>;
  /** The total count of  contents. */
  total: Scalars['Int'];
};

/** The structure of a Labs content type. */
export type Labs = Content & {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The data of the content. */
  data: LabsDataDto;
  /** The edit token. */
  editToken: Maybe<Scalars['String']>;
  /** The flat data of the content. */
  flatData: LabsFlatDataDto;
  /** The ID of the object (usually GUID). */
  id: Scalars['String'];
  /** The timestamp when the object was updated the last time. */
  lastModified: Scalars['Instant'];
  /** The user who updated the object the last time. */
  lastModifiedBy: Scalars['String'];
  /** The user who updated the object the last time. */
  lastModifiedByUser: User;
  /** The new status of the content. */
  newStatus: Maybe<Scalars['String']>;
  /** The status color of the content. */
  newStatusColor: Maybe<Scalars['String']>;
  /** Query Research Outputs content items. */
  referencingResearchOutputsContents: Maybe<Array<ResearchOutputs>>;
  /** Query Research Outputs content items with total count. */
  referencingResearchOutputsContentsWithTotal: Maybe<ResearchOutputsResultDto>;
  /** Query Users content items. */
  referencingUsersContents: Maybe<Array<Users>>;
  /** Query Users content items with total count. */
  referencingUsersContentsWithTotal: Maybe<UsersResultDto>;
  /** The status of the content. */
  status: Scalars['String'];
  /** The status color of the content. */
  statusColor: Scalars['String'];
  /** The URL to the content. */
  url: Scalars['String'];
  /** The version of the objec. */
  version: Scalars['Int'];
};

/** The structure of a Labs content type. */
export type LabsReferencingResearchOutputsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Labs content type. */
export type LabsReferencingResearchOutputsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Labs content type. */
export type LabsReferencingUsersContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Labs content type. */
export type LabsReferencingUsersContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of the Labs data type. */
export type LabsDataDto = {
  name: Maybe<LabsDataNameDto>;
};

/** The structure of the Labs data input type. */
export type LabsDataInputDto = {
  name: InputMaybe<LabsDataNameInputDto>;
};

/** The structure of the Name field of the Labs content type. */
export type LabsDataNameDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Name field of the Labs content input type. */
export type LabsDataNameInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the flat Labs data type. */
export type LabsFlatDataDto = {
  name: Maybe<Scalars['String']>;
};

/** List of Labs items and total count. */
export type LabsResultDto = {
  /** The contents. */
  items: Maybe<Array<Labs>>;
  /** The total count of  contents. */
  total: Scalars['Int'];
};

/** The structure of a Migrations content type. */
export type Migrations = Content & {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The data of the content. */
  data: MigrationsDataDto;
  /** The edit token. */
  editToken: Maybe<Scalars['String']>;
  /** The flat data of the content. */
  flatData: MigrationsFlatDataDto;
  /** The ID of the object (usually GUID). */
  id: Scalars['String'];
  /** The timestamp when the object was updated the last time. */
  lastModified: Scalars['Instant'];
  /** The user who updated the object the last time. */
  lastModifiedBy: Scalars['String'];
  /** The user who updated the object the last time. */
  lastModifiedByUser: User;
  /** The new status of the content. */
  newStatus: Maybe<Scalars['String']>;
  /** The status color of the content. */
  newStatusColor: Maybe<Scalars['String']>;
  /** The status of the content. */
  status: Scalars['String'];
  /** The status color of the content. */
  statusColor: Scalars['String'];
  /** The URL to the content. */
  url: Scalars['String'];
  /** The version of the objec. */
  version: Scalars['Int'];
};

/** The structure of the Migrations data type. */
export type MigrationsDataDto = {
  name: Maybe<MigrationsDataNameDto>;
};

/** The structure of the Migrations data input type. */
export type MigrationsDataInputDto = {
  name: InputMaybe<MigrationsDataNameInputDto>;
};

/** The structure of the Name field of the Migrations content type. */
export type MigrationsDataNameDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Name field of the Migrations content input type. */
export type MigrationsDataNameInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the flat Migrations data type. */
export type MigrationsFlatDataDto = {
  name: Maybe<Scalars['String']>;
};

/** List of Migrations items and total count. */
export type MigrationsResultDto = {
  /** The contents. */
  items: Maybe<Array<Migrations>>;
  /** The total count of  contents. */
  total: Scalars['Int'];
};

/** The structure of a News content type. */
export type NewsAndEvents = Content & {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The data of the content. */
  data: NewsAndEventsDataDto;
  /** The edit token. */
  editToken: Maybe<Scalars['String']>;
  /** The flat data of the content. */
  flatData: NewsAndEventsFlatDataDto;
  /** The ID of the object (usually GUID). */
  id: Scalars['String'];
  /** The timestamp when the object was updated the last time. */
  lastModified: Scalars['Instant'];
  /** The user who updated the object the last time. */
  lastModifiedBy: Scalars['String'];
  /** The user who updated the object the last time. */
  lastModifiedByUser: User;
  /** The new status of the content. */
  newStatus: Maybe<Scalars['String']>;
  /** The status color of the content. */
  newStatusColor: Maybe<Scalars['String']>;
  /** Query Dashboard content items. */
  referencingDashboardContents: Maybe<Array<Dashboard>>;
  /** Query Dashboard content items with total count. */
  referencingDashboardContentsWithTotal: Maybe<DashboardResultDto>;
  /** Query Discover ASAP content items. */
  referencingDiscoverContents: Maybe<Array<Discover>>;
  /** Query Discover ASAP content items with total count. */
  referencingDiscoverContentsWithTotal: Maybe<DiscoverResultDto>;
  /** The status of the content. */
  status: Scalars['String'];
  /** The status color of the content. */
  statusColor: Scalars['String'];
  /** The URL to the content. */
  url: Scalars['String'];
  /** The version of the objec. */
  version: Scalars['Int'];
};

/** The structure of a News content type. */
export type NewsAndEventsReferencingDashboardContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a News content type. */
export type NewsAndEventsReferencingDashboardContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a News content type. */
export type NewsAndEventsReferencingDiscoverContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a News content type. */
export type NewsAndEventsReferencingDiscoverContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of the Event Date field of the News content type. */
export type NewsAndEventsDataDateDto = {
  /** Property only used on Event type items */
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the Event Date field of the News content input type. */
export type NewsAndEventsDataDateInputDto = {
  /** Property only used on Event type items */
  iv: InputMaybe<Scalars['Instant']>;
};

/** The structure of the News data type. */
export type NewsAndEventsDataDto = {
  date: Maybe<NewsAndEventsDataDateDto>;
  frequency: Maybe<NewsAndEventsDataFrequencyDto>;
  link: Maybe<NewsAndEventsDataLinkDto>;
  linkText: Maybe<NewsAndEventsDataLinkTextDto>;
  shortText: Maybe<NewsAndEventsDataShortTextDto>;
  text: Maybe<NewsAndEventsDataTextDto>;
  thumbnail: Maybe<NewsAndEventsDataThumbnailDto>;
  title: Maybe<NewsAndEventsDataTitleDto>;
  type: Maybe<NewsAndEventsDataTypeDto>;
};

/** The structure of the Frequency field of the News content type. */
export type NewsAndEventsDataFrequencyDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Frequency field of the News content input type. */
export type NewsAndEventsDataFrequencyInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the News data input type. */
export type NewsAndEventsDataInputDto = {
  date: InputMaybe<NewsAndEventsDataDateInputDto>;
  frequency: InputMaybe<NewsAndEventsDataFrequencyInputDto>;
  link: InputMaybe<NewsAndEventsDataLinkInputDto>;
  linkText: InputMaybe<NewsAndEventsDataLinkTextInputDto>;
  shortText: InputMaybe<NewsAndEventsDataShortTextInputDto>;
  text: InputMaybe<NewsAndEventsDataTextInputDto>;
  thumbnail: InputMaybe<NewsAndEventsDataThumbnailInputDto>;
  title: InputMaybe<NewsAndEventsDataTitleInputDto>;
  type: InputMaybe<NewsAndEventsDataTypeInputDto>;
};

/** The structure of the External Link field of the News content type. */
export type NewsAndEventsDataLinkDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the External Link field of the News content input type. */
export type NewsAndEventsDataLinkInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the External Link Text field of the News content type. */
export type NewsAndEventsDataLinkTextDto = {
  /** Leave this empty to show "Open External Link" */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the External Link Text field of the News content input type. */
export type NewsAndEventsDataLinkTextInputDto = {
  /** Leave this empty to show "Open External Link" */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Short Text field of the News content type. */
export type NewsAndEventsDataShortTextDto = {
  /** The text visible on the card version of News and Events */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Short Text field of the News content input type. */
export type NewsAndEventsDataShortTextInputDto = {
  /** The text visible on the card version of News and Events */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Text field of the News content type. */
export type NewsAndEventsDataTextDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Text field of the News content input type. */
export type NewsAndEventsDataTextInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Thumbnail field of the News content type. */
export type NewsAndEventsDataThumbnailDto = {
  iv: Maybe<Array<Asset>>;
};

/** The structure of the Thumbnail field of the News content input type. */
export type NewsAndEventsDataThumbnailInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Title field of the News content type. */
export type NewsAndEventsDataTitleDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Title field of the News content input type. */
export type NewsAndEventsDataTitleInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Type field of the News content type. */
export type NewsAndEventsDataTypeDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Type field of the News content input type. */
export type NewsAndEventsDataTypeInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the flat News data type. */
export type NewsAndEventsFlatDataDto = {
  /** Property only used on Event type items */
  date: Maybe<Scalars['Instant']>;
  frequency: Maybe<Scalars['String']>;
  link: Maybe<Scalars['String']>;
  /** Leave this empty to show "Open External Link" */
  linkText: Maybe<Scalars['String']>;
  /** The text visible on the card version of News and Events */
  shortText: Maybe<Scalars['String']>;
  text: Maybe<Scalars['String']>;
  thumbnail: Maybe<Array<Asset>>;
  title: Maybe<Scalars['String']>;
  type: Maybe<Scalars['String']>;
};

/** List of News items and total count. */
export type NewsAndEventsResultDto = {
  /** The contents. */
  items: Maybe<Array<NewsAndEvents>>;
  /** The total count of  contents. */
  total: Scalars['Int'];
};

/** The structure of a Pages content type. */
export type Pages = Content & {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The data of the content. */
  data: PagesDataDto;
  /** The edit token. */
  editToken: Maybe<Scalars['String']>;
  /** The flat data of the content. */
  flatData: PagesFlatDataDto;
  /** The ID of the object (usually GUID). */
  id: Scalars['String'];
  /** The timestamp when the object was updated the last time. */
  lastModified: Scalars['Instant'];
  /** The user who updated the object the last time. */
  lastModifiedBy: Scalars['String'];
  /** The user who updated the object the last time. */
  lastModifiedByUser: User;
  /** The new status of the content. */
  newStatus: Maybe<Scalars['String']>;
  /** The status color of the content. */
  newStatusColor: Maybe<Scalars['String']>;
  /** Query Dashboard content items. */
  referencingDashboardContents: Maybe<Array<Dashboard>>;
  /** Query Dashboard content items with total count. */
  referencingDashboardContentsWithTotal: Maybe<DashboardResultDto>;
  /** Query Discover ASAP content items. */
  referencingDiscoverContents: Maybe<Array<Discover>>;
  /** Query Discover ASAP content items with total count. */
  referencingDiscoverContentsWithTotal: Maybe<DiscoverResultDto>;
  /** The status of the content. */
  status: Scalars['String'];
  /** The status color of the content. */
  statusColor: Scalars['String'];
  /** The URL to the content. */
  url: Scalars['String'];
  /** The version of the objec. */
  version: Scalars['Int'];
};

/** The structure of a Pages content type. */
export type PagesReferencingDashboardContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Pages content type. */
export type PagesReferencingDashboardContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Pages content type. */
export type PagesReferencingDiscoverContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Pages content type. */
export type PagesReferencingDiscoverContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of the Pages data type. */
export type PagesDataDto = {
  link: Maybe<PagesDataLinkDto>;
  linkText: Maybe<PagesDataLinkTextDto>;
  path: Maybe<PagesDataPathDto>;
  shortText: Maybe<PagesDataShortTextDto>;
  text: Maybe<PagesDataTextDto>;
  title: Maybe<PagesDataTitleDto>;
};

/** The structure of the Pages data input type. */
export type PagesDataInputDto = {
  link: InputMaybe<PagesDataLinkInputDto>;
  linkText: InputMaybe<PagesDataLinkTextInputDto>;
  path: InputMaybe<PagesDataPathInputDto>;
  shortText: InputMaybe<PagesDataShortTextInputDto>;
  text: InputMaybe<PagesDataTextInputDto>;
  title: InputMaybe<PagesDataTitleInputDto>;
};

/** The structure of the External Link field of the Pages content type. */
export type PagesDataLinkDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the External Link field of the Pages content input type. */
export type PagesDataLinkInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the External Link Text field of the Pages content type. */
export type PagesDataLinkTextDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the External Link Text field of the Pages content input type. */
export type PagesDataLinkTextInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Path field of the Pages content type. */
export type PagesDataPathDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Path field of the Pages content input type. */
export type PagesDataPathInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Short Text field of the Pages content type. */
export type PagesDataShortTextDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Short Text field of the Pages content input type. */
export type PagesDataShortTextInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Text field of the Pages content type. */
export type PagesDataTextDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Text field of the Pages content input type. */
export type PagesDataTextInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Title field of the Pages content type. */
export type PagesDataTitleDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Title field of the Pages content input type. */
export type PagesDataTitleInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the flat Pages data type. */
export type PagesFlatDataDto = {
  link: Maybe<Scalars['String']>;
  linkText: Maybe<Scalars['String']>;
  path: Maybe<Scalars['String']>;
  shortText: Maybe<Scalars['String']>;
  text: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
};

/** List of Pages items and total count. */
export type PagesResultDto = {
  /** The contents. */
  items: Maybe<Array<Pages>>;
  /** The total count of  contents. */
  total: Scalars['Int'];
};

/** The structure of a Research Outputs content type. */
export type ResearchOutputs = Content & {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The data of the content. */
  data: ResearchOutputsDataDto;
  /** The edit token. */
  editToken: Maybe<Scalars['String']>;
  /** The flat data of the content. */
  flatData: ResearchOutputsFlatDataDto;
  /** The ID of the object (usually GUID). */
  id: Scalars['String'];
  /** The timestamp when the object was updated the last time. */
  lastModified: Scalars['Instant'];
  /** The user who updated the object the last time. */
  lastModifiedBy: Scalars['String'];
  /** The user who updated the object the last time. */
  lastModifiedByUser: User;
  /** The new status of the content. */
  newStatus: Maybe<Scalars['String']>;
  /** The status color of the content. */
  newStatusColor: Maybe<Scalars['String']>;
  /** Query External authors content items. */
  referencesExternalAuthorsContents: Maybe<Array<ExternalAuthors>>;
  /** Query External authors content items with total count. */
  referencesExternalAuthorsContentsWithTotal: Maybe<ExternalAuthorsResultDto>;
  /** Query Labs content items. */
  referencesLabsContents: Maybe<Array<Labs>>;
  /** Query Labs content items with total count. */
  referencesLabsContentsWithTotal: Maybe<LabsResultDto>;
  /** Query Research Tags content items. */
  referencesResearchTagsContents: Maybe<Array<ResearchTags>>;
  /** Query Research Tags content items with total count. */
  referencesResearchTagsContentsWithTotal: Maybe<ResearchTagsResultDto>;
  /** Query Users content items. */
  referencesUsersContents: Maybe<Array<Users>>;
  /** Query Users content items with total count. */
  referencesUsersContentsWithTotal: Maybe<UsersResultDto>;
  /** Query Teams content items. */
  referencingTeamsContents: Maybe<Array<Teams>>;
  /** Query Teams content items with total count. */
  referencingTeamsContentsWithTotal: Maybe<TeamsResultDto>;
  /** The status of the content. */
  status: Scalars['String'];
  /** The status color of the content. */
  statusColor: Scalars['String'];
  /** The URL to the content. */
  url: Scalars['String'];
  /** The version of the objec. */
  version: Scalars['Int'];
};

/** The structure of a Research Outputs content type. */
export type ResearchOutputsReferencesExternalAuthorsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Research Outputs content type. */
export type ResearchOutputsReferencesExternalAuthorsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Research Outputs content type. */
export type ResearchOutputsReferencesLabsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Research Outputs content type. */
export type ResearchOutputsReferencesLabsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Research Outputs content type. */
export type ResearchOutputsReferencesResearchTagsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Research Outputs content type. */
export type ResearchOutputsReferencesResearchTagsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Research Outputs content type. */
export type ResearchOutputsReferencesUsersContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Research Outputs content type. */
export type ResearchOutputsReferencesUsersContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Research Outputs content type. */
export type ResearchOutputsReferencingTeamsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Research Outputs content type. */
export type ResearchOutputsReferencingTeamsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of the Identifier (Accession #) field of the Research Outputs content type. */
export type ResearchOutputsDataAccessionDto = {
  /** This must start with a letter */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Identifier (Accession #) field of the Research Outputs content input type. */
export type ResearchOutputsDataAccessionInputDto = {
  /** This must start with a letter */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Added Date field of the Research Outputs content type. */
export type ResearchOutputsDataAddedDateDto = {
  /** Date output was shared with ASAP Network (different from publication date) */
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the Added Date field of the Research Outputs content input type. */
export type ResearchOutputsDataAddedDateInputDto = {
  /** Date output was shared with ASAP Network (different from publication date) */
  iv: InputMaybe<Scalars['Instant']>;
};

/** The structure of the Admin notes field of the Research Outputs content type. */
export type ResearchOutputsDataAdminNotesDto = {
  /** This is ASAP internal content and it's not being shown on the Hub */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Admin notes field of the Research Outputs content input type. */
export type ResearchOutputsDataAdminNotesInputDto = {
  /** This is ASAP internal content and it's not being shown on the Hub */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the ASAP Funded field of the Research Outputs content type. */
export type ResearchOutputsDataAsapFundedDto = {
  /** "Not sure" will not be shown on the Hub */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the ASAP Funded field of the Research Outputs content input type. */
export type ResearchOutputsDataAsapFundedInputDto = {
  /** "Not sure" will not be shown on the Hub */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Authors field of the Research Outputs content type. */
export type ResearchOutputsDataAuthorsDto = {
  iv: Maybe<Array<ResearchOutputsDataAuthorsUnionDto>>;
};

/** The structure of the Authors field of the Research Outputs content input type. */
export type ResearchOutputsDataAuthorsInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

export type ResearchOutputsDataAuthorsUnionDto = ExternalAuthors | Users;

/** The structure of the Created by field of the Research Outputs content type. */
export type ResearchOutputsDataCreatedByDto = {
  iv: Maybe<Array<Users>>;
};

/** The structure of the Created by field of the Research Outputs content input type. */
export type ResearchOutputsDataCreatedByInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Description field of the Research Outputs content type. */
export type ResearchOutputsDataDescriptionDto = {
  /** The Hub will only show text or hyperlinks. Other formatting will be ignored (e.g. bold, color, size) */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Description field of the Research Outputs content input type. */
export type ResearchOutputsDataDescriptionInputDto = {
  /** The Hub will only show text or hyperlinks. Other formatting will be ignored (e.g. bold, color, size) */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Document type field of the Research Outputs content type. */
export type ResearchOutputsDataDocumentTypeDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Document type field of the Research Outputs content input type. */
export type ResearchOutputsDataDocumentTypeInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Identifier (DOI) field of the Research Outputs content type. */
export type ResearchOutputsDataDoiDto = {
  /** DOIs must start with a number and cannot be a URL */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Identifier (DOI) field of the Research Outputs content input type. */
export type ResearchOutputsDataDoiInputDto = {
  /** DOIs must start with a number and cannot be a URL */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Research Outputs data type. */
export type ResearchOutputsDataDto = {
  accession: Maybe<ResearchOutputsDataAccessionDto>;
  addedDate: Maybe<ResearchOutputsDataAddedDateDto>;
  adminNotes: Maybe<ResearchOutputsDataAdminNotesDto>;
  asapFunded: Maybe<ResearchOutputsDataAsapFundedDto>;
  authors: Maybe<ResearchOutputsDataAuthorsDto>;
  createdBy: Maybe<ResearchOutputsDataCreatedByDto>;
  description: Maybe<ResearchOutputsDataDescriptionDto>;
  documentType: Maybe<ResearchOutputsDataDocumentTypeDto>;
  doi: Maybe<ResearchOutputsDataDoiDto>;
  environments: Maybe<ResearchOutputsDataEnvironmentsDto>;
  labCatalogNumber: Maybe<ResearchOutputsDataLabCatalogNumberDto>;
  labs: Maybe<ResearchOutputsDataLabsDto>;
  lastUpdatedPartial: Maybe<ResearchOutputsDataLastUpdatedPartialDto>;
  link: Maybe<ResearchOutputsDataLinkDto>;
  methods: Maybe<ResearchOutputsDataMethodsDto>;
  organisms: Maybe<ResearchOutputsDataOrganismsDto>;
  publishDate: Maybe<ResearchOutputsDataPublishDateDto>;
  rrid: Maybe<ResearchOutputsDataRridDto>;
  sharingStatus: Maybe<ResearchOutputsDataSharingStatusDto>;
  subtype: Maybe<ResearchOutputsDataSubtypeDto>;
  tags: Maybe<ResearchOutputsDataTagsDto>;
  title: Maybe<ResearchOutputsDataTitleDto>;
  type: Maybe<ResearchOutputsDataTypeDto>;
  updatedBy: Maybe<ResearchOutputsDataUpdatedByDto>;
  usageNotes: Maybe<ResearchOutputsDataUsageNotesDto>;
  usedInAPublication: Maybe<ResearchOutputsDataUsedInAPublicationDto>;
};

/** The structure of the Environment field of the Research Outputs content type. */
export type ResearchOutputsDataEnvironmentsDto = {
  iv: Maybe<Array<ResearchTags>>;
};

/** The structure of the Environment field of the Research Outputs content input type. */
export type ResearchOutputsDataEnvironmentsInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Research Outputs data input type. */
export type ResearchOutputsDataInputDto = {
  accession: InputMaybe<ResearchOutputsDataAccessionInputDto>;
  addedDate: InputMaybe<ResearchOutputsDataAddedDateInputDto>;
  adminNotes: InputMaybe<ResearchOutputsDataAdminNotesInputDto>;
  asapFunded: InputMaybe<ResearchOutputsDataAsapFundedInputDto>;
  authors: InputMaybe<ResearchOutputsDataAuthorsInputDto>;
  createdBy: InputMaybe<ResearchOutputsDataCreatedByInputDto>;
  description: InputMaybe<ResearchOutputsDataDescriptionInputDto>;
  documentType: InputMaybe<ResearchOutputsDataDocumentTypeInputDto>;
  doi: InputMaybe<ResearchOutputsDataDoiInputDto>;
  environments: InputMaybe<ResearchOutputsDataEnvironmentsInputDto>;
  labCatalogNumber: InputMaybe<ResearchOutputsDataLabCatalogNumberInputDto>;
  labs: InputMaybe<ResearchOutputsDataLabsInputDto>;
  lastUpdatedPartial: InputMaybe<ResearchOutputsDataLastUpdatedPartialInputDto>;
  link: InputMaybe<ResearchOutputsDataLinkInputDto>;
  methods: InputMaybe<ResearchOutputsDataMethodsInputDto>;
  organisms: InputMaybe<ResearchOutputsDataOrganismsInputDto>;
  publishDate: InputMaybe<ResearchOutputsDataPublishDateInputDto>;
  rrid: InputMaybe<ResearchOutputsDataRridInputDto>;
  sharingStatus: InputMaybe<ResearchOutputsDataSharingStatusInputDto>;
  subtype: InputMaybe<ResearchOutputsDataSubtypeInputDto>;
  tags: InputMaybe<ResearchOutputsDataTagsInputDto>;
  title: InputMaybe<ResearchOutputsDataTitleInputDto>;
  type: InputMaybe<ResearchOutputsDataTypeInputDto>;
  updatedBy: InputMaybe<ResearchOutputsDataUpdatedByInputDto>;
  usageNotes: InputMaybe<ResearchOutputsDataUsageNotesInputDto>;
  usedInAPublication: InputMaybe<ResearchOutputsDataUsedInAPublicationInputDto>;
};

/** The structure of the Lab Catalog Number field of the Research Outputs content type. */
export type ResearchOutputsDataLabCatalogNumberDto = {
  /** If this is a hyperlink, please start with "http://" or "https://" */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Lab Catalog Number field of the Research Outputs content input type. */
export type ResearchOutputsDataLabCatalogNumberInputDto = {
  /** If this is a hyperlink, please start with "http://" or "https://" */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Labs field of the Research Outputs content type. */
export type ResearchOutputsDataLabsDto = {
  iv: Maybe<Array<Labs>>;
};

/** The structure of the Labs field of the Research Outputs content input type. */
export type ResearchOutputsDataLabsInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Last Updated (partial) field of the Research Outputs content type. */
export type ResearchOutputsDataLastUpdatedPartialDto = {
  /** Does not include changes to Publish Date and Admin notes */
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the Last Updated (partial) field of the Research Outputs content input type. */
export type ResearchOutputsDataLastUpdatedPartialInputDto = {
  /** Does not include changes to Publish Date and Admin notes */
  iv: InputMaybe<Scalars['Instant']>;
};

/** The structure of the External Link field of the Research Outputs content type. */
export type ResearchOutputsDataLinkDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the External Link field of the Research Outputs content input type. */
export type ResearchOutputsDataLinkInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Methods field of the Research Outputs content type. */
export type ResearchOutputsDataMethodsDto = {
  iv: Maybe<Array<ResearchTags>>;
};

/** The structure of the Methods field of the Research Outputs content input type. */
export type ResearchOutputsDataMethodsInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Organism field of the Research Outputs content type. */
export type ResearchOutputsDataOrganismsDto = {
  iv: Maybe<Array<ResearchTags>>;
};

/** The structure of the Organism field of the Research Outputs content input type. */
export type ResearchOutputsDataOrganismsInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Publish Date field of the Research Outputs content type. */
export type ResearchOutputsDataPublishDateDto = {
  /** Date of publishing (outside the Hub). Only applies to outputs that have been published. */
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the Publish Date field of the Research Outputs content input type. */
export type ResearchOutputsDataPublishDateInputDto = {
  /** Date of publishing (outside the Hub). Only applies to outputs that have been published. */
  iv: InputMaybe<Scalars['Instant']>;
};

/** The structure of the Identifier (RRID) field of the Research Outputs content type. */
export type ResearchOutputsDataRridDto = {
  /** This must start with "RRID:" */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Identifier (RRID) field of the Research Outputs content input type. */
export type ResearchOutputsDataRridInputDto = {
  /** This must start with "RRID:" */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Sharing Status field of the Research Outputs content type. */
export type ResearchOutputsDataSharingStatusDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Sharing Status field of the Research Outputs content input type. */
export type ResearchOutputsDataSharingStatusInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Subtype field of the Research Outputs content type. */
export type ResearchOutputsDataSubtypeDto = {
  iv: Maybe<Array<ResearchTags>>;
};

/** The structure of the Subtype field of the Research Outputs content input type. */
export type ResearchOutputsDataSubtypeInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Tags field of the Research Outputs content type. */
export type ResearchOutputsDataTagsDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Tags field of the Research Outputs content input type. */
export type ResearchOutputsDataTagsInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Title field of the Research Outputs content type. */
export type ResearchOutputsDataTitleDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Title field of the Research Outputs content input type. */
export type ResearchOutputsDataTitleInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Type field of the Research Outputs content type. */
export type ResearchOutputsDataTypeDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Type field of the Research Outputs content input type. */
export type ResearchOutputsDataTypeInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Updated by field of the Research Outputs content type. */
export type ResearchOutputsDataUpdatedByDto = {
  iv: Maybe<Array<Users>>;
};

/** The structure of the Updated by field of the Research Outputs content input type. */
export type ResearchOutputsDataUpdatedByInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Usage Notes field of the Research Outputs content type. */
export type ResearchOutputsDataUsageNotesDto = {
  /** The Hub will only show text or hyperlinks. Other formatting will be ignored (e.g. bold, color, size) */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Usage Notes field of the Research Outputs content input type. */
export type ResearchOutputsDataUsageNotesInputDto = {
  /** The Hub will only show text or hyperlinks. Other formatting will be ignored (e.g. bold, color, size) */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Used in a Publication field of the Research Outputs content type. */
export type ResearchOutputsDataUsedInAPublicationDto = {
  /** "Not sure" will not be shown on the Hub */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Used in a Publication field of the Research Outputs content input type. */
export type ResearchOutputsDataUsedInAPublicationInputDto = {
  /** "Not sure" will not be shown on the Hub */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the flat Research Outputs data type. */
export type ResearchOutputsFlatDataDto = {
  /** This must start with a letter */
  accession: Maybe<Scalars['String']>;
  /** Date output was shared with ASAP Network (different from publication date) */
  addedDate: Maybe<Scalars['Instant']>;
  /** This is ASAP internal content and it's not being shown on the Hub */
  adminNotes: Maybe<Scalars['String']>;
  /** "Not sure" will not be shown on the Hub */
  asapFunded: Maybe<Scalars['String']>;
  authors: Maybe<Array<ResearchOutputsDataAuthorsUnionDto>>;
  createdBy: Maybe<Array<Users>>;
  /** The Hub will only show text or hyperlinks. Other formatting will be ignored (e.g. bold, color, size) */
  description: Maybe<Scalars['String']>;
  documentType: Maybe<Scalars['String']>;
  /** DOIs must start with a number and cannot be a URL */
  doi: Maybe<Scalars['String']>;
  environments: Maybe<Array<ResearchTags>>;
  /** If this is a hyperlink, please start with "http://" or "https://" */
  labCatalogNumber: Maybe<Scalars['String']>;
  labs: Maybe<Array<Labs>>;
  /** Does not include changes to Publish Date and Admin notes */
  lastUpdatedPartial: Maybe<Scalars['Instant']>;
  link: Maybe<Scalars['String']>;
  methods: Maybe<Array<ResearchTags>>;
  organisms: Maybe<Array<ResearchTags>>;
  /** Date of publishing (outside the Hub). Only applies to outputs that have been published. */
  publishDate: Maybe<Scalars['Instant']>;
  /** This must start with "RRID:" */
  rrid: Maybe<Scalars['String']>;
  sharingStatus: Maybe<Scalars['String']>;
  subtype: Maybe<Array<ResearchTags>>;
  tags: Maybe<Array<Scalars['String']>>;
  title: Maybe<Scalars['String']>;
  type: Maybe<Scalars['String']>;
  updatedBy: Maybe<Array<Users>>;
  /** The Hub will only show text or hyperlinks. Other formatting will be ignored (e.g. bold, color, size) */
  usageNotes: Maybe<Scalars['String']>;
  /** "Not sure" will not be shown on the Hub */
  usedInAPublication: Maybe<Scalars['String']>;
};

/** List of Research Outputs items and total count. */
export type ResearchOutputsResultDto = {
  /** The contents. */
  items: Maybe<Array<ResearchOutputs>>;
  /** The total count of  contents. */
  total: Scalars['Int'];
};

/** The structure of a Research Tags content type. */
export type ResearchTags = Content & {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The data of the content. */
  data: ResearchTagsDataDto;
  /** The edit token. */
  editToken: Maybe<Scalars['String']>;
  /** The flat data of the content. */
  flatData: ResearchTagsFlatDataDto;
  /** The ID of the object (usually GUID). */
  id: Scalars['String'];
  /** The timestamp when the object was updated the last time. */
  lastModified: Scalars['Instant'];
  /** The user who updated the object the last time. */
  lastModifiedBy: Scalars['String'];
  /** The user who updated the object the last time. */
  lastModifiedByUser: User;
  /** The new status of the content. */
  newStatus: Maybe<Scalars['String']>;
  /** The status color of the content. */
  newStatusColor: Maybe<Scalars['String']>;
  /** Query Research Outputs content items. */
  referencingResearchOutputsContents: Maybe<Array<ResearchOutputs>>;
  /** Query Research Outputs content items with total count. */
  referencingResearchOutputsContentsWithTotal: Maybe<ResearchOutputsResultDto>;
  /** The status of the content. */
  status: Scalars['String'];
  /** The status color of the content. */
  statusColor: Scalars['String'];
  /** The URL to the content. */
  url: Scalars['String'];
  /** The version of the objec. */
  version: Scalars['Int'];
};

/** The structure of a Research Tags content type. */
export type ResearchTagsReferencingResearchOutputsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Research Tags content type. */
export type ResearchTagsReferencingResearchOutputsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of the Category field of the Research Tags content type. */
export type ResearchTagsDataCategoryDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Category field of the Research Tags content input type. */
export type ResearchTagsDataCategoryInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Research Tags data type. */
export type ResearchTagsDataDto = {
  category: Maybe<ResearchTagsDataCategoryDto>;
  entities: Maybe<ResearchTagsDataEntitiesDto>;
  name: Maybe<ResearchTagsDataNameDto>;
  types: Maybe<ResearchTagsDataTypesDto>;
};

/** The structure of the Entities field of the Research Tags content type. */
export type ResearchTagsDataEntitiesDto = {
  /** List of associated entities */
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Entities field of the Research Tags content input type. */
export type ResearchTagsDataEntitiesInputDto = {
  /** List of associated entities */
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Research Tags data input type. */
export type ResearchTagsDataInputDto = {
  category: InputMaybe<ResearchTagsDataCategoryInputDto>;
  entities: InputMaybe<ResearchTagsDataEntitiesInputDto>;
  name: InputMaybe<ResearchTagsDataNameInputDto>;
  types: InputMaybe<ResearchTagsDataTypesInputDto>;
};

/** The structure of the Name field of the Research Tags content type. */
export type ResearchTagsDataNameDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Name field of the Research Tags content input type. */
export type ResearchTagsDataNameInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Types field of the Research Tags content type. */
export type ResearchTagsDataTypesDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Types field of the Research Tags content input type. */
export type ResearchTagsDataTypesInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the flat Research Tags data type. */
export type ResearchTagsFlatDataDto = {
  category: Maybe<Scalars['String']>;
  /** List of associated entities */
  entities: Maybe<Array<Scalars['String']>>;
  name: Maybe<Scalars['String']>;
  types: Maybe<Array<Scalars['String']>>;
};

/** List of Research Tags items and total count. */
export type ResearchTagsResultDto = {
  /** The contents. */
  items: Maybe<Array<ResearchTags>>;
  /** The total count of  contents. */
  total: Scalars['Int'];
};

/** The structure of a Teams content type. */
export type Teams = Content & {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The data of the content. */
  data: TeamsDataDto;
  /** The edit token. */
  editToken: Maybe<Scalars['String']>;
  /** The flat data of the content. */
  flatData: TeamsFlatDataDto;
  /** The ID of the object (usually GUID). */
  id: Scalars['String'];
  /** The timestamp when the object was updated the last time. */
  lastModified: Scalars['Instant'];
  /** The user who updated the object the last time. */
  lastModifiedBy: Scalars['String'];
  /** The user who updated the object the last time. */
  lastModifiedByUser: User;
  /** The new status of the content. */
  newStatus: Maybe<Scalars['String']>;
  /** The status color of the content. */
  newStatusColor: Maybe<Scalars['String']>;
  /** Query Research Outputs content items. */
  referencesResearchOutputsContents: Maybe<Array<ResearchOutputs>>;
  /** Query Research Outputs content items with total count. */
  referencesResearchOutputsContentsWithTotal: Maybe<ResearchOutputsResultDto>;
  /** Query Discover ASAP content items. */
  referencingDiscoverContents: Maybe<Array<Discover>>;
  /** Query Discover ASAP content items with total count. */
  referencingDiscoverContentsWithTotal: Maybe<DiscoverResultDto>;
  /** Query Events content items. */
  referencingEventsContents: Maybe<Array<Events>>;
  /** Query Events content items with total count. */
  referencingEventsContentsWithTotal: Maybe<EventsResultDto>;
  /** Query Groups content items. */
  referencingGroupsContents: Maybe<Array<Groups>>;
  /** Query Groups content items with total count. */
  referencingGroupsContentsWithTotal: Maybe<GroupsResultDto>;
  /** Query Users content items. */
  referencingUsersContents: Maybe<Array<Users>>;
  /** Query Users content items with total count. */
  referencingUsersContentsWithTotal: Maybe<UsersResultDto>;
  /** The status of the content. */
  status: Scalars['String'];
  /** The status color of the content. */
  statusColor: Scalars['String'];
  /** The URL to the content. */
  url: Scalars['String'];
  /** The version of the objec. */
  version: Scalars['Int'];
};

/** The structure of a Teams content type. */
export type TeamsReferencesResearchOutputsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Teams content type. */
export type TeamsReferencesResearchOutputsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Teams content type. */
export type TeamsReferencingDiscoverContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Teams content type. */
export type TeamsReferencingDiscoverContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Teams content type. */
export type TeamsReferencingEventsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Teams content type. */
export type TeamsReferencingEventsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Teams content type. */
export type TeamsReferencingGroupsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Teams content type. */
export type TeamsReferencingGroupsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Teams content type. */
export type TeamsReferencingUsersContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Teams content type. */
export type TeamsReferencingUsersContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of the Application Number field of the Teams content type. */
export type TeamsDataApplicationNumberDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Application Number field of the Teams content input type. */
export type TeamsDataApplicationNumberInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Display Name field of the Teams content type. */
export type TeamsDataDisplayNameDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Display Name field of the Teams content input type. */
export type TeamsDataDisplayNameInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Teams data type. */
export type TeamsDataDto = {
  applicationNumber: Maybe<TeamsDataApplicationNumberDto>;
  displayName: Maybe<TeamsDataDisplayNameDto>;
  expertiseAndResourceTags: Maybe<TeamsDataExpertiseAndResourceTagsDto>;
  inactiveSince: Maybe<TeamsDataInactiveSinceDto>;
  outputs: Maybe<TeamsDataOutputsDto>;
  projectSummary: Maybe<TeamsDataProjectSummaryDto>;
  projectTitle: Maybe<TeamsDataProjectTitleDto>;
  proposal: Maybe<TeamsDataProposalDto>;
  tools: Maybe<TeamsDataToolsDto>;
};

/** The structure of the Expertise and Resources field of the Teams content type. */
export type TeamsDataExpertiseAndResourceTagsDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Expertise and Resources field of the Teams content input type. */
export type TeamsDataExpertiseAndResourceTagsInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the The team is inactive since field of the Teams content type. */
export type TeamsDataInactiveSinceDto = {
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the The team is inactive since field of the Teams content input type. */
export type TeamsDataInactiveSinceInputDto = {
  iv: InputMaybe<Scalars['Instant']>;
};

/** The structure of the Teams data input type. */
export type TeamsDataInputDto = {
  applicationNumber: InputMaybe<TeamsDataApplicationNumberInputDto>;
  displayName: InputMaybe<TeamsDataDisplayNameInputDto>;
  expertiseAndResourceTags: InputMaybe<TeamsDataExpertiseAndResourceTagsInputDto>;
  inactiveSince: InputMaybe<TeamsDataInactiveSinceInputDto>;
  outputs: InputMaybe<TeamsDataOutputsInputDto>;
  projectSummary: InputMaybe<TeamsDataProjectSummaryInputDto>;
  projectTitle: InputMaybe<TeamsDataProjectTitleInputDto>;
  proposal: InputMaybe<TeamsDataProposalInputDto>;
  tools: InputMaybe<TeamsDataToolsInputDto>;
};

/** The structure of the Shared Research field of the Teams content type. */
export type TeamsDataOutputsDto = {
  iv: Maybe<Array<ResearchOutputs>>;
};

/** The structure of the Shared Research field of the Teams content input type. */
export type TeamsDataOutputsInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Project Summary field of the Teams content type. */
export type TeamsDataProjectSummaryDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Project Summary field of the Teams content input type. */
export type TeamsDataProjectSummaryInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Project Title field of the Teams content type. */
export type TeamsDataProjectTitleDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Project Title field of the Teams content input type. */
export type TeamsDataProjectTitleInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Proposal field of the Teams content type. */
export type TeamsDataProposalDto = {
  iv: Maybe<Array<ResearchOutputs>>;
};

/** The structure of the Proposal field of the Teams content input type. */
export type TeamsDataProposalInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the External Tools nested schema. */
export type TeamsDataToolsChildDto = {
  description: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
  url: Maybe<Scalars['String']>;
};

/** The structure of the External Tools nested schema. */
export type TeamsDataToolsChildInputDto = {
  description: InputMaybe<Scalars['String']>;
  name: InputMaybe<Scalars['String']>;
  url: InputMaybe<Scalars['String']>;
};

/** The structure of the External Tools field of the Teams content type. */
export type TeamsDataToolsDto = {
  iv: Maybe<Array<TeamsDataToolsChildDto>>;
};

/** The structure of the External Tools field of the Teams content input type. */
export type TeamsDataToolsInputDto = {
  iv: InputMaybe<Array<TeamsDataToolsChildInputDto>>;
};

/** The structure of the flat Teams data type. */
export type TeamsFlatDataDto = {
  applicationNumber: Maybe<Scalars['String']>;
  displayName: Maybe<Scalars['String']>;
  expertiseAndResourceTags: Maybe<Array<Scalars['String']>>;
  inactiveSince: Maybe<Scalars['Instant']>;
  outputs: Maybe<Array<ResearchOutputs>>;
  projectSummary: Maybe<Scalars['String']>;
  projectTitle: Maybe<Scalars['String']>;
  proposal: Maybe<Array<ResearchOutputs>>;
  tools: Maybe<Array<TeamsDataToolsChildDto>>;
};

/** List of Teams items and total count. */
export type TeamsResultDto = {
  /** The contents. */
  items: Maybe<Array<Teams>>;
  /** The total count of  contents. */
  total: Scalars['Int'];
};

/** The structure of a Tutorials content type. */
export type Tutorials = Content & {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The data of the content. */
  data: TutorialsDataDto;
  /** The edit token. */
  editToken: Maybe<Scalars['String']>;
  /** The flat data of the content. */
  flatData: TutorialsFlatDataDto;
  /** The ID of the object (usually GUID). */
  id: Scalars['String'];
  /** The timestamp when the object was updated the last time. */
  lastModified: Scalars['Instant'];
  /** The user who updated the object the last time. */
  lastModifiedBy: Scalars['String'];
  /** The user who updated the object the last time. */
  lastModifiedByUser: User;
  /** The new status of the content. */
  newStatus: Maybe<Scalars['String']>;
  /** The status color of the content. */
  newStatusColor: Maybe<Scalars['String']>;
  /** Query Discover ASAP content items. */
  referencingDiscoverContents: Maybe<Array<Discover>>;
  /** Query Discover ASAP content items with total count. */
  referencingDiscoverContentsWithTotal: Maybe<DiscoverResultDto>;
  /** The status of the content. */
  status: Scalars['String'];
  /** The status color of the content. */
  statusColor: Scalars['String'];
  /** The URL to the content. */
  url: Scalars['String'];
  /** The version of the objec. */
  version: Scalars['Int'];
};

/** The structure of a Tutorials content type. */
export type TutorialsReferencingDiscoverContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Tutorials content type. */
export type TutorialsReferencingDiscoverContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of the Tutorials data type. */
export type TutorialsDataDto = {
  link: Maybe<TutorialsDataLinkDto>;
  linkText: Maybe<TutorialsDataLinkTextDto>;
  shortText: Maybe<TutorialsDataShortTextDto>;
  text: Maybe<TutorialsDataTextDto>;
  thumbnail: Maybe<TutorialsDataThumbnailDto>;
  title: Maybe<TutorialsDataTitleDto>;
};

/** The structure of the Tutorials data input type. */
export type TutorialsDataInputDto = {
  link: InputMaybe<TutorialsDataLinkInputDto>;
  linkText: InputMaybe<TutorialsDataLinkTextInputDto>;
  shortText: InputMaybe<TutorialsDataShortTextInputDto>;
  text: InputMaybe<TutorialsDataTextInputDto>;
  thumbnail: InputMaybe<TutorialsDataThumbnailInputDto>;
  title: InputMaybe<TutorialsDataTitleInputDto>;
};

/** The structure of the External Link field of the Tutorials content type. */
export type TutorialsDataLinkDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the External Link field of the Tutorials content input type. */
export type TutorialsDataLinkInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the External Link Text field of the Tutorials content type. */
export type TutorialsDataLinkTextDto = {
  /** Leave this empty to show "Open External Link" */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the External Link Text field of the Tutorials content input type. */
export type TutorialsDataLinkTextInputDto = {
  /** Leave this empty to show "Open External Link" */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Short Text field of the Tutorials content type. */
export type TutorialsDataShortTextDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Short Text field of the Tutorials content input type. */
export type TutorialsDataShortTextInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Text field of the Tutorials content type. */
export type TutorialsDataTextDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Text field of the Tutorials content input type. */
export type TutorialsDataTextInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Thumbnail field of the Tutorials content type. */
export type TutorialsDataThumbnailDto = {
  iv: Maybe<Array<Asset>>;
};

/** The structure of the Thumbnail field of the Tutorials content input type. */
export type TutorialsDataThumbnailInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Title field of the Tutorials content type. */
export type TutorialsDataTitleDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Title field of the Tutorials content input type. */
export type TutorialsDataTitleInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the flat Tutorials data type. */
export type TutorialsFlatDataDto = {
  link: Maybe<Scalars['String']>;
  /** Leave this empty to show "Open External Link" */
  linkText: Maybe<Scalars['String']>;
  shortText: Maybe<Scalars['String']>;
  text: Maybe<Scalars['String']>;
  thumbnail: Maybe<Array<Asset>>;
  title: Maybe<Scalars['String']>;
};

/** List of Tutorials items and total count. */
export type TutorialsResultDto = {
  /** The contents. */
  items: Maybe<Array<Tutorials>>;
  /** The total count of  contents. */
  total: Scalars['Int'];
};

/** A user that created or modified a content or asset. */
export type User = {
  /** The display name of this user. */
  displayName: Maybe<Scalars['String']>;
  /** The email address ofthis  user. */
  email: Maybe<Scalars['String']>;
  /** The ID of this user. */
  id: Scalars['String'];
};

/** The structure of a Users content type. */
export type Users = Content & {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The data of the content. */
  data: UsersDataDto;
  /** The edit token. */
  editToken: Maybe<Scalars['String']>;
  /** The flat data of the content. */
  flatData: UsersFlatDataDto;
  /** The ID of the object (usually GUID). */
  id: Scalars['String'];
  /** The timestamp when the object was updated the last time. */
  lastModified: Scalars['Instant'];
  /** The user who updated the object the last time. */
  lastModifiedBy: Scalars['String'];
  /** The user who updated the object the last time. */
  lastModifiedByUser: User;
  /** The new status of the content. */
  newStatus: Maybe<Scalars['String']>;
  /** The status color of the content. */
  newStatusColor: Maybe<Scalars['String']>;
  /** Query Labs content items. */
  referencesLabsContents: Maybe<Array<Labs>>;
  /** Query Labs content items with total count. */
  referencesLabsContentsWithTotal: Maybe<LabsResultDto>;
  /** Query Teams content items. */
  referencesTeamsContents: Maybe<Array<Teams>>;
  /** Query Teams content items with total count. */
  referencesTeamsContentsWithTotal: Maybe<TeamsResultDto>;
  /** Query Discover ASAP content items. */
  referencingDiscoverContents: Maybe<Array<Discover>>;
  /** Query Discover ASAP content items with total count. */
  referencingDiscoverContentsWithTotal: Maybe<DiscoverResultDto>;
  /** Query Events content items. */
  referencingEventsContents: Maybe<Array<Events>>;
  /** Query Events content items with total count. */
  referencingEventsContentsWithTotal: Maybe<EventsResultDto>;
  /** Query Groups content items. */
  referencingGroupsContents: Maybe<Array<Groups>>;
  /** Query Groups content items with total count. */
  referencingGroupsContentsWithTotal: Maybe<GroupsResultDto>;
  /** Query Research Outputs content items. */
  referencingResearchOutputsContents: Maybe<Array<ResearchOutputs>>;
  /** Query Research Outputs content items with total count. */
  referencingResearchOutputsContentsWithTotal: Maybe<ResearchOutputsResultDto>;
  /** The status of the content. */
  status: Scalars['String'];
  /** The status color of the content. */
  statusColor: Scalars['String'];
  /** The URL to the content. */
  url: Scalars['String'];
  /** The version of the objec. */
  version: Scalars['Int'];
};

/** The structure of a Users content type. */
export type UsersReferencesLabsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencesLabsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencesTeamsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencesTeamsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingDiscoverContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingDiscoverContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingEventsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingEventsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingGroupsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingGroupsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingResearchOutputsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingResearchOutputsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of the Admin Notes field of the Users content type. */
export type UsersDataAdminNotesDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Admin Notes field of the Users content input type. */
export type UsersDataAdminNotesInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the AlumniSinceDate field of the Users content type. */
export type UsersDataAlumniSinceDateDto = {
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the AlumniSinceDate field of the Users content input type. */
export type UsersDataAlumniSinceDateInputDto = {
  iv: InputMaybe<Scalars['Instant']>;
};

/** The structure of the Avatar field of the Users content type. */
export type UsersDataAvatarDto = {
  iv: Maybe<Array<Asset>>;
};

/** The structure of the Avatar field of the Users content input type. */
export type UsersDataAvatarInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Biography field of the Users content type. */
export type UsersDataBiographyDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Biography field of the Users content input type. */
export type UsersDataBiographyInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the City field of the Users content type. */
export type UsersDataCityDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the City field of the Users content input type. */
export type UsersDataCityInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Connections nested schema. */
export type UsersDataConnectionsChildDto = {
  code: Maybe<Scalars['String']>;
};

/** The structure of the Connections nested schema. */
export type UsersDataConnectionsChildInputDto = {
  code: InputMaybe<Scalars['String']>;
};

/** The structure of the Connections field of the Users content type. */
export type UsersDataConnectionsDto = {
  iv: Maybe<Array<UsersDataConnectionsChildDto>>;
};

/** The structure of the Connections field of the Users content input type. */
export type UsersDataConnectionsInputDto = {
  iv: InputMaybe<Array<UsersDataConnectionsChildInputDto>>;
};

/** The structure of the Correspondence Email field of the Users content type. */
export type UsersDataContactEmailDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Correspondence Email field of the Users content input type. */
export type UsersDataContactEmailInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Country field of the Users content type. */
export type UsersDataCountryDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Country field of the Users content input type. */
export type UsersDataCountryInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Degree field of the Users content type. */
export type UsersDataDegreeDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Degree field of the Users content input type. */
export type UsersDataDegreeInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Dismissed Getting Started dialog field of the Users content type. */
export type UsersDataDismissedGettingStartedDto = {
  /** Use this to hide the Getting Started component on the home page */
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the Dismissed Getting Started dialog field of the Users content input type. */
export type UsersDataDismissedGettingStartedInputDto = {
  /** Use this to hide the Getting Started component on the home page */
  iv: InputMaybe<Scalars['Boolean']>;
};

/** The structure of the Users data type. */
export type UsersDataDto = {
  adminNotes: Maybe<UsersDataAdminNotesDto>;
  alumniSinceDate: Maybe<UsersDataAlumniSinceDateDto>;
  avatar: Maybe<UsersDataAvatarDto>;
  biography: Maybe<UsersDataBiographyDto>;
  city: Maybe<UsersDataCityDto>;
  connections: Maybe<UsersDataConnectionsDto>;
  contactEmail: Maybe<UsersDataContactEmailDto>;
  country: Maybe<UsersDataCountryDto>;
  degree: Maybe<UsersDataDegreeDto>;
  dismissedGettingStarted: Maybe<UsersDataDismissedGettingStartedDto>;
  email: Maybe<UsersDataEmailDto>;
  expertiseAndResourceDescription: Maybe<UsersDataExpertiseAndResourceDescriptionDto>;
  expertiseAndResourceTags: Maybe<UsersDataExpertiseAndResourceTagsDto>;
  firstName: Maybe<UsersDataFirstNameDto>;
  institution: Maybe<UsersDataInstitutionDto>;
  jobTitle: Maybe<UsersDataJobTitleDto>;
  labs: Maybe<UsersDataLabsDto>;
  lastModifiedDate: Maybe<UsersDataLastModifiedDateDto>;
  lastName: Maybe<UsersDataLastNameDto>;
  onboarded: Maybe<UsersDataOnboardedDto>;
  orcid: Maybe<UsersDataOrcidDto>;
  orcidLastModifiedDate: Maybe<UsersDataOrcidLastModifiedDateDto>;
  orcidLastSyncDate: Maybe<UsersDataOrcidLastSyncDateDto>;
  orcidWorks: Maybe<UsersDataOrcidWorksDto>;
  questions: Maybe<UsersDataQuestionsDto>;
  reachOut: Maybe<UsersDataReachOutDto>;
  researchInterests: Maybe<UsersDataResearchInterestsDto>;
  responsibilities: Maybe<UsersDataResponsibilitiesDto>;
  role: Maybe<UsersDataRoleDto>;
  social: Maybe<UsersDataSocialDto>;
  teams: Maybe<UsersDataTeamsDto>;
};

/** The structure of the Email field of the Users content type. */
export type UsersDataEmailDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Email field of the Users content input type. */
export type UsersDataEmailInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Expertise and Resources Description field of the Users content type. */
export type UsersDataExpertiseAndResourceDescriptionDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Expertise and Resources Description field of the Users content input type. */
export type UsersDataExpertiseAndResourceDescriptionInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Expertise and Resources field of the Users content type. */
export type UsersDataExpertiseAndResourceTagsDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Expertise and Resources field of the Users content input type. */
export type UsersDataExpertiseAndResourceTagsInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the First Name field of the Users content type. */
export type UsersDataFirstNameDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the First Name field of the Users content input type. */
export type UsersDataFirstNameInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Users data input type. */
export type UsersDataInputDto = {
  adminNotes: InputMaybe<UsersDataAdminNotesInputDto>;
  alumniSinceDate: InputMaybe<UsersDataAlumniSinceDateInputDto>;
  avatar: InputMaybe<UsersDataAvatarInputDto>;
  biography: InputMaybe<UsersDataBiographyInputDto>;
  city: InputMaybe<UsersDataCityInputDto>;
  connections: InputMaybe<UsersDataConnectionsInputDto>;
  contactEmail: InputMaybe<UsersDataContactEmailInputDto>;
  country: InputMaybe<UsersDataCountryInputDto>;
  degree: InputMaybe<UsersDataDegreeInputDto>;
  dismissedGettingStarted: InputMaybe<UsersDataDismissedGettingStartedInputDto>;
  email: InputMaybe<UsersDataEmailInputDto>;
  expertiseAndResourceDescription: InputMaybe<UsersDataExpertiseAndResourceDescriptionInputDto>;
  expertiseAndResourceTags: InputMaybe<UsersDataExpertiseAndResourceTagsInputDto>;
  firstName: InputMaybe<UsersDataFirstNameInputDto>;
  institution: InputMaybe<UsersDataInstitutionInputDto>;
  jobTitle: InputMaybe<UsersDataJobTitleInputDto>;
  labs: InputMaybe<UsersDataLabsInputDto>;
  lastModifiedDate: InputMaybe<UsersDataLastModifiedDateInputDto>;
  lastName: InputMaybe<UsersDataLastNameInputDto>;
  onboarded: InputMaybe<UsersDataOnboardedInputDto>;
  orcid: InputMaybe<UsersDataOrcidInputDto>;
  orcidLastModifiedDate: InputMaybe<UsersDataOrcidLastModifiedDateInputDto>;
  orcidLastSyncDate: InputMaybe<UsersDataOrcidLastSyncDateInputDto>;
  orcidWorks: InputMaybe<UsersDataOrcidWorksInputDto>;
  questions: InputMaybe<UsersDataQuestionsInputDto>;
  reachOut: InputMaybe<UsersDataReachOutInputDto>;
  researchInterests: InputMaybe<UsersDataResearchInterestsInputDto>;
  responsibilities: InputMaybe<UsersDataResponsibilitiesInputDto>;
  role: InputMaybe<UsersDataRoleInputDto>;
  social: InputMaybe<UsersDataSocialInputDto>;
  teams: InputMaybe<UsersDataTeamsInputDto>;
};

/** The structure of the Institution field of the Users content type. */
export type UsersDataInstitutionDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Institution field of the Users content input type. */
export type UsersDataInstitutionInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Job Title field of the Users content type. */
export type UsersDataJobTitleDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Job Title field of the Users content input type. */
export type UsersDataJobTitleInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Labs field of the Users content type. */
export type UsersDataLabsDto = {
  /** Mandatory for grantees. They cannot publish profile without a lab. */
  iv: Maybe<Array<Labs>>;
};

/** The structure of the Labs field of the Users content input type. */
export type UsersDataLabsInputDto = {
  /** Mandatory for grantees. They cannot publish profile without a lab. */
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Last Modified Date field of the Users content type. */
export type UsersDataLastModifiedDateDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Last Modified Date field of the Users content input type. */
export type UsersDataLastModifiedDateInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Last Name field of the Users content type. */
export type UsersDataLastNameDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Last Name field of the Users content input type. */
export type UsersDataLastNameInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Onboarding complete field of the Users content type. */
export type UsersDataOnboardedDto = {
  /** Use this to allow the user to see the full Hub and skip profile completion */
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the Onboarding complete field of the Users content input type. */
export type UsersDataOnboardedInputDto = {
  /** Use this to allow the user to see the full Hub and skip profile completion */
  iv: InputMaybe<Scalars['Boolean']>;
};

/** The structure of the ORCID field of the Users content type. */
export type UsersDataOrcidDto = {
  /** Mandatory for grantees. They cannot publish profile without an ORCID. ORCIDs cannot be repeated on the Hub */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the ORCID field of the Users content input type. */
export type UsersDataOrcidInputDto = {
  /** Mandatory for grantees. They cannot publish profile without an ORCID. ORCIDs cannot be repeated on the Hub */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the ORCID Last Modified Date field of the Users content type. */
export type UsersDataOrcidLastModifiedDateDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the ORCID Last Modified Date field of the Users content input type. */
export type UsersDataOrcidLastModifiedDateInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the ORCID Last Sync Date field of the Users content type. */
export type UsersDataOrcidLastSyncDateDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the ORCID Last Sync Date field of the Users content input type. */
export type UsersDataOrcidLastSyncDateInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the ORCID Works nested schema. */
export type UsersDataOrcidWorksChildDto = {
  doi: Maybe<Scalars['String']>;
  id: Maybe<Scalars['String']>;
  lastModifiedDate: Maybe<Scalars['String']>;
  publicationDate: Maybe<Scalars['JsonScalar']>;
  title: Maybe<Scalars['String']>;
  type: Maybe<Scalars['String']>;
};

/** The structure of the ORCID Works nested schema. */
export type UsersDataOrcidWorksChildDtoPublicationDateArgs = {
  path: InputMaybe<Scalars['String']>;
};

/** The structure of the ORCID Works nested schema. */
export type UsersDataOrcidWorksChildInputDto = {
  doi: InputMaybe<Scalars['String']>;
  id: InputMaybe<Scalars['String']>;
  lastModifiedDate: InputMaybe<Scalars['String']>;
  publicationDate: InputMaybe<Scalars['JsonScalar']>;
  title: InputMaybe<Scalars['String']>;
  type: InputMaybe<Scalars['String']>;
};

/** The structure of the ORCID Works field of the Users content type. */
export type UsersDataOrcidWorksDto = {
  iv: Maybe<Array<UsersDataOrcidWorksChildDto>>;
};

/** The structure of the ORCID Works field of the Users content input type. */
export type UsersDataOrcidWorksInputDto = {
  iv: InputMaybe<Array<UsersDataOrcidWorksChildInputDto>>;
};

/** The structure of the Open Questions nested schema. */
export type UsersDataQuestionsChildDto = {
  question: Maybe<Scalars['String']>;
};

/** The structure of the Open Questions nested schema. */
export type UsersDataQuestionsChildInputDto = {
  question: InputMaybe<Scalars['String']>;
};

/** The structure of the Open Questions field of the Users content type. */
export type UsersDataQuestionsDto = {
  iv: Maybe<Array<UsersDataQuestionsChildDto>>;
};

/** The structure of the Open Questions field of the Users content input type. */
export type UsersDataQuestionsInputDto = {
  iv: InputMaybe<Array<UsersDataQuestionsChildInputDto>>;
};

/** The structure of the Reach Out field of the Users content type. */
export type UsersDataReachOutDto = {
  /** Reach out reasons (only relevant for "Staff" users) */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Reach Out field of the Users content input type. */
export type UsersDataReachOutInputDto = {
  /** Reach out reasons (only relevant for "Staff" users) */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Research Interests field of the Users content type. */
export type UsersDataResearchInterestsDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Research Interests field of the Users content input type. */
export type UsersDataResearchInterestsInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Responsibilities field of the Users content type. */
export type UsersDataResponsibilitiesDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Responsibilities field of the Users content input type. */
export type UsersDataResponsibilitiesInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the ASAP Hub Role field of the Users content type. */
export type UsersDataRoleDto = {
  /** Role on the ASAP Hub */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the ASAP Hub Role field of the Users content input type. */
export type UsersDataRoleInputDto = {
  /** Role on the ASAP Hub */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Social Links nested schema. */
export type UsersDataSocialChildDto = {
  github: Maybe<Scalars['String']>;
  googleScholar: Maybe<Scalars['String']>;
  linkedIn: Maybe<Scalars['String']>;
  researchGate: Maybe<Scalars['String']>;
  researcherId: Maybe<Scalars['String']>;
  twitter: Maybe<Scalars['String']>;
  website1: Maybe<Scalars['String']>;
  website2: Maybe<Scalars['String']>;
};

/** The structure of the Social Links nested schema. */
export type UsersDataSocialChildInputDto = {
  github: InputMaybe<Scalars['String']>;
  googleScholar: InputMaybe<Scalars['String']>;
  linkedIn: InputMaybe<Scalars['String']>;
  researchGate: InputMaybe<Scalars['String']>;
  researcherId: InputMaybe<Scalars['String']>;
  twitter: InputMaybe<Scalars['String']>;
  website1: InputMaybe<Scalars['String']>;
  website2: InputMaybe<Scalars['String']>;
};

/** The structure of the Social Links field of the Users content type. */
export type UsersDataSocialDto = {
  iv: Maybe<Array<UsersDataSocialChildDto>>;
};

/** The structure of the Social Links field of the Users content input type. */
export type UsersDataSocialInputDto = {
  iv: InputMaybe<Array<UsersDataSocialChildInputDto>>;
};

/** The structure of the Teams nested schema. */
export type UsersDataTeamsChildDto = {
  id: Maybe<Array<Teams>>;
  /** Attention: Check if this user needs to be added to Smart Simple */
  role: Maybe<Scalars['String']>;
};

/** The structure of the Teams nested schema. */
export type UsersDataTeamsChildInputDto = {
  id: InputMaybe<Array<Scalars['String']>>;
  /** Attention: Check if this user needs to be added to Smart Simple */
  role: InputMaybe<Scalars['String']>;
};

/** The structure of the Teams field of the Users content type. */
export type UsersDataTeamsDto = {
  /** Mandatory for grantees. They cannot publish profile without a team. */
  iv: Maybe<Array<UsersDataTeamsChildDto>>;
};

/** The structure of the Teams field of the Users content input type. */
export type UsersDataTeamsInputDto = {
  /** Mandatory for grantees. They cannot publish profile without a team. */
  iv: InputMaybe<Array<UsersDataTeamsChildInputDto>>;
};

/** The structure of the flat Users data type. */
export type UsersFlatDataDto = {
  adminNotes: Maybe<Scalars['String']>;
  alumniSinceDate: Maybe<Scalars['Instant']>;
  avatar: Maybe<Array<Asset>>;
  biography: Maybe<Scalars['String']>;
  city: Maybe<Scalars['String']>;
  connections: Maybe<Array<UsersDataConnectionsChildDto>>;
  contactEmail: Maybe<Scalars['String']>;
  country: Maybe<Scalars['String']>;
  degree: Maybe<Scalars['String']>;
  /** Use this to hide the Getting Started component on the home page */
  dismissedGettingStarted: Maybe<Scalars['Boolean']>;
  email: Maybe<Scalars['String']>;
  expertiseAndResourceDescription: Maybe<Scalars['String']>;
  expertiseAndResourceTags: Maybe<Array<Scalars['String']>>;
  firstName: Maybe<Scalars['String']>;
  institution: Maybe<Scalars['String']>;
  jobTitle: Maybe<Scalars['String']>;
  /** Mandatory for grantees. They cannot publish profile without a lab. */
  labs: Maybe<Array<Labs>>;
  lastModifiedDate: Maybe<Scalars['String']>;
  lastName: Maybe<Scalars['String']>;
  /** Use this to allow the user to see the full Hub and skip profile completion */
  onboarded: Maybe<Scalars['Boolean']>;
  /** Mandatory for grantees. They cannot publish profile without an ORCID. ORCIDs cannot be repeated on the Hub */
  orcid: Maybe<Scalars['String']>;
  orcidLastModifiedDate: Maybe<Scalars['String']>;
  orcidLastSyncDate: Maybe<Scalars['String']>;
  orcidWorks: Maybe<Array<UsersDataOrcidWorksChildDto>>;
  questions: Maybe<Array<UsersDataQuestionsChildDto>>;
  /** Reach out reasons (only relevant for "Staff" users) */
  reachOut: Maybe<Scalars['String']>;
  researchInterests: Maybe<Scalars['String']>;
  responsibilities: Maybe<Scalars['String']>;
  /** Role on the ASAP Hub */
  role: Maybe<Scalars['String']>;
  social: Maybe<Array<UsersDataSocialChildDto>>;
  /** Mandatory for grantees. They cannot publish profile without a team. */
  teams: Maybe<Array<UsersDataTeamsChildDto>>;
};

/** List of Users items and total count. */
export type UsersResultDto = {
  /** The contents. */
  items: Maybe<Array<Users>>;
  /** The total count of  contents. */
  total: Scalars['Int'];
};

export type CalendarsContentFragment = Pick<
  Calendars,
  'id' | 'created' | 'lastModified' | 'version'
> & {
  flatData: Pick<
    CalendarsFlatDataDto,
    | 'googleCalendarId'
    | 'name'
    | 'color'
    | 'syncToken'
    | 'resourceId'
    | 'expirationDate'
  >;
  referencingGroupsContents: Maybe<
    Array<{ flatData: Pick<GroupsFlatDataDto, 'active'> }>
  >;
};

export type FetchCalendarQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchCalendarQuery = {
  findCalendarsContent: Maybe<
    Pick<Calendars, 'id' | 'created' | 'lastModified' | 'version'> & {
      flatData: Pick<
        CalendarsFlatDataDto,
        | 'googleCalendarId'
        | 'name'
        | 'color'
        | 'syncToken'
        | 'resourceId'
        | 'expirationDate'
      >;
      referencingGroupsContents: Maybe<
        Array<{ flatData: Pick<GroupsFlatDataDto, 'active'> }>
      >;
    }
  >;
};

export type FetchCalendarsQueryVariables = Exact<{
  top: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
  filter: InputMaybe<Scalars['String']>;
  order: InputMaybe<Scalars['String']>;
}>;

export type FetchCalendarsQuery = {
  queryCalendarsContentsWithTotal: Maybe<
    Pick<CalendarsResultDto, 'total'> & {
      items: Maybe<
        Array<
          Pick<Calendars, 'id' | 'created' | 'lastModified' | 'version'> & {
            flatData: Pick<
              CalendarsFlatDataDto,
              | 'googleCalendarId'
              | 'name'
              | 'color'
              | 'syncToken'
              | 'resourceId'
              | 'expirationDate'
            >;
            referencingGroupsContents: Maybe<
              Array<{ flatData: Pick<GroupsFlatDataDto, 'active'> }>
            >;
          }
        >
      >;
    }
  >;
};

export type FetchDashboardQueryVariables = Exact<{ [key: string]: never }>;

export type FetchDashboardQuery = {
  queryDashboardContents: Maybe<
    Array<{
      flatData: {
        news: Maybe<
          Array<
            Pick<
              NewsAndEvents,
              'id' | 'created' | 'lastModified' | 'version'
            > & {
              flatData: Pick<
                NewsAndEventsFlatDataDto,
                | 'title'
                | 'shortText'
                | 'text'
                | 'type'
                | 'frequency'
                | 'link'
                | 'linkText'
              > & { thumbnail: Maybe<Array<Pick<Asset, 'id'>>> };
            }
          >
        >;
        pages: Maybe<
          Array<
            Pick<Pages, 'id' | 'created' | 'lastModified' | 'version'> & {
              flatData: Pick<
                PagesFlatDataDto,
                'path' | 'title' | 'shortText' | 'text' | 'link' | 'linkText'
              >;
            }
          >
        >;
      };
    }>
  >;
};

export type FetchDiscoverQueryVariables = Exact<{ [key: string]: never }>;

export type FetchDiscoverQuery = {
  queryDiscoverContents: Maybe<
    Array<{
      flatData: Pick<DiscoverFlatDataDto, 'aboutUs'> & {
        training: Maybe<
          Array<
            Pick<Tutorials, 'id' | 'created'> & {
              flatData: Pick<
                TutorialsFlatDataDto,
                'title' | 'shortText' | 'text' | 'link' | 'linkText'
              > & { thumbnail: Maybe<Array<Pick<Asset, 'id'>>> };
            }
          >
        >;
        workingGroups: Maybe<
          Array<
            Pick<
              NewsAndEvents,
              'id' | 'created' | 'lastModified' | 'version'
            > & {
              flatData: Pick<
                NewsAndEventsFlatDataDto,
                | 'title'
                | 'shortText'
                | 'text'
                | 'type'
                | 'frequency'
                | 'link'
                | 'linkText'
              > & { thumbnail: Maybe<Array<Pick<Asset, 'id'>>> };
            }
          >
        >;
        pages: Maybe<
          Array<
            Pick<Pages, 'id' | 'created' | 'lastModified' | 'version'> & {
              flatData: Pick<
                PagesFlatDataDto,
                'shortText' | 'text' | 'title' | 'link' | 'linkText'
              >;
            }
          >
        >;
        members: Maybe<
          Array<
            Pick<Users, 'id' | 'created' | 'lastModified' | 'version'> & {
              flatData: Pick<
                UsersFlatDataDto,
                | 'email'
                | 'firstName'
                | 'institution'
                | 'jobTitle'
                | 'lastModifiedDate'
                | 'lastName'
              > & { avatar: Maybe<Array<Pick<Asset, 'id'>>> };
            }
          >
        >;
        membersTeam: Maybe<Array<Pick<Teams, 'id'>>>;
        scientificAdvisoryBoard: Maybe<
          Array<
            Pick<Users, 'id' | 'created' | 'lastModified' | 'version'> & {
              flatData: Pick<
                UsersFlatDataDto,
                | 'email'
                | 'firstName'
                | 'institution'
                | 'jobTitle'
                | 'lastModifiedDate'
                | 'lastName'
              > & { avatar: Maybe<Array<Pick<Asset, 'id'>>> };
            }
          >
        >;
      };
    }>
  >;
};

export type EventContentFragment = Pick<
  Events,
  'id' | 'lastModified' | 'version' | 'created'
> & {
  flatData: Pick<
    EventsFlatDataDto,
    | 'description'
    | 'endDate'
    | 'endDateTimeZone'
    | 'startDate'
    | 'startDateTimeZone'
    | 'meetingLink'
    | 'hideMeetingLink'
    | 'eventLink'
    | 'status'
    | 'tags'
    | 'title'
    | 'notesPermanentlyUnavailable'
    | 'notes'
    | 'videoRecordingPermanentlyUnavailable'
    | 'videoRecording'
    | 'presentationPermanentlyUnavailable'
    | 'presentation'
    | 'meetingMaterialsPermanentlyUnavailable'
  > & {
    meetingMaterials: Maybe<
      Array<Pick<EventsDataMeetingMaterialsChildDto, 'url' | 'title'>>
    >;
    calendar: Maybe<
      Array<{
        flatData: Pick<
          CalendarsFlatDataDto,
          'googleCalendarId' | 'color' | 'name'
        >;
        referencingGroupsContents: Maybe<
          Array<
            Pick<Groups, 'id' | 'created' | 'lastModified' | 'version'> & {
              flatData: Pick<
                GroupsFlatDataDto,
                'name' | 'active' | 'description' | 'tags'
              > & {
                tools: Maybe<
                  Array<Pick<GroupsDataToolsChildDto, 'slack' | 'googleDrive'>>
                >;
                teams: Maybe<
                  Array<
                    Pick<
                      Teams,
                      'id' | 'created' | 'lastModified' | 'version'
                    > & {
                      flatData: Pick<
                        TeamsFlatDataDto,
                        | 'applicationNumber'
                        | 'displayName'
                        | 'inactiveSince'
                        | 'projectSummary'
                        | 'projectTitle'
                        | 'expertiseAndResourceTags'
                      > & {
                        proposal: Maybe<Array<Pick<ResearchOutputs, 'id'>>>;
                        tools: Maybe<
                          Array<
                            Pick<
                              TeamsDataToolsChildDto,
                              'description' | 'name' | 'url'
                            >
                          >
                        >;
                        outputs: Maybe<Array<Pick<ResearchOutputs, 'id'>>>;
                      };
                      referencingUsersContents: Maybe<
                        Array<
                          Pick<
                            Users,
                            'id' | 'created' | 'lastModified' | 'version'
                          > & {
                            flatData: Pick<
                              UsersFlatDataDto,
                              | 'biography'
                              | 'degree'
                              | 'email'
                              | 'contactEmail'
                              | 'firstName'
                              | 'institution'
                              | 'jobTitle'
                              | 'lastModifiedDate'
                              | 'lastName'
                              | 'country'
                              | 'city'
                              | 'onboarded'
                              | 'orcid'
                              | 'orcidLastModifiedDate'
                              | 'orcidLastSyncDate'
                              | 'expertiseAndResourceTags'
                              | 'expertiseAndResourceDescription'
                              | 'role'
                              | 'responsibilities'
                              | 'researchInterests'
                              | 'reachOut'
                            > & {
                              avatar: Maybe<Array<Pick<Asset, 'id'>>>;
                              orcidWorks: Maybe<
                                Array<
                                  Pick<
                                    UsersDataOrcidWorksChildDto,
                                    | 'doi'
                                    | 'id'
                                    | 'lastModifiedDate'
                                    | 'publicationDate'
                                    | 'title'
                                    | 'type'
                                  >
                                >
                              >;
                              questions: Maybe<
                                Array<
                                  Pick<UsersDataQuestionsChildDto, 'question'>
                                >
                              >;
                              teams: Maybe<
                                Array<
                                  Pick<UsersDataTeamsChildDto, 'role'> & {
                                    id: Maybe<
                                      Array<
                                        Pick<Teams, 'id'> & {
                                          flatData: Pick<
                                            TeamsFlatDataDto,
                                            'displayName'
                                          > & {
                                            proposal: Maybe<
                                              Array<Pick<ResearchOutputs, 'id'>>
                                            >;
                                          };
                                        }
                                      >
                                    >;
                                  }
                                >
                              >;
                              social: Maybe<
                                Array<
                                  Pick<
                                    UsersDataSocialChildDto,
                                    | 'github'
                                    | 'googleScholar'
                                    | 'linkedIn'
                                    | 'researcherId'
                                    | 'researchGate'
                                    | 'twitter'
                                    | 'website1'
                                    | 'website2'
                                  >
                                >
                              >;
                              labs: Maybe<
                                Array<
                                  Pick<Labs, 'id'> & {
                                    flatData: Pick<LabsFlatDataDto, 'name'>;
                                  }
                                >
                              >;
                            };
                          }
                        >
                      >;
                    }
                  >
                >;
                leaders: Maybe<
                  Array<
                    Pick<GroupsDataLeadersChildDto, 'role'> & {
                      user: Maybe<
                        Array<
                          Pick<
                            Users,
                            'id' | 'created' | 'lastModified' | 'version'
                          > & {
                            flatData: Pick<
                              UsersFlatDataDto,
                              | 'biography'
                              | 'degree'
                              | 'email'
                              | 'contactEmail'
                              | 'firstName'
                              | 'institution'
                              | 'jobTitle'
                              | 'lastModifiedDate'
                              | 'lastName'
                              | 'country'
                              | 'city'
                              | 'onboarded'
                              | 'orcid'
                              | 'orcidLastModifiedDate'
                              | 'orcidLastSyncDate'
                              | 'expertiseAndResourceTags'
                              | 'expertiseAndResourceDescription'
                              | 'role'
                              | 'responsibilities'
                              | 'researchInterests'
                              | 'reachOut'
                            > & {
                              avatar: Maybe<Array<Pick<Asset, 'id'>>>;
                              orcidWorks: Maybe<
                                Array<
                                  Pick<
                                    UsersDataOrcidWorksChildDto,
                                    | 'doi'
                                    | 'id'
                                    | 'lastModifiedDate'
                                    | 'publicationDate'
                                    | 'title'
                                    | 'type'
                                  >
                                >
                              >;
                              questions: Maybe<
                                Array<
                                  Pick<UsersDataQuestionsChildDto, 'question'>
                                >
                              >;
                              teams: Maybe<
                                Array<
                                  Pick<UsersDataTeamsChildDto, 'role'> & {
                                    id: Maybe<
                                      Array<
                                        Pick<Teams, 'id'> & {
                                          flatData: Pick<
                                            TeamsFlatDataDto,
                                            'displayName'
                                          > & {
                                            proposal: Maybe<
                                              Array<Pick<ResearchOutputs, 'id'>>
                                            >;
                                          };
                                        }
                                      >
                                    >;
                                  }
                                >
                              >;
                              social: Maybe<
                                Array<
                                  Pick<
                                    UsersDataSocialChildDto,
                                    | 'github'
                                    | 'googleScholar'
                                    | 'linkedIn'
                                    | 'researcherId'
                                    | 'researchGate'
                                    | 'twitter'
                                    | 'website1'
                                    | 'website2'
                                  >
                                >
                              >;
                              labs: Maybe<
                                Array<
                                  Pick<Labs, 'id'> & {
                                    flatData: Pick<LabsFlatDataDto, 'name'>;
                                  }
                                >
                              >;
                            };
                          }
                        >
                      >;
                    }
                  >
                >;
                calendars: Maybe<
                  Array<
                    Pick<Calendars, 'id'> & {
                      flatData: Pick<
                        CalendarsFlatDataDto,
                        'color' | 'googleCalendarId' | 'name'
                      >;
                    }
                  >
                >;
                thumbnail: Maybe<Array<Pick<Asset, 'id'>>>;
              };
            }
          >
        >;
      }>
    >;
    thumbnail: Maybe<Array<Pick<Asset, 'id'>>>;
    speakers: Maybe<
      Array<{
        team: Maybe<
          Array<
            Pick<Teams, 'id'> & {
              flatData: Pick<TeamsFlatDataDto, 'displayName'>;
            }
          >
        >;
        user: Maybe<
          Array<
            | ({ __typename: 'ExternalAuthors' } & Pick<
                ExternalAuthors,
                'id'
              > & {
                  flatData: Pick<ExternalAuthorsFlatDataDto, 'name' | 'orcid'>;
                })
            | ({ __typename: 'Users' } & Pick<Users, 'id'> & {
                  flatData: Pick<
                    UsersFlatDataDto,
                    'firstName' | 'lastName' | 'onboarded'
                  > & {
                    avatar: Maybe<Array<Pick<Asset, 'id'>>>;
                    teams: Maybe<
                      Array<
                        Pick<UsersDataTeamsChildDto, 'role'> & {
                          id: Maybe<Array<Pick<Teams, 'id'>>>;
                        }
                      >
                    >;
                  };
                })
          >
        >;
      }>
    >;
  };
};

export type FetchEventsQueryVariables = Exact<{
  top: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
  filter: InputMaybe<Scalars['String']>;
  order: InputMaybe<Scalars['String']>;
}>;

export type FetchEventsQuery = {
  queryEventsContentsWithTotal: Maybe<
    Pick<EventsResultDto, 'total'> & {
      items: Maybe<
        Array<
          Pick<Events, 'id' | 'lastModified' | 'version' | 'created'> & {
            flatData: Pick<
              EventsFlatDataDto,
              | 'description'
              | 'endDate'
              | 'endDateTimeZone'
              | 'startDate'
              | 'startDateTimeZone'
              | 'meetingLink'
              | 'hideMeetingLink'
              | 'eventLink'
              | 'status'
              | 'tags'
              | 'title'
              | 'notesPermanentlyUnavailable'
              | 'notes'
              | 'videoRecordingPermanentlyUnavailable'
              | 'videoRecording'
              | 'presentationPermanentlyUnavailable'
              | 'presentation'
              | 'meetingMaterialsPermanentlyUnavailable'
            > & {
              meetingMaterials: Maybe<
                Array<Pick<EventsDataMeetingMaterialsChildDto, 'url' | 'title'>>
              >;
              calendar: Maybe<
                Array<{
                  flatData: Pick<
                    CalendarsFlatDataDto,
                    'googleCalendarId' | 'color' | 'name'
                  >;
                  referencingGroupsContents: Maybe<
                    Array<
                      Pick<
                        Groups,
                        'id' | 'created' | 'lastModified' | 'version'
                      > & {
                        flatData: Pick<
                          GroupsFlatDataDto,
                          'name' | 'active' | 'description' | 'tags'
                        > & {
                          tools: Maybe<
                            Array<
                              Pick<
                                GroupsDataToolsChildDto,
                                'slack' | 'googleDrive'
                              >
                            >
                          >;
                          teams: Maybe<
                            Array<
                              Pick<
                                Teams,
                                'id' | 'created' | 'lastModified' | 'version'
                              > & {
                                flatData: Pick<
                                  TeamsFlatDataDto,
                                  | 'applicationNumber'
                                  | 'displayName'
                                  | 'inactiveSince'
                                  | 'projectSummary'
                                  | 'projectTitle'
                                  | 'expertiseAndResourceTags'
                                > & {
                                  proposal: Maybe<
                                    Array<Pick<ResearchOutputs, 'id'>>
                                  >;
                                  tools: Maybe<
                                    Array<
                                      Pick<
                                        TeamsDataToolsChildDto,
                                        'description' | 'name' | 'url'
                                      >
                                    >
                                  >;
                                  outputs: Maybe<
                                    Array<Pick<ResearchOutputs, 'id'>>
                                  >;
                                };
                                referencingUsersContents: Maybe<
                                  Array<
                                    Pick<
                                      Users,
                                      | 'id'
                                      | 'created'
                                      | 'lastModified'
                                      | 'version'
                                    > & {
                                      flatData: Pick<
                                        UsersFlatDataDto,
                                        | 'biography'
                                        | 'degree'
                                        | 'email'
                                        | 'contactEmail'
                                        | 'firstName'
                                        | 'institution'
                                        | 'jobTitle'
                                        | 'lastModifiedDate'
                                        | 'lastName'
                                        | 'country'
                                        | 'city'
                                        | 'onboarded'
                                        | 'orcid'
                                        | 'orcidLastModifiedDate'
                                        | 'orcidLastSyncDate'
                                        | 'expertiseAndResourceTags'
                                        | 'expertiseAndResourceDescription'
                                        | 'role'
                                        | 'responsibilities'
                                        | 'researchInterests'
                                        | 'reachOut'
                                      > & {
                                        avatar: Maybe<Array<Pick<Asset, 'id'>>>;
                                        orcidWorks: Maybe<
                                          Array<
                                            Pick<
                                              UsersDataOrcidWorksChildDto,
                                              | 'doi'
                                              | 'id'
                                              | 'lastModifiedDate'
                                              | 'publicationDate'
                                              | 'title'
                                              | 'type'
                                            >
                                          >
                                        >;
                                        questions: Maybe<
                                          Array<
                                            Pick<
                                              UsersDataQuestionsChildDto,
                                              'question'
                                            >
                                          >
                                        >;
                                        teams: Maybe<
                                          Array<
                                            Pick<
                                              UsersDataTeamsChildDto,
                                              'role'
                                            > & {
                                              id: Maybe<
                                                Array<
                                                  Pick<Teams, 'id'> & {
                                                    flatData: Pick<
                                                      TeamsFlatDataDto,
                                                      'displayName'
                                                    > & {
                                                      proposal: Maybe<
                                                        Array<
                                                          Pick<
                                                            ResearchOutputs,
                                                            'id'
                                                          >
                                                        >
                                                      >;
                                                    };
                                                  }
                                                >
                                              >;
                                            }
                                          >
                                        >;
                                        social: Maybe<
                                          Array<
                                            Pick<
                                              UsersDataSocialChildDto,
                                              | 'github'
                                              | 'googleScholar'
                                              | 'linkedIn'
                                              | 'researcherId'
                                              | 'researchGate'
                                              | 'twitter'
                                              | 'website1'
                                              | 'website2'
                                            >
                                          >
                                        >;
                                        labs: Maybe<
                                          Array<
                                            Pick<Labs, 'id'> & {
                                              flatData: Pick<
                                                LabsFlatDataDto,
                                                'name'
                                              >;
                                            }
                                          >
                                        >;
                                      };
                                    }
                                  >
                                >;
                              }
                            >
                          >;
                          leaders: Maybe<
                            Array<
                              Pick<GroupsDataLeadersChildDto, 'role'> & {
                                user: Maybe<
                                  Array<
                                    Pick<
                                      Users,
                                      | 'id'
                                      | 'created'
                                      | 'lastModified'
                                      | 'version'
                                    > & {
                                      flatData: Pick<
                                        UsersFlatDataDto,
                                        | 'biography'
                                        | 'degree'
                                        | 'email'
                                        | 'contactEmail'
                                        | 'firstName'
                                        | 'institution'
                                        | 'jobTitle'
                                        | 'lastModifiedDate'
                                        | 'lastName'
                                        | 'country'
                                        | 'city'
                                        | 'onboarded'
                                        | 'orcid'
                                        | 'orcidLastModifiedDate'
                                        | 'orcidLastSyncDate'
                                        | 'expertiseAndResourceTags'
                                        | 'expertiseAndResourceDescription'
                                        | 'role'
                                        | 'responsibilities'
                                        | 'researchInterests'
                                        | 'reachOut'
                                      > & {
                                        avatar: Maybe<Array<Pick<Asset, 'id'>>>;
                                        orcidWorks: Maybe<
                                          Array<
                                            Pick<
                                              UsersDataOrcidWorksChildDto,
                                              | 'doi'
                                              | 'id'
                                              | 'lastModifiedDate'
                                              | 'publicationDate'
                                              | 'title'
                                              | 'type'
                                            >
                                          >
                                        >;
                                        questions: Maybe<
                                          Array<
                                            Pick<
                                              UsersDataQuestionsChildDto,
                                              'question'
                                            >
                                          >
                                        >;
                                        teams: Maybe<
                                          Array<
                                            Pick<
                                              UsersDataTeamsChildDto,
                                              'role'
                                            > & {
                                              id: Maybe<
                                                Array<
                                                  Pick<Teams, 'id'> & {
                                                    flatData: Pick<
                                                      TeamsFlatDataDto,
                                                      'displayName'
                                                    > & {
                                                      proposal: Maybe<
                                                        Array<
                                                          Pick<
                                                            ResearchOutputs,
                                                            'id'
                                                          >
                                                        >
                                                      >;
                                                    };
                                                  }
                                                >
                                              >;
                                            }
                                          >
                                        >;
                                        social: Maybe<
                                          Array<
                                            Pick<
                                              UsersDataSocialChildDto,
                                              | 'github'
                                              | 'googleScholar'
                                              | 'linkedIn'
                                              | 'researcherId'
                                              | 'researchGate'
                                              | 'twitter'
                                              | 'website1'
                                              | 'website2'
                                            >
                                          >
                                        >;
                                        labs: Maybe<
                                          Array<
                                            Pick<Labs, 'id'> & {
                                              flatData: Pick<
                                                LabsFlatDataDto,
                                                'name'
                                              >;
                                            }
                                          >
                                        >;
                                      };
                                    }
                                  >
                                >;
                              }
                            >
                          >;
                          calendars: Maybe<
                            Array<
                              Pick<Calendars, 'id'> & {
                                flatData: Pick<
                                  CalendarsFlatDataDto,
                                  'color' | 'googleCalendarId' | 'name'
                                >;
                              }
                            >
                          >;
                          thumbnail: Maybe<Array<Pick<Asset, 'id'>>>;
                        };
                      }
                    >
                  >;
                }>
              >;
              thumbnail: Maybe<Array<Pick<Asset, 'id'>>>;
              speakers: Maybe<
                Array<{
                  team: Maybe<
                    Array<
                      Pick<Teams, 'id'> & {
                        flatData: Pick<TeamsFlatDataDto, 'displayName'>;
                      }
                    >
                  >;
                  user: Maybe<
                    Array<
                      | ({ __typename: 'ExternalAuthors' } & Pick<
                          ExternalAuthors,
                          'id'
                        > & {
                            flatData: Pick<
                              ExternalAuthorsFlatDataDto,
                              'name' | 'orcid'
                            >;
                          })
                      | ({ __typename: 'Users' } & Pick<Users, 'id'> & {
                            flatData: Pick<
                              UsersFlatDataDto,
                              'firstName' | 'lastName' | 'onboarded'
                            > & {
                              avatar: Maybe<Array<Pick<Asset, 'id'>>>;
                              teams: Maybe<
                                Array<
                                  Pick<UsersDataTeamsChildDto, 'role'> & {
                                    id: Maybe<Array<Pick<Teams, 'id'>>>;
                                  }
                                >
                              >;
                            };
                          })
                    >
                  >;
                }>
              >;
            };
          }
        >
      >;
    }
  >;
};

export type FetchEventQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchEventQuery = {
  findEventsContent: Maybe<
    Pick<Events, 'id' | 'lastModified' | 'version' | 'created'> & {
      flatData: Pick<
        EventsFlatDataDto,
        | 'description'
        | 'endDate'
        | 'endDateTimeZone'
        | 'startDate'
        | 'startDateTimeZone'
        | 'meetingLink'
        | 'hideMeetingLink'
        | 'eventLink'
        | 'status'
        | 'tags'
        | 'title'
        | 'notesPermanentlyUnavailable'
        | 'notes'
        | 'videoRecordingPermanentlyUnavailable'
        | 'videoRecording'
        | 'presentationPermanentlyUnavailable'
        | 'presentation'
        | 'meetingMaterialsPermanentlyUnavailable'
      > & {
        meetingMaterials: Maybe<
          Array<Pick<EventsDataMeetingMaterialsChildDto, 'url' | 'title'>>
        >;
        calendar: Maybe<
          Array<{
            flatData: Pick<
              CalendarsFlatDataDto,
              'googleCalendarId' | 'color' | 'name'
            >;
            referencingGroupsContents: Maybe<
              Array<
                Pick<Groups, 'id' | 'created' | 'lastModified' | 'version'> & {
                  flatData: Pick<
                    GroupsFlatDataDto,
                    'name' | 'active' | 'description' | 'tags'
                  > & {
                    tools: Maybe<
                      Array<
                        Pick<GroupsDataToolsChildDto, 'slack' | 'googleDrive'>
                      >
                    >;
                    teams: Maybe<
                      Array<
                        Pick<
                          Teams,
                          'id' | 'created' | 'lastModified' | 'version'
                        > & {
                          flatData: Pick<
                            TeamsFlatDataDto,
                            | 'applicationNumber'
                            | 'displayName'
                            | 'inactiveSince'
                            | 'projectSummary'
                            | 'projectTitle'
                            | 'expertiseAndResourceTags'
                          > & {
                            proposal: Maybe<Array<Pick<ResearchOutputs, 'id'>>>;
                            tools: Maybe<
                              Array<
                                Pick<
                                  TeamsDataToolsChildDto,
                                  'description' | 'name' | 'url'
                                >
                              >
                            >;
                            outputs: Maybe<Array<Pick<ResearchOutputs, 'id'>>>;
                          };
                          referencingUsersContents: Maybe<
                            Array<
                              Pick<
                                Users,
                                'id' | 'created' | 'lastModified' | 'version'
                              > & {
                                flatData: Pick<
                                  UsersFlatDataDto,
                                  | 'biography'
                                  | 'degree'
                                  | 'email'
                                  | 'contactEmail'
                                  | 'firstName'
                                  | 'institution'
                                  | 'jobTitle'
                                  | 'lastModifiedDate'
                                  | 'lastName'
                                  | 'country'
                                  | 'city'
                                  | 'onboarded'
                                  | 'orcid'
                                  | 'orcidLastModifiedDate'
                                  | 'orcidLastSyncDate'
                                  | 'expertiseAndResourceTags'
                                  | 'expertiseAndResourceDescription'
                                  | 'role'
                                  | 'responsibilities'
                                  | 'researchInterests'
                                  | 'reachOut'
                                > & {
                                  avatar: Maybe<Array<Pick<Asset, 'id'>>>;
                                  orcidWorks: Maybe<
                                    Array<
                                      Pick<
                                        UsersDataOrcidWorksChildDto,
                                        | 'doi'
                                        | 'id'
                                        | 'lastModifiedDate'
                                        | 'publicationDate'
                                        | 'title'
                                        | 'type'
                                      >
                                    >
                                  >;
                                  questions: Maybe<
                                    Array<
                                      Pick<
                                        UsersDataQuestionsChildDto,
                                        'question'
                                      >
                                    >
                                  >;
                                  teams: Maybe<
                                    Array<
                                      Pick<UsersDataTeamsChildDto, 'role'> & {
                                        id: Maybe<
                                          Array<
                                            Pick<Teams, 'id'> & {
                                              flatData: Pick<
                                                TeamsFlatDataDto,
                                                'displayName'
                                              > & {
                                                proposal: Maybe<
                                                  Array<
                                                    Pick<ResearchOutputs, 'id'>
                                                  >
                                                >;
                                              };
                                            }
                                          >
                                        >;
                                      }
                                    >
                                  >;
                                  social: Maybe<
                                    Array<
                                      Pick<
                                        UsersDataSocialChildDto,
                                        | 'github'
                                        | 'googleScholar'
                                        | 'linkedIn'
                                        | 'researcherId'
                                        | 'researchGate'
                                        | 'twitter'
                                        | 'website1'
                                        | 'website2'
                                      >
                                    >
                                  >;
                                  labs: Maybe<
                                    Array<
                                      Pick<Labs, 'id'> & {
                                        flatData: Pick<LabsFlatDataDto, 'name'>;
                                      }
                                    >
                                  >;
                                };
                              }
                            >
                          >;
                        }
                      >
                    >;
                    leaders: Maybe<
                      Array<
                        Pick<GroupsDataLeadersChildDto, 'role'> & {
                          user: Maybe<
                            Array<
                              Pick<
                                Users,
                                'id' | 'created' | 'lastModified' | 'version'
                              > & {
                                flatData: Pick<
                                  UsersFlatDataDto,
                                  | 'biography'
                                  | 'degree'
                                  | 'email'
                                  | 'contactEmail'
                                  | 'firstName'
                                  | 'institution'
                                  | 'jobTitle'
                                  | 'lastModifiedDate'
                                  | 'lastName'
                                  | 'country'
                                  | 'city'
                                  | 'onboarded'
                                  | 'orcid'
                                  | 'orcidLastModifiedDate'
                                  | 'orcidLastSyncDate'
                                  | 'expertiseAndResourceTags'
                                  | 'expertiseAndResourceDescription'
                                  | 'role'
                                  | 'responsibilities'
                                  | 'researchInterests'
                                  | 'reachOut'
                                > & {
                                  avatar: Maybe<Array<Pick<Asset, 'id'>>>;
                                  orcidWorks: Maybe<
                                    Array<
                                      Pick<
                                        UsersDataOrcidWorksChildDto,
                                        | 'doi'
                                        | 'id'
                                        | 'lastModifiedDate'
                                        | 'publicationDate'
                                        | 'title'
                                        | 'type'
                                      >
                                    >
                                  >;
                                  questions: Maybe<
                                    Array<
                                      Pick<
                                        UsersDataQuestionsChildDto,
                                        'question'
                                      >
                                    >
                                  >;
                                  teams: Maybe<
                                    Array<
                                      Pick<UsersDataTeamsChildDto, 'role'> & {
                                        id: Maybe<
                                          Array<
                                            Pick<Teams, 'id'> & {
                                              flatData: Pick<
                                                TeamsFlatDataDto,
                                                'displayName'
                                              > & {
                                                proposal: Maybe<
                                                  Array<
                                                    Pick<ResearchOutputs, 'id'>
                                                  >
                                                >;
                                              };
                                            }
                                          >
                                        >;
                                      }
                                    >
                                  >;
                                  social: Maybe<
                                    Array<
                                      Pick<
                                        UsersDataSocialChildDto,
                                        | 'github'
                                        | 'googleScholar'
                                        | 'linkedIn'
                                        | 'researcherId'
                                        | 'researchGate'
                                        | 'twitter'
                                        | 'website1'
                                        | 'website2'
                                      >
                                    >
                                  >;
                                  labs: Maybe<
                                    Array<
                                      Pick<Labs, 'id'> & {
                                        flatData: Pick<LabsFlatDataDto, 'name'>;
                                      }
                                    >
                                  >;
                                };
                              }
                            >
                          >;
                        }
                      >
                    >;
                    calendars: Maybe<
                      Array<
                        Pick<Calendars, 'id'> & {
                          flatData: Pick<
                            CalendarsFlatDataDto,
                            'color' | 'googleCalendarId' | 'name'
                          >;
                        }
                      >
                    >;
                    thumbnail: Maybe<Array<Pick<Asset, 'id'>>>;
                  };
                }
              >
            >;
          }>
        >;
        thumbnail: Maybe<Array<Pick<Asset, 'id'>>>;
        speakers: Maybe<
          Array<{
            team: Maybe<
              Array<
                Pick<Teams, 'id'> & {
                  flatData: Pick<TeamsFlatDataDto, 'displayName'>;
                }
              >
            >;
            user: Maybe<
              Array<
                | ({ __typename: 'ExternalAuthors' } & Pick<
                    ExternalAuthors,
                    'id'
                  > & {
                      flatData: Pick<
                        ExternalAuthorsFlatDataDto,
                        'name' | 'orcid'
                      >;
                    })
                | ({ __typename: 'Users' } & Pick<Users, 'id'> & {
                      flatData: Pick<
                        UsersFlatDataDto,
                        'firstName' | 'lastName' | 'onboarded'
                      > & {
                        avatar: Maybe<Array<Pick<Asset, 'id'>>>;
                        teams: Maybe<
                          Array<
                            Pick<UsersDataTeamsChildDto, 'role'> & {
                              id: Maybe<Array<Pick<Teams, 'id'>>>;
                            }
                          >
                        >;
                      };
                    })
              >
            >;
          }>
        >;
      };
    }
  >;
};

export type FetchGroupCalendarQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchGroupCalendarQuery = {
  findGroupsContent: Maybe<{
    flatData: { calendars: Maybe<Array<Pick<Calendars, 'id'>>> };
  }>;
};

export type ExternalAuthorsContentFragment = Pick<
  ExternalAuthors,
  'id' | 'created' | 'lastModified' | 'version'
> & { flatData: Pick<ExternalAuthorsFlatDataDto, 'name' | 'orcid'> };

export type FetchExternalAuthorQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchExternalAuthorQuery = {
  findExternalAuthorsContent: Maybe<
    Pick<ExternalAuthors, 'id' | 'created' | 'lastModified' | 'version'> & {
      flatData: Pick<ExternalAuthorsFlatDataDto, 'name' | 'orcid'>;
    }
  >;
};

export type FetchExternalAuthorsQueryVariables = Exact<{
  top: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
}>;

export type FetchExternalAuthorsQuery = {
  queryExternalAuthorsContentsWithTotal: Maybe<
    Pick<ExternalAuthorsResultDto, 'total'> & {
      items: Maybe<
        Array<
          Pick<
            ExternalAuthors,
            'id' | 'created' | 'lastModified' | 'version'
          > & { flatData: Pick<ExternalAuthorsFlatDataDto, 'name' | 'orcid'> }
        >
      >;
    }
  >;
};

export type GroupsContentFragment = Pick<
  Groups,
  'id' | 'created' | 'lastModified' | 'version'
> & {
  flatData: Pick<
    GroupsFlatDataDto,
    'name' | 'active' | 'description' | 'tags'
  > & {
    tools: Maybe<Array<Pick<GroupsDataToolsChildDto, 'slack' | 'googleDrive'>>>;
    teams: Maybe<
      Array<
        Pick<Teams, 'id' | 'created' | 'lastModified' | 'version'> & {
          flatData: Pick<
            TeamsFlatDataDto,
            | 'applicationNumber'
            | 'displayName'
            | 'inactiveSince'
            | 'projectSummary'
            | 'projectTitle'
            | 'expertiseAndResourceTags'
          > & {
            proposal: Maybe<Array<Pick<ResearchOutputs, 'id'>>>;
            tools: Maybe<
              Array<
                Pick<TeamsDataToolsChildDto, 'description' | 'name' | 'url'>
              >
            >;
            outputs: Maybe<Array<Pick<ResearchOutputs, 'id'>>>;
          };
          referencingUsersContents: Maybe<
            Array<
              Pick<Users, 'id' | 'created' | 'lastModified' | 'version'> & {
                flatData: Pick<
                  UsersFlatDataDto,
                  | 'biography'
                  | 'degree'
                  | 'email'
                  | 'contactEmail'
                  | 'firstName'
                  | 'institution'
                  | 'jobTitle'
                  | 'lastModifiedDate'
                  | 'lastName'
                  | 'country'
                  | 'city'
                  | 'onboarded'
                  | 'orcid'
                  | 'orcidLastModifiedDate'
                  | 'orcidLastSyncDate'
                  | 'expertiseAndResourceTags'
                  | 'expertiseAndResourceDescription'
                  | 'role'
                  | 'responsibilities'
                  | 'researchInterests'
                  | 'reachOut'
                > & {
                  avatar: Maybe<Array<Pick<Asset, 'id'>>>;
                  orcidWorks: Maybe<
                    Array<
                      Pick<
                        UsersDataOrcidWorksChildDto,
                        | 'doi'
                        | 'id'
                        | 'lastModifiedDate'
                        | 'publicationDate'
                        | 'title'
                        | 'type'
                      >
                    >
                  >;
                  questions: Maybe<
                    Array<Pick<UsersDataQuestionsChildDto, 'question'>>
                  >;
                  teams: Maybe<
                    Array<
                      Pick<UsersDataTeamsChildDto, 'role'> & {
                        id: Maybe<
                          Array<
                            Pick<Teams, 'id'> & {
                              flatData: Pick<
                                TeamsFlatDataDto,
                                'displayName'
                              > & {
                                proposal: Maybe<
                                  Array<Pick<ResearchOutputs, 'id'>>
                                >;
                              };
                            }
                          >
                        >;
                      }
                    >
                  >;
                  social: Maybe<
                    Array<
                      Pick<
                        UsersDataSocialChildDto,
                        | 'github'
                        | 'googleScholar'
                        | 'linkedIn'
                        | 'researcherId'
                        | 'researchGate'
                        | 'twitter'
                        | 'website1'
                        | 'website2'
                      >
                    >
                  >;
                  labs: Maybe<
                    Array<
                      Pick<Labs, 'id'> & {
                        flatData: Pick<LabsFlatDataDto, 'name'>;
                      }
                    >
                  >;
                };
              }
            >
          >;
        }
      >
    >;
    leaders: Maybe<
      Array<
        Pick<GroupsDataLeadersChildDto, 'role'> & {
          user: Maybe<
            Array<
              Pick<Users, 'id' | 'created' | 'lastModified' | 'version'> & {
                flatData: Pick<
                  UsersFlatDataDto,
                  | 'biography'
                  | 'degree'
                  | 'email'
                  | 'contactEmail'
                  | 'firstName'
                  | 'institution'
                  | 'jobTitle'
                  | 'lastModifiedDate'
                  | 'lastName'
                  | 'country'
                  | 'city'
                  | 'onboarded'
                  | 'orcid'
                  | 'orcidLastModifiedDate'
                  | 'orcidLastSyncDate'
                  | 'expertiseAndResourceTags'
                  | 'expertiseAndResourceDescription'
                  | 'role'
                  | 'responsibilities'
                  | 'researchInterests'
                  | 'reachOut'
                > & {
                  avatar: Maybe<Array<Pick<Asset, 'id'>>>;
                  orcidWorks: Maybe<
                    Array<
                      Pick<
                        UsersDataOrcidWorksChildDto,
                        | 'doi'
                        | 'id'
                        | 'lastModifiedDate'
                        | 'publicationDate'
                        | 'title'
                        | 'type'
                      >
                    >
                  >;
                  questions: Maybe<
                    Array<Pick<UsersDataQuestionsChildDto, 'question'>>
                  >;
                  teams: Maybe<
                    Array<
                      Pick<UsersDataTeamsChildDto, 'role'> & {
                        id: Maybe<
                          Array<
                            Pick<Teams, 'id'> & {
                              flatData: Pick<
                                TeamsFlatDataDto,
                                'displayName'
                              > & {
                                proposal: Maybe<
                                  Array<Pick<ResearchOutputs, 'id'>>
                                >;
                              };
                            }
                          >
                        >;
                      }
                    >
                  >;
                  social: Maybe<
                    Array<
                      Pick<
                        UsersDataSocialChildDto,
                        | 'github'
                        | 'googleScholar'
                        | 'linkedIn'
                        | 'researcherId'
                        | 'researchGate'
                        | 'twitter'
                        | 'website1'
                        | 'website2'
                      >
                    >
                  >;
                  labs: Maybe<
                    Array<
                      Pick<Labs, 'id'> & {
                        flatData: Pick<LabsFlatDataDto, 'name'>;
                      }
                    >
                  >;
                };
              }
            >
          >;
        }
      >
    >;
    calendars: Maybe<
      Array<
        Pick<Calendars, 'id'> & {
          flatData: Pick<
            CalendarsFlatDataDto,
            'color' | 'googleCalendarId' | 'name'
          >;
        }
      >
    >;
    thumbnail: Maybe<Array<Pick<Asset, 'id'>>>;
  };
};

export type FetchGroupsQueryVariables = Exact<{
  top: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
  filter: InputMaybe<Scalars['String']>;
}>;

export type FetchGroupsQuery = {
  queryGroupsContentsWithTotal: Maybe<
    Pick<GroupsResultDto, 'total'> & {
      items: Maybe<
        Array<
          Pick<Groups, 'id' | 'created' | 'lastModified' | 'version'> & {
            flatData: Pick<
              GroupsFlatDataDto,
              'name' | 'active' | 'description' | 'tags'
            > & {
              tools: Maybe<
                Array<Pick<GroupsDataToolsChildDto, 'slack' | 'googleDrive'>>
              >;
              teams: Maybe<
                Array<
                  Pick<Teams, 'id' | 'created' | 'lastModified' | 'version'> & {
                    flatData: Pick<
                      TeamsFlatDataDto,
                      | 'applicationNumber'
                      | 'displayName'
                      | 'inactiveSince'
                      | 'projectSummary'
                      | 'projectTitle'
                      | 'expertiseAndResourceTags'
                    > & {
                      proposal: Maybe<Array<Pick<ResearchOutputs, 'id'>>>;
                      tools: Maybe<
                        Array<
                          Pick<
                            TeamsDataToolsChildDto,
                            'description' | 'name' | 'url'
                          >
                        >
                      >;
                      outputs: Maybe<Array<Pick<ResearchOutputs, 'id'>>>;
                    };
                    referencingUsersContents: Maybe<
                      Array<
                        Pick<
                          Users,
                          'id' | 'created' | 'lastModified' | 'version'
                        > & {
                          flatData: Pick<
                            UsersFlatDataDto,
                            | 'biography'
                            | 'degree'
                            | 'email'
                            | 'contactEmail'
                            | 'firstName'
                            | 'institution'
                            | 'jobTitle'
                            | 'lastModifiedDate'
                            | 'lastName'
                            | 'country'
                            | 'city'
                            | 'onboarded'
                            | 'orcid'
                            | 'orcidLastModifiedDate'
                            | 'orcidLastSyncDate'
                            | 'expertiseAndResourceTags'
                            | 'expertiseAndResourceDescription'
                            | 'role'
                            | 'responsibilities'
                            | 'researchInterests'
                            | 'reachOut'
                          > & {
                            avatar: Maybe<Array<Pick<Asset, 'id'>>>;
                            orcidWorks: Maybe<
                              Array<
                                Pick<
                                  UsersDataOrcidWorksChildDto,
                                  | 'doi'
                                  | 'id'
                                  | 'lastModifiedDate'
                                  | 'publicationDate'
                                  | 'title'
                                  | 'type'
                                >
                              >
                            >;
                            questions: Maybe<
                              Array<
                                Pick<UsersDataQuestionsChildDto, 'question'>
                              >
                            >;
                            teams: Maybe<
                              Array<
                                Pick<UsersDataTeamsChildDto, 'role'> & {
                                  id: Maybe<
                                    Array<
                                      Pick<Teams, 'id'> & {
                                        flatData: Pick<
                                          TeamsFlatDataDto,
                                          'displayName'
                                        > & {
                                          proposal: Maybe<
                                            Array<Pick<ResearchOutputs, 'id'>>
                                          >;
                                        };
                                      }
                                    >
                                  >;
                                }
                              >
                            >;
                            social: Maybe<
                              Array<
                                Pick<
                                  UsersDataSocialChildDto,
                                  | 'github'
                                  | 'googleScholar'
                                  | 'linkedIn'
                                  | 'researcherId'
                                  | 'researchGate'
                                  | 'twitter'
                                  | 'website1'
                                  | 'website2'
                                >
                              >
                            >;
                            labs: Maybe<
                              Array<
                                Pick<Labs, 'id'> & {
                                  flatData: Pick<LabsFlatDataDto, 'name'>;
                                }
                              >
                            >;
                          };
                        }
                      >
                    >;
                  }
                >
              >;
              leaders: Maybe<
                Array<
                  Pick<GroupsDataLeadersChildDto, 'role'> & {
                    user: Maybe<
                      Array<
                        Pick<
                          Users,
                          'id' | 'created' | 'lastModified' | 'version'
                        > & {
                          flatData: Pick<
                            UsersFlatDataDto,
                            | 'biography'
                            | 'degree'
                            | 'email'
                            | 'contactEmail'
                            | 'firstName'
                            | 'institution'
                            | 'jobTitle'
                            | 'lastModifiedDate'
                            | 'lastName'
                            | 'country'
                            | 'city'
                            | 'onboarded'
                            | 'orcid'
                            | 'orcidLastModifiedDate'
                            | 'orcidLastSyncDate'
                            | 'expertiseAndResourceTags'
                            | 'expertiseAndResourceDescription'
                            | 'role'
                            | 'responsibilities'
                            | 'researchInterests'
                            | 'reachOut'
                          > & {
                            avatar: Maybe<Array<Pick<Asset, 'id'>>>;
                            orcidWorks: Maybe<
                              Array<
                                Pick<
                                  UsersDataOrcidWorksChildDto,
                                  | 'doi'
                                  | 'id'
                                  | 'lastModifiedDate'
                                  | 'publicationDate'
                                  | 'title'
                                  | 'type'
                                >
                              >
                            >;
                            questions: Maybe<
                              Array<
                                Pick<UsersDataQuestionsChildDto, 'question'>
                              >
                            >;
                            teams: Maybe<
                              Array<
                                Pick<UsersDataTeamsChildDto, 'role'> & {
                                  id: Maybe<
                                    Array<
                                      Pick<Teams, 'id'> & {
                                        flatData: Pick<
                                          TeamsFlatDataDto,
                                          'displayName'
                                        > & {
                                          proposal: Maybe<
                                            Array<Pick<ResearchOutputs, 'id'>>
                                          >;
                                        };
                                      }
                                    >
                                  >;
                                }
                              >
                            >;
                            social: Maybe<
                              Array<
                                Pick<
                                  UsersDataSocialChildDto,
                                  | 'github'
                                  | 'googleScholar'
                                  | 'linkedIn'
                                  | 'researcherId'
                                  | 'researchGate'
                                  | 'twitter'
                                  | 'website1'
                                  | 'website2'
                                >
                              >
                            >;
                            labs: Maybe<
                              Array<
                                Pick<Labs, 'id'> & {
                                  flatData: Pick<LabsFlatDataDto, 'name'>;
                                }
                              >
                            >;
                          };
                        }
                      >
                    >;
                  }
                >
              >;
              calendars: Maybe<
                Array<
                  Pick<Calendars, 'id'> & {
                    flatData: Pick<
                      CalendarsFlatDataDto,
                      'color' | 'googleCalendarId' | 'name'
                    >;
                  }
                >
              >;
              thumbnail: Maybe<Array<Pick<Asset, 'id'>>>;
            };
          }
        >
      >;
    }
  >;
};

export type FetchGroupQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchGroupQuery = {
  findGroupsContent: Maybe<
    Pick<Groups, 'id' | 'created' | 'lastModified' | 'version'> & {
      flatData: Pick<
        GroupsFlatDataDto,
        'name' | 'active' | 'description' | 'tags'
      > & {
        tools: Maybe<
          Array<Pick<GroupsDataToolsChildDto, 'slack' | 'googleDrive'>>
        >;
        teams: Maybe<
          Array<
            Pick<Teams, 'id' | 'created' | 'lastModified' | 'version'> & {
              flatData: Pick<
                TeamsFlatDataDto,
                | 'applicationNumber'
                | 'displayName'
                | 'inactiveSince'
                | 'projectSummary'
                | 'projectTitle'
                | 'expertiseAndResourceTags'
              > & {
                proposal: Maybe<Array<Pick<ResearchOutputs, 'id'>>>;
                tools: Maybe<
                  Array<
                    Pick<TeamsDataToolsChildDto, 'description' | 'name' | 'url'>
                  >
                >;
                outputs: Maybe<Array<Pick<ResearchOutputs, 'id'>>>;
              };
              referencingUsersContents: Maybe<
                Array<
                  Pick<Users, 'id' | 'created' | 'lastModified' | 'version'> & {
                    flatData: Pick<
                      UsersFlatDataDto,
                      | 'biography'
                      | 'degree'
                      | 'email'
                      | 'contactEmail'
                      | 'firstName'
                      | 'institution'
                      | 'jobTitle'
                      | 'lastModifiedDate'
                      | 'lastName'
                      | 'country'
                      | 'city'
                      | 'onboarded'
                      | 'orcid'
                      | 'orcidLastModifiedDate'
                      | 'orcidLastSyncDate'
                      | 'expertiseAndResourceTags'
                      | 'expertiseAndResourceDescription'
                      | 'role'
                      | 'responsibilities'
                      | 'researchInterests'
                      | 'reachOut'
                    > & {
                      avatar: Maybe<Array<Pick<Asset, 'id'>>>;
                      orcidWorks: Maybe<
                        Array<
                          Pick<
                            UsersDataOrcidWorksChildDto,
                            | 'doi'
                            | 'id'
                            | 'lastModifiedDate'
                            | 'publicationDate'
                            | 'title'
                            | 'type'
                          >
                        >
                      >;
                      questions: Maybe<
                        Array<Pick<UsersDataQuestionsChildDto, 'question'>>
                      >;
                      teams: Maybe<
                        Array<
                          Pick<UsersDataTeamsChildDto, 'role'> & {
                            id: Maybe<
                              Array<
                                Pick<Teams, 'id'> & {
                                  flatData: Pick<
                                    TeamsFlatDataDto,
                                    'displayName'
                                  > & {
                                    proposal: Maybe<
                                      Array<Pick<ResearchOutputs, 'id'>>
                                    >;
                                  };
                                }
                              >
                            >;
                          }
                        >
                      >;
                      social: Maybe<
                        Array<
                          Pick<
                            UsersDataSocialChildDto,
                            | 'github'
                            | 'googleScholar'
                            | 'linkedIn'
                            | 'researcherId'
                            | 'researchGate'
                            | 'twitter'
                            | 'website1'
                            | 'website2'
                          >
                        >
                      >;
                      labs: Maybe<
                        Array<
                          Pick<Labs, 'id'> & {
                            flatData: Pick<LabsFlatDataDto, 'name'>;
                          }
                        >
                      >;
                    };
                  }
                >
              >;
            }
          >
        >;
        leaders: Maybe<
          Array<
            Pick<GroupsDataLeadersChildDto, 'role'> & {
              user: Maybe<
                Array<
                  Pick<Users, 'id' | 'created' | 'lastModified' | 'version'> & {
                    flatData: Pick<
                      UsersFlatDataDto,
                      | 'biography'
                      | 'degree'
                      | 'email'
                      | 'contactEmail'
                      | 'firstName'
                      | 'institution'
                      | 'jobTitle'
                      | 'lastModifiedDate'
                      | 'lastName'
                      | 'country'
                      | 'city'
                      | 'onboarded'
                      | 'orcid'
                      | 'orcidLastModifiedDate'
                      | 'orcidLastSyncDate'
                      | 'expertiseAndResourceTags'
                      | 'expertiseAndResourceDescription'
                      | 'role'
                      | 'responsibilities'
                      | 'researchInterests'
                      | 'reachOut'
                    > & {
                      avatar: Maybe<Array<Pick<Asset, 'id'>>>;
                      orcidWorks: Maybe<
                        Array<
                          Pick<
                            UsersDataOrcidWorksChildDto,
                            | 'doi'
                            | 'id'
                            | 'lastModifiedDate'
                            | 'publicationDate'
                            | 'title'
                            | 'type'
                          >
                        >
                      >;
                      questions: Maybe<
                        Array<Pick<UsersDataQuestionsChildDto, 'question'>>
                      >;
                      teams: Maybe<
                        Array<
                          Pick<UsersDataTeamsChildDto, 'role'> & {
                            id: Maybe<
                              Array<
                                Pick<Teams, 'id'> & {
                                  flatData: Pick<
                                    TeamsFlatDataDto,
                                    'displayName'
                                  > & {
                                    proposal: Maybe<
                                      Array<Pick<ResearchOutputs, 'id'>>
                                    >;
                                  };
                                }
                              >
                            >;
                          }
                        >
                      >;
                      social: Maybe<
                        Array<
                          Pick<
                            UsersDataSocialChildDto,
                            | 'github'
                            | 'googleScholar'
                            | 'linkedIn'
                            | 'researcherId'
                            | 'researchGate'
                            | 'twitter'
                            | 'website1'
                            | 'website2'
                          >
                        >
                      >;
                      labs: Maybe<
                        Array<
                          Pick<Labs, 'id'> & {
                            flatData: Pick<LabsFlatDataDto, 'name'>;
                          }
                        >
                      >;
                    };
                  }
                >
              >;
            }
          >
        >;
        calendars: Maybe<
          Array<
            Pick<Calendars, 'id'> & {
              flatData: Pick<
                CalendarsFlatDataDto,
                'color' | 'googleCalendarId' | 'name'
              >;
            }
          >
        >;
        thumbnail: Maybe<Array<Pick<Asset, 'id'>>>;
      };
    }
  >;
};

export type LabsContentFragment = Pick<Labs, 'id'> & {
  flatData: Pick<LabsFlatDataDto, 'name'>;
};

export type FetchLabsQueryVariables = Exact<{
  top: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
  filter: InputMaybe<Scalars['String']>;
}>;

export type FetchLabsQuery = {
  queryLabsContentsWithTotal: Maybe<
    Pick<LabsResultDto, 'total'> & {
      items: Maybe<
        Array<Pick<Labs, 'id'> & { flatData: Pick<LabsFlatDataDto, 'name'> }>
      >;
    }
  >;
};

export type NewsFragment = Pick<
  NewsAndEvents,
  'id' | 'created' | 'lastModified' | 'version'
> & {
  flatData: Pick<
    NewsAndEventsFlatDataDto,
    'title' | 'shortText' | 'text' | 'type' | 'frequency' | 'link' | 'linkText'
  > & { thumbnail: Maybe<Array<Pick<Asset, 'id'>>> };
};

export type FetchReminderDataQueryVariables = Exact<{
  userId: Scalars['String'];
  researchOutputFilter: Scalars['String'];
  eventFilter: Scalars['String'];
}>;

export type FetchReminderDataQuery = {
  findUsersContent: Maybe<{
    flatData: { teams: Maybe<Array<{ id: Maybe<Array<Pick<Teams, 'id'>>> }>> };
  }>;
  queryResearchOutputsContents: Maybe<
    Array<
      Pick<ResearchOutputs, 'id'> & {
        flatData: Pick<
          ResearchOutputsFlatDataDto,
          'addedDate' | 'documentType' | 'title'
        >;
        referencingTeamsContents: Maybe<Array<Pick<Teams, 'id'>>>;
      }
    >
  >;
  queryEventsContents: Maybe<
    Array<
      Pick<Events, 'id'> & {
        flatData: Pick<
          EventsFlatDataDto,
          | 'startDate'
          | 'endDate'
          | 'title'
          | 'videoRecordingUpdatedAt'
          | 'presentationUpdatedAt'
        >;
      }
    >
  >;
};

export type ResearchOutputContentFragment = Pick<
  ResearchOutputs,
  'id' | 'created' | 'lastModified' | 'version'
> & {
  flatData: Pick<
    ResearchOutputsFlatDataDto,
    | 'title'
    | 'documentType'
    | 'type'
    | 'description'
    | 'link'
    | 'addedDate'
    | 'publishDate'
    | 'doi'
    | 'labCatalogNumber'
    | 'accession'
    | 'rrid'
    | 'tags'
    | 'lastUpdatedPartial'
    | 'usageNotes'
    | 'sharingStatus'
    | 'asapFunded'
    | 'usedInAPublication'
  > & {
    authors: Maybe<
      Array<
        | ({ __typename: 'ExternalAuthors' } & Pick<
            ExternalAuthors,
            'id' | 'created' | 'lastModified' | 'version'
          > & { flatData: Pick<ExternalAuthorsFlatDataDto, 'name' | 'orcid'> })
        | ({ __typename: 'Users' } & Pick<
            Users,
            'id' | 'created' | 'lastModified' | 'version'
          > & {
              flatData: Pick<
                UsersFlatDataDto,
                | 'biography'
                | 'degree'
                | 'email'
                | 'contactEmail'
                | 'firstName'
                | 'institution'
                | 'jobTitle'
                | 'lastModifiedDate'
                | 'lastName'
                | 'country'
                | 'city'
                | 'onboarded'
                | 'orcid'
                | 'orcidLastModifiedDate'
                | 'orcidLastSyncDate'
                | 'expertiseAndResourceTags'
                | 'expertiseAndResourceDescription'
                | 'role'
                | 'responsibilities'
                | 'researchInterests'
                | 'reachOut'
              > & {
                avatar: Maybe<Array<Pick<Asset, 'id'>>>;
                orcidWorks: Maybe<
                  Array<
                    Pick<
                      UsersDataOrcidWorksChildDto,
                      | 'doi'
                      | 'id'
                      | 'lastModifiedDate'
                      | 'publicationDate'
                      | 'title'
                      | 'type'
                    >
                  >
                >;
                questions: Maybe<
                  Array<Pick<UsersDataQuestionsChildDto, 'question'>>
                >;
                teams: Maybe<
                  Array<
                    Pick<UsersDataTeamsChildDto, 'role'> & {
                      id: Maybe<
                        Array<
                          Pick<Teams, 'id'> & {
                            flatData: Pick<TeamsFlatDataDto, 'displayName'> & {
                              proposal: Maybe<
                                Array<Pick<ResearchOutputs, 'id'>>
                              >;
                            };
                          }
                        >
                      >;
                    }
                  >
                >;
                social: Maybe<
                  Array<
                    Pick<
                      UsersDataSocialChildDto,
                      | 'github'
                      | 'googleScholar'
                      | 'linkedIn'
                      | 'researcherId'
                      | 'researchGate'
                      | 'twitter'
                      | 'website1'
                      | 'website2'
                    >
                  >
                >;
                labs: Maybe<
                  Array<
                    Pick<Labs, 'id'> & {
                      flatData: Pick<LabsFlatDataDto, 'name'>;
                    }
                  >
                >;
              };
            })
      >
    >;
    labs: Maybe<
      Array<Pick<Labs, 'id'> & { flatData: Pick<LabsFlatDataDto, 'name'> }>
    >;
    methods: Maybe<Array<{ flatData: Pick<ResearchTagsFlatDataDto, 'name'> }>>;
    organisms: Maybe<
      Array<{ flatData: Pick<ResearchTagsFlatDataDto, 'name'> }>
    >;
    environments: Maybe<
      Array<{ flatData: Pick<ResearchTagsFlatDataDto, 'name'> }>
    >;
    subtype: Maybe<Array<{ flatData: Pick<ResearchTagsFlatDataDto, 'name'> }>>;
  };
  referencingTeamsContents?: Maybe<
    Array<
      Pick<Teams, 'id' | 'created' | 'lastModified' | 'version'> & {
        flatData: Pick<TeamsFlatDataDto, 'displayName'>;
        referencingUsersContents: Maybe<
          Array<{
            flatData: Pick<UsersFlatDataDto, 'email'> & {
              teams: Maybe<
                Array<
                  Pick<UsersDataTeamsChildDto, 'role'> & {
                    id: Maybe<Array<Pick<Teams, 'id'>>>;
                  }
                >
              >;
            };
          }>
        >;
      }
    >
  >;
};

export type FetchResearchOutputQueryVariables = Exact<{
  id: Scalars['String'];
  withTeams: Scalars['Boolean'];
}>;

export type FetchResearchOutputQuery = {
  findResearchOutputsContent: Maybe<
    Pick<ResearchOutputs, 'id' | 'created' | 'lastModified' | 'version'> & {
      flatData: Pick<
        ResearchOutputsFlatDataDto,
        | 'title'
        | 'documentType'
        | 'type'
        | 'description'
        | 'link'
        | 'addedDate'
        | 'publishDate'
        | 'doi'
        | 'labCatalogNumber'
        | 'accession'
        | 'rrid'
        | 'tags'
        | 'lastUpdatedPartial'
        | 'usageNotes'
        | 'sharingStatus'
        | 'asapFunded'
        | 'usedInAPublication'
      > & {
        authors: Maybe<
          Array<
            | ({ __typename: 'ExternalAuthors' } & Pick<
                ExternalAuthors,
                'id' | 'created' | 'lastModified' | 'version'
              > & {
                  flatData: Pick<ExternalAuthorsFlatDataDto, 'name' | 'orcid'>;
                })
            | ({ __typename: 'Users' } & Pick<
                Users,
                'id' | 'created' | 'lastModified' | 'version'
              > & {
                  flatData: Pick<
                    UsersFlatDataDto,
                    | 'biography'
                    | 'degree'
                    | 'email'
                    | 'contactEmail'
                    | 'firstName'
                    | 'institution'
                    | 'jobTitle'
                    | 'lastModifiedDate'
                    | 'lastName'
                    | 'country'
                    | 'city'
                    | 'onboarded'
                    | 'orcid'
                    | 'orcidLastModifiedDate'
                    | 'orcidLastSyncDate'
                    | 'expertiseAndResourceTags'
                    | 'expertiseAndResourceDescription'
                    | 'role'
                    | 'responsibilities'
                    | 'researchInterests'
                    | 'reachOut'
                  > & {
                    avatar: Maybe<Array<Pick<Asset, 'id'>>>;
                    orcidWorks: Maybe<
                      Array<
                        Pick<
                          UsersDataOrcidWorksChildDto,
                          | 'doi'
                          | 'id'
                          | 'lastModifiedDate'
                          | 'publicationDate'
                          | 'title'
                          | 'type'
                        >
                      >
                    >;
                    questions: Maybe<
                      Array<Pick<UsersDataQuestionsChildDto, 'question'>>
                    >;
                    teams: Maybe<
                      Array<
                        Pick<UsersDataTeamsChildDto, 'role'> & {
                          id: Maybe<
                            Array<
                              Pick<Teams, 'id'> & {
                                flatData: Pick<
                                  TeamsFlatDataDto,
                                  'displayName'
                                > & {
                                  proposal: Maybe<
                                    Array<Pick<ResearchOutputs, 'id'>>
                                  >;
                                };
                              }
                            >
                          >;
                        }
                      >
                    >;
                    social: Maybe<
                      Array<
                        Pick<
                          UsersDataSocialChildDto,
                          | 'github'
                          | 'googleScholar'
                          | 'linkedIn'
                          | 'researcherId'
                          | 'researchGate'
                          | 'twitter'
                          | 'website1'
                          | 'website2'
                        >
                      >
                    >;
                    labs: Maybe<
                      Array<
                        Pick<Labs, 'id'> & {
                          flatData: Pick<LabsFlatDataDto, 'name'>;
                        }
                      >
                    >;
                  };
                })
          >
        >;
        labs: Maybe<
          Array<Pick<Labs, 'id'> & { flatData: Pick<LabsFlatDataDto, 'name'> }>
        >;
        methods: Maybe<
          Array<{ flatData: Pick<ResearchTagsFlatDataDto, 'name'> }>
        >;
        organisms: Maybe<
          Array<{ flatData: Pick<ResearchTagsFlatDataDto, 'name'> }>
        >;
        environments: Maybe<
          Array<{ flatData: Pick<ResearchTagsFlatDataDto, 'name'> }>
        >;
        subtype: Maybe<
          Array<{ flatData: Pick<ResearchTagsFlatDataDto, 'name'> }>
        >;
      };
      referencingTeamsContents?: Maybe<
        Array<
          Pick<Teams, 'id' | 'created' | 'lastModified' | 'version'> & {
            flatData: Pick<TeamsFlatDataDto, 'displayName'>;
            referencingUsersContents: Maybe<
              Array<{
                flatData: Pick<UsersFlatDataDto, 'email'> & {
                  teams: Maybe<
                    Array<
                      Pick<UsersDataTeamsChildDto, 'role'> & {
                        id: Maybe<Array<Pick<Teams, 'id'>>>;
                      }
                    >
                  >;
                };
              }>
            >;
          }
        >
      >;
    }
  >;
};

export type FetchResearchOutputsQueryVariables = Exact<{
  top: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
  filter: InputMaybe<Scalars['String']>;
  withTeams: Scalars['Boolean'];
}>;

export type FetchResearchOutputsQuery = {
  queryResearchOutputsContentsWithTotal: Maybe<
    Pick<ResearchOutputsResultDto, 'total'> & {
      items: Maybe<
        Array<
          Pick<
            ResearchOutputs,
            'id' | 'created' | 'lastModified' | 'version'
          > & {
            flatData: Pick<
              ResearchOutputsFlatDataDto,
              | 'title'
              | 'documentType'
              | 'type'
              | 'description'
              | 'link'
              | 'addedDate'
              | 'publishDate'
              | 'doi'
              | 'labCatalogNumber'
              | 'accession'
              | 'rrid'
              | 'tags'
              | 'lastUpdatedPartial'
              | 'usageNotes'
              | 'sharingStatus'
              | 'asapFunded'
              | 'usedInAPublication'
            > & {
              authors: Maybe<
                Array<
                  | ({ __typename: 'ExternalAuthors' } & Pick<
                      ExternalAuthors,
                      'id' | 'created' | 'lastModified' | 'version'
                    > & {
                        flatData: Pick<
                          ExternalAuthorsFlatDataDto,
                          'name' | 'orcid'
                        >;
                      })
                  | ({ __typename: 'Users' } & Pick<
                      Users,
                      'id' | 'created' | 'lastModified' | 'version'
                    > & {
                        flatData: Pick<
                          UsersFlatDataDto,
                          | 'biography'
                          | 'degree'
                          | 'email'
                          | 'contactEmail'
                          | 'firstName'
                          | 'institution'
                          | 'jobTitle'
                          | 'lastModifiedDate'
                          | 'lastName'
                          | 'country'
                          | 'city'
                          | 'onboarded'
                          | 'orcid'
                          | 'orcidLastModifiedDate'
                          | 'orcidLastSyncDate'
                          | 'expertiseAndResourceTags'
                          | 'expertiseAndResourceDescription'
                          | 'role'
                          | 'responsibilities'
                          | 'researchInterests'
                          | 'reachOut'
                        > & {
                          avatar: Maybe<Array<Pick<Asset, 'id'>>>;
                          orcidWorks: Maybe<
                            Array<
                              Pick<
                                UsersDataOrcidWorksChildDto,
                                | 'doi'
                                | 'id'
                                | 'lastModifiedDate'
                                | 'publicationDate'
                                | 'title'
                                | 'type'
                              >
                            >
                          >;
                          questions: Maybe<
                            Array<Pick<UsersDataQuestionsChildDto, 'question'>>
                          >;
                          teams: Maybe<
                            Array<
                              Pick<UsersDataTeamsChildDto, 'role'> & {
                                id: Maybe<
                                  Array<
                                    Pick<Teams, 'id'> & {
                                      flatData: Pick<
                                        TeamsFlatDataDto,
                                        'displayName'
                                      > & {
                                        proposal: Maybe<
                                          Array<Pick<ResearchOutputs, 'id'>>
                                        >;
                                      };
                                    }
                                  >
                                >;
                              }
                            >
                          >;
                          social: Maybe<
                            Array<
                              Pick<
                                UsersDataSocialChildDto,
                                | 'github'
                                | 'googleScholar'
                                | 'linkedIn'
                                | 'researcherId'
                                | 'researchGate'
                                | 'twitter'
                                | 'website1'
                                | 'website2'
                              >
                            >
                          >;
                          labs: Maybe<
                            Array<
                              Pick<Labs, 'id'> & {
                                flatData: Pick<LabsFlatDataDto, 'name'>;
                              }
                            >
                          >;
                        };
                      })
                >
              >;
              labs: Maybe<
                Array<
                  Pick<Labs, 'id'> & { flatData: Pick<LabsFlatDataDto, 'name'> }
                >
              >;
              methods: Maybe<
                Array<{ flatData: Pick<ResearchTagsFlatDataDto, 'name'> }>
              >;
              organisms: Maybe<
                Array<{ flatData: Pick<ResearchTagsFlatDataDto, 'name'> }>
              >;
              environments: Maybe<
                Array<{ flatData: Pick<ResearchTagsFlatDataDto, 'name'> }>
              >;
              subtype: Maybe<
                Array<{ flatData: Pick<ResearchTagsFlatDataDto, 'name'> }>
              >;
            };
            referencingTeamsContents?: Maybe<
              Array<
                Pick<Teams, 'id' | 'created' | 'lastModified' | 'version'> & {
                  flatData: Pick<TeamsFlatDataDto, 'displayName'>;
                  referencingUsersContents: Maybe<
                    Array<{
                      flatData: Pick<UsersFlatDataDto, 'email'> & {
                        teams: Maybe<
                          Array<
                            Pick<UsersDataTeamsChildDto, 'role'> & {
                              id: Maybe<Array<Pick<Teams, 'id'>>>;
                            }
                          >
                        >;
                      };
                    }>
                  >;
                }
              >
            >;
          }
        >
      >;
    }
  >;
};

export type ResearchTagContentFragment = Pick<ResearchTags, 'id'> & {
  flatData: Pick<
    ResearchTagsFlatDataDto,
    'name' | 'category' | 'types' | 'entities'
  >;
};

export type FetchResearchTagsQueryVariables = Exact<{
  top: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
  filter: InputMaybe<Scalars['String']>;
}>;

export type FetchResearchTagsQuery = {
  queryResearchTagsContentsWithTotal: Maybe<
    Pick<ResearchTagsResultDto, 'total'> & {
      items: Maybe<
        Array<
          Pick<ResearchTags, 'id'> & {
            flatData: Pick<
              ResearchTagsFlatDataDto,
              'name' | 'category' | 'types' | 'entities'
            >;
          }
        >
      >;
    }
  >;
};

export type TeamsContentFragment = Pick<
  Teams,
  'id' | 'created' | 'lastModified' | 'version'
> & {
  flatData: Pick<
    TeamsFlatDataDto,
    | 'applicationNumber'
    | 'displayName'
    | 'inactiveSince'
    | 'projectSummary'
    | 'projectTitle'
    | 'expertiseAndResourceTags'
  > & {
    proposal: Maybe<Array<Pick<ResearchOutputs, 'id'>>>;
    tools: Maybe<
      Array<Pick<TeamsDataToolsChildDto, 'description' | 'name' | 'url'>>
    >;
    outputs: Maybe<Array<Pick<ResearchOutputs, 'id'>>>;
  };
  referencingUsersContents: Maybe<
    Array<
      Pick<Users, 'id' | 'created' | 'lastModified' | 'version'> & {
        flatData: Pick<
          UsersFlatDataDto,
          | 'biography'
          | 'degree'
          | 'email'
          | 'contactEmail'
          | 'firstName'
          | 'institution'
          | 'jobTitle'
          | 'lastModifiedDate'
          | 'lastName'
          | 'country'
          | 'city'
          | 'onboarded'
          | 'orcid'
          | 'orcidLastModifiedDate'
          | 'orcidLastSyncDate'
          | 'expertiseAndResourceTags'
          | 'expertiseAndResourceDescription'
          | 'role'
          | 'responsibilities'
          | 'researchInterests'
          | 'reachOut'
        > & {
          avatar: Maybe<Array<Pick<Asset, 'id'>>>;
          orcidWorks: Maybe<
            Array<
              Pick<
                UsersDataOrcidWorksChildDto,
                | 'doi'
                | 'id'
                | 'lastModifiedDate'
                | 'publicationDate'
                | 'title'
                | 'type'
              >
            >
          >;
          questions: Maybe<Array<Pick<UsersDataQuestionsChildDto, 'question'>>>;
          teams: Maybe<
            Array<
              Pick<UsersDataTeamsChildDto, 'role'> & {
                id: Maybe<
                  Array<
                    Pick<Teams, 'id'> & {
                      flatData: Pick<TeamsFlatDataDto, 'displayName'> & {
                        proposal: Maybe<Array<Pick<ResearchOutputs, 'id'>>>;
                      };
                    }
                  >
                >;
              }
            >
          >;
          social: Maybe<
            Array<
              Pick<
                UsersDataSocialChildDto,
                | 'github'
                | 'googleScholar'
                | 'linkedIn'
                | 'researcherId'
                | 'researchGate'
                | 'twitter'
                | 'website1'
                | 'website2'
              >
            >
          >;
          labs: Maybe<
            Array<
              Pick<Labs, 'id'> & { flatData: Pick<LabsFlatDataDto, 'name'> }
            >
          >;
        };
      }
    >
  >;
};

export type FetchTeamQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchTeamQuery = {
  findTeamsContent: Maybe<
    Pick<Teams, 'id' | 'created' | 'lastModified' | 'version'> & {
      flatData: Pick<
        TeamsFlatDataDto,
        | 'applicationNumber'
        | 'displayName'
        | 'inactiveSince'
        | 'projectSummary'
        | 'projectTitle'
        | 'expertiseAndResourceTags'
      > & {
        proposal: Maybe<Array<Pick<ResearchOutputs, 'id'>>>;
        tools: Maybe<
          Array<Pick<TeamsDataToolsChildDto, 'description' | 'name' | 'url'>>
        >;
        outputs: Maybe<Array<Pick<ResearchOutputs, 'id'>>>;
      };
      referencingUsersContents: Maybe<
        Array<
          Pick<Users, 'id' | 'created' | 'lastModified' | 'version'> & {
            flatData: Pick<
              UsersFlatDataDto,
              | 'biography'
              | 'degree'
              | 'email'
              | 'contactEmail'
              | 'firstName'
              | 'institution'
              | 'jobTitle'
              | 'lastModifiedDate'
              | 'lastName'
              | 'country'
              | 'city'
              | 'onboarded'
              | 'orcid'
              | 'orcidLastModifiedDate'
              | 'orcidLastSyncDate'
              | 'expertiseAndResourceTags'
              | 'expertiseAndResourceDescription'
              | 'role'
              | 'responsibilities'
              | 'researchInterests'
              | 'reachOut'
            > & {
              avatar: Maybe<Array<Pick<Asset, 'id'>>>;
              orcidWorks: Maybe<
                Array<
                  Pick<
                    UsersDataOrcidWorksChildDto,
                    | 'doi'
                    | 'id'
                    | 'lastModifiedDate'
                    | 'publicationDate'
                    | 'title'
                    | 'type'
                  >
                >
              >;
              questions: Maybe<
                Array<Pick<UsersDataQuestionsChildDto, 'question'>>
              >;
              teams: Maybe<
                Array<
                  Pick<UsersDataTeamsChildDto, 'role'> & {
                    id: Maybe<
                      Array<
                        Pick<Teams, 'id'> & {
                          flatData: Pick<TeamsFlatDataDto, 'displayName'> & {
                            proposal: Maybe<Array<Pick<ResearchOutputs, 'id'>>>;
                          };
                        }
                      >
                    >;
                  }
                >
              >;
              social: Maybe<
                Array<
                  Pick<
                    UsersDataSocialChildDto,
                    | 'github'
                    | 'googleScholar'
                    | 'linkedIn'
                    | 'researcherId'
                    | 'researchGate'
                    | 'twitter'
                    | 'website1'
                    | 'website2'
                  >
                >
              >;
              labs: Maybe<
                Array<
                  Pick<Labs, 'id'> & { flatData: Pick<LabsFlatDataDto, 'name'> }
                >
              >;
            };
          }
        >
      >;
    }
  >;
};

export type FetchTeamsQueryVariables = Exact<{
  top: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
  filter: InputMaybe<Scalars['String']>;
}>;

export type FetchTeamsQuery = {
  queryTeamsContentsWithTotal: Maybe<
    Pick<TeamsResultDto, 'total'> & {
      items: Maybe<
        Array<
          Pick<Teams, 'id' | 'created' | 'lastModified' | 'version'> & {
            flatData: Pick<
              TeamsFlatDataDto,
              | 'applicationNumber'
              | 'displayName'
              | 'inactiveSince'
              | 'projectSummary'
              | 'projectTitle'
              | 'expertiseAndResourceTags'
            > & {
              proposal: Maybe<Array<Pick<ResearchOutputs, 'id'>>>;
              tools: Maybe<
                Array<
                  Pick<TeamsDataToolsChildDto, 'description' | 'name' | 'url'>
                >
              >;
              outputs: Maybe<Array<Pick<ResearchOutputs, 'id'>>>;
            };
            referencingUsersContents: Maybe<
              Array<
                Pick<Users, 'id' | 'created' | 'lastModified' | 'version'> & {
                  flatData: Pick<
                    UsersFlatDataDto,
                    | 'biography'
                    | 'degree'
                    | 'email'
                    | 'contactEmail'
                    | 'firstName'
                    | 'institution'
                    | 'jobTitle'
                    | 'lastModifiedDate'
                    | 'lastName'
                    | 'country'
                    | 'city'
                    | 'onboarded'
                    | 'orcid'
                    | 'orcidLastModifiedDate'
                    | 'orcidLastSyncDate'
                    | 'expertiseAndResourceTags'
                    | 'expertiseAndResourceDescription'
                    | 'role'
                    | 'responsibilities'
                    | 'researchInterests'
                    | 'reachOut'
                  > & {
                    avatar: Maybe<Array<Pick<Asset, 'id'>>>;
                    orcidWorks: Maybe<
                      Array<
                        Pick<
                          UsersDataOrcidWorksChildDto,
                          | 'doi'
                          | 'id'
                          | 'lastModifiedDate'
                          | 'publicationDate'
                          | 'title'
                          | 'type'
                        >
                      >
                    >;
                    questions: Maybe<
                      Array<Pick<UsersDataQuestionsChildDto, 'question'>>
                    >;
                    teams: Maybe<
                      Array<
                        Pick<UsersDataTeamsChildDto, 'role'> & {
                          id: Maybe<
                            Array<
                              Pick<Teams, 'id'> & {
                                flatData: Pick<
                                  TeamsFlatDataDto,
                                  'displayName'
                                > & {
                                  proposal: Maybe<
                                    Array<Pick<ResearchOutputs, 'id'>>
                                  >;
                                };
                              }
                            >
                          >;
                        }
                      >
                    >;
                    social: Maybe<
                      Array<
                        Pick<
                          UsersDataSocialChildDto,
                          | 'github'
                          | 'googleScholar'
                          | 'linkedIn'
                          | 'researcherId'
                          | 'researchGate'
                          | 'twitter'
                          | 'website1'
                          | 'website2'
                        >
                      >
                    >;
                    labs: Maybe<
                      Array<
                        Pick<Labs, 'id'> & {
                          flatData: Pick<LabsFlatDataDto, 'name'>;
                        }
                      >
                    >;
                  };
                }
              >
            >;
          }
        >
      >;
    }
  >;
};

export type TutorialsContentFragment = Pick<Tutorials, 'id' | 'created'> & {
  flatData: Pick<
    TutorialsFlatDataDto,
    'title' | 'shortText' | 'text' | 'link' | 'linkText'
  > & { thumbnail: Maybe<Array<Pick<Asset, 'id'>>> };
};

export type FetchTutorialsQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchTutorialsQuery = {
  findTutorialsContent: Maybe<
    Pick<Tutorials, 'id' | 'created'> & {
      flatData: Pick<
        TutorialsFlatDataDto,
        'title' | 'shortText' | 'text' | 'link' | 'linkText'
      > & { thumbnail: Maybe<Array<Pick<Asset, 'id'>>> };
    }
  >;
};

export type UsersContentFragment = Pick<
  Users,
  'id' | 'created' | 'lastModified' | 'version'
> & {
  flatData: Pick<
    UsersFlatDataDto,
    | 'alumniSinceDate'
    | 'biography'
    | 'degree'
    | 'email'
    | 'contactEmail'
    | 'dismissedGettingStarted'
    | 'firstName'
    | 'institution'
    | 'jobTitle'
    | 'lastModifiedDate'
    | 'lastName'
    | 'country'
    | 'city'
    | 'onboarded'
    | 'orcid'
    | 'orcidLastModifiedDate'
    | 'orcidLastSyncDate'
    | 'expertiseAndResourceTags'
    | 'expertiseAndResourceDescription'
    | 'role'
    | 'responsibilities'
    | 'researchInterests'
    | 'reachOut'
  > & {
    avatar: Maybe<Array<Pick<Asset, 'id'>>>;
    orcidWorks: Maybe<
      Array<
        Pick<
          UsersDataOrcidWorksChildDto,
          | 'doi'
          | 'id'
          | 'lastModifiedDate'
          | 'publicationDate'
          | 'title'
          | 'type'
        >
      >
    >;
    questions: Maybe<Array<Pick<UsersDataQuestionsChildDto, 'question'>>>;
    teams: Maybe<
      Array<
        Pick<UsersDataTeamsChildDto, 'role'> & {
          id: Maybe<
            Array<
              Pick<Teams, 'id'> & {
                flatData: Pick<TeamsFlatDataDto, 'displayName'> & {
                  proposal: Maybe<Array<Pick<ResearchOutputs, 'id'>>>;
                };
              }
            >
          >;
        }
      >
    >;
    social: Maybe<
      Array<
        Pick<
          UsersDataSocialChildDto,
          | 'github'
          | 'googleScholar'
          | 'linkedIn'
          | 'researcherId'
          | 'researchGate'
          | 'twitter'
          | 'website1'
          | 'website2'
        >
      >
    >;
    labs: Maybe<
      Array<Pick<Labs, 'id'> & { flatData: Pick<LabsFlatDataDto, 'name'> }>
    >;
  };
};

export type FetchUserQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchUserQuery = {
  findUsersContent: Maybe<
    Pick<Users, 'id' | 'created' | 'lastModified' | 'version'> & {
      flatData: Pick<
        UsersFlatDataDto,
        | 'alumniSinceDate'
        | 'biography'
        | 'degree'
        | 'email'
        | 'contactEmail'
        | 'dismissedGettingStarted'
        | 'firstName'
        | 'institution'
        | 'jobTitle'
        | 'lastModifiedDate'
        | 'lastName'
        | 'country'
        | 'city'
        | 'onboarded'
        | 'orcid'
        | 'orcidLastModifiedDate'
        | 'orcidLastSyncDate'
        | 'expertiseAndResourceTags'
        | 'expertiseAndResourceDescription'
        | 'role'
        | 'responsibilities'
        | 'researchInterests'
        | 'reachOut'
      > & {
        avatar: Maybe<Array<Pick<Asset, 'id'>>>;
        orcidWorks: Maybe<
          Array<
            Pick<
              UsersDataOrcidWorksChildDto,
              | 'doi'
              | 'id'
              | 'lastModifiedDate'
              | 'publicationDate'
              | 'title'
              | 'type'
            >
          >
        >;
        questions: Maybe<Array<Pick<UsersDataQuestionsChildDto, 'question'>>>;
        teams: Maybe<
          Array<
            Pick<UsersDataTeamsChildDto, 'role'> & {
              id: Maybe<
                Array<
                  Pick<Teams, 'id'> & {
                    flatData: Pick<TeamsFlatDataDto, 'displayName'> & {
                      proposal: Maybe<Array<Pick<ResearchOutputs, 'id'>>>;
                    };
                  }
                >
              >;
            }
          >
        >;
        social: Maybe<
          Array<
            Pick<
              UsersDataSocialChildDto,
              | 'github'
              | 'googleScholar'
              | 'linkedIn'
              | 'researcherId'
              | 'researchGate'
              | 'twitter'
              | 'website1'
              | 'website2'
            >
          >
        >;
        labs: Maybe<
          Array<Pick<Labs, 'id'> & { flatData: Pick<LabsFlatDataDto, 'name'> }>
        >;
      };
    }
  >;
};

export type FetchUsersQueryVariables = Exact<{
  top: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
  filter: InputMaybe<Scalars['String']>;
}>;

export type FetchUsersQuery = {
  queryUsersContentsWithTotal: Maybe<
    Pick<UsersResultDto, 'total'> & {
      items: Maybe<
        Array<
          Pick<Users, 'id' | 'created' | 'lastModified' | 'version'> & {
            flatData: Pick<
              UsersFlatDataDto,
              | 'alumniSinceDate'
              | 'biography'
              | 'degree'
              | 'email'
              | 'contactEmail'
              | 'dismissedGettingStarted'
              | 'firstName'
              | 'institution'
              | 'jobTitle'
              | 'lastModifiedDate'
              | 'lastName'
              | 'country'
              | 'city'
              | 'onboarded'
              | 'orcid'
              | 'orcidLastModifiedDate'
              | 'orcidLastSyncDate'
              | 'expertiseAndResourceTags'
              | 'expertiseAndResourceDescription'
              | 'role'
              | 'responsibilities'
              | 'researchInterests'
              | 'reachOut'
            > & {
              avatar: Maybe<Array<Pick<Asset, 'id'>>>;
              orcidWorks: Maybe<
                Array<
                  Pick<
                    UsersDataOrcidWorksChildDto,
                    | 'doi'
                    | 'id'
                    | 'lastModifiedDate'
                    | 'publicationDate'
                    | 'title'
                    | 'type'
                  >
                >
              >;
              questions: Maybe<
                Array<Pick<UsersDataQuestionsChildDto, 'question'>>
              >;
              teams: Maybe<
                Array<
                  Pick<UsersDataTeamsChildDto, 'role'> & {
                    id: Maybe<
                      Array<
                        Pick<Teams, 'id'> & {
                          flatData: Pick<TeamsFlatDataDto, 'displayName'> & {
                            proposal: Maybe<Array<Pick<ResearchOutputs, 'id'>>>;
                          };
                        }
                      >
                    >;
                  }
                >
              >;
              social: Maybe<
                Array<
                  Pick<
                    UsersDataSocialChildDto,
                    | 'github'
                    | 'googleScholar'
                    | 'linkedIn'
                    | 'researcherId'
                    | 'researchGate'
                    | 'twitter'
                    | 'website1'
                    | 'website2'
                  >
                >
              >;
              labs: Maybe<
                Array<
                  Pick<Labs, 'id'> & { flatData: Pick<LabsFlatDataDto, 'name'> }
                >
              >;
            };
          }
        >
      >;
    }
  >;
};

export const CalendarsContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CalendarsContent' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Calendars' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'created' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastModified' } },
          { kind: 'Field', name: { kind: 'Name', value: 'version' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'flatData' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'googleCalendarId' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'syncToken' } },
                { kind: 'Field', name: { kind: 'Name', value: 'resourceId' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'expirationDate' },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'referencingGroupsContents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'flatData' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'active' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CalendarsContentFragment, unknown>;
export const TeamsContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamsContent' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Teams' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'created' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastModified' } },
          { kind: 'Field', name: { kind: 'Name', value: 'version' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'flatData' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'applicationNumber' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'inactiveSince' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'projectSummary' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'projectTitle' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'expertiseAndResourceTags' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'proposal' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tools' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'description' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'outputs' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'referencingUsersContents' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'StringValue',
                  value: 'data/onboarded/iv eq true',
                  block: false,
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'created' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'lastModified' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'version' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'flatData' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'avatar' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'biography' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'degree' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'contactEmail' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'firstName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'institution' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'jobTitle' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'lastModifiedDate' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'lastName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'country' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'onboarded' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'orcid' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'orcidLastModifiedDate' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'orcidLastSyncDate' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'orcidWorks' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'doi' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'lastModifiedDate' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'publicationDate' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'title' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'type' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'questions' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'question' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'expertiseAndResourceTags',
                        },
                      },
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'expertiseAndResourceDescription',
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'teams' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'role' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'flatData' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'displayName',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'proposal',
                                          },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'id',
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'social' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'github' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'googleScholar' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'linkedIn' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'researcherId' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'researchGate' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'twitter' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'website1' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'website2' },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'role' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'responsibilities' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'researchInterests' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'reachOut' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'labs' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'flatData' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'name' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TeamsContentFragment, unknown>;
export const GroupsContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'GroupsContent' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Groups' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'created' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastModified' } },
          { kind: 'Field', name: { kind: 'Name', value: 'version' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'flatData' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'active' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tags' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tools' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'slack' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'googleDrive' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'teams' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'TeamsContent' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'leaders' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'role' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'user' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'created' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'lastModified' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'version' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'flatData' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'avatar' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'biography' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'degree' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'email' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'contactEmail',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'firstName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'institution',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'jobTitle' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'lastModifiedDate',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'lastName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'country' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'city' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'onboarded' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'orcid' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'orcidLastModifiedDate',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'orcidLastSyncDate',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'orcidWorks' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'doi' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'lastModifiedDate',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'publicationDate',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'title',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'type' },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'questions' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'question',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'expertiseAndResourceTags',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'expertiseAndResourceDescription',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'teams' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'role' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'id',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'flatData',
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'displayName',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'proposal',
                                                      },
                                                      selectionSet: {
                                                        kind: 'SelectionSet',
                                                        selections: [
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'id',
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'social' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'github',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'googleScholar',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'linkedIn',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'researcherId',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'researchGate',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'twitter',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'website1',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'website2',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'role' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'responsibilities',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'researchInterests',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'reachOut' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'labs' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'flatData',
                                          },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'name',
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'calendars' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'flatData' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'color' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'googleCalendarId' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'thumbnail' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...TeamsContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<GroupsContentFragment, unknown>;
export const EventContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'EventContent' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Events' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastModified' } },
          { kind: 'Field', name: { kind: 'Name', value: 'version' } },
          { kind: 'Field', name: { kind: 'Name', value: 'created' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'flatData' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'endDate' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'endDateTimeZone' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'startDate' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'startDateTimeZone' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'meetingLink' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'hideMeetingLink' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'eventLink' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tags' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'notesPermanentlyUnavailable' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
                {
                  kind: 'Field',
                  name: {
                    kind: 'Name',
                    value: 'videoRecordingPermanentlyUnavailable',
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'videoRecording' },
                },
                {
                  kind: 'Field',
                  name: {
                    kind: 'Name',
                    value: 'presentationPermanentlyUnavailable',
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'presentation' },
                },
                {
                  kind: 'Field',
                  name: {
                    kind: 'Name',
                    value: 'meetingMaterialsPermanentlyUnavailable',
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'meetingMaterials' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'calendar' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'flatData' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'googleCalendarId' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'color' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'referencingGroupsContents',
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'FragmentSpread',
                              name: { kind: 'Name', value: 'GroupsContent' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'thumbnail' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'speakers' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'team' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'flatData' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'displayName',
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'user' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: '__typename' },
                            },
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'Users' },
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'flatData' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'firstName',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'lastName',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'onboarded',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'avatar',
                                          },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'id',
                                                },
                                              },
                                            ],
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'teams',
                                          },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'role',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'id',
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'id',
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: {
                                  kind: 'Name',
                                  value: 'ExternalAuthors',
                                },
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'flatData' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'name' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'orcid',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...GroupsContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<EventContentFragment, unknown>;
export const ExternalAuthorsContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ExternalAuthorsContent' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'ExternalAuthors' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'created' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastModified' } },
          { kind: 'Field', name: { kind: 'Name', value: 'version' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'flatData' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'orcid' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ExternalAuthorsContentFragment, unknown>;
export const LabsContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LabsContent' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Labs' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'flatData' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LabsContentFragment, unknown>;
export const NewsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'News' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'NewsAndEvents' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'created' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastModified' } },
          { kind: 'Field', name: { kind: 'Name', value: 'version' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'flatData' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'shortText' } },
                { kind: 'Field', name: { kind: 'Name', value: 'text' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'thumbnail' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'frequency' } },
                { kind: 'Field', name: { kind: 'Name', value: 'link' } },
                { kind: 'Field', name: { kind: 'Name', value: 'linkText' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<NewsFragment, unknown>;
export const ResearchOutputContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ResearchOutputContent' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'ResearchOutputs' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'created' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastModified' } },
          { kind: 'Field', name: { kind: 'Name', value: 'version' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'flatData' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'documentType' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'link' } },
                { kind: 'Field', name: { kind: 'Name', value: 'addedDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'publishDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'doi' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'labCatalogNumber' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'accession' } },
                { kind: 'Field', name: { kind: 'Name', value: 'rrid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tags' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'lastUpdatedPartial' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'usageNotes' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'sharingStatus' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'asapFunded' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'usedInAPublication' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'authors' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: '__typename' },
                      },
                      {
                        kind: 'InlineFragment',
                        typeCondition: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'Users' },
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'created' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'lastModified' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'version' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'flatData' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'avatar' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'biography' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'degree' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'email' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'contactEmail',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'firstName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'institution',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'jobTitle' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'lastModifiedDate',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'lastName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'country' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'city' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'onboarded' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'orcid' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'orcidLastModifiedDate',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'orcidLastSyncDate',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'orcidWorks' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'doi' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'lastModifiedDate',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'publicationDate',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'title',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'type' },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'questions' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'question',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'expertiseAndResourceTags',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'expertiseAndResourceDescription',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'teams' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'role' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'id',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'flatData',
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'displayName',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'proposal',
                                                      },
                                                      selectionSet: {
                                                        kind: 'SelectionSet',
                                                        selections: [
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'id',
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'social' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'github',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'googleScholar',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'linkedIn',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'researcherId',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'researchGate',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'twitter',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'website1',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'website2',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'role' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'responsibilities',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'researchInterests',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'reachOut' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'labs' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'flatData',
                                          },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'name',
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'InlineFragment',
                        typeCondition: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'ExternalAuthors' },
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'created' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'lastModified' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'version' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'flatData' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'name' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'orcid' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'labs' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'flatData' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'methods' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'flatData' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'organisms' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'flatData' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'environments' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'flatData' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'subtype' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'flatData' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'referencingTeamsContents' },
            directives: [
              {
                kind: 'Directive',
                name: { kind: 'Name', value: 'include' },
                arguments: [
                  {
                    kind: 'Argument',
                    name: { kind: 'Name', value: 'if' },
                    value: {
                      kind: 'Variable',
                      name: { kind: 'Name', value: 'withTeams' },
                    },
                  },
                ],
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'created' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'lastModified' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'version' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'flatData' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'displayName' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'referencingUsersContents' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'flatData' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'email' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'teams' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'role' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ResearchOutputContentFragment, unknown>;
export const ResearchTagContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ResearchTagContent' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'ResearchTags' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'flatData' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'types' } },
                { kind: 'Field', name: { kind: 'Name', value: 'entities' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ResearchTagContentFragment, unknown>;
export const TutorialsContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TutorialsContent' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Tutorials' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'created' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'flatData' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'shortText' } },
                { kind: 'Field', name: { kind: 'Name', value: 'text' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'thumbnail' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'link' } },
                { kind: 'Field', name: { kind: 'Name', value: 'linkText' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TutorialsContentFragment, unknown>;
export const UsersContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UsersContent' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Users' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'created' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastModified' } },
          { kind: 'Field', name: { kind: 'Name', value: 'version' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'flatData' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'alumniSinceDate' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'avatar' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'biography' } },
                { kind: 'Field', name: { kind: 'Name', value: 'degree' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'contactEmail' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'dismissedGettingStarted' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'institution' } },
                { kind: 'Field', name: { kind: 'Name', value: 'jobTitle' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'lastModifiedDate' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'country' } },
                { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                { kind: 'Field', name: { kind: 'Name', value: 'onboarded' } },
                { kind: 'Field', name: { kind: 'Name', value: 'orcid' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'orcidLastModifiedDate' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'orcidLastSyncDate' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'orcidWorks' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'doi' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'lastModifiedDate' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'publicationDate' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'questions' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'question' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'expertiseAndResourceTags' },
                },
                {
                  kind: 'Field',
                  name: {
                    kind: 'Name',
                    value: 'expertiseAndResourceDescription',
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'teams' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'role' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'id' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'flatData' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'displayName',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'proposal' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'social' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'github' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'googleScholar' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'linkedIn' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'researcherId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'researchGate' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'twitter' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'website1' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'website2' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'role' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'responsibilities' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'researchInterests' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'reachOut' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'labs' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'flatData' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UsersContentFragment, unknown>;
export const FetchCalendarDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchCalendar' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'findCalendarsContent' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'CalendarsContent' },
                },
              ],
            },
          },
        ],
      },
    },
    ...CalendarsContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchCalendarQuery, FetchCalendarQueryVariables>;
export const FetchCalendarsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchCalendars' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'top' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'filter' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'order' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'queryCalendarsContentsWithTotal' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'top' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'top' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'skip' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'filter' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderby' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'order' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'CalendarsContent' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...CalendarsContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchCalendarsQuery, FetchCalendarsQueryVariables>;
export const FetchDashboardDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchDashboard' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'queryDashboardContents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'flatData' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'news' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'FragmentSpread',
                              name: { kind: 'Name', value: 'News' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'pages' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'created' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'lastModified' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'version' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'flatData' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'path' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'title' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'shortText' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'text' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'link' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'linkText' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...NewsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchDashboardQuery, FetchDashboardQueryVariables>;
export const FetchDiscoverDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchDiscover' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'queryDiscoverContents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'flatData' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'aboutUs' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'training' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'FragmentSpread',
                              name: { kind: 'Name', value: 'TutorialsContent' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'workingGroups' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'FragmentSpread',
                              name: { kind: 'Name', value: 'News' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'pages' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'created' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'lastModified' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'version' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'flatData' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'shortText' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'text' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'title' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'link' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'linkText' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'members' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'created' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'lastModified' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'version' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'flatData' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'avatar' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'email' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'firstName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'institution',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'jobTitle' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'lastModifiedDate',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'lastName' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'membersTeam' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'scientificAdvisoryBoard',
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'created' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'lastModified' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'version' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'flatData' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'avatar' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'email' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'firstName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'institution',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'jobTitle' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'lastModifiedDate',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'lastName' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...TutorialsContentFragmentDoc.definitions,
    ...NewsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchDiscoverQuery, FetchDiscoverQueryVariables>;
export const FetchEventsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchEvents' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'top' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'filter' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'order' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'queryEventsContentsWithTotal' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'top' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'top' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'skip' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'filter' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderby' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'order' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'EventContent' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...EventContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchEventsQuery, FetchEventsQueryVariables>;
export const FetchEventDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchEvent' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'findEventsContent' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'EventContent' },
                },
              ],
            },
          },
        ],
      },
    },
    ...EventContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchEventQuery, FetchEventQueryVariables>;
export const FetchGroupCalendarDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchGroupCalendar' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'findGroupsContent' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'flatData' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'calendars' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  FetchGroupCalendarQuery,
  FetchGroupCalendarQueryVariables
>;
export const FetchExternalAuthorDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchExternalAuthor' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'findExternalAuthorsContent' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'ExternalAuthorsContent' },
                },
              ],
            },
          },
        ],
      },
    },
    ...ExternalAuthorsContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchExternalAuthorQuery,
  FetchExternalAuthorQueryVariables
>;
export const FetchExternalAuthorsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchExternalAuthors' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'top' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: {
              kind: 'Name',
              value: 'queryExternalAuthorsContentsWithTotal',
            },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'top' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'top' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'skip' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderby' },
                value: {
                  kind: 'StringValue',
                  value: 'data/name/iv',
                  block: false,
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'ExternalAuthorsContent' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...ExternalAuthorsContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchExternalAuthorsQuery,
  FetchExternalAuthorsQueryVariables
>;
export const FetchGroupsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchGroups' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'top' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'filter' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'queryGroupsContentsWithTotal' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'top' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'top' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'skip' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'filter' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderby' },
                value: {
                  kind: 'StringValue',
                  value: 'data/name/iv',
                  block: false,
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'GroupsContent' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...GroupsContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchGroupsQuery, FetchGroupsQueryVariables>;
export const FetchGroupDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchGroup' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'findGroupsContent' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'GroupsContent' },
                },
              ],
            },
          },
        ],
      },
    },
    ...GroupsContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchGroupQuery, FetchGroupQueryVariables>;
export const FetchLabsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchLabs' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'top' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'filter' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'queryLabsContentsWithTotal' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'top' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'top' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'skip' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'filter' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderby' },
                value: {
                  kind: 'StringValue',
                  value: 'data/name/iv',
                  block: false,
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'LabsContent' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...LabsContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchLabsQuery, FetchLabsQueryVariables>;
export const FetchReminderDataDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchReminderData' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'userId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'researchOutputFilter' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'eventFilter' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'findUsersContent' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'userId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'flatData' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'teams' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'queryResearchOutputsContents' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'researchOutputFilter' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'flatData' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'addedDate' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'documentType' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'referencingTeamsContents' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'queryEventsContents' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'eventFilter' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'flatData' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'startDate' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'endDate' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'videoRecordingUpdatedAt',
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'presentationUpdatedAt' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  FetchReminderDataQuery,
  FetchReminderDataQueryVariables
>;
export const FetchResearchOutputDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchResearchOutput' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'withTeams' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'Boolean' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'findResearchOutputsContent' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'ResearchOutputContent' },
                },
              ],
            },
          },
        ],
      },
    },
    ...ResearchOutputContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchResearchOutputQuery,
  FetchResearchOutputQueryVariables
>;
export const FetchResearchOutputsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchResearchOutputs' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'top' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'filter' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'withTeams' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'Boolean' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: {
              kind: 'Name',
              value: 'queryResearchOutputsContentsWithTotal',
            },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'top' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'top' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'skip' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'filter' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderby' },
                value: {
                  kind: 'StringValue',
                  value: 'created desc',
                  block: false,
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'ResearchOutputContent' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...ResearchOutputContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchResearchOutputsQuery,
  FetchResearchOutputsQueryVariables
>;
export const FetchResearchTagsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchResearchTags' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'top' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'filter' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'queryResearchTagsContentsWithTotal' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'top' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'top' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'skip' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'filter' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderby' },
                value: {
                  kind: 'StringValue',
                  value: 'data/name/iv',
                  block: false,
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'ResearchTagContent' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...ResearchTagContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchResearchTagsQuery,
  FetchResearchTagsQueryVariables
>;
export const FetchTeamDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchTeam' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'findTeamsContent' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'TeamsContent' },
                },
              ],
            },
          },
        ],
      },
    },
    ...TeamsContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchTeamQuery, FetchTeamQueryVariables>;
export const FetchTeamsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchTeams' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'top' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'filter' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'queryTeamsContentsWithTotal' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'top' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'top' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'skip' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'filter' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderby' },
                value: {
                  kind: 'StringValue',
                  value: 'data/displayName/iv',
                  block: false,
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'TeamsContent' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...TeamsContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchTeamsQuery, FetchTeamsQueryVariables>;
export const FetchTutorialsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchTutorials' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'findTutorialsContent' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'TutorialsContent' },
                },
              ],
            },
          },
        ],
      },
    },
    ...TutorialsContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchTutorialsQuery, FetchTutorialsQueryVariables>;
export const FetchUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'findUsersContent' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'UsersContent' },
                },
              ],
            },
          },
        ],
      },
    },
    ...UsersContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchUserQuery, FetchUserQueryVariables>;
export const FetchUsersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchUsers' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'top' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'filter' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'queryUsersContentsWithTotal' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'top' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'top' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'skip' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'filter' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderby' },
                value: {
                  kind: 'StringValue',
                  value: 'data/firstName/iv,data/lastName/iv',
                  block: false,
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'UsersContent' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...UsersContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchUsersQuery, FetchUsersQueryVariables>;
