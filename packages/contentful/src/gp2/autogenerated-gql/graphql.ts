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
  /**
   * A date-time string at UTC, such as 2007-12-03T10:15:30Z,
   *     compliant with the 'date-time' format outlined in section 5.6 of
   *     the RFC 3339 profile of the ISO 8601 standard for representation
   *     of dates and times using the Gregorian calendar.
   */
  DateTime: any;
  /** The 'Dimension' type represents dimensions as whole numeric values between `1` and `4000`. */
  Dimension: any;
  /** The 'HexColor' type represents color in `rgb:ffffff` string format. */
  HexColor: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** The 'Quality' type represents quality as whole numeric values between `1` and `100`. */
  Quality: any;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type Asset = {
  contentType?: Maybe<Scalars['String']>;
  contentfulMetadata: ContentfulMetadata;
  description?: Maybe<Scalars['String']>;
  fileName?: Maybe<Scalars['String']>;
  height?: Maybe<Scalars['Int']>;
  linkedFrom?: Maybe<AssetLinkingCollections>;
  size?: Maybe<Scalars['Int']>;
  sys: Sys;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  width?: Maybe<Scalars['Int']>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetContentTypeArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetFileNameArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetHeightArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetSizeArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetTitleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetUrlArgs = {
  locale?: InputMaybe<Scalars['String']>;
  transform?: InputMaybe<ImageTransformOptions>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetWidthArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type AssetCollection = {
  items: Array<Maybe<Asset>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type AssetFilter = {
  AND?: InputMaybe<Array<InputMaybe<AssetFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<AssetFilter>>>;
  contentType?: InputMaybe<Scalars['String']>;
  contentType_contains?: InputMaybe<Scalars['String']>;
  contentType_exists?: InputMaybe<Scalars['Boolean']>;
  contentType_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contentType_not?: InputMaybe<Scalars['String']>;
  contentType_not_contains?: InputMaybe<Scalars['String']>;
  contentType_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_exists?: InputMaybe<Scalars['Boolean']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  fileName?: InputMaybe<Scalars['String']>;
  fileName_contains?: InputMaybe<Scalars['String']>;
  fileName_exists?: InputMaybe<Scalars['Boolean']>;
  fileName_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  fileName_not?: InputMaybe<Scalars['String']>;
  fileName_not_contains?: InputMaybe<Scalars['String']>;
  fileName_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  height?: InputMaybe<Scalars['Int']>;
  height_exists?: InputMaybe<Scalars['Boolean']>;
  height_gt?: InputMaybe<Scalars['Int']>;
  height_gte?: InputMaybe<Scalars['Int']>;
  height_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  height_lt?: InputMaybe<Scalars['Int']>;
  height_lte?: InputMaybe<Scalars['Int']>;
  height_not?: InputMaybe<Scalars['Int']>;
  height_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  size?: InputMaybe<Scalars['Int']>;
  size_exists?: InputMaybe<Scalars['Boolean']>;
  size_gt?: InputMaybe<Scalars['Int']>;
  size_gte?: InputMaybe<Scalars['Int']>;
  size_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  size_lt?: InputMaybe<Scalars['Int']>;
  size_lte?: InputMaybe<Scalars['Int']>;
  size_not?: InputMaybe<Scalars['Int']>;
  size_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  sys?: InputMaybe<SysFilter>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  url?: InputMaybe<Scalars['String']>;
  url_contains?: InputMaybe<Scalars['String']>;
  url_exists?: InputMaybe<Scalars['Boolean']>;
  url_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  url_not?: InputMaybe<Scalars['String']>;
  url_not_contains?: InputMaybe<Scalars['String']>;
  url_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  width?: InputMaybe<Scalars['Int']>;
  width_exists?: InputMaybe<Scalars['Boolean']>;
  width_gt?: InputMaybe<Scalars['Int']>;
  width_gte?: InputMaybe<Scalars['Int']>;
  width_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  width_lt?: InputMaybe<Scalars['Int']>;
  width_lte?: InputMaybe<Scalars['Int']>;
  width_not?: InputMaybe<Scalars['Int']>;
  width_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type AssetLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
  usersCollection?: Maybe<UsersCollection>;
};

export type AssetLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type AssetLinkingCollectionsUsersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum AssetOrder {
  ContentTypeAsc = 'contentType_ASC',
  ContentTypeDesc = 'contentType_DESC',
  FileNameAsc = 'fileName_ASC',
  FileNameDesc = 'fileName_DESC',
  HeightAsc = 'height_ASC',
  HeightDesc = 'height_DESC',
  SizeAsc = 'size_ASC',
  SizeDesc = 'size_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  UrlAsc = 'url_ASC',
  UrlDesc = 'url_DESC',
  WidthAsc = 'width_ASC',
  WidthDesc = 'width_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/calendars) */
export type Calendars = Entry & {
  color?: Maybe<Scalars['String']>;
  contentfulMetadata: ContentfulMetadata;
  expirationDate?: Maybe<Scalars['Float']>;
  googleCalendarId?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<CalendarsLinkingCollections>;
  name?: Maybe<Scalars['String']>;
  resourceId?: Maybe<Scalars['String']>;
  syncToken?: Maybe<Scalars['String']>;
  sys: Sys;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/calendars) */
export type CalendarsColorArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/calendars) */
export type CalendarsExpirationDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/calendars) */
export type CalendarsGoogleCalendarIdArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/calendars) */
export type CalendarsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/calendars) */
export type CalendarsNameArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/calendars) */
export type CalendarsResourceIdArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/calendars) */
export type CalendarsSyncTokenArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type CalendarsCollection = {
  items: Array<Maybe<Calendars>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type CalendarsFilter = {
  AND?: InputMaybe<Array<InputMaybe<CalendarsFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CalendarsFilter>>>;
  color?: InputMaybe<Scalars['String']>;
  color_contains?: InputMaybe<Scalars['String']>;
  color_exists?: InputMaybe<Scalars['Boolean']>;
  color_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  color_not?: InputMaybe<Scalars['String']>;
  color_not_contains?: InputMaybe<Scalars['String']>;
  color_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  expirationDate?: InputMaybe<Scalars['Float']>;
  expirationDate_exists?: InputMaybe<Scalars['Boolean']>;
  expirationDate_gt?: InputMaybe<Scalars['Float']>;
  expirationDate_gte?: InputMaybe<Scalars['Float']>;
  expirationDate_in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  expirationDate_lt?: InputMaybe<Scalars['Float']>;
  expirationDate_lte?: InputMaybe<Scalars['Float']>;
  expirationDate_not?: InputMaybe<Scalars['Float']>;
  expirationDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  googleCalendarId?: InputMaybe<Scalars['String']>;
  googleCalendarId_contains?: InputMaybe<Scalars['String']>;
  googleCalendarId_exists?: InputMaybe<Scalars['Boolean']>;
  googleCalendarId_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  googleCalendarId_not?: InputMaybe<Scalars['String']>;
  googleCalendarId_not_contains?: InputMaybe<Scalars['String']>;
  googleCalendarId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_exists?: InputMaybe<Scalars['Boolean']>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  resourceId?: InputMaybe<Scalars['String']>;
  resourceId_contains?: InputMaybe<Scalars['String']>;
  resourceId_exists?: InputMaybe<Scalars['Boolean']>;
  resourceId_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  resourceId_not?: InputMaybe<Scalars['String']>;
  resourceId_not_contains?: InputMaybe<Scalars['String']>;
  resourceId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  syncToken?: InputMaybe<Scalars['String']>;
  syncToken_contains?: InputMaybe<Scalars['String']>;
  syncToken_exists?: InputMaybe<Scalars['Boolean']>;
  syncToken_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  syncToken_not?: InputMaybe<Scalars['String']>;
  syncToken_not_contains?: InputMaybe<Scalars['String']>;
  syncToken_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
};

export type CalendarsLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
};

