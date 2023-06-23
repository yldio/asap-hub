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
  eventsCollection?: Maybe<EventsCollection>;
  usersCollection?: Maybe<UsersCollection>;
};

export type AssetLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type AssetLinkingCollectionsEventsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<AssetLinkingCollectionsEventsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type AssetLinkingCollectionsUsersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<AssetLinkingCollectionsUsersCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum AssetLinkingCollectionsEventsCollectionOrder {
  EndDateTimeZoneAsc = 'endDateTimeZone_ASC',
  EndDateTimeZoneDesc = 'endDateTimeZone_DESC',
  EndDateAsc = 'endDate_ASC',
  EndDateDesc = 'endDate_DESC',
  EventLinkAsc = 'eventLink_ASC',
  EventLinkDesc = 'eventLink_DESC',
  GoogleIdAsc = 'googleId_ASC',
  GoogleIdDesc = 'googleId_DESC',
  HiddenAsc = 'hidden_ASC',
  HiddenDesc = 'hidden_DESC',
  HideMeetingLinkAsc = 'hideMeetingLink_ASC',
  HideMeetingLinkDesc = 'hideMeetingLink_DESC',
  MeetingLinkAsc = 'meetingLink_ASC',
  MeetingLinkDesc = 'meetingLink_DESC',
  MeetingMaterialsPermanentlyUnavailableAsc = 'meetingMaterialsPermanentlyUnavailable_ASC',
  MeetingMaterialsPermanentlyUnavailableDesc = 'meetingMaterialsPermanentlyUnavailable_DESC',
  NotesPermanentlyUnavailableAsc = 'notesPermanentlyUnavailable_ASC',
  NotesPermanentlyUnavailableDesc = 'notesPermanentlyUnavailable_DESC',
  NotesUpdatedAtAsc = 'notesUpdatedAt_ASC',
  NotesUpdatedAtDesc = 'notesUpdatedAt_DESC',
  PresentationPermanentlyUnavailableAsc = 'presentationPermanentlyUnavailable_ASC',
  PresentationPermanentlyUnavailableDesc = 'presentationPermanentlyUnavailable_DESC',
  PresentationUpdatedAtAsc = 'presentationUpdatedAt_ASC',
  PresentationUpdatedAtDesc = 'presentationUpdatedAt_DESC',
  StartDateTimeZoneAsc = 'startDateTimeZone_ASC',
  StartDateTimeZoneDesc = 'startDateTimeZone_DESC',
  StartDateAsc = 'startDate_ASC',
  StartDateDesc = 'startDate_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  VideoRecordingPermanentlyUnavailableAsc = 'videoRecordingPermanentlyUnavailable_ASC',
  VideoRecordingPermanentlyUnavailableDesc = 'videoRecordingPermanentlyUnavailable_DESC',
  VideoRecordingUpdatedAtAsc = 'videoRecordingUpdatedAt_ASC',
  VideoRecordingUpdatedAtDesc = 'videoRecordingUpdatedAt_DESC',
}

export enum AssetLinkingCollectionsUsersCollectionOrder {
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
  googleApiMetadata?: Maybe<Scalars['JSON']>;
  googleCalendarId?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<CalendarsLinkingCollections>;
  name?: Maybe<Scalars['String']>;
  sys: Sys;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/calendars) */
export type CalendarsColorArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/calendars) */
export type CalendarsGoogleApiMetadataArgs = {
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
  googleApiMetadata_exists?: InputMaybe<Scalars['Boolean']>;
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
  sys?: InputMaybe<SysFilter>;
};

export type CalendarsLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
  eventsCollection?: Maybe<EventsCollection>;
  projectsCollection?: Maybe<ProjectsCollection>;
  workingGroupsCollection?: Maybe<WorkingGroupsCollection>;
};

export type CalendarsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type CalendarsLinkingCollectionsEventsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<CalendarsLinkingCollectionsEventsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type CalendarsLinkingCollectionsProjectsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<CalendarsLinkingCollectionsProjectsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type CalendarsLinkingCollectionsWorkingGroupsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<CalendarsLinkingCollectionsWorkingGroupsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum CalendarsLinkingCollectionsEventsCollectionOrder {
  EndDateTimeZoneAsc = 'endDateTimeZone_ASC',
  EndDateTimeZoneDesc = 'endDateTimeZone_DESC',
  EndDateAsc = 'endDate_ASC',
  EndDateDesc = 'endDate_DESC',
  EventLinkAsc = 'eventLink_ASC',
  EventLinkDesc = 'eventLink_DESC',
  GoogleIdAsc = 'googleId_ASC',
  GoogleIdDesc = 'googleId_DESC',
  HiddenAsc = 'hidden_ASC',
  HiddenDesc = 'hidden_DESC',
  HideMeetingLinkAsc = 'hideMeetingLink_ASC',
  HideMeetingLinkDesc = 'hideMeetingLink_DESC',
  MeetingLinkAsc = 'meetingLink_ASC',
  MeetingLinkDesc = 'meetingLink_DESC',
  MeetingMaterialsPermanentlyUnavailableAsc = 'meetingMaterialsPermanentlyUnavailable_ASC',
  MeetingMaterialsPermanentlyUnavailableDesc = 'meetingMaterialsPermanentlyUnavailable_DESC',
  NotesPermanentlyUnavailableAsc = 'notesPermanentlyUnavailable_ASC',
  NotesPermanentlyUnavailableDesc = 'notesPermanentlyUnavailable_DESC',
  NotesUpdatedAtAsc = 'notesUpdatedAt_ASC',
  NotesUpdatedAtDesc = 'notesUpdatedAt_DESC',
  PresentationPermanentlyUnavailableAsc = 'presentationPermanentlyUnavailable_ASC',
  PresentationPermanentlyUnavailableDesc = 'presentationPermanentlyUnavailable_DESC',
  PresentationUpdatedAtAsc = 'presentationUpdatedAt_ASC',
  PresentationUpdatedAtDesc = 'presentationUpdatedAt_DESC',
  StartDateTimeZoneAsc = 'startDateTimeZone_ASC',
  StartDateTimeZoneDesc = 'startDateTimeZone_DESC',
  StartDateAsc = 'startDate_ASC',
  StartDateDesc = 'startDate_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  VideoRecordingPermanentlyUnavailableAsc = 'videoRecordingPermanentlyUnavailable_ASC',
  VideoRecordingPermanentlyUnavailableDesc = 'videoRecordingPermanentlyUnavailable_DESC',
  VideoRecordingUpdatedAtAsc = 'videoRecordingUpdatedAt_ASC',
  VideoRecordingUpdatedAtDesc = 'videoRecordingUpdatedAt_DESC',
}

export enum CalendarsLinkingCollectionsProjectsCollectionOrder {
  EndDateAsc = 'endDate_ASC',
  EndDateDesc = 'endDate_DESC',
  LeadEmailAsc = 'leadEmail_ASC',
  LeadEmailDesc = 'leadEmail_DESC',
  OpportunitiesLinkAsc = 'opportunitiesLink_ASC',
  OpportunitiesLinkDesc = 'opportunitiesLink_DESC',
  PmEmailAsc = 'pmEmail_ASC',
  PmEmailDesc = 'pmEmail_DESC',
  ProjectProposalAsc = 'projectProposal_ASC',
  ProjectProposalDesc = 'projectProposal_DESC',
  StartDateAsc = 'startDate_ASC',
  StartDateDesc = 'startDate_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TraineeProjectAsc = 'traineeProject_ASC',
  TraineeProjectDesc = 'traineeProject_DESC',
}

export enum CalendarsLinkingCollectionsWorkingGroupsCollectionOrder {
  LeadingMembersAsc = 'leadingMembers_ASC',
  LeadingMembersDesc = 'leadingMembers_DESC',
  PrimaryEmailAsc = 'primaryEmail_ASC',
  PrimaryEmailDesc = 'primaryEmail_DESC',
  SecondaryEmailAsc = 'secondaryEmail_ASC',
  SecondaryEmailDesc = 'secondaryEmail_DESC',
  ShortDescriptionAsc = 'shortDescription_ASC',
  ShortDescriptionDesc = 'shortDescription_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export enum CalendarsOrder {
  ColorAsc = 'color_ASC',
  ColorDesc = 'color_DESC',
  GoogleCalendarIdAsc = 'googleCalendarId_ASC',
  GoogleCalendarIdDesc = 'googleCalendarId_DESC',
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
    order?: InputMaybe<
      Array<
        InputMaybe<ContributingCohortsLinkingCollectionsContributingCohortsMembershipCollectionOrder>
      >
    >;
    preview?: InputMaybe<Scalars['Boolean']>;
    skip?: InputMaybe<Scalars['Int']>;
  };

export type ContributingCohortsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum ContributingCohortsLinkingCollectionsContributingCohortsMembershipCollectionOrder {
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
    order?: InputMaybe<
      Array<
        InputMaybe<ContributingCohortsMembershipLinkingCollectionsUsersCollectionOrder>
      >
    >;
    preview?: InputMaybe<Scalars['Boolean']>;
    skip?: InputMaybe<Scalars['Int']>;
  };

export enum ContributingCohortsMembershipLinkingCollectionsUsersCollectionOrder {
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

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/eventSpeakers) */
export type EventSpeakers = Entry & {
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<EventSpeakersLinkingCollections>;
  sys: Sys;
  title?: Maybe<Scalars['String']>;
  user?: Maybe<EventSpeakersUser>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/eventSpeakers) */
export type EventSpeakersLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/eventSpeakers) */
export type EventSpeakersTitleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/eventSpeakers) */
export type EventSpeakersUserArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type EventSpeakersCollection = {
  items: Array<Maybe<EventSpeakers>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type EventSpeakersFilter = {
  AND?: InputMaybe<Array<InputMaybe<EventSpeakersFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<EventSpeakersFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  sys?: InputMaybe<SysFilter>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  user_exists?: InputMaybe<Scalars['Boolean']>;
};

export type EventSpeakersLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
  eventsCollection?: Maybe<EventsCollection>;
};

export type EventSpeakersLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type EventSpeakersLinkingCollectionsEventsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<EventSpeakersLinkingCollectionsEventsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum EventSpeakersLinkingCollectionsEventsCollectionOrder {
  EndDateTimeZoneAsc = 'endDateTimeZone_ASC',
  EndDateTimeZoneDesc = 'endDateTimeZone_DESC',
  EndDateAsc = 'endDate_ASC',
  EndDateDesc = 'endDate_DESC',
  EventLinkAsc = 'eventLink_ASC',
  EventLinkDesc = 'eventLink_DESC',
  GoogleIdAsc = 'googleId_ASC',
  GoogleIdDesc = 'googleId_DESC',
  HiddenAsc = 'hidden_ASC',
  HiddenDesc = 'hidden_DESC',
  HideMeetingLinkAsc = 'hideMeetingLink_ASC',
  HideMeetingLinkDesc = 'hideMeetingLink_DESC',
  MeetingLinkAsc = 'meetingLink_ASC',
  MeetingLinkDesc = 'meetingLink_DESC',
  MeetingMaterialsPermanentlyUnavailableAsc = 'meetingMaterialsPermanentlyUnavailable_ASC',
  MeetingMaterialsPermanentlyUnavailableDesc = 'meetingMaterialsPermanentlyUnavailable_DESC',
  NotesPermanentlyUnavailableAsc = 'notesPermanentlyUnavailable_ASC',
  NotesPermanentlyUnavailableDesc = 'notesPermanentlyUnavailable_DESC',
  NotesUpdatedAtAsc = 'notesUpdatedAt_ASC',
  NotesUpdatedAtDesc = 'notesUpdatedAt_DESC',
  PresentationPermanentlyUnavailableAsc = 'presentationPermanentlyUnavailable_ASC',
  PresentationPermanentlyUnavailableDesc = 'presentationPermanentlyUnavailable_DESC',
  PresentationUpdatedAtAsc = 'presentationUpdatedAt_ASC',
  PresentationUpdatedAtDesc = 'presentationUpdatedAt_DESC',
  StartDateTimeZoneAsc = 'startDateTimeZone_ASC',
  StartDateTimeZoneDesc = 'startDateTimeZone_DESC',
  StartDateAsc = 'startDate_ASC',
  StartDateDesc = 'startDate_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  VideoRecordingPermanentlyUnavailableAsc = 'videoRecordingPermanentlyUnavailable_ASC',
  VideoRecordingPermanentlyUnavailableDesc = 'videoRecordingPermanentlyUnavailable_DESC',
  VideoRecordingUpdatedAtAsc = 'videoRecordingUpdatedAt_ASC',
  VideoRecordingUpdatedAtDesc = 'videoRecordingUpdatedAt_DESC',
}

