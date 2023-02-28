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
  changeCalendarsContent: Maybe<Calendars>;
  /** Change a Contributing Cohorts content. */
  changeContributingCohortsContent: Maybe<ContributingCohorts>;
  /** Change a Events content. */
  changeEventsContent: Maybe<Events>;
  /** Change a External authors content. */
  changeExternalAuthorsContent: Maybe<ExternalAuthors>;
  /** Change a Migrations content. */
  changeMigrationsContent: Maybe<Migrations>;
  /** Change a News content. */
  changeNewsAndEventsContent: Maybe<NewsAndEvents>;
  /** Change a Outputs content. */
  changeOutputsContent: Maybe<Outputs>;
  /** Change a Projects content. */
  changeProjectsContent: Maybe<Projects>;
  /** Change a Users content. */
  changeUsersContent: Maybe<Users>;
  /** Change a Working Group Network content. */
  changeWorkingGroupNetworkContent: Maybe<WorkingGroupNetwork>;
  /** Change a Working Groups content. */
  changeWorkingGroupsContent: Maybe<WorkingGroups>;
  /** Creates an Calendars content. */
  createCalendarsContent: Maybe<Calendars>;
  /** Creates an Contributing Cohorts content. */
  createContributingCohortsContent: Maybe<ContributingCohorts>;
  /** Creates an Events content. */
  createEventsContent: Maybe<Events>;
  /** Creates an External authors content. */
  createExternalAuthorsContent: Maybe<ExternalAuthors>;
  /** Creates an Migrations content. */
  createMigrationsContent: Maybe<Migrations>;
  /** Creates an News content. */
  createNewsAndEventsContent: Maybe<NewsAndEvents>;
  /** Creates an Outputs content. */
  createOutputsContent: Maybe<Outputs>;
  /** Creates an Projects content. */
  createProjectsContent: Maybe<Projects>;
  /** Creates an Users content. */
  createUsersContent: Maybe<Users>;
  /** Creates an Working Group Network content. */
  createWorkingGroupNetworkContent: Maybe<WorkingGroupNetwork>;
  /** Creates an Working Groups content. */
  createWorkingGroupsContent: Maybe<WorkingGroups>;
  /** Delete an Calendars content. */
  deleteCalendarsContent: EntitySavedResultDto;
  /** Delete an Contributing Cohorts content. */
  deleteContributingCohortsContent: EntitySavedResultDto;
  /** Delete an Events content. */
  deleteEventsContent: EntitySavedResultDto;
  /** Delete an External authors content. */
  deleteExternalAuthorsContent: EntitySavedResultDto;
  /** Delete an Migrations content. */
  deleteMigrationsContent: EntitySavedResultDto;
  /** Delete an News content. */
  deleteNewsAndEventsContent: EntitySavedResultDto;
  /** Delete an Outputs content. */
  deleteOutputsContent: EntitySavedResultDto;
  /** Delete an Projects content. */
  deleteProjectsContent: EntitySavedResultDto;
  /** Delete an Users content. */
  deleteUsersContent: EntitySavedResultDto;
  /** Delete an Working Group Network content. */
  deleteWorkingGroupNetworkContent: EntitySavedResultDto;
  /** Delete an Working Groups content. */
  deleteWorkingGroupsContent: EntitySavedResultDto;
  /** Patch an Calendars content by id. */
  patchCalendarsContent: Maybe<Calendars>;
  /** Patch an Contributing Cohorts content by id. */
  patchContributingCohortsContent: Maybe<ContributingCohorts>;
  /** Patch an Events content by id. */
  patchEventsContent: Maybe<Events>;
  /** Patch an External authors content by id. */
  patchExternalAuthorsContent: Maybe<ExternalAuthors>;
  /** Patch an Migrations content by id. */
  patchMigrationsContent: Maybe<Migrations>;
  /** Patch an News content by id. */
  patchNewsAndEventsContent: Maybe<NewsAndEvents>;
  /** Patch an Outputs content by id. */
  patchOutputsContent: Maybe<Outputs>;
  /** Patch an Projects content by id. */
  patchProjectsContent: Maybe<Projects>;
  /** Patch an Users content by id. */
  patchUsersContent: Maybe<Users>;
  /** Patch an Working Group Network content by id. */
  patchWorkingGroupNetworkContent: Maybe<WorkingGroupNetwork>;
  /** Patch an Working Groups content by id. */
  patchWorkingGroupsContent: Maybe<WorkingGroups>;
  /**
   * Publish a Calendars content.
   * @deprecated Use 'changeCalendarsContent' instead
   */
  publishCalendarsContent: Maybe<Calendars>;
  /**
   * Publish a Contributing Cohorts content.
   * @deprecated Use 'changeContributingCohortsContent' instead
   */
  publishContributingCohortsContent: Maybe<ContributingCohorts>;
  /**
   * Publish a Events content.
   * @deprecated Use 'changeEventsContent' instead
   */
  publishEventsContent: Maybe<Events>;
  /**
   * Publish a External authors content.
   * @deprecated Use 'changeExternalAuthorsContent' instead
   */
  publishExternalAuthorsContent: Maybe<ExternalAuthors>;
  /**
   * Publish a Migrations content.
   * @deprecated Use 'changeMigrationsContent' instead
   */
  publishMigrationsContent: Maybe<Migrations>;
  /**
   * Publish a News content.
   * @deprecated Use 'changeNewsAndEventsContent' instead
   */
  publishNewsAndEventsContent: Maybe<NewsAndEvents>;
  /**
   * Publish a Outputs content.
   * @deprecated Use 'changeOutputsContent' instead
   */
  publishOutputsContent: Maybe<Outputs>;
  /**
   * Publish a Projects content.
   * @deprecated Use 'changeProjectsContent' instead
   */
  publishProjectsContent: Maybe<Projects>;
  /**
   * Publish a Users content.
   * @deprecated Use 'changeUsersContent' instead
   */
  publishUsersContent: Maybe<Users>;
  /**
   * Publish a Working Group Network content.
   * @deprecated Use 'changeWorkingGroupNetworkContent' instead
   */
  publishWorkingGroupNetworkContent: Maybe<WorkingGroupNetwork>;
  /**
   * Publish a Working Groups content.
   * @deprecated Use 'changeWorkingGroupsContent' instead
   */
  publishWorkingGroupsContent: Maybe<WorkingGroups>;
  /** Update an Calendars content by id. */
  updateCalendarsContent: Maybe<Calendars>;
  /** Update an Contributing Cohorts content by id. */
  updateContributingCohortsContent: Maybe<ContributingCohorts>;
  /** Update an Events content by id. */
  updateEventsContent: Maybe<Events>;
  /** Update an External authors content by id. */
  updateExternalAuthorsContent: Maybe<ExternalAuthors>;
  /** Update an Migrations content by id. */
  updateMigrationsContent: Maybe<Migrations>;
  /** Update an News content by id. */
  updateNewsAndEventsContent: Maybe<NewsAndEvents>;
  /** Update an Outputs content by id. */
  updateOutputsContent: Maybe<Outputs>;
  /** Update an Projects content by id. */
  updateProjectsContent: Maybe<Projects>;
  /** Update an Users content by id. */
  updateUsersContent: Maybe<Users>;
  /** Update an Working Group Network content by id. */
  updateWorkingGroupNetworkContent: Maybe<WorkingGroupNetwork>;
  /** Update an Working Groups content by id. */
  updateWorkingGroupsContent: Maybe<WorkingGroups>;
  /** Upsert an Calendars content by id. */
  upsertCalendarsContent: Maybe<Calendars>;
  /** Upsert an Contributing Cohorts content by id. */
  upsertContributingCohortsContent: Maybe<ContributingCohorts>;
  /** Upsert an Events content by id. */
  upsertEventsContent: Maybe<Events>;
  /** Upsert an External authors content by id. */
  upsertExternalAuthorsContent: Maybe<ExternalAuthors>;
  /** Upsert an Migrations content by id. */
  upsertMigrationsContent: Maybe<Migrations>;
  /** Upsert an News content by id. */
  upsertNewsAndEventsContent: Maybe<NewsAndEvents>;
  /** Upsert an Outputs content by id. */
  upsertOutputsContent: Maybe<Outputs>;
  /** Upsert an Projects content by id. */
  upsertProjectsContent: Maybe<Projects>;
  /** Upsert an Users content by id. */
  upsertUsersContent: Maybe<Users>;
  /** Upsert an Working Group Network content by id. */
  upsertWorkingGroupNetworkContent: Maybe<WorkingGroupNetwork>;
  /** Upsert an Working Groups content by id. */
  upsertWorkingGroupsContent: Maybe<WorkingGroups>;
};