export type CalendarsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum CalendarsOrder {
  ColorAsc = 'color_ASC',
  ColorDesc = 'color_DESC',
  ExpirationDateAsc = 'expirationDate_ASC',
  ExpirationDateDesc = 'expirationDate_DESC',
  GoogleCalendarIdAsc = 'googleCalendarId_ASC',
  GoogleCalendarIdDesc = 'googleCalendarId_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  ResourceIdAsc = 'resourceId_ASC',
  ResourceIdDesc = 'resourceId_DESC',
  SyncTokenAsc = 'syncToken_ASC',
  SyncTokenDesc = 'syncToken_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export type ContentfulMetadata = {
  tags: Array<Maybe<ContentfulTag>>;
};

export type ContentfulMetadataFilter = {
  tags?: InputMaybe<ContentfulMetadataTagsFilter>;
  tags_exists?: InputMaybe<Scalars['Boolean']>;
};

export type ContentfulMetadataTagsFilter = {
  id_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/**
 * Represents a tag entity for finding and organizing content easily.
 *     Find out more here: https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/content-tags
 */
export type ContentfulTag = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/contributingCohorts) */
export type ContributingCohorts = Entry & {
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<ContributingCohortsLinkingCollections>;
  name?: Maybe<Scalars['String']>;
  sys: Sys;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/contributingCohorts) */
export type ContributingCohortsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/contributingCohorts) */
export type ContributingCohortsNameArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type ContributingCohortsCollection = {
  items: Array<Maybe<ContributingCohorts>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type ContributingCohortsFilter = {
  AND?: InputMaybe<Array<InputMaybe<ContributingCohortsFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<ContributingCohortsFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_exists?: InputMaybe<Scalars['Boolean']>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
};

export type ContributingCohortsLinkingCollections = {
  contributingCohortsMembershipCollection?: Maybe<ContributingCohortsMembershipCollection>;
  entryCollection?: Maybe<EntryCollection>;
};

export type ContributingCohortsLinkingCollectionsContributingCohortsMembershipCollectionArgs =
  {
    limit?: InputMaybe<Scalars['Int']>;
    locale?: InputMaybe<Scalars['String']>;
    preview?: InputMaybe<Scalars['Boolean']>;
    skip?: InputMaybe<Scalars['Int']>;
  };

export type ContributingCohortsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/contributingCohortsMembership) */
export type ContributingCohortsMembership = Entry & {
  contentfulMetadata: ContentfulMetadata;
  contributingCohort?: Maybe<ContributingCohorts>;
  linkedFrom?: Maybe<ContributingCohortsMembershipLinkingCollections>;
  role?: Maybe<Scalars['String']>;
  studyLink?: Maybe<Scalars['String']>;
  sys: Sys;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/contributingCohortsMembership) */
export type ContributingCohortsMembershipContributingCohortArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/contributingCohortsMembership) */
export type ContributingCohortsMembershipLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/contributingCohortsMembership) */
export type ContributingCohortsMembershipRoleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/contributingCohortsMembership) */
export type ContributingCohortsMembershipStudyLinkArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type ContributingCohortsMembershipCollection = {
  items: Array<Maybe<ContributingCohortsMembership>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type ContributingCohortsMembershipFilter = {
  AND?: InputMaybe<Array<InputMaybe<ContributingCohortsMembershipFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<ContributingCohortsMembershipFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  contributingCohort?: InputMaybe<CfContributingCohortsNestedFilter>;
  contributingCohort_exists?: InputMaybe<Scalars['Boolean']>;
  role?: InputMaybe<Scalars['String']>;
  role_contains?: InputMaybe<Scalars['String']>;
  role_exists?: InputMaybe<Scalars['Boolean']>;
  role_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  role_not?: InputMaybe<Scalars['String']>;
  role_not_contains?: InputMaybe<Scalars['String']>;
  role_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  studyLink?: InputMaybe<Scalars['String']>;
  studyLink_contains?: InputMaybe<Scalars['String']>;
  studyLink_exists?: InputMaybe<Scalars['Boolean']>;
  studyLink_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  studyLink_not?: InputMaybe<Scalars['String']>;
  studyLink_not_contains?: InputMaybe<Scalars['String']>;
  studyLink_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
};

export type ContributingCohortsMembershipLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
  usersCollection?: Maybe<UsersCollection>;
};

export type ContributingCohortsMembershipLinkingCollectionsEntryCollectionArgs =
  {
    limit?: InputMaybe<Scalars['Int']>;
    locale?: InputMaybe<Scalars['String']>;
    preview?: InputMaybe<Scalars['Boolean']>;
    skip?: InputMaybe<Scalars['Int']>;
  };

export type ContributingCohortsMembershipLinkingCollectionsUsersCollectionArgs =
  {
    limit?: InputMaybe<Scalars['Int']>;
    locale?: InputMaybe<Scalars['String']>;
    preview?: InputMaybe<Scalars['Boolean']>;
    skip?: InputMaybe<Scalars['Int']>;
  };