export enum EventSpeakersOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type EventSpeakersUser = ExternalUsers | Users;

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type Events = Entry & {
  calendar?: Maybe<Calendars>;
  contentfulMetadata: ContentfulMetadata;
  description?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['DateTime']>;
  endDateTimeZone?: Maybe<Scalars['String']>;
  eventLink?: Maybe<Scalars['String']>;
  googleId?: Maybe<Scalars['String']>;
  hidden?: Maybe<Scalars['Boolean']>;
  hideMeetingLink?: Maybe<Scalars['Boolean']>;
  linkedFrom?: Maybe<EventsLinkingCollections>;
  meetingLink?: Maybe<Scalars['String']>;
  meetingMaterials?: Maybe<Scalars['JSON']>;
  meetingMaterialsPermanentlyUnavailable?: Maybe<Scalars['Boolean']>;
  notes?: Maybe<EventsNotes>;
  notesPermanentlyUnavailable?: Maybe<Scalars['Boolean']>;
  notesUpdatedAt?: Maybe<Scalars['DateTime']>;
  presentation?: Maybe<EventsPresentation>;
  presentationPermanentlyUnavailable?: Maybe<Scalars['Boolean']>;
  presentationUpdatedAt?: Maybe<Scalars['DateTime']>;
  speakersCollection?: Maybe<EventsSpeakersCollection>;
  startDate?: Maybe<Scalars['DateTime']>;
  startDateTimeZone?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  sys: Sys;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  thumbnail?: Maybe<Asset>;
  title?: Maybe<Scalars['String']>;
  videoRecording?: Maybe<EventsVideoRecording>;
  videoRecordingPermanentlyUnavailable?: Maybe<Scalars['Boolean']>;
  videoRecordingUpdatedAt?: Maybe<Scalars['DateTime']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsCalendarArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsEndDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsEndDateTimeZoneArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsEventLinkArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsGoogleIdArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsHiddenArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsHideMeetingLinkArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsMeetingLinkArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsMeetingMaterialsArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsMeetingMaterialsPermanentlyUnavailableArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsNotesArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsNotesPermanentlyUnavailableArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsNotesUpdatedAtArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsPresentationArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsPresentationPermanentlyUnavailableArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsPresentationUpdatedAtArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsSpeakersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<EventsSpeakersCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EventSpeakersFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsStartDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsStartDateTimeZoneArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsStatusArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsTagsArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsThumbnailArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsTitleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsVideoRecordingArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsVideoRecordingPermanentlyUnavailableArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsVideoRecordingUpdatedAtArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type EventsCollection = {
  items: Array<Maybe<Events>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type EventsFilter = {
  AND?: InputMaybe<Array<InputMaybe<EventsFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<EventsFilter>>>;
  calendar?: InputMaybe<CfCalendarsNestedFilter>;
  calendar_exists?: InputMaybe<Scalars['Boolean']>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_exists?: InputMaybe<Scalars['Boolean']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  endDateTimeZone?: InputMaybe<Scalars['String']>;
  endDateTimeZone_contains?: InputMaybe<Scalars['String']>;
  endDateTimeZone_exists?: InputMaybe<Scalars['Boolean']>;
  endDateTimeZone_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  endDateTimeZone_not?: InputMaybe<Scalars['String']>;
  endDateTimeZone_not_contains?: InputMaybe<Scalars['String']>;
  endDateTimeZone_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  endDate_exists?: InputMaybe<Scalars['Boolean']>;
  endDate_gt?: InputMaybe<Scalars['DateTime']>;
  endDate_gte?: InputMaybe<Scalars['DateTime']>;
  endDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  endDate_lt?: InputMaybe<Scalars['DateTime']>;
  endDate_lte?: InputMaybe<Scalars['DateTime']>;
  endDate_not?: InputMaybe<Scalars['DateTime']>;
  endDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  eventLink?: InputMaybe<Scalars['String']>;
  eventLink_contains?: InputMaybe<Scalars['String']>;
  eventLink_exists?: InputMaybe<Scalars['Boolean']>;
  eventLink_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  eventLink_not?: InputMaybe<Scalars['String']>;
  eventLink_not_contains?: InputMaybe<Scalars['String']>;
  eventLink_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  googleId?: InputMaybe<Scalars['String']>;
  googleId_contains?: InputMaybe<Scalars['String']>;
  googleId_exists?: InputMaybe<Scalars['Boolean']>;
  googleId_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  googleId_not?: InputMaybe<Scalars['String']>;
  googleId_not_contains?: InputMaybe<Scalars['String']>;
  googleId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  hidden?: InputMaybe<Scalars['Boolean']>;
  hidden_exists?: InputMaybe<Scalars['Boolean']>;
  hidden_not?: InputMaybe<Scalars['Boolean']>;
  hideMeetingLink?: InputMaybe<Scalars['Boolean']>;
  hideMeetingLink_exists?: InputMaybe<Scalars['Boolean']>;
  hideMeetingLink_not?: InputMaybe<Scalars['Boolean']>;
  meetingLink?: InputMaybe<Scalars['String']>;
  meetingLink_contains?: InputMaybe<Scalars['String']>;
  meetingLink_exists?: InputMaybe<Scalars['Boolean']>;
  meetingLink_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  meetingLink_not?: InputMaybe<Scalars['String']>;
  meetingLink_not_contains?: InputMaybe<Scalars['String']>;
  meetingLink_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  meetingMaterialsPermanentlyUnavailable?: InputMaybe<Scalars['Boolean']>;
  meetingMaterialsPermanentlyUnavailable_exists?: InputMaybe<
    Scalars['Boolean']
  >;
  meetingMaterialsPermanentlyUnavailable_not?: InputMaybe<Scalars['Boolean']>;
  meetingMaterials_exists?: InputMaybe<Scalars['Boolean']>;
  notesPermanentlyUnavailable?: InputMaybe<Scalars['Boolean']>;
  notesPermanentlyUnavailable_exists?: InputMaybe<Scalars['Boolean']>;
  notesPermanentlyUnavailable_not?: InputMaybe<Scalars['Boolean']>;
  notesUpdatedAt?: InputMaybe<Scalars['DateTime']>;
  notesUpdatedAt_exists?: InputMaybe<Scalars['Boolean']>;
  notesUpdatedAt_gt?: InputMaybe<Scalars['DateTime']>;
  notesUpdatedAt_gte?: InputMaybe<Scalars['DateTime']>;
  notesUpdatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  notesUpdatedAt_lt?: InputMaybe<Scalars['DateTime']>;
  notesUpdatedAt_lte?: InputMaybe<Scalars['DateTime']>;
  notesUpdatedAt_not?: InputMaybe<Scalars['DateTime']>;
  notesUpdatedAt_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  notes_contains?: InputMaybe<Scalars['String']>;
  notes_exists?: InputMaybe<Scalars['Boolean']>;
  notes_not_contains?: InputMaybe<Scalars['String']>;
  presentationPermanentlyUnavailable?: InputMaybe<Scalars['Boolean']>;
  presentationPermanentlyUnavailable_exists?: InputMaybe<Scalars['Boolean']>;
  presentationPermanentlyUnavailable_not?: InputMaybe<Scalars['Boolean']>;
  presentationUpdatedAt?: InputMaybe<Scalars['DateTime']>;
  presentationUpdatedAt_exists?: InputMaybe<Scalars['Boolean']>;
  presentationUpdatedAt_gt?: InputMaybe<Scalars['DateTime']>;
  presentationUpdatedAt_gte?: InputMaybe<Scalars['DateTime']>;
  presentationUpdatedAt_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  presentationUpdatedAt_lt?: InputMaybe<Scalars['DateTime']>;
  presentationUpdatedAt_lte?: InputMaybe<Scalars['DateTime']>;
  presentationUpdatedAt_not?: InputMaybe<Scalars['DateTime']>;
  presentationUpdatedAt_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['DateTime']>>
  >;
  presentation_contains?: InputMaybe<Scalars['String']>;
  presentation_exists?: InputMaybe<Scalars['Boolean']>;
  presentation_not_contains?: InputMaybe<Scalars['String']>;
  speakers?: InputMaybe<CfEventSpeakersNestedFilter>;
  speakersCollection_exists?: InputMaybe<Scalars['Boolean']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  startDateTimeZone?: InputMaybe<Scalars['String']>;
  startDateTimeZone_contains?: InputMaybe<Scalars['String']>;
  startDateTimeZone_exists?: InputMaybe<Scalars['Boolean']>;
  startDateTimeZone_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  startDateTimeZone_not?: InputMaybe<Scalars['String']>;
  startDateTimeZone_not_contains?: InputMaybe<Scalars['String']>;
  startDateTimeZone_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  startDate_exists?: InputMaybe<Scalars['Boolean']>;
  startDate_gt?: InputMaybe<Scalars['DateTime']>;
  startDate_gte?: InputMaybe<Scalars['DateTime']>;
  startDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  startDate_lt?: InputMaybe<Scalars['DateTime']>;
  startDate_lte?: InputMaybe<Scalars['DateTime']>;
  startDate_not?: InputMaybe<Scalars['DateTime']>;
  startDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  status?: InputMaybe<Scalars['String']>;
  status_contains?: InputMaybe<Scalars['String']>;
  status_exists?: InputMaybe<Scalars['Boolean']>;
  status_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  status_not?: InputMaybe<Scalars['String']>;
  status_not_contains?: InputMaybe<Scalars['String']>;
  status_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  tags_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tags_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tags_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tags_exists?: InputMaybe<Scalars['Boolean']>;
  thumbnail_exists?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  videoRecordingPermanentlyUnavailable?: InputMaybe<Scalars['Boolean']>;
  videoRecordingPermanentlyUnavailable_exists?: InputMaybe<Scalars['Boolean']>;
  videoRecordingPermanentlyUnavailable_not?: InputMaybe<Scalars['Boolean']>;
  videoRecordingUpdatedAt?: InputMaybe<Scalars['DateTime']>;
  videoRecordingUpdatedAt_exists?: InputMaybe<Scalars['Boolean']>;
  videoRecordingUpdatedAt_gt?: InputMaybe<Scalars['DateTime']>;
  videoRecordingUpdatedAt_gte?: InputMaybe<Scalars['DateTime']>;
  videoRecordingUpdatedAt_in?: InputMaybe<
    Array<InputMaybe<Scalars['DateTime']>>
  >;
  videoRecordingUpdatedAt_lt?: InputMaybe<Scalars['DateTime']>;
  videoRecordingUpdatedAt_lte?: InputMaybe<Scalars['DateTime']>;
  videoRecordingUpdatedAt_not?: InputMaybe<Scalars['DateTime']>;
  videoRecordingUpdatedAt_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['DateTime']>>
  >;
  videoRecording_contains?: InputMaybe<Scalars['String']>;
  videoRecording_exists?: InputMaybe<Scalars['Boolean']>;
  videoRecording_not_contains?: InputMaybe<Scalars['String']>;
};

export type EventsLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
};

export type EventsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type EventsNotes = {
  json: Scalars['JSON'];
  links: EventsNotesLinks;
};

export type EventsNotesAssets = {
  block: Array<Maybe<Asset>>;
  hyperlink: Array<Maybe<Asset>>;
};

export type EventsNotesEntries = {
  block: Array<Maybe<Entry>>;
  hyperlink: Array<Maybe<Entry>>;
  inline: Array<Maybe<Entry>>;
};

export type EventsNotesLinks = {
  assets: EventsNotesAssets;
  entries: EventsNotesEntries;
};

export enum EventsOrder {
  EndDateTimeZoneAsc = 'endDateTimeZone_ASC',
  EndDateTimeZoneDesc = 'endDateTimeZone_DESC',
  EndDateAsc = 'endDate_ASC',
  EndDateDesc = 'endDate_DESC',
  EventLinkAsc = 'eventLink_ASC',
  EventLinkDesc = 'eventLink_DESC',
  GoogleIdAsc = 'googleId_ASC',
  GoogleIdDesc = 'googleId_DESC',
  HiddenAsc = 'hidden_ASC',
  HiddenDesc = 'hidden_DESC',
  HideMeetingLinkAsc = 'hideMeetingLink_ASC',
  HideMeetingLinkDesc = 'hideMeetingLink_DESC',
  MeetingLinkAsc = 'meetingLink_ASC',
  MeetingLinkDesc = 'meetingLink_DESC',
  MeetingMaterialsPermanentlyUnavailableAsc = 'meetingMaterialsPermanentlyUnavailable_ASC',
  MeetingMaterialsPermanentlyUnavailableDesc = 'meetingMaterialsPermanentlyUnavailable_DESC',
  NotesPermanentlyUnavailableAsc = 'notesPermanentlyUnavailable_ASC',
  NotesPermanentlyUnavailableDesc = 'notesPermanentlyUnavailable_DESC',
  NotesUpdatedAtAsc = 'notesUpdatedAt_ASC',
  NotesUpdatedAtDesc = 'notesUpdatedAt_DESC',
  PresentationPermanentlyUnavailableAsc = 'presentationPermanentlyUnavailable_ASC',
  PresentationPermanentlyUnavailableDesc = 'presentationPermanentlyUnavailable_DESC',
  PresentationUpdatedAtAsc = 'presentationUpdatedAt_ASC',
  PresentationUpdatedAtDesc = 'presentationUpdatedAt_DESC',
  StartDateTimeZoneAsc = 'startDateTimeZone_ASC',
  StartDateTimeZoneDesc = 'startDateTimeZone_DESC',
  StartDateAsc = 'startDate_ASC',
  StartDateDesc = 'startDate_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  VideoRecordingPermanentlyUnavailableAsc = 'videoRecordingPermanentlyUnavailable_ASC',
  VideoRecordingPermanentlyUnavailableDesc = 'videoRecordingPermanentlyUnavailable_DESC',
  VideoRecordingUpdatedAtAsc = 'videoRecordingUpdatedAt_ASC',
  VideoRecordingUpdatedAtDesc = 'videoRecordingUpdatedAt_DESC',
}

export type EventsPresentation = {
  json: Scalars['JSON'];
  links: EventsPresentationLinks;
};

export type EventsPresentationAssets = {
  block: Array<Maybe<Asset>>;
  hyperlink: Array<Maybe<Asset>>;
};

export type EventsPresentationEntries = {
  block: Array<Maybe<Entry>>;
  hyperlink: Array<Maybe<Entry>>;
  inline: Array<Maybe<Entry>>;
};

export type EventsPresentationLinks = {
  assets: EventsPresentationAssets;
  entries: EventsPresentationEntries;
};

export type EventsSpeakersCollection = {
  items: Array<Maybe<EventSpeakers>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum EventsSpeakersCollectionOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type EventsVideoRecording = {
  json: Scalars['JSON'];
  links: EventsVideoRecordingLinks;
};

export type EventsVideoRecordingAssets = {
  block: Array<Maybe<Asset>>;
  hyperlink: Array<Maybe<Asset>>;
};

export type EventsVideoRecordingEntries = {
  block: Array<Maybe<Entry>>;
  hyperlink: Array<Maybe<Entry>>;
  inline: Array<Maybe<Entry>>;
};

export type EventsVideoRecordingLinks = {
  assets: EventsVideoRecordingAssets;
  entries: EventsVideoRecordingEntries;
};

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
  eventSpeakersCollection?: Maybe<EventSpeakersCollection>;
  outputsCollection?: Maybe<OutputsCollection>;
};

export type ExternalUsersLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type ExternalUsersLinkingCollectionsEventSpeakersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<
      InputMaybe<ExternalUsersLinkingCollectionsEventSpeakersCollectionOrder>
    >
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type ExternalUsersLinkingCollectionsOutputsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<ExternalUsersLinkingCollectionsOutputsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum ExternalUsersLinkingCollectionsEventSpeakersCollectionOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export enum ExternalUsersLinkingCollectionsOutputsCollectionOrder {
  AddedDateAsc = 'addedDate_ASC',
  AddedDateDesc = 'addedDate_DESC',
  AdminNotesAsc = 'adminNotes_ASC',
  AdminNotesDesc = 'adminNotes_DESC',
  DocumentTypeAsc = 'documentType_ASC',
  DocumentTypeDesc = 'documentType_DESC',
  LastUpdatedPartialAsc = 'lastUpdatedPartial_ASC',
  LastUpdatedPartialDesc = 'lastUpdatedPartial_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  PublishDateAsc = 'publishDate_ASC',
  PublishDateDesc = 'publishDate_DESC',
  SubtypeAsc = 'subtype_ASC',
  SubtypeDesc = 'subtype_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
}

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

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/latestStats) */
export type LatestStats = Entry & {
  articleCount?: Maybe<Scalars['Int']>;
  cohortCount?: Maybe<Scalars['Int']>;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<LatestStatsLinkingCollections>;
  sampleCount?: Maybe<Scalars['Int']>;
  sys: Sys;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/latestStats) */
export type LatestStatsArticleCountArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/latestStats) */
export type LatestStatsCohortCountArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/latestStats) */
export type LatestStatsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/latestStats) */
export type LatestStatsSampleCountArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type LatestStatsCollection = {
  items: Array<Maybe<LatestStats>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type LatestStatsFilter = {
  AND?: InputMaybe<Array<InputMaybe<LatestStatsFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<LatestStatsFilter>>>;
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
  sampleCount?: InputMaybe<Scalars['Int']>;
  sampleCount_exists?: InputMaybe<Scalars['Boolean']>;
  sampleCount_gt?: InputMaybe<Scalars['Int']>;
  sampleCount_gte?: InputMaybe<Scalars['Int']>;
  sampleCount_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  sampleCount_lt?: InputMaybe<Scalars['Int']>;
  sampleCount_lte?: InputMaybe<Scalars['Int']>;
  sampleCount_not?: InputMaybe<Scalars['Int']>;
  sampleCount_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  sys?: InputMaybe<SysFilter>;
};

export type LatestStatsLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
};

export type LatestStatsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum LatestStatsOrder {
  ArticleCountAsc = 'articleCount_ASC',
  ArticleCountDesc = 'articleCount_DESC',
  CohortCountAsc = 'cohortCount_ASC',
  CohortCountDesc = 'cohortCount_DESC',
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

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/milestones) */
export type Milestones = Entry & {
  contentfulMetadata: ContentfulMetadata;
  description?: Maybe<Scalars['String']>;
  externalLink?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<MilestonesLinkingCollections>;
  status?: Maybe<Scalars['String']>;
  sys: Sys;
  title?: Maybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/milestones) */
export type MilestonesDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/milestones) */
export type MilestonesExternalLinkArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/milestones) */
export type MilestonesLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/milestones) */
export type MilestonesStatusArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/milestones) */
export type MilestonesTitleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type MilestonesCollection = {
  items: Array<Maybe<Milestones>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type MilestonesFilter = {
  AND?: InputMaybe<Array<InputMaybe<MilestonesFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<MilestonesFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_exists?: InputMaybe<Scalars['Boolean']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  externalLink?: InputMaybe<Scalars['String']>;
  externalLink_contains?: InputMaybe<Scalars['String']>;
  externalLink_exists?: InputMaybe<Scalars['Boolean']>;
  externalLink_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  externalLink_not?: InputMaybe<Scalars['String']>;
  externalLink_not_contains?: InputMaybe<Scalars['String']>;
  externalLink_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  status?: InputMaybe<Scalars['String']>;
  status_contains?: InputMaybe<Scalars['String']>;
  status_exists?: InputMaybe<Scalars['Boolean']>;
  status_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  status_not?: InputMaybe<Scalars['String']>;
  status_not_contains?: InputMaybe<Scalars['String']>;
  status_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type MilestonesLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
  projectsCollection?: Maybe<ProjectsCollection>;
  workingGroupsCollection?: Maybe<WorkingGroupsCollection>;
};

export type MilestonesLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type MilestonesLinkingCollectionsProjectsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<MilestonesLinkingCollectionsProjectsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type MilestonesLinkingCollectionsWorkingGroupsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<MilestonesLinkingCollectionsWorkingGroupsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum MilestonesLinkingCollectionsProjectsCollectionOrder {
  EndDateAsc = 'endDate_ASC',
  EndDateDesc = 'endDate_DESC',
  LeadEmailAsc = 'leadEmail_ASC',
  LeadEmailDesc = 'leadEmail_DESC',
  OpportunitiesLinkAsc = 'opportunitiesLink_ASC',
  OpportunitiesLinkDesc = 'opportunitiesLink_DESC',
  PmEmailAsc = 'pmEmail_ASC',
  PmEmailDesc = 'pmEmail_DESC',
  ProjectProposalAsc = 'projectProposal_ASC',
  ProjectProposalDesc = 'projectProposal_DESC',
  StartDateAsc = 'startDate_ASC',
  StartDateDesc = 'startDate_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TraineeProjectAsc = 'traineeProject_ASC',
  TraineeProjectDesc = 'traineeProject_DESC',
}

export enum MilestonesLinkingCollectionsWorkingGroupsCollectionOrder {
  LeadingMembersAsc = 'leadingMembers_ASC',
  LeadingMembersDesc = 'leadingMembers_DESC',
  PrimaryEmailAsc = 'primaryEmail_ASC',
  PrimaryEmailDesc = 'primaryEmail_DESC',
  SecondaryEmailAsc = 'secondaryEmail_ASC',
  SecondaryEmailDesc = 'secondaryEmail_DESC',
  ShortDescriptionAsc = 'shortDescription_ASC',
  ShortDescriptionDesc = 'shortDescription_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export enum MilestonesOrder {
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  ExternalLinkAsc = 'externalLink_ASC',
  ExternalLinkDesc = 'externalLink_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
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

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type Outputs = Entry & {
  addedDate?: Maybe<Scalars['DateTime']>;
  adminNotes?: Maybe<Scalars['String']>;
  authorsCollection?: Maybe<OutputsAuthorsCollection>;
  contentfulMetadata: ContentfulMetadata;
  createdBy?: Maybe<Users>;
  documentType?: Maybe<Scalars['String']>;
  lastUpdatedPartial?: Maybe<Scalars['DateTime']>;
  link?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<OutputsLinkingCollections>;
  publishDate?: Maybe<Scalars['DateTime']>;
  relatedEntity?: Maybe<OutputsRelatedEntity>;
  subtype?: Maybe<Scalars['String']>;
  sys: Sys;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Users>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsAddedDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsAdminNotesArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsAuthorsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsCreatedByArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsDocumentTypeArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsLastUpdatedPartialArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsLinkArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsPublishDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsRelatedEntityArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsSubtypeArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsTitleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsTypeArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsUpdatedByArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type OutputsAuthorsCollection = {
  items: Array<Maybe<OutputsAuthorsItem>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type OutputsAuthorsItem = ExternalUsers | Users;

export type OutputsCollection = {
  items: Array<Maybe<Outputs>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type OutputsFilter = {
  AND?: InputMaybe<Array<InputMaybe<OutputsFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<OutputsFilter>>>;
  addedDate?: InputMaybe<Scalars['DateTime']>;
  addedDate_exists?: InputMaybe<Scalars['Boolean']>;
  addedDate_gt?: InputMaybe<Scalars['DateTime']>;
  addedDate_gte?: InputMaybe<Scalars['DateTime']>;
  addedDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  addedDate_lt?: InputMaybe<Scalars['DateTime']>;
  addedDate_lte?: InputMaybe<Scalars['DateTime']>;
  addedDate_not?: InputMaybe<Scalars['DateTime']>;
  addedDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  adminNotes?: InputMaybe<Scalars['String']>;
  adminNotes_contains?: InputMaybe<Scalars['String']>;
  adminNotes_exists?: InputMaybe<Scalars['Boolean']>;
  adminNotes_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  adminNotes_not?: InputMaybe<Scalars['String']>;
  adminNotes_not_contains?: InputMaybe<Scalars['String']>;
  adminNotes_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  authorsCollection_exists?: InputMaybe<Scalars['Boolean']>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  createdBy?: InputMaybe<CfUsersNestedFilter>;
  createdBy_exists?: InputMaybe<Scalars['Boolean']>;
  documentType?: InputMaybe<Scalars['String']>;
  documentType_contains?: InputMaybe<Scalars['String']>;
  documentType_exists?: InputMaybe<Scalars['Boolean']>;
  documentType_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  documentType_not?: InputMaybe<Scalars['String']>;
  documentType_not_contains?: InputMaybe<Scalars['String']>;
  documentType_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  lastUpdatedPartial?: InputMaybe<Scalars['DateTime']>;
  lastUpdatedPartial_exists?: InputMaybe<Scalars['Boolean']>;
  lastUpdatedPartial_gt?: InputMaybe<Scalars['DateTime']>;
  lastUpdatedPartial_gte?: InputMaybe<Scalars['DateTime']>;
  lastUpdatedPartial_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  lastUpdatedPartial_lt?: InputMaybe<Scalars['DateTime']>;
  lastUpdatedPartial_lte?: InputMaybe<Scalars['DateTime']>;
  lastUpdatedPartial_not?: InputMaybe<Scalars['DateTime']>;
  lastUpdatedPartial_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['DateTime']>>
  >;
  link?: InputMaybe<Scalars['String']>;
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
  relatedEntity_exists?: InputMaybe<Scalars['Boolean']>;
  subtype?: InputMaybe<Scalars['String']>;
  subtype_contains?: InputMaybe<Scalars['String']>;
  subtype_exists?: InputMaybe<Scalars['Boolean']>;
  subtype_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  subtype_not?: InputMaybe<Scalars['String']>;
  subtype_not_contains?: InputMaybe<Scalars['String']>;
  subtype_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  type?: InputMaybe<Scalars['String']>;
  type_contains?: InputMaybe<Scalars['String']>;
  type_exists?: InputMaybe<Scalars['Boolean']>;
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  type_not?: InputMaybe<Scalars['String']>;
  type_not_contains?: InputMaybe<Scalars['String']>;
  type_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  updatedBy?: InputMaybe<CfUsersNestedFilter>;
  updatedBy_exists?: InputMaybe<Scalars['Boolean']>;
};

export type OutputsLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
};

export type OutputsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum OutputsOrder {
  AddedDateAsc = 'addedDate_ASC',
  AddedDateDesc = 'addedDate_DESC',
  AdminNotesAsc = 'adminNotes_ASC',
  AdminNotesDesc = 'adminNotes_DESC',
  DocumentTypeAsc = 'documentType_ASC',
  DocumentTypeDesc = 'documentType_DESC',
  LastUpdatedPartialAsc = 'lastUpdatedPartial_ASC',
  LastUpdatedPartialDesc = 'lastUpdatedPartial_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  PublishDateAsc = 'publishDate_ASC',
  PublishDateDesc = 'publishDate_DESC',
  SubtypeAsc = 'subtype_ASC',
  SubtypeDesc = 'subtype_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
}

export type OutputsRelatedEntity = Projects | WorkingGroups;

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

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/projectMembership) */
export type ProjectMembership = Entry & {
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<ProjectMembershipLinkingCollections>;
  role?: Maybe<Scalars['String']>;
  sys: Sys;
  user?: Maybe<Users>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/projectMembership) */
export type ProjectMembershipLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/projectMembership) */
export type ProjectMembershipRoleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/projectMembership) */
export type ProjectMembershipUserArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type ProjectMembershipCollection = {
  items: Array<Maybe<ProjectMembership>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type ProjectMembershipFilter = {
  AND?: InputMaybe<Array<InputMaybe<ProjectMembershipFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<ProjectMembershipFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  role?: InputMaybe<Scalars['String']>;
  role_contains?: InputMaybe<Scalars['String']>;
  role_exists?: InputMaybe<Scalars['Boolean']>;
  role_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  role_not?: InputMaybe<Scalars['String']>;
  role_not_contains?: InputMaybe<Scalars['String']>;
  role_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  user?: InputMaybe<CfUsersNestedFilter>;
  user_exists?: InputMaybe<Scalars['Boolean']>;
};

export type ProjectMembershipLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
  projectsCollection?: Maybe<ProjectsCollection>;
};

export type ProjectMembershipLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type ProjectMembershipLinkingCollectionsProjectsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<
      InputMaybe<ProjectMembershipLinkingCollectionsProjectsCollectionOrder>
    >
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum ProjectMembershipLinkingCollectionsProjectsCollectionOrder {
  EndDateAsc = 'endDate_ASC',
  EndDateDesc = 'endDate_DESC',
  LeadEmailAsc = 'leadEmail_ASC',
  LeadEmailDesc = 'leadEmail_DESC',
  OpportunitiesLinkAsc = 'opportunitiesLink_ASC',
  OpportunitiesLinkDesc = 'opportunitiesLink_DESC',
  PmEmailAsc = 'pmEmail_ASC',
  PmEmailDesc = 'pmEmail_DESC',
  ProjectProposalAsc = 'projectProposal_ASC',
  ProjectProposalDesc = 'projectProposal_DESC',
  StartDateAsc = 'startDate_ASC',
  StartDateDesc = 'startDate_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TraineeProjectAsc = 'traineeProject_ASC',
  TraineeProjectDesc = 'traineeProject_DESC',
}

export enum ProjectMembershipOrder {
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
}

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/projects) */
export type Projects = Entry & {
  calendar?: Maybe<Calendars>;
  contentfulMetadata: ContentfulMetadata;
  description?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['DateTime']>;
  keywords?: Maybe<Array<Maybe<Scalars['String']>>>;
  leadEmail?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<ProjectsLinkingCollections>;
  membersCollection?: Maybe<ProjectsMembersCollection>;
  milestonesCollection?: Maybe<ProjectsMilestonesCollection>;
  opportunitiesLink?: Maybe<Scalars['String']>;
  pmEmail?: Maybe<Scalars['String']>;
  projectProposal?: Maybe<Scalars['String']>;
  resourcesCollection?: Maybe<ProjectsResourcesCollection>;
  startDate?: Maybe<Scalars['DateTime']>;
  status?: Maybe<Scalars['String']>;
  sys: Sys;
  title?: Maybe<Scalars['String']>;
  traineeProject?: Maybe<Scalars['Boolean']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/projects) */
