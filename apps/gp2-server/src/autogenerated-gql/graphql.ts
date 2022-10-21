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
  /** Change a Dashboard content. */
  changeDashboardContent: Dashboard;
  /** Change a Projects content. */
  changeProjectsContent: Projects;
  /** Change a Users content. */
  changeUsersContent: Users;
  /** Change a Working Group Network content. */
  changeWorkingGroupNetworkContent: WorkingGroupNetwork;
  /** Change a Working Groups content. */
  changeWorkingGroupsContent: WorkingGroups;
  /** Creates an Dashboard content. */
  createDashboardContent: Dashboard;
  /** Creates an Projects content. */
  createProjectsContent: Projects;
  /** Creates an Users content. */
  createUsersContent: Users;
  /** Creates an Working Group Network content. */
  createWorkingGroupNetworkContent: WorkingGroupNetwork;
  /** Creates an Working Groups content. */
  createWorkingGroupsContent: WorkingGroups;
  /** Delete an Dashboard content. */
  deleteDashboardContent: EntitySavedResultDto;
  /** Delete an Projects content. */
  deleteProjectsContent: EntitySavedResultDto;
  /** Delete an Users content. */
  deleteUsersContent: EntitySavedResultDto;
  /** Delete an Working Group Network content. */
  deleteWorkingGroupNetworkContent: EntitySavedResultDto;
  /** Delete an Working Groups content. */
  deleteWorkingGroupsContent: EntitySavedResultDto;
  /** Patch an Dashboard content by id. */
  patchDashboardContent: Dashboard;
  /** Patch an Projects content by id. */
  patchProjectsContent: Projects;
  /** Patch an Users content by id. */
  patchUsersContent: Users;
  /** Patch an Working Group Network content by id. */
  patchWorkingGroupNetworkContent: WorkingGroupNetwork;
  /** Patch an Working Groups content by id. */
  patchWorkingGroupsContent: WorkingGroups;
  /**
   * Publish a Dashboard content.
   * @deprecated Use 'changeDashboardContent' instead
   */
  publishDashboardContent: Dashboard;
  /**
   * Publish a Projects content.
   * @deprecated Use 'changeProjectsContent' instead
   */
  publishProjectsContent: Projects;
  /**
   * Publish a Users content.
   * @deprecated Use 'changeUsersContent' instead
   */
  publishUsersContent: Users;
  /**
   * Publish a Working Group Network content.
   * @deprecated Use 'changeWorkingGroupNetworkContent' instead
   */
  publishWorkingGroupNetworkContent: WorkingGroupNetwork;
  /**
   * Publish a Working Groups content.
   * @deprecated Use 'changeWorkingGroupsContent' instead
   */
  publishWorkingGroupsContent: WorkingGroups;
  /** Update an Dashboard content by id. */
  updateDashboardContent: Dashboard;
  /** Update an Projects content by id. */
  updateProjectsContent: Projects;
  /** Update an Users content by id. */
  updateUsersContent: Users;
  /** Update an Working Group Network content by id. */
  updateWorkingGroupNetworkContent: WorkingGroupNetwork;
  /** Update an Working Groups content by id. */
  updateWorkingGroupsContent: WorkingGroups;
  /** Upsert an Dashboard content by id. */
  upsertDashboardContent: Dashboard;
  /** Upsert an Projects content by id. */
  upsertProjectsContent: Projects;
  /** Upsert an Users content by id. */
  upsertUsersContent: Users;
  /** Upsert an Working Group Network content by id. */
  upsertWorkingGroupNetworkContent: WorkingGroupNetwork;
  /** Upsert an Working Groups content by id. */
  upsertWorkingGroupsContent: WorkingGroups;
};