export enum ContributingCohortsMembershipOrder {
  RoleAsc = 'role_ASC',
  RoleDesc = 'role_DESC',
  StudyLinkAsc = 'studyLink_ASC',
  StudyLinkDesc = 'studyLink_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export enum ContributingCohortsOrder {
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export type Entry = {
  contentfulMetadata: ContentfulMetadata;
  sys: Sys;
};

export type EntryCollection = {
  items: Array<Maybe<Entry>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type EntryFilter = {
  AND?: InputMaybe<Array<InputMaybe<EntryFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<EntryFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  sys?: InputMaybe<SysFilter>;
};

export enum EntryOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/externalUsers) */
export type ExternalUsers = Entry & {
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<ExternalUsersLinkingCollections>;
  name?: Maybe<Scalars['String']>;
  orcid?: Maybe<Scalars['String']>;
  sys: Sys;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/externalUsers) */
export type ExternalUsersLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/externalUsers) */
export type ExternalUsersNameArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/externalUsers) */
export type ExternalUsersOrcidArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type ExternalUsersCollection = {
  items: Array<Maybe<ExternalUsers>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type ExternalUsersFilter = {
  AND?: InputMaybe<Array<InputMaybe<ExternalUsersFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<ExternalUsersFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_exists?: InputMaybe<Scalars['Boolean']>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  orcid?: InputMaybe<Scalars['String']>;
  orcid_contains?: InputMaybe<Scalars['String']>;
  orcid_exists?: InputMaybe<Scalars['Boolean']>;
  orcid_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  orcid_not?: InputMaybe<Scalars['String']>;
  orcid_not_contains?: InputMaybe<Scalars['String']>;
  orcid_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
};

export type ExternalUsersLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
};

export type ExternalUsersLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum ExternalUsersOrder {
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  OrcidAsc = 'orcid_ASC',
  OrcidDesc = 'orcid_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export enum ImageFormat {
  Avif = 'AVIF',
  /** JPG image format. */
  Jpg = 'JPG',
  /**
   * Progressive JPG format stores multiple passes of an image in progressively higher detail.
   *         When a progressive image is loading, the viewer will first see a lower quality pixelated version which
   *         will gradually improve in detail, until the image is fully downloaded. This is to display an image as
   *         early as possible to make the layout look as designed.
   */
  JpgProgressive = 'JPG_PROGRESSIVE',
  /** PNG image format */
  Png = 'PNG',
  /**
   * 8-bit PNG images support up to 256 colors and weigh less than the standard 24-bit PNG equivalent.
   *         The 8-bit PNG format is mostly used for simple images, such as icons or logos.
   */
  Png8 = 'PNG8',
  /** WebP image format. */
  Webp = 'WEBP',
}

export enum ImageResizeFocus {
  /** Focus the resizing on the bottom. */
  Bottom = 'BOTTOM',
  /** Focus the resizing on the bottom left. */
  BottomLeft = 'BOTTOM_LEFT',
  /** Focus the resizing on the bottom right. */
  BottomRight = 'BOTTOM_RIGHT',
  /** Focus the resizing on the center. */
  Center = 'CENTER',
  /** Focus the resizing on the largest face. */
  Face = 'FACE',
  /** Focus the resizing on the area containing all the faces. */
  Faces = 'FACES',
  /** Focus the resizing on the left. */
  Left = 'LEFT',
  /** Focus the resizing on the right. */
  Right = 'RIGHT',
  /** Focus the resizing on the top. */
  Top = 'TOP',
  /** Focus the resizing on the top left. */
  TopLeft = 'TOP_LEFT',
  /** Focus the resizing on the top right. */
  TopRight = 'TOP_RIGHT',
}

export enum ImageResizeStrategy {
  /** Crops a part of the original image to fit into the specified dimensions. */
  Crop = 'CROP',
  /** Resizes the image to the specified dimensions, cropping the image if needed. */
  Fill = 'FILL',
  /** Resizes the image to fit into the specified dimensions. */
  Fit = 'FIT',
  /**
   * Resizes the image to the specified dimensions, padding the image if needed.
   *         Uses desired background color as padding color.
   */
  Pad = 'PAD',
  /** Resizes the image to the specified dimensions, changing the original aspect ratio if needed. */
  Scale = 'SCALE',
  /** Creates a thumbnail from the image. */
  Thumb = 'THUMB',
}

export type ImageTransformOptions = {
  /**
   * Desired background color, used with corner radius or `PAD` resize strategy.
   *         Defaults to transparent (for `PNG`, `PNG8` and `WEBP`) or white (for `JPG` and `JPG_PROGRESSIVE`).
   */
  backgroundColor?: InputMaybe<Scalars['HexColor']>;
  /**
   * Desired corner radius in pixels.
   *         Results in an image with rounded corners (pass `-1` for a full circle/ellipse).
   *         Defaults to `0`. Uses desired background color as padding color,
   *         unless the format is `JPG` or `JPG_PROGRESSIVE` and resize strategy is `PAD`, then defaults to white.
   */
  cornerRadius?: InputMaybe<Scalars['Int']>;
  /** Desired image format. Defaults to the original image format. */
  format?: InputMaybe<ImageFormat>;
  /** Desired height in pixels. Defaults to the original image height. */
  height?: InputMaybe<Scalars['Dimension']>;
  /**
   * Desired quality of the image in percents.
   *         Used for `PNG8`, `JPG`, `JPG_PROGRESSIVE` and `WEBP` formats.
   */
  quality?: InputMaybe<Scalars['Quality']>;
  /** Desired resize focus area. Defaults to `CENTER`. */
  resizeFocus?: InputMaybe<ImageResizeFocus>;
  /** Desired resize strategy. Defaults to `FIT`. */
  resizeStrategy?: InputMaybe<ImageResizeStrategy>;
  /** Desired width in pixels. Defaults to the original image width. */
  width?: InputMaybe<Scalars['Dimension']>;
};

/** Videos and PDFs [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/media) */
export type Media = Entry & {
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<MediaLinkingCollections>;
  sys: Sys;
  url?: Maybe<Scalars['String']>;
};

/** Videos and PDFs [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/media) */
export type MediaLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** Videos and PDFs [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/media) */
export type MediaUrlArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type MediaCollection = {
  items: Array<Maybe<Media>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type MediaFilter = {
  AND?: InputMaybe<Array<InputMaybe<MediaFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<MediaFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  sys?: InputMaybe<SysFilter>;
  url?: InputMaybe<Scalars['String']>;
  url_contains?: InputMaybe<Scalars['String']>;
  url_exists?: InputMaybe<Scalars['Boolean']>;
  url_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  url_not?: InputMaybe<Scalars['String']>;
  url_not_contains?: InputMaybe<Scalars['String']>;
  url_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type MediaLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
};

export type MediaLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum MediaOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  UrlAsc = 'url_ASC',
  UrlDesc = 'url_DESC',
}

/** Meta data to store the state of content model through migrations [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/migration) */
export type Migration = Entry & {
  contentTypeId?: Maybe<Scalars['String']>;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<MigrationLinkingCollections>;
  state?: Maybe<Scalars['JSON']>;
  sys: Sys;
};