export type ProjectsCalendarArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/projects) */
export type ProjectsDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/projects) */
export type ProjectsEndDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/projects) */
export type ProjectsKeywordsArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/projects) */
export type ProjectsLeadEmailArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/projects) */
export type ProjectsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/projects) */
export type ProjectsMembersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<ProjectsMembersCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ProjectMembershipFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/projects) */
export type ProjectsMilestonesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<ProjectsMilestonesCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<MilestonesFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/projects) */
export type ProjectsOpportunitiesLinkArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/projects) */
export type ProjectsPmEmailArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/projects) */
export type ProjectsProjectProposalArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/projects) */
export type ProjectsResourcesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<ProjectsResourcesCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ResourcesFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/projects) */
export type ProjectsStartDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/projects) */
export type ProjectsStatusArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/projects) */
export type ProjectsTitleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/projects) */
export type ProjectsTraineeProjectArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type ProjectsCollection = {
  items: Array<Maybe<Projects>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type ProjectsFilter = {
  AND?: InputMaybe<Array<InputMaybe<ProjectsFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<ProjectsFilter>>>;
  calendar?: InputMaybe<CfCalendarsNestedFilter>;
  calendar_exists?: InputMaybe<Scalars['Boolean']>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_exists?: InputMaybe<Scalars['Boolean']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  endDate_exists?: InputMaybe<Scalars['Boolean']>;
  endDate_gt?: InputMaybe<Scalars['DateTime']>;
  endDate_gte?: InputMaybe<Scalars['DateTime']>;
  endDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  endDate_lt?: InputMaybe<Scalars['DateTime']>;
  endDate_lte?: InputMaybe<Scalars['DateTime']>;
  endDate_not?: InputMaybe<Scalars['DateTime']>;
  endDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  keywords_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  keywords_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  keywords_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  keywords_exists?: InputMaybe<Scalars['Boolean']>;
  leadEmail?: InputMaybe<Scalars['String']>;
  leadEmail_contains?: InputMaybe<Scalars['String']>;
  leadEmail_exists?: InputMaybe<Scalars['Boolean']>;
  leadEmail_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  leadEmail_not?: InputMaybe<Scalars['String']>;
  leadEmail_not_contains?: InputMaybe<Scalars['String']>;
  leadEmail_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  members?: InputMaybe<CfProjectMembershipNestedFilter>;
  membersCollection_exists?: InputMaybe<Scalars['Boolean']>;
  milestones?: InputMaybe<CfMilestonesNestedFilter>;
  milestonesCollection_exists?: InputMaybe<Scalars['Boolean']>;
  opportunitiesLink?: InputMaybe<Scalars['String']>;
  opportunitiesLink_contains?: InputMaybe<Scalars['String']>;
  opportunitiesLink_exists?: InputMaybe<Scalars['Boolean']>;
  opportunitiesLink_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  opportunitiesLink_not?: InputMaybe<Scalars['String']>;
  opportunitiesLink_not_contains?: InputMaybe<Scalars['String']>;
  opportunitiesLink_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  pmEmail?: InputMaybe<Scalars['String']>;
  pmEmail_contains?: InputMaybe<Scalars['String']>;
  pmEmail_exists?: InputMaybe<Scalars['Boolean']>;
  pmEmail_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  pmEmail_not?: InputMaybe<Scalars['String']>;
  pmEmail_not_contains?: InputMaybe<Scalars['String']>;
  pmEmail_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  projectProposal?: InputMaybe<Scalars['String']>;
  projectProposal_contains?: InputMaybe<Scalars['String']>;
  projectProposal_exists?: InputMaybe<Scalars['Boolean']>;
  projectProposal_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  projectProposal_not?: InputMaybe<Scalars['String']>;
  projectProposal_not_contains?: InputMaybe<Scalars['String']>;
  projectProposal_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  resources?: InputMaybe<CfResourcesNestedFilter>;
  resourcesCollection_exists?: InputMaybe<Scalars['Boolean']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  startDate_exists?: InputMaybe<Scalars['Boolean']>;
  startDate_gt?: InputMaybe<Scalars['DateTime']>;
  startDate_gte?: InputMaybe<Scalars['DateTime']>;
  startDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  startDate_lt?: InputMaybe<Scalars['DateTime']>;
  startDate_lte?: InputMaybe<Scalars['DateTime']>;
  startDate_not?: InputMaybe<Scalars['DateTime']>;
  startDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  status?: InputMaybe<Scalars['String']>;
  status_contains?: InputMaybe<Scalars['String']>;
  status_exists?: InputMaybe<Scalars['Boolean']>;
  status_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  status_not?: InputMaybe<Scalars['String']>;
  status_not_contains?: InputMaybe<Scalars['String']>;
  status_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  traineeProject?: InputMaybe<Scalars['Boolean']>;
  traineeProject_exists?: InputMaybe<Scalars['Boolean']>;
  traineeProject_not?: InputMaybe<Scalars['Boolean']>;
};

export type ProjectsLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
  outputsCollection?: Maybe<OutputsCollection>;
};

export type ProjectsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type ProjectsLinkingCollectionsOutputsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<ProjectsLinkingCollectionsOutputsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum ProjectsLinkingCollectionsOutputsCollectionOrder {
  AddedDateAsc = 'addedDate_ASC',
  AddedDateDesc = 'addedDate_DESC',
  AdminNotesAsc = 'adminNotes_ASC',
  AdminNotesDesc = 'adminNotes_DESC',
  DocumentTypeAsc = 'documentType_ASC',
  DocumentTypeDesc = 'documentType_DESC',
  LastUpdatedPartialAsc = 'lastUpdatedPartial_ASC',
  LastUpdatedPartialDesc = 'lastUpdatedPartial_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  PublishDateAsc = 'publishDate_ASC',
  PublishDateDesc = 'publishDate_DESC',
  SubtypeAsc = 'subtype_ASC',
  SubtypeDesc = 'subtype_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
}

export type ProjectsMembersCollection = {
  items: Array<Maybe<ProjectMembership>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum ProjectsMembersCollectionOrder {
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
}

export type ProjectsMilestonesCollection = {
  items: Array<Maybe<Milestones>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum ProjectsMilestonesCollectionOrder {
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  ExternalLinkAsc = 'externalLink_ASC',
  ExternalLinkDesc = 'externalLink_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export enum ProjectsOrder {
  EndDateAsc = 'endDate_ASC',
  EndDateDesc = 'endDate_DESC',
  LeadEmailAsc = 'leadEmail_ASC',
  LeadEmailDesc = 'leadEmail_DESC',
  OpportunitiesLinkAsc = 'opportunitiesLink_ASC',
  OpportunitiesLinkDesc = 'opportunitiesLink_DESC',
  PmEmailAsc = 'pmEmail_ASC',
  PmEmailDesc = 'pmEmail_DESC',
  ProjectProposalAsc = 'projectProposal_ASC',
  ProjectProposalDesc = 'projectProposal_DESC',
  StartDateAsc = 'startDate_ASC',
  StartDateDesc = 'startDate_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TraineeProjectAsc = 'traineeProject_ASC',
  TraineeProjectDesc = 'traineeProject_DESC',
}

export type ProjectsResourcesCollection = {
  items: Array<Maybe<Resources>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum ProjectsResourcesCollectionOrder {
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  ExternalLinkAsc = 'externalLink_ASC',
  ExternalLinkDesc = 'externalLink_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
}

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
  eventSpeakers?: Maybe<EventSpeakers>;
  eventSpeakersCollection?: Maybe<EventSpeakersCollection>;
  events?: Maybe<Events>;
  eventsCollection?: Maybe<EventsCollection>;
  externalUsers?: Maybe<ExternalUsers>;
  externalUsersCollection?: Maybe<ExternalUsersCollection>;
  latestStats?: Maybe<LatestStats>;
  latestStatsCollection?: Maybe<LatestStatsCollection>;
  media?: Maybe<Media>;
  mediaCollection?: Maybe<MediaCollection>;
  migration?: Maybe<Migration>;
  migrationCollection?: Maybe<MigrationCollection>;
  milestones?: Maybe<Milestones>;
  milestonesCollection?: Maybe<MilestonesCollection>;
  news?: Maybe<News>;
  newsCollection?: Maybe<NewsCollection>;
  outputs?: Maybe<Outputs>;
  outputsCollection?: Maybe<OutputsCollection>;
  pages?: Maybe<Pages>;
  pagesCollection?: Maybe<PagesCollection>;
  projectMembership?: Maybe<ProjectMembership>;
  projectMembershipCollection?: Maybe<ProjectMembershipCollection>;
  projects?: Maybe<Projects>;
  projectsCollection?: Maybe<ProjectsCollection>;
  resources?: Maybe<Resources>;
  resourcesCollection?: Maybe<ResourcesCollection>;
  users?: Maybe<Users>;
  usersCollection?: Maybe<UsersCollection>;
  workingGroupMembership?: Maybe<WorkingGroupMembership>;
  workingGroupMembershipCollection?: Maybe<WorkingGroupMembershipCollection>;
  workingGroupNetwork?: Maybe<WorkingGroupNetwork>;
  workingGroupNetworkCollection?: Maybe<WorkingGroupNetworkCollection>;
  workingGroups?: Maybe<WorkingGroups>;
  workingGroupsCollection?: Maybe<WorkingGroupsCollection>;
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

export type QueryEventSpeakersArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryEventSpeakersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<EventSpeakersOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EventSpeakersFilter>;
};

export type QueryEventsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryEventsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<EventsOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EventsFilter>;
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

export type QueryLatestStatsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryLatestStatsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<LatestStatsOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<LatestStatsFilter>;
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

export type QueryMilestonesArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryMilestonesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<MilestonesOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<MilestonesFilter>;
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

export type QueryOutputsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryOutputsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<OutputsOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<OutputsFilter>;
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

export type QueryProjectMembershipArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryProjectMembershipCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<ProjectMembershipOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ProjectMembershipFilter>;
};

export type QueryProjectsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryProjectsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<ProjectsOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ProjectsFilter>;
};

export type QueryResourcesArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryResourcesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<ResourcesOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ResourcesFilter>;
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

export type QueryWorkingGroupMembershipArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryWorkingGroupMembershipCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<WorkingGroupMembershipOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<WorkingGroupMembershipFilter>;
};

export type QueryWorkingGroupNetworkArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryWorkingGroupNetworkCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<WorkingGroupNetworkOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<WorkingGroupNetworkFilter>;
};

export type QueryWorkingGroupsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryWorkingGroupsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<WorkingGroupsOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<WorkingGroupsFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/resources) */
export type Resources = Entry & {
  contentfulMetadata: ContentfulMetadata;
  description?: Maybe<Scalars['String']>;
  externalLink?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<ResourcesLinkingCollections>;
  sys: Sys;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/resources) */
export type ResourcesDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/resources) */
export type ResourcesExternalLinkArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/resources) */
export type ResourcesLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/resources) */
export type ResourcesTitleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/resources) */
export type ResourcesTypeArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type ResourcesCollection = {
  items: Array<Maybe<Resources>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type ResourcesFilter = {
  AND?: InputMaybe<Array<InputMaybe<ResourcesFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<ResourcesFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_exists?: InputMaybe<Scalars['Boolean']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  externalLink?: InputMaybe<Scalars['String']>;
  externalLink_contains?: InputMaybe<Scalars['String']>;
  externalLink_exists?: InputMaybe<Scalars['Boolean']>;
  externalLink_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  externalLink_not?: InputMaybe<Scalars['String']>;
  externalLink_not_contains?: InputMaybe<Scalars['String']>;
  externalLink_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  type?: InputMaybe<Scalars['String']>;
  type_contains?: InputMaybe<Scalars['String']>;
  type_exists?: InputMaybe<Scalars['Boolean']>;
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  type_not?: InputMaybe<Scalars['String']>;
  type_not_contains?: InputMaybe<Scalars['String']>;
  type_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type ResourcesLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
  projectsCollection?: Maybe<ProjectsCollection>;
  workingGroupsCollection?: Maybe<WorkingGroupsCollection>;
};

export type ResourcesLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type ResourcesLinkingCollectionsProjectsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<ResourcesLinkingCollectionsProjectsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type ResourcesLinkingCollectionsWorkingGroupsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<ResourcesLinkingCollectionsWorkingGroupsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum ResourcesLinkingCollectionsProjectsCollectionOrder {
  EndDateAsc = 'endDate_ASC',
  EndDateDesc = 'endDate_DESC',
  LeadEmailAsc = 'leadEmail_ASC',
  LeadEmailDesc = 'leadEmail_DESC',
  OpportunitiesLinkAsc = 'opportunitiesLink_ASC',
  OpportunitiesLinkDesc = 'opportunitiesLink_DESC',
  PmEmailAsc = 'pmEmail_ASC',
  PmEmailDesc = 'pmEmail_DESC',
  ProjectProposalAsc = 'projectProposal_ASC',
  ProjectProposalDesc = 'projectProposal_DESC',
  StartDateAsc = 'startDate_ASC',
  StartDateDesc = 'startDate_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TraineeProjectAsc = 'traineeProject_ASC',
  TraineeProjectDesc = 'traineeProject_DESC',
}

export enum ResourcesLinkingCollectionsWorkingGroupsCollectionOrder {
  LeadingMembersAsc = 'leadingMembers_ASC',
  LeadingMembersDesc = 'leadingMembers_DESC',
  PrimaryEmailAsc = 'primaryEmail_ASC',
  PrimaryEmailDesc = 'primaryEmail_DESC',
  SecondaryEmailAsc = 'secondaryEmail_ASC',
  SecondaryEmailDesc = 'secondaryEmail_DESC',
  ShortDescriptionAsc = 'shortDescription_ASC',
  ShortDescriptionDesc = 'shortDescription_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export enum ResourcesOrder {
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  ExternalLinkAsc = 'externalLink_ASC',
  ExternalLinkDesc = 'externalLink_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
}

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
  degrees?: Maybe<Array<Maybe<Scalars['String']>>>;
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
  positions?: Maybe<Scalars['JSON']>;
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
  order?: InputMaybe<
    Array<InputMaybe<UsersContributingCohortsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ContributingCohortsMembershipFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersCountryArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersDegreesArgs = {
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
export type UsersPositionsArgs = {
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

export enum UsersContributingCohortsCollectionOrder {
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
  degrees_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  degrees_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  degrees_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  degrees_exists?: InputMaybe<Scalars['Boolean']>;
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
  positions_exists?: InputMaybe<Scalars['Boolean']>;
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
  eventSpeakersCollection?: Maybe<EventSpeakersCollection>;
  outputsCollection?: Maybe<OutputsCollection>;
  projectMembershipCollection?: Maybe<ProjectMembershipCollection>;
  workingGroupMembershipCollection?: Maybe<WorkingGroupMembershipCollection>;
};

export type UsersLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type UsersLinkingCollectionsEventSpeakersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<UsersLinkingCollectionsEventSpeakersCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type UsersLinkingCollectionsOutputsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<UsersLinkingCollectionsOutputsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type UsersLinkingCollectionsProjectMembershipCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<UsersLinkingCollectionsProjectMembershipCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type UsersLinkingCollectionsWorkingGroupMembershipCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<
      InputMaybe<UsersLinkingCollectionsWorkingGroupMembershipCollectionOrder>
    >
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum UsersLinkingCollectionsEventSpeakersCollectionOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export enum UsersLinkingCollectionsOutputsCollectionOrder {
  AddedDateAsc = 'addedDate_ASC',
  AddedDateDesc = 'addedDate_DESC',
  AdminNotesAsc = 'adminNotes_ASC',
  AdminNotesDesc = 'adminNotes_DESC',
  DocumentTypeAsc = 'documentType_ASC',
  DocumentTypeDesc = 'documentType_DESC',
  LastUpdatedPartialAsc = 'lastUpdatedPartial_ASC',
  LastUpdatedPartialDesc = 'lastUpdatedPartial_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  PublishDateAsc = 'publishDate_ASC',
  PublishDateDesc = 'publishDate_DESC',
  SubtypeAsc = 'subtype_ASC',
  SubtypeDesc = 'subtype_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
}

export enum UsersLinkingCollectionsProjectMembershipCollectionOrder {
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
}

export enum UsersLinkingCollectionsWorkingGroupMembershipCollectionOrder {
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
}

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

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroupMembership) */
export type WorkingGroupMembership = Entry & {
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<WorkingGroupMembershipLinkingCollections>;
  role?: Maybe<Scalars['String']>;
  sys: Sys;
  user?: Maybe<Users>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroupMembership) */
export type WorkingGroupMembershipLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroupMembership) */
export type WorkingGroupMembershipRoleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroupMembership) */
export type WorkingGroupMembershipUserArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type WorkingGroupMembershipCollection = {
  items: Array<Maybe<WorkingGroupMembership>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type WorkingGroupMembershipFilter = {
  AND?: InputMaybe<Array<InputMaybe<WorkingGroupMembershipFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<WorkingGroupMembershipFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  role?: InputMaybe<Scalars['String']>;
  role_contains?: InputMaybe<Scalars['String']>;
  role_exists?: InputMaybe<Scalars['Boolean']>;
  role_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  role_not?: InputMaybe<Scalars['String']>;
  role_not_contains?: InputMaybe<Scalars['String']>;
  role_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  user?: InputMaybe<CfUsersNestedFilter>;
  user_exists?: InputMaybe<Scalars['Boolean']>;
};

export type WorkingGroupMembershipLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
  workingGroupsCollection?: Maybe<WorkingGroupsCollection>;
};

export type WorkingGroupMembershipLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type WorkingGroupMembershipLinkingCollectionsWorkingGroupsCollectionArgs =
  {
    limit?: InputMaybe<Scalars['Int']>;
    locale?: InputMaybe<Scalars['String']>;
    order?: InputMaybe<
      Array<
        InputMaybe<WorkingGroupMembershipLinkingCollectionsWorkingGroupsCollectionOrder>
      >
    >;
    preview?: InputMaybe<Scalars['Boolean']>;
    skip?: InputMaybe<Scalars['Int']>;
  };

export enum WorkingGroupMembershipLinkingCollectionsWorkingGroupsCollectionOrder {
  LeadingMembersAsc = 'leadingMembers_ASC',
  LeadingMembersDesc = 'leadingMembers_DESC',
  PrimaryEmailAsc = 'primaryEmail_ASC',
  PrimaryEmailDesc = 'primaryEmail_DESC',
  SecondaryEmailAsc = 'secondaryEmail_ASC',
  SecondaryEmailDesc = 'secondaryEmail_DESC',
  ShortDescriptionAsc = 'shortDescription_ASC',
  ShortDescriptionDesc = 'shortDescription_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export enum WorkingGroupMembershipOrder {
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
}

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroupNetwork) */
export type WorkingGroupNetwork = Entry & {
  complexDiseaseCollection?: Maybe<WorkingGroupNetworkComplexDiseaseCollection>;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<WorkingGroupNetworkLinkingCollections>;
  monogenicCollection?: Maybe<WorkingGroupNetworkMonogenicCollection>;
  operationalCollection?: Maybe<WorkingGroupNetworkOperationalCollection>;
  supportCollection?: Maybe<WorkingGroupNetworkSupportCollection>;
  sys: Sys;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroupNetwork) */
export type WorkingGroupNetworkComplexDiseaseCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<WorkingGroupNetworkComplexDiseaseCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<WorkingGroupsFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroupNetwork) */
export type WorkingGroupNetworkLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroupNetwork) */
export type WorkingGroupNetworkMonogenicCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<WorkingGroupNetworkMonogenicCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<WorkingGroupsFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroupNetwork) */
export type WorkingGroupNetworkOperationalCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<WorkingGroupNetworkOperationalCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<WorkingGroupsFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroupNetwork) */
export type WorkingGroupNetworkSupportCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<WorkingGroupNetworkSupportCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<WorkingGroupsFilter>;
};