/** The app mutations. */
export type ApplicationMutationsChangeDashboardContentArgs = {
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
export type ApplicationMutationsCreateDashboardContentArgs = {
  data: DashboardDataInputDto;
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
export type ApplicationMutationsDeleteDashboardContentArgs = {
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
export type ApplicationMutationsPatchDashboardContentArgs = {
  data: DashboardDataInputDto;
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
export type ApplicationMutationsPublishDashboardContentArgs = {
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
export type ApplicationMutationsUpdateDashboardContentArgs = {
  data: DashboardDataInputDto;
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
export type ApplicationMutationsUpsertDashboardContentArgs = {
  data: DashboardDataInputDto;
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
  /** Find an Dashboard content by id. */
  findDashboardContent: Maybe<Dashboard>;
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
  /** Query Dashboard content items. */
  queryDashboardContents: Maybe<Array<Dashboard>>;
  /** Query Dashboard content items with total count. */
  queryDashboardContentsWithTotal: Maybe<DashboardResultDto>;
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
export type ApplicationQueriesFindDashboardContentArgs = {
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
  /** Query Dashboard content items. */
  referencesDashboardContents: Maybe<Array<Dashboard>>;
  /** Query Dashboard content items with total count. */
  referencesDashboardContentsWithTotal: Maybe<DashboardResultDto>;
  /** Query Projects content items. */
  referencesProjectsContents: Maybe<Array<Projects>>;
  /** Query Projects content items with total count. */
  referencesProjectsContentsWithTotal: Maybe<ProjectsResultDto>;
  /** Query Users content items. */
  referencesUsersContents: Maybe<Array<Users>>;
  /** Query Users content items with total count. */
  referencesUsersContentsWithTotal: Maybe<UsersResultDto>;
  /** Query Working Group Network content items. */
  referencesWorkingGroupNetworkContents: Maybe<Array<WorkingGroupNetwork>>;
  /** Query Working Group Network content items with total count. */
  referencesWorkingGroupNetworkContentsWithTotal: Maybe<WorkingGroupNetworkResultDto>;
  /** Query Working Groups content items. */
  referencesWorkingGroupsContents: Maybe<Array<WorkingGroups>>;
  /** Query Working Groups content items with total count. */
  referencesWorkingGroupsContentsWithTotal: Maybe<WorkingGroupsResultDto>;
  /** Query Dashboard content items. */
  referencingDashboardContents: Maybe<Array<Dashboard>>;
  /** Query Dashboard content items with total count. */
  referencingDashboardContentsWithTotal: Maybe<DashboardResultDto>;
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
export type DashboardReferencesDashboardContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencesDashboardContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencesProjectsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencesProjectsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencesUsersContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencesUsersContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencesWorkingGroupNetworkContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencesWorkingGroupNetworkContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencesWorkingGroupsContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencesWorkingGroupsContentsWithTotalArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencingDashboardContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencingDashboardContentsWithTotalArgs = {
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
  iv: Maybe<Array<DashboardDataNewsUnionDto>>;
};

/** The structure of the Latest News from ASAP field of the Dashboard content input type. */
export type DashboardDataNewsInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

export type DashboardDataNewsUnionDto =
  | Dashboard
  | Projects
  | Users
  | WorkingGroupNetwork
  | WorkingGroups;

/** The structure of the Where to Start field of the Dashboard content type. */
export type DashboardDataPagesDto = {
  iv: Maybe<Array<DashboardDataPagesUnionDto>>;
};

/** The structure of the Where to Start field of the Dashboard content input type. */
export type DashboardDataPagesInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
};

export type DashboardDataPagesUnionDto =
  | Dashboard
  | Projects
  | Users
  | WorkingGroupNetwork
  | WorkingGroups;

/** The structure of the flat Dashboard data type. */
export type DashboardFlatDataDto = {
  news: Maybe<Array<DashboardDataNewsUnionDto>>;
  pages: Maybe<Array<DashboardDataPagesUnionDto>>;
};

/** List of Dashboard items and total count. */
export type DashboardResultDto = {
  /** The contents. */
  items: Maybe<Array<Dashboard>>;
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
  /** Query Dashboard content items. */
  referencingDashboardContents: Maybe<Array<Dashboard>>;
  /** Query Dashboard content items with total count. */
  referencingDashboardContentsWithTotal: Maybe<DashboardResultDto>;
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

/** The structure of a Projects content type. */
export type ProjectsReferencingDashboardContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Projects content type. */
export type ProjectsReferencingDashboardContentsWithTotalArgs = {
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
  pmEmail: Maybe<ProjectsDataPmEmailDto>;
  projectProposal: Maybe<ProjectsDataProjectProposalDto>;
  resources: Maybe<ProjectsDataResourcesDto>;
  startDate: Maybe<ProjectsDataStartDateDto>;
  status: Maybe<ProjectsDataStatusDto>;
  title: Maybe<ProjectsDataTitleDto>;
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
  pmEmail: InputMaybe<ProjectsDataPmEmailInputDto>;
  projectProposal: InputMaybe<ProjectsDataProjectProposalInputDto>;
  resources: InputMaybe<ProjectsDataResourcesInputDto>;
  startDate: InputMaybe<ProjectsDataStartDateInputDto>;
  status: InputMaybe<ProjectsDataStatusInputDto>;
  title: InputMaybe<ProjectsDataTitleInputDto>;
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
  /** Inactive */
  Inactive = 'Inactive',
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

/** The structure of the flat Projects data type. */
export type ProjectsFlatDataDto = {
  description: Maybe<Scalars['String']>;
  endDate: Maybe<Scalars['Instant']>;
  keywords: Maybe<Array<Scalars['String']>>;
  leadEmail: Maybe<Scalars['String']>;
  members: Maybe<Array<ProjectsDataMembersChildDto>>;
  milestones: Maybe<Array<ProjectsDataMilestonesChildDto>>;
  pmEmail: Maybe<Scalars['String']>;
  /** External link for a project proposal */
  projectProposal: Maybe<Scalars['String']>;
  resources: Maybe<Array<ProjectsDataResourcesChildDto>>;
  startDate: Maybe<Scalars['Instant']>;
  status: Maybe<ProjectsDataStatusEnum>;
  title: Maybe<Scalars['String']>;
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
  /** Query Dashboard content items. */
  referencingDashboardContents: Maybe<Array<Dashboard>>;
  /** Query Dashboard content items with total count. */
  referencingDashboardContentsWithTotal: Maybe<DashboardResultDto>;
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
export type UsersReferencingDashboardContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingDashboardContentsWithTotalArgs = {
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

/** The structure of the Avatar field of the Users content type. */
export type UsersDataAvatarDto = {
  iv: Maybe<Array<Asset>>;
};

/** The structure of the Avatar field of the Users content input type. */
export type UsersDataAvatarInputDto = {
  iv: InputMaybe<Array<Scalars['String']>>;
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
  avatar: Maybe<UsersDataAvatarDto>;
  city: Maybe<UsersDataCityDto>;
  connections: Maybe<UsersDataConnectionsDto>;
  country: Maybe<UsersDataCountryDto>;
  degree: Maybe<UsersDataDegreeDto>;
  email: Maybe<UsersDataEmailDto>;
  firstName: Maybe<UsersDataFirstNameDto>;
  lastName: Maybe<UsersDataLastNameDto>;
  onboarded: Maybe<UsersDataOnboardedDto>;
  positions: Maybe<UsersDataPositionsDto>;
  region: Maybe<UsersDataRegionDto>;
  role: Maybe<UsersDataRoleDto>;
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

/** The structure of the Users data input type. */
export type UsersDataInputDto = {
  avatar: InputMaybe<UsersDataAvatarInputDto>;
  city: InputMaybe<UsersDataCityInputDto>;
  connections: InputMaybe<UsersDataConnectionsInputDto>;
  country: InputMaybe<UsersDataCountryInputDto>;
  degree: InputMaybe<UsersDataDegreeInputDto>;
  email: InputMaybe<UsersDataEmailInputDto>;
  firstName: InputMaybe<UsersDataFirstNameInputDto>;
  lastName: InputMaybe<UsersDataLastNameInputDto>;
  onboarded: InputMaybe<UsersDataOnboardedInputDto>;
  positions: InputMaybe<UsersDataPositionsInputDto>;
  region: InputMaybe<UsersDataRegionInputDto>;
  role: InputMaybe<UsersDataRoleInputDto>;
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

/** The structure of the flat Users data type. */
export type UsersFlatDataDto = {
  avatar: Maybe<Array<Asset>>;
  city: Maybe<Scalars['String']>;
  connections: Maybe<Array<UsersDataConnectionsChildDto>>;
  country: Maybe<Scalars['String']>;
  degree: Maybe<Array<UsersDataDegreeEnum>>;
  email: Maybe<Scalars['String']>;
  firstName: Maybe<Scalars['String']>;
  lastName: Maybe<Scalars['String']>;
  /** Use this to allow the user to see the full Hub and skip profile completion */
  onboarded: Maybe<Scalars['Boolean']>;
  positions: Maybe<Array<UsersDataPositionsChildDto>>;
  region: Maybe<UsersDataRegionEnum>;
  /** Role on the GP2 Hub */
  role: Maybe<UsersDataRoleEnum>;
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
  /** Query Dashboard content items. */
  referencingDashboardContents: Maybe<Array<Dashboard>>;
  /** Query Dashboard content items with total count. */
  referencingDashboardContentsWithTotal: Maybe<DashboardResultDto>;
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

/** The structure of a Working Group Network content type. */
export type WorkingGroupNetworkReferencingDashboardContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Working Group Network content type. */
export type WorkingGroupNetworkReferencingDashboardContentsWithTotalArgs = {
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
  /** Query Dashboard content items. */
  referencingDashboardContents: Maybe<Array<Dashboard>>;
  /** Query Dashboard content items with total count. */
  referencingDashboardContentsWithTotal: Maybe<DashboardResultDto>;
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
export type WorkingGroupsReferencingDashboardContentsArgs = {
  filter: InputMaybe<Scalars['String']>;
  orderby: InputMaybe<Scalars['String']>;
  search: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  top: InputMaybe<Scalars['Int']>;
};

/** The structure of a Working Groups content type. */
export type WorkingGroupsReferencingDashboardContentsWithTotalArgs = {
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
                flatData: Pick<UsersFlatDataDto, 'firstName' | 'lastName'> & {
                  avatar: Maybe<Array<Pick<Asset, 'id'>>>;
                };
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
                      'firstName' | 'lastName'
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
                            'firstName' | 'lastName'
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
  > & {
    avatar: Maybe<Array<Pick<Asset, 'id'>>>;
    positions: Maybe<
      Array<
        Pick<UsersDataPositionsChildDto, 'role' | 'department' | 'institution'>
      >
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
        | 'degree'
        | 'email'
        | 'firstName'
        | 'lastName'
        | 'region'
        | 'role'
        | 'country'
        | 'city'
        | 'onboarded'
      > & {
        avatar: Maybe<Array<Pick<Asset, 'id'>>>;
        positions: Maybe<
          Array<
            Pick<
              UsersDataPositionsChildDto,
              'role' | 'department' | 'institution'
            >
          >
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
              | 'degree'
              | 'email'
              | 'firstName'
              | 'lastName'
              | 'region'
              | 'role'
              | 'country'
              | 'city'
              | 'onboarded'
            > & {
              avatar: Maybe<Array<Pick<Asset, 'id'>>>;
              positions: Maybe<
                Array<
                  Pick<
                    UsersDataPositionsChildDto,
                    'role' | 'department' | 'institution'
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
                          'firstName' | 'lastName'
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
                          'firstName' | 'lastName'
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
                          'firstName' | 'lastName'
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
                          'firstName' | 'lastName'
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
                                'firstName' | 'lastName'
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
                                'firstName' | 'lastName'
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
                                'firstName' | 'lastName'
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
                                'firstName' | 'lastName'
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
                flatData: Pick<UsersFlatDataDto, 'firstName' | 'lastName'> & {
                  avatar: Maybe<Array<Pick<Asset, 'id'>>>;
                };
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
                      'firstName' | 'lastName'
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
                            'firstName' | 'lastName'
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
                { kind: 'Field', name: { kind: 'Name', value: 'onboarded' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UsersContentFragment, unknown>;
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