/** Meta data to store the state of content model through migrations [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/migration) */
export type MigrationContentTypeIdArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** Meta data to store the state of content model through migrations [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/migration) */
export type MigrationLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** Meta data to store the state of content model through migrations [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/migration) */
export type MigrationStateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type MigrationCollection = {
  items: Array<Maybe<Migration>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type MigrationFilter = {
  AND?: InputMaybe<Array<InputMaybe<MigrationFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<MigrationFilter>>>;
  contentTypeId?: InputMaybe<Scalars['String']>;
  contentTypeId_contains?: InputMaybe<Scalars['String']>;
  contentTypeId_exists?: InputMaybe<Scalars['Boolean']>;
  contentTypeId_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contentTypeId_not?: InputMaybe<Scalars['String']>;
  contentTypeId_not_contains?: InputMaybe<Scalars['String']>;
  contentTypeId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  state_exists?: InputMaybe<Scalars['Boolean']>;
  sys?: InputMaybe<SysFilter>;
};

export type MigrationLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
};

export type MigrationLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum MigrationOrder {
  ContentTypeIdAsc = 'contentTypeId_ASC',
  ContentTypeIdDesc = 'contentTypeId_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

/** Hub News [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/news) */
export type News = Entry & {
  articleCount?: Maybe<Scalars['Int']>;
  cohortCount?: Maybe<Scalars['Int']>;
  contentfulMetadata: ContentfulMetadata;
  link?: Maybe<Scalars['String']>;
  linkText?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<NewsLinkingCollections>;
  publishDate?: Maybe<Scalars['DateTime']>;
  sampleCount?: Maybe<Scalars['Int']>;
  shortText?: Maybe<Scalars['String']>;
  sys: Sys;
  title?: Maybe<Scalars['String']>;
};

/** Hub News [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/news) */
export type NewsArticleCountArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** Hub News [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/news) */
export type NewsCohortCountArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** Hub News [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/news) */
export type NewsLinkArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** Hub News [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/news) */
export type NewsLinkTextArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** Hub News [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/news) */
export type NewsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** Hub News [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/news) */
export type NewsPublishDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** Hub News [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/news) */
export type NewsSampleCountArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** Hub News [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/news) */
export type NewsShortTextArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** Hub News [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/news) */
export type NewsTitleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type NewsCollection = {
  items: Array<Maybe<News>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type NewsFilter = {
  AND?: InputMaybe<Array<InputMaybe<NewsFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<NewsFilter>>>;
  articleCount?: InputMaybe<Scalars['Int']>;
  articleCount_exists?: InputMaybe<Scalars['Boolean']>;
  articleCount_gt?: InputMaybe<Scalars['Int']>;
  articleCount_gte?: InputMaybe<Scalars['Int']>;
  articleCount_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  articleCount_lt?: InputMaybe<Scalars['Int']>;
  articleCount_lte?: InputMaybe<Scalars['Int']>;
  articleCount_not?: InputMaybe<Scalars['Int']>;
  articleCount_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  cohortCount?: InputMaybe<Scalars['Int']>;
  cohortCount_exists?: InputMaybe<Scalars['Boolean']>;
  cohortCount_gt?: InputMaybe<Scalars['Int']>;
  cohortCount_gte?: InputMaybe<Scalars['Int']>;
  cohortCount_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  cohortCount_lt?: InputMaybe<Scalars['Int']>;
  cohortCount_lte?: InputMaybe<Scalars['Int']>;
  cohortCount_not?: InputMaybe<Scalars['Int']>;
  cohortCount_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  link?: InputMaybe<Scalars['String']>;
  linkText?: InputMaybe<Scalars['String']>;
  linkText_contains?: InputMaybe<Scalars['String']>;
  linkText_exists?: InputMaybe<Scalars['Boolean']>;
  linkText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  linkText_not?: InputMaybe<Scalars['String']>;
  linkText_not_contains?: InputMaybe<Scalars['String']>;
  linkText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  link_contains?: InputMaybe<Scalars['String']>;
  link_exists?: InputMaybe<Scalars['Boolean']>;
  link_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  link_not?: InputMaybe<Scalars['String']>;
  link_not_contains?: InputMaybe<Scalars['String']>;
  link_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  publishDate?: InputMaybe<Scalars['DateTime']>;
  publishDate_exists?: InputMaybe<Scalars['Boolean']>;
  publishDate_gt?: InputMaybe<Scalars['DateTime']>;
  publishDate_gte?: InputMaybe<Scalars['DateTime']>;
  publishDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  publishDate_lt?: InputMaybe<Scalars['DateTime']>;
  publishDate_lte?: InputMaybe<Scalars['DateTime']>;
  publishDate_not?: InputMaybe<Scalars['DateTime']>;
  publishDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  sampleCount?: InputMaybe<Scalars['Int']>;
  sampleCount_exists?: InputMaybe<Scalars['Boolean']>;
  sampleCount_gt?: InputMaybe<Scalars['Int']>;
  sampleCount_gte?: InputMaybe<Scalars['Int']>;
  sampleCount_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  sampleCount_lt?: InputMaybe<Scalars['Int']>;
  sampleCount_lte?: InputMaybe<Scalars['Int']>;
  sampleCount_not?: InputMaybe<Scalars['Int']>;
  sampleCount_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  shortText?: InputMaybe<Scalars['String']>;
  shortText_contains?: InputMaybe<Scalars['String']>;
  shortText_exists?: InputMaybe<Scalars['Boolean']>;
  shortText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  shortText_not?: InputMaybe<Scalars['String']>;
  shortText_not_contains?: InputMaybe<Scalars['String']>;
  shortText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type NewsLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
};

export type NewsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum NewsOrder {
  ArticleCountAsc = 'articleCount_ASC',
  ArticleCountDesc = 'articleCount_DESC',
  CohortCountAsc = 'cohortCount_ASC',
  CohortCountDesc = 'cohortCount_DESC',
  LinkTextAsc = 'linkText_ASC',
  LinkTextDesc = 'linkText_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  PublishDateAsc = 'publishDate_ASC',
  PublishDateDesc = 'publishDate_DESC',
  SampleCountAsc = 'sampleCount_ASC',
  SampleCountDesc = 'sampleCount_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/pages) */
export type Pages = Entry & {
  contentfulMetadata: ContentfulMetadata;
  link?: Maybe<Scalars['String']>;
  linkText?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<PagesLinkingCollections>;
  path?: Maybe<Scalars['String']>;
  shortText?: Maybe<Scalars['String']>;
  sys: Sys;
  text?: Maybe<PagesText>;
  title?: Maybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/pages) */
export type PagesLinkArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/pages) */
export type PagesLinkTextArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/pages) */
export type PagesLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/pages) */
export type PagesPathArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/pages) */
export type PagesShortTextArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/pages) */
export type PagesTextArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/pages) */
export type PagesTitleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type PagesCollection = {
  items: Array<Maybe<Pages>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type PagesFilter = {
  AND?: InputMaybe<Array<InputMaybe<PagesFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<PagesFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  link?: InputMaybe<Scalars['String']>;
  linkText?: InputMaybe<Scalars['String']>;
  linkText_contains?: InputMaybe<Scalars['String']>;
  linkText_exists?: InputMaybe<Scalars['Boolean']>;
  linkText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  linkText_not?: InputMaybe<Scalars['String']>;
  linkText_not_contains?: InputMaybe<Scalars['String']>;
  linkText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  link_contains?: InputMaybe<Scalars['String']>;
  link_exists?: InputMaybe<Scalars['Boolean']>;
  link_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  link_not?: InputMaybe<Scalars['String']>;
  link_not_contains?: InputMaybe<Scalars['String']>;
  link_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  path?: InputMaybe<Scalars['String']>;
  path_contains?: InputMaybe<Scalars['String']>;
  path_exists?: InputMaybe<Scalars['Boolean']>;
  path_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  path_not?: InputMaybe<Scalars['String']>;
  path_not_contains?: InputMaybe<Scalars['String']>;
  path_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  shortText?: InputMaybe<Scalars['String']>;
  shortText_contains?: InputMaybe<Scalars['String']>;
  shortText_exists?: InputMaybe<Scalars['Boolean']>;
  shortText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  shortText_not?: InputMaybe<Scalars['String']>;
  shortText_not_contains?: InputMaybe<Scalars['String']>;
  shortText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  text_contains?: InputMaybe<Scalars['String']>;
  text_exists?: InputMaybe<Scalars['Boolean']>;
  text_not_contains?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PagesLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
};

export type PagesLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum PagesOrder {
  LinkTextAsc = 'linkText_ASC',
  LinkTextDesc = 'linkText_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  PathAsc = 'path_ASC',
  PathDesc = 'path_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export type PagesText = {
  json: Scalars['JSON'];
  links: PagesTextLinks;
};

export type PagesTextAssets = {
  block: Array<Maybe<Asset>>;
  hyperlink: Array<Maybe<Asset>>;
};

export type PagesTextEntries = {
  block: Array<Maybe<Entry>>;
  hyperlink: Array<Maybe<Entry>>;
  inline: Array<Maybe<Entry>>;
};

export type PagesTextLinks = {
  assets: PagesTextAssets;
  entries: PagesTextEntries;
};

export type Query = {
  asset?: Maybe<Asset>;
  assetCollection?: Maybe<AssetCollection>;
  calendars?: Maybe<Calendars>;
  calendarsCollection?: Maybe<CalendarsCollection>;
  contributingCohorts?: Maybe<ContributingCohorts>;
  contributingCohortsCollection?: Maybe<ContributingCohortsCollection>;
  contributingCohortsMembership?: Maybe<ContributingCohortsMembership>;
  contributingCohortsMembershipCollection?: Maybe<ContributingCohortsMembershipCollection>;
  entryCollection?: Maybe<EntryCollection>;
  externalUsers?: Maybe<ExternalUsers>;
  externalUsersCollection?: Maybe<ExternalUsersCollection>;
  media?: Maybe<Media>;
  mediaCollection?: Maybe<MediaCollection>;
  migration?: Maybe<Migration>;
  migrationCollection?: Maybe<MigrationCollection>;
  news?: Maybe<News>;
  newsCollection?: Maybe<NewsCollection>;
  pages?: Maybe<Pages>;
  pagesCollection?: Maybe<PagesCollection>;
  users?: Maybe<Users>;
  usersCollection?: Maybe<UsersCollection>;
};

export type QueryAssetArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryAssetCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<AssetOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<AssetFilter>;
};