export type WorkingGroupNetworkCollection = {
  items: Array<Maybe<WorkingGroupNetwork>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type WorkingGroupNetworkComplexDiseaseCollection = {
  items: Array<Maybe<WorkingGroups>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum WorkingGroupNetworkComplexDiseaseCollectionOrder {
  LeadingMembersAsc = 'leadingMembers_ASC',
  LeadingMembersDesc = 'leadingMembers_DESC',
  PrimaryEmailAsc = 'primaryEmail_ASC',
  PrimaryEmailDesc = 'primaryEmail_DESC',
  SecondaryEmailAsc = 'secondaryEmail_ASC',
  SecondaryEmailDesc = 'secondaryEmail_DESC',
  ShortDescriptionAsc = 'shortDescription_ASC',
  ShortDescriptionDesc = 'shortDescription_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type WorkingGroupNetworkFilter = {
  AND?: InputMaybe<Array<InputMaybe<WorkingGroupNetworkFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<WorkingGroupNetworkFilter>>>;
  complexDisease?: InputMaybe<CfWorkingGroupsNestedFilter>;
  complexDiseaseCollection_exists?: InputMaybe<Scalars['Boolean']>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  monogenic?: InputMaybe<CfWorkingGroupsNestedFilter>;
  monogenicCollection_exists?: InputMaybe<Scalars['Boolean']>;
  operational?: InputMaybe<CfWorkingGroupsNestedFilter>;
  operationalCollection_exists?: InputMaybe<Scalars['Boolean']>;
  support?: InputMaybe<CfWorkingGroupsNestedFilter>;
  supportCollection_exists?: InputMaybe<Scalars['Boolean']>;
  sys?: InputMaybe<SysFilter>;
};

export type WorkingGroupNetworkLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
};

export type WorkingGroupNetworkLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type WorkingGroupNetworkMonogenicCollection = {
  items: Array<Maybe<WorkingGroups>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum WorkingGroupNetworkMonogenicCollectionOrder {
  LeadingMembersAsc = 'leadingMembers_ASC',
  LeadingMembersDesc = 'leadingMembers_DESC',
  PrimaryEmailAsc = 'primaryEmail_ASC',
  PrimaryEmailDesc = 'primaryEmail_DESC',
  SecondaryEmailAsc = 'secondaryEmail_ASC',
  SecondaryEmailDesc = 'secondaryEmail_DESC',
  ShortDescriptionAsc = 'shortDescription_ASC',
  ShortDescriptionDesc = 'shortDescription_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type WorkingGroupNetworkOperationalCollection = {
  items: Array<Maybe<WorkingGroups>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum WorkingGroupNetworkOperationalCollectionOrder {
  LeadingMembersAsc = 'leadingMembers_ASC',
  LeadingMembersDesc = 'leadingMembers_DESC',
  PrimaryEmailAsc = 'primaryEmail_ASC',
  PrimaryEmailDesc = 'primaryEmail_DESC',
  SecondaryEmailAsc = 'secondaryEmail_ASC',
  SecondaryEmailDesc = 'secondaryEmail_DESC',
  ShortDescriptionAsc = 'shortDescription_ASC',
  ShortDescriptionDesc = 'shortDescription_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export enum WorkingGroupNetworkOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export type WorkingGroupNetworkSupportCollection = {
  items: Array<Maybe<WorkingGroups>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum WorkingGroupNetworkSupportCollectionOrder {
  LeadingMembersAsc = 'leadingMembers_ASC',
  LeadingMembersDesc = 'leadingMembers_DESC',
  PrimaryEmailAsc = 'primaryEmail_ASC',
  PrimaryEmailDesc = 'primaryEmail_DESC',
  SecondaryEmailAsc = 'secondaryEmail_ASC',
  SecondaryEmailDesc = 'secondaryEmail_DESC',
  ShortDescriptionAsc = 'shortDescription_ASC',
  ShortDescriptionDesc = 'shortDescription_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroups) */
export type WorkingGroups = Entry & {
  calendar?: Maybe<Calendars>;
  contentfulMetadata: ContentfulMetadata;
  description?: Maybe<Scalars['String']>;
  leadingMembers?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<WorkingGroupsLinkingCollections>;
  membersCollection?: Maybe<WorkingGroupsMembersCollection>;
  milestonesCollection?: Maybe<WorkingGroupsMilestonesCollection>;
  primaryEmail?: Maybe<Scalars['String']>;
  resourcesCollection?: Maybe<WorkingGroupsResourcesCollection>;
  secondaryEmail?: Maybe<Scalars['String']>;
  shortDescription?: Maybe<Scalars['String']>;
  sys: Sys;
  title?: Maybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroups) */
export type WorkingGroupsCalendarArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroups) */
export type WorkingGroupsDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroups) */
export type WorkingGroupsLeadingMembersArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroups) */
export type WorkingGroupsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroups) */
export type WorkingGroupsMembersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<WorkingGroupsMembersCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<WorkingGroupMembershipFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroups) */
export type WorkingGroupsMilestonesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<WorkingGroupsMilestonesCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<MilestonesFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroups) */
export type WorkingGroupsPrimaryEmailArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroups) */
export type WorkingGroupsResourcesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<WorkingGroupsResourcesCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ResourcesFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroups) */
export type WorkingGroupsSecondaryEmailArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroups) */
export type WorkingGroupsShortDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroups) */
export type WorkingGroupsTitleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type WorkingGroupsCollection = {
  items: Array<Maybe<WorkingGroups>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type WorkingGroupsFilter = {
  AND?: InputMaybe<Array<InputMaybe<WorkingGroupsFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<WorkingGroupsFilter>>>;
  calendar?: InputMaybe<CfCalendarsNestedFilter>;
  calendar_exists?: InputMaybe<Scalars['Boolean']>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_exists?: InputMaybe<Scalars['Boolean']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  leadingMembers?: InputMaybe<Scalars['String']>;
  leadingMembers_contains?: InputMaybe<Scalars['String']>;
  leadingMembers_exists?: InputMaybe<Scalars['Boolean']>;
  leadingMembers_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  leadingMembers_not?: InputMaybe<Scalars['String']>;
  leadingMembers_not_contains?: InputMaybe<Scalars['String']>;
  leadingMembers_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  members?: InputMaybe<CfWorkingGroupMembershipNestedFilter>;
  membersCollection_exists?: InputMaybe<Scalars['Boolean']>;
  milestones?: InputMaybe<CfMilestonesNestedFilter>;
  milestonesCollection_exists?: InputMaybe<Scalars['Boolean']>;
  primaryEmail?: InputMaybe<Scalars['String']>;
  primaryEmail_contains?: InputMaybe<Scalars['String']>;
  primaryEmail_exists?: InputMaybe<Scalars['Boolean']>;
  primaryEmail_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  primaryEmail_not?: InputMaybe<Scalars['String']>;
  primaryEmail_not_contains?: InputMaybe<Scalars['String']>;
  primaryEmail_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  resources?: InputMaybe<CfResourcesNestedFilter>;
  resourcesCollection_exists?: InputMaybe<Scalars['Boolean']>;
  secondaryEmail?: InputMaybe<Scalars['String']>;
  secondaryEmail_contains?: InputMaybe<Scalars['String']>;
  secondaryEmail_exists?: InputMaybe<Scalars['Boolean']>;
  secondaryEmail_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  secondaryEmail_not?: InputMaybe<Scalars['String']>;
  secondaryEmail_not_contains?: InputMaybe<Scalars['String']>;
  secondaryEmail_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  shortDescription?: InputMaybe<Scalars['String']>;
  shortDescription_contains?: InputMaybe<Scalars['String']>;
  shortDescription_exists?: InputMaybe<Scalars['Boolean']>;
  shortDescription_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  shortDescription_not?: InputMaybe<Scalars['String']>;
  shortDescription_not_contains?: InputMaybe<Scalars['String']>;
  shortDescription_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type WorkingGroupsLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
  outputsCollection?: Maybe<OutputsCollection>;
  workingGroupNetworkCollection?: Maybe<WorkingGroupNetworkCollection>;
};

export type WorkingGroupsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type WorkingGroupsLinkingCollectionsOutputsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<WorkingGroupsLinkingCollectionsOutputsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type WorkingGroupsLinkingCollectionsWorkingGroupNetworkCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<
      InputMaybe<WorkingGroupsLinkingCollectionsWorkingGroupNetworkCollectionOrder>
    >
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum WorkingGroupsLinkingCollectionsOutputsCollectionOrder {
  AddedDateAsc = 'addedDate_ASC',
  AddedDateDesc = 'addedDate_DESC',
  AdminNotesAsc = 'adminNotes_ASC',
  AdminNotesDesc = 'adminNotes_DESC',
  DocumentTypeAsc = 'documentType_ASC',
  DocumentTypeDesc = 'documentType_DESC',
  LastUpdatedPartialAsc = 'lastUpdatedPartial_ASC',
  LastUpdatedPartialDesc = 'lastUpdatedPartial_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  PublishDateAsc = 'publishDate_ASC',
  PublishDateDesc = 'publishDate_DESC',
  SubtypeAsc = 'subtype_ASC',
  SubtypeDesc = 'subtype_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
}

export enum WorkingGroupsLinkingCollectionsWorkingGroupNetworkCollectionOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export type WorkingGroupsMembersCollection = {
  items: Array<Maybe<WorkingGroupMembership>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum WorkingGroupsMembersCollectionOrder {
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
}

export type WorkingGroupsMilestonesCollection = {
  items: Array<Maybe<Milestones>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum WorkingGroupsMilestonesCollectionOrder {
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  ExternalLinkAsc = 'externalLink_ASC',
  ExternalLinkDesc = 'externalLink_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export enum WorkingGroupsOrder {
  LeadingMembersAsc = 'leadingMembers_ASC',
  LeadingMembersDesc = 'leadingMembers_DESC',
  PrimaryEmailAsc = 'primaryEmail_ASC',
  PrimaryEmailDesc = 'primaryEmail_DESC',
  SecondaryEmailAsc = 'secondaryEmail_ASC',
  SecondaryEmailDesc = 'secondaryEmail_DESC',
  ShortDescriptionAsc = 'shortDescription_ASC',
  ShortDescriptionDesc = 'shortDescription_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type WorkingGroupsResourcesCollection = {
  items: Array<Maybe<Resources>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum WorkingGroupsResourcesCollectionOrder {
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  ExternalLinkAsc = 'externalLink_ASC',
  ExternalLinkDesc = 'externalLink_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
}

export type CfCalendarsNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfCalendarsNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfCalendarsNestedFilter>>>;
  color?: InputMaybe<Scalars['String']>;
  color_contains?: InputMaybe<Scalars['String']>;
  color_exists?: InputMaybe<Scalars['Boolean']>;
  color_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  color_not?: InputMaybe<Scalars['String']>;
  color_not_contains?: InputMaybe<Scalars['String']>;
  color_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  googleApiMetadata_exists?: InputMaybe<Scalars['Boolean']>;
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
  sys?: InputMaybe<SysFilter>;
};

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

export type CfEventSpeakersNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfEventSpeakersNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfEventSpeakersNestedFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  sys?: InputMaybe<SysFilter>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  user_exists?: InputMaybe<Scalars['Boolean']>;
};

export type CfMilestonesNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfMilestonesNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfMilestonesNestedFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_exists?: InputMaybe<Scalars['Boolean']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  externalLink?: InputMaybe<Scalars['String']>;
  externalLink_contains?: InputMaybe<Scalars['String']>;
  externalLink_exists?: InputMaybe<Scalars['Boolean']>;
  externalLink_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  externalLink_not?: InputMaybe<Scalars['String']>;
  externalLink_not_contains?: InputMaybe<Scalars['String']>;
  externalLink_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  status?: InputMaybe<Scalars['String']>;
  status_contains?: InputMaybe<Scalars['String']>;
  status_exists?: InputMaybe<Scalars['Boolean']>;
  status_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  status_not?: InputMaybe<Scalars['String']>;
  status_not_contains?: InputMaybe<Scalars['String']>;
  status_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CfProjectMembershipNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfProjectMembershipNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfProjectMembershipNestedFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  role?: InputMaybe<Scalars['String']>;
  role_contains?: InputMaybe<Scalars['String']>;
  role_exists?: InputMaybe<Scalars['Boolean']>;
  role_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  role_not?: InputMaybe<Scalars['String']>;
  role_not_contains?: InputMaybe<Scalars['String']>;
  role_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  user_exists?: InputMaybe<Scalars['Boolean']>;
};

export type CfResourcesNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfResourcesNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfResourcesNestedFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_exists?: InputMaybe<Scalars['Boolean']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  externalLink?: InputMaybe<Scalars['String']>;
  externalLink_contains?: InputMaybe<Scalars['String']>;
  externalLink_exists?: InputMaybe<Scalars['Boolean']>;
  externalLink_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  externalLink_not?: InputMaybe<Scalars['String']>;
  externalLink_not_contains?: InputMaybe<Scalars['String']>;
  externalLink_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  type?: InputMaybe<Scalars['String']>;
  type_contains?: InputMaybe<Scalars['String']>;
  type_exists?: InputMaybe<Scalars['Boolean']>;
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  type_not?: InputMaybe<Scalars['String']>;
  type_not_contains?: InputMaybe<Scalars['String']>;
  type_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CfUsersNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfUsersNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfUsersNestedFilter>>>;
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
  contributingCohortsCollection_exists?: InputMaybe<Scalars['Boolean']>;
  country?: InputMaybe<Scalars['String']>;
  country_contains?: InputMaybe<Scalars['String']>;
  country_exists?: InputMaybe<Scalars['Boolean']>;
  country_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  country_not?: InputMaybe<Scalars['String']>;
  country_not_contains?: InputMaybe<Scalars['String']>;
  country_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  degrees_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  degrees_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  degrees_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  degrees_exists?: InputMaybe<Scalars['Boolean']>;
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
  positions_exists?: InputMaybe<Scalars['Boolean']>;
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

export type CfWorkingGroupMembershipNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfWorkingGroupMembershipNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfWorkingGroupMembershipNestedFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  role?: InputMaybe<Scalars['String']>;
  role_contains?: InputMaybe<Scalars['String']>;
  role_exists?: InputMaybe<Scalars['Boolean']>;
  role_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  role_not?: InputMaybe<Scalars['String']>;
  role_not_contains?: InputMaybe<Scalars['String']>;
  role_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  user_exists?: InputMaybe<Scalars['Boolean']>;
};

export type CfWorkingGroupsNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfWorkingGroupsNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfWorkingGroupsNestedFilter>>>;
  calendar_exists?: InputMaybe<Scalars['Boolean']>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_exists?: InputMaybe<Scalars['Boolean']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  leadingMembers?: InputMaybe<Scalars['String']>;
  leadingMembers_contains?: InputMaybe<Scalars['String']>;
  leadingMembers_exists?: InputMaybe<Scalars['Boolean']>;
  leadingMembers_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  leadingMembers_not?: InputMaybe<Scalars['String']>;
  leadingMembers_not_contains?: InputMaybe<Scalars['String']>;
  leadingMembers_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  membersCollection_exists?: InputMaybe<Scalars['Boolean']>;
  milestonesCollection_exists?: InputMaybe<Scalars['Boolean']>;
  primaryEmail?: InputMaybe<Scalars['String']>;
  primaryEmail_contains?: InputMaybe<Scalars['String']>;
  primaryEmail_exists?: InputMaybe<Scalars['Boolean']>;
  primaryEmail_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  primaryEmail_not?: InputMaybe<Scalars['String']>;
  primaryEmail_not_contains?: InputMaybe<Scalars['String']>;
  primaryEmail_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  resourcesCollection_exists?: InputMaybe<Scalars['Boolean']>;
  secondaryEmail?: InputMaybe<Scalars['String']>;
  secondaryEmail_contains?: InputMaybe<Scalars['String']>;
  secondaryEmail_exists?: InputMaybe<Scalars['Boolean']>;
  secondaryEmail_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  secondaryEmail_not?: InputMaybe<Scalars['String']>;
  secondaryEmail_not_contains?: InputMaybe<Scalars['String']>;
  secondaryEmail_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  shortDescription?: InputMaybe<Scalars['String']>;
  shortDescription_contains?: InputMaybe<Scalars['String']>;
  shortDescription_exists?: InputMaybe<Scalars['Boolean']>;
  shortDescription_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  shortDescription_not?: InputMaybe<Scalars['String']>;
  shortDescription_not_contains?: InputMaybe<Scalars['String']>;
  shortDescription_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CalendarsContentDataFragment = Pick<
  Calendars,
  'googleCalendarId' | 'name' | 'color' | 'googleApiMetadata'
> & {
  sys: Pick<
    Sys,
    'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
  >;
  linkedFrom?: Maybe<{
    projectsCollection?: Maybe<{
      items: Array<Maybe<Pick<Projects, 'title'> & { sys: Pick<Sys, 'id'> }>>;
    }>;
    workingGroupsCollection?: Maybe<{
      items: Array<
        Maybe<Pick<WorkingGroups, 'title'> & { sys: Pick<Sys, 'id'> }>
      >;
    }>;
  }>;
};

export type FetchCalendarByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchCalendarByIdQuery = {
  calendars?: Maybe<
    Pick<
      Calendars,
      'googleCalendarId' | 'name' | 'color' | 'googleApiMetadata'
    > & {
      sys: Pick<
        Sys,
        'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
      >;
      linkedFrom?: Maybe<{
        projectsCollection?: Maybe<{
          items: Array<
            Maybe<Pick<Projects, 'title'> & { sys: Pick<Sys, 'id'> }>
          >;
        }>;
        workingGroupsCollection?: Maybe<{
          items: Array<
            Maybe<Pick<WorkingGroups, 'title'> & { sys: Pick<Sys, 'id'> }>
          >;
        }>;
      }>;
    }
  >;
};

export type FetchCalendarsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<
    Array<InputMaybe<CalendarsOrder>> | InputMaybe<CalendarsOrder>
  >;
  where?: InputMaybe<CalendarsFilter>;
}>;

export type FetchCalendarsQuery = {
  calendarsCollection?: Maybe<
    Pick<CalendarsCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<
            Calendars,
            'googleCalendarId' | 'name' | 'color' | 'googleApiMetadata'
          > & {
            sys: Pick<
              Sys,
              'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
            >;
            linkedFrom?: Maybe<{
              projectsCollection?: Maybe<{
                items: Array<
                  Maybe<Pick<Projects, 'title'> & { sys: Pick<Sys, 'id'> }>
                >;
              }>;
              workingGroupsCollection?: Maybe<{
                items: Array<
                  Maybe<Pick<WorkingGroups, 'title'> & { sys: Pick<Sys, 'id'> }>
                >;
              }>;
            }>;
          }
        >
      >;
    }
  >;
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

export type EventsContentDataFragment = Pick<
  Events,
  | 'description'
  | 'endDate'
  | 'endDateTimeZone'
  | 'startDate'
  | 'startDateTimeZone'
  | 'meetingLink'
  | 'hideMeetingLink'
  | 'eventLink'
  | 'status'
  | 'hidden'
  | 'tags'
  | 'title'
  | 'notesPermanentlyUnavailable'
  | 'notesUpdatedAt'
  | 'videoRecordingPermanentlyUnavailable'
  | 'videoRecordingUpdatedAt'
  | 'presentationPermanentlyUnavailable'
  | 'presentationUpdatedAt'
  | 'meetingMaterialsPermanentlyUnavailable'
  | 'meetingMaterials'
