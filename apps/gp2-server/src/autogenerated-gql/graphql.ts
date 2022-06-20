/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
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
export type AppMutations = {
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
  /** Upsert an Users content by id. */
  upsertUsersContent: Users;
};

/** The app mutations. */
export type AppMutationsChangeCalendarsContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsChangeDashboardContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsChangeDiscoverContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsChangeEventsContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsChangeExternalAuthorsContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsChangeGroupsContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsChangeLabsContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsChangeMigrationsContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsChangeNewsAndEventsContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsChangePagesContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsChangeResearchOutputsContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsChangeResearchTagsContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsChangeTeamsContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsChangeUsersContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsCreateCalendarsContentArgs = {
  data: CalendarsDataInputDto;
  id: Maybe<Scalars['String']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsCreateDashboardContentArgs = {
  data: DashboardDataInputDto;
  id: Maybe<Scalars['String']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsCreateDiscoverContentArgs = {
  data: DiscoverDataInputDto;
  id: Maybe<Scalars['String']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsCreateEventsContentArgs = {
  data: EventsDataInputDto;
  id: Maybe<Scalars['String']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsCreateExternalAuthorsContentArgs = {
  data: ExternalAuthorsDataInputDto;
  id: Maybe<Scalars['String']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsCreateGroupsContentArgs = {
  data: GroupsDataInputDto;
  id: Maybe<Scalars['String']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsCreateLabsContentArgs = {
  data: LabsDataInputDto;
  id: Maybe<Scalars['String']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsCreateMigrationsContentArgs = {
  data: MigrationsDataInputDto;
  id: Maybe<Scalars['String']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsCreateNewsAndEventsContentArgs = {
  data: NewsAndEventsDataInputDto;
  id: Maybe<Scalars['String']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsCreatePagesContentArgs = {
  data: PagesDataInputDto;
  id: Maybe<Scalars['String']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsCreateResearchOutputsContentArgs = {
  data: ResearchOutputsDataInputDto;
  id: Maybe<Scalars['String']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsCreateResearchTagsContentArgs = {
  data: ResearchTagsDataInputDto;
  id: Maybe<Scalars['String']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsCreateTeamsContentArgs = {
  data: TeamsDataInputDto;
  id: Maybe<Scalars['String']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsCreateUsersContentArgs = {
  data: UsersDataInputDto;
  id: Maybe<Scalars['String']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsDeleteCalendarsContentArgs = {
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsDeleteDashboardContentArgs = {
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsDeleteDiscoverContentArgs = {
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsDeleteEventsContentArgs = {
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsDeleteExternalAuthorsContentArgs = {
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsDeleteGroupsContentArgs = {
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsDeleteLabsContentArgs = {
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsDeleteMigrationsContentArgs = {
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsDeleteNewsAndEventsContentArgs = {
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsDeletePagesContentArgs = {
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsDeleteResearchOutputsContentArgs = {
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsDeleteResearchTagsContentArgs = {
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsDeleteTeamsContentArgs = {
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsDeleteUsersContentArgs = {
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsPatchCalendarsContentArgs = {
  data: CalendarsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsPatchDashboardContentArgs = {
  data: DashboardDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsPatchDiscoverContentArgs = {
  data: DiscoverDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsPatchEventsContentArgs = {
  data: EventsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsPatchExternalAuthorsContentArgs = {
  data: ExternalAuthorsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsPatchGroupsContentArgs = {
  data: GroupsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsPatchLabsContentArgs = {
  data: LabsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsPatchMigrationsContentArgs = {
  data: MigrationsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsPatchNewsAndEventsContentArgs = {
  data: NewsAndEventsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsPatchPagesContentArgs = {
  data: PagesDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsPatchResearchOutputsContentArgs = {
  data: ResearchOutputsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsPatchResearchTagsContentArgs = {
  data: ResearchTagsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsPatchTeamsContentArgs = {
  data: TeamsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsPatchUsersContentArgs = {
  data: UsersDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsPublishCalendarsContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsPublishDashboardContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsPublishDiscoverContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsPublishEventsContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsPublishExternalAuthorsContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsPublishGroupsContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsPublishLabsContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsPublishMigrationsContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsPublishNewsAndEventsContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsPublishPagesContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsPublishResearchOutputsContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsPublishResearchTagsContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsPublishTeamsContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsPublishUsersContentArgs = {
  dueTime: Maybe<Scalars['Instant']>;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsUpdateCalendarsContentArgs = {
  data: CalendarsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpdateDashboardContentArgs = {
  data: DashboardDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpdateDiscoverContentArgs = {
  data: DiscoverDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpdateEventsContentArgs = {
  data: EventsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpdateExternalAuthorsContentArgs = {
  data: ExternalAuthorsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpdateGroupsContentArgs = {
  data: GroupsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpdateLabsContentArgs = {
  data: LabsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpdateMigrationsContentArgs = {
  data: MigrationsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpdateNewsAndEventsContentArgs = {
  data: NewsAndEventsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpdatePagesContentArgs = {
  data: PagesDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpdateResearchOutputsContentArgs = {
  data: ResearchOutputsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpdateResearchTagsContentArgs = {
  data: ResearchTagsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpdateTeamsContentArgs = {
  data: TeamsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpdateUsersContentArgs = {
  data: UsersDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpsertCalendarsContentArgs = {
  data: CalendarsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: Maybe<Scalars['Boolean']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpsertDashboardContentArgs = {
  data: DashboardDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: Maybe<Scalars['Boolean']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpsertDiscoverContentArgs = {
  data: DiscoverDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: Maybe<Scalars['Boolean']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpsertEventsContentArgs = {
  data: EventsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: Maybe<Scalars['Boolean']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpsertExternalAuthorsContentArgs = {
  data: ExternalAuthorsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: Maybe<Scalars['Boolean']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpsertGroupsContentArgs = {
  data: GroupsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: Maybe<Scalars['Boolean']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpsertLabsContentArgs = {
  data: LabsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: Maybe<Scalars['Boolean']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpsertMigrationsContentArgs = {
  data: MigrationsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: Maybe<Scalars['Boolean']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpsertNewsAndEventsContentArgs = {
  data: NewsAndEventsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: Maybe<Scalars['Boolean']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpsertPagesContentArgs = {
  data: PagesDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: Maybe<Scalars['Boolean']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpsertResearchOutputsContentArgs = {
  data: ResearchOutputsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: Maybe<Scalars['Boolean']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpsertResearchTagsContentArgs = {
  data: ResearchTagsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: Maybe<Scalars['Boolean']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpsertTeamsContentArgs = {
  data: TeamsDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: Maybe<Scalars['Boolean']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app mutations. */
export type AppMutationsUpsertUsersContentArgs = {
  data: UsersDataInputDto;
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: Maybe<Scalars['Boolean']>;
  publish?: Maybe<Scalars['Boolean']>;
  status: Maybe<Scalars['String']>;
};

/** The app queries. */
export type AppQueries = {
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
  /** Query Users content items. */
  queryUsersContents: Maybe<Array<Users>>;
  /** Query Users content items with total count. */
  queryUsersContentsWithTotal: Maybe<UsersResultDto>;
};

/** The app queries. */
export type AppQueriesFindAssetArgs = {
  id: Scalars['String'];
};

/** The app queries. */
export type AppQueriesFindCalendarsContentArgs = {
  id: Scalars['String'];
  version: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesFindDashboardContentArgs = {
  id: Scalars['String'];
  version: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesFindDiscoverContentArgs = {
  id: Scalars['String'];
  version: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesFindEventsContentArgs = {
  id: Scalars['String'];
  version: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesFindExternalAuthorsContentArgs = {
  id: Scalars['String'];
  version: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesFindGroupsContentArgs = {
  id: Scalars['String'];
  version: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesFindLabsContentArgs = {
  id: Scalars['String'];
  version: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesFindMigrationsContentArgs = {
  id: Scalars['String'];
  version: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesFindNewsAndEventsContentArgs = {
  id: Scalars['String'];
  version: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesFindPagesContentArgs = {
  id: Scalars['String'];
  version: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesFindResearchOutputsContentArgs = {
  id: Scalars['String'];
  version: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesFindResearchTagsContentArgs = {
  id: Scalars['String'];
  version: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesFindTeamsContentArgs = {
  id: Scalars['String'];
  version: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesFindUsersContentArgs = {
  id: Scalars['String'];
  version: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryAssetsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryAssetsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryCalendarsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryCalendarsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryDashboardContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryDashboardContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryDiscoverContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryDiscoverContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryEventsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryEventsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryExternalAuthorsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryExternalAuthorsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryGroupsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryGroupsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryLabsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryLabsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryMigrationsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryMigrationsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryNewsAndEventsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryNewsAndEventsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryPagesContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryPagesContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryResearchOutputsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryResearchOutputsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryResearchTagsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryResearchTagsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryTeamsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryTeamsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryUsersContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The app queries. */
export type AppQueriesQueryUsersContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
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
  path: Maybe<Scalars['String']>;
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
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Calendars content type. */
export type CalendarsReferencingEventsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Calendars content type. */
export type CalendarsReferencingGroupsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Calendars content type. */
export type CalendarsReferencingGroupsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of the Color field of the Calendars content type. */
export type CalendarsDataColorDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Color field of the Calendars content input type. */
export type CalendarsDataColorInputDto = {
  iv: Maybe<Scalars['String']>;
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
  iv: Maybe<Scalars['Float']>;
};

/** The structure of the Google Calendar ID field of the Calendars content type. */
export type CalendarsDataGoogleCalendarIdDto = {
  /** Make sure this GCal is Public BEFORE adding it. Syncing will NOT work otherwise. */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Google Calendar ID field of the Calendars content input type. */
export type CalendarsDataGoogleCalendarIdInputDto = {
  /** Make sure this GCal is Public BEFORE adding it. Syncing will NOT work otherwise. */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Calendars data input type. */
export type CalendarsDataInputDto = {
  color: Maybe<CalendarsDataColorInputDto>;
  expirationDate: Maybe<CalendarsDataExpirationDateInputDto>;
  googleCalendarId: Maybe<CalendarsDataGoogleCalendarIdInputDto>;
  name: Maybe<CalendarsDataNameInputDto>;
  resourceId: Maybe<CalendarsDataResourceIdInputDto>;
  syncToken: Maybe<CalendarsDataSyncTokenInputDto>;
};

/** The structure of the Name field of the Calendars content type. */
export type CalendarsDataNameDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Name field of the Calendars content input type. */
export type CalendarsDataNameInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Google resource ID field of the Calendars content type. */
export type CalendarsDataResourceIdDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Google resource ID field of the Calendars content input type. */
export type CalendarsDataResourceIdInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Google Last Sync Token field of the Calendars content type. */
export type CalendarsDataSyncTokenDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Google Last Sync Token field of the Calendars content input type. */
export type CalendarsDataSyncTokenInputDto = {
  iv: Maybe<Scalars['String']>;
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
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencesNewsAndEventsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencesPagesContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencesPagesContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of the Dashboard data type. */
export type DashboardDataDto = {
  news: Maybe<DashboardDataNewsDto>;
  pages: Maybe<DashboardDataPagesDto>;
};

/** The structure of the Dashboard data input type. */
export type DashboardDataInputDto = {
  news: Maybe<DashboardDataNewsInputDto>;
  pages: Maybe<DashboardDataPagesInputDto>;
};

/** The structure of the Latest News from ASAP field of the Dashboard content type. */
export type DashboardDataNewsDto = {
  iv: Maybe<Array<NewsAndEvents>>;
};

/** The structure of the Latest News from ASAP field of the Dashboard content input type. */
export type DashboardDataNewsInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Where to Start field of the Dashboard content type. */
export type DashboardDataPagesDto = {
  iv: Maybe<Array<Pages>>;
};

/** The structure of the Where to Start field of the Dashboard content input type. */
export type DashboardDataPagesInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
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
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Discover ASAP content type. */
export type DiscoverReferencesNewsAndEventsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Discover ASAP content type. */
export type DiscoverReferencesPagesContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Discover ASAP content type. */
export type DiscoverReferencesPagesContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Discover ASAP content type. */
export type DiscoverReferencesUsersContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Discover ASAP content type. */
export type DiscoverReferencesUsersContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of the About Us field of the Discover ASAP content type. */
export type DiscoverDataAboutUsDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the About Us field of the Discover ASAP content input type. */
export type DiscoverDataAboutUsInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Discover ASAP data type. */
export type DiscoverDataDto = {
  aboutUs: Maybe<DiscoverDataAboutUsDto>;
  members: Maybe<DiscoverDataMembersDto>;
  pages: Maybe<DiscoverDataPagesDto>;
  scientificAdvisoryBoard: Maybe<DiscoverDataScientificAdvisoryBoardDto>;
  training: Maybe<DiscoverDataTrainingDto>;
};

/** The structure of the Discover ASAP data input type. */
export type DiscoverDataInputDto = {
  aboutUs: Maybe<DiscoverDataAboutUsInputDto>;
  members: Maybe<DiscoverDataMembersInputDto>;
  pages: Maybe<DiscoverDataPagesInputDto>;
  scientificAdvisoryBoard: Maybe<DiscoverDataScientificAdvisoryBoardInputDto>;
  training: Maybe<DiscoverDataTrainingInputDto>;
};

/** The structure of the ASAP Team field of the Discover ASAP content type. */
export type DiscoverDataMembersDto = {
  iv: Maybe<Array<Users>>;
};

/** The structure of the ASAP Team field of the Discover ASAP content input type. */
export type DiscoverDataMembersInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Grantee Guidance field of the Discover ASAP content type. */
export type DiscoverDataPagesDto = {
  iv: Maybe<Array<Pages>>;
};

/** The structure of the Grantee Guidance field of the Discover ASAP content input type. */
export type DiscoverDataPagesInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Scientific Advisory Board field of the Discover ASAP content type. */
export type DiscoverDataScientificAdvisoryBoardDto = {
  iv: Maybe<Array<Users>>;
};

/** The structure of the Scientific Advisory Board field of the Discover ASAP content input type. */
export type DiscoverDataScientificAdvisoryBoardInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Training field of the Discover ASAP content type. */
export type DiscoverDataTrainingDto = {
  iv: Maybe<Array<NewsAndEvents>>;
};

/** The structure of the Training field of the Discover ASAP content input type. */
export type DiscoverDataTrainingInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the flat Discover ASAP data type. */
export type DiscoverFlatDataDto = {
  aboutUs: Maybe<Scalars['String']>;
  members: Maybe<Array<Users>>;
  pages: Maybe<Array<Pages>>;
  scientificAdvisoryBoard: Maybe<Array<Users>>;
  training: Maybe<Array<NewsAndEvents>>;
};

/** List of Discover ASAP items and total count. */
export type DiscoverResultDto = {
  /** The contents. */
  items: Maybe<Array<Discover>>;
  /** The total count of  contents. */
  total: Scalars['Int'];
};

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
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Events content type. */
export type EventsReferencesCalendarsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Events content type. */
export type EventsReferencesExternalAuthorsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Events content type. */
export type EventsReferencesExternalAuthorsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Events content type. */
export type EventsReferencesTeamsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Events content type. */
export type EventsReferencesTeamsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Events content type. */
export type EventsReferencesUsersContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Events content type. */
export type EventsReferencesUsersContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of the Calendar field of the Events content type. */
export type EventsDataCalendarDto = {
  iv: Maybe<Array<Calendars>>;
};

/** The structure of the Calendar field of the Events content input type. */
export type EventsDataCalendarInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Description field of the Events content type. */
export type EventsDataDescriptionDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Description field of the Events content input type. */
export type EventsDataDescriptionInputDto = {
  iv: Maybe<Scalars['String']>;
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
  speakers: Maybe<EventsDataSpeakersDto>;
  startDate: Maybe<EventsDataStartDateDto>;
  startDateTimeZone: Maybe<EventsDataStartDateTimeZoneDto>;
  status: Maybe<EventsDataStatusDto>;
  tags: Maybe<EventsDataTagsDto>;
  thumbnail: Maybe<EventsDataThumbnailDto>;
  title: Maybe<EventsDataTitleDto>;
  videoRecording: Maybe<EventsDataVideoRecordingDto>;
  videoRecordingPermanentlyUnavailable: Maybe<EventsDataVideoRecordingPermanentlyUnavailableDto>;
};

/** The structure of the End Date field of the Events content type. */
export type EventsDataEndDateDto = {
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the End Date field of the Events content input type. */
export type EventsDataEndDateInputDto = {
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the End Date Time Zone field of the Events content type. */
export type EventsDataEndDateTimeZoneDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the End Date Time Zone field of the Events content input type. */
export type EventsDataEndDateTimeZoneInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Google Event Link field of the Events content type. */
export type EventsDataEventLinkDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Google Event Link field of the Events content input type. */
export type EventsDataEventLinkInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Google Id field of the Events content type. */
export type EventsDataGoogleIdDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Google Id field of the Events content input type. */
export type EventsDataGoogleIdInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Hide Event field of the Events content type. */
export type EventsDataHiddenDto = {
  /** Hidden events will NOT show on the Hub. (Note: any event cancelled on GCal will be hidden by default. To show a cancelled event on the Hub, you have to manually un-hide the event here) */
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the Hide Event field of the Events content input type. */
export type EventsDataHiddenInputDto = {
  /** Hidden events will NOT show on the Hub. (Note: any event cancelled on GCal will be hidden by default. To show a cancelled event on the Hub, you have to manually un-hide the event here) */
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the Hide Meeting Link field of the Events content type. */
export type EventsDataHideMeetingLinkDto = {
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the Hide Meeting Link field of the Events content input type. */
export type EventsDataHideMeetingLinkInputDto = {
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the Events data input type. */
export type EventsDataInputDto = {
  calendar: Maybe<EventsDataCalendarInputDto>;
  description: Maybe<EventsDataDescriptionInputDto>;
  endDate: Maybe<EventsDataEndDateInputDto>;
  endDateTimeZone: Maybe<EventsDataEndDateTimeZoneInputDto>;
  eventLink: Maybe<EventsDataEventLinkInputDto>;
  googleId: Maybe<EventsDataGoogleIdInputDto>;
  hidden: Maybe<EventsDataHiddenInputDto>;
  hideMeetingLink: Maybe<EventsDataHideMeetingLinkInputDto>;
  meetingLink: Maybe<EventsDataMeetingLinkInputDto>;
  meetingMaterials: Maybe<EventsDataMeetingMaterialsInputDto>;
  meetingMaterialsPermanentlyUnavailable: Maybe<EventsDataMeetingMaterialsPermanentlyUnavailableInputDto>;
  notes: Maybe<EventsDataNotesInputDto>;
  notesPermanentlyUnavailable: Maybe<EventsDataNotesPermanentlyUnavailableInputDto>;
  presentation: Maybe<EventsDataPresentationInputDto>;
  presentationPermanentlyUnavailable: Maybe<EventsDataPresentationPermanentlyUnavailableInputDto>;
  speakers: Maybe<EventsDataSpeakersInputDto>;
  startDate: Maybe<EventsDataStartDateInputDto>;
  startDateTimeZone: Maybe<EventsDataStartDateTimeZoneInputDto>;
  status: Maybe<EventsDataStatusInputDto>;
  tags: Maybe<EventsDataTagsInputDto>;
  thumbnail: Maybe<EventsDataThumbnailInputDto>;
  title: Maybe<EventsDataTitleInputDto>;
  videoRecording: Maybe<EventsDataVideoRecordingInputDto>;
  videoRecordingPermanentlyUnavailable: Maybe<EventsDataVideoRecordingPermanentlyUnavailableInputDto>;
};

/** The structure of the Meeting Link field of the Events content type. */
export type EventsDataMeetingLinkDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Meeting Link field of the Events content input type. */
export type EventsDataMeetingLinkInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Additional Meeting Materials nested schema. */
export type EventsDataMeetingMaterialsChildDto = {
  title: Maybe<Scalars['String']>;
  url: Maybe<Scalars['String']>;
};

/** The structure of the Additional Meeting Materials nested schema. */
export type EventsDataMeetingMaterialsChildInputDto = {
  title: Maybe<Scalars['String']>;
  url: Maybe<Scalars['String']>;
};

/** The structure of the Additional Meeting Materials field of the Events content type. */
export type EventsDataMeetingMaterialsDto = {
  /** If permanently unavailable box is ticked, any content you put here will be ignored. */
  iv: Maybe<Array<EventsDataMeetingMaterialsChildDto>>;
};

/** The structure of the Additional Meeting Materials field of the Events content input type. */
export type EventsDataMeetingMaterialsInputDto = {
  /** If permanently unavailable box is ticked, any content you put here will be ignored. */
  iv: Maybe<Array<EventsDataMeetingMaterialsChildInputDto>>;
};

/** The structure of the Mark Additional Meeting Materials as permanently unavailable field of the Events content type. */
export type EventsDataMeetingMaterialsPermanentlyUnavailableDto = {
  /** This box is automatically ticked if no output is added after 14 days from the event's end date. */
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the Mark Additional Meeting Materials as permanently unavailable field of the Events content input type. */
export type EventsDataMeetingMaterialsPermanentlyUnavailableInputDto = {
  /** This box is automatically ticked if no output is added after 14 days from the event's end date. */
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the Notes field of the Events content type. */
export type EventsDataNotesDto = {
  /** If permanently unavailable box is ticked, any content you put here will be ignored. */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Notes field of the Events content input type. */
export type EventsDataNotesInputDto = {
  /** If permanently unavailable box is ticked, any content you put here will be ignored. */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Mark Notes as permanently unavailable field of the Events content type. */
export type EventsDataNotesPermanentlyUnavailableDto = {
  /** This box is automatically ticked if no output is added after 14 days from the event's end date. */
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the Mark Notes as permanently unavailable field of the Events content input type. */
export type EventsDataNotesPermanentlyUnavailableInputDto = {
  /** This box is automatically ticked if no output is added after 14 days from the event's end date. */
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the Presentation field of the Events content type. */
export type EventsDataPresentationDto = {
  /** If permanently unavailable box is ticked, any content you put here will be ignored. */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Presentation field of the Events content input type. */
export type EventsDataPresentationInputDto = {
  /** If permanently unavailable box is ticked, any content you put here will be ignored. */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Mark Presentation as permanently unavailable field of the Events content type. */
export type EventsDataPresentationPermanentlyUnavailableDto = {
  /** This box is automatically ticked if no output is added after 14 days from the event's end date. */
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the Mark Presentation as permanently unavailable field of the Events content input type. */
export type EventsDataPresentationPermanentlyUnavailableInputDto = {
  /** This box is automatically ticked if no output is added after 14 days from the event's end date. */
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the Speakers nested schema. */
export type EventsDataSpeakersChildDto = {
  team: Maybe<Array<Teams>>;
  user: Maybe<Array<EventsDataSpeakersUserUnionDto>>;
};

/** The structure of the Speakers nested schema. */
export type EventsDataSpeakersChildInputDto = {
  team: Maybe<Array<Scalars['String']>>;
  user: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Speakers field of the Events content type. */
export type EventsDataSpeakersDto = {
  iv: Maybe<Array<EventsDataSpeakersChildDto>>;
};

/** The structure of the Speakers field of the Events content input type. */
export type EventsDataSpeakersInputDto = {
  iv: Maybe<Array<EventsDataSpeakersChildInputDto>>;
};

export type EventsDataSpeakersUserUnionDto = ExternalAuthors | Users;

/** The structure of the Start Date field of the Events content type. */
export type EventsDataStartDateDto = {
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the Start Date field of the Events content input type. */
export type EventsDataStartDateInputDto = {
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the Start Date Time Zone field of the Events content type. */
export type EventsDataStartDateTimeZoneDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Start Date Time Zone field of the Events content input type. */
export type EventsDataStartDateTimeZoneInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Status field of the Events content type. */
export type EventsDataStatusDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Status field of the Events content input type. */
export type EventsDataStatusInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Tags field of the Events content type. */
export type EventsDataTagsDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Tags field of the Events content input type. */
export type EventsDataTagsInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Thumbnail field of the Events content type. */
export type EventsDataThumbnailDto = {
  iv: Maybe<Array<Asset>>;
};

/** The structure of the Thumbnail field of the Events content input type. */
export type EventsDataThumbnailInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Title field of the Events content type. */
export type EventsDataTitleDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Title field of the Events content input type. */
export type EventsDataTitleInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Video Recording field of the Events content type. */
export type EventsDataVideoRecordingDto = {
  /** If permanently unavailable box is ticked, any content you put here will be ignored. */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Video Recording field of the Events content input type. */
export type EventsDataVideoRecordingInputDto = {
  /** If permanently unavailable box is ticked, any content you put here will be ignored. */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Mark Video Recording as permanently unavailable field of the Events content type. */
export type EventsDataVideoRecordingPermanentlyUnavailableDto = {
  /** This box is automatically ticked if no output is added after 14 days from the event's end date. */
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the Mark Video Recording as permanently unavailable field of the Events content input type. */
export type EventsDataVideoRecordingPermanentlyUnavailableInputDto = {
  /** This box is automatically ticked if no output is added after 14 days from the event's end date. */
  iv: Maybe<Scalars['Boolean']>;
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
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a External authors content type. */
export type ExternalAuthorsReferencingEventsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a External authors content type. */
export type ExternalAuthorsReferencingResearchOutputsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a External authors content type. */
export type ExternalAuthorsReferencingResearchOutputsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of the External authors data type. */
export type ExternalAuthorsDataDto = {
  name: Maybe<ExternalAuthorsDataNameDto>;
  orcid: Maybe<ExternalAuthorsDataOrcidDto>;
};

/** The structure of the External authors data input type. */
export type ExternalAuthorsDataInputDto = {
  name: Maybe<ExternalAuthorsDataNameInputDto>;
  orcid: Maybe<ExternalAuthorsDataOrcidInputDto>;
};

/** The structure of the Name field of the External authors content type. */
export type ExternalAuthorsDataNameDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Name field of the External authors content input type. */
export type ExternalAuthorsDataNameInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the ORCID field of the External authors content type. */
export type ExternalAuthorsDataOrcidDto = {
  /** ORCIDs cannot be repeated on the Hub */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the ORCID field of the External authors content input type. */
export type ExternalAuthorsDataOrcidInputDto = {
  /** ORCIDs cannot be repeated on the Hub */
  iv: Maybe<Scalars['String']>;
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
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Groups content type. */
export type GroupsReferencesCalendarsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Groups content type. */
export type GroupsReferencesTeamsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Groups content type. */
export type GroupsReferencesTeamsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Groups content type. */
export type GroupsReferencesUsersContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Groups content type. */
export type GroupsReferencesUsersContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of the This group is active field of the Groups content type. */
export type GroupsDataActiveDto = {
  /** Active groups have Subscribe buttons and Calendar and Upcoming Events tabs */
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the This group is active field of the Groups content input type. */
export type GroupsDataActiveInputDto = {
  /** Active groups have Subscribe buttons and Calendar and Upcoming Events tabs */
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the Calendars field of the Groups content type. */
export type GroupsDataCalendarsDto = {
  iv: Maybe<Array<Calendars>>;
};

/** The structure of the Calendars field of the Groups content input type. */
export type GroupsDataCalendarsInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Description field of the Groups content type. */
export type GroupsDataDescriptionDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Description field of the Groups content input type. */
export type GroupsDataDescriptionInputDto = {
  iv: Maybe<Scalars['String']>;
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
  active: Maybe<GroupsDataActiveInputDto>;
  calendars: Maybe<GroupsDataCalendarsInputDto>;
  description: Maybe<GroupsDataDescriptionInputDto>;
  leaders: Maybe<GroupsDataLeadersInputDto>;
  name: Maybe<GroupsDataNameInputDto>;
  tags: Maybe<GroupsDataTagsInputDto>;
  teams: Maybe<GroupsDataTeamsInputDto>;
  thumbnail: Maybe<GroupsDataThumbnailInputDto>;
  tools: Maybe<GroupsDataToolsInputDto>;
};

/** The structure of the Leaders nested schema. */
export type GroupsDataLeadersChildDto = {
  role: Maybe<Scalars['String']>;
  user: Maybe<Array<Users>>;
};

/** The structure of the Leaders nested schema. */
export type GroupsDataLeadersChildInputDto = {
  role: Maybe<Scalars['String']>;
  user: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Leaders field of the Groups content type. */
export type GroupsDataLeadersDto = {
  iv: Maybe<Array<GroupsDataLeadersChildDto>>;
};

/** The structure of the Leaders field of the Groups content input type. */
export type GroupsDataLeadersInputDto = {
  iv: Maybe<Array<GroupsDataLeadersChildInputDto>>;
};

/** The structure of the Name field of the Groups content type. */
export type GroupsDataNameDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Name field of the Groups content input type. */
export type GroupsDataNameInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Expertise (Tags) field of the Groups content type. */
export type GroupsDataTagsDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Expertise (Tags) field of the Groups content input type. */
export type GroupsDataTagsInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Teams field of the Groups content type. */
export type GroupsDataTeamsDto = {
  iv: Maybe<Array<Teams>>;
};

/** The structure of the Teams field of the Groups content input type. */
export type GroupsDataTeamsInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Thumbnail field of the Groups content type. */
export type GroupsDataThumbnailDto = {
  iv: Maybe<Array<Asset>>;
};

/** The structure of the Thumbnail field of the Groups content input type. */
export type GroupsDataThumbnailInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the External Tools nested schema. */
export type GroupsDataToolsChildDto = {
  googleDrive: Maybe<Scalars['String']>;
  slack: Maybe<Scalars['String']>;
};

/** The structure of the External Tools nested schema. */
export type GroupsDataToolsChildInputDto = {
  googleDrive: Maybe<Scalars['String']>;
  slack: Maybe<Scalars['String']>;
};

/** The structure of the External Tools field of the Groups content type. */
export type GroupsDataToolsDto = {
  iv: Maybe<Array<GroupsDataToolsChildDto>>;
};

/** The structure of the External Tools field of the Groups content input type. */
export type GroupsDataToolsInputDto = {
  iv: Maybe<Array<GroupsDataToolsChildInputDto>>;
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
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Labs content type. */
export type LabsReferencingResearchOutputsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Labs content type. */
export type LabsReferencingUsersContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Labs content type. */
export type LabsReferencingUsersContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of the Labs data type. */
export type LabsDataDto = {
  name: Maybe<LabsDataNameDto>;
};

/** The structure of the Labs data input type. */
export type LabsDataInputDto = {
  name: Maybe<LabsDataNameInputDto>;
};

/** The structure of the Name field of the Labs content type. */
export type LabsDataNameDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Name field of the Labs content input type. */
export type LabsDataNameInputDto = {
  iv: Maybe<Scalars['String']>;
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
  name: Maybe<MigrationsDataNameInputDto>;
};

/** The structure of the Name field of the Migrations content type. */
export type MigrationsDataNameDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Name field of the Migrations content input type. */
export type MigrationsDataNameInputDto = {
  iv: Maybe<Scalars['String']>;
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
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a News content type. */
export type NewsAndEventsReferencingDashboardContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a News content type. */
export type NewsAndEventsReferencingDiscoverContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a News content type. */
export type NewsAndEventsReferencingDiscoverContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of the Event Date field of the News content type. */
export type NewsAndEventsDataDateDto = {
  /** Property only used on Event type items */
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the Event Date field of the News content input type. */
export type NewsAndEventsDataDateInputDto = {
  /** Property only used on Event type items */
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the News data type. */
export type NewsAndEventsDataDto = {
  date: Maybe<NewsAndEventsDataDateDto>;
  link: Maybe<NewsAndEventsDataLinkDto>;
  linkText: Maybe<NewsAndEventsDataLinkTextDto>;
  shortText: Maybe<NewsAndEventsDataShortTextDto>;
  text: Maybe<NewsAndEventsDataTextDto>;
  thumbnail: Maybe<NewsAndEventsDataThumbnailDto>;
  title: Maybe<NewsAndEventsDataTitleDto>;
  type: Maybe<NewsAndEventsDataTypeDto>;
};

/** The structure of the News data input type. */
export type NewsAndEventsDataInputDto = {
  date: Maybe<NewsAndEventsDataDateInputDto>;
  link: Maybe<NewsAndEventsDataLinkInputDto>;
  linkText: Maybe<NewsAndEventsDataLinkTextInputDto>;
  shortText: Maybe<NewsAndEventsDataShortTextInputDto>;
  text: Maybe<NewsAndEventsDataTextInputDto>;
  thumbnail: Maybe<NewsAndEventsDataThumbnailInputDto>;
  title: Maybe<NewsAndEventsDataTitleInputDto>;
  type: Maybe<NewsAndEventsDataTypeInputDto>;
};

/** The structure of the External Link field of the News content type. */
export type NewsAndEventsDataLinkDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the External Link field of the News content input type. */
export type NewsAndEventsDataLinkInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the External Link Text field of the News content type. */
export type NewsAndEventsDataLinkTextDto = {
  /** Leave this empty to show "Open External Link" */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the External Link Text field of the News content input type. */
export type NewsAndEventsDataLinkTextInputDto = {
  /** Leave this empty to show "Open External Link" */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Short Text field of the News content type. */
export type NewsAndEventsDataShortTextDto = {
  /** The text visible on the card version of News and Events */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Short Text field of the News content input type. */
export type NewsAndEventsDataShortTextInputDto = {
  /** The text visible on the card version of News and Events */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Text field of the News content type. */
export type NewsAndEventsDataTextDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Text field of the News content input type. */
export type NewsAndEventsDataTextInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Thumbnail field of the News content type. */
export type NewsAndEventsDataThumbnailDto = {
  iv: Maybe<Array<Asset>>;
};

/** The structure of the Thumbnail field of the News content input type. */
export type NewsAndEventsDataThumbnailInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Title field of the News content type. */
export type NewsAndEventsDataTitleDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Title field of the News content input type. */
export type NewsAndEventsDataTitleInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Type field of the News content type. */
export type NewsAndEventsDataTypeDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Type field of the News content input type. */
export type NewsAndEventsDataTypeInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the flat News data type. */
export type NewsAndEventsFlatDataDto = {
  /** Property only used on Event type items */
  date: Maybe<Scalars['Instant']>;
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
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Pages content type. */
export type PagesReferencingDashboardContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Pages content type. */
export type PagesReferencingDiscoverContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Pages content type. */
export type PagesReferencingDiscoverContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
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
  link: Maybe<PagesDataLinkInputDto>;
  linkText: Maybe<PagesDataLinkTextInputDto>;
  path: Maybe<PagesDataPathInputDto>;
  shortText: Maybe<PagesDataShortTextInputDto>;
  text: Maybe<PagesDataTextInputDto>;
  title: Maybe<PagesDataTitleInputDto>;
};

/** The structure of the External Link field of the Pages content type. */
export type PagesDataLinkDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the External Link field of the Pages content input type. */
export type PagesDataLinkInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the External Link Text field of the Pages content type. */
export type PagesDataLinkTextDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the External Link Text field of the Pages content input type. */
export type PagesDataLinkTextInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Path field of the Pages content type. */
export type PagesDataPathDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Path field of the Pages content input type. */
export type PagesDataPathInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Short Text field of the Pages content type. */
export type PagesDataShortTextDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Short Text field of the Pages content input type. */
export type PagesDataShortTextInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Text field of the Pages content type. */
export type PagesDataTextDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Text field of the Pages content input type. */
export type PagesDataTextInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Title field of the Pages content type. */
export type PagesDataTitleDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Title field of the Pages content input type. */
export type PagesDataTitleInputDto = {
  iv: Maybe<Scalars['String']>;
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
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Research Outputs content type. */
export type ResearchOutputsReferencesExternalAuthorsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Research Outputs content type. */
export type ResearchOutputsReferencesLabsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Research Outputs content type. */
export type ResearchOutputsReferencesLabsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Research Outputs content type. */
export type ResearchOutputsReferencesResearchTagsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Research Outputs content type. */
export type ResearchOutputsReferencesResearchTagsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Research Outputs content type. */
export type ResearchOutputsReferencesUsersContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Research Outputs content type. */
export type ResearchOutputsReferencesUsersContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Research Outputs content type. */
export type ResearchOutputsReferencingTeamsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Research Outputs content type. */
export type ResearchOutputsReferencingTeamsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of the Access Instructions field of the Research Outputs content type. */
export type ResearchOutputsDataAccessInstructionsDto = {
  /** The Hub will only show text or hyperlinks. Other formatting will be ignored (e.g. bold, color, size) */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Access Instructions field of the Research Outputs content input type. */
export type ResearchOutputsDataAccessInstructionsInputDto = {
  /** The Hub will only show text or hyperlinks. Other formatting will be ignored (e.g. bold, color, size) */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Identifier (Accession #) field of the Research Outputs content type. */
export type ResearchOutputsDataAccessionDto = {
  /** This must start with a letter */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Identifier (Accession #) field of the Research Outputs content input type. */
export type ResearchOutputsDataAccessionInputDto = {
  /** This must start with a letter */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Added Date field of the Research Outputs content type. */
export type ResearchOutputsDataAddedDateDto = {
  /** Date output was shared with ASAP Network (different from publication date) */
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the Added Date field of the Research Outputs content input type. */
export type ResearchOutputsDataAddedDateInputDto = {
  /** Date output was shared with ASAP Network (different from publication date) */
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the Admin notes field of the Research Outputs content type. */
export type ResearchOutputsDataAdminNotesDto = {
  /** This is ASAP internal content and it's not being shown on the Hub */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Admin notes field of the Research Outputs content input type. */
export type ResearchOutputsDataAdminNotesInputDto = {
  /** This is ASAP internal content and it's not being shown on the Hub */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the ASAP Funded field of the Research Outputs content type. */
export type ResearchOutputsDataAsapFundedDto = {
  /** "Not sure" will not be shown on the Hub */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the ASAP Funded field of the Research Outputs content input type. */
export type ResearchOutputsDataAsapFundedInputDto = {
  /** "Not sure" will not be shown on the Hub */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Authors field of the Research Outputs content type. */
export type ResearchOutputsDataAuthorsDto = {
  iv: Maybe<Array<ResearchOutputsDataAuthorsUnionDto>>;
};

/** The structure of the Authors field of the Research Outputs content input type. */
export type ResearchOutputsDataAuthorsInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

export type ResearchOutputsDataAuthorsUnionDto = ExternalAuthors | Users;

/** The structure of the Created by field of the Research Outputs content type. */
export type ResearchOutputsDataCreatedByDto = {
  iv: Maybe<Array<Users>>;
};

/** The structure of the Created by field of the Research Outputs content input type. */
export type ResearchOutputsDataCreatedByInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Description field of the Research Outputs content type. */
export type ResearchOutputsDataDescriptionDto = {
  /** The Hub will only show text or hyperlinks. Other formatting will be ignored (e.g. bold, color, size) */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Description field of the Research Outputs content input type. */
export type ResearchOutputsDataDescriptionInputDto = {
  /** The Hub will only show text or hyperlinks. Other formatting will be ignored (e.g. bold, color, size) */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Document type field of the Research Outputs content type. */
export type ResearchOutputsDataDocumentTypeDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Document type field of the Research Outputs content input type. */
export type ResearchOutputsDataDocumentTypeInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Identifier (DOI) field of the Research Outputs content type. */
export type ResearchOutputsDataDoiDto = {
  /** DOIs must start with a number and cannot be a URL */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Identifier (DOI) field of the Research Outputs content input type. */
export type ResearchOutputsDataDoiInputDto = {
  /** DOIs must start with a number and cannot be a URL */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Research Outputs data type. */
export type ResearchOutputsDataDto = {
  accessInstructions: Maybe<ResearchOutputsDataAccessInstructionsDto>;
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
  usedInAPublication: Maybe<ResearchOutputsDataUsedInAPublicationDto>;
};

/** The structure of the Environment field of the Research Outputs content type. */
export type ResearchOutputsDataEnvironmentsDto = {
  iv: Maybe<Array<ResearchTags>>;
};

/** The structure of the Environment field of the Research Outputs content input type. */
export type ResearchOutputsDataEnvironmentsInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Research Outputs data input type. */
export type ResearchOutputsDataInputDto = {
  accessInstructions: Maybe<ResearchOutputsDataAccessInstructionsInputDto>;
  accession: Maybe<ResearchOutputsDataAccessionInputDto>;
  addedDate: Maybe<ResearchOutputsDataAddedDateInputDto>;
  adminNotes: Maybe<ResearchOutputsDataAdminNotesInputDto>;
  asapFunded: Maybe<ResearchOutputsDataAsapFundedInputDto>;
  authors: Maybe<ResearchOutputsDataAuthorsInputDto>;
  createdBy: Maybe<ResearchOutputsDataCreatedByInputDto>;
  description: Maybe<ResearchOutputsDataDescriptionInputDto>;
  documentType: Maybe<ResearchOutputsDataDocumentTypeInputDto>;
  doi: Maybe<ResearchOutputsDataDoiInputDto>;
  environments: Maybe<ResearchOutputsDataEnvironmentsInputDto>;
  labCatalogNumber: Maybe<ResearchOutputsDataLabCatalogNumberInputDto>;
  labs: Maybe<ResearchOutputsDataLabsInputDto>;
  lastUpdatedPartial: Maybe<ResearchOutputsDataLastUpdatedPartialInputDto>;
  link: Maybe<ResearchOutputsDataLinkInputDto>;
  methods: Maybe<ResearchOutputsDataMethodsInputDto>;
  organisms: Maybe<ResearchOutputsDataOrganismsInputDto>;
  publishDate: Maybe<ResearchOutputsDataPublishDateInputDto>;
  rrid: Maybe<ResearchOutputsDataRridInputDto>;
  sharingStatus: Maybe<ResearchOutputsDataSharingStatusInputDto>;
  subtype: Maybe<ResearchOutputsDataSubtypeInputDto>;
  tags: Maybe<ResearchOutputsDataTagsInputDto>;
  title: Maybe<ResearchOutputsDataTitleInputDto>;
  type: Maybe<ResearchOutputsDataTypeInputDto>;
  updatedBy: Maybe<ResearchOutputsDataUpdatedByInputDto>;
  usedInAPublication: Maybe<ResearchOutputsDataUsedInAPublicationInputDto>;
};

/** The structure of the Lab Catalog Number field of the Research Outputs content type. */
export type ResearchOutputsDataLabCatalogNumberDto = {
  /** If this is a hyperlink, please start with "http://" or "https://" */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Lab Catalog Number field of the Research Outputs content input type. */
export type ResearchOutputsDataLabCatalogNumberInputDto = {
  /** If this is a hyperlink, please start with "http://" or "https://" */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Labs field of the Research Outputs content type. */
export type ResearchOutputsDataLabsDto = {
  iv: Maybe<Array<Labs>>;
};

/** The structure of the Labs field of the Research Outputs content input type. */
export type ResearchOutputsDataLabsInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Last Updated (partial) field of the Research Outputs content type. */
export type ResearchOutputsDataLastUpdatedPartialDto = {
  /** Does not include changes to Publish Date and Admin notes */
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the Last Updated (partial) field of the Research Outputs content input type. */
export type ResearchOutputsDataLastUpdatedPartialInputDto = {
  /** Does not include changes to Publish Date and Admin notes */
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the External Link field of the Research Outputs content type. */
export type ResearchOutputsDataLinkDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the External Link field of the Research Outputs content input type. */
export type ResearchOutputsDataLinkInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Methods field of the Research Outputs content type. */
export type ResearchOutputsDataMethodsDto = {
  iv: Maybe<Array<ResearchTags>>;
};

/** The structure of the Methods field of the Research Outputs content input type. */
export type ResearchOutputsDataMethodsInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Organism field of the Research Outputs content type. */
export type ResearchOutputsDataOrganismsDto = {
  iv: Maybe<Array<ResearchTags>>;
};

/** The structure of the Organism field of the Research Outputs content input type. */
export type ResearchOutputsDataOrganismsInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Publish Date field of the Research Outputs content type. */
export type ResearchOutputsDataPublishDateDto = {
  /** Date of publishing (outside the Hub). Only applies to outputs that have been published. */
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the Publish Date field of the Research Outputs content input type. */
export type ResearchOutputsDataPublishDateInputDto = {
  /** Date of publishing (outside the Hub). Only applies to outputs that have been published. */
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the Identifier (RRID) field of the Research Outputs content type. */
export type ResearchOutputsDataRridDto = {
  /** This must start with "RRID:" */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Identifier (RRID) field of the Research Outputs content input type. */
export type ResearchOutputsDataRridInputDto = {
  /** This must start with "RRID:" */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Sharing Status field of the Research Outputs content type. */
export type ResearchOutputsDataSharingStatusDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Sharing Status field of the Research Outputs content input type. */
export type ResearchOutputsDataSharingStatusInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Subtype field of the Research Outputs content type. */
export type ResearchOutputsDataSubtypeDto = {
  iv: Maybe<Array<ResearchTags>>;
};

/** The structure of the Subtype field of the Research Outputs content input type. */
export type ResearchOutputsDataSubtypeInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Tags field of the Research Outputs content type. */
export type ResearchOutputsDataTagsDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Tags field of the Research Outputs content input type. */
export type ResearchOutputsDataTagsInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Title field of the Research Outputs content type. */
export type ResearchOutputsDataTitleDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Title field of the Research Outputs content input type. */
export type ResearchOutputsDataTitleInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Type field of the Research Outputs content type. */
export type ResearchOutputsDataTypeDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Type field of the Research Outputs content input type. */
export type ResearchOutputsDataTypeInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Updated by field of the Research Outputs content type. */
export type ResearchOutputsDataUpdatedByDto = {
  iv: Maybe<Array<Users>>;
};

/** The structure of the Updated by field of the Research Outputs content input type. */
export type ResearchOutputsDataUpdatedByInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Used in a Publication field of the Research Outputs content type. */
export type ResearchOutputsDataUsedInAPublicationDto = {
  /** "Not sure" will not be shown on the Hub */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Used in a Publication field of the Research Outputs content input type. */
export type ResearchOutputsDataUsedInAPublicationInputDto = {
  /** "Not sure" will not be shown on the Hub */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the flat Research Outputs data type. */
export type ResearchOutputsFlatDataDto = {
  /** The Hub will only show text or hyperlinks. Other formatting will be ignored (e.g. bold, color, size) */
  accessInstructions: Maybe<Scalars['String']>;
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
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Research Tags content type. */
export type ResearchTagsReferencingResearchOutputsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of the Category field of the Research Tags content type. */
export type ResearchTagsDataCategoryDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Category field of the Research Tags content input type. */
export type ResearchTagsDataCategoryInputDto = {
  iv: Maybe<Scalars['String']>;
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
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Research Tags data input type. */
export type ResearchTagsDataInputDto = {
  category: Maybe<ResearchTagsDataCategoryInputDto>;
  entities: Maybe<ResearchTagsDataEntitiesInputDto>;
  name: Maybe<ResearchTagsDataNameInputDto>;
  types: Maybe<ResearchTagsDataTypesInputDto>;
};

/** The structure of the Name field of the Research Tags content type. */
export type ResearchTagsDataNameDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Name field of the Research Tags content input type. */
export type ResearchTagsDataNameInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Types field of the Research Tags content type. */
export type ResearchTagsDataTypesDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Types field of the Research Tags content input type. */
export type ResearchTagsDataTypesInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
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
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Teams content type. */
export type TeamsReferencesResearchOutputsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Teams content type. */
export type TeamsReferencingEventsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Teams content type. */
export type TeamsReferencingEventsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Teams content type. */
export type TeamsReferencingGroupsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Teams content type. */
export type TeamsReferencingGroupsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Teams content type. */
export type TeamsReferencingUsersContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Teams content type. */
export type TeamsReferencingUsersContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of the Application Number field of the Teams content type. */
export type TeamsDataApplicationNumberDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Application Number field of the Teams content input type. */
export type TeamsDataApplicationNumberInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Display Name field of the Teams content type. */
export type TeamsDataDisplayNameDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Display Name field of the Teams content input type. */
export type TeamsDataDisplayNameInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Teams data type. */
export type TeamsDataDto = {
  applicationNumber: Maybe<TeamsDataApplicationNumberDto>;
  displayName: Maybe<TeamsDataDisplayNameDto>;
  expertiseAndResourceTags: Maybe<TeamsDataExpertiseAndResourceTagsDto>;
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
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Teams data input type. */
export type TeamsDataInputDto = {
  applicationNumber: Maybe<TeamsDataApplicationNumberInputDto>;
  displayName: Maybe<TeamsDataDisplayNameInputDto>;
  expertiseAndResourceTags: Maybe<TeamsDataExpertiseAndResourceTagsInputDto>;
  outputs: Maybe<TeamsDataOutputsInputDto>;
  projectSummary: Maybe<TeamsDataProjectSummaryInputDto>;
  projectTitle: Maybe<TeamsDataProjectTitleInputDto>;
  proposal: Maybe<TeamsDataProposalInputDto>;
  tools: Maybe<TeamsDataToolsInputDto>;
};

/** The structure of the Shared Research field of the Teams content type. */
export type TeamsDataOutputsDto = {
  iv: Maybe<Array<ResearchOutputs>>;
};

/** The structure of the Shared Research field of the Teams content input type. */
export type TeamsDataOutputsInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Project Summary field of the Teams content type. */
export type TeamsDataProjectSummaryDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Project Summary field of the Teams content input type. */
export type TeamsDataProjectSummaryInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Project Title field of the Teams content type. */
export type TeamsDataProjectTitleDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Project Title field of the Teams content input type. */
export type TeamsDataProjectTitleInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Proposal field of the Teams content type. */
export type TeamsDataProposalDto = {
  iv: Maybe<Array<ResearchOutputs>>;
};

/** The structure of the Proposal field of the Teams content input type. */
export type TeamsDataProposalInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the External Tools nested schema. */
export type TeamsDataToolsChildDto = {
  description: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
  url: Maybe<Scalars['String']>;
};

/** The structure of the External Tools nested schema. */
export type TeamsDataToolsChildInputDto = {
  description: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
  url: Maybe<Scalars['String']>;
};

/** The structure of the External Tools field of the Teams content type. */
export type TeamsDataToolsDto = {
  iv: Maybe<Array<TeamsDataToolsChildDto>>;
};

/** The structure of the External Tools field of the Teams content input type. */
export type TeamsDataToolsInputDto = {
  iv: Maybe<Array<TeamsDataToolsChildInputDto>>;
};

/** The structure of the flat Teams data type. */
export type TeamsFlatDataDto = {
  applicationNumber: Maybe<Scalars['String']>;
  displayName: Maybe<Scalars['String']>;
  expertiseAndResourceTags: Maybe<Array<Scalars['String']>>;
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
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencesLabsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencesTeamsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencesTeamsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingDiscoverContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingDiscoverContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingEventsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingEventsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingGroupsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingGroupsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingResearchOutputsContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingResearchOutputsContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of the Admin Notes field of the Users content type. */
export type UsersDataAdminNotesDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Admin Notes field of the Users content input type. */
export type UsersDataAdminNotesInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Avatar field of the Users content type. */
export type UsersDataAvatarDto = {
  iv: Maybe<Array<Asset>>;
};

/** The structure of the Avatar field of the Users content input type. */
export type UsersDataAvatarInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Biography field of the Users content type. */
export type UsersDataBiographyDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Biography field of the Users content input type. */
export type UsersDataBiographyInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the City field of the Users content type. */
export type UsersDataCityDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the City field of the Users content input type. */
export type UsersDataCityInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Connections nested schema. */
export type UsersDataConnectionsChildDto = {
  code: Maybe<Scalars['String']>;
};

/** The structure of the Connections nested schema. */
export type UsersDataConnectionsChildInputDto = {
  code: Maybe<Scalars['String']>;
};

/** The structure of the Connections field of the Users content type. */
export type UsersDataConnectionsDto = {
  iv: Maybe<Array<UsersDataConnectionsChildDto>>;
};

/** The structure of the Connections field of the Users content input type. */
export type UsersDataConnectionsInputDto = {
  iv: Maybe<Array<UsersDataConnectionsChildInputDto>>;
};

/** The structure of the Correspondence Email field of the Users content type. */
export type UsersDataContactEmailDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Correspondence Email field of the Users content input type. */
export type UsersDataContactEmailInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Country field of the Users content type. */
export type UsersDataCountryDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Country field of the Users content input type. */
export type UsersDataCountryInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Degree field of the Users content type. */
export type UsersDataDegreeDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Degree field of the Users content input type. */
export type UsersDataDegreeInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Users data type. */
export type UsersDataDto = {
  adminNotes: Maybe<UsersDataAdminNotesDto>;
  avatar: Maybe<UsersDataAvatarDto>;
  biography: Maybe<UsersDataBiographyDto>;
  city: Maybe<UsersDataCityDto>;
  connections: Maybe<UsersDataConnectionsDto>;
  contactEmail: Maybe<UsersDataContactEmailDto>;
  country: Maybe<UsersDataCountryDto>;
  degree: Maybe<UsersDataDegreeDto>;
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
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Expertise and Resources Description field of the Users content type. */
export type UsersDataExpertiseAndResourceDescriptionDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Expertise and Resources Description field of the Users content input type. */
export type UsersDataExpertiseAndResourceDescriptionInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Expertise and Resources field of the Users content type. */
export type UsersDataExpertiseAndResourceTagsDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Expertise and Resources field of the Users content input type. */
export type UsersDataExpertiseAndResourceTagsInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the First Name field of the Users content type. */
export type UsersDataFirstNameDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the First Name field of the Users content input type. */
export type UsersDataFirstNameInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Users data input type. */
export type UsersDataInputDto = {
  adminNotes: Maybe<UsersDataAdminNotesInputDto>;
  avatar: Maybe<UsersDataAvatarInputDto>;
  biography: Maybe<UsersDataBiographyInputDto>;
  city: Maybe<UsersDataCityInputDto>;
  connections: Maybe<UsersDataConnectionsInputDto>;
  contactEmail: Maybe<UsersDataContactEmailInputDto>;
  country: Maybe<UsersDataCountryInputDto>;
  degree: Maybe<UsersDataDegreeInputDto>;
  email: Maybe<UsersDataEmailInputDto>;
  expertiseAndResourceDescription: Maybe<UsersDataExpertiseAndResourceDescriptionInputDto>;
  expertiseAndResourceTags: Maybe<UsersDataExpertiseAndResourceTagsInputDto>;
  firstName: Maybe<UsersDataFirstNameInputDto>;
  institution: Maybe<UsersDataInstitutionInputDto>;
  jobTitle: Maybe<UsersDataJobTitleInputDto>;
  labs: Maybe<UsersDataLabsInputDto>;
  lastModifiedDate: Maybe<UsersDataLastModifiedDateInputDto>;
  lastName: Maybe<UsersDataLastNameInputDto>;
  onboarded: Maybe<UsersDataOnboardedInputDto>;
  orcid: Maybe<UsersDataOrcidInputDto>;
  orcidLastModifiedDate: Maybe<UsersDataOrcidLastModifiedDateInputDto>;
  orcidLastSyncDate: Maybe<UsersDataOrcidLastSyncDateInputDto>;
  orcidWorks: Maybe<UsersDataOrcidWorksInputDto>;
  questions: Maybe<UsersDataQuestionsInputDto>;
  reachOut: Maybe<UsersDataReachOutInputDto>;
  researchInterests: Maybe<UsersDataResearchInterestsInputDto>;
  responsibilities: Maybe<UsersDataResponsibilitiesInputDto>;
  role: Maybe<UsersDataRoleInputDto>;
  social: Maybe<UsersDataSocialInputDto>;
  teams: Maybe<UsersDataTeamsInputDto>;
};

/** The structure of the Institution field of the Users content type. */
export type UsersDataInstitutionDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Institution field of the Users content input type. */
export type UsersDataInstitutionInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Job Title field of the Users content type. */
export type UsersDataJobTitleDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Job Title field of the Users content input type. */
export type UsersDataJobTitleInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Labs field of the Users content type. */
export type UsersDataLabsDto = {
  /** Mandatory for grantees. They cannot publish profile without a lab. */
  iv: Maybe<Array<Labs>>;
};

/** The structure of the Labs field of the Users content input type. */
export type UsersDataLabsInputDto = {
  /** Mandatory for grantees. They cannot publish profile without a lab. */
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Last Modified Date field of the Users content type. */
export type UsersDataLastModifiedDateDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Last Modified Date field of the Users content input type. */
export type UsersDataLastModifiedDateInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Last Name field of the Users content type. */
export type UsersDataLastNameDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Last Name field of the Users content input type. */
export type UsersDataLastNameInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Onboarding complete field of the Users content type. */
export type UsersDataOnboardedDto = {
  /** Use this to allow the user to see the full Hub and skip profile completion */
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the Onboarding complete field of the Users content input type. */
export type UsersDataOnboardedInputDto = {
  /** Use this to allow the user to see the full Hub and skip profile completion */
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the ORCID field of the Users content type. */
export type UsersDataOrcidDto = {
  /** Mandatory for grantees. They cannot publish profile without an ORCID. ORCIDs cannot be repeated on the Hub */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the ORCID field of the Users content input type. */
export type UsersDataOrcidInputDto = {
  /** Mandatory for grantees. They cannot publish profile without an ORCID. ORCIDs cannot be repeated on the Hub */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the ORCID Last Modified Date field of the Users content type. */
export type UsersDataOrcidLastModifiedDateDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the ORCID Last Modified Date field of the Users content input type. */
export type UsersDataOrcidLastModifiedDateInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the ORCID Last Sync Date field of the Users content type. */
export type UsersDataOrcidLastSyncDateDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the ORCID Last Sync Date field of the Users content input type. */
export type UsersDataOrcidLastSyncDateInputDto = {
  iv: Maybe<Scalars['String']>;
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
  path: Maybe<Scalars['String']>;
};

/** The structure of the ORCID Works nested schema. */
export type UsersDataOrcidWorksChildInputDto = {
  doi: Maybe<Scalars['String']>;
  id: Maybe<Scalars['String']>;
  lastModifiedDate: Maybe<Scalars['String']>;
  publicationDate: Maybe<Scalars['JsonScalar']>;
  title: Maybe<Scalars['String']>;
  type: Maybe<Scalars['String']>;
};

/** The structure of the ORCID Works field of the Users content type. */
export type UsersDataOrcidWorksDto = {
  iv: Maybe<Array<UsersDataOrcidWorksChildDto>>;
};

/** The structure of the ORCID Works field of the Users content input type. */
export type UsersDataOrcidWorksInputDto = {
  iv: Maybe<Array<UsersDataOrcidWorksChildInputDto>>;
};

/** The structure of the Open Questions nested schema. */
export type UsersDataQuestionsChildDto = {
  question: Maybe<Scalars['String']>;
};

/** The structure of the Open Questions nested schema. */
export type UsersDataQuestionsChildInputDto = {
  question: Maybe<Scalars['String']>;
};

/** The structure of the Open Questions field of the Users content type. */
export type UsersDataQuestionsDto = {
  iv: Maybe<Array<UsersDataQuestionsChildDto>>;
};

/** The structure of the Open Questions field of the Users content input type. */
export type UsersDataQuestionsInputDto = {
  iv: Maybe<Array<UsersDataQuestionsChildInputDto>>;
};

/** The structure of the Reach Out field of the Users content type. */
export type UsersDataReachOutDto = {
  /** Reach out reasons (only relevant for "Staff" users) */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Reach Out field of the Users content input type. */
export type UsersDataReachOutInputDto = {
  /** Reach out reasons (only relevant for "Staff" users) */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Research Interests field of the Users content type. */
export type UsersDataResearchInterestsDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Research Interests field of the Users content input type. */
export type UsersDataResearchInterestsInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Responsibilities field of the Users content type. */
export type UsersDataResponsibilitiesDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Responsibilities field of the Users content input type. */
export type UsersDataResponsibilitiesInputDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the ASAP Hub Role field of the Users content type. */
export type UsersDataRoleDto = {
  /** Role on the ASAP Hub */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the ASAP Hub Role field of the Users content input type. */
export type UsersDataRoleInputDto = {
  /** Role on the ASAP Hub */
  iv: Maybe<Scalars['String']>;
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
  github: Maybe<Scalars['String']>;
  googleScholar: Maybe<Scalars['String']>;
  linkedIn: Maybe<Scalars['String']>;
  researchGate: Maybe<Scalars['String']>;
  researcherId: Maybe<Scalars['String']>;
  twitter: Maybe<Scalars['String']>;
  website1: Maybe<Scalars['String']>;
  website2: Maybe<Scalars['String']>;
};

/** The structure of the Social Links field of the Users content type. */
export type UsersDataSocialDto = {
  iv: Maybe<Array<UsersDataSocialChildDto>>;
};

/** The structure of the Social Links field of the Users content input type. */
export type UsersDataSocialInputDto = {
  iv: Maybe<Array<UsersDataSocialChildInputDto>>;
};

/** The structure of the Teams nested schema. */
export type UsersDataTeamsChildDto = {
  id: Maybe<Array<Teams>>;
  /** Attention: Check if this user needs to be added to Smart Simple */
  role: Maybe<Scalars['String']>;
};

/** The structure of the Teams nested schema. */
export type UsersDataTeamsChildInputDto = {
  id: Maybe<Array<Scalars['String']>>;
  /** Attention: Check if this user needs to be added to Smart Simple */
  role: Maybe<Scalars['String']>;
};

/** The structure of the Teams field of the Users content type. */
export type UsersDataTeamsDto = {
  /** Mandatory for grantees. They cannot publish profile without a team. */
  iv: Maybe<Array<UsersDataTeamsChildDto>>;
};

/** The structure of the Teams field of the Users content input type. */
export type UsersDataTeamsInputDto = {
  /** Mandatory for grantees. They cannot publish profile without a team. */
  iv: Maybe<Array<UsersDataTeamsChildInputDto>>;
};

/** The structure of the flat Users data type. */
export type UsersFlatDataDto = {
  adminNotes: Maybe<Scalars['String']>;
  avatar: Maybe<Array<Asset>>;
  biography: Maybe<Scalars['String']>;
  city: Maybe<Scalars['String']>;
  connections: Maybe<Array<UsersDataConnectionsChildDto>>;
  contactEmail: Maybe<Scalars['String']>;
  country: Maybe<Scalars['String']>;
  degree: Maybe<Scalars['String']>;
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
                'title' | 'shortText' | 'text' | 'type' | 'link' | 'linkText'
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

export type NewsFragment = Pick<
  NewsAndEvents,
  'id' | 'created' | 'lastModified' | 'version'
> & {
  flatData: Pick<
    NewsAndEventsFlatDataDto,
    'title' | 'shortText' | 'text' | 'type' | 'link' | 'linkText'
  > & { thumbnail: Maybe<Array<Pick<Asset, 'id'>>> };
};

export type UsersContentFragment = Pick<
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
          Array<Pick<Labs, 'id'> & { flatData: Pick<LabsFlatDataDto, 'name'> }>
        >;
      };
    }
  >;
};

export type FetchUsersQueryVariables = Exact<{
  top: Maybe<Scalars['Int']>;
  skip: Maybe<Scalars['Int']>;
  filter: Maybe<Scalars['String']>;
}>;

export type FetchUsersQuery = {
  queryUsersContentsWithTotal: Maybe<
    Pick<UsersResultDto, 'total'> & {
      items: Maybe<
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