export type QueryCalendarsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryCalendarsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<CalendarsOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<CalendarsFilter>;
};

export type QueryContributingCohortsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryContributingCohortsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<ContributingCohortsOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ContributingCohortsFilter>;
};

export type QueryContributingCohortsMembershipArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryContributingCohortsMembershipCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<ContributingCohortsMembershipOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ContributingCohortsMembershipFilter>;
};

export type QueryEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<EntryOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EntryFilter>;
};

export type QueryExternalUsersArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryExternalUsersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<ExternalUsersOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ExternalUsersFilter>;
};

export type QueryMediaArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryMediaCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<MediaOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<MediaFilter>;
};

export type QueryMigrationArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryMigrationCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<MigrationOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<MigrationFilter>;
};

export type QueryNewsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryNewsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<NewsOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<NewsFilter>;
};

export type QueryPagesArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryPagesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<PagesOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PagesFilter>;
};

export type QueryUsersArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryUsersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<UsersOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<UsersFilter>;
};

export type Sys = {
  environmentId: Scalars['String'];
  firstPublishedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  publishedAt?: Maybe<Scalars['DateTime']>;
  publishedVersion?: Maybe<Scalars['Int']>;
  spaceId: Scalars['String'];
};

export type SysFilter = {
  firstPublishedAt?: InputMaybe<Scalars['DateTime']>;
  firstPublishedAt_exists?: InputMaybe<Scalars['Boolean']>;
  firstPublishedAt_gt?: InputMaybe<Scalars['DateTime']>;
  firstPublishedAt_gte?: InputMaybe<Scalars['DateTime']>;
  firstPublishedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  firstPublishedAt_lt?: InputMaybe<Scalars['DateTime']>;
  firstPublishedAt_lte?: InputMaybe<Scalars['DateTime']>;
  firstPublishedAt_not?: InputMaybe<Scalars['DateTime']>;
  firstPublishedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  id?: InputMaybe<Scalars['String']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_exists?: InputMaybe<Scalars['Boolean']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id_not?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  publishedAt_exists?: InputMaybe<Scalars['Boolean']>;
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>;
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>;
  publishedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>;
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>;
  publishedAt_not?: InputMaybe<Scalars['DateTime']>;
  publishedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  publishedVersion?: InputMaybe<Scalars['Float']>;
  publishedVersion_exists?: InputMaybe<Scalars['Boolean']>;
  publishedVersion_gt?: InputMaybe<Scalars['Float']>;
  publishedVersion_gte?: InputMaybe<Scalars['Float']>;
  publishedVersion_in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  publishedVersion_lt?: InputMaybe<Scalars['Float']>;
  publishedVersion_lte?: InputMaybe<Scalars['Float']>;
  publishedVersion_not?: InputMaybe<Scalars['Float']>;
  publishedVersion_not_in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type Users = Entry & {
  activatedDate?: Maybe<Scalars['DateTime']>;
  alternativeEmail?: Maybe<Scalars['String']>;
  avatar?: Maybe<Asset>;
  biography?: Maybe<Scalars['String']>;
  blog?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  connections?: Maybe<Array<Maybe<Scalars['String']>>>;
  contentfulMetadata: ContentfulMetadata;
  contributingCohortsCollection?: Maybe<UsersContributingCohortsCollection>;
  country?: Maybe<Scalars['String']>;
  degree?: Maybe<Array<Maybe<Scalars['String']>>>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  fundingStreams?: Maybe<Scalars['String']>;
  github?: Maybe<Scalars['String']>;
  googleScholar?: Maybe<Scalars['String']>;
  keywords?: Maybe<Array<Maybe<Scalars['String']>>>;
  lastName?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<UsersLinkingCollections>;
  linkedIn?: Maybe<Scalars['String']>;
  onboarded?: Maybe<Scalars['Boolean']>;
  orcid?: Maybe<Scalars['String']>;
  questions?: Maybe<Array<Maybe<Scalars['String']>>>;
  region?: Maybe<Scalars['String']>;
  researchGate?: Maybe<Scalars['String']>;
  researcherId?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  sys: Sys;
  telephoneCountryCode?: Maybe<Scalars['String']>;
  telephoneNumber?: Maybe<Scalars['String']>;
  twitter?: Maybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersActivatedDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersAlternativeEmailArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersAvatarArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersBiographyArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersBlogArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersCityArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersConnectionsArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersContributingCohortsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersCountryArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersDegreeArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersEmailArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersFirstNameArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersFundingStreamsArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersGithubArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersGoogleScholarArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersKeywordsArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersLastNameArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersLinkedInArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersOnboardedArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersOrcidArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersQuestionsArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersRegionArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersResearchGateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersResearcherIdArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersRoleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersTelephoneCountryCodeArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersTelephoneNumberArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersTwitterArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type UsersCollection = {
  items: Array<Maybe<Users>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type UsersContributingCohortsCollection = {
  items: Array<Maybe<ContributingCohortsMembership>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type UsersFilter = {
  AND?: InputMaybe<Array<InputMaybe<UsersFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<UsersFilter>>>;
  activatedDate?: InputMaybe<Scalars['DateTime']>;
  activatedDate_exists?: InputMaybe<Scalars['Boolean']>;
  activatedDate_gt?: InputMaybe<Scalars['DateTime']>;
  activatedDate_gte?: InputMaybe<Scalars['DateTime']>;
  activatedDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  activatedDate_lt?: InputMaybe<Scalars['DateTime']>;
  activatedDate_lte?: InputMaybe<Scalars['DateTime']>;
  activatedDate_not?: InputMaybe<Scalars['DateTime']>;
  activatedDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  alternativeEmail?: InputMaybe<Scalars['String']>;
  alternativeEmail_contains?: InputMaybe<Scalars['String']>;
  alternativeEmail_exists?: InputMaybe<Scalars['Boolean']>;
  alternativeEmail_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  alternativeEmail_not?: InputMaybe<Scalars['String']>;
  alternativeEmail_not_contains?: InputMaybe<Scalars['String']>;
  alternativeEmail_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  avatar_exists?: InputMaybe<Scalars['Boolean']>;
  biography?: InputMaybe<Scalars['String']>;
  biography_contains?: InputMaybe<Scalars['String']>;
  biography_exists?: InputMaybe<Scalars['Boolean']>;
  biography_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  biography_not?: InputMaybe<Scalars['String']>;
  biography_not_contains?: InputMaybe<Scalars['String']>;
  biography_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  blog?: InputMaybe<Scalars['String']>;
  blog_contains?: InputMaybe<Scalars['String']>;
  blog_exists?: InputMaybe<Scalars['Boolean']>;
  blog_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  blog_not?: InputMaybe<Scalars['String']>;
  blog_not_contains?: InputMaybe<Scalars['String']>;
  blog_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  city?: InputMaybe<Scalars['String']>;
  city_contains?: InputMaybe<Scalars['String']>;
  city_exists?: InputMaybe<Scalars['Boolean']>;
  city_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  city_not?: InputMaybe<Scalars['String']>;
  city_not_contains?: InputMaybe<Scalars['String']>;
  city_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  connections_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  connections_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  connections_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  connections_exists?: InputMaybe<Scalars['Boolean']>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  contributingCohorts?: InputMaybe<CfContributingCohortsMembershipNestedFilter>;
  contributingCohortsCollection_exists?: InputMaybe<Scalars['Boolean']>;
  country?: InputMaybe<Scalars['String']>;
  country_contains?: InputMaybe<Scalars['String']>;
  country_exists?: InputMaybe<Scalars['Boolean']>;
  country_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  country_not?: InputMaybe<Scalars['String']>;
  country_not_contains?: InputMaybe<Scalars['String']>;
  country_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  degree_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  degree_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  degree_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  degree_exists?: InputMaybe<Scalars['Boolean']>;
  email?: InputMaybe<Scalars['String']>;
  email_contains?: InputMaybe<Scalars['String']>;
  email_exists?: InputMaybe<Scalars['Boolean']>;
  email_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  email_not?: InputMaybe<Scalars['String']>;
  email_not_contains?: InputMaybe<Scalars['String']>;
  email_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  firstName?: InputMaybe<Scalars['String']>;
  firstName_contains?: InputMaybe<Scalars['String']>;
  firstName_exists?: InputMaybe<Scalars['Boolean']>;
  firstName_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  firstName_not?: InputMaybe<Scalars['String']>;
  firstName_not_contains?: InputMaybe<Scalars['String']>;
  firstName_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  fundingStreams?: InputMaybe<Scalars['String']>;
  fundingStreams_contains?: InputMaybe<Scalars['String']>;
  fundingStreams_exists?: InputMaybe<Scalars['Boolean']>;
  fundingStreams_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  fundingStreams_not?: InputMaybe<Scalars['String']>;
  fundingStreams_not_contains?: InputMaybe<Scalars['String']>;
  fundingStreams_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  github?: InputMaybe<Scalars['String']>;
  github_contains?: InputMaybe<Scalars['String']>;
  github_exists?: InputMaybe<Scalars['Boolean']>;
  github_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  github_not?: InputMaybe<Scalars['String']>;
  github_not_contains?: InputMaybe<Scalars['String']>;
  github_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  googleScholar?: InputMaybe<Scalars['String']>;
  googleScholar_contains?: InputMaybe<Scalars['String']>;
  googleScholar_exists?: InputMaybe<Scalars['Boolean']>;
  googleScholar_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  googleScholar_not?: InputMaybe<Scalars['String']>;
  googleScholar_not_contains?: InputMaybe<Scalars['String']>;
  googleScholar_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  keywords_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  keywords_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  keywords_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  keywords_exists?: InputMaybe<Scalars['Boolean']>;
  lastName?: InputMaybe<Scalars['String']>;
  lastName_contains?: InputMaybe<Scalars['String']>;
  lastName_exists?: InputMaybe<Scalars['Boolean']>;
  lastName_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  lastName_not?: InputMaybe<Scalars['String']>;
  lastName_not_contains?: InputMaybe<Scalars['String']>;
  lastName_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  linkedIn?: InputMaybe<Scalars['String']>;
  linkedIn_contains?: InputMaybe<Scalars['String']>;
  linkedIn_exists?: InputMaybe<Scalars['Boolean']>;
  linkedIn_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  linkedIn_not?: InputMaybe<Scalars['String']>;
  linkedIn_not_contains?: InputMaybe<Scalars['String']>;
  linkedIn_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  onboarded?: InputMaybe<Scalars['Boolean']>;
  onboarded_exists?: InputMaybe<Scalars['Boolean']>;
  onboarded_not?: InputMaybe<Scalars['Boolean']>;
  orcid?: InputMaybe<Scalars['String']>;
  orcid_contains?: InputMaybe<Scalars['String']>;
  orcid_exists?: InputMaybe<Scalars['Boolean']>;
  orcid_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  orcid_not?: InputMaybe<Scalars['String']>;
  orcid_not_contains?: InputMaybe<Scalars['String']>;
  orcid_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  questions_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  questions_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  questions_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  questions_exists?: InputMaybe<Scalars['Boolean']>;
  region?: InputMaybe<Scalars['String']>;
  region_contains?: InputMaybe<Scalars['String']>;
  region_exists?: InputMaybe<Scalars['Boolean']>;
  region_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  region_not?: InputMaybe<Scalars['String']>;
  region_not_contains?: InputMaybe<Scalars['String']>;
  region_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  researchGate?: InputMaybe<Scalars['String']>;
  researchGate_contains?: InputMaybe<Scalars['String']>;
  researchGate_exists?: InputMaybe<Scalars['Boolean']>;
  researchGate_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  researchGate_not?: InputMaybe<Scalars['String']>;
  researchGate_not_contains?: InputMaybe<Scalars['String']>;
  researchGate_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  researcherId?: InputMaybe<Scalars['String']>;
  researcherId_contains?: InputMaybe<Scalars['String']>;
  researcherId_exists?: InputMaybe<Scalars['Boolean']>;
  researcherId_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  researcherId_not?: InputMaybe<Scalars['String']>;
  researcherId_not_contains?: InputMaybe<Scalars['String']>;
  researcherId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  role?: InputMaybe<Scalars['String']>;
  role_contains?: InputMaybe<Scalars['String']>;
  role_exists?: InputMaybe<Scalars['Boolean']>;
  role_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  role_not?: InputMaybe<Scalars['String']>;
  role_not_contains?: InputMaybe<Scalars['String']>;
  role_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  telephoneCountryCode?: InputMaybe<Scalars['String']>;
  telephoneCountryCode_contains?: InputMaybe<Scalars['String']>;
  telephoneCountryCode_exists?: InputMaybe<Scalars['Boolean']>;
  telephoneCountryCode_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  telephoneCountryCode_not?: InputMaybe<Scalars['String']>;
  telephoneCountryCode_not_contains?: InputMaybe<Scalars['String']>;
  telephoneCountryCode_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >;
  telephoneNumber?: InputMaybe<Scalars['String']>;
  telephoneNumber_contains?: InputMaybe<Scalars['String']>;
  telephoneNumber_exists?: InputMaybe<Scalars['Boolean']>;
  telephoneNumber_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  telephoneNumber_not?: InputMaybe<Scalars['String']>;
  telephoneNumber_not_contains?: InputMaybe<Scalars['String']>;
  telephoneNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  twitter?: InputMaybe<Scalars['String']>;
  twitter_contains?: InputMaybe<Scalars['String']>;
  twitter_exists?: InputMaybe<Scalars['Boolean']>;
  twitter_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  twitter_not?: InputMaybe<Scalars['String']>;
  twitter_not_contains?: InputMaybe<Scalars['String']>;
  twitter_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type UsersLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
};

export type UsersLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum UsersOrder {
  ActivatedDateAsc = 'activatedDate_ASC',
  ActivatedDateDesc = 'activatedDate_DESC',
  AlternativeEmailAsc = 'alternativeEmail_ASC',
  AlternativeEmailDesc = 'alternativeEmail_DESC',
  BlogAsc = 'blog_ASC',
  BlogDesc = 'blog_DESC',
  CityAsc = 'city_ASC',
  CityDesc = 'city_DESC',
  CountryAsc = 'country_ASC',
  CountryDesc = 'country_DESC',
  EmailAsc = 'email_ASC',
  EmailDesc = 'email_DESC',
  FirstNameAsc = 'firstName_ASC',
  FirstNameDesc = 'firstName_DESC',
  GithubAsc = 'github_ASC',
  GithubDesc = 'github_DESC',
  GoogleScholarAsc = 'googleScholar_ASC',
  GoogleScholarDesc = 'googleScholar_DESC',
  LastNameAsc = 'lastName_ASC',
  LastNameDesc = 'lastName_DESC',
  LinkedInAsc = 'linkedIn_ASC',
  LinkedInDesc = 'linkedIn_DESC',
  OnboardedAsc = 'onboarded_ASC',
  OnboardedDesc = 'onboarded_DESC',
  OrcidAsc = 'orcid_ASC',
  OrcidDesc = 'orcid_DESC',
  RegionAsc = 'region_ASC',
  RegionDesc = 'region_DESC',
  ResearchGateAsc = 'researchGate_ASC',
  ResearchGateDesc = 'researchGate_DESC',
  ResearcherIdAsc = 'researcherId_ASC',
  ResearcherIdDesc = 'researcherId_DESC',
  RoleAsc = 'role_ASC',
  RoleDesc = 'role_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TelephoneCountryCodeAsc = 'telephoneCountryCode_ASC',
  TelephoneCountryCodeDesc = 'telephoneCountryCode_DESC',
  TelephoneNumberAsc = 'telephoneNumber_ASC',
  TelephoneNumberDesc = 'telephoneNumber_DESC',
  TwitterAsc = 'twitter_ASC',
  TwitterDesc = 'twitter_DESC',
}

export type CfContributingCohortsMembershipNestedFilter = {
  AND?: InputMaybe<
    Array<InputMaybe<CfContributingCohortsMembershipNestedFilter>>
  >;
  OR?: InputMaybe<
    Array<InputMaybe<CfContributingCohortsMembershipNestedFilter>>
  >;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  contributingCohort_exists?: InputMaybe<Scalars['Boolean']>;
  role?: InputMaybe<Scalars['String']>;
  role_contains?: InputMaybe<Scalars['String']>;
  role_exists?: InputMaybe<Scalars['Boolean']>;
  role_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  role_not?: InputMaybe<Scalars['String']>;
  role_not_contains?: InputMaybe<Scalars['String']>;
  role_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  studyLink?: InputMaybe<Scalars['String']>;
  studyLink_contains?: InputMaybe<Scalars['String']>;
  studyLink_exists?: InputMaybe<Scalars['Boolean']>;
  studyLink_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  studyLink_not?: InputMaybe<Scalars['String']>;
  studyLink_not_contains?: InputMaybe<Scalars['String']>;
  studyLink_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
};

export type CfContributingCohortsNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfContributingCohortsNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfContributingCohortsNestedFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_exists?: InputMaybe<Scalars['Boolean']>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
};

export type ContributingCohortsContentDataFragment = Pick<
  ContributingCohorts,
  'name'
> & { sys: Pick<Sys, 'id'> };

export type FetchContributingCohortsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<
    | Array<InputMaybe<ContributingCohortsOrder>>
    | InputMaybe<ContributingCohortsOrder>
  >;
}>;

export type FetchContributingCohortsQuery = {
  contributingCohortsCollection?: Maybe<
    Pick<ContributingCohortsCollection, 'total'> & {
      items: Array<
        Maybe<Pick<ContributingCohorts, 'name'> & { sys: Pick<Sys, 'id'> }>
      >;
    }
  >;
};

export type NewsContentDataFragment = Pick<
  News,
  | 'title'
  | 'shortText'
  | 'sampleCount'
  | 'articleCount'
  | 'cohortCount'
  | 'link'
  | 'linkText'
  | 'publishDate'
> & { sys: Pick<Sys, 'id' | 'firstPublishedAt'> };

export type FetchNewsByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchNewsByIdQuery = {
  news?: Maybe<
    Pick<
      News,
      | 'title'
      | 'shortText'
      | 'sampleCount'
      | 'articleCount'
      | 'cohortCount'
      | 'link'
      | 'linkText'
      | 'publishDate'
    > & { sys: Pick<Sys, 'id' | 'firstPublishedAt'> }
  >;
};

export type FetchNewsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Array<InputMaybe<NewsOrder>> | InputMaybe<NewsOrder>>;
  where?: InputMaybe<NewsFilter>;
}>;

export type FetchNewsQuery = {
  newsCollection?: Maybe<
    Pick<NewsCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<
            News,
            | 'title'
            | 'shortText'
            | 'sampleCount'
            | 'articleCount'
            | 'cohortCount'
            | 'link'
            | 'linkText'
            | 'publishDate'
          > & { sys: Pick<Sys, 'id' | 'firstPublishedAt'> }
        >
      >;
    }
  >;
};