> & {
  sys: Pick<Sys, 'id' | 'publishedAt' | 'publishedVersion'>;
  notes?: Maybe<
    Pick<EventsNotes, 'json'> & {
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
              | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ExternalUsers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'LatestStats' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                    sys: Pick<Sys, 'id'>;
                  })
              | ({ __typename: 'Migration' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Milestones' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Outputs' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ProjectMembership' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Projects' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Resources' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'WorkingGroupMembership' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupNetwork' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroups' } & { sys: Pick<Sys, 'id'> })
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
  videoRecording?: Maybe<
    Pick<EventsVideoRecording, 'json'> & {
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
              | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ExternalUsers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'LatestStats' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                    sys: Pick<Sys, 'id'>;
                  })
              | ({ __typename: 'Migration' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Milestones' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Outputs' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ProjectMembership' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Projects' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Resources' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'WorkingGroupMembership' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupNetwork' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroups' } & { sys: Pick<Sys, 'id'> })
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
  presentation?: Maybe<
    Pick<EventsPresentation, 'json'> & {
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
              | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ExternalUsers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'LatestStats' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                    sys: Pick<Sys, 'id'>;
                  })
              | ({ __typename: 'Migration' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Milestones' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Outputs' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ProjectMembership' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Projects' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Resources' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'WorkingGroupMembership' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupNetwork' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroups' } & { sys: Pick<Sys, 'id'> })
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
  calendar?: Maybe<
    Pick<Calendars, 'googleCalendarId' | 'color' | 'name'> & {
      linkedFrom?: Maybe<{
        workingGroupsCollection?: Maybe<{
          items: Array<
            Maybe<Pick<WorkingGroups, 'title'> & { sys: Pick<Sys, 'id'> }>
          >;
        }>;
        projectsCollection?: Maybe<{
          items: Array<
            Maybe<Pick<Projects, 'title'> & { sys: Pick<Sys, 'id'> }>
          >;
        }>;
      }>;
    }
  >;
  thumbnail?: Maybe<Pick<Asset, 'url'>>;
  speakersCollection?: Maybe<{
    items: Array<
      Maybe<
        Pick<EventSpeakers, 'title'> & {
          user?: Maybe<
            | ({ __typename: 'ExternalUsers' } & Pick<
                ExternalUsers,
                'name' | 'orcid'
              > & { sys: Pick<Sys, 'id'> })
            | ({ __typename: 'Users' } & Pick<
                Users,
                'firstName' | 'lastName' | 'onboarded'
              > & { sys: Pick<Sys, 'id'>; avatar?: Maybe<Pick<Asset, 'url'>> })
          >;
        }
      >
    >;
  }>;
};

export type FetchEventByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchEventByIdQuery = {
  events?: Maybe<
    Pick<
      Events,
      | 'description'
      | 'endDate'
      | 'endDateTimeZone'
      | 'startDate'
      | 'startDateTimeZone'
      | 'meetingLink'
      | 'hideMeetingLink'
      | 'eventLink'
      | 'status'
      | 'hidden'
      | 'tags'
      | 'title'
      | 'notesPermanentlyUnavailable'
      | 'notesUpdatedAt'
      | 'videoRecordingPermanentlyUnavailable'
      | 'videoRecordingUpdatedAt'
      | 'presentationPermanentlyUnavailable'
      | 'presentationUpdatedAt'
      | 'meetingMaterialsPermanentlyUnavailable'
      | 'meetingMaterials'
    > & {
      sys: Pick<Sys, 'id' | 'publishedAt' | 'publishedVersion'>;
      notes?: Maybe<
        Pick<EventsNotes, 'json'> & {
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
                  | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ExternalUsers' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'LatestStats' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                        sys: Pick<Sys, 'id'>;
                      })
                  | ({ __typename: 'Migration' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Milestones' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Outputs' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ProjectMembership' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'Projects' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Resources' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'WorkingGroupMembership' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'WorkingGroupNetwork' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'WorkingGroups' } & { sys: Pick<Sys, 'id'> })
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
      videoRecording?: Maybe<
        Pick<EventsVideoRecording, 'json'> & {
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
                  | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ExternalUsers' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'LatestStats' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                        sys: Pick<Sys, 'id'>;
                      })
                  | ({ __typename: 'Migration' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Milestones' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Outputs' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ProjectMembership' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'Projects' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Resources' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'WorkingGroupMembership' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'WorkingGroupNetwork' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'WorkingGroups' } & { sys: Pick<Sys, 'id'> })
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
      presentation?: Maybe<
        Pick<EventsPresentation, 'json'> & {
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
                  | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ExternalUsers' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'LatestStats' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                        sys: Pick<Sys, 'id'>;
                      })
                  | ({ __typename: 'Migration' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Milestones' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Outputs' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ProjectMembership' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'Projects' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Resources' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'WorkingGroupMembership' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'WorkingGroupNetwork' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'WorkingGroups' } & { sys: Pick<Sys, 'id'> })
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
      calendar?: Maybe<
        Pick<Calendars, 'googleCalendarId' | 'color' | 'name'> & {
          linkedFrom?: Maybe<{
            workingGroupsCollection?: Maybe<{
              items: Array<
                Maybe<Pick<WorkingGroups, 'title'> & { sys: Pick<Sys, 'id'> }>
              >;
            }>;
            projectsCollection?: Maybe<{
              items: Array<
                Maybe<Pick<Projects, 'title'> & { sys: Pick<Sys, 'id'> }>
              >;
            }>;
          }>;
        }
      >;
      thumbnail?: Maybe<Pick<Asset, 'url'>>;
      speakersCollection?: Maybe<{
        items: Array<
          Maybe<
            Pick<EventSpeakers, 'title'> & {
              user?: Maybe<
                | ({ __typename: 'ExternalUsers' } & Pick<
                    ExternalUsers,
                    'name' | 'orcid'
                  > & { sys: Pick<Sys, 'id'> })
                | ({ __typename: 'Users' } & Pick<
                    Users,
                    'firstName' | 'lastName' | 'onboarded'
                  > & {
                      sys: Pick<Sys, 'id'>;
                      avatar?: Maybe<Pick<Asset, 'url'>>;
                    })
              >;
            }
          >
        >;
      }>;
    }
  >;
};

export type FetchEventsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Array<InputMaybe<EventsOrder>> | InputMaybe<EventsOrder>>;
  where?: InputMaybe<EventsFilter>;
}>;