/** The app mutations. */
export type ApplicationMutationsChangeCalendarsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsChangeContributingCohortsContentArgs = {
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
export type ApplicationMutationsChangeOutputsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsChangeProjectsContentArgs = {
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
export type ApplicationMutationsChangeWorkingGroupNetworkContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsChangeWorkingGroupsContentArgs = {
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
export type ApplicationMutationsCreateContributingCohortsContentArgs = {
  data: ContributingCohortsDataInputDto;
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
export type ApplicationMutationsCreateOutputsContentArgs = {
  data: OutputsDataInputDto;
  id: InputMaybe<Scalars['String']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsCreateProjectsContentArgs = {
  data: ProjectsDataInputDto;
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
export type ApplicationMutationsCreateWorkingGroupNetworkContentArgs = {
  data: WorkingGroupNetworkDataInputDto;
  id: InputMaybe<Scalars['String']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsCreateWorkingGroupsContentArgs = {
  data: WorkingGroupsDataInputDto;
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
export type ApplicationMutationsDeleteContributingCohortsContentArgs = {
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
export type ApplicationMutationsDeleteOutputsContentArgs = {
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsDeleteProjectsContentArgs = {
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsDeleteUsersContentArgs = {
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsDeleteWorkingGroupNetworkContentArgs = {
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsDeleteWorkingGroupsContentArgs = {
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
export type ApplicationMutationsPatchContributingCohortsContentArgs = {
  data: ContributingCohortsDataInputDto;
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
export type ApplicationMutationsPatchOutputsContentArgs = {
  data: OutputsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsPatchProjectsContentArgs = {
  data: ProjectsDataInputDto;
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
export type ApplicationMutationsPatchWorkingGroupNetworkContentArgs = {
  data: WorkingGroupNetworkDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsPatchWorkingGroupsContentArgs = {
  data: WorkingGroupsDataInputDto;
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
export type ApplicationMutationsPublishContributingCohortsContentArgs = {
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
export type ApplicationMutationsPublishOutputsContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsPublishProjectsContentArgs = {
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
export type ApplicationMutationsPublishWorkingGroupNetworkContentArgs = {
  dueTime: InputMaybe<Scalars['Instant']>;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  status: Scalars['String'];
};

/** The app mutations. */
export type ApplicationMutationsPublishWorkingGroupsContentArgs = {
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
export type ApplicationMutationsUpdateContributingCohortsContentArgs = {
  data: ContributingCohortsDataInputDto;
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
export type ApplicationMutationsUpdateOutputsContentArgs = {
  data: OutputsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpdateProjectsContentArgs = {
  data: ProjectsDataInputDto;
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
export type ApplicationMutationsUpdateWorkingGroupNetworkContentArgs = {
  data: WorkingGroupNetworkDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpdateWorkingGroupsContentArgs = {
  data: WorkingGroupsDataInputDto;
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
export type ApplicationMutationsUpsertContributingCohortsContentArgs = {
  data: ContributingCohortsDataInputDto;
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
export type ApplicationMutationsUpsertOutputsContentArgs = {
  data: OutputsDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: InputMaybe<Scalars['Boolean']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpsertProjectsContentArgs = {
  data: ProjectsDataInputDto;
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

/** The app mutations. */
export type ApplicationMutationsUpsertWorkingGroupNetworkContentArgs = {
  data: WorkingGroupNetworkDataInputDto;
  expectedVersion?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  patch?: InputMaybe<Scalars['Boolean']>;
  publish?: InputMaybe<Scalars['Boolean']>;
  status: InputMaybe<Scalars['String']>;
};

/** The app mutations. */
export type ApplicationMutationsUpsertWorkingGroupsContentArgs = {
  data: WorkingGroupsDataInputDto;
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
  /** Find an Contributing Cohorts content by id. */
  findContributingCohortsContent: Maybe<ContributingCohorts>;
  /** Find an Events content by id. */
  findEventsContent: Maybe<Events>;
  /** Find an External authors content by id. */
  findExternalAuthorsContent: Maybe<ExternalAuthors>;
  /** Find an Migrations content by id. */
  findMigrationsContent: Maybe<Migrations>;
  /** Find an News content by id. */
  findNewsAndEventsContent: Maybe<NewsAndEvents>;
  /** Find an Outputs content by id. */
  findOutputsContent: Maybe<Outputs>;
  /** Find an Projects content by id. */
  findProjectsContent: Maybe<Projects>;
  /** Find an Users content by id. */
  findUsersContent: Maybe<Users>;
  /** Find an Working Group Network content by id. */
  findWorkingGroupNetworkContent: Maybe<WorkingGroupNetwork>;
  /** Find an Working Groups content by id. */
  findWorkingGroupsContent: Maybe<WorkingGroups>;
  /** Get assets. */
  queryAssets: Array<Asset>;
  /** Get assets and total count. */
  queryAssetsWithTotal: AssetResultDto;
  /** Query Calendars content items. */
  queryCalendarsContents: Maybe<Array<Calendars>>;
  /** Query Calendars content items with total count. */
  queryCalendarsContentsWithTotal: Maybe<CalendarsResultDto>;
  /** Query Contributing Cohorts content items. */
  queryContributingCohortsContents: Maybe<Array<ContributingCohorts>>;
  /** Query Contributing Cohorts content items with total count. */
  queryContributingCohortsContentsWithTotal: Maybe<ContributingCohortsResultDto>;
  /** Query Events content items. */
  queryEventsContents: Maybe<Array<Events>>;
  /** Query Events content items with total count. */
  queryEventsContentsWithTotal: Maybe<EventsResultDto>;
  /** Query External authors content items. */
  queryExternalAuthorsContents: Maybe<Array<ExternalAuthors>>;
  /** Query External authors content items with total count. */
  queryExternalAuthorsContentsWithTotal: Maybe<ExternalAuthorsResultDto>;
  /** Query Migrations content items. */
  queryMigrationsContents: Maybe<Array<Migrations>>;
  /** Query Migrations content items with total count. */
  queryMigrationsContentsWithTotal: Maybe<MigrationsResultDto>;
  /** Query News content items. */
  queryNewsAndEventsContents: Maybe<Array<NewsAndEvents>>;
  /** Query News content items with total count. */
  queryNewsAndEventsContentsWithTotal: Maybe<NewsAndEventsResultDto>;
  /** Query Outputs content items. */
  queryOutputsContents: Maybe<Array<Outputs>>;
  /** Query Outputs content items with total count. */
  queryOutputsContentsWithTotal: Maybe<OutputsResultDto>;
  /** Query Projects content items. */
  queryProjectsContents: Maybe<Array<Projects>>;
  /** Query Projects content items with total count. */
  queryProjectsContentsWithTotal: Maybe<ProjectsResultDto>;
  /** Query Users content items. */
  queryUsersContents: Maybe<Array<Users>>;
  /** Query Users content items with total count. */
  queryUsersContentsWithTotal: Maybe<UsersResultDto>;
  /** Query Working Group Network content items. */
  queryWorkingGroupNetworkContents: Maybe<Array<WorkingGroupNetwork>>;
  /** Query Working Group Network content items with total count. */
  queryWorkingGroupNetworkContentsWithTotal: Maybe<WorkingGroupNetworkResultDto>;
  /** Query Working Groups content items. */
  queryWorkingGroupsContents: Maybe<Array<WorkingGroups>>;
  /** Query Working Groups content items with total count. */
  queryWorkingGroupsContentsWithTotal: Maybe<WorkingGroupsResultDto>;
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
export type ApplicationQueriesFindContributingCohortsContentArgs = {
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
export type ApplicationQueriesFindOutputsContentArgs = {
  id: Scalars['String'];
  version: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesFindProjectsContentArgs = {
  id: Scalars['String'];
  version: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesFindUsersContentArgs = {
  id: Scalars['String'];
  version: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesFindWorkingGroupNetworkContentArgs = {
  id: Scalars['String'];
  version: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesFindWorkingGroupsContentArgs = {
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
export type ApplicationQueriesQueryContributingCohortsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryContributingCohortsContentsWithTotalArgs = {
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
export type ApplicationQueriesQueryOutputsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryOutputsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryProjectsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryProjectsContentsWithTotalArgs = {
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

/** The app queries. */
export type ApplicationQueriesQueryWorkingGroupNetworkContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryWorkingGroupNetworkContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryWorkingGroupsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The app queries. */
export type ApplicationQueriesQueryWorkingGroupsContentsWithTotalArgs = {
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

/** The structure of a Contributing Cohorts content type. */
export type ContributingCohorts = Content & {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The data of the content. */
  data: ContributingCohortsDataDto;
  /** The edit token. */
  editToken: Maybe<Scalars['String']>;
  /** The flat data of the content. */
  flatData: ContributingCohortsFlatDataDto;
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

/** The structure of a Contributing Cohorts content type. */
export type ContributingCohortsReferencingUsersContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Contributing Cohorts content type. */
export type ContributingCohortsReferencingUsersContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of the Contributing Cohorts data type. */
export type ContributingCohortsDataDto = {
  name: Maybe<ContributingCohortsDataNameDto>;
};

/** The structure of the Contributing Cohorts data input type. */
export type ContributingCohortsDataInputDto = {
  name: InputMaybe<ContributingCohortsDataNameInputDto>;
};

/** The structure of the Name field of the Contributing Cohorts content type. */
export type ContributingCohortsDataNameDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Name field of the Contributing Cohorts content input type. */
export type ContributingCohortsDataNameInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the flat Contributing Cohorts data type. */
export type ContributingCohortsFlatDataDto = {
  name: Maybe<Scalars['String']>;
};

/** List of Contributing Cohorts items and total count. */
export type ContributingCohortsResultDto = {
  /** The contents. */
  items: Maybe<Array<ContributingCohorts>>;
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
  /** The type of the event. */
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
  /** The type of the event. */
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
  notesUpdatedAt: Maybe<EventsDataNotesUpdatedAtDto>;
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
  notesUpdatedAt: InputMaybe<EventsDataNotesUpdatedAtInputDto>;
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

/** The structure of the Notes Updated At field of the Events content type. */
export type EventsDataNotesUpdatedAtDto = {
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the Notes Updated At field of the Events content input type. */
export type EventsDataNotesUpdatedAtInputDto = {
  iv: InputMaybe<Scalars['Instant']>;
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
  user: Maybe<Array<Users>>;
};

/** The structure of the Speakers nested schema. */
export type EventsDataSpeakersChildInputDto = {
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
  notesUpdatedAt: Maybe<Scalars['Instant']>;
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
  /** Query Outputs content items. */
  referencingOutputsContents: Maybe<Array<Outputs>>;
  /** Query Outputs content items with total count. */
  referencingOutputsContentsWithTotal: Maybe<OutputsResultDto>;
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
export type ExternalAuthorsReferencingOutputsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a External authors content type. */
export type ExternalAuthorsReferencingOutputsContentsWithTotalArgs = {
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
  /** The status of the content. */
  status: Scalars['String'];
  /** The status color of the content. */
  statusColor: Scalars['String'];
  /** The URL to the content. */
  url: Scalars['String'];
  /** The version of the objec. */
  version: Scalars['Int'];
};

/** The structure of the Number of articles field of the News content type. */
export type NewsAndEventsDataArticleCountDto = {
  iv: Maybe<Scalars['Float']>;
};

/** The structure of the Number of articles field of the News content input type. */
export type NewsAndEventsDataArticleCountInputDto = {
  iv: InputMaybe<Scalars['Float']>;
};

/** The structure of the Number of cohorts field of the News content type. */
export type NewsAndEventsDataCohortCountDto = {
  iv: Maybe<Scalars['Float']>;
};

/** The structure of the Number of cohorts field of the News content input type. */
export type NewsAndEventsDataCohortCountInputDto = {
  iv: InputMaybe<Scalars['Float']>;
};

/** The structure of the News data type. */
export type NewsAndEventsDataDto = {
  articleCount: Maybe<NewsAndEventsDataArticleCountDto>;
  cohortCount: Maybe<NewsAndEventsDataCohortCountDto>;
  link: Maybe<NewsAndEventsDataLinkDto>;
  linkText: Maybe<NewsAndEventsDataLinkTextDto>;
  sampleCount: Maybe<NewsAndEventsDataSampleCountDto>;
  shortText: Maybe<NewsAndEventsDataShortTextDto>;
  title: Maybe<NewsAndEventsDataTitleDto>;
};

/** The structure of the News data input type. */
export type NewsAndEventsDataInputDto = {
  articleCount: InputMaybe<NewsAndEventsDataArticleCountInputDto>;
  cohortCount: InputMaybe<NewsAndEventsDataCohortCountInputDto>;
  link: InputMaybe<NewsAndEventsDataLinkInputDto>;
  linkText: InputMaybe<NewsAndEventsDataLinkTextInputDto>;
  sampleCount: InputMaybe<NewsAndEventsDataSampleCountInputDto>;
  shortText: InputMaybe<NewsAndEventsDataShortTextInputDto>;
  title: InputMaybe<NewsAndEventsDataTitleInputDto>;
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

/** The structure of the Number of samples field of the News content type. */
export type NewsAndEventsDataSampleCountDto = {
  iv: Maybe<Scalars['Float']>;
};

/** The structure of the Number of samples field of the News content input type. */
export type NewsAndEventsDataSampleCountInputDto = {
  iv: InputMaybe<Scalars['Float']>;
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

/** The structure of the Title field of the News content type. */
export type NewsAndEventsDataTitleDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Title field of the News content input type. */
export type NewsAndEventsDataTitleInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the flat News data type. */
export type NewsAndEventsFlatDataDto = {
  articleCount: Maybe<Scalars['Float']>;
  cohortCount: Maybe<Scalars['Float']>;
  link: Maybe<Scalars['String']>;
  /** Leave this empty to show "Open External Link" */
  linkText: Maybe<Scalars['String']>;
  sampleCount: Maybe<Scalars['Float']>;
  /** The text visible on the card version of News and Events */
  shortText: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
};

/** List of News items and total count. */
export type NewsAndEventsResultDto = {
  /** The contents. */
  items: Maybe<Array<NewsAndEvents>>;
  /** The total count of  contents. */
  total: Scalars['Int'];
};

/** The structure of a Outputs content type. */
export type Outputs = Content & {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The data of the content. */
  data: OutputsDataDto;
  /** The edit token. */
  editToken: Maybe<Scalars['String']>;
  /** The flat data of the content. */
  flatData: OutputsFlatDataDto;
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

/** The structure of a Outputs content type. */
export type OutputsReferencesExternalAuthorsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Outputs content type. */
export type OutputsReferencesExternalAuthorsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Outputs content type. */
export type OutputsReferencesUsersContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Outputs content type. */
export type OutputsReferencesUsersContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of the Added Date field of the Outputs content type. */
export type OutputsDataAddedDateDto = {
  /** Date output was shared with ASAP Network (different from publication date) */
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the Added Date field of the Outputs content input type. */
export type OutputsDataAddedDateInputDto = {
  /** Date output was shared with ASAP Network (different from publication date) */
  iv: InputMaybe<Scalars['Instant']>;
};

/** The structure of the Admin notes field of the Outputs content type. */
export type OutputsDataAdminNotesDto = {
  /** This is ASAP internal content and it's not being shown on the Hub */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Admin notes field of the Outputs content input type. */
export type OutputsDataAdminNotesInputDto = {
  /** This is ASAP internal content and it's not being shown on the Hub */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Authors field of the Outputs content type. */
export type OutputsDataAuthorsDto = {
  iv: Maybe<Array<OutputsDataAuthorsUnionDto>>;
};

/** The structure of the Authors field of the Outputs content input type. */
export type OutputsDataAuthorsInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

export type OutputsDataAuthorsUnionDto = ExternalAuthors | Users;

/** The structure of the Created by field of the Outputs content type. */
export type OutputsDataCreatedByDto = {
  iv: Maybe<Array<Users>>;
};

/** The structure of the Created by field of the Outputs content input type. */
export type OutputsDataCreatedByInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Document type field of the Outputs content type. */
export type OutputsDataDocumentTypeDto = {
  iv: Maybe<OutputsDataDocumentTypeEnum>;
};

export enum OutputsDataDocumentTypeEnum {
  /** Article */
  Article = 'Article',
  /** Code_Software */
  CodeSoftware = 'Code_Software',
  /** Data_Release */
  DataRelease = 'Data_Release',
  /** Form */
  Form = 'Form',
  /** Training_Material */
  TrainingMaterial = 'Training_Material',
  /** Update */
  Update = 'Update',
}

/** The structure of the Document type field of the Outputs content input type. */
export type OutputsDataDocumentTypeInputDto = {
  iv: InputMaybe<OutputsDataDocumentTypeEnum>;
};

/** The structure of the Outputs data type. */
export type OutputsDataDto = {
  addedDate: Maybe<OutputsDataAddedDateDto>;
  adminNotes: Maybe<OutputsDataAdminNotesDto>;
  authors: Maybe<OutputsDataAuthorsDto>;
  createdBy: Maybe<OutputsDataCreatedByDto>;
  documentType: Maybe<OutputsDataDocumentTypeDto>;
  lastUpdatedPartial: Maybe<OutputsDataLastUpdatedPartialDto>;
  link: Maybe<OutputsDataLinkDto>;
  publishDate: Maybe<OutputsDataPublishDateDto>;
  subtype: Maybe<OutputsDataSubtypeDto>;
  title: Maybe<OutputsDataTitleDto>;
  type: Maybe<OutputsDataTypeDto>;
  updatedBy: Maybe<OutputsDataUpdatedByDto>;
};

/** The structure of the Outputs data input type. */
export type OutputsDataInputDto = {
  addedDate: InputMaybe<OutputsDataAddedDateInputDto>;
  adminNotes: InputMaybe<OutputsDataAdminNotesInputDto>;
  authors: InputMaybe<OutputsDataAuthorsInputDto>;
  createdBy: InputMaybe<OutputsDataCreatedByInputDto>;
  documentType: InputMaybe<OutputsDataDocumentTypeInputDto>;
  lastUpdatedPartial: InputMaybe<OutputsDataLastUpdatedPartialInputDto>;
  link: InputMaybe<OutputsDataLinkInputDto>;
  publishDate: InputMaybe<OutputsDataPublishDateInputDto>;
  subtype: InputMaybe<OutputsDataSubtypeInputDto>;
  title: InputMaybe<OutputsDataTitleInputDto>;
  type: InputMaybe<OutputsDataTypeInputDto>;
  updatedBy: InputMaybe<OutputsDataUpdatedByInputDto>;
};

/** The structure of the Last Updated (partial) field of the Outputs content type. */
export type OutputsDataLastUpdatedPartialDto = {
  /** Does not include changes to Publish Date and Admin notes */
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the Last Updated (partial) field of the Outputs content input type. */
export type OutputsDataLastUpdatedPartialInputDto = {
  /** Does not include changes to Publish Date and Admin notes */
  iv: InputMaybe<Scalars['Instant']>;
};

/** The structure of the External Link field of the Outputs content type. */
export type OutputsDataLinkDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the External Link field of the Outputs content input type. */
export type OutputsDataLinkInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Publish Date field of the Outputs content type. */
export type OutputsDataPublishDateDto = {
  /** Date of publishing (outside the Hub). Only applies to outputs that have been published. */
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the Publish Date field of the Outputs content input type. */
export type OutputsDataPublishDateInputDto = {
  /** Date of publishing (outside the Hub). Only applies to outputs that have been published. */
  iv: InputMaybe<Scalars['Instant']>;
};

/** The structure of the SubType field of the Outputs content type. */
export type OutputsDataSubtypeDto = {
  /** For article research */
  iv: Maybe<OutputsDataSubtypeEnum>;
};

export enum OutputsDataSubtypeEnum {
  /** Preprints */
  Preprints = 'Preprints',
  /** Published */
  Published = 'Published',
}

/** The structure of the SubType field of the Outputs content input type. */
export type OutputsDataSubtypeInputDto = {
  /** For article research */
  iv: InputMaybe<OutputsDataSubtypeEnum>;
};

/** The structure of the Title field of the Outputs content type. */
export type OutputsDataTitleDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Title field of the Outputs content input type. */
export type OutputsDataTitleInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Type field of the Outputs content type. */
export type OutputsDataTypeDto = {
  /** For articles */
  iv: Maybe<OutputsDataTypeEnum>;
};

export enum OutputsDataTypeEnum {
  /** Blog */
  Blog = 'Blog',
  /** Hot_Topic */
  HotTopic = 'Hot_Topic',
  /** Letter */
  Letter = 'Letter',
  /** Research */
  Research = 'Research',
  /** Review */
  Review = 'Review',
}

/** The structure of the Type field of the Outputs content input type. */
export type OutputsDataTypeInputDto = {
  /** For articles */
  iv: InputMaybe<OutputsDataTypeEnum>;
};

/** The structure of the Updated by field of the Outputs content type. */
export type OutputsDataUpdatedByDto = {
  iv: Maybe<Array<Users>>;
};

/** The structure of the Updated by field of the Outputs content input type. */
export type OutputsDataUpdatedByInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the flat Outputs data type. */
export type OutputsFlatDataDto = {
  /** Date output was shared with ASAP Network (different from publication date) */
  addedDate: Maybe<Scalars['Instant']>;
  /** This is ASAP internal content and it's not being shown on the Hub */
  adminNotes: Maybe<Scalars['String']>;
  authors: Maybe<Array<OutputsDataAuthorsUnionDto>>;
  createdBy: Maybe<Array<Users>>;
  documentType: Maybe<OutputsDataDocumentTypeEnum>;
  /** Does not include changes to Publish Date and Admin notes */
  lastUpdatedPartial: Maybe<Scalars['Instant']>;
  link: Maybe<Scalars['String']>;
  /** Date of publishing (outside the Hub). Only applies to outputs that have been published. */
  publishDate: Maybe<Scalars['Instant']>;
  /** For article research */
  subtype: Maybe<OutputsDataSubtypeEnum>;
  title: Maybe<Scalars['String']>;
  /** For articles */
  type: Maybe<OutputsDataTypeEnum>;
  updatedBy: Maybe<Array<Users>>;
};

/** List of Outputs items and total count. */
export type OutputsResultDto = {
  /** The contents. */
  items: Maybe<Array<Outputs>>;
  /** The total count of  contents. */
  total: Scalars['Int'];
};

/** The structure of a Projects content type. */
export type Projects = Content & {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The data of the content. */
  data: ProjectsDataDto;
  /** The edit token. */
  editToken: Maybe<Scalars['String']>;
  /** The flat data of the content. */
  flatData: ProjectsFlatDataDto;
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

/** The structure of a Projects content type. */
export type ProjectsReferencesUsersContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Projects content type. */
export type ProjectsReferencesUsersContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of the Description field of the Projects content type. */
export type ProjectsDataDescriptionDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Description field of the Projects content input type. */
export type ProjectsDataDescriptionInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Projects data type. */
export type ProjectsDataDto = {
  description: Maybe<ProjectsDataDescriptionDto>;
  endDate: Maybe<ProjectsDataEndDateDto>;
  keywords: Maybe<ProjectsDataKeywordsDto>;
  leadEmail: Maybe<ProjectsDataLeadEmailDto>;
  members: Maybe<ProjectsDataMembersDto>;
  milestones: Maybe<ProjectsDataMilestonesDto>;
  opportunitiesLink: Maybe<ProjectsDataOpportunitiesLinkDto>;
  pmEmail: Maybe<ProjectsDataPmEmailDto>;
  projectProposal: Maybe<ProjectsDataProjectProposalDto>;
  resources: Maybe<ProjectsDataResourcesDto>;
  startDate: Maybe<ProjectsDataStartDateDto>;
  status: Maybe<ProjectsDataStatusDto>;
  title: Maybe<ProjectsDataTitleDto>;
  traineeProject: Maybe<ProjectsDataTraineeProjectDto>;
};

/** The structure of the End Date field of the Projects content type. */
export type ProjectsDataEndDateDto = {
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the End Date field of the Projects content input type. */
export type ProjectsDataEndDateInputDto = {
  iv: InputMaybe<Scalars['Instant']>;
};

/** The structure of the Projects data input type. */
export type ProjectsDataInputDto = {
  description: InputMaybe<ProjectsDataDescriptionInputDto>;
  endDate: InputMaybe<ProjectsDataEndDateInputDto>;
  keywords: InputMaybe<ProjectsDataKeywordsInputDto>;
  leadEmail: InputMaybe<ProjectsDataLeadEmailInputDto>;
  members: InputMaybe<ProjectsDataMembersInputDto>;
  milestones: InputMaybe<ProjectsDataMilestonesInputDto>;
  opportunitiesLink: InputMaybe<ProjectsDataOpportunitiesLinkInputDto>;
  pmEmail: InputMaybe<ProjectsDataPmEmailInputDto>;
  projectProposal: InputMaybe<ProjectsDataProjectProposalInputDto>;
  resources: InputMaybe<ProjectsDataResourcesInputDto>;
  startDate: InputMaybe<ProjectsDataStartDateInputDto>;
  status: InputMaybe<ProjectsDataStatusInputDto>;
  title: InputMaybe<ProjectsDataTitleInputDto>;
  traineeProject: InputMaybe<ProjectsDataTraineeProjectInputDto>;
};

/** The structure of the Keywords field of the Projects content type. */
export type ProjectsDataKeywordsDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Keywords field of the Projects content input type. */
export type ProjectsDataKeywordsInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Lead Email field of the Projects content type. */
export type ProjectsDataLeadEmailDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Lead Email field of the Projects content input type. */
export type ProjectsDataLeadEmailInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Members nested schema. */
export type ProjectsDataMembersChildDto = {
  role: Maybe<ProjectsDataMembersRoleEnum>;
  user: Maybe<Array<Users>>;
};

/** The structure of the Members nested schema. */
export type ProjectsDataMembersChildInputDto = {
  role: InputMaybe<ProjectsDataMembersRoleEnum>;
  user: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Members field of the Projects content type. */
export type ProjectsDataMembersDto = {
  iv: Maybe<Array<ProjectsDataMembersChildDto>>;
};

/** The structure of the Members field of the Projects content input type. */
export type ProjectsDataMembersInputDto = {
  iv: InputMaybe<Array<ProjectsDataMembersChildInputDto>>;
};

export enum ProjectsDataMembersRoleEnum {
  /** Contributor */
  Contributor = 'Contributor',
  /** Investigator */
  Investigator = 'Investigator',
  /** Project_CoLead */
  ProjectCoLead = 'Project_CoLead',
  /** Project_Lead */
  ProjectLead = 'Project_Lead',
  /** Project_Manager */
  ProjectManager = 'Project_Manager',
}

/** The structure of the Project Milestones nested schema. */
export type ProjectsDataMilestonesChildDto = {
  description: Maybe<Scalars['String']>;
  link: Maybe<Scalars['String']>;
  status: Maybe<ProjectsDataMilestonesStatusEnum>;
  title: Maybe<Scalars['String']>;
};

/** The structure of the Project Milestones nested schema. */
export type ProjectsDataMilestonesChildInputDto = {
  description: InputMaybe<Scalars['String']>;
  link: InputMaybe<Scalars['String']>;
  status: InputMaybe<ProjectsDataMilestonesStatusEnum>;
  title: InputMaybe<Scalars['String']>;
};

/** The structure of the Project Milestones field of the Projects content type. */
export type ProjectsDataMilestonesDto = {
  iv: Maybe<Array<ProjectsDataMilestonesChildDto>>;
};

/** The structure of the Project Milestones field of the Projects content input type. */
export type ProjectsDataMilestonesInputDto = {
  iv: InputMaybe<Array<ProjectsDataMilestonesChildInputDto>>;
};

export enum ProjectsDataMilestonesStatusEnum {
  /** Active */
  Active = 'Active',
  /** Completed */
  Completed = 'Completed',
  /** Not_Started */
  NotStarted = 'Not_Started',
}

/** The structure of the Opportunities Link field of the Projects content type. */
export type ProjectsDataOpportunitiesLinkDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Opportunities Link field of the Projects content input type. */
export type ProjectsDataOpportunitiesLinkInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the PM Email field of the Projects content type. */
export type ProjectsDataPmEmailDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the PM Email field of the Projects content input type. */
export type ProjectsDataPmEmailInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Project Proposal field of the Projects content type. */
export type ProjectsDataProjectProposalDto = {
  /** External link for a project proposal */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Project Proposal field of the Projects content input type. */
export type ProjectsDataProjectProposalInputDto = {
  /** External link for a project proposal */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Resources nested schema. */
export type ProjectsDataResourcesChildDto = {
  description: Maybe<Scalars['String']>;
  /** External link for a resource */
  externalLink: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
  type: Maybe<ProjectsDataResourcesTypeEnum>;
};

/** The structure of the Resources nested schema. */
export type ProjectsDataResourcesChildInputDto = {
  description: InputMaybe<Scalars['String']>;
  /** External link for a resource */
  externalLink: InputMaybe<Scalars['String']>;
  title: InputMaybe<Scalars['String']>;
  type: InputMaybe<ProjectsDataResourcesTypeEnum>;
};

/** The structure of the Resources field of the Projects content type. */
export type ProjectsDataResourcesDto = {
  iv: Maybe<Array<ProjectsDataResourcesChildDto>>;
};

/** The structure of the Resources field of the Projects content input type. */
export type ProjectsDataResourcesInputDto = {
  iv: InputMaybe<Array<ProjectsDataResourcesChildInputDto>>;
};

export enum ProjectsDataResourcesTypeEnum {
  /** Link */
  Link = 'Link',
  /** Note */
  Note = 'Note',
}

/** The structure of the Start Date field of the Projects content type. */
export type ProjectsDataStartDateDto = {
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the Start Date field of the Projects content input type. */
export type ProjectsDataStartDateInputDto = {
  iv: InputMaybe<Scalars['Instant']>;
};

/** The structure of the Status field of the Projects content type. */
export type ProjectsDataStatusDto = {
  iv: Maybe<ProjectsDataStatusEnum>;
};

export enum ProjectsDataStatusEnum {
  /** Active */
  Active = 'Active',
  /** Completed */
  Completed = 'Completed',
  /** Paused */
  Paused = 'Paused',
}

/** The structure of the Status field of the Projects content input type. */
export type ProjectsDataStatusInputDto = {
  iv: InputMaybe<ProjectsDataStatusEnum>;
};

/** The structure of the Title field of the Projects content type. */
export type ProjectsDataTitleDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Title field of the Projects content input type. */
export type ProjectsDataTitleInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Trainee Project field of the Projects content type. */
export type ProjectsDataTraineeProjectDto = {
  /** check if project is a trainee project */
  iv: Maybe<Scalars['Boolean']>;
};

/** The structure of the Trainee Project field of the Projects content input type. */
export type ProjectsDataTraineeProjectInputDto = {
  /** check if project is a trainee project */
  iv: InputMaybe<Scalars['Boolean']>;
};

/** The structure of the flat Projects data type. */
export type ProjectsFlatDataDto = {
  description: Maybe<Scalars['String']>;
  endDate: Maybe<Scalars['Instant']>;
  keywords: Maybe<Array<Scalars['String']>>;
  leadEmail: Maybe<Scalars['String']>;
  members: Maybe<Array<ProjectsDataMembersChildDto>>;
  milestones: Maybe<Array<ProjectsDataMilestonesChildDto>>;
  opportunitiesLink: Maybe<Scalars['String']>;
  pmEmail: Maybe<Scalars['String']>;
  /** External link for a project proposal */
  projectProposal: Maybe<Scalars['String']>;
  resources: Maybe<Array<ProjectsDataResourcesChildDto>>;
  startDate: Maybe<Scalars['Instant']>;
  status: Maybe<ProjectsDataStatusEnum>;
  title: Maybe<Scalars['String']>;
  /** check if project is a trainee project */
  traineeProject: Maybe<Scalars['Boolean']>;
};

/** List of Projects items and total count. */
export type ProjectsResultDto = {
  /** The contents. */
  items: Maybe<Array<Projects>>;
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
  /** Query Contributing Cohorts content items. */
  referencesContributingCohortsContents: Maybe<Array<ContributingCohorts>>;
  /** Query Contributing Cohorts content items with total count. */
  referencesContributingCohortsContentsWithTotal: Maybe<ContributingCohortsResultDto>;
  /** Query Events content items. */
  referencingEventsContents: Maybe<Array<Events>>;
  /** Query Events content items with total count. */
  referencingEventsContentsWithTotal: Maybe<EventsResultDto>;
  /** Query Outputs content items. */
  referencingOutputsContents: Maybe<Array<Outputs>>;
  /** Query Outputs content items with total count. */
  referencingOutputsContentsWithTotal: Maybe<OutputsResultDto>;
  /** Query Projects content items. */
  referencingProjectsContents: Maybe<Array<Projects>>;
  /** Query Projects content items with total count. */
  referencingProjectsContentsWithTotal: Maybe<ProjectsResultDto>;
  /** Query Working Groups content items. */
  referencingWorkingGroupsContents: Maybe<Array<WorkingGroups>>;
  /** Query Working Groups content items with total count. */
  referencingWorkingGroupsContentsWithTotal: Maybe<WorkingGroupsResultDto>;
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
export type UsersReferencesContributingCohortsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencesContributingCohortsContentsWithTotalArgs = {
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
export type UsersReferencingOutputsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingOutputsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingProjectsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingProjectsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingWorkingGroupsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingWorkingGroupsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of the Activated Date field of the Users content type. */
export type UsersDataActivatedDateDto = {
  iv: Maybe<Scalars['Instant']>;
};

/** The structure of the Activated Date field of the Users content input type. */
export type UsersDataActivatedDateInputDto = {
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

/** The structure of the Contributing Cohorts nested schema. */
export type UsersDataContributingCohortsChildDto = {
  id: Maybe<Array<ContributingCohorts>>;
  role: Maybe<UsersDataContributingCohortsRoleEnum>;
  study: Maybe<Scalars['String']>;
};

/** The structure of the Contributing Cohorts nested schema. */
export type UsersDataContributingCohortsChildInputDto = {
  id: InputMaybe<Array<Scalars['String']>>;
  role: InputMaybe<UsersDataContributingCohortsRoleEnum>;
  study: InputMaybe<Scalars['String']>;
};

/** The structure of the Contributing Cohorts field of the Users content type. */
export type UsersDataContributingCohortsDto = {
  iv: Maybe<Array<UsersDataContributingCohortsChildDto>>;
};

/** The structure of the Contributing Cohorts field of the Users content input type. */
export type UsersDataContributingCohortsInputDto = {
  iv: InputMaybe<Array<UsersDataContributingCohortsChildInputDto>>;
};

export enum UsersDataContributingCohortsRoleEnum {
  /** Co_Investigator */
  CoInvestigator = 'Co_Investigator',
  /** Investigator */
  Investigator = 'Investigator',
  /** Lead_Investigator */
  LeadInvestigator = 'Lead_Investigator',
}

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
  iv: Maybe<Array<UsersDataDegreeEnum>>;
};

export enum UsersDataDegreeEnum {
  /** AA */
  Aa = 'AA',
  /** AAS */
  Aas = 'AAS',
  /** BA */
  Ba = 'BA',
  /** BSc */
  BSc = 'BSc',
  /** MA */
  Ma = 'MA',
  /** MBA */
  Mba = 'MBA',
  /** MBBS */
  Mbbs = 'MBBS',
  /** MD */
  Md = 'MD',
  /** MD_PhD */
  MdPhD = 'MD_PhD',
  /** MPH */
  Mph = 'MPH',
  /** MSc */
  MSc = 'MSc',
  /** PhD */
  PhD = 'PhD',
  /** PharmD */
  PharmD = 'PharmD',
}

/** The structure of the Degree field of the Users content input type. */
export type UsersDataDegreeInputDto = {
  iv: InputMaybe<Array<UsersDataDegreeEnum>>;
};

/** The structure of the Users data type. */
export type UsersDataDto = {
  activatedDate: Maybe<UsersDataActivatedDateDto>;
  avatar: Maybe<UsersDataAvatarDto>;
  biography: Maybe<UsersDataBiographyDto>;
  city: Maybe<UsersDataCityDto>;
  connections: Maybe<UsersDataConnectionsDto>;
  contributingCohorts: Maybe<UsersDataContributingCohortsDto>;
  country: Maybe<UsersDataCountryDto>;
  degree: Maybe<UsersDataDegreeDto>;
  email: Maybe<UsersDataEmailDto>;
  firstName: Maybe<UsersDataFirstNameDto>;
  fundingStreams: Maybe<UsersDataFundingStreamsDto>;
  keywords: Maybe<UsersDataKeywordsDto>;
  lastName: Maybe<UsersDataLastNameDto>;
  onboarded: Maybe<UsersDataOnboardedDto>;
  positions: Maybe<UsersDataPositionsDto>;
  questions: Maybe<UsersDataQuestionsDto>;
  region: Maybe<UsersDataRegionDto>;
  role: Maybe<UsersDataRoleDto>;
  secondaryEmail: Maybe<UsersDataSecondaryEmailDto>;
  social: Maybe<UsersDataSocialDto>;
  telephoneCountryCode: Maybe<UsersDataTelephoneCountryCodeDto>;
  telephoneNumber: Maybe<UsersDataTelephoneNumberDto>;
};

/** The structure of the Email field of the Users content type. */
export type UsersDataEmailDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Email field of the Users content input type. */
export type UsersDataEmailInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the First Name field of the Users content type. */
export type UsersDataFirstNameDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the First Name field of the Users content input type. */
export type UsersDataFirstNameInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Funding Streams field of the Users content type. */
export type UsersDataFundingStreamsDto = {
  /** This information will be pulled for when GP2 publications arise to share financial conflicts of interests for publications. Please make sure this is up to date! */
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Funding Streams field of the Users content input type. */
export type UsersDataFundingStreamsInputDto = {
  /** This information will be pulled for when GP2 publications arise to share financial conflicts of interests for publications. Please make sure this is up to date! */
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Users data input type. */
export type UsersDataInputDto = {
  activatedDate: InputMaybe<UsersDataActivatedDateInputDto>;
  avatar: InputMaybe<UsersDataAvatarInputDto>;
  biography: InputMaybe<UsersDataBiographyInputDto>;
  city: InputMaybe<UsersDataCityInputDto>;
  connections: InputMaybe<UsersDataConnectionsInputDto>;
  contributingCohorts: InputMaybe<UsersDataContributingCohortsInputDto>;
  country: InputMaybe<UsersDataCountryInputDto>;
  degree: InputMaybe<UsersDataDegreeInputDto>;
  email: InputMaybe<UsersDataEmailInputDto>;
  firstName: InputMaybe<UsersDataFirstNameInputDto>;
  fundingStreams: InputMaybe<UsersDataFundingStreamsInputDto>;
  keywords: InputMaybe<UsersDataKeywordsInputDto>;
  lastName: InputMaybe<UsersDataLastNameInputDto>;
  onboarded: InputMaybe<UsersDataOnboardedInputDto>;
  positions: InputMaybe<UsersDataPositionsInputDto>;
  questions: InputMaybe<UsersDataQuestionsInputDto>;
  region: InputMaybe<UsersDataRegionInputDto>;
  role: InputMaybe<UsersDataRoleInputDto>;
  secondaryEmail: InputMaybe<UsersDataSecondaryEmailInputDto>;
  social: InputMaybe<UsersDataSocialInputDto>;
  telephoneCountryCode: InputMaybe<UsersDataTelephoneCountryCodeInputDto>;
  telephoneNumber: InputMaybe<UsersDataTelephoneNumberInputDto>;
};

/** The structure of the Keywords field of the Users content type. */
export type UsersDataKeywordsDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

/** The structure of the Keywords field of the Users content input type. */
export type UsersDataKeywordsInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
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

/** The structure of the Positions nested schema. */
export type UsersDataPositionsChildDto = {
  department: Maybe<Scalars['String']>;
  institution: Maybe<Scalars['String']>;
  role: Maybe<Scalars['String']>;
};

/** The structure of the Positions nested schema. */
export type UsersDataPositionsChildInputDto = {
  department: InputMaybe<Scalars['String']>;
  institution: InputMaybe<Scalars['String']>;
  role: InputMaybe<Scalars['String']>;
};

/** The structure of the Positions field of the Users content type. */
export type UsersDataPositionsDto = {
  iv: Maybe<Array<UsersDataPositionsChildDto>>;
};

/** The structure of the Positions field of the Users content input type. */
export type UsersDataPositionsInputDto = {
  iv: InputMaybe<Array<UsersDataPositionsChildInputDto>>;
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

/** The structure of the Region field of the Users content type. */
export type UsersDataRegionDto = {
  iv: Maybe<UsersDataRegionEnum>;
};

export enum UsersDataRegionEnum {
  /** Africa */
  Africa = 'Africa',
  /** Asia */
  Asia = 'Asia',
  /** Australia_Australiasia */
  AustraliaAustraliasia = 'Australia_Australiasia',
  /** Europe */
  Europe = 'Europe',
  /** Latin_America */
  LatinAmerica = 'Latin_America',
  /** North_America */
  NorthAmerica = 'North_America',
  /** South_America */
  SouthAmerica = 'South_America',
}

/** The structure of the Region field of the Users content input type. */
export type UsersDataRegionInputDto = {
  iv: InputMaybe<UsersDataRegionEnum>;
};

/** The structure of the GP2 Hub Role field of the Users content type. */
export type UsersDataRoleDto = {
  /** Role on the GP2 Hub */
  iv: Maybe<UsersDataRoleEnum>;
};

export enum UsersDataRoleEnum {
  /** Administrator */
  Administrator = 'Administrator',
  /** Hidden */
  Hidden = 'Hidden',
  /** Network_Collaborator */
  NetworkCollaborator = 'Network_Collaborator',
  /** Network_Investigator */
  NetworkInvestigator = 'Network_Investigator',
  /** Trainee */
  Trainee = 'Trainee',
  /** Working_Group_Participant */
  WorkingGroupParticipant = 'Working_Group_Participant',
}

/** The structure of the GP2 Hub Role field of the Users content input type. */
export type UsersDataRoleInputDto = {
  /** Role on the GP2 Hub */
  iv: InputMaybe<UsersDataRoleEnum>;
};

/** The structure of the Alternative Email field of the Users content type. */
export type UsersDataSecondaryEmailDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Alternative Email field of the Users content input type. */
export type UsersDataSecondaryEmailInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Social Links nested schema. */
export type UsersDataSocialChildDto = {
  blog: Maybe<Scalars['String']>;
  github: Maybe<Scalars['String']>;
  googleScholar: Maybe<Scalars['String']>;
  linkedIn: Maybe<Scalars['String']>;
  orcid: Maybe<Scalars['String']>;
  researchGate: Maybe<Scalars['String']>;
  researcherId: Maybe<Scalars['String']>;
  twitter: Maybe<Scalars['String']>;
};

/** The structure of the Social Links nested schema. */
export type UsersDataSocialChildInputDto = {
  blog: InputMaybe<Scalars['String']>;
  github: InputMaybe<Scalars['String']>;
  googleScholar: InputMaybe<Scalars['String']>;
  linkedIn: InputMaybe<Scalars['String']>;
  orcid: InputMaybe<Scalars['String']>;
  researchGate: InputMaybe<Scalars['String']>;
  researcherId: InputMaybe<Scalars['String']>;
  twitter: InputMaybe<Scalars['String']>;
};

/** The structure of the Social Links field of the Users content type. */
export type UsersDataSocialDto = {
  iv: Maybe<Array<UsersDataSocialChildDto>>;
};

/** The structure of the Social Links field of the Users content input type. */
export type UsersDataSocialInputDto = {
  iv: InputMaybe<Array<UsersDataSocialChildInputDto>>;
};

/** The structure of the Country code field of the Users content type. */
export type UsersDataTelephoneCountryCodeDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Country code field of the Users content input type. */
export type UsersDataTelephoneCountryCodeInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Telephone number field of the Users content type. */
export type UsersDataTelephoneNumberDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Telephone number field of the Users content input type. */
export type UsersDataTelephoneNumberInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the flat Users data type. */
export type UsersFlatDataDto = {
  activatedDate: Maybe<Scalars['Instant']>;
  avatar: Maybe<Array<Asset>>;
  biography: Maybe<Scalars['String']>;
  city: Maybe<Scalars['String']>;
  connections: Maybe<Array<UsersDataConnectionsChildDto>>;
  contributingCohorts: Maybe<Array<UsersDataContributingCohortsChildDto>>;
  country: Maybe<Scalars['String']>;
  degree: Maybe<Array<UsersDataDegreeEnum>>;
  email: Maybe<Scalars['String']>;
  firstName: Maybe<Scalars['String']>;
  /** This information will be pulled for when GP2 publications arise to share financial conflicts of interests for publications. Please make sure this is up to date! */
  fundingStreams: Maybe<Scalars['String']>;
  keywords: Maybe<Array<Scalars['String']>>;
  lastName: Maybe<Scalars['String']>;
  /** Use this to allow the user to see the full Hub and skip profile completion */
  onboarded: Maybe<Scalars['Boolean']>;
  positions: Maybe<Array<UsersDataPositionsChildDto>>;
  questions: Maybe<Array<UsersDataQuestionsChildDto>>;
  region: Maybe<UsersDataRegionEnum>;
  /** Role on the GP2 Hub */
  role: Maybe<UsersDataRoleEnum>;
  secondaryEmail: Maybe<Scalars['String']>;
  social: Maybe<Array<UsersDataSocialChildDto>>;
  telephoneCountryCode: Maybe<Scalars['String']>;
  telephoneNumber: Maybe<Scalars['String']>;
};

/** List of Users items and total count. */
export type UsersResultDto = {
  /** The contents. */
  items: Maybe<Array<Users>>;
  /** The total count of  contents. */
  total: Scalars['Int'];
};

/** The structure of a Working Group Network content type. */
export type WorkingGroupNetwork = Content & {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The data of the content. */
  data: WorkingGroupNetworkDataDto;
  /** The edit token. */
  editToken: Maybe<Scalars['String']>;
  /** The flat data of the content. */
  flatData: WorkingGroupNetworkFlatDataDto;
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
  /** Query Working Groups content items. */
  referencesWorkingGroupsContents: Maybe<Array<WorkingGroups>>;
  /** Query Working Groups content items with total count. */
  referencesWorkingGroupsContentsWithTotal: Maybe<WorkingGroupsResultDto>;
  /** The status of the content. */
  status: Scalars['String'];
  /** The status color of the content. */
  statusColor: Scalars['String'];
  /** The URL to the content. */
  url: Scalars['String'];
  /** The version of the objec. */
  version: Scalars['Int'];
};

/** The structure of a Working Group Network content type. */
export type WorkingGroupNetworkReferencesWorkingGroupsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Working Group Network content type. */
export type WorkingGroupNetworkReferencesWorkingGroupsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of the Complex Disease Working Groups field of the Working Group Network content type. */
export type WorkingGroupNetworkDataComplexDiseaseDto = {
  iv: Maybe<Array<WorkingGroups>>;
};

/** The structure of the Complex Disease Working Groups field of the Working Group Network content input type. */
export type WorkingGroupNetworkDataComplexDiseaseInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Working Group Network data type. */
export type WorkingGroupNetworkDataDto = {
  complexDisease: Maybe<WorkingGroupNetworkDataComplexDiseaseDto>;
  monogenic: Maybe<WorkingGroupNetworkDataMonogenicDto>;
  operational: Maybe<WorkingGroupNetworkDataOperationalDto>;
  steeringCommitee: Maybe<WorkingGroupNetworkDataSteeringCommiteeDto>;
};

/** The structure of the Working Group Network data input type. */
export type WorkingGroupNetworkDataInputDto = {
  complexDisease: InputMaybe<WorkingGroupNetworkDataComplexDiseaseInputDto>;
  monogenic: InputMaybe<WorkingGroupNetworkDataMonogenicInputDto>;
  operational: InputMaybe<WorkingGroupNetworkDataOperationalInputDto>;
  steeringCommitee: InputMaybe<WorkingGroupNetworkDataSteeringCommiteeInputDto>;
};

/** The structure of the Monogenic Working Groups field of the Working Group Network content type. */
export type WorkingGroupNetworkDataMonogenicDto = {
  iv: Maybe<Array<WorkingGroups>>;
};

/** The structure of the Monogenic Working Groups field of the Working Group Network content input type. */
export type WorkingGroupNetworkDataMonogenicInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Operational Working Groups field of the Working Group Network content type. */
export type WorkingGroupNetworkDataOperationalDto = {
  iv: Maybe<Array<WorkingGroups>>;
};

/** The structure of the Operational Working Groups field of the Working Group Network content input type. */
export type WorkingGroupNetworkDataOperationalInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Steering Committee field of the Working Group Network content type. */
export type WorkingGroupNetworkDataSteeringCommiteeDto = {
  iv: Maybe<Array<WorkingGroups>>;
};

/** The structure of the Steering Committee field of the Working Group Network content input type. */
export type WorkingGroupNetworkDataSteeringCommiteeInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the flat Working Group Network data type. */
export type WorkingGroupNetworkFlatDataDto = {
  complexDisease: Maybe<Array<WorkingGroups>>;
  monogenic: Maybe<Array<WorkingGroups>>;
  operational: Maybe<Array<WorkingGroups>>;
  steeringCommitee: Maybe<Array<WorkingGroups>>;
};

/** List of Working Group Network items and total count. */
export type WorkingGroupNetworkResultDto = {
  /** The contents. */
  items: Maybe<Array<WorkingGroupNetwork>>;
  /** The total count of  contents. */
  total: Scalars['Int'];
};

/** The structure of a Working Groups content type. */
export type WorkingGroups = Content & {
  /** The timestamp when the object was created. */
  created: Scalars['Instant'];
  /** The user who created the object. */
  createdBy: Scalars['String'];
  /** The user who created the object. */
  createdByUser: User;
  /** The data of the content. */
  data: WorkingGroupsDataDto;
  /** The edit token. */
  editToken: Maybe<Scalars['String']>;
  /** The flat data of the content. */
  flatData: WorkingGroupsFlatDataDto;
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
  /** Query Users content items. */
  referencesUsersContents: Maybe<Array<Users>>;
  /** Query Users content items with total count. */
  referencesUsersContentsWithTotal: Maybe<UsersResultDto>;
  /** Query Working Group Network content items. */
  referencingWorkingGroupNetworkContents: Maybe<Array<WorkingGroupNetwork>>;
  /** Query Working Group Network content items with total count. */
  referencingWorkingGroupNetworkContentsWithTotal: Maybe<WorkingGroupNetworkResultDto>;
  /** The status of the content. */
  status: Scalars['String'];
  /** The status color of the content. */
  statusColor: Scalars['String'];
  /** The URL to the content. */
  url: Scalars['String'];
  /** The version of the objec. */
  version: Scalars['Int'];
};

/** The structure of a Working Groups content type. */
export type WorkingGroupsReferencesUsersContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Working Groups content type. */
export type WorkingGroupsReferencesUsersContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Working Groups content type. */
export type WorkingGroupsReferencingWorkingGroupNetworkContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Working Groups content type. */
export type WorkingGroupsReferencingWorkingGroupNetworkContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of the Description field of the Working Groups content type. */
export type WorkingGroupsDataDescriptionDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Description field of the Working Groups content input type. */
export type WorkingGroupsDataDescriptionInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Working Groups data type. */
export type WorkingGroupsDataDto = {
  description: Maybe<WorkingGroupsDataDescriptionDto>;
  leadingMembers: Maybe<WorkingGroupsDataLeadingMembersDto>;
  members: Maybe<WorkingGroupsDataMembersDto>;
  primaryEmail: Maybe<WorkingGroupsDataPrimaryEmailDto>;
  resources: Maybe<WorkingGroupsDataResourcesDto>;
  secondaryEmail: Maybe<WorkingGroupsDataSecondaryEmailDto>;
  shortDescription: Maybe<WorkingGroupsDataShortDescriptionDto>;
  title: Maybe<WorkingGroupsDataTitleDto>;
};

/** The structure of the Working Groups data input type. */
export type WorkingGroupsDataInputDto = {
  description: InputMaybe<WorkingGroupsDataDescriptionInputDto>;
  leadingMembers: InputMaybe<WorkingGroupsDataLeadingMembersInputDto>;
  members: InputMaybe<WorkingGroupsDataMembersInputDto>;
  primaryEmail: InputMaybe<WorkingGroupsDataPrimaryEmailInputDto>;
  resources: InputMaybe<WorkingGroupsDataResourcesInputDto>;
  secondaryEmail: InputMaybe<WorkingGroupsDataSecondaryEmailInputDto>;
  shortDescription: InputMaybe<WorkingGroupsDataShortDescriptionInputDto>;
  title: InputMaybe<WorkingGroupsDataTitleInputDto>;
};

/** The structure of the Leading Members field of the Working Groups content type. */
export type WorkingGroupsDataLeadingMembersDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Leading Members field of the Working Groups content input type. */
export type WorkingGroupsDataLeadingMembersInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Members nested schema. */
export type WorkingGroupsDataMembersChildDto = {
  role: Maybe<WorkingGroupsDataMembersRoleEnum>;
  user: Maybe<Array<Users>>;
};

/** The structure of the Members nested schema. */
export type WorkingGroupsDataMembersChildInputDto = {
  role: InputMaybe<WorkingGroupsDataMembersRoleEnum>;
  user: InputMaybe<Array<Scalars['String']>>;
};

/** The structure of the Members field of the Working Groups content type. */
export type WorkingGroupsDataMembersDto = {
  iv: Maybe<Array<WorkingGroupsDataMembersChildDto>>;
};

/** The structure of the Members field of the Working Groups content input type. */
export type WorkingGroupsDataMembersInputDto = {
  iv: InputMaybe<Array<WorkingGroupsDataMembersChildInputDto>>;
};

export enum WorkingGroupsDataMembersRoleEnum {
  /** Co_lead */
  CoLead = 'Co_lead',
  /** Lead */
  Lead = 'Lead',
  /** Working_group_member */
  WorkingGroupMember = 'Working_group_member',
}

/** The structure of the Working Group Email field of the Working Groups content type. */
export type WorkingGroupsDataPrimaryEmailDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Working Group Email field of the Working Groups content input type. */
export type WorkingGroupsDataPrimaryEmailInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Resources nested schema. */
export type WorkingGroupsDataResourcesChildDto = {
  description: Maybe<Scalars['String']>;
  /** External link for a resource */
  externalLink: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
  type: Maybe<WorkingGroupsDataResourcesTypeEnum>;
};

/** The structure of the Resources nested schema. */
export type WorkingGroupsDataResourcesChildInputDto = {
  description: InputMaybe<Scalars['String']>;
  /** External link for a resource */
  externalLink: InputMaybe<Scalars['String']>;
  title: InputMaybe<Scalars['String']>;
  type: InputMaybe<WorkingGroupsDataResourcesTypeEnum>;
};

/** The structure of the Resources field of the Working Groups content type. */
export type WorkingGroupsDataResourcesDto = {
  iv: Maybe<Array<WorkingGroupsDataResourcesChildDto>>;
};

/** The structure of the Resources field of the Working Groups content input type. */
export type WorkingGroupsDataResourcesInputDto = {
  iv: InputMaybe<Array<WorkingGroupsDataResourcesChildInputDto>>;
};

export enum WorkingGroupsDataResourcesTypeEnum {
  /** Link */
  Link = 'Link',
  /** Note */
  Note = 'Note',
}

/** The structure of the WG's Lead Email field of the Working Groups content type. */
export type WorkingGroupsDataSecondaryEmailDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the WG's Lead Email field of the Working Groups content input type. */
export type WorkingGroupsDataSecondaryEmailInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Short Description field of the Working Groups content type. */
export type WorkingGroupsDataShortDescriptionDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Short Description field of the Working Groups content input type. */
export type WorkingGroupsDataShortDescriptionInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the Title field of the Working Groups content type. */
export type WorkingGroupsDataTitleDto = {
  iv: Maybe<Scalars['String']>;
};

/** The structure of the Title field of the Working Groups content input type. */
export type WorkingGroupsDataTitleInputDto = {
  iv: InputMaybe<Scalars['String']>;
};

/** The structure of the flat Working Groups data type. */
export type WorkingGroupsFlatDataDto = {
  description: Maybe<Scalars['String']>;
  leadingMembers: Maybe<Scalars['String']>;
  members: Maybe<Array<WorkingGroupsDataMembersChildDto>>;
  primaryEmail: Maybe<Scalars['String']>;
  resources: Maybe<Array<WorkingGroupsDataResourcesChildDto>>;
  secondaryEmail: Maybe<Scalars['String']>;
  shortDescription: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
};

/** List of Working Groups items and total count. */
export type WorkingGroupsResultDto = {
  /** The contents. */
  items: Maybe<Array<WorkingGroups>>;
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
          }
        >
      >;
    }
  >;
};

export type ContributingCohortsContentFragment = Pick<
  ContributingCohorts,
  'id'
> & { flatData: Pick<ContributingCohortsFlatDataDto, 'name'> };

export type FetchContributingCohortsQueryVariables = Exact<{
  top: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
}>;

export type FetchContributingCohortsQuery = {
  queryContributingCohortsContentsWithTotal: Maybe<
    Pick<ContributingCohortsResultDto, 'total'> & {
      items: Maybe<
        Array<
          Pick<ContributingCohorts, 'id'> & {
            flatData: Pick<ContributingCohortsFlatDataDto, 'name'>;
          }
        >
      >;
    }
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
      }>
    >;
    thumbnail: Maybe<Array<Pick<Asset, 'id'>>>;
    speakers: Maybe<
      Array<{
        user: Maybe<
          Array<
            { __typename: 'Users' } & Pick<Users, 'id'> & {
                flatData: Pick<
                  UsersFlatDataDto,
                  'firstName' | 'lastName' | 'onboarded'
                > & { avatar: Maybe<Array<Pick<Asset, 'id'>>> };
              }
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
                }>
              >;
              thumbnail: Maybe<Array<Pick<Asset, 'id'>>>;
              speakers: Maybe<
                Array<{
                  user: Maybe<
                    Array<
                      { __typename: 'Users' } & Pick<Users, 'id'> & {
                          flatData: Pick<
                            UsersFlatDataDto,
                            'firstName' | 'lastName' | 'onboarded'
                          > & { avatar: Maybe<Array<Pick<Asset, 'id'>>> };
                        }
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
          }>
        >;
        thumbnail: Maybe<Array<Pick<Asset, 'id'>>>;
        speakers: Maybe<
          Array<{
            user: Maybe<
              Array<
                { __typename: 'Users' } & Pick<Users, 'id'> & {
                    flatData: Pick<
                      UsersFlatDataDto,
                      'firstName' | 'lastName' | 'onboarded'
                    > & { avatar: Maybe<Array<Pick<Asset, 'id'>>> };
                  }
              >
            >;
          }>
        >;
      };
    }
  >;
};

export type NewsContentFragment = Pick<
  NewsAndEvents,
  'id' | 'created' | 'lastModified' | 'version'
> & {
  flatData: Pick<
    NewsAndEventsFlatDataDto,
    | 'title'
    | 'shortText'
    | 'link'
    | 'linkText'
    | 'sampleCount'
    | 'articleCount'
    | 'cohortCount'
  >;
};

export type FetchNewsQueryVariables = Exact<{
  top: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
}>;

export type FetchNewsQuery = {
  queryNewsAndEventsContentsWithTotal: Maybe<
    Pick<NewsAndEventsResultDto, 'total'> & {
      items: Maybe<
        Array<
          Pick<NewsAndEvents, 'id' | 'created' | 'lastModified' | 'version'> & {
            flatData: Pick<
              NewsAndEventsFlatDataDto,
              | 'title'
              | 'shortText'
              | 'link'
              | 'linkText'
              | 'sampleCount'
              | 'articleCount'
              | 'cohortCount'
            >;
          }
        >
      >;
    }
  >;
};

export type OutputContentFragment = Pick<
  Outputs,
  'id' | 'created' | 'lastModified' | 'version'
> & {
  flatData: Pick<
    OutputsFlatDataDto,
    | 'title'
    | 'documentType'
    | 'type'
    | 'subtype'
    | 'link'
    | 'addedDate'
    | 'publishDate'
    | 'lastUpdatedPartial'
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
                'firstName' | 'lastName' | 'onboarded'
              > & { avatar: Maybe<Array<Pick<Asset, 'id'>>> };
            })
      >
    >;
  };
};

export type FetchOutputQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchOutputQuery = {
  findOutputsContent: Maybe<
    Pick<Outputs, 'id' | 'created' | 'lastModified' | 'version'> & {
      flatData: Pick<
        OutputsFlatDataDto,
        | 'title'
        | 'documentType'
        | 'type'
        | 'subtype'
        | 'link'
        | 'addedDate'
        | 'publishDate'
        | 'lastUpdatedPartial'
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
                    'firstName' | 'lastName' | 'onboarded'
                  > & { avatar: Maybe<Array<Pick<Asset, 'id'>>> };
                })
          >
        >;
      };
    }
  >;
};

export type FetchOutputsQueryVariables = Exact<{
  top: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
  filter: InputMaybe<Scalars['String']>;
}>;

export type FetchOutputsQuery = {
  queryOutputsContentsWithTotal: Maybe<
    Pick<OutputsResultDto, 'total'> & {
      items: Maybe<
        Array<
          Pick<Outputs, 'id' | 'created' | 'lastModified' | 'version'> & {
            flatData: Pick<
              OutputsFlatDataDto,
              | 'title'
              | 'documentType'
              | 'type'
              | 'subtype'
              | 'link'
              | 'addedDate'
              | 'publishDate'
              | 'lastUpdatedPartial'
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
                          'firstName' | 'lastName' | 'onboarded'
                        > & { avatar: Maybe<Array<Pick<Asset, 'id'>>> };
                      })
                >
              >;
            };
          }
        >
      >;
    }
  >;
};

export type ProjectContentFragment = Pick<Projects, 'id'> & {
  flatData: Pick<
    ProjectsFlatDataDto,
    | 'title'
    | 'startDate'
    | 'endDate'
    | 'status'
    | 'projectProposal'
    | 'description'
    | 'pmEmail'
    | 'leadEmail'
    | 'keywords'
  > & {
    members: Maybe<
      Array<
        Pick<ProjectsDataMembersChildDto, 'role'> & {
          user: Maybe<
            Array<
              Pick<Users, 'id' | 'created' | 'lastModified' | 'version'> & {
                flatData: Pick<
                  UsersFlatDataDto,
                  'firstName' | 'lastName' | 'onboarded'
                > & { avatar: Maybe<Array<Pick<Asset, 'id'>>> };
              }
            >
          >;
        }
      >
    >;
    milestones: Maybe<
      Array<
        Pick<
          ProjectsDataMilestonesChildDto,
          'title' | 'description' | 'status' | 'link'
        >
      >
    >;
    resources: Maybe<
      Array<
        Pick<
          ProjectsDataResourcesChildDto,
          'type' | 'title' | 'description' | 'externalLink'
        >
      >
    >;
  };
};

export type FetchProjectQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchProjectQuery = {
  findProjectsContent: Maybe<
    Pick<Projects, 'id'> & {
      flatData: Pick<
        ProjectsFlatDataDto,
        | 'title'
        | 'startDate'
        | 'endDate'
        | 'status'
        | 'projectProposal'
        | 'description'
        | 'pmEmail'
        | 'leadEmail'
        | 'keywords'
      > & {
        members: Maybe<
          Array<
            Pick<ProjectsDataMembersChildDto, 'role'> & {
              user: Maybe<
                Array<
                  Pick<Users, 'id' | 'created' | 'lastModified' | 'version'> & {
                    flatData: Pick<
                      UsersFlatDataDto,
                      'firstName' | 'lastName' | 'onboarded'
                    > & { avatar: Maybe<Array<Pick<Asset, 'id'>>> };
                  }
                >
              >;
            }
          >
        >;
        milestones: Maybe<
          Array<
            Pick<
              ProjectsDataMilestonesChildDto,
              'title' | 'description' | 'status' | 'link'
            >
          >
        >;
        resources: Maybe<
          Array<
            Pick<
              ProjectsDataResourcesChildDto,
              'type' | 'title' | 'description' | 'externalLink'
            >
          >
        >;
      };
    }
  >;
};

export type FetchProjectsQueryVariables = Exact<{ [key: string]: never }>;

export type FetchProjectsQuery = {
  queryProjectsContentsWithTotal: Maybe<
    Pick<ProjectsResultDto, 'total'> & {
      items: Maybe<
        Array<
          Pick<Projects, 'id'> & {
            flatData: Pick<
              ProjectsFlatDataDto,
              | 'title'
              | 'startDate'
              | 'endDate'
              | 'status'
              | 'projectProposal'
              | 'description'
              | 'pmEmail'
              | 'leadEmail'
              | 'keywords'
            > & {
              members: Maybe<
                Array<
                  Pick<ProjectsDataMembersChildDto, 'role'> & {
                    user: Maybe<
                      Array<
                        Pick<
                          Users,
                          'id' | 'created' | 'lastModified' | 'version'
                        > & {
                          flatData: Pick<
                            UsersFlatDataDto,
                            'firstName' | 'lastName' | 'onboarded'
                          > & { avatar: Maybe<Array<Pick<Asset, 'id'>>> };
                        }
                      >
                    >;
                  }
                >
              >;
              milestones: Maybe<
                Array<
                  Pick<
                    ProjectsDataMilestonesChildDto,
                    'title' | 'description' | 'status' | 'link'
                  >
                >
              >;
              resources: Maybe<
                Array<
                  Pick<
                    ProjectsDataResourcesChildDto,
                    'type' | 'title' | 'description' | 'externalLink'
                  >
                >
              >;
            };
          }
        >
      >;
    }
  >;
};

export type UsersContentFragment = Pick<
  Users,
  'id' | 'created' | 'lastModified' | 'version'
> & {
  flatData: Pick<
    UsersFlatDataDto,
    | 'degree'
    | 'email'
    | 'firstName'
    | 'lastName'
    | 'region'
    | 'role'
    | 'country'
    | 'city'
    | 'onboarded'
    | 'secondaryEmail'
    | 'telephoneCountryCode'
    | 'telephoneNumber'
    | 'keywords'
    | 'fundingStreams'
    | 'biography'
    | 'activatedDate'
  > & {
    avatar: Maybe<Array<Pick<Asset, 'id'>>>;
    connections: Maybe<Array<Pick<UsersDataConnectionsChildDto, 'code'>>>;
    positions: Maybe<
      Array<
        Pick<UsersDataPositionsChildDto, 'role' | 'department' | 'institution'>
      >
    >;
    questions: Maybe<Array<Pick<UsersDataQuestionsChildDto, 'question'>>>;
    contributingCohorts: Maybe<
      Array<
        Pick<UsersDataContributingCohortsChildDto, 'role' | 'study'> & {
          id: Maybe<
            Array<
              Pick<ContributingCohorts, 'id'> & {
                flatData: Pick<ContributingCohortsFlatDataDto, 'name'>;
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
          | 'googleScholar'
          | 'orcid'
          | 'researchGate'
          | 'researcherId'
          | 'blog'
          | 'twitter'
          | 'linkedIn'
          | 'github'
        >
      >
    >;
  };
  referencingProjectsContents: Maybe<
    Array<
      Pick<Projects, 'id'> & {
        flatData: Pick<ProjectsFlatDataDto, 'status' | 'title'> & {
          members: Maybe<
            Array<
              Pick<ProjectsDataMembersChildDto, 'role'> & {
                user: Maybe<Array<Pick<Users, 'id'>>>;
              }
            >
          >;
        };
      }
    >
  >;
  referencingWorkingGroupsContents: Maybe<
    Array<
      Pick<WorkingGroups, 'id'> & {
        flatData: Pick<WorkingGroupsFlatDataDto, 'title'> & {
          members: Maybe<
            Array<
              Pick<WorkingGroupsDataMembersChildDto, 'role'> & {
                user: Maybe<Array<Pick<Users, 'id'>>>;
              }
            >
          >;
        };
      }
    >
  >;
};

export type FetchUserQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchUserQuery = {
  findUsersContent: Maybe<
    Pick<Users, 'id' | 'created' | 'lastModified' | 'version'> & {
      flatData: Pick<
        UsersFlatDataDto,
        | 'degree'
        | 'email'
        | 'firstName'
        | 'lastName'
        | 'region'
        | 'role'
        | 'country'
        | 'city'
        | 'onboarded'
        | 'secondaryEmail'
        | 'telephoneCountryCode'
        | 'telephoneNumber'
        | 'keywords'
        | 'fundingStreams'
        | 'biography'
        | 'activatedDate'
      > & {
        avatar: Maybe<Array<Pick<Asset, 'id'>>>;
        connections: Maybe<Array<Pick<UsersDataConnectionsChildDto, 'code'>>>;
        positions: Maybe<
          Array<
            Pick<
              UsersDataPositionsChildDto,
              'role' | 'department' | 'institution'
            >
          >
        >;
        questions: Maybe<Array<Pick<UsersDataQuestionsChildDto, 'question'>>>;
        contributingCohorts: Maybe<
          Array<
            Pick<UsersDataContributingCohortsChildDto, 'role' | 'study'> & {
              id: Maybe<
                Array<
                  Pick<ContributingCohorts, 'id'> & {
                    flatData: Pick<ContributingCohortsFlatDataDto, 'name'>;
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
              | 'googleScholar'
              | 'orcid'
              | 'researchGate'
              | 'researcherId'
              | 'blog'
              | 'twitter'
              | 'linkedIn'
              | 'github'
            >
          >
        >;
      };
      referencingProjectsContents: Maybe<
        Array<
          Pick<Projects, 'id'> & {
            flatData: Pick<ProjectsFlatDataDto, 'status' | 'title'> & {
              members: Maybe<
                Array<
                  Pick<ProjectsDataMembersChildDto, 'role'> & {
                    user: Maybe<Array<Pick<Users, 'id'>>>;
                  }
                >
              >;
            };
          }
        >
      >;
      referencingWorkingGroupsContents: Maybe<
        Array<
          Pick<WorkingGroups, 'id'> & {
            flatData: Pick<WorkingGroupsFlatDataDto, 'title'> & {
              members: Maybe<
                Array<
                  Pick<WorkingGroupsDataMembersChildDto, 'role'> & {
                    user: Maybe<Array<Pick<Users, 'id'>>>;
                  }
                >
              >;
            };
          }
        >
      >;
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
              | 'degree'
              | 'email'
              | 'firstName'
              | 'lastName'
              | 'region'
              | 'role'
              | 'country'
              | 'city'
              | 'onboarded'
              | 'secondaryEmail'
              | 'telephoneCountryCode'
              | 'telephoneNumber'
              | 'keywords'
              | 'fundingStreams'
              | 'biography'
              | 'activatedDate'
            > & {
              avatar: Maybe<Array<Pick<Asset, 'id'>>>;
              connections: Maybe<
                Array<Pick<UsersDataConnectionsChildDto, 'code'>>
              >;
              positions: Maybe<
                Array<
                  Pick<
                    UsersDataPositionsChildDto,
                    'role' | 'department' | 'institution'
                  >
                >
              >;
              questions: Maybe<
                Array<Pick<UsersDataQuestionsChildDto, 'question'>>
              >;
              contributingCohorts: Maybe<
                Array<
                  Pick<
                    UsersDataContributingCohortsChildDto,
                    'role' | 'study'
                  > & {
                    id: Maybe<
                      Array<
                        Pick<ContributingCohorts, 'id'> & {
                          flatData: Pick<
                            ContributingCohortsFlatDataDto,
                            'name'
                          >;
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
                    | 'googleScholar'
                    | 'orcid'
                    | 'researchGate'
                    | 'researcherId'
                    | 'blog'
                    | 'twitter'
                    | 'linkedIn'
                    | 'github'
                  >
                >
              >;
            };
            referencingProjectsContents: Maybe<
              Array<
                Pick<Projects, 'id'> & {
                  flatData: Pick<ProjectsFlatDataDto, 'status' | 'title'> & {
                    members: Maybe<
                      Array<
                        Pick<ProjectsDataMembersChildDto, 'role'> & {
                          user: Maybe<Array<Pick<Users, 'id'>>>;
                        }
                      >
                    >;
                  };
                }
              >
            >;
            referencingWorkingGroupsContents: Maybe<
              Array<
                Pick<WorkingGroups, 'id'> & {
                  flatData: Pick<WorkingGroupsFlatDataDto, 'title'> & {
                    members: Maybe<
                      Array<
                        Pick<WorkingGroupsDataMembersChildDto, 'role'> & {
                          user: Maybe<Array<Pick<Users, 'id'>>>;
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

export type ProjectMembersContentFragment = {
  flatData: {
    members: Maybe<Array<{ user: Maybe<Array<Pick<Users, 'id'>>> }>>;
  };
};

export type FetchProjectsMembersQueryVariables = Exact<{
  filter: InputMaybe<Scalars['String']>;
}>;

export type FetchProjectsMembersQuery = {
  queryProjectsContents: Maybe<
    Array<{
      flatData: {
        members: Maybe<Array<{ user: Maybe<Array<Pick<Users, 'id'>>> }>>;
      };
    }>
  >;
};

export type WorkingGroupMembersContentFragment = {
  flatData: {
    members: Maybe<Array<{ user: Maybe<Array<Pick<Users, 'id'>>> }>>;
  };
};

export type FetchWorkingGroupsMembersQueryVariables = Exact<{
  filter: InputMaybe<Scalars['String']>;
}>;

export type FetchWorkingGroupsMembersQuery = {
  queryWorkingGroupsContents: Maybe<
    Array<{
      flatData: {
        members: Maybe<Array<{ user: Maybe<Array<Pick<Users, 'id'>>> }>>;
      };
    }>
  >;
};

export type WorkingGroupNetworkContentFragment = Pick<
  WorkingGroupNetwork,
  'id'
> & {
  flatData: {
    steeringCommitee: Maybe<
      Array<
        Pick<WorkingGroups, 'id'> & {
          flatData: Pick<
            WorkingGroupsFlatDataDto,
            | 'title'
            | 'shortDescription'
            | 'leadingMembers'
            | 'description'
            | 'primaryEmail'
            | 'secondaryEmail'
          > & {
            members: Maybe<
              Array<
                Pick<WorkingGroupsDataMembersChildDto, 'role'> & {
                  user: Maybe<
                    Array<
                      Pick<
                        Users,
                        'id' | 'created' | 'lastModified' | 'version'
                      > & {
                        flatData: Pick<
                          UsersFlatDataDto,
                          'firstName' | 'lastName' | 'onboarded'
                        > & { avatar: Maybe<Array<Pick<Asset, 'id'>>> };
                      }
                    >
                  >;
                }
              >
            >;
            resources: Maybe<
              Array<
                Pick<
                  WorkingGroupsDataResourcesChildDto,
                  'type' | 'title' | 'description' | 'externalLink'
                >
              >
            >;
          };
        }
      >
    >;
    complexDisease: Maybe<
      Array<
        Pick<WorkingGroups, 'id'> & {
          flatData: Pick<
            WorkingGroupsFlatDataDto,
            | 'title'
            | 'shortDescription'
            | 'leadingMembers'
            | 'description'
            | 'primaryEmail'
            | 'secondaryEmail'
          > & {
            members: Maybe<
              Array<
                Pick<WorkingGroupsDataMembersChildDto, 'role'> & {
                  user: Maybe<
                    Array<
                      Pick<
                        Users,
                        'id' | 'created' | 'lastModified' | 'version'
                      > & {
                        flatData: Pick<
                          UsersFlatDataDto,
                          'firstName' | 'lastName' | 'onboarded'
                        > & { avatar: Maybe<Array<Pick<Asset, 'id'>>> };
                      }
                    >
                  >;
                }
              >
            >;
            resources: Maybe<
              Array<
                Pick<
                  WorkingGroupsDataResourcesChildDto,
                  'type' | 'title' | 'description' | 'externalLink'
                >
              >
            >;
          };
        }
      >
    >;
    monogenic: Maybe<
      Array<
        Pick<WorkingGroups, 'id'> & {
          flatData: Pick<
            WorkingGroupsFlatDataDto,
            | 'title'
            | 'shortDescription'
            | 'leadingMembers'
            | 'description'
            | 'primaryEmail'
            | 'secondaryEmail'
          > & {
            members: Maybe<
              Array<
                Pick<WorkingGroupsDataMembersChildDto, 'role'> & {
                  user: Maybe<
                    Array<
                      Pick<
                        Users,
                        'id' | 'created' | 'lastModified' | 'version'
                      > & {
                        flatData: Pick<
                          UsersFlatDataDto,
                          'firstName' | 'lastName' | 'onboarded'
                        > & { avatar: Maybe<Array<Pick<Asset, 'id'>>> };
                      }
                    >
                  >;
                }
              >
            >;
            resources: Maybe<
              Array<
                Pick<
                  WorkingGroupsDataResourcesChildDto,
                  'type' | 'title' | 'description' | 'externalLink'
                >
              >
            >;
          };
        }
      >
    >;
    operational: Maybe<
      Array<
        Pick<WorkingGroups, 'id'> & {
          flatData: Pick<
            WorkingGroupsFlatDataDto,
            | 'title'
            | 'shortDescription'
            | 'leadingMembers'
            | 'description'
            | 'primaryEmail'
            | 'secondaryEmail'
          > & {
            members: Maybe<
              Array<
                Pick<WorkingGroupsDataMembersChildDto, 'role'> & {
                  user: Maybe<
                    Array<
                      Pick<
                        Users,
                        'id' | 'created' | 'lastModified' | 'version'
                      > & {
                        flatData: Pick<
                          UsersFlatDataDto,
                          'firstName' | 'lastName' | 'onboarded'
                        > & { avatar: Maybe<Array<Pick<Asset, 'id'>>> };
                      }
                    >
                  >;
                }
              >
            >;
            resources: Maybe<
              Array<
                Pick<
                  WorkingGroupsDataResourcesChildDto,
                  'type' | 'title' | 'description' | 'externalLink'
                >
              >
            >;
          };
        }
      >
    >;
  };
};

export type FetchWorkingGroupNetworkQueryVariables = Exact<{
  [key: string]: never;
}>;

export type FetchWorkingGroupNetworkQuery = {
  queryWorkingGroupNetworkContents: Maybe<
    Array<
      Pick<WorkingGroupNetwork, 'id'> & {
        flatData: {
          steeringCommitee: Maybe<
            Array<
              Pick<WorkingGroups, 'id'> & {
                flatData: Pick<
                  WorkingGroupsFlatDataDto,
                  | 'title'
                  | 'shortDescription'
                  | 'leadingMembers'
                  | 'description'
                  | 'primaryEmail'
                  | 'secondaryEmail'
                > & {
                  members: Maybe<
                    Array<
                      Pick<WorkingGroupsDataMembersChildDto, 'role'> & {
                        user: Maybe<
                          Array<
                            Pick<
                              Users,
                              'id' | 'created' | 'lastModified' | 'version'
                            > & {
                              flatData: Pick<
                                UsersFlatDataDto,
                                'firstName' | 'lastName' | 'onboarded'
                              > & { avatar: Maybe<Array<Pick<Asset, 'id'>>> };
                            }
                          >
                        >;
                      }
                    >
                  >;
                  resources: Maybe<
                    Array<
                      Pick<
                        WorkingGroupsDataResourcesChildDto,
                        'type' | 'title' | 'description' | 'externalLink'
                      >
                    >
                  >;
                };
              }
            >
          >;
          complexDisease: Maybe<
            Array<
              Pick<WorkingGroups, 'id'> & {
                flatData: Pick<
                  WorkingGroupsFlatDataDto,
                  | 'title'
                  | 'shortDescription'
                  | 'leadingMembers'
                  | 'description'
                  | 'primaryEmail'
                  | 'secondaryEmail'
                > & {
                  members: Maybe<
                    Array<
                      Pick<WorkingGroupsDataMembersChildDto, 'role'> & {
                        user: Maybe<
                          Array<
                            Pick<
                              Users,
                              'id' | 'created' | 'lastModified' | 'version'
                            > & {
                              flatData: Pick<
                                UsersFlatDataDto,
                                'firstName' | 'lastName' | 'onboarded'
                              > & { avatar: Maybe<Array<Pick<Asset, 'id'>>> };
                            }
                          >
                        >;
                      }
                    >
                  >;
                  resources: Maybe<
                    Array<
                      Pick<
                        WorkingGroupsDataResourcesChildDto,
                        'type' | 'title' | 'description' | 'externalLink'
                      >
                    >
                  >;
                };
              }
            >
          >;
          monogenic: Maybe<
            Array<
              Pick<WorkingGroups, 'id'> & {
                flatData: Pick<
                  WorkingGroupsFlatDataDto,
                  | 'title'
                  | 'shortDescription'
                  | 'leadingMembers'
                  | 'description'
                  | 'primaryEmail'
                  | 'secondaryEmail'
                > & {
                  members: Maybe<
                    Array<
                      Pick<WorkingGroupsDataMembersChildDto, 'role'> & {
                        user: Maybe<
                          Array<
                            Pick<
                              Users,
                              'id' | 'created' | 'lastModified' | 'version'
                            > & {
                              flatData: Pick<
                                UsersFlatDataDto,
                                'firstName' | 'lastName' | 'onboarded'
                              > & { avatar: Maybe<Array<Pick<Asset, 'id'>>> };
                            }
                          >
                        >;
                      }
                    >
                  >;
                  resources: Maybe<
                    Array<
                      Pick<
                        WorkingGroupsDataResourcesChildDto,
                        'type' | 'title' | 'description' | 'externalLink'
                      >
                    >
                  >;
                };
              }
            >
          >;
          operational: Maybe<
            Array<
              Pick<WorkingGroups, 'id'> & {
                flatData: Pick<
                  WorkingGroupsFlatDataDto,
                  | 'title'
                  | 'shortDescription'
                  | 'leadingMembers'
                  | 'description'
                  | 'primaryEmail'
                  | 'secondaryEmail'
                > & {
                  members: Maybe<
                    Array<
                      Pick<WorkingGroupsDataMembersChildDto, 'role'> & {
                        user: Maybe<
                          Array<
                            Pick<
                              Users,
                              'id' | 'created' | 'lastModified' | 'version'
                            > & {
                              flatData: Pick<
                                UsersFlatDataDto,
                                'firstName' | 'lastName' | 'onboarded'
                              > & { avatar: Maybe<Array<Pick<Asset, 'id'>>> };
                            }
                          >
                        >;
                      }
                    >
                  >;
                  resources: Maybe<
                    Array<
                      Pick<
                        WorkingGroupsDataResourcesChildDto,
                        'type' | 'title' | 'description' | 'externalLink'
                      >
                    >
                  >;
                };
              }
            >
          >;
        };
      }
    >
  >;
};

export type WorkingGroupContentFragment = Pick<WorkingGroups, 'id'> & {
  flatData: Pick<
    WorkingGroupsFlatDataDto,
    | 'title'
    | 'shortDescription'
    | 'leadingMembers'
    | 'description'
    | 'primaryEmail'
    | 'secondaryEmail'
  > & {
    members: Maybe<
      Array<
        Pick<WorkingGroupsDataMembersChildDto, 'role'> & {
          user: Maybe<
            Array<
              Pick<Users, 'id' | 'created' | 'lastModified' | 'version'> & {
                flatData: Pick<
                  UsersFlatDataDto,
                  'firstName' | 'lastName' | 'onboarded'
                > & { avatar: Maybe<Array<Pick<Asset, 'id'>>> };
              }
            >
          >;
        }
      >
    >;
    resources: Maybe<
      Array<
        Pick<
          WorkingGroupsDataResourcesChildDto,
          'type' | 'title' | 'description' | 'externalLink'
        >
      >
    >;
  };
};

export type FetchWorkingGroupQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchWorkingGroupQuery = {
  findWorkingGroupsContent: Maybe<
    Pick<WorkingGroups, 'id'> & {
      flatData: Pick<
        WorkingGroupsFlatDataDto,
        | 'title'
        | 'shortDescription'
        | 'leadingMembers'
        | 'description'
        | 'primaryEmail'
        | 'secondaryEmail'
      > & {
        members: Maybe<
          Array<
            Pick<WorkingGroupsDataMembersChildDto, 'role'> & {
              user: Maybe<
                Array<
                  Pick<Users, 'id' | 'created' | 'lastModified' | 'version'> & {
                    flatData: Pick<
                      UsersFlatDataDto,
                      'firstName' | 'lastName' | 'onboarded'
                    > & { avatar: Maybe<Array<Pick<Asset, 'id'>>> };
                  }
                >
              >;
            }
          >
        >;
        resources: Maybe<
          Array<
            Pick<
              WorkingGroupsDataResourcesChildDto,
              'type' | 'title' | 'description' | 'externalLink'
            >
          >
        >;
      };
    }
  >;
};

export type FetchWorkingGroupsQueryVariables = Exact<{ [key: string]: never }>;

export type FetchWorkingGroupsQuery = {
  queryWorkingGroupsContentsWithTotal: Maybe<
    Pick<WorkingGroupsResultDto, 'total'> & {
      items: Maybe<
        Array<
          Pick<WorkingGroups, 'id'> & {
            flatData: Pick<
              WorkingGroupsFlatDataDto,
              | 'title'
              | 'shortDescription'
              | 'leadingMembers'
              | 'description'
              | 'primaryEmail'
              | 'secondaryEmail'
            > & {
              members: Maybe<
                Array<
                  Pick<WorkingGroupsDataMembersChildDto, 'role'> & {
                    user: Maybe<
                      Array<
                        Pick<
                          Users,
                          'id' | 'created' | 'lastModified' | 'version'
                        > & {
                          flatData: Pick<
                            UsersFlatDataDto,
                            'firstName' | 'lastName' | 'onboarded'
                          > & { avatar: Maybe<Array<Pick<Asset, 'id'>>> };
                        }
                      >
                    >;
                  }
                >
              >;
              resources: Maybe<
                Array<
                  Pick<
                    WorkingGroupsDataResourcesChildDto,
                    'type' | 'title' | 'description' | 'externalLink'
                  >
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
        ],
      },
    },
  ],
} as unknown as DocumentNode<CalendarsContentFragment, unknown>;
export const ContributingCohortsContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ContributingCohortsContent' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'ContributingCohorts' },
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
} as unknown as DocumentNode<ContributingCohortsContentFragment, unknown>;
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
} as unknown as DocumentNode<EventContentFragment, unknown>;
export const NewsContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'NewsContent' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'link' } },
                { kind: 'Field', name: { kind: 'Name', value: 'linkText' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sampleCount' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'articleCount' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'cohortCount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'link' } },
                { kind: 'Field', name: { kind: 'Name', value: 'linkText' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<NewsContentFragment, unknown>;
export const OutputContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OutputContent' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Outputs' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'subtype' } },
                { kind: 'Field', name: { kind: 'Name', value: 'link' } },
                { kind: 'Field', name: { kind: 'Name', value: 'addedDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'publishDate' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'lastUpdatedPartial' },
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
                                    name: { kind: 'Name', value: 'firstName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'lastName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'onboarded' },
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
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<OutputContentFragment, unknown>;
export const ProjectContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectContent' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Projects' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'startDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'endDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'projectProposal' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'pmEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'leadEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'keywords' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'members' },
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
                                    name: { kind: 'Name', value: 'firstName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'lastName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'onboarded' },
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
                  name: { kind: 'Name', value: 'milestones' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'description' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'status' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'link' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'resources' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'description' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'externalLink' },
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
} as unknown as DocumentNode<ProjectContentFragment, unknown>;
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
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'connections' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'degree' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'region' } },
                { kind: 'Field', name: { kind: 'Name', value: 'role' } },
                { kind: 'Field', name: { kind: 'Name', value: 'country' } },
                { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'positions' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'role' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'department' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'institution' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'onboarded' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'secondaryEmail' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'telephoneCountryCode' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'telephoneNumber' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'keywords' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'fundingStreams' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'biography' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'contributingCohorts' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'role' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'study' } },
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
                  name: { kind: 'Name', value: 'social' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'googleScholar' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'orcid' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'researchGate' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'researcherId' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'blog' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'twitter' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'linkedIn' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'github' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'activatedDate' },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'referencingProjectsContents' },
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
                        name: { kind: 'Name', value: 'members' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'role' },
                            },
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
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'status' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'referencingWorkingGroupsContents' },
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
                        name: { kind: 'Name', value: 'members' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'role' },
                            },
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
                                ],
                              },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
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
export const ProjectMembersContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectMembersContent' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Projects' },
      },
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
                  name: { kind: 'Name', value: 'members' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
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
} as unknown as DocumentNode<ProjectMembersContentFragment, unknown>;
export const WorkingGroupMembersContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'WorkingGroupMembersContent' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'WorkingGroups' },
      },
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
                  name: { kind: 'Name', value: 'members' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
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
} as unknown as DocumentNode<WorkingGroupMembersContentFragment, unknown>;
export const WorkingGroupContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'WorkingGroupContent' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'WorkingGroups' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'shortDescription' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'leadingMembers' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'primaryEmail' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'secondaryEmail' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'members' },
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
                                    name: { kind: 'Name', value: 'firstName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'lastName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'onboarded' },
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
                  name: { kind: 'Name', value: 'resources' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'description' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'externalLink' },
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
} as unknown as DocumentNode<WorkingGroupContentFragment, unknown>;
export const WorkingGroupNetworkContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'WorkingGroupNetworkContent' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'WorkingGroupNetwork' },
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
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'steeringCommitee' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'WorkingGroupContent' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'complexDisease' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'WorkingGroupContent' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'monogenic' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'WorkingGroupContent' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'operational' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'WorkingGroupContent' },
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
    ...WorkingGroupContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<WorkingGroupNetworkContentFragment, unknown>;
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
export const FetchContributingCohortsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchContributingCohorts' },
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
              value: 'queryContributingCohortsContentsWithTotal',
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
                        name: {
                          kind: 'Name',
                          value: 'ContributingCohortsContent',
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
    ...ContributingCohortsContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchContributingCohortsQuery,
  FetchContributingCohortsQueryVariables
>;
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
export const FetchNewsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchNews' },
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
              value: 'queryNewsAndEventsContentsWithTotal',
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
                        name: { kind: 'Name', value: 'NewsContent' },
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
    ...NewsContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchNewsQuery, FetchNewsQueryVariables>;
export const FetchOutputDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchOutput' },
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
            name: { kind: 'Name', value: 'findOutputsContent' },
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
                  name: { kind: 'Name', value: 'OutputContent' },
                },
              ],
            },
          },
        ],
      },
    },
    ...OutputContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchOutputQuery, FetchOutputQueryVariables>;
export const FetchOutputsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchOutputs' },
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
            name: { kind: 'Name', value: 'queryOutputsContentsWithTotal' },
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
                        name: { kind: 'Name', value: 'OutputContent' },
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
    ...OutputContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchOutputsQuery, FetchOutputsQueryVariables>;
export const FetchProjectDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchProject' },
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
            name: { kind: 'Name', value: 'findProjectsContent' },
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
                  name: { kind: 'Name', value: 'ProjectContent' },
                },
              ],
            },
          },
        ],
      },
    },
    ...ProjectContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchProjectQuery, FetchProjectQueryVariables>;
export const FetchProjectsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchProjects' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'queryProjectsContentsWithTotal' },
            arguments: [
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
                        name: { kind: 'Name', value: 'ProjectContent' },
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
    ...ProjectContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchProjectsQuery, FetchProjectsQueryVariables>;
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
export const FetchProjectsMembersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchProjectsMembers' },
      variableDefinitions: [
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
            name: { kind: 'Name', value: 'queryProjectsContents' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'filter' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'ProjectMembersContent' },
                },
              ],
            },
          },
        ],
      },
    },
    ...ProjectMembersContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchProjectsMembersQuery,
  FetchProjectsMembersQueryVariables
>;
export const FetchWorkingGroupsMembersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchWorkingGroupsMembers' },
      variableDefinitions: [
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
            name: { kind: 'Name', value: 'queryWorkingGroupsContents' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'filter' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'WorkingGroupMembersContent' },
                },
              ],
            },
          },
        ],
      },
    },
    ...WorkingGroupMembersContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchWorkingGroupsMembersQuery,
  FetchWorkingGroupsMembersQueryVariables
>;
export const FetchWorkingGroupNetworkDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchWorkingGroupNetwork' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'queryWorkingGroupNetworkContents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'WorkingGroupNetworkContent' },
                },
              ],
            },
          },
        ],
      },
    },
    ...WorkingGroupNetworkContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchWorkingGroupNetworkQuery,
  FetchWorkingGroupNetworkQueryVariables
>;
export const FetchWorkingGroupDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchWorkingGroup' },
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
            name: { kind: 'Name', value: 'findWorkingGroupsContent' },
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
                  name: { kind: 'Name', value: 'WorkingGroupContent' },
                },
              ],
            },
          },
        ],
      },
    },
    ...WorkingGroupContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchWorkingGroupQuery,
  FetchWorkingGroupQueryVariables
>;
export const FetchWorkingGroupsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchWorkingGroups' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: {
              kind: 'Name',
              value: 'queryWorkingGroupsContentsWithTotal',
            },
            arguments: [
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
                        name: { kind: 'Name', value: 'WorkingGroupContent' },
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
    ...WorkingGroupContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchWorkingGroupsQuery,
  FetchWorkingGroupsQueryVariables
>;