export type PageContentDataFragment = Pick<
  Pages,
  'title' | 'path' | 'shortText' | 'link' | 'linkText'
> & {
  sys: Pick<Sys, 'id'>;
  text?: Maybe<
    Pick<PagesText, 'json'> & {
      links: {
        entries: {
          inline: Array<
            Maybe<
              | ({ __typename: 'Calendars' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ContributingCohorts' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'ContributingCohortsMembership' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'ExternalUsers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                    sys: Pick<Sys, 'id'>;
                  })
              | ({ __typename: 'Migration' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
            >
          >;
        };
        assets: {
          block: Array<
            Maybe<
              Pick<
                Asset,
                'url' | 'description' | 'contentType' | 'width' | 'height'
              > & { sys: Pick<Sys, 'id'> }
            >
          >;
        };
      };
    }
  >;
};

export type FetchPagesQueryVariables = Exact<{
  where?: InputMaybe<PagesFilter>;
}>;

export type FetchPagesQuery = {
  pagesCollection?: Maybe<
    Pick<PagesCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<Pages, 'title' | 'path' | 'shortText' | 'link' | 'linkText'> & {
            sys: Pick<Sys, 'id'>;
            text?: Maybe<
              Pick<PagesText, 'json'> & {
                links: {
                  entries: {
                    inline: Array<
                      Maybe<
                        | ({ __typename: 'Calendars' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'ContributingCohorts' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'ContributingCohortsMembership' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'ExternalUsers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                              sys: Pick<Sys, 'id'>;
                            })
                        | ({ __typename: 'Migration' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
                      >
                    >;
                  };
                  assets: {
                    block: Array<
                      Maybe<
                        Pick<
                          Asset,
                          | 'url'
                          | 'description'
                          | 'contentType'
                          | 'width'
                          | 'height'
                        > & { sys: Pick<Sys, 'id'> }
                      >
                    >;
                  };
                };
              }
            >;
          }
        >
      >;
    }
  >;
};

export const ContributingCohortsContentDataFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ContributingCohortsContentData' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'ContributingCohorts' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'sys' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ContributingCohortsContentDataFragment, unknown>;
export const NewsContentDataFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'NewsContentData' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'News' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'sys' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'firstPublishedAt' },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shortText' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sampleCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'articleCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'cohortCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'link' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linkText' } },
          { kind: 'Field', name: { kind: 'Name', value: 'publishDate' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<NewsContentDataFragment, unknown>;
export const PageContentDataFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PageContentData' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Pages' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'sys' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'path' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shortText' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'text' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'json' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'links' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'entries' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'inline' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sys' },
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
                                    name: { kind: 'Name', value: '__typename' },
                                  },
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'Media' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'url' },
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
                        name: { kind: 'Name', value: 'assets' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'block' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sys' },
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
                                    name: { kind: 'Name', value: 'url' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'description',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'contentType',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'width' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'height' },
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
          { kind: 'Field', name: { kind: 'Name', value: 'link' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linkText' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PageContentDataFragment, unknown>;
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
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'limit' },
          },
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
            name: { kind: 'Name', value: 'order' },
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'ContributingCohortsOrder' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'contributingCohortsCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'limit' },
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
                name: { kind: 'Name', value: 'order' },
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
                        name: {
                          kind: 'Name',
                          value: 'ContributingCohortsContentData',
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
    ...ContributingCohortsContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchContributingCohortsQuery,
  FetchContributingCohortsQueryVariables
>;
export const FetchNewsByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchNewsById' },
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
            name: { kind: 'Name', value: 'news' },
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
                  name: { kind: 'Name', value: 'NewsContentData' },
                },
              ],
            },
          },
        ],
      },
    },
    ...NewsContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchNewsByIdQuery, FetchNewsByIdQueryVariables>;
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
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'limit' },
          },
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
            name: { kind: 'Name', value: 'order' },
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'NewsOrder' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'where' },
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'NewsFilter' },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'newsCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'limit' },
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
                name: { kind: 'Name', value: 'order' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'order' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'where' },
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
                        name: { kind: 'Name', value: 'NewsContentData' },
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
    ...NewsContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchNewsQuery, FetchNewsQueryVariables>;
export const FetchPagesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchPages' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'where' },
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'PagesFilter' },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'pagesCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '100' },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'where' },
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
                        name: { kind: 'Name', value: 'PageContentData' },
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
    ...PageContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchPagesQuery, FetchPagesQueryVariables>;