export type FetchEventsQuery = {
  eventsCollection?: Maybe<
    Pick<EventsCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<
            Events,
            | 'description'
            | 'endDate'
            | 'endDateTimeZone'
            | 'startDate'
            | 'startDateTimeZone'
            | 'meetingLink'
            | 'hideMeetingLink'
            | 'eventLink'
            | 'status'
            | 'hidden'
            | 'tags'
            | 'title'
            | 'notesPermanentlyUnavailable'
            | 'notesUpdatedAt'
            | 'videoRecordingPermanentlyUnavailable'
            | 'videoRecordingUpdatedAt'
            | 'presentationPermanentlyUnavailable'
            | 'presentationUpdatedAt'
            | 'meetingMaterialsPermanentlyUnavailable'
            | 'meetingMaterials'
          > & {
            sys: Pick<Sys, 'id' | 'publishedAt' | 'publishedVersion'>;
            notes?: Maybe<
              Pick<EventsNotes, 'json'> & {
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
                        | ({ __typename: 'EventSpeakers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ExternalUsers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'LatestStats' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                              sys: Pick<Sys, 'id'>;
                            })
                        | ({ __typename: 'Migration' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Milestones' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Outputs' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ProjectMembership' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Projects' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Resources' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'WorkingGroupMembership' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'WorkingGroupNetwork' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'WorkingGroups' } & {
                            sys: Pick<Sys, 'id'>;
                          })
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
            videoRecording?: Maybe<
              Pick<EventsVideoRecording, 'json'> & {
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
                        | ({ __typename: 'EventSpeakers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ExternalUsers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'LatestStats' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                              sys: Pick<Sys, 'id'>;
                            })
                        | ({ __typename: 'Migration' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Milestones' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Outputs' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ProjectMembership' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Projects' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Resources' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'WorkingGroupMembership' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'WorkingGroupNetwork' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'WorkingGroups' } & {
                            sys: Pick<Sys, 'id'>;
                          })
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
            presentation?: Maybe<
              Pick<EventsPresentation, 'json'> & {
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
                        | ({ __typename: 'EventSpeakers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ExternalUsers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'LatestStats' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                              sys: Pick<Sys, 'id'>;
                            })
                        | ({ __typename: 'Migration' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Milestones' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Outputs' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ProjectMembership' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Projects' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Resources' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'WorkingGroupMembership' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'WorkingGroupNetwork' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'WorkingGroups' } & {
                            sys: Pick<Sys, 'id'>;
                          })
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
            calendar?: Maybe<
              Pick<Calendars, 'googleCalendarId' | 'color' | 'name'> & {
                linkedFrom?: Maybe<{
                  workingGroupsCollection?: Maybe<{
                    items: Array<
                      Maybe<
                        Pick<WorkingGroups, 'title'> & { sys: Pick<Sys, 'id'> }
                      >
                    >;
                  }>;
                  projectsCollection?: Maybe<{
                    items: Array<
                      Maybe<Pick<Projects, 'title'> & { sys: Pick<Sys, 'id'> }>
                    >;
                  }>;
                }>;
              }
            >;
            thumbnail?: Maybe<Pick<Asset, 'url'>>;
            speakersCollection?: Maybe<{
              items: Array<
                Maybe<
                  Pick<EventSpeakers, 'title'> & {
                    user?: Maybe<
                      | ({ __typename: 'ExternalUsers' } & Pick<
                          ExternalUsers,
                          'name' | 'orcid'
                        > & { sys: Pick<Sys, 'id'> })
                      | ({ __typename: 'Users' } & Pick<
                          Users,
                          'firstName' | 'lastName' | 'onboarded'
                        > & {
                            sys: Pick<Sys, 'id'>;
                            avatar?: Maybe<Pick<Asset, 'url'>>;
                          })
                    >;
                  }
                >
              >;
            }>;
          }
        >
      >;
    }
  >;
};

export type FetchEventsByUserIdQueryVariables = Exact<{
  id: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;

export type FetchEventsByUserIdQuery = {
  users?: Maybe<{
    linkedFrom?: Maybe<{
      eventSpeakersCollection?: Maybe<{
        items: Array<
          Maybe<{
            linkedFrom?: Maybe<{
              eventsCollection?: Maybe<
                Pick<EventsCollection, 'total'> & {
                  items: Array<
                    Maybe<
                      Pick<
                        Events,
                        | 'description'
                        | 'endDate'
                        | 'endDateTimeZone'
                        | 'startDate'
                        | 'startDateTimeZone'
                        | 'meetingLink'
                        | 'hideMeetingLink'
                        | 'eventLink'
                        | 'status'
                        | 'hidden'
                        | 'tags'
                        | 'title'
                        | 'notesPermanentlyUnavailable'
                        | 'notesUpdatedAt'
                        | 'videoRecordingPermanentlyUnavailable'
                        | 'videoRecordingUpdatedAt'
                        | 'presentationPermanentlyUnavailable'
                        | 'presentationUpdatedAt'
                        | 'meetingMaterialsPermanentlyUnavailable'
                        | 'meetingMaterials'
                      > & {
                        sys: Pick<
                          Sys,
                          'id' | 'publishedAt' | 'publishedVersion'
                        >;
                        notes?: Maybe<
                          Pick<EventsNotes, 'json'> & {
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
                                    | ({
                                        __typename: 'ContributingCohortsMembership';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'EventSpeakers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Events' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalUsers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'LatestStats' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Media' } & Pick<
                                        Media,
                                        'url'
                                      > & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'Migration' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Milestones' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'News' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Outputs' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Pages' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ProjectMembership' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Projects' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Resources' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Users' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupMembership';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupNetwork' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'WorkingGroups' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
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
                        videoRecording?: Maybe<
                          Pick<EventsVideoRecording, 'json'> & {
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
                                    | ({
                                        __typename: 'ContributingCohortsMembership';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'EventSpeakers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Events' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalUsers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'LatestStats' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Media' } & Pick<
                                        Media,
                                        'url'
                                      > & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'Migration' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Milestones' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'News' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Outputs' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Pages' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ProjectMembership' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Projects' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Resources' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Users' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupMembership';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupNetwork' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'WorkingGroups' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
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
                        presentation?: Maybe<
                          Pick<EventsPresentation, 'json'> & {
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
                                    | ({
                                        __typename: 'ContributingCohortsMembership';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'EventSpeakers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Events' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalUsers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'LatestStats' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Media' } & Pick<
                                        Media,
                                        'url'
                                      > & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'Migration' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Milestones' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'News' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Outputs' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Pages' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ProjectMembership' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Projects' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Resources' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Users' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupMembership';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupNetwork' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'WorkingGroups' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
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
                        calendar?: Maybe<
                          Pick<
                            Calendars,
                            'googleCalendarId' | 'color' | 'name'
                          > & {
                            linkedFrom?: Maybe<{
                              workingGroupsCollection?: Maybe<{
                                items: Array<
                                  Maybe<
                                    Pick<WorkingGroups, 'title'> & {
                                      sys: Pick<Sys, 'id'>;
                                    }
                                  >
                                >;
                              }>;
                              projectsCollection?: Maybe<{
                                items: Array<
                                  Maybe<
                                    Pick<Projects, 'title'> & {
                                      sys: Pick<Sys, 'id'>;
                                    }
                                  >
                                >;
                              }>;
                            }>;
                          }
                        >;
                        thumbnail?: Maybe<Pick<Asset, 'url'>>;
                        speakersCollection?: Maybe<{
                          items: Array<
                            Maybe<
                              Pick<EventSpeakers, 'title'> & {
                                user?: Maybe<
                                  | ({ __typename: 'ExternalUsers' } & Pick<
                                      ExternalUsers,
                                      'name' | 'orcid'
                                    > & { sys: Pick<Sys, 'id'> })
                                  | ({ __typename: 'Users' } & Pick<
                                      Users,
                                      'firstName' | 'lastName' | 'onboarded'
                                    > & {
                                        sys: Pick<Sys, 'id'>;
                                        avatar?: Maybe<Pick<Asset, 'url'>>;
                                      })
                                >;
                              }
                            >
                          >;
                        }>;
                      }
                    >
                  >;
                }
              >;
            }>;
          }>
        >;
      }>;
    }>;
  }>;
};

export type FetchEventsByExternalUserIdQueryVariables = Exact<{
  id: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;

export type FetchEventsByExternalUserIdQuery = {
  externalUsers?: Maybe<{
    linkedFrom?: Maybe<{
      eventSpeakersCollection?: Maybe<{
        items: Array<
          Maybe<{
            linkedFrom?: Maybe<{
              eventsCollection?: Maybe<
                Pick<EventsCollection, 'total'> & {
                  items: Array<
                    Maybe<
                      Pick<
                        Events,
                        | 'description'
                        | 'endDate'
                        | 'endDateTimeZone'
                        | 'startDate'
                        | 'startDateTimeZone'
                        | 'meetingLink'
                        | 'hideMeetingLink'
                        | 'eventLink'
                        | 'status'
                        | 'hidden'
                        | 'tags'
                        | 'title'
                        | 'notesPermanentlyUnavailable'
                        | 'notesUpdatedAt'
                        | 'videoRecordingPermanentlyUnavailable'
                        | 'videoRecordingUpdatedAt'
                        | 'presentationPermanentlyUnavailable'
                        | 'presentationUpdatedAt'
                        | 'meetingMaterialsPermanentlyUnavailable'
                        | 'meetingMaterials'
                      > & {
                        sys: Pick<
                          Sys,
                          'id' | 'publishedAt' | 'publishedVersion'
                        >;
                        notes?: Maybe<
                          Pick<EventsNotes, 'json'> & {
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
                                    | ({
                                        __typename: 'ContributingCohortsMembership';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'EventSpeakers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Events' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalUsers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'LatestStats' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Media' } & Pick<
                                        Media,
                                        'url'
                                      > & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'Migration' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Milestones' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'News' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Outputs' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Pages' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ProjectMembership' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Projects' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Resources' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Users' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupMembership';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupNetwork' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'WorkingGroups' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
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
                        videoRecording?: Maybe<
                          Pick<EventsVideoRecording, 'json'> & {
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
                                    | ({
                                        __typename: 'ContributingCohortsMembership';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'EventSpeakers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Events' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalUsers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'LatestStats' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Media' } & Pick<
                                        Media,
                                        'url'
                                      > & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'Migration' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Milestones' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'News' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Outputs' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Pages' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ProjectMembership' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Projects' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Resources' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Users' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupMembership';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupNetwork' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'WorkingGroups' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
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
                        presentation?: Maybe<
                          Pick<EventsPresentation, 'json'> & {
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
                                    | ({
                                        __typename: 'ContributingCohortsMembership';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'EventSpeakers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Events' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalUsers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'LatestStats' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Media' } & Pick<
                                        Media,
                                        'url'
                                      > & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'Migration' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Milestones' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'News' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Outputs' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Pages' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ProjectMembership' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Projects' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Resources' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Users' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupMembership';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupNetwork' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'WorkingGroups' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
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
                        calendar?: Maybe<
                          Pick<
                            Calendars,
                            'googleCalendarId' | 'color' | 'name'
                          > & {
                            linkedFrom?: Maybe<{
                              workingGroupsCollection?: Maybe<{
                                items: Array<
                                  Maybe<
                                    Pick<WorkingGroups, 'title'> & {
                                      sys: Pick<Sys, 'id'>;
                                    }
                                  >
                                >;
                              }>;
                              projectsCollection?: Maybe<{
                                items: Array<
                                  Maybe<
                                    Pick<Projects, 'title'> & {
                                      sys: Pick<Sys, 'id'>;
                                    }
                                  >
                                >;
                              }>;
                            }>;
                          }
                        >;
                        thumbnail?: Maybe<Pick<Asset, 'url'>>;
                        speakersCollection?: Maybe<{
                          items: Array<
                            Maybe<
                              Pick<EventSpeakers, 'title'> & {
                                user?: Maybe<
                                  | ({ __typename: 'ExternalUsers' } & Pick<
                                      ExternalUsers,
                                      'name' | 'orcid'
                                    > & { sys: Pick<Sys, 'id'> })
                                  | ({ __typename: 'Users' } & Pick<
                                      Users,
                                      'firstName' | 'lastName' | 'onboarded'
                                    > & {
                                        sys: Pick<Sys, 'id'>;
                                        avatar?: Maybe<Pick<Asset, 'url'>>;
                                      })
                                >;
                              }
                            >
                          >;
                        }>;
                      }
                    >
                  >;
                }
              >;
            }>;
          }>
        >;
      }>;
    }>;
  }>;
};

export type FetchProjectCalendarQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchProjectCalendarQuery = {
  projects?: Maybe<{ calendar?: Maybe<{ sys: Pick<Sys, 'id'> }> }>;
};

export type FetchWorkingGroupCalendarQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchWorkingGroupCalendarQuery = {
  workingGroups?: Maybe<{ calendar?: Maybe<{ sys: Pick<Sys, 'id'> }> }>;
};

export type ExternalUsersContentDataFragment = Pick<
  ExternalUsers,
  'name' | 'orcid'
> & {
  sys: Pick<
    Sys,
    'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
  >;
};

export type FetchExternalUsersQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<
    Array<InputMaybe<ExternalUsersOrder>> | InputMaybe<ExternalUsersOrder>
  >;
  where?: InputMaybe<ExternalUsersFilter>;
}>;

export type FetchExternalUsersQuery = {
  externalUsersCollection?: Maybe<
    Pick<ExternalUsersCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<ExternalUsers, 'name' | 'orcid'> & {
            sys: Pick<
              Sys,
              'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
            >;
          }
        >
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

export type OutputsContentDataFragment = Pick<
  Outputs,
  | 'title'
  | 'documentType'
  | 'type'
  | 'subtype'
  | 'link'
  | 'addedDate'
  | 'publishDate'
  | 'lastUpdatedPartial'
> & {
  sys: Pick<
    Sys,
    'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
  >;
  relatedEntity?: Maybe<
    | ({ __typename: 'Projects' } & Pick<Projects, 'title'> & {
          sys: Pick<Sys, 'id'>;
        })
    | ({ __typename: 'WorkingGroups' } & Pick<WorkingGroups, 'title'> & {
          sys: Pick<Sys, 'id'>;
        })
  >;
  authorsCollection?: Maybe<
    Pick<OutputsAuthorsCollection, 'total'> & {
      items: Array<
        Maybe<
          | ({ __typename: 'ExternalUsers' } & Pick<ExternalUsers, 'name'> & {
                sys: Pick<Sys, 'id'>;
              })
          | ({ __typename: 'Users' } & Pick<
              Users,
              'firstName' | 'lastName' | 'email' | 'onboarded'
            > & { sys: Pick<Sys, 'id'>; avatar?: Maybe<Pick<Asset, 'url'>> })
        >
      >;
    }
  >;
};

export type FetchOutputByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchOutputByIdQuery = {
  outputs?: Maybe<
    Pick<
      Outputs,
      | 'title'
      | 'documentType'
      | 'type'
      | 'subtype'
      | 'link'
      | 'addedDate'
      | 'publishDate'
      | 'lastUpdatedPartial'
    > & {
      sys: Pick<
        Sys,
        'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
      >;
      relatedEntity?: Maybe<
        | ({ __typename: 'Projects' } & Pick<Projects, 'title'> & {
              sys: Pick<Sys, 'id'>;
            })
        | ({ __typename: 'WorkingGroups' } & Pick<WorkingGroups, 'title'> & {
              sys: Pick<Sys, 'id'>;
            })
      >;
      authorsCollection?: Maybe<
        Pick<OutputsAuthorsCollection, 'total'> & {
          items: Array<
            Maybe<
              | ({ __typename: 'ExternalUsers' } & Pick<
                  ExternalUsers,
                  'name'
                > & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Users' } & Pick<
                  Users,
                  'firstName' | 'lastName' | 'email' | 'onboarded'
                > & {
                    sys: Pick<Sys, 'id'>;
                    avatar?: Maybe<Pick<Asset, 'url'>>;
                  })
            >
          >;
        }
      >;
    }
  >;
};

export type FetchOutputsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<
    Array<InputMaybe<OutputsOrder>> | InputMaybe<OutputsOrder>
  >;
  where?: InputMaybe<OutputsFilter>;
  preview?: InputMaybe<Scalars['Boolean']>;
}>;

export type FetchOutputsQuery = {
  outputsCollection?: Maybe<
    Pick<OutputsCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<
            Outputs,
            | 'title'
            | 'documentType'
            | 'type'
            | 'subtype'
            | 'link'
            | 'addedDate'
            | 'publishDate'
            | 'lastUpdatedPartial'
          > & {
            sys: Pick<
              Sys,
              'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
            >;
            relatedEntity?: Maybe<
              | ({ __typename: 'Projects' } & Pick<Projects, 'title'> & {
                    sys: Pick<Sys, 'id'>;
                  })
              | ({ __typename: 'WorkingGroups' } & Pick<
                  WorkingGroups,
                  'title'
                > & { sys: Pick<Sys, 'id'> })
            >;
            authorsCollection?: Maybe<
              Pick<OutputsAuthorsCollection, 'total'> & {
                items: Array<
                  Maybe<
                    | ({ __typename: 'ExternalUsers' } & Pick<
                        ExternalUsers,
                        'name'
                      > & { sys: Pick<Sys, 'id'> })
                    | ({ __typename: 'Users' } & Pick<
                        Users,
                        'firstName' | 'lastName' | 'email' | 'onboarded'
                      > & {
                          sys: Pick<Sys, 'id'>;
                          avatar?: Maybe<Pick<Asset, 'url'>>;
                        })
                  >
                >;
              }
            >;
          }
        >
      >;
    }
  >;
};

export type FetchOutputsByWorkingGroupIdQueryVariables = Exact<{
  id: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;

export type FetchOutputsByWorkingGroupIdQuery = {
  workingGroups?: Maybe<{
    sys: Pick<Sys, 'id'>;
    linkedFrom?: Maybe<{
      outputsCollection?: Maybe<
        Pick<OutputsCollection, 'total'> & {
          items: Array<
            Maybe<
              Pick<
                Outputs,
                | 'title'
                | 'documentType'
                | 'type'
                | 'subtype'
                | 'link'
                | 'addedDate'
                | 'publishDate'
                | 'lastUpdatedPartial'
              > & {
                sys: Pick<
                  Sys,
                  'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
                >;
                relatedEntity?: Maybe<
                  | ({ __typename: 'Projects' } & Pick<Projects, 'title'> & {
                        sys: Pick<Sys, 'id'>;
                      })
                  | ({ __typename: 'WorkingGroups' } & Pick<
                      WorkingGroups,
                      'title'
                    > & { sys: Pick<Sys, 'id'> })
                >;
                authorsCollection?: Maybe<
                  Pick<OutputsAuthorsCollection, 'total'> & {
                    items: Array<
                      Maybe<
                        | ({ __typename: 'ExternalUsers' } & Pick<
                            ExternalUsers,
                            'name'
                          > & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Users' } & Pick<
                            Users,
                            'firstName' | 'lastName' | 'email' | 'onboarded'
                          > & {
                              sys: Pick<Sys, 'id'>;
                              avatar?: Maybe<Pick<Asset, 'url'>>;
                            })
                      >
                    >;
                  }
                >;
              }
            >
          >;
        }
      >;
    }>;
  }>;
};

export type FetchOutputsByUserIdQueryVariables = Exact<{
  id: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;

export type FetchOutputsByUserIdQuery = {
  users?: Maybe<{
    sys: Pick<Sys, 'id'>;
    linkedFrom?: Maybe<{
      outputsCollection?: Maybe<
        Pick<OutputsCollection, 'total'> & {
          items: Array<
            Maybe<
              Pick<
                Outputs,
                | 'title'
                | 'documentType'
                | 'type'
                | 'subtype'
                | 'link'
                | 'addedDate'
                | 'publishDate'
                | 'lastUpdatedPartial'
              > & {
                sys: Pick<
                  Sys,
                  'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
                >;
                relatedEntity?: Maybe<
                  | ({ __typename: 'Projects' } & Pick<Projects, 'title'> & {
                        sys: Pick<Sys, 'id'>;
                      })
                  | ({ __typename: 'WorkingGroups' } & Pick<
                      WorkingGroups,
                      'title'
                    > & { sys: Pick<Sys, 'id'> })
                >;
                authorsCollection?: Maybe<
                  Pick<OutputsAuthorsCollection, 'total'> & {
                    items: Array<
                      Maybe<
                        | ({ __typename: 'ExternalUsers' } & Pick<
                            ExternalUsers,
                            'name'
                          > & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Users' } & Pick<
                            Users,
                            'firstName' | 'lastName' | 'email' | 'onboarded'
                          > & {
                              sys: Pick<Sys, 'id'>;
                              avatar?: Maybe<Pick<Asset, 'url'>>;
                            })
                      >
                    >;
                  }
                >;
              }
            >
          >;
        }
      >;
    }>;
  }>;
};

export type FetchOutputsByProjectIdQueryVariables = Exact<{
  id: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;

export type FetchOutputsByProjectIdQuery = {
  projects?: Maybe<{
    sys: Pick<Sys, 'id'>;
    linkedFrom?: Maybe<{
      outputsCollection?: Maybe<
        Pick<OutputsCollection, 'total'> & {
          items: Array<
            Maybe<
              Pick<
                Outputs,
                | 'title'
                | 'documentType'
                | 'type'
                | 'subtype'
                | 'link'
                | 'addedDate'
                | 'publishDate'
                | 'lastUpdatedPartial'
              > & {
                sys: Pick<
                  Sys,
                  'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
                >;
                relatedEntity?: Maybe<
                  | ({ __typename: 'Projects' } & Pick<Projects, 'title'> & {
                        sys: Pick<Sys, 'id'>;
                      })
                  | ({ __typename: 'WorkingGroups' } & Pick<
                      WorkingGroups,
                      'title'
                    > & { sys: Pick<Sys, 'id'> })
                >;
                authorsCollection?: Maybe<
                  Pick<OutputsAuthorsCollection, 'total'> & {
                    items: Array<
                      Maybe<
                        | ({ __typename: 'ExternalUsers' } & Pick<
                            ExternalUsers,
                            'name'
                          > & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Users' } & Pick<
                            Users,
                            'firstName' | 'lastName' | 'email' | 'onboarded'
                          > & {
                              sys: Pick<Sys, 'id'>;
                              avatar?: Maybe<Pick<Asset, 'url'>>;
                            })
                      >
                    >;
                  }
                >;
              }
            >
          >;
        }
      >;
    }>;
  }>;
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
              | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ExternalUsers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'LatestStats' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                    sys: Pick<Sys, 'id'>;
                  })
              | ({ __typename: 'Migration' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Milestones' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Outputs' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ProjectMembership' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Projects' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Resources' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'WorkingGroupMembership' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupNetwork' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroups' } & { sys: Pick<Sys, 'id'> })
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
                        | ({ __typename: 'EventSpeakers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ExternalUsers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'LatestStats' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                              sys: Pick<Sys, 'id'>;
                            })
                        | ({ __typename: 'Migration' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Milestones' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Outputs' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ProjectMembership' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Projects' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Resources' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'WorkingGroupMembership' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'WorkingGroupNetwork' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'WorkingGroups' } & {
                            sys: Pick<Sys, 'id'>;
                          })
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

export type ProjectsContentDataFragment = Pick<
  Projects,
  | 'title'
  | 'startDate'
  | 'endDate'
  | 'status'
  | 'projectProposal'
  | 'description'
  | 'pmEmail'
  | 'leadEmail'
  | 'keywords'
  | 'traineeProject'
  | 'opportunitiesLink'
> & {
  sys: Pick<
    Sys,
    'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
  >;
  membersCollection?: Maybe<
    Pick<ProjectsMembersCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<ProjectMembership, 'role'> & {
            sys: Pick<Sys, 'id'>;
            user?: Maybe<
              Pick<Users, 'firstName' | 'lastName' | 'onboarded'> & {
                sys: Pick<Sys, 'id'>;
                avatar?: Maybe<Pick<Asset, 'url'>>;
              }
            >;
          }
        >
      >;
    }
  >;
  milestonesCollection?: Maybe<
    Pick<ProjectsMilestonesCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<
            Milestones,
            'description' | 'externalLink' | 'status' | 'title'
          > & { sys: Pick<Sys, 'id'> }
        >
      >;
    }
  >;
  resourcesCollection?: Maybe<
    Pick<ProjectsResourcesCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<Resources, 'type' | 'title' | 'description' | 'externalLink'> & {
            sys: Pick<Sys, 'id'>;
          }
        >
      >;
    }
  >;
  calendar?: Maybe<Pick<Calendars, 'name'> & { sys: Pick<Sys, 'id'> }>;
};

export type FetchProjectByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchProjectByIdQuery = {
  projects?: Maybe<
    Pick<
      Projects,
      | 'title'
      | 'startDate'
      | 'endDate'
      | 'status'
      | 'projectProposal'
      | 'description'
      | 'pmEmail'
      | 'leadEmail'
      | 'keywords'
      | 'traineeProject'
      | 'opportunitiesLink'
    > & {
      sys: Pick<
        Sys,
        'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
      >;
      membersCollection?: Maybe<
        Pick<ProjectsMembersCollection, 'total'> & {
          items: Array<
            Maybe<
              Pick<ProjectMembership, 'role'> & {
                sys: Pick<Sys, 'id'>;
                user?: Maybe<
                  Pick<Users, 'firstName' | 'lastName' | 'onboarded'> & {
                    sys: Pick<Sys, 'id'>;
                    avatar?: Maybe<Pick<Asset, 'url'>>;
                  }
                >;
              }
            >
          >;
        }
      >;
      milestonesCollection?: Maybe<
        Pick<ProjectsMilestonesCollection, 'total'> & {
          items: Array<
            Maybe<
              Pick<
                Milestones,
                'description' | 'externalLink' | 'status' | 'title'
              > & { sys: Pick<Sys, 'id'> }
            >
          >;
        }
      >;
      resourcesCollection?: Maybe<
        Pick<ProjectsResourcesCollection, 'total'> & {
          items: Array<
            Maybe<
              Pick<
                Resources,
                'type' | 'title' | 'description' | 'externalLink'
              > & { sys: Pick<Sys, 'id'> }
            >
          >;
        }
      >;
      calendar?: Maybe<Pick<Calendars, 'name'> & { sys: Pick<Sys, 'id'> }>;
    }
  >;
};

export type FetchProjectsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;

export type FetchProjectsQuery = {
  projectsCollection?: Maybe<
    Pick<ProjectsCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<
            Projects,
            | 'title'
            | 'startDate'
            | 'endDate'
            | 'status'
            | 'projectProposal'
            | 'description'
            | 'pmEmail'
            | 'leadEmail'
            | 'keywords'
            | 'traineeProject'
            | 'opportunitiesLink'
          > & {
            sys: Pick<
              Sys,
              'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
            >;
            membersCollection?: Maybe<
              Pick<ProjectsMembersCollection, 'total'> & {
                items: Array<
                  Maybe<
                    Pick<ProjectMembership, 'role'> & {
                      sys: Pick<Sys, 'id'>;
                      user?: Maybe<
                        Pick<Users, 'firstName' | 'lastName' | 'onboarded'> & {
                          sys: Pick<Sys, 'id'>;
                          avatar?: Maybe<Pick<Asset, 'url'>>;
                        }
                      >;
                    }
                  >
                >;
              }
            >;
            milestonesCollection?: Maybe<
              Pick<ProjectsMilestonesCollection, 'total'> & {
                items: Array<
                  Maybe<
                    Pick<
                      Milestones,
                      'description' | 'externalLink' | 'status' | 'title'
                    > & { sys: Pick<Sys, 'id'> }
                  >
                >;
              }
            >;
            resourcesCollection?: Maybe<
              Pick<ProjectsResourcesCollection, 'total'> & {
                items: Array<
                  Maybe<
                    Pick<
                      Resources,
                      'type' | 'title' | 'description' | 'externalLink'
                    > & { sys: Pick<Sys, 'id'> }
                  >
                >;
              }
            >;
            calendar?: Maybe<
              Pick<Calendars, 'name'> & { sys: Pick<Sys, 'id'> }
            >;
          }
        >
      >;
    }
  >;
};

export type LatestStatsContentDataFragment = Pick<
  LatestStats,
  'sampleCount' | 'articleCount' | 'cohortCount'
>;

export type FetchLatestStatsQueryVariables = Exact<{ [key: string]: never }>;

export type FetchLatestStatsQuery = {
  latestStatsCollection?: Maybe<
    Pick<LatestStatsCollection, 'total'> & {
      items: Array<
        Maybe<Pick<LatestStats, 'sampleCount' | 'articleCount' | 'cohortCount'>>
      >;
    }
  >;
};

export type UsersContentDataFragment = Pick<
  Users,
  | 'activatedDate'
  | 'firstName'
  | 'lastName'
  | 'degrees'
  | 'country'
  | 'city'
  | 'region'
  | 'email'
  | 'alternativeEmail'
  | 'telephoneCountryCode'
  | 'telephoneNumber'
  | 'keywords'
  | 'biography'
  | 'questions'
  | 'fundingStreams'
  | 'blog'
  | 'linkedIn'
  | 'twitter'
  | 'github'
  | 'googleScholar'
  | 'orcid'
  | 'researchGate'
  | 'researcherId'
  | 'connections'
  | 'role'
  | 'onboarded'
  | 'positions'
> & {
  sys: Pick<
    Sys,
    'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
  >;
  avatar?: Maybe<Pick<Asset, 'url'>>;
  contributingCohortsCollection?: Maybe<{
    items: Array<
      Maybe<
        Pick<ContributingCohortsMembership, 'role' | 'studyLink'> & {
          contributingCohort?: Maybe<
            Pick<ContributingCohorts, 'name'> & { sys: Pick<Sys, 'id'> }
          >;
        }
      >
    >;
  }>;
  linkedFrom?: Maybe<{
    projectMembershipCollection?: Maybe<{
      items: Array<
        Maybe<
          Pick<ProjectMembership, 'role'> & {
            user?: Maybe<{ sys: Pick<Sys, 'id'> }>;
            linkedFrom?: Maybe<{
              projectsCollection?: Maybe<{
                items: Array<
                  Maybe<
                    Pick<Projects, 'title' | 'status'> & {
                      sys: Pick<Sys, 'id'>;
                      membersCollection?: Maybe<{
                        items: Array<
                          Maybe<
                            Pick<ProjectMembership, 'role'> & {
                              user?: Maybe<
                                Pick<Users, 'onboarded'> & {
                                  sys: Pick<Sys, 'id'>;
                                }
                              >;
                            }
                          >
                        >;
                      }>;
                    }
                  >
                >;
              }>;
            }>;
          }
        >
      >;
    }>;
    workingGroupMembershipCollection?: Maybe<{
      items: Array<
        Maybe<
          Pick<WorkingGroupMembership, 'role'> & {
            user?: Maybe<{ sys: Pick<Sys, 'id'> }>;
            linkedFrom?: Maybe<{
              workingGroupsCollection?: Maybe<{
                items: Array<
                  Maybe<
                    Pick<WorkingGroups, 'title'> & {
                      sys: Pick<Sys, 'id'>;
                      membersCollection?: Maybe<{
                        items: Array<
                          Maybe<
                            Pick<WorkingGroupMembership, 'role'> & {
                              user?: Maybe<
                                Pick<Users, 'onboarded'> & {
                                  sys: Pick<Sys, 'id'>;
                                }
                              >;
                            }
                          >
                        >;
                      }>;
                    }
                  >
                >;
              }>;
            }>;
          }
        >
      >;
    }>;
  }>;
};

export type FetchUserByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchUserByIdQuery = {
  users?: Maybe<
    Pick<
      Users,
      | 'activatedDate'
      | 'firstName'
      | 'lastName'
      | 'degrees'
      | 'country'
      | 'city'
      | 'region'
      | 'email'
      | 'alternativeEmail'
      | 'telephoneCountryCode'
      | 'telephoneNumber'
      | 'keywords'
      | 'biography'
      | 'questions'
      | 'fundingStreams'
      | 'blog'
      | 'linkedIn'
      | 'twitter'
      | 'github'
      | 'googleScholar'
      | 'orcid'
      | 'researchGate'
      | 'researcherId'
      | 'connections'
      | 'role'
      | 'onboarded'
      | 'positions'
    > & {
      sys: Pick<
        Sys,
        'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
      >;
      avatar?: Maybe<Pick<Asset, 'url'>>;
      contributingCohortsCollection?: Maybe<{
        items: Array<
          Maybe<
            Pick<ContributingCohortsMembership, 'role' | 'studyLink'> & {
              contributingCohort?: Maybe<
                Pick<ContributingCohorts, 'name'> & { sys: Pick<Sys, 'id'> }
              >;
            }
          >
        >;
      }>;
      linkedFrom?: Maybe<{
        projectMembershipCollection?: Maybe<{
          items: Array<
            Maybe<
              Pick<ProjectMembership, 'role'> & {
                user?: Maybe<{ sys: Pick<Sys, 'id'> }>;
                linkedFrom?: Maybe<{
                  projectsCollection?: Maybe<{
                    items: Array<
                      Maybe<
                        Pick<Projects, 'title' | 'status'> & {
                          sys: Pick<Sys, 'id'>;
                          membersCollection?: Maybe<{
                            items: Array<
                              Maybe<
                                Pick<ProjectMembership, 'role'> & {
                                  user?: Maybe<
                                    Pick<Users, 'onboarded'> & {
                                      sys: Pick<Sys, 'id'>;
                                    }
                                  >;
                                }
                              >
                            >;
                          }>;
                        }
                      >
                    >;
                  }>;
                }>;
              }
            >
          >;
        }>;
        workingGroupMembershipCollection?: Maybe<{
          items: Array<
            Maybe<
              Pick<WorkingGroupMembership, 'role'> & {
                user?: Maybe<{ sys: Pick<Sys, 'id'> }>;
                linkedFrom?: Maybe<{
                  workingGroupsCollection?: Maybe<{
                    items: Array<
                      Maybe<
                        Pick<WorkingGroups, 'title'> & {
                          sys: Pick<Sys, 'id'>;
                          membersCollection?: Maybe<{
                            items: Array<
                              Maybe<
                                Pick<WorkingGroupMembership, 'role'> & {
                                  user?: Maybe<
                                    Pick<Users, 'onboarded'> & {
                                      sys: Pick<Sys, 'id'>;
                                    }
                                  >;
                                }
                              >
                            >;
                          }>;
                        }
                      >
                    >;
                  }>;
                }>;
              }
            >
          >;
        }>;
      }>;
    }
  >;
};

export type FetchUsersQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Array<InputMaybe<UsersOrder>> | InputMaybe<UsersOrder>>;
  where?: InputMaybe<UsersFilter>;
}>;

export type FetchUsersQuery = {
  usersCollection?: Maybe<
    Pick<UsersCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<
            Users,
            | 'activatedDate'
            | 'firstName'
            | 'lastName'
            | 'degrees'
            | 'country'
            | 'city'
            | 'region'
            | 'email'
            | 'alternativeEmail'
            | 'telephoneCountryCode'
            | 'telephoneNumber'
            | 'keywords'
            | 'biography'
            | 'questions'
            | 'fundingStreams'
            | 'blog'
            | 'linkedIn'
            | 'twitter'
            | 'github'
            | 'googleScholar'
            | 'orcid'
            | 'researchGate'
            | 'researcherId'
            | 'connections'
            | 'role'
            | 'onboarded'
            | 'positions'
          > & {
            sys: Pick<
              Sys,
              'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
            >;
            avatar?: Maybe<Pick<Asset, 'url'>>;
            contributingCohortsCollection?: Maybe<{
              items: Array<
                Maybe<
                  Pick<ContributingCohortsMembership, 'role' | 'studyLink'> & {
                    contributingCohort?: Maybe<
                      Pick<ContributingCohorts, 'name'> & {
                        sys: Pick<Sys, 'id'>;
                      }
                    >;
                  }
                >
              >;
            }>;
            linkedFrom?: Maybe<{
              projectMembershipCollection?: Maybe<{
                items: Array<
                  Maybe<
                    Pick<ProjectMembership, 'role'> & {
                      user?: Maybe<{ sys: Pick<Sys, 'id'> }>;
                      linkedFrom?: Maybe<{
                        projectsCollection?: Maybe<{
                          items: Array<
                            Maybe<
                              Pick<Projects, 'title' | 'status'> & {
                                sys: Pick<Sys, 'id'>;
                                membersCollection?: Maybe<{
                                  items: Array<
                                    Maybe<
                                      Pick<ProjectMembership, 'role'> & {
                                        user?: Maybe<
                                          Pick<Users, 'onboarded'> & {
                                            sys: Pick<Sys, 'id'>;
                                          }
                                        >;
                                      }
                                    >
                                  >;
                                }>;
                              }
                            >
                          >;
                        }>;
                      }>;
                    }
                  >
                >;
              }>;
              workingGroupMembershipCollection?: Maybe<{
                items: Array<
                  Maybe<
                    Pick<WorkingGroupMembership, 'role'> & {
                      user?: Maybe<{ sys: Pick<Sys, 'id'> }>;
                      linkedFrom?: Maybe<{
                        workingGroupsCollection?: Maybe<{
                          items: Array<
                            Maybe<
                              Pick<WorkingGroups, 'title'> & {
                                sys: Pick<Sys, 'id'>;
                                membersCollection?: Maybe<{
                                  items: Array<
                                    Maybe<
                                      Pick<WorkingGroupMembership, 'role'> & {
                                        user?: Maybe<
                                          Pick<Users, 'onboarded'> & {
                                            sys: Pick<Sys, 'id'>;
                                          }
                                        >;
                                      }
                                    >
                                  >;
                                }>;
                              }
                            >
                          >;
                        }>;
                      }>;
                    }
                  >
                >;
              }>;
            }>;
          }
        >
      >;
    }
  >;
};

export type FetchUsersByProjectIdQueryVariables = Exact<{
  id: Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>;
}>;

export type FetchUsersByProjectIdQuery = {
  projectsCollection?: Maybe<
    Pick<ProjectsCollection, 'total'> & {
      items: Array<
        Maybe<{
          membersCollection?: Maybe<
            Pick<ProjectsMembersCollection, 'total'> & {
              items: Array<Maybe<{ user?: Maybe<{ sys: Pick<Sys, 'id'> }> }>>;
            }
          >;
        }>
      >;
    }
  >;
};

export type FetchUsersByWorkingGroupIdQueryVariables = Exact<{
  id: Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>;
}>;

export type FetchUsersByWorkingGroupIdQuery = {
  workingGroupsCollection?: Maybe<
    Pick<WorkingGroupsCollection, 'total'> & {
      items: Array<
        Maybe<{
          membersCollection?: Maybe<
            Pick<WorkingGroupsMembersCollection, 'total'> & {
              items: Array<Maybe<{ user?: Maybe<{ sys: Pick<Sys, 'id'> }> }>>;
            }
          >;
        }>
      >;
    }
  >;
};

export type WorkingGroupNetworkContentDataFragment = {
  supportCollection?: Maybe<
    Pick<WorkingGroupNetworkSupportCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<
            WorkingGroups,
            | 'title'
            | 'shortDescription'
            | 'description'
            | 'primaryEmail'
            | 'secondaryEmail'
            | 'leadingMembers'
          > & {
            sys: Pick<
              Sys,
              'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
            >;
            membersCollection?: Maybe<
              Pick<WorkingGroupsMembersCollection, 'total'> & {
                items: Array<
                  Maybe<
                    Pick<WorkingGroupMembership, 'role'> & {
                      sys: Pick<Sys, 'id'>;
                      user?: Maybe<
                        Pick<Users, 'firstName' | 'lastName' | 'onboarded'> & {
                          sys: Pick<Sys, 'id'>;
                          avatar?: Maybe<Pick<Asset, 'url'>>;
                        }
                      >;
                    }
                  >
                >;
              }
            >;
            milestonesCollection?: Maybe<
              Pick<WorkingGroupsMilestonesCollection, 'total'> & {
                items: Array<
                  Maybe<
                    Pick<
                      Milestones,
                      'description' | 'externalLink' | 'status' | 'title'
                    > & { sys: Pick<Sys, 'id'> }
                  >
                >;
              }
            >;
            resourcesCollection?: Maybe<
              Pick<WorkingGroupsResourcesCollection, 'total'> & {
                items: Array<
                  Maybe<
                    Pick<
                      Resources,
                      'type' | 'title' | 'description' | 'externalLink'
                    > & { sys: Pick<Sys, 'id'> }
                  >
                >;
              }
            >;
            calendar?: Maybe<
              Pick<Calendars, 'name'> & { sys: Pick<Sys, 'id'> }
            >;
          }
        >
      >;
    }
  >;
  monogenicCollection?: Maybe<
    Pick<WorkingGroupNetworkMonogenicCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<
            WorkingGroups,
            | 'title'
            | 'shortDescription'
            | 'description'
            | 'primaryEmail'
            | 'secondaryEmail'
            | 'leadingMembers'
          > & {
            sys: Pick<
              Sys,
              'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
            >;
            membersCollection?: Maybe<
              Pick<WorkingGroupsMembersCollection, 'total'> & {
                items: Array<
                  Maybe<
                    Pick<WorkingGroupMembership, 'role'> & {
                      sys: Pick<Sys, 'id'>;
                      user?: Maybe<
                        Pick<Users, 'firstName' | 'lastName' | 'onboarded'> & {
                          sys: Pick<Sys, 'id'>;
                          avatar?: Maybe<Pick<Asset, 'url'>>;
                        }
                      >;
                    }
                  >
                >;
              }
            >;
            milestonesCollection?: Maybe<
              Pick<WorkingGroupsMilestonesCollection, 'total'> & {
                items: Array<
                  Maybe<
                    Pick<
                      Milestones,
                      'description' | 'externalLink' | 'status' | 'title'
                    > & { sys: Pick<Sys, 'id'> }
                  >
                >;
              }
            >;
            resourcesCollection?: Maybe<
              Pick<WorkingGroupsResourcesCollection, 'total'> & {
                items: Array<
                  Maybe<
                    Pick<
                      Resources,
                      'type' | 'title' | 'description' | 'externalLink'
                    > & { sys: Pick<Sys, 'id'> }
                  >
                >;
              }
            >;
            calendar?: Maybe<
              Pick<Calendars, 'name'> & { sys: Pick<Sys, 'id'> }
            >;
          }
        >
      >;
    }
  >;
  operationalCollection?: Maybe<
    Pick<WorkingGroupNetworkOperationalCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<
            WorkingGroups,
            | 'title'
            | 'shortDescription'
            | 'description'
            | 'primaryEmail'
            | 'secondaryEmail'
            | 'leadingMembers'
          > & {
            sys: Pick<
              Sys,
              'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
            >;
            membersCollection?: Maybe<
              Pick<WorkingGroupsMembersCollection, 'total'> & {
                items: Array<
                  Maybe<
                    Pick<WorkingGroupMembership, 'role'> & {
                      sys: Pick<Sys, 'id'>;
                      user?: Maybe<
                        Pick<Users, 'firstName' | 'lastName' | 'onboarded'> & {
                          sys: Pick<Sys, 'id'>;
                          avatar?: Maybe<Pick<Asset, 'url'>>;
                        }
                      >;
                    }
                  >
                >;
              }
            >;
            milestonesCollection?: Maybe<
              Pick<WorkingGroupsMilestonesCollection, 'total'> & {
                items: Array<
                  Maybe<
                    Pick<
                      Milestones,
                      'description' | 'externalLink' | 'status' | 'title'
                    > & { sys: Pick<Sys, 'id'> }
                  >
                >;
              }
            >;
            resourcesCollection?: Maybe<
              Pick<WorkingGroupsResourcesCollection, 'total'> & {
                items: Array<
                  Maybe<
                    Pick<
                      Resources,
                      'type' | 'title' | 'description' | 'externalLink'
                    > & { sys: Pick<Sys, 'id'> }
                  >
                >;
              }
            >;
            calendar?: Maybe<
              Pick<Calendars, 'name'> & { sys: Pick<Sys, 'id'> }
            >;
          }
        >
      >;
    }
  >;
  complexDiseaseCollection?: Maybe<
    Pick<WorkingGroupNetworkComplexDiseaseCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<
            WorkingGroups,
            | 'title'
            | 'shortDescription'
            | 'description'
            | 'primaryEmail'
            | 'secondaryEmail'
            | 'leadingMembers'
          > & {
            sys: Pick<
              Sys,
              'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
            >;
            membersCollection?: Maybe<
              Pick<WorkingGroupsMembersCollection, 'total'> & {
                items: Array<
                  Maybe<
                    Pick<WorkingGroupMembership, 'role'> & {
                      sys: Pick<Sys, 'id'>;
                      user?: Maybe<
                        Pick<Users, 'firstName' | 'lastName' | 'onboarded'> & {
                          sys: Pick<Sys, 'id'>;
                          avatar?: Maybe<Pick<Asset, 'url'>>;
                        }
                      >;
                    }
                  >
                >;
              }
            >;
            milestonesCollection?: Maybe<
              Pick<WorkingGroupsMilestonesCollection, 'total'> & {
                items: Array<
                  Maybe<
                    Pick<
                      Milestones,
                      'description' | 'externalLink' | 'status' | 'title'
                    > & { sys: Pick<Sys, 'id'> }
                  >
                >;
              }
            >;
            resourcesCollection?: Maybe<
              Pick<WorkingGroupsResourcesCollection, 'total'> & {
                items: Array<
                  Maybe<
                    Pick<
                      Resources,
                      'type' | 'title' | 'description' | 'externalLink'
                    > & { sys: Pick<Sys, 'id'> }
                  >
                >;
              }
            >;
            calendar?: Maybe<
              Pick<Calendars, 'name'> & { sys: Pick<Sys, 'id'> }
            >;
          }
        >
      >;
    }
  >;
};

export type FetchWorkingGroupNetworkQueryVariables = Exact<{
  [key: string]: never;
}>;

export type FetchWorkingGroupNetworkQuery = {
  workingGroupNetworkCollection?: Maybe<
    Pick<WorkingGroupNetworkCollection, 'total'> & {
      items: Array<
        Maybe<{
          supportCollection?: Maybe<
            Pick<WorkingGroupNetworkSupportCollection, 'total'> & {
              items: Array<
                Maybe<
                  Pick<
                    WorkingGroups,
                    | 'title'
                    | 'shortDescription'
                    | 'description'
                    | 'primaryEmail'
                    | 'secondaryEmail'
                    | 'leadingMembers'
                  > & {
                    sys: Pick<
                      Sys,
                      | 'id'
                      | 'firstPublishedAt'
                      | 'publishedAt'
                      | 'publishedVersion'
                    >;
                    membersCollection?: Maybe<
                      Pick<WorkingGroupsMembersCollection, 'total'> & {
                        items: Array<
                          Maybe<
                            Pick<WorkingGroupMembership, 'role'> & {
                              sys: Pick<Sys, 'id'>;
                              user?: Maybe<
                                Pick<
                                  Users,
                                  'firstName' | 'lastName' | 'onboarded'
                                > & {
                                  sys: Pick<Sys, 'id'>;
                                  avatar?: Maybe<Pick<Asset, 'url'>>;
                                }
                              >;
                            }
                          >
                        >;
                      }
                    >;
                    milestonesCollection?: Maybe<
                      Pick<WorkingGroupsMilestonesCollection, 'total'> & {
                        items: Array<
                          Maybe<
                            Pick<
                              Milestones,
                              | 'description'
                              | 'externalLink'
                              | 'status'
                              | 'title'
                            > & { sys: Pick<Sys, 'id'> }
                          >
                        >;
                      }
                    >;
                    resourcesCollection?: Maybe<
                      Pick<WorkingGroupsResourcesCollection, 'total'> & {
                        items: Array<
                          Maybe<
                            Pick<
                              Resources,
                              'type' | 'title' | 'description' | 'externalLink'
                            > & { sys: Pick<Sys, 'id'> }
                          >
                        >;
                      }
                    >;
                    calendar?: Maybe<
                      Pick<Calendars, 'name'> & { sys: Pick<Sys, 'id'> }
                    >;
                  }
                >
              >;
            }
          >;
          monogenicCollection?: Maybe<
            Pick<WorkingGroupNetworkMonogenicCollection, 'total'> & {
              items: Array<
                Maybe<
                  Pick<
                    WorkingGroups,
                    | 'title'
                    | 'shortDescription'
                    | 'description'
                    | 'primaryEmail'
                    | 'secondaryEmail'
                    | 'leadingMembers'
                  > & {
                    sys: Pick<
                      Sys,
                      | 'id'
                      | 'firstPublishedAt'
                      | 'publishedAt'
                      | 'publishedVersion'
                    >;
                    membersCollection?: Maybe<
                      Pick<WorkingGroupsMembersCollection, 'total'> & {
                        items: Array<
                          Maybe<
                            Pick<WorkingGroupMembership, 'role'> & {
                              sys: Pick<Sys, 'id'>;
                              user?: Maybe<
                                Pick<
                                  Users,
                                  'firstName' | 'lastName' | 'onboarded'
                                > & {
                                  sys: Pick<Sys, 'id'>;
                                  avatar?: Maybe<Pick<Asset, 'url'>>;
                                }
                              >;
                            }
                          >
                        >;
                      }
                    >;
                    milestonesCollection?: Maybe<
                      Pick<WorkingGroupsMilestonesCollection, 'total'> & {
                        items: Array<
                          Maybe<
                            Pick<
                              Milestones,
                              | 'description'
                              | 'externalLink'
                              | 'status'
                              | 'title'
                            > & { sys: Pick<Sys, 'id'> }
                          >
                        >;
                      }
                    >;
                    resourcesCollection?: Maybe<
                      Pick<WorkingGroupsResourcesCollection, 'total'> & {
                        items: Array<
                          Maybe<
                            Pick<
                              Resources,
                              'type' | 'title' | 'description' | 'externalLink'
                            > & { sys: Pick<Sys, 'id'> }
                          >
                        >;
                      }
                    >;
                    calendar?: Maybe<
                      Pick<Calendars, 'name'> & { sys: Pick<Sys, 'id'> }
                    >;
                  }
                >
              >;
            }
          >;
          operationalCollection?: Maybe<
            Pick<WorkingGroupNetworkOperationalCollection, 'total'> & {
              items: Array<
                Maybe<
                  Pick<
                    WorkingGroups,
                    | 'title'
                    | 'shortDescription'
                    | 'description'
                    | 'primaryEmail'
                    | 'secondaryEmail'
                    | 'leadingMembers'
                  > & {
                    sys: Pick<
                      Sys,
                      | 'id'
                      | 'firstPublishedAt'
                      | 'publishedAt'
                      | 'publishedVersion'
                    >;
                    membersCollection?: Maybe<
                      Pick<WorkingGroupsMembersCollection, 'total'> & {
                        items: Array<
                          Maybe<
                            Pick<WorkingGroupMembership, 'role'> & {
                              sys: Pick<Sys, 'id'>;
                              user?: Maybe<
                                Pick<
                                  Users,
                                  'firstName' | 'lastName' | 'onboarded'
                                > & {
                                  sys: Pick<Sys, 'id'>;
                                  avatar?: Maybe<Pick<Asset, 'url'>>;
                                }
                              >;
                            }
                          >
                        >;
                      }
                    >;
                    milestonesCollection?: Maybe<
                      Pick<WorkingGroupsMilestonesCollection, 'total'> & {
                        items: Array<
                          Maybe<
                            Pick<
                              Milestones,
                              | 'description'
                              | 'externalLink'
                              | 'status'
                              | 'title'
                            > & { sys: Pick<Sys, 'id'> }
                          >
                        >;
                      }
                    >;
                    resourcesCollection?: Maybe<
                      Pick<WorkingGroupsResourcesCollection, 'total'> & {
                        items: Array<
                          Maybe<
                            Pick<
                              Resources,
                              'type' | 'title' | 'description' | 'externalLink'
                            > & { sys: Pick<Sys, 'id'> }
                          >
                        >;
                      }
                    >;
                    calendar?: Maybe<
                      Pick<Calendars, 'name'> & { sys: Pick<Sys, 'id'> }
                    >;
                  }
                >
              >;
            }
          >;
          complexDiseaseCollection?: Maybe<
            Pick<WorkingGroupNetworkComplexDiseaseCollection, 'total'> & {
              items: Array<
                Maybe<
                  Pick<
                    WorkingGroups,
                    | 'title'
                    | 'shortDescription'
                    | 'description'
                    | 'primaryEmail'
                    | 'secondaryEmail'
                    | 'leadingMembers'
                  > & {
                    sys: Pick<
                      Sys,
                      | 'id'
                      | 'firstPublishedAt'
                      | 'publishedAt'
                      | 'publishedVersion'
                    >;
                    membersCollection?: Maybe<
                      Pick<WorkingGroupsMembersCollection, 'total'> & {
                        items: Array<
                          Maybe<
                            Pick<WorkingGroupMembership, 'role'> & {
                              sys: Pick<Sys, 'id'>;
                              user?: Maybe<
                                Pick<
                                  Users,
                                  'firstName' | 'lastName' | 'onboarded'
                                > & {
                                  sys: Pick<Sys, 'id'>;
                                  avatar?: Maybe<Pick<Asset, 'url'>>;
                                }
                              >;
                            }
                          >
                        >;
                      }
                    >;
                    milestonesCollection?: Maybe<
                      Pick<WorkingGroupsMilestonesCollection, 'total'> & {
                        items: Array<
                          Maybe<
                            Pick<
                              Milestones,
                              | 'description'
                              | 'externalLink'
                              | 'status'
                              | 'title'
                            > & { sys: Pick<Sys, 'id'> }
                          >
                        >;
                      }
                    >;
                    resourcesCollection?: Maybe<
                      Pick<WorkingGroupsResourcesCollection, 'total'> & {
                        items: Array<
                          Maybe<
                            Pick<
                              Resources,
                              'type' | 'title' | 'description' | 'externalLink'
                            > & { sys: Pick<Sys, 'id'> }
                          >
                        >;
                      }
                    >;
                    calendar?: Maybe<
                      Pick<Calendars, 'name'> & { sys: Pick<Sys, 'id'> }
                    >;
                  }
                >
              >;
            }
          >;
        }>
      >;
    }
  >;
};

export type WorkingGroupsContentDataFragment = Pick<
  WorkingGroups,
  | 'title'
  | 'shortDescription'
  | 'description'
  | 'primaryEmail'
  | 'secondaryEmail'
  | 'leadingMembers'
> & {
  sys: Pick<
    Sys,
    'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
  >;
  membersCollection?: Maybe<
    Pick<WorkingGroupsMembersCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<WorkingGroupMembership, 'role'> & {
            sys: Pick<Sys, 'id'>;
            user?: Maybe<
              Pick<Users, 'firstName' | 'lastName' | 'onboarded'> & {
                sys: Pick<Sys, 'id'>;
                avatar?: Maybe<Pick<Asset, 'url'>>;
              }
            >;
          }
        >
      >;
    }
  >;
  milestonesCollection?: Maybe<
    Pick<WorkingGroupsMilestonesCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<
            Milestones,
            'description' | 'externalLink' | 'status' | 'title'
          > & { sys: Pick<Sys, 'id'> }
        >
      >;
    }
  >;
  resourcesCollection?: Maybe<
    Pick<WorkingGroupsResourcesCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<Resources, 'type' | 'title' | 'description' | 'externalLink'> & {
            sys: Pick<Sys, 'id'>;
          }
        >
      >;
    }
  >;
  calendar?: Maybe<Pick<Calendars, 'name'> & { sys: Pick<Sys, 'id'> }>;
};

export type FetchWorkingGroupByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchWorkingGroupByIdQuery = {
  workingGroups?: Maybe<
    Pick<
      WorkingGroups,
      | 'title'
      | 'shortDescription'
      | 'description'
      | 'primaryEmail'
      | 'secondaryEmail'
      | 'leadingMembers'
    > & {
      sys: Pick<
        Sys,
        'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
      >;
      membersCollection?: Maybe<
        Pick<WorkingGroupsMembersCollection, 'total'> & {
          items: Array<
            Maybe<
              Pick<WorkingGroupMembership, 'role'> & {
                sys: Pick<Sys, 'id'>;
                user?: Maybe<
                  Pick<Users, 'firstName' | 'lastName' | 'onboarded'> & {
                    sys: Pick<Sys, 'id'>;
                    avatar?: Maybe<Pick<Asset, 'url'>>;
                  }
                >;
              }
            >
          >;
        }
      >;
      milestonesCollection?: Maybe<
        Pick<WorkingGroupsMilestonesCollection, 'total'> & {
          items: Array<
            Maybe<
              Pick<
                Milestones,
                'description' | 'externalLink' | 'status' | 'title'
              > & { sys: Pick<Sys, 'id'> }
            >
          >;
        }
      >;
      resourcesCollection?: Maybe<
        Pick<WorkingGroupsResourcesCollection, 'total'> & {
          items: Array<
            Maybe<
              Pick<
                Resources,
                'type' | 'title' | 'description' | 'externalLink'
              > & { sys: Pick<Sys, 'id'> }
            >
          >;
        }
      >;
      calendar?: Maybe<Pick<Calendars, 'name'> & { sys: Pick<Sys, 'id'> }>;
    }
  >;
};

export type FetchWorkingGroupsQueryVariables = Exact<{ [key: string]: never }>;

export type FetchWorkingGroupsQuery = {
  workingGroupsCollection?: Maybe<
    Pick<WorkingGroupsCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<
            WorkingGroups,
            | 'title'
            | 'shortDescription'
            | 'description'
            | 'primaryEmail'
            | 'secondaryEmail'
            | 'leadingMembers'
          > & {
            sys: Pick<
              Sys,
              'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
            >;
            membersCollection?: Maybe<
              Pick<WorkingGroupsMembersCollection, 'total'> & {
                items: Array<
                  Maybe<
                    Pick<WorkingGroupMembership, 'role'> & {
                      sys: Pick<Sys, 'id'>;
                      user?: Maybe<
                        Pick<Users, 'firstName' | 'lastName' | 'onboarded'> & {
                          sys: Pick<Sys, 'id'>;
                          avatar?: Maybe<Pick<Asset, 'url'>>;
                        }
                      >;
                    }
                  >
                >;
              }
            >;
            milestonesCollection?: Maybe<
              Pick<WorkingGroupsMilestonesCollection, 'total'> & {
                items: Array<
                  Maybe<
                    Pick<
                      Milestones,
                      'description' | 'externalLink' | 'status' | 'title'
                    > & { sys: Pick<Sys, 'id'> }
                  >
                >;
              }
            >;
            resourcesCollection?: Maybe<
              Pick<WorkingGroupsResourcesCollection, 'total'> & {
                items: Array<
                  Maybe<
                    Pick<
                      Resources,
                      'type' | 'title' | 'description' | 'externalLink'
                    > & { sys: Pick<Sys, 'id'> }
                  >
                >;
              }
            >;
            calendar?: Maybe<
              Pick<Calendars, 'name'> & { sys: Pick<Sys, 'id'> }
            >;
          }
        >
      >;
    }
  >;
};

export const CalendarsContentDataFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CalendarsContentData' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Calendars' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'publishedAt' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'publishedVersion' },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'googleCalendarId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'googleApiMetadata' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedFrom' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'projectsCollection' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'items' },
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
                              name: { kind: 'Name', value: 'title' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'workingGroupsCollection' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'items' },
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
                              name: { kind: 'Name', value: 'title' },
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
} as unknown as DocumentNode<CalendarsContentDataFragment, unknown>;
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
export const EventsContentDataFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'EventsContentData' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Events' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'publishedAt' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'publishedVersion' },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'endDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'endDateTimeZone' } },
          { kind: 'Field', name: { kind: 'Name', value: 'startDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'startDateTimeZone' } },
          { kind: 'Field', name: { kind: 'Name', value: 'meetingLink' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hideMeetingLink' } },
          { kind: 'Field', name: { kind: 'Name', value: 'eventLink' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hidden' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tags' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'notesPermanentlyUnavailable' },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'notes' },
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
          { kind: 'Field', name: { kind: 'Name', value: 'notesUpdatedAt' } },
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'videoRecordingUpdatedAt' },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'presentationPermanentlyUnavailable' },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'presentation' },
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'presentationUpdatedAt' },
          },
          {
            kind: 'Field',
            name: {
              kind: 'Name',
              value: 'meetingMaterialsPermanentlyUnavailable',
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'meetingMaterials' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'calendar' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'googleCalendarId' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'linkedFrom' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'workingGroupsCollection',
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'items' },
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
                                    name: { kind: 'Name', value: 'title' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'projectsCollection' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'items' },
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
                                    name: { kind: 'Name', value: 'title' },
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
            name: { kind: 'Name', value: 'thumbnail' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'speakersCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '10' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
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
                                name: { kind: 'Name', value: 'ExternalUsers' },
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
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                        },
                                      ],
                                    },
                                  },
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
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'avatar' },
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
} as unknown as DocumentNode<EventsContentDataFragment, unknown>;
export const ExternalUsersContentDataFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ExternalUsersContentData' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'ExternalUsers' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'publishedAt' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'publishedVersion' },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orcid' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ExternalUsersContentDataFragment, unknown>;
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
export const OutputsContentDataFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OutputsContentData' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Outputs' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'publishedAt' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'publishedVersion' },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
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
            name: { kind: 'Name', value: 'relatedEntity' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'Projects' },
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
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'WorkingGroups' },
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
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'authorsCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '10' },
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
                              name: { kind: 'Name', value: 'firstName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'lastName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'email' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'avatar' },
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
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'onboarded' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'InlineFragment',
                        typeCondition: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'ExternalUsers' },
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
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                ],
                              },
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
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<OutputsContentDataFragment, unknown>;
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
export const ProjectsContentDataFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectsContentData' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Projects' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'publishedAt' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'publishedVersion' },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'startDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'endDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'projectProposal' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'pmEmail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'leadEmail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'keywords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'traineeProject' } },
          { kind: 'Field', name: { kind: 'Name', value: 'opportunitiesLink' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'membersCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '50' },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'role' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'user' },
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
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'avatar' },
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
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'milestonesCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '10' },
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
                        name: { kind: 'Name', value: 'description' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'externalLink' },
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
            name: { kind: 'Name', value: 'resourcesCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '10' },
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'calendar' },
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
      },
    },
  ],
} as unknown as DocumentNode<ProjectsContentDataFragment, unknown>;
export const LatestStatsContentDataFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LatestStatsContentData' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'LatestStats' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'sampleCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'articleCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'cohortCount' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LatestStatsContentDataFragment, unknown>;
export const UsersContentDataFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UsersContentData' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Users' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'publishedAt' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'publishedVersion' },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'activatedDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'avatar' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'degrees' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'region' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'alternativeEmail' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'telephoneCountryCode' },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'telephoneNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'keywords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'biography' } },
          { kind: 'Field', name: { kind: 'Name', value: 'questions' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fundingStreams' } },
          { kind: 'Field', name: { kind: 'Name', value: 'blog' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linkedIn' } },
          { kind: 'Field', name: { kind: 'Name', value: 'twitter' } },
          { kind: 'Field', name: { kind: 'Name', value: 'github' } },
          { kind: 'Field', name: { kind: 'Name', value: 'googleScholar' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orcid' } },
          { kind: 'Field', name: { kind: 'Name', value: 'researchGate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'researcherId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'connections' } },
          { kind: 'Field', name: { kind: 'Name', value: 'role' } },
          { kind: 'Field', name: { kind: 'Name', value: 'onboarded' } },
          { kind: 'Field', name: { kind: 'Name', value: 'positions' } },
          { kind: 'Field', name: { kind: 'Name', value: 'activatedDate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'contributingCohortsCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '10' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'contributingCohort' },
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
                              name: { kind: 'Name', value: 'name' },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'role' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'studyLink' },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedFrom' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'projectMembershipCollection' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'limit' },
                      value: { kind: 'IntValue', value: '10' },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'items' },
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
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'role' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'linkedFrom' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'projectsCollection',
                                    },
                                    arguments: [
                                      {
                                        kind: 'Argument',
                                        name: { kind: 'Name', value: 'limit' },
                                        value: { kind: 'IntValue', value: '1' },
                                      },
                                    ],
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'items',
                                          },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'sys',
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
                                                  value: 'title',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'status',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'membersCollection',
                                                },
                                                arguments: [
                                                  {
                                                    kind: 'Argument',
                                                    name: {
                                                      kind: 'Name',
                                                      value: 'limit',
                                                    },
                                                    value: {
                                                      kind: 'IntValue',
                                                      value: '25',
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
                                                        value: 'items',
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
                                                              value: 'user',
                                                            },
                                                            selectionSet: {
                                                              kind: 'SelectionSet',
                                                              selections: [
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value:
                                                                      'sys',
                                                                  },
                                                                  selectionSet:
                                                                    {
                                                                      kind: 'SelectionSet',
                                                                      selections:
                                                                        [
                                                                          {
                                                                            kind: 'Field',
                                                                            name: {
                                                                              kind: 'Name',
                                                                              value:
                                                                                'id',
                                                                            },
                                                                          },
                                                                        ],
                                                                    },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value:
                                                                      'onboarded',
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
                  },
                },
                {
                  kind: 'Field',
                  name: {
                    kind: 'Name',
                    value: 'workingGroupMembershipCollection',
                  },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'limit' },
                      value: { kind: 'IntValue', value: '10' },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'items' },
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
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'role' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'linkedFrom' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'workingGroupsCollection',
                                    },
                                    arguments: [
                                      {
                                        kind: 'Argument',
                                        name: { kind: 'Name', value: 'limit' },
                                        value: { kind: 'IntValue', value: '1' },
                                      },
                                    ],
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'items',
                                          },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'sys',
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
                                                  value: 'title',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'membersCollection',
                                                },
                                                arguments: [
                                                  {
                                                    kind: 'Argument',
                                                    name: {
                                                      kind: 'Name',
                                                      value: 'limit',
                                                    },
                                                    value: {
                                                      kind: 'IntValue',
                                                      value: '25',
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
                                                        value: 'items',
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
                                                              value: 'user',
                                                            },
                                                            selectionSet: {
                                                              kind: 'SelectionSet',
                                                              selections: [
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value:
                                                                      'sys',
                                                                  },
                                                                  selectionSet:
                                                                    {
                                                                      kind: 'SelectionSet',
                                                                      selections:
                                                                        [
                                                                          {
                                                                            kind: 'Field',
                                                                            name: {
                                                                              kind: 'Name',
                                                                              value:
                                                                                'id',
                                                                            },
                                                                          },
                                                                        ],
                                                                    },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value:
                                                                      'onboarded',
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
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UsersContentDataFragment, unknown>;
export const WorkingGroupsContentDataFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'WorkingGroupsContentData' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'WorkingGroups' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'publishedAt' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'publishedVersion' },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shortDescription' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'secondaryEmail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'leadingMembers' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'membersCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '50' },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'role' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'user' },
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
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'avatar' },
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
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'milestonesCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '10' },
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
                        name: { kind: 'Name', value: 'description' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'externalLink' },
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
            name: { kind: 'Name', value: 'resourcesCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '10' },
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'calendar' },
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
      },
    },
  ],
} as unknown as DocumentNode<WorkingGroupsContentDataFragment, unknown>;
export const WorkingGroupNetworkContentDataFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'WorkingGroupNetworkContentData' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'WorkingGroupNetwork' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supportCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '10' },
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
                          value: 'WorkingGroupsContentData',
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
            name: { kind: 'Name', value: 'monogenicCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '10' },
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
                          value: 'WorkingGroupsContentData',
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
            name: { kind: 'Name', value: 'operationalCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '10' },
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
                          value: 'WorkingGroupsContentData',
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
            name: { kind: 'Name', value: 'complexDiseaseCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '10' },
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
                          value: 'WorkingGroupsContentData',
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
    ...WorkingGroupsContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<WorkingGroupNetworkContentDataFragment, unknown>;
export const FetchCalendarByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchCalendarById' },
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
            name: { kind: 'Name', value: 'calendars' },
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
                  name: { kind: 'Name', value: 'CalendarsContentData' },
                },
              ],
            },
          },
        ],
      },
    },
    ...CalendarsContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchCalendarByIdQuery,
  FetchCalendarByIdQueryVariables
