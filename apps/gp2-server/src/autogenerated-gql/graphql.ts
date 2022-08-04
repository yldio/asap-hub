/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
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
export type AppMutations = {
  /** Change a Dashboard content. */
  changeDashboardContent: Dashboard;
  /** Change a Users content. */
  changeUsersContent: Users;
  /** Creates an Dashboard content. */
  createDashboardContent: Dashboard;
  /** Creates an Users content. */
  createUsersContent: Users;
  /** Delete an Dashboard content. */
  deleteDashboardContent: EntitySavedResultDto;
  /** Delete an Users content. */
  deleteUsersContent: EntitySavedResultDto;
  /** Patch an Dashboard content by id. */
  patchDashboardContent: Dashboard;
  /** Patch an Users content by id. */
  patchUsersContent: Users;
  /**
   * Publish a Dashboard content.
   * @deprecated Use 'changeDashboardContent' instead
   */
  publishDashboardContent: Dashboard;
  /**
   * Publish a Users content.
   * @deprecated Use 'changeUsersContent' instead
   */
  publishUsersContent: Users;
  /** Update an Dashboard content by id. */
  updateDashboardContent: Dashboard;
  /** Update an Users content by id. */
  updateUsersContent: Users;
  /** Upsert an Dashboard content by id. */
  upsertDashboardContent: Dashboard;
  /** Upsert an Users content by id. */
  upsertUsersContent: Users;
};

/** The app mutations. */
export type AppMutationsChangeDashboardContentArgs = {
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
export type AppMutationsCreateDashboardContentArgs = {
  data: DashboardDataInputDto;
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
export type AppMutationsDeleteDashboardContentArgs = {
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsDeleteUsersContentArgs = {
  expectedVersion?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
};

/** The app mutations. */
export type AppMutationsPatchDashboardContentArgs = {
  data: DashboardDataInputDto;
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
export type AppMutationsPublishDashboardContentArgs = {
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
export type AppMutationsUpdateDashboardContentArgs = {
  data: DashboardDataInputDto;
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
export type AppMutationsUpsertDashboardContentArgs = {
  data: DashboardDataInputDto;
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
  /** Find an Dashboard content by id. */
  findDashboardContent: Maybe<Dashboard>;
  /** Find an Users content by id. */
  findUsersContent: Maybe<Users>;
  /** Get assets. */
  queryAssets: Array<Asset>;
  /** Get assets and total count. */
  queryAssetsWithTotal: AssetResultDto;
  /** Query Dashboard content items. */
  queryDashboardContents: Maybe<Array<Dashboard>>;
  /** Query Dashboard content items with total count. */
  queryDashboardContentsWithTotal: Maybe<DashboardResultDto>;
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
export type AppQueriesFindDashboardContentArgs = {
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
  /** Query Users content items. */
  referencesUsersContents: Maybe<Array<Users>>;
  /** Query Users content items with total count. */
  referencesUsersContentsWithTotal: Maybe<UsersResultDto>;
  /** Query Dashboard content items. */
  referencingDashboardContents: Maybe<Array<Dashboard>>;
  /** Query Dashboard content items with total count. */
  referencingDashboardContentsWithTotal: Maybe<DashboardResultDto>;
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

/** The structure of a Dashboard content type. */
export type DashboardReferencesDashboardContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencesDashboardContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencesUsersContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencesUsersContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencingDashboardContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencingDashboardContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencingUsersContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Dashboard content type. */
export type DashboardReferencingUsersContentsWithTotalArgs = {
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
  iv: Maybe<Array<DashboardDataNewsUnionDto>>;
};

/** The structure of the Latest News from ASAP field of the Dashboard content input type. */
export type DashboardDataNewsInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

export type DashboardDataNewsUnionDto = Dashboard | Users;

/** The structure of the Where to Start field of the Dashboard content type. */
export type DashboardDataPagesDto = {
  iv: Maybe<Array<DashboardDataPagesUnionDto>>;
};

/** The structure of the Where to Start field of the Dashboard content input type. */
export type DashboardDataPagesInputDto = {
  iv: Maybe<Array<Scalars['String']>>;
};

export type DashboardDataPagesUnionDto = Dashboard | Users;

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

/** The result of a mutation */
export type EntitySavedResultDto = {
  /** The new version of the item. */
  version: Scalars['Long'];
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
  referencesDashboardContents: Maybe<Array<Dashboard>>;
  /** Query Dashboard content items with total count. */
  referencesDashboardContentsWithTotal: Maybe<DashboardResultDto>;
  /** Query Users content items. */
  referencesUsersContents: Maybe<Array<Users>>;
  /** Query Users content items with total count. */
  referencesUsersContentsWithTotal: Maybe<UsersResultDto>;
  /** Query Dashboard content items. */
  referencingDashboardContents: Maybe<Array<Dashboard>>;
  /** Query Dashboard content items with total count. */
  referencingDashboardContentsWithTotal: Maybe<DashboardResultDto>;
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

/** The structure of a Users content type. */
export type UsersReferencesDashboardContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencesDashboardContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencesUsersContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencesUsersContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingDashboardContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingDashboardContentsWithTotalArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingUsersContentsArgs = {
  filter: Maybe<Scalars['String']>;
  orderby: Maybe<Scalars['String']>;
  search: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  top: Maybe<Scalars['Int']>;
};

/** The structure of a Users content type. */
export type UsersReferencingUsersContentsWithTotalArgs = {
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
  iv: Maybe<Array<UsersDataLabsUnionDto>>;
};

/** The structure of the Labs field of the Users content input type. */
export type UsersDataLabsInputDto = {
  /** Mandatory for grantees. They cannot publish profile without a lab. */
  iv: Maybe<Array<Scalars['String']>>;
};

export type UsersDataLabsUnionDto = Dashboard | Users;

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
  labs: Maybe<Array<UsersDataLabsUnionDto>>;
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
};

/** List of Users items and total count. */
export type UsersResultDto = {
  /** The contents. */
  items: Maybe<Array<Users>>;
  /** The total count of  contents. */
  total: Scalars['Int'];
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
            };
          }
        >
      >;
    }
  >;
};

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
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UsersContentFragment, unknown>;
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