>;
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
              name: { kind: 'Name', value: 'CalendarsOrder' },
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
            name: { kind: 'Name', value: 'CalendarsFilter' },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'calendarsCollection' },
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
                        name: { kind: 'Name', value: 'CalendarsContentData' },
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
    ...CalendarsContentDataFragmentDoc.definitions,
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
export const FetchEventByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchEventById' },
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
            name: { kind: 'Name', value: 'events' },
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
                  name: { kind: 'Name', value: 'EventsContentData' },
                },
              ],
            },
          },
        ],
      },
    },
    ...EventsContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchEventByIdQuery, FetchEventByIdQueryVariables>;
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
              name: { kind: 'Name', value: 'EventsOrder' },
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
            name: { kind: 'Name', value: 'EventsFilter' },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'eventsCollection' },
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
                        name: { kind: 'Name', value: 'EventsContentData' },
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
    ...EventsContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchEventsQuery, FetchEventsQueryVariables>;
export const FetchEventsByUserIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchEventsByUserId' },
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
            name: { kind: 'Name', value: 'limit' },
          },
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
            name: { kind: 'Name', value: 'users' },
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
                  name: { kind: 'Name', value: 'linkedFrom' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'eventSpeakersCollection',
                        },
                        arguments: [
                          {
                            kind: 'Argument',
                            name: { kind: 'Name', value: 'limit' },
                            value: { kind: 'IntValue', value: '1' },
                          },
                        ],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'items' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'linkedFrom' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'eventsCollection',
                                          },
                                          arguments: [
                                            {
                                              kind: 'Argument',
                                              name: {
                                                kind: 'Name',
                                                value: 'limit',
                                              },
                                              value: {
                                                kind: 'Variable',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'limit',
                                                },
                                              },
                                            },
                                            {
                                              kind: 'Argument',
                                              name: {
                                                kind: 'Name',
                                                value: 'skip',
                                              },
                                              value: {
                                                kind: 'Variable',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'skip',
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
                                                  value: 'total',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'items',
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'FragmentSpread',
                                                      name: {
                                                        kind: 'Name',
                                                        value:
                                                          'EventsContentData',
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
      },
    },
    ...EventsContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchEventsByUserIdQuery,
  FetchEventsByUserIdQueryVariables
>;
export const FetchEventsByExternalUserIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchEventsByExternalUserId' },
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
            name: { kind: 'Name', value: 'limit' },
          },
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
            name: { kind: 'Name', value: 'externalUsers' },
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
                  name: { kind: 'Name', value: 'linkedFrom' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'eventSpeakersCollection',
                        },
                        arguments: [
                          {
                            kind: 'Argument',
                            name: { kind: 'Name', value: 'limit' },
                            value: { kind: 'IntValue', value: '1' },
                          },
                        ],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'items' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'linkedFrom' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'eventsCollection',
                                          },
                                          arguments: [
                                            {
                                              kind: 'Argument',
                                              name: {
                                                kind: 'Name',
                                                value: 'limit',
                                              },
                                              value: {
                                                kind: 'Variable',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'limit',
                                                },
                                              },
                                            },
                                            {
                                              kind: 'Argument',
                                              name: {
                                                kind: 'Name',
                                                value: 'skip',
                                              },
                                              value: {
                                                kind: 'Variable',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'skip',
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
                                                  value: 'total',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'items',
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'FragmentSpread',
                                                      name: {
                                                        kind: 'Name',
                                                        value:
                                                          'EventsContentData',
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
      },
    },
    ...EventsContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchEventsByExternalUserIdQuery,
  FetchEventsByExternalUserIdQueryVariables
>;
export const FetchProjectCalendarDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchProjectCalendar' },
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
            name: { kind: 'Name', value: 'projects' },
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
                  name: { kind: 'Name', value: 'calendar' },
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
  FetchProjectCalendarQuery,
  FetchProjectCalendarQueryVariables
>;
export const FetchWorkingGroupCalendarDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchWorkingGroupCalendar' },
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
            name: { kind: 'Name', value: 'workingGroups' },
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
                  name: { kind: 'Name', value: 'calendar' },
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
  FetchWorkingGroupCalendarQuery,
  FetchWorkingGroupCalendarQueryVariables
>;
export const FetchExternalUsersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchExternalUsers' },
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
              name: { kind: 'Name', value: 'ExternalUsersOrder' },
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
            name: { kind: 'Name', value: 'ExternalUsersFilter' },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'externalUsersCollection' },
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
                        name: {
                          kind: 'Name',
                          value: 'ExternalUsersContentData',
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
    ...ExternalUsersContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchExternalUsersQuery,
  FetchExternalUsersQueryVariables
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
export const FetchOutputByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchOutputById' },
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
            name: { kind: 'Name', value: 'outputs' },
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
                  name: { kind: 'Name', value: 'OutputsContentData' },
                },
              ],
            },
          },
        ],
      },
    },
    ...OutputsContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchOutputByIdQuery,
  FetchOutputByIdQueryVariables
>;
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
              name: { kind: 'Name', value: 'OutputsOrder' },
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
            name: { kind: 'Name', value: 'OutputsFilter' },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'preview' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'outputsCollection' },
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
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'preview' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'preview' },
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
                        name: { kind: 'Name', value: 'OutputsContentData' },
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
    ...OutputsContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchOutputsQuery, FetchOutputsQueryVariables>;
export const FetchOutputsByWorkingGroupIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchOutputsByWorkingGroupId' },
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
            name: { kind: 'Name', value: 'limit' },
          },
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
            name: { kind: 'Name', value: 'workingGroups' },
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
                  name: { kind: 'Name', value: 'sys' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'linkedFrom' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'outputsCollection' },
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
                        ],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'total' },
                            },
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
                                      value: 'OutputsContentData',
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
    ...OutputsContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchOutputsByWorkingGroupIdQuery,
  FetchOutputsByWorkingGroupIdQueryVariables
>;
export const FetchOutputsByUserIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchOutputsByUserId' },
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
            name: { kind: 'Name', value: 'limit' },
          },
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
            name: { kind: 'Name', value: 'users' },
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
                  name: { kind: 'Name', value: 'sys' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'linkedFrom' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'outputsCollection' },
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
                        ],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'total' },
                            },
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
                                      value: 'OutputsContentData',
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
    ...OutputsContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchOutputsByUserIdQuery,
  FetchOutputsByUserIdQueryVariables
>;
export const FetchOutputsByProjectIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchOutputsByProjectId' },
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
            name: { kind: 'Name', value: 'limit' },
          },
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
            name: { kind: 'Name', value: 'projects' },
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
                  name: { kind: 'Name', value: 'sys' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'linkedFrom' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'outputsCollection' },
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
                        ],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'total' },
                            },
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
                                      value: 'OutputsContentData',
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
    ...OutputsContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchOutputsByProjectIdQuery,
  FetchOutputsByProjectIdQueryVariables
>;
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
export const FetchProjectByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchProjectById' },
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
            name: { kind: 'Name', value: 'projects' },
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
                  name: { kind: 'Name', value: 'ProjectsContentData' },
                },
              ],
            },
          },
        ],
      },
    },
    ...ProjectsContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchProjectByIdQuery,
  FetchProjectByIdQueryVariables
>;
export const FetchProjectsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchProjects' },
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
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'projectsCollection' },
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
                        name: { kind: 'Name', value: 'ProjectsContentData' },
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
    ...ProjectsContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchProjectsQuery, FetchProjectsQueryVariables>;
export const FetchLatestStatsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchLatestStats' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'latestStatsCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '1' },
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
                        name: { kind: 'Name', value: 'LatestStatsContentData' },
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
    ...LatestStatsContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchLatestStatsQuery,
  FetchLatestStatsQueryVariables
>;
export const FetchUserByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchUserById' },
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
            name: { kind: 'Name', value: 'users' },
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
                  name: { kind: 'Name', value: 'UsersContentData' },
                },
              ],
            },
          },
        ],
      },
    },
    ...UsersContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchUserByIdQuery, FetchUserByIdQueryVariables>;
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
              name: { kind: 'Name', value: 'UsersOrder' },
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
            name: { kind: 'Name', value: 'UsersFilter' },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'usersCollection' },
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
                        name: { kind: 'Name', value: 'UsersContentData' },
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
    ...UsersContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchUsersQuery, FetchUsersQueryVariables>;
export const FetchUsersByProjectIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchUsersByProjectId' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'String' },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'projectsCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '20' },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'sys' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'id_in' },
                            value: {
                              kind: 'Variable',
                              name: { kind: 'Name', value: 'id' },
                            },
                          },
                        ],
                      },
                    },
                  ],
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
                        kind: 'Field',
                        name: { kind: 'Name', value: 'membersCollection' },
                        arguments: [
                          {
                            kind: 'Argument',
                            name: { kind: 'Name', value: 'limit' },
                            value: { kind: 'IntValue', value: '25' },
                          },
                        ],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'total' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'items' },
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
                                          name: { kind: 'Name', value: 'sys' },
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
} as unknown as DocumentNode<
  FetchUsersByProjectIdQuery,
  FetchUsersByProjectIdQueryVariables
>;
export const FetchUsersByWorkingGroupIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchUsersByWorkingGroupId' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'String' },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'workingGroupsCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '20' },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'sys' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'id_in' },
                            value: {
                              kind: 'Variable',
                              name: { kind: 'Name', value: 'id' },
                            },
                          },
                        ],
                      },
                    },
                  ],
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
                        kind: 'Field',
                        name: { kind: 'Name', value: 'membersCollection' },
                        arguments: [
                          {
                            kind: 'Argument',
                            name: { kind: 'Name', value: 'limit' },
                            value: { kind: 'IntValue', value: '25' },
                          },
                        ],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'total' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'items' },
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
                                          name: { kind: 'Name', value: 'sys' },
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
} as unknown as DocumentNode<
  FetchUsersByWorkingGroupIdQuery,
  FetchUsersByWorkingGroupIdQueryVariables
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
            name: { kind: 'Name', value: 'workingGroupNetworkCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '1' },
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
                          value: 'WorkingGroupNetworkContentData',
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
    ...WorkingGroupNetworkContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchWorkingGroupNetworkQuery,
  FetchWorkingGroupNetworkQueryVariables
>;
export const FetchWorkingGroupByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchWorkingGroupById' },
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
            name: { kind: 'Name', value: 'workingGroups' },
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
                  name: { kind: 'Name', value: 'WorkingGroupsContentData' },
                },
              ],
            },
          },
        ],
      },
    },
    ...WorkingGroupsContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchWorkingGroupByIdQuery,
  FetchWorkingGroupByIdQueryVariables
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
            name: { kind: 'Name', value: 'workingGroupsCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '50' },
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
                          value: 'WorkingGroupsContentData',
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
    ...WorkingGroupsContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchWorkingGroupsQuery,
  FetchWorkingGroupsQueryVariables
>;
