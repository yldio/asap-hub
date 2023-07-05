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
  interestGroupsCollection?: Maybe<InterestGroupsCollection>;
  newsCollection?: Maybe<NewsCollection>;
  tutorialsCollection?: Maybe<TutorialsCollection>;
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

export type AssetLinkingCollectionsInterestGroupsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<AssetLinkingCollectionsInterestGroupsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type AssetLinkingCollectionsNewsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<AssetLinkingCollectionsNewsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type AssetLinkingCollectionsTutorialsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<AssetLinkingCollectionsTutorialsCollectionOrder>>
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

export enum AssetLinkingCollectionsInterestGroupsCollectionOrder {
  ActiveAsc = 'active_ASC',
  ActiveDesc = 'active_DESC',
  GoogleDriveAsc = 'googleDrive_ASC',
  GoogleDriveDesc = 'googleDrive_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  SlackAsc = 'slack_ASC',
  SlackDesc = 'slack_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export enum AssetLinkingCollectionsNewsCollectionOrder {
  FrequencyAsc = 'frequency_ASC',
  FrequencyDesc = 'frequency_DESC',
  LinkTextAsc = 'linkText_ASC',
  LinkTextDesc = 'linkText_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  PublishDateAsc = 'publishDate_ASC',
  PublishDateDesc = 'publishDate_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export enum AssetLinkingCollectionsTutorialsCollectionOrder {
  LinkTextAsc = 'linkText_ASC',
  LinkTextDesc = 'linkText_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  ShortTextAsc = 'shortText_ASC',
  ShortTextDesc = 'shortText_DESC',
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

export enum AssetLinkingCollectionsUsersCollectionOrder {
  AlumniLocationAsc = 'alumniLocation_ASC',
  AlumniLocationDesc = 'alumniLocation_DESC',
  AlumniSinceDateAsc = 'alumniSinceDate_ASC',
  AlumniSinceDateDesc = 'alumniSinceDate_DESC',
  CityAsc = 'city_ASC',
  CityDesc = 'city_DESC',
  ContactEmailAsc = 'contactEmail_ASC',
  ContactEmailDesc = 'contactEmail_DESC',
  CountryAsc = 'country_ASC',
  CountryDesc = 'country_DESC',
  CreatedDateAsc = 'createdDate_ASC',
  CreatedDateDesc = 'createdDate_DESC',
  DegreeAsc = 'degree_ASC',
  DegreeDesc = 'degree_DESC',
  DismissedGettingStartedAsc = 'dismissedGettingStarted_ASC',
  DismissedGettingStartedDesc = 'dismissedGettingStarted_DESC',
  EmailAsc = 'email_ASC',
  EmailDesc = 'email_DESC',
  FirstNameAsc = 'firstName_ASC',
  FirstNameDesc = 'firstName_DESC',
  GithubAsc = 'github_ASC',
  GithubDesc = 'github_DESC',
  GoogleScholarAsc = 'googleScholar_ASC',
  GoogleScholarDesc = 'googleScholar_DESC',
  InstitutionAsc = 'institution_ASC',
  InstitutionDesc = 'institution_DESC',
  JobTitleAsc = 'jobTitle_ASC',
  JobTitleDesc = 'jobTitle_DESC',
  LastNameAsc = 'lastName_ASC',
  LastNameDesc = 'lastName_DESC',
  LinkedInAsc = 'linkedIn_ASC',
  LinkedInDesc = 'linkedIn_DESC',
  OnboardedAsc = 'onboarded_ASC',
  OnboardedDesc = 'onboarded_DESC',
  OrcidLastModifiedDateAsc = 'orcidLastModifiedDate_ASC',
  OrcidLastModifiedDateDesc = 'orcidLastModifiedDate_DESC',
  OrcidLastSyncDateAsc = 'orcidLastSyncDate_ASC',
  OrcidLastSyncDateDesc = 'orcidLastSyncDate_DESC',
  OrcidAsc = 'orcid_ASC',
  OrcidDesc = 'orcid_DESC',
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
  TwitterAsc = 'twitter_ASC',
  TwitterDesc = 'twitter_DESC',
  Website1Asc = 'website1_ASC',
  Website1Desc = 'website1_DESC',
  Website2Asc = 'website2_ASC',
  Website2Desc = 'website2_DESC',
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

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/calendars) */
export type Calendars = Entry & {
  color?: Maybe<Scalars['String']>;
  contentfulMetadata: ContentfulMetadata;
  googleApiMetadata?: Maybe<Scalars['JSON']>;
  googleCalendarId?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<CalendarsLinkingCollections>;
  name?: Maybe<Scalars['String']>;
  sys: Sys;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/calendars) */
export type CalendarsColorArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/calendars) */
export type CalendarsGoogleApiMetadataArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/calendars) */
export type CalendarsGoogleCalendarIdArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/calendars) */
export type CalendarsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/calendars) */
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
  interestGroupsCollection?: Maybe<InterestGroupsCollection>;
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

export type CalendarsLinkingCollectionsInterestGroupsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<CalendarsLinkingCollectionsInterestGroupsCollectionOrder>>
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

export enum CalendarsLinkingCollectionsInterestGroupsCollectionOrder {
  ActiveAsc = 'active_ASC',
  ActiveDesc = 'active_DESC',
  GoogleDriveAsc = 'googleDrive_ASC',
  GoogleDriveDesc = 'googleDrive_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  SlackAsc = 'slack_ASC',
  SlackDesc = 'slack_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export enum CalendarsLinkingCollectionsWorkingGroupsCollectionOrder {
  CompleteAsc = 'complete_ASC',
  CompleteDesc = 'complete_DESC',
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

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/dashboard) */
export type Dashboard = Entry & {
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<DashboardLinkingCollections>;
  newsCollection?: Maybe<DashboardNewsCollection>;
  pagesCollection?: Maybe<DashboardPagesCollection>;
  sys: Sys;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/dashboard) */
export type DashboardLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/dashboard) */
export type DashboardNewsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<DashboardNewsCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<NewsFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/dashboard) */
export type DashboardPagesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<DashboardPagesCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PagesFilter>;
};

export type DashboardCollection = {
  items: Array<Maybe<Dashboard>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type DashboardFilter = {
  AND?: InputMaybe<Array<InputMaybe<DashboardFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<DashboardFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  news?: InputMaybe<CfNewsNestedFilter>;
  newsCollection_exists?: InputMaybe<Scalars['Boolean']>;
  pages?: InputMaybe<CfPagesNestedFilter>;
  pagesCollection_exists?: InputMaybe<Scalars['Boolean']>;
  sys?: InputMaybe<SysFilter>;
};

export type DashboardLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
};

export type DashboardLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type DashboardNewsCollection = {
  items: Array<Maybe<News>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum DashboardNewsCollectionOrder {
  FrequencyAsc = 'frequency_ASC',
  FrequencyDesc = 'frequency_DESC',
  LinkTextAsc = 'linkText_ASC',
  LinkTextDesc = 'linkText_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  PublishDateAsc = 'publishDate_ASC',
  PublishDateDesc = 'publishDate_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export enum DashboardOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export type DashboardPagesCollection = {
  items: Array<Maybe<Pages>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum DashboardPagesCollectionOrder {
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

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/discover) */
export type Discover = Entry & {
  aboutUs?: Maybe<DiscoverAboutUs>;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<DiscoverLinkingCollections>;
  membersCollection?: Maybe<DiscoverMembersCollection>;
  membersTeam?: Maybe<Teams>;
  pagesCollection?: Maybe<DiscoverPagesCollection>;
  scientificAdvisoryBoardCollection?: Maybe<DiscoverScientificAdvisoryBoardCollection>;
  sys: Sys;
  trainingCollection?: Maybe<DiscoverTrainingCollection>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/discover) */
export type DiscoverAboutUsArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/discover) */
export type DiscoverLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/discover) */
export type DiscoverMembersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<DiscoverMembersCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<UsersFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/discover) */
export type DiscoverMembersTeamArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<TeamsFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/discover) */
export type DiscoverPagesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<DiscoverPagesCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PagesFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/discover) */
export type DiscoverScientificAdvisoryBoardCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<DiscoverScientificAdvisoryBoardCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<UsersFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/discover) */
export type DiscoverTrainingCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<DiscoverTrainingCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TutorialsFilter>;
};

export type DiscoverAboutUs = {
  json: Scalars['JSON'];
  links: DiscoverAboutUsLinks;
};

export type DiscoverAboutUsAssets = {
  block: Array<Maybe<Asset>>;
  hyperlink: Array<Maybe<Asset>>;
};

export type DiscoverAboutUsEntries = {
  block: Array<Maybe<Entry>>;
  hyperlink: Array<Maybe<Entry>>;
  inline: Array<Maybe<Entry>>;
};

export type DiscoverAboutUsLinks = {
  assets: DiscoverAboutUsAssets;
  entries: DiscoverAboutUsEntries;
  resources: DiscoverAboutUsResources;
};

export type DiscoverAboutUsResources = {
  block: Array<ResourceLink>;
};

export type DiscoverCollection = {
  items: Array<Maybe<Discover>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type DiscoverFilter = {
  AND?: InputMaybe<Array<InputMaybe<DiscoverFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<DiscoverFilter>>>;
  aboutUs_contains?: InputMaybe<Scalars['String']>;
  aboutUs_exists?: InputMaybe<Scalars['Boolean']>;
  aboutUs_not_contains?: InputMaybe<Scalars['String']>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  members?: InputMaybe<CfUsersNestedFilter>;
  membersCollection_exists?: InputMaybe<Scalars['Boolean']>;
  membersTeam?: InputMaybe<CfTeamsNestedFilter>;
  membersTeam_exists?: InputMaybe<Scalars['Boolean']>;
  pages?: InputMaybe<CfPagesNestedFilter>;
  pagesCollection_exists?: InputMaybe<Scalars['Boolean']>;
  scientificAdvisoryBoard?: InputMaybe<CfUsersNestedFilter>;
  scientificAdvisoryBoardCollection_exists?: InputMaybe<Scalars['Boolean']>;
  sys?: InputMaybe<SysFilter>;
  training?: InputMaybe<CfTutorialsNestedFilter>;
  trainingCollection_exists?: InputMaybe<Scalars['Boolean']>;
};

export type DiscoverLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
};

export type DiscoverLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type DiscoverMembersCollection = {
  items: Array<Maybe<Users>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum DiscoverMembersCollectionOrder {
  AlumniLocationAsc = 'alumniLocation_ASC',
  AlumniLocationDesc = 'alumniLocation_DESC',
  AlumniSinceDateAsc = 'alumniSinceDate_ASC',
  AlumniSinceDateDesc = 'alumniSinceDate_DESC',
  CityAsc = 'city_ASC',
  CityDesc = 'city_DESC',
  ContactEmailAsc = 'contactEmail_ASC',
  ContactEmailDesc = 'contactEmail_DESC',
  CountryAsc = 'country_ASC',
  CountryDesc = 'country_DESC',
  CreatedDateAsc = 'createdDate_ASC',
  CreatedDateDesc = 'createdDate_DESC',
  DegreeAsc = 'degree_ASC',
  DegreeDesc = 'degree_DESC',
  DismissedGettingStartedAsc = 'dismissedGettingStarted_ASC',
  DismissedGettingStartedDesc = 'dismissedGettingStarted_DESC',
  EmailAsc = 'email_ASC',
  EmailDesc = 'email_DESC',
  FirstNameAsc = 'firstName_ASC',
  FirstNameDesc = 'firstName_DESC',
  GithubAsc = 'github_ASC',
  GithubDesc = 'github_DESC',
  GoogleScholarAsc = 'googleScholar_ASC',
  GoogleScholarDesc = 'googleScholar_DESC',
  InstitutionAsc = 'institution_ASC',
  InstitutionDesc = 'institution_DESC',
  JobTitleAsc = 'jobTitle_ASC',
  JobTitleDesc = 'jobTitle_DESC',
  LastNameAsc = 'lastName_ASC',
  LastNameDesc = 'lastName_DESC',
  LinkedInAsc = 'linkedIn_ASC',
  LinkedInDesc = 'linkedIn_DESC',
  OnboardedAsc = 'onboarded_ASC',
  OnboardedDesc = 'onboarded_DESC',
  OrcidLastModifiedDateAsc = 'orcidLastModifiedDate_ASC',
  OrcidLastModifiedDateDesc = 'orcidLastModifiedDate_DESC',
  OrcidLastSyncDateAsc = 'orcidLastSyncDate_ASC',
  OrcidLastSyncDateDesc = 'orcidLastSyncDate_DESC',
  OrcidAsc = 'orcid_ASC',
  OrcidDesc = 'orcid_DESC',
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
  TwitterAsc = 'twitter_ASC',
  TwitterDesc = 'twitter_DESC',
  Website1Asc = 'website1_ASC',
  Website1Desc = 'website1_DESC',
  Website2Asc = 'website2_ASC',
  Website2Desc = 'website2_DESC',
}

export enum DiscoverOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export type DiscoverPagesCollection = {
  items: Array<Maybe<Pages>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum DiscoverPagesCollectionOrder {
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

export type DiscoverScientificAdvisoryBoardCollection = {
  items: Array<Maybe<Users>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum DiscoverScientificAdvisoryBoardCollectionOrder {
  AlumniLocationAsc = 'alumniLocation_ASC',
  AlumniLocationDesc = 'alumniLocation_DESC',
  AlumniSinceDateAsc = 'alumniSinceDate_ASC',
  AlumniSinceDateDesc = 'alumniSinceDate_DESC',
  CityAsc = 'city_ASC',
  CityDesc = 'city_DESC',
  ContactEmailAsc = 'contactEmail_ASC',
  ContactEmailDesc = 'contactEmail_DESC',
  CountryAsc = 'country_ASC',
  CountryDesc = 'country_DESC',
  CreatedDateAsc = 'createdDate_ASC',
  CreatedDateDesc = 'createdDate_DESC',
  DegreeAsc = 'degree_ASC',
  DegreeDesc = 'degree_DESC',
  DismissedGettingStartedAsc = 'dismissedGettingStarted_ASC',
  DismissedGettingStartedDesc = 'dismissedGettingStarted_DESC',
  EmailAsc = 'email_ASC',
  EmailDesc = 'email_DESC',
  FirstNameAsc = 'firstName_ASC',
  FirstNameDesc = 'firstName_DESC',
  GithubAsc = 'github_ASC',
  GithubDesc = 'github_DESC',
  GoogleScholarAsc = 'googleScholar_ASC',
  GoogleScholarDesc = 'googleScholar_DESC',
  InstitutionAsc = 'institution_ASC',
  InstitutionDesc = 'institution_DESC',
  JobTitleAsc = 'jobTitle_ASC',
  JobTitleDesc = 'jobTitle_DESC',
  LastNameAsc = 'lastName_ASC',
  LastNameDesc = 'lastName_DESC',
  LinkedInAsc = 'linkedIn_ASC',
  LinkedInDesc = 'linkedIn_DESC',
  OnboardedAsc = 'onboarded_ASC',
  OnboardedDesc = 'onboarded_DESC',
  OrcidLastModifiedDateAsc = 'orcidLastModifiedDate_ASC',
  OrcidLastModifiedDateDesc = 'orcidLastModifiedDate_DESC',
  OrcidLastSyncDateAsc = 'orcidLastSyncDate_ASC',
  OrcidLastSyncDateDesc = 'orcidLastSyncDate_DESC',
  OrcidAsc = 'orcid_ASC',
  OrcidDesc = 'orcid_DESC',
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
  TwitterAsc = 'twitter_ASC',
  TwitterDesc = 'twitter_DESC',
  Website1Asc = 'website1_ASC',
  Website1Desc = 'website1_DESC',
  Website2Asc = 'website2_ASC',
  Website2Desc = 'website2_DESC',
}

export type DiscoverTrainingCollection = {
  items: Array<Maybe<Tutorials>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum DiscoverTrainingCollectionOrder {
  LinkTextAsc = 'linkText_ASC',
  LinkTextDesc = 'linkText_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  ShortTextAsc = 'shortText_ASC',
  ShortTextDesc = 'shortText_DESC',
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

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/eventSpeakers) */
export type EventSpeakers = Entry & {
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<EventSpeakersLinkingCollections>;
  sys: Sys;
  team?: Maybe<Teams>;
  user?: Maybe<EventSpeakersUser>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/eventSpeakers) */
export type EventSpeakersLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/eventSpeakers) */
export type EventSpeakersTeamArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<TeamsFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/eventSpeakers) */
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
  team?: InputMaybe<CfTeamsNestedFilter>;
  team_exists?: InputMaybe<Scalars['Boolean']>;
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
}

export type EventSpeakersUser = ExternalAuthors | Users;

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
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

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsCalendarArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<CalendarsFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsEndDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsEndDateTimeZoneArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsEventLinkArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsGoogleIdArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsHiddenArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsHideMeetingLinkArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsMeetingLinkArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsMeetingMaterialsArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsMeetingMaterialsPermanentlyUnavailableArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsNotesArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsNotesPermanentlyUnavailableArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsNotesUpdatedAtArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsPresentationArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsPresentationPermanentlyUnavailableArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsPresentationUpdatedAtArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsSpeakersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<EventsSpeakersCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EventSpeakersFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsStartDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsStartDateTimeZoneArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsStatusArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsTagsArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsThumbnailArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsTitleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsVideoRecordingArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
export type EventsVideoRecordingPermanentlyUnavailableArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/events) */
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
  resources: EventsNotesResources;
};

export type EventsNotesResources = {
  block: Array<ResourceLink>;
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
  resources: EventsPresentationResources;
};

export type EventsPresentationResources = {
  block: Array<ResourceLink>;
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
  resources: EventsVideoRecordingResources;
};

export type EventsVideoRecordingResources = {
  block: Array<ResourceLink>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/externalAuthors) */
export type ExternalAuthors = Entry & {
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<ExternalAuthorsLinkingCollections>;
  name?: Maybe<Scalars['String']>;
  orcid?: Maybe<Scalars['String']>;
  sys: Sys;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/externalAuthors) */
export type ExternalAuthorsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/externalAuthors) */
export type ExternalAuthorsNameArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/externalAuthors) */
export type ExternalAuthorsOrcidArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type ExternalAuthorsCollection = {
  items: Array<Maybe<ExternalAuthors>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type ExternalAuthorsFilter = {
  AND?: InputMaybe<Array<InputMaybe<ExternalAuthorsFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<ExternalAuthorsFilter>>>;
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

export type ExternalAuthorsLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
  eventSpeakersCollection?: Maybe<EventSpeakersCollection>;
};

export type ExternalAuthorsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type ExternalAuthorsLinkingCollectionsEventSpeakersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<
      InputMaybe<ExternalAuthorsLinkingCollectionsEventSpeakersCollectionOrder>
    >
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum ExternalAuthorsLinkingCollectionsEventSpeakersCollectionOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export enum ExternalAuthorsOrder {
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

/** Team's external tools [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/externalTools) */
export type ExternalTools = Entry & {
  contentfulMetadata: ContentfulMetadata;
  description?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<ExternalToolsLinkingCollections>;
  name?: Maybe<Scalars['String']>;
  sys: Sys;
  url?: Maybe<Scalars['String']>;
};

/** Team's external tools [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/externalTools) */
export type ExternalToolsDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** Team's external tools [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/externalTools) */
export type ExternalToolsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** Team's external tools [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/externalTools) */
export type ExternalToolsNameArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** Team's external tools [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/externalTools) */
export type ExternalToolsUrlArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type ExternalToolsCollection = {
  items: Array<Maybe<ExternalTools>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type ExternalToolsFilter = {
  AND?: InputMaybe<Array<InputMaybe<ExternalToolsFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<ExternalToolsFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_exists?: InputMaybe<Scalars['Boolean']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_exists?: InputMaybe<Scalars['Boolean']>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  url?: InputMaybe<Scalars['String']>;
  url_contains?: InputMaybe<Scalars['String']>;
  url_exists?: InputMaybe<Scalars['Boolean']>;
  url_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  url_not?: InputMaybe<Scalars['String']>;
  url_not_contains?: InputMaybe<Scalars['String']>;
  url_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type ExternalToolsLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
  teamsCollection?: Maybe<TeamsCollection>;
};

export type ExternalToolsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type ExternalToolsLinkingCollectionsTeamsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<ExternalToolsLinkingCollectionsTeamsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum ExternalToolsLinkingCollectionsTeamsCollectionOrder {
  ApplicationNumberAsc = 'applicationNumber_ASC',
  ApplicationNumberDesc = 'applicationNumber_DESC',
  DisplayNameAsc = 'displayName_ASC',
  DisplayNameDesc = 'displayName_DESC',
  InactiveSinceAsc = 'inactiveSince_ASC',
  InactiveSinceDesc = 'inactiveSince_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export enum ExternalToolsOrder {
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
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
  UrlAsc = 'url_ASC',
  UrlDesc = 'url_DESC',
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

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/interestGroupLeaders) */
export type InterestGroupLeaders = Entry & {
  contentfulMetadata: ContentfulMetadata;
  inactiveSinceDate?: Maybe<Scalars['DateTime']>;
  linkedFrom?: Maybe<InterestGroupLeadersLinkingCollections>;
  role?: Maybe<Scalars['String']>;
  sys: Sys;
  user?: Maybe<Users>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/interestGroupLeaders) */
export type InterestGroupLeadersInactiveSinceDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/interestGroupLeaders) */
export type InterestGroupLeadersLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/interestGroupLeaders) */
export type InterestGroupLeadersRoleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/interestGroupLeaders) */
export type InterestGroupLeadersUserArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<UsersFilter>;
};

export type InterestGroupLeadersCollection = {
  items: Array<Maybe<InterestGroupLeaders>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type InterestGroupLeadersFilter = {
  AND?: InputMaybe<Array<InputMaybe<InterestGroupLeadersFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<InterestGroupLeadersFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  inactiveSinceDate?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_exists?: InputMaybe<Scalars['Boolean']>;
  inactiveSinceDate_gt?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_gte?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  inactiveSinceDate_lt?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_lte?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_not?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
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

export type InterestGroupLeadersLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
  interestGroupsCollection?: Maybe<InterestGroupsCollection>;
};

export type InterestGroupLeadersLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type InterestGroupLeadersLinkingCollectionsInterestGroupsCollectionArgs =
  {
    limit?: InputMaybe<Scalars['Int']>;
    locale?: InputMaybe<Scalars['String']>;
    order?: InputMaybe<
      Array<
        InputMaybe<InterestGroupLeadersLinkingCollectionsInterestGroupsCollectionOrder>
      >
    >;
    preview?: InputMaybe<Scalars['Boolean']>;
    skip?: InputMaybe<Scalars['Int']>;
  };

export enum InterestGroupLeadersLinkingCollectionsInterestGroupsCollectionOrder {
  ActiveAsc = 'active_ASC',
  ActiveDesc = 'active_DESC',
  GoogleDriveAsc = 'googleDrive_ASC',
  GoogleDriveDesc = 'googleDrive_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  SlackAsc = 'slack_ASC',
  SlackDesc = 'slack_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export enum InterestGroupLeadersOrder {
  InactiveSinceDateAsc = 'inactiveSinceDate_ASC',
  InactiveSinceDateDesc = 'inactiveSinceDate_DESC',
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

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/interestGroups) */
export type InterestGroups = Entry & {
  active?: Maybe<Scalars['Boolean']>;
  calendar?: Maybe<Calendars>;
  contentfulMetadata: ContentfulMetadata;
  description?: Maybe<Scalars['String']>;
  googleDrive?: Maybe<Scalars['String']>;
  leadersCollection?: Maybe<InterestGroupsLeadersCollection>;
  linkedFrom?: Maybe<InterestGroupsLinkingCollections>;
  name?: Maybe<Scalars['String']>;
  slack?: Maybe<Scalars['String']>;
  sys: Sys;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  teamsCollection?: Maybe<InterestGroupsTeamsCollection>;
  thumbnail?: Maybe<Asset>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/interestGroups) */
export type InterestGroupsActiveArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/interestGroups) */
export type InterestGroupsCalendarArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<CalendarsFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/interestGroups) */
export type InterestGroupsDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/interestGroups) */
export type InterestGroupsGoogleDriveArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/interestGroups) */
export type InterestGroupsLeadersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<InterestGroupsLeadersCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<InterestGroupLeadersFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/interestGroups) */
export type InterestGroupsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/interestGroups) */
export type InterestGroupsNameArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/interestGroups) */
export type InterestGroupsSlackArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/interestGroups) */
export type InterestGroupsTagsArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/interestGroups) */
export type InterestGroupsTeamsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<InterestGroupsTeamsCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TeamsFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/interestGroups) */
export type InterestGroupsThumbnailArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type InterestGroupsCollection = {
  items: Array<Maybe<InterestGroups>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type InterestGroupsFilter = {
  AND?: InputMaybe<Array<InputMaybe<InterestGroupsFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<InterestGroupsFilter>>>;
  active?: InputMaybe<Scalars['Boolean']>;
  active_exists?: InputMaybe<Scalars['Boolean']>;
  active_not?: InputMaybe<Scalars['Boolean']>;
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
  googleDrive?: InputMaybe<Scalars['String']>;
  googleDrive_contains?: InputMaybe<Scalars['String']>;
  googleDrive_exists?: InputMaybe<Scalars['Boolean']>;
  googleDrive_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  googleDrive_not?: InputMaybe<Scalars['String']>;
  googleDrive_not_contains?: InputMaybe<Scalars['String']>;
  googleDrive_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  leaders?: InputMaybe<CfInterestGroupLeadersNestedFilter>;
  leadersCollection_exists?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_exists?: InputMaybe<Scalars['Boolean']>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  slack?: InputMaybe<Scalars['String']>;
  slack_contains?: InputMaybe<Scalars['String']>;
  slack_exists?: InputMaybe<Scalars['Boolean']>;
  slack_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  slack_not?: InputMaybe<Scalars['String']>;
  slack_not_contains?: InputMaybe<Scalars['String']>;
  slack_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  tags_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tags_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tags_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tags_exists?: InputMaybe<Scalars['Boolean']>;
  teams?: InputMaybe<CfTeamsNestedFilter>;
  teamsCollection_exists?: InputMaybe<Scalars['Boolean']>;
  thumbnail_exists?: InputMaybe<Scalars['Boolean']>;
};

export type InterestGroupsLeadersCollection = {
  items: Array<Maybe<InterestGroupLeaders>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum InterestGroupsLeadersCollectionOrder {
  InactiveSinceDateAsc = 'inactiveSinceDate_ASC',
  InactiveSinceDateDesc = 'inactiveSinceDate_DESC',
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

export type InterestGroupsLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
};

export type InterestGroupsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum InterestGroupsOrder {
  ActiveAsc = 'active_ASC',
  ActiveDesc = 'active_DESC',
  GoogleDriveAsc = 'googleDrive_ASC',
  GoogleDriveDesc = 'googleDrive_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  SlackAsc = 'slack_ASC',
  SlackDesc = 'slack_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export type InterestGroupsTeamsCollection = {
  items: Array<Maybe<Teams>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum InterestGroupsTeamsCollectionOrder {
  ApplicationNumberAsc = 'applicationNumber_ASC',
  ApplicationNumberDesc = 'applicationNumber_DESC',
  DisplayNameAsc = 'displayName_ASC',
  DisplayNameDesc = 'displayName_DESC',
  InactiveSinceAsc = 'inactiveSince_ASC',
  InactiveSinceDesc = 'inactiveSince_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/labs) */
export type Labs = Entry & {
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<LabsLinkingCollections>;
  name?: Maybe<Scalars['String']>;
  sys: Sys;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/labs) */
export type LabsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/labs) */
export type LabsNameArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type LabsCollection = {
  items: Array<Maybe<Labs>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type LabsFilter = {
  AND?: InputMaybe<Array<InputMaybe<LabsFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<LabsFilter>>>;
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

export type LabsLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
  usersCollection?: Maybe<UsersCollection>;
};

export type LabsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type LabsLinkingCollectionsUsersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<LabsLinkingCollectionsUsersCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum LabsLinkingCollectionsUsersCollectionOrder {
  AlumniLocationAsc = 'alumniLocation_ASC',
  AlumniLocationDesc = 'alumniLocation_DESC',
  AlumniSinceDateAsc = 'alumniSinceDate_ASC',
  AlumniSinceDateDesc = 'alumniSinceDate_DESC',
  CityAsc = 'city_ASC',
  CityDesc = 'city_DESC',
  ContactEmailAsc = 'contactEmail_ASC',
  ContactEmailDesc = 'contactEmail_DESC',
  CountryAsc = 'country_ASC',
  CountryDesc = 'country_DESC',
  CreatedDateAsc = 'createdDate_ASC',
  CreatedDateDesc = 'createdDate_DESC',
  DegreeAsc = 'degree_ASC',
  DegreeDesc = 'degree_DESC',
  DismissedGettingStartedAsc = 'dismissedGettingStarted_ASC',
  DismissedGettingStartedDesc = 'dismissedGettingStarted_DESC',
  EmailAsc = 'email_ASC',
  EmailDesc = 'email_DESC',
  FirstNameAsc = 'firstName_ASC',
  FirstNameDesc = 'firstName_DESC',
  GithubAsc = 'github_ASC',
  GithubDesc = 'github_DESC',
  GoogleScholarAsc = 'googleScholar_ASC',
  GoogleScholarDesc = 'googleScholar_DESC',
  InstitutionAsc = 'institution_ASC',
  InstitutionDesc = 'institution_DESC',
  JobTitleAsc = 'jobTitle_ASC',
  JobTitleDesc = 'jobTitle_DESC',
  LastNameAsc = 'lastName_ASC',
  LastNameDesc = 'lastName_DESC',
  LinkedInAsc = 'linkedIn_ASC',
  LinkedInDesc = 'linkedIn_DESC',
  OnboardedAsc = 'onboarded_ASC',
  OnboardedDesc = 'onboarded_DESC',
  OrcidLastModifiedDateAsc = 'orcidLastModifiedDate_ASC',
  OrcidLastModifiedDateDesc = 'orcidLastModifiedDate_DESC',
  OrcidLastSyncDateAsc = 'orcidLastSyncDate_ASC',
  OrcidLastSyncDateDesc = 'orcidLastSyncDate_DESC',
  OrcidAsc = 'orcid_ASC',
  OrcidDesc = 'orcid_DESC',
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
  TwitterAsc = 'twitter_ASC',
  TwitterDesc = 'twitter_DESC',
  Website1Asc = 'website1_ASC',
  Website1Desc = 'website1_DESC',
  Website2Asc = 'website2_ASC',
  Website2Desc = 'website2_DESC',
}

export enum LabsOrder {
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

/** Videos and PDFs [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/media) */
export type Media = Entry & {
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<MediaLinkingCollections>;
  sys: Sys;
  url?: Maybe<Scalars['String']>;
};

/** Videos and PDFs [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/media) */
export type MediaLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** Videos and PDFs [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/media) */
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

/** Meta data to store the state of content model through migrations [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/migration) */
export type Migration = Entry & {
  contentTypeId?: Maybe<Scalars['String']>;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<MigrationLinkingCollections>;
  state?: Maybe<Scalars['JSON']>;
  sys: Sys;
};

/** Meta data to store the state of content model through migrations [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/migration) */
export type MigrationContentTypeIdArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** Meta data to store the state of content model through migrations [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/migration) */
export type MigrationLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** Meta data to store the state of content model through migrations [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/migration) */
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

/** ASAP Hub News [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/news) */
export type News = Entry & {
  contentfulMetadata: ContentfulMetadata;
  frequency?: Maybe<Scalars['String']>;
  link?: Maybe<Scalars['String']>;
  linkText?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<NewsLinkingCollections>;
  publishDate?: Maybe<Scalars['DateTime']>;
  shortText?: Maybe<Scalars['String']>;
  sys: Sys;
  text?: Maybe<NewsText>;
  thumbnail?: Maybe<Asset>;
  title?: Maybe<Scalars['String']>;
};

/** ASAP Hub News [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/news) */
export type NewsFrequencyArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** ASAP Hub News [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/news) */
export type NewsLinkArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** ASAP Hub News [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/news) */
export type NewsLinkTextArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** ASAP Hub News [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/news) */
export type NewsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** ASAP Hub News [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/news) */
export type NewsPublishDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** ASAP Hub News [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/news) */
export type NewsShortTextArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** ASAP Hub News [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/news) */
export type NewsTextArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** ASAP Hub News [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/news) */
export type NewsThumbnailArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

/** ASAP Hub News [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/news) */
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
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  frequency?: InputMaybe<Scalars['String']>;
  frequency_contains?: InputMaybe<Scalars['String']>;
  frequency_exists?: InputMaybe<Scalars['Boolean']>;
  frequency_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  frequency_not?: InputMaybe<Scalars['String']>;
  frequency_not_contains?: InputMaybe<Scalars['String']>;
  frequency_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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
  thumbnail_exists?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type NewsLinkingCollections = {
  dashboardCollection?: Maybe<DashboardCollection>;
  entryCollection?: Maybe<EntryCollection>;
};

export type NewsLinkingCollectionsDashboardCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<NewsLinkingCollectionsDashboardCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type NewsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum NewsLinkingCollectionsDashboardCollectionOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export enum NewsOrder {
  FrequencyAsc = 'frequency_ASC',
  FrequencyDesc = 'frequency_DESC',
  LinkTextAsc = 'linkText_ASC',
  LinkTextDesc = 'linkText_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  PublishDateAsc = 'publishDate_ASC',
  PublishDateDesc = 'publishDate_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export type NewsText = {
  json: Scalars['JSON'];
  links: NewsTextLinks;
};

export type NewsTextAssets = {
  block: Array<Maybe<Asset>>;
  hyperlink: Array<Maybe<Asset>>;
};

export type NewsTextEntries = {
  block: Array<Maybe<Entry>>;
  hyperlink: Array<Maybe<Entry>>;
  inline: Array<Maybe<Entry>>;
};

export type NewsTextLinks = {
  assets: NewsTextAssets;
  entries: NewsTextEntries;
  resources: NewsTextResources;
};

export type NewsTextResources = {
  block: Array<ResourceLink>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/pages) */
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

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/pages) */
export type PagesLinkArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/pages) */
export type PagesLinkTextArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/pages) */
export type PagesLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/pages) */
export type PagesPathArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/pages) */
export type PagesShortTextArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/pages) */
export type PagesTextArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/pages) */
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
  dashboardCollection?: Maybe<DashboardCollection>;
  discoverCollection?: Maybe<DiscoverCollection>;
  entryCollection?: Maybe<EntryCollection>;
};

export type PagesLinkingCollectionsDashboardCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<PagesLinkingCollectionsDashboardCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type PagesLinkingCollectionsDiscoverCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<PagesLinkingCollectionsDiscoverCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type PagesLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum PagesLinkingCollectionsDashboardCollectionOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export enum PagesLinkingCollectionsDiscoverCollectionOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

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
  resources: PagesTextResources;
};

export type PagesTextResources = {
  block: Array<ResourceLink>;
};

export type Query = {
  asset?: Maybe<Asset>;
  assetCollection?: Maybe<AssetCollection>;
  calendars?: Maybe<Calendars>;
  calendarsCollection?: Maybe<CalendarsCollection>;
  dashboard?: Maybe<Dashboard>;
  dashboardCollection?: Maybe<DashboardCollection>;
  discover?: Maybe<Discover>;
  discoverCollection?: Maybe<DiscoverCollection>;
  entryCollection?: Maybe<EntryCollection>;
  eventSpeakers?: Maybe<EventSpeakers>;
  eventSpeakersCollection?: Maybe<EventSpeakersCollection>;
  events?: Maybe<Events>;
  eventsCollection?: Maybe<EventsCollection>;
  externalAuthors?: Maybe<ExternalAuthors>;
  externalAuthorsCollection?: Maybe<ExternalAuthorsCollection>;
  externalTools?: Maybe<ExternalTools>;
  externalToolsCollection?: Maybe<ExternalToolsCollection>;
  interestGroupLeaders?: Maybe<InterestGroupLeaders>;
  interestGroupLeadersCollection?: Maybe<InterestGroupLeadersCollection>;
  interestGroups?: Maybe<InterestGroups>;
  interestGroupsCollection?: Maybe<InterestGroupsCollection>;
  labs?: Maybe<Labs>;
  labsCollection?: Maybe<LabsCollection>;
  media?: Maybe<Media>;
  mediaCollection?: Maybe<MediaCollection>;
  migration?: Maybe<Migration>;
  migrationCollection?: Maybe<MigrationCollection>;
  news?: Maybe<News>;
  newsCollection?: Maybe<NewsCollection>;
  pages?: Maybe<Pages>;
  pagesCollection?: Maybe<PagesCollection>;
  researchTags?: Maybe<ResearchTags>;
  researchTagsCollection?: Maybe<ResearchTagsCollection>;
  teamMembership?: Maybe<TeamMembership>;
  teamMembershipCollection?: Maybe<TeamMembershipCollection>;
  teams?: Maybe<Teams>;
  teamsCollection?: Maybe<TeamsCollection>;
  tutorials?: Maybe<Tutorials>;
  tutorialsCollection?: Maybe<TutorialsCollection>;
  users?: Maybe<Users>;
  usersCollection?: Maybe<UsersCollection>;
  workingGroupDeliverables?: Maybe<WorkingGroupDeliverables>;
  workingGroupDeliverablesCollection?: Maybe<WorkingGroupDeliverablesCollection>;
  workingGroupLeaders?: Maybe<WorkingGroupLeaders>;
  workingGroupLeadersCollection?: Maybe<WorkingGroupLeadersCollection>;
  workingGroupLeadersOrWorkingGroupMembers?: Maybe<WorkingGroupLeadersOrWorkingGroupMembers>;
  workingGroupLeadersOrWorkingGroupMembersCollection?: Maybe<WorkingGroupLeadersOrWorkingGroupMembersCollection>;
  workingGroupMembers?: Maybe<WorkingGroupMembers>;
  workingGroupMembersCollection?: Maybe<WorkingGroupMembersCollection>;
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

export type QueryDashboardArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryDashboardCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<DashboardOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DashboardFilter>;
};

export type QueryDiscoverArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryDiscoverCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<DiscoverOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DiscoverFilter>;
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

export type QueryExternalAuthorsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryExternalAuthorsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<ExternalAuthorsOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ExternalAuthorsFilter>;
};

export type QueryExternalToolsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryExternalToolsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<ExternalToolsOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ExternalToolsFilter>;
};

export type QueryInterestGroupLeadersArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryInterestGroupLeadersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<InterestGroupLeadersOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<InterestGroupLeadersFilter>;
};

export type QueryInterestGroupsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryInterestGroupsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<InterestGroupsOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<InterestGroupsFilter>;
};

export type QueryLabsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryLabsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<LabsOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<LabsFilter>;
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

export type QueryResearchTagsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryResearchTagsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<ResearchTagsOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ResearchTagsFilter>;
};

export type QueryTeamMembershipArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryTeamMembershipCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<TeamMembershipOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TeamMembershipFilter>;
};

export type QueryTeamsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryTeamsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<TeamsOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TeamsFilter>;
};

export type QueryTutorialsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryTutorialsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<TutorialsOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TutorialsFilter>;
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

export type QueryWorkingGroupDeliverablesArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryWorkingGroupDeliverablesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<WorkingGroupDeliverablesOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<WorkingGroupDeliverablesFilter>;
};

export type QueryWorkingGroupLeadersArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryWorkingGroupLeadersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<WorkingGroupLeadersOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<WorkingGroupLeadersFilter>;
};

export type QueryWorkingGroupLeadersOrWorkingGroupMembersArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryWorkingGroupLeadersOrWorkingGroupMembersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<WorkingGroupLeadersOrWorkingGroupMembersFilter>;
};

export type QueryWorkingGroupMembersArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryWorkingGroupMembersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<WorkingGroupMembersOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<WorkingGroupMembersFilter>;
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

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/researchTags) */
export type ResearchTags = Entry & {
  category?: Maybe<Scalars['String']>;
  contentfulMetadata: ContentfulMetadata;
  entities?: Maybe<Array<Maybe<Scalars['String']>>>;
  linkedFrom?: Maybe<ResearchTagsLinkingCollections>;
  name?: Maybe<Scalars['String']>;
  sys: Sys;
  types?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/researchTags) */
export type ResearchTagsCategoryArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/researchTags) */
export type ResearchTagsEntitiesArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/researchTags) */
export type ResearchTagsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/researchTags) */
export type ResearchTagsNameArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/researchTags) */
export type ResearchTagsTypesArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type ResearchTagsCollection = {
  items: Array<Maybe<ResearchTags>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type ResearchTagsFilter = {
  AND?: InputMaybe<Array<InputMaybe<ResearchTagsFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<ResearchTagsFilter>>>;
  category?: InputMaybe<Scalars['String']>;
  category_contains?: InputMaybe<Scalars['String']>;
  category_exists?: InputMaybe<Scalars['Boolean']>;
  category_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  category_not?: InputMaybe<Scalars['String']>;
  category_not_contains?: InputMaybe<Scalars['String']>;
  category_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  entities_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  entities_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  entities_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  entities_exists?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_exists?: InputMaybe<Scalars['Boolean']>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  types_contains_all?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  types_contains_none?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  types_contains_some?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  types_exists?: InputMaybe<Scalars['Boolean']>;
};

export type ResearchTagsLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
};

export type ResearchTagsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum ResearchTagsOrder {
  CategoryAsc = 'category_ASC',
  CategoryDesc = 'category_DESC',
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

export type ResourceLink = {
  sys: ResourceSys;
};

export type ResourceSys = {
  linkType: Scalars['String'];
  type: Scalars['String'];
  urn: Scalars['String'];
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

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/teamMembership) */
export type TeamMembership = Entry & {
  contentfulMetadata: ContentfulMetadata;
  inactiveSinceDate?: Maybe<Scalars['DateTime']>;
  linkedFrom?: Maybe<TeamMembershipLinkingCollections>;
  role?: Maybe<Scalars['String']>;
  sys: Sys;
  team?: Maybe<Teams>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/teamMembership) */
export type TeamMembershipInactiveSinceDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/teamMembership) */
export type TeamMembershipLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/teamMembership) */
export type TeamMembershipRoleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/teamMembership) */
export type TeamMembershipTeamArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<TeamsFilter>;
};

export type TeamMembershipCollection = {
  items: Array<Maybe<TeamMembership>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type TeamMembershipFilter = {
  AND?: InputMaybe<Array<InputMaybe<TeamMembershipFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<TeamMembershipFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  inactiveSinceDate?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_exists?: InputMaybe<Scalars['Boolean']>;
  inactiveSinceDate_gt?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_gte?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  inactiveSinceDate_lt?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_lte?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_not?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  role?: InputMaybe<Scalars['String']>;
  role_contains?: InputMaybe<Scalars['String']>;
  role_exists?: InputMaybe<Scalars['Boolean']>;
  role_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  role_not?: InputMaybe<Scalars['String']>;
  role_not_contains?: InputMaybe<Scalars['String']>;
  role_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  team?: InputMaybe<CfTeamsNestedFilter>;
  team_exists?: InputMaybe<Scalars['Boolean']>;
};

export type TeamMembershipLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
  usersCollection?: Maybe<UsersCollection>;
};

export type TeamMembershipLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type TeamMembershipLinkingCollectionsUsersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<TeamMembershipLinkingCollectionsUsersCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum TeamMembershipLinkingCollectionsUsersCollectionOrder {
  AlumniLocationAsc = 'alumniLocation_ASC',
  AlumniLocationDesc = 'alumniLocation_DESC',
  AlumniSinceDateAsc = 'alumniSinceDate_ASC',
  AlumniSinceDateDesc = 'alumniSinceDate_DESC',
  CityAsc = 'city_ASC',
  CityDesc = 'city_DESC',
  ContactEmailAsc = 'contactEmail_ASC',
  ContactEmailDesc = 'contactEmail_DESC',
  CountryAsc = 'country_ASC',
  CountryDesc = 'country_DESC',
  CreatedDateAsc = 'createdDate_ASC',
  CreatedDateDesc = 'createdDate_DESC',
  DegreeAsc = 'degree_ASC',
  DegreeDesc = 'degree_DESC',
  DismissedGettingStartedAsc = 'dismissedGettingStarted_ASC',
  DismissedGettingStartedDesc = 'dismissedGettingStarted_DESC',
  EmailAsc = 'email_ASC',
  EmailDesc = 'email_DESC',
  FirstNameAsc = 'firstName_ASC',
  FirstNameDesc = 'firstName_DESC',
  GithubAsc = 'github_ASC',
  GithubDesc = 'github_DESC',
  GoogleScholarAsc = 'googleScholar_ASC',
  GoogleScholarDesc = 'googleScholar_DESC',
  InstitutionAsc = 'institution_ASC',
  InstitutionDesc = 'institution_DESC',
  JobTitleAsc = 'jobTitle_ASC',
  JobTitleDesc = 'jobTitle_DESC',
  LastNameAsc = 'lastName_ASC',
  LastNameDesc = 'lastName_DESC',
  LinkedInAsc = 'linkedIn_ASC',
  LinkedInDesc = 'linkedIn_DESC',
  OnboardedAsc = 'onboarded_ASC',
  OnboardedDesc = 'onboarded_DESC',
  OrcidLastModifiedDateAsc = 'orcidLastModifiedDate_ASC',
  OrcidLastModifiedDateDesc = 'orcidLastModifiedDate_DESC',
  OrcidLastSyncDateAsc = 'orcidLastSyncDate_ASC',
  OrcidLastSyncDateDesc = 'orcidLastSyncDate_DESC',
  OrcidAsc = 'orcid_ASC',
  OrcidDesc = 'orcid_DESC',
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
  TwitterAsc = 'twitter_ASC',
  TwitterDesc = 'twitter_DESC',
  Website1Asc = 'website1_ASC',
  Website1Desc = 'website1_DESC',
  Website2Asc = 'website2_ASC',
  Website2Desc = 'website2_DESC',
}

export enum TeamMembershipOrder {
  InactiveSinceDateAsc = 'inactiveSinceDate_ASC',
  InactiveSinceDateDesc = 'inactiveSinceDate_DESC',
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

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/teams) */
export type Teams = Entry & {
  applicationNumber?: Maybe<Scalars['String']>;
  contentfulMetadata: ContentfulMetadata;
  displayName?: Maybe<Scalars['String']>;
  expertiseAndResourceTags?: Maybe<Array<Maybe<Scalars['String']>>>;
  inactiveSince?: Maybe<Scalars['DateTime']>;
  linkedFrom?: Maybe<TeamsLinkingCollections>;
  projectSummary?: Maybe<Scalars['String']>;
  projectTitle?: Maybe<Scalars['String']>;
  sys: Sys;
  toolsCollection?: Maybe<TeamsToolsCollection>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/teams) */
export type TeamsApplicationNumberArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/teams) */
export type TeamsDisplayNameArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/teams) */
export type TeamsExpertiseAndResourceTagsArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/teams) */
export type TeamsInactiveSinceArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/teams) */
export type TeamsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/teams) */
export type TeamsProjectSummaryArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/teams) */
export type TeamsProjectTitleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/teams) */
export type TeamsToolsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<TeamsToolsCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ExternalToolsFilter>;
};

export type TeamsCollection = {
  items: Array<Maybe<Teams>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type TeamsFilter = {
  AND?: InputMaybe<Array<InputMaybe<TeamsFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<TeamsFilter>>>;
  applicationNumber?: InputMaybe<Scalars['String']>;
  applicationNumber_contains?: InputMaybe<Scalars['String']>;
  applicationNumber_exists?: InputMaybe<Scalars['Boolean']>;
  applicationNumber_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  applicationNumber_not?: InputMaybe<Scalars['String']>;
  applicationNumber_not_contains?: InputMaybe<Scalars['String']>;
  applicationNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  displayName?: InputMaybe<Scalars['String']>;
  displayName_contains?: InputMaybe<Scalars['String']>;
  displayName_exists?: InputMaybe<Scalars['Boolean']>;
  displayName_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  displayName_not?: InputMaybe<Scalars['String']>;
  displayName_not_contains?: InputMaybe<Scalars['String']>;
  displayName_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  expertiseAndResourceTags_contains_all?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >;
  expertiseAndResourceTags_contains_none?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >;
  expertiseAndResourceTags_contains_some?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >;
  expertiseAndResourceTags_exists?: InputMaybe<Scalars['Boolean']>;
  inactiveSince?: InputMaybe<Scalars['DateTime']>;
  inactiveSince_exists?: InputMaybe<Scalars['Boolean']>;
  inactiveSince_gt?: InputMaybe<Scalars['DateTime']>;
  inactiveSince_gte?: InputMaybe<Scalars['DateTime']>;
  inactiveSince_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  inactiveSince_lt?: InputMaybe<Scalars['DateTime']>;
  inactiveSince_lte?: InputMaybe<Scalars['DateTime']>;
  inactiveSince_not?: InputMaybe<Scalars['DateTime']>;
  inactiveSince_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  projectSummary?: InputMaybe<Scalars['String']>;
  projectSummary_contains?: InputMaybe<Scalars['String']>;
  projectSummary_exists?: InputMaybe<Scalars['Boolean']>;
  projectSummary_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  projectSummary_not?: InputMaybe<Scalars['String']>;
  projectSummary_not_contains?: InputMaybe<Scalars['String']>;
  projectSummary_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  projectTitle?: InputMaybe<Scalars['String']>;
  projectTitle_contains?: InputMaybe<Scalars['String']>;
  projectTitle_exists?: InputMaybe<Scalars['Boolean']>;
  projectTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  projectTitle_not?: InputMaybe<Scalars['String']>;
  projectTitle_not_contains?: InputMaybe<Scalars['String']>;
  projectTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  tools?: InputMaybe<CfExternalToolsNestedFilter>;
  toolsCollection_exists?: InputMaybe<Scalars['Boolean']>;
};

export type TeamsLinkingCollections = {
  discoverCollection?: Maybe<DiscoverCollection>;
  entryCollection?: Maybe<EntryCollection>;
  eventSpeakersCollection?: Maybe<EventSpeakersCollection>;
  interestGroupsCollection?: Maybe<InterestGroupsCollection>;
  teamMembershipCollection?: Maybe<TeamMembershipCollection>;
};

export type TeamsLinkingCollectionsDiscoverCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<TeamsLinkingCollectionsDiscoverCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type TeamsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type TeamsLinkingCollectionsEventSpeakersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<TeamsLinkingCollectionsEventSpeakersCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type TeamsLinkingCollectionsInterestGroupsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<TeamsLinkingCollectionsInterestGroupsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type TeamsLinkingCollectionsTeamMembershipCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<TeamsLinkingCollectionsTeamMembershipCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum TeamsLinkingCollectionsDiscoverCollectionOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export enum TeamsLinkingCollectionsEventSpeakersCollectionOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export enum TeamsLinkingCollectionsInterestGroupsCollectionOrder {
  ActiveAsc = 'active_ASC',
  ActiveDesc = 'active_DESC',
  GoogleDriveAsc = 'googleDrive_ASC',
  GoogleDriveDesc = 'googleDrive_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  SlackAsc = 'slack_ASC',
  SlackDesc = 'slack_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export enum TeamsLinkingCollectionsTeamMembershipCollectionOrder {
  InactiveSinceDateAsc = 'inactiveSinceDate_ASC',
  InactiveSinceDateDesc = 'inactiveSinceDate_DESC',
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

export enum TeamsOrder {
  ApplicationNumberAsc = 'applicationNumber_ASC',
  ApplicationNumberDesc = 'applicationNumber_DESC',
  DisplayNameAsc = 'displayName_ASC',
  DisplayNameDesc = 'displayName_DESC',
  InactiveSinceAsc = 'inactiveSince_ASC',
  InactiveSinceDesc = 'inactiveSince_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export type TeamsToolsCollection = {
  items: Array<Maybe<ExternalTools>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum TeamsToolsCollectionOrder {
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
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
  UrlAsc = 'url_ASC',
  UrlDesc = 'url_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/tutorials) */
export type Tutorials = Entry & {
  contentfulMetadata: ContentfulMetadata;
  link?: Maybe<Scalars['String']>;
  linkText?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<TutorialsLinkingCollections>;
  shortText?: Maybe<Scalars['String']>;
  sys: Sys;
  text?: Maybe<TutorialsText>;
  thumbnail?: Maybe<Asset>;
  title?: Maybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/tutorials) */
export type TutorialsLinkArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/tutorials) */
export type TutorialsLinkTextArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/tutorials) */
export type TutorialsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/tutorials) */
export type TutorialsShortTextArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/tutorials) */
export type TutorialsTextArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/tutorials) */
export type TutorialsThumbnailArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/tutorials) */
export type TutorialsTitleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type TutorialsCollection = {
  items: Array<Maybe<Tutorials>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type TutorialsFilter = {
  AND?: InputMaybe<Array<InputMaybe<TutorialsFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<TutorialsFilter>>>;
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
  thumbnail_exists?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type TutorialsLinkingCollections = {
  discoverCollection?: Maybe<DiscoverCollection>;
  entryCollection?: Maybe<EntryCollection>;
};

export type TutorialsLinkingCollectionsDiscoverCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<TutorialsLinkingCollectionsDiscoverCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type TutorialsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum TutorialsLinkingCollectionsDiscoverCollectionOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export enum TutorialsOrder {
  LinkTextAsc = 'linkText_ASC',
  LinkTextDesc = 'linkText_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  ShortTextAsc = 'shortText_ASC',
  ShortTextDesc = 'shortText_DESC',
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

export type TutorialsText = {
  json: Scalars['JSON'];
  links: TutorialsTextLinks;
};

export type TutorialsTextAssets = {
  block: Array<Maybe<Asset>>;
  hyperlink: Array<Maybe<Asset>>;
};

export type TutorialsTextEntries = {
  block: Array<Maybe<Entry>>;
  hyperlink: Array<Maybe<Entry>>;
  inline: Array<Maybe<Entry>>;
};

export type TutorialsTextLinks = {
  assets: TutorialsTextAssets;
  entries: TutorialsTextEntries;
  resources: TutorialsTextResources;
};

export type TutorialsTextResources = {
  block: Array<ResourceLink>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type Users = Entry & {
  adminNotes?: Maybe<Scalars['String']>;
  alumniLocation?: Maybe<Scalars['String']>;
  alumniSinceDate?: Maybe<Scalars['DateTime']>;
  avatar?: Maybe<Asset>;
  biography?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  connections?: Maybe<Array<Maybe<Scalars['String']>>>;
  contactEmail?: Maybe<Scalars['String']>;
  contentfulMetadata: ContentfulMetadata;
  country?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['DateTime']>;
  degree?: Maybe<Scalars['String']>;
  dismissedGettingStarted?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['String']>;
  expertiseAndResourceDescription?: Maybe<Scalars['String']>;
  expertiseAndResourceTags?: Maybe<Array<Maybe<Scalars['String']>>>;
  firstName?: Maybe<Scalars['String']>;
  github?: Maybe<Scalars['String']>;
  googleScholar?: Maybe<Scalars['String']>;
  institution?: Maybe<Scalars['String']>;
  jobTitle?: Maybe<Scalars['String']>;
  labsCollection?: Maybe<UsersLabsCollection>;
  lastName?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<UsersLinkingCollections>;
  linkedIn?: Maybe<Scalars['String']>;
  onboarded?: Maybe<Scalars['Boolean']>;
  orcid?: Maybe<Scalars['String']>;
  orcidLastModifiedDate?: Maybe<Scalars['DateTime']>;
  orcidLastSyncDate?: Maybe<Scalars['DateTime']>;
  orcidWorks?: Maybe<Scalars['JSON']>;
  questions?: Maybe<Array<Maybe<Scalars['String']>>>;
  reachOut?: Maybe<Scalars['String']>;
  researchGate?: Maybe<Scalars['String']>;
  researchInterests?: Maybe<Scalars['String']>;
  researcherId?: Maybe<Scalars['String']>;
  responsibilities?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  sys: Sys;
  teamsCollection?: Maybe<UsersTeamsCollection>;
  twitter?: Maybe<Scalars['String']>;
  website1?: Maybe<Scalars['String']>;
  website2?: Maybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersAdminNotesArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersAlumniLocationArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersAlumniSinceDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersAvatarArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersBiographyArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersCityArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersConnectionsArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersContactEmailArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersCountryArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersCreatedDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersDegreeArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersDismissedGettingStartedArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersEmailArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersExpertiseAndResourceDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersExpertiseAndResourceTagsArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersFirstNameArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersGithubArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersGoogleScholarArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersInstitutionArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersJobTitleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersLabsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<UsersLabsCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<LabsFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersLastNameArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersLinkedInArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersOnboardedArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersOrcidArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersOrcidLastModifiedDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersOrcidLastSyncDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersOrcidWorksArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersQuestionsArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersReachOutArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersResearchGateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersResearchInterestsArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersResearcherIdArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersResponsibilitiesArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersRoleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersTeamsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<UsersTeamsCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TeamMembershipFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersTwitterArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersWebsite1Args = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersWebsite2Args = {
  locale?: InputMaybe<Scalars['String']>;
};

export type UsersCollection = {
  items: Array<Maybe<Users>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type UsersFilter = {
  AND?: InputMaybe<Array<InputMaybe<UsersFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<UsersFilter>>>;
  adminNotes?: InputMaybe<Scalars['String']>;
  adminNotes_contains?: InputMaybe<Scalars['String']>;
  adminNotes_exists?: InputMaybe<Scalars['Boolean']>;
  adminNotes_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  adminNotes_not?: InputMaybe<Scalars['String']>;
  adminNotes_not_contains?: InputMaybe<Scalars['String']>;
  adminNotes_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  alumniLocation?: InputMaybe<Scalars['String']>;
  alumniLocation_contains?: InputMaybe<Scalars['String']>;
  alumniLocation_exists?: InputMaybe<Scalars['Boolean']>;
  alumniLocation_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  alumniLocation_not?: InputMaybe<Scalars['String']>;
  alumniLocation_not_contains?: InputMaybe<Scalars['String']>;
  alumniLocation_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  alumniSinceDate?: InputMaybe<Scalars['DateTime']>;
  alumniSinceDate_exists?: InputMaybe<Scalars['Boolean']>;
  alumniSinceDate_gt?: InputMaybe<Scalars['DateTime']>;
  alumniSinceDate_gte?: InputMaybe<Scalars['DateTime']>;
  alumniSinceDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  alumniSinceDate_lt?: InputMaybe<Scalars['DateTime']>;
  alumniSinceDate_lte?: InputMaybe<Scalars['DateTime']>;
  alumniSinceDate_not?: InputMaybe<Scalars['DateTime']>;
  alumniSinceDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  avatar_exists?: InputMaybe<Scalars['Boolean']>;
  biography?: InputMaybe<Scalars['String']>;
  biography_contains?: InputMaybe<Scalars['String']>;
  biography_exists?: InputMaybe<Scalars['Boolean']>;
  biography_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  biography_not?: InputMaybe<Scalars['String']>;
  biography_not_contains?: InputMaybe<Scalars['String']>;
  biography_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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
  contactEmail?: InputMaybe<Scalars['String']>;
  contactEmail_contains?: InputMaybe<Scalars['String']>;
  contactEmail_exists?: InputMaybe<Scalars['Boolean']>;
  contactEmail_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contactEmail_not?: InputMaybe<Scalars['String']>;
  contactEmail_not_contains?: InputMaybe<Scalars['String']>;
  contactEmail_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  country?: InputMaybe<Scalars['String']>;
  country_contains?: InputMaybe<Scalars['String']>;
  country_exists?: InputMaybe<Scalars['Boolean']>;
  country_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  country_not?: InputMaybe<Scalars['String']>;
  country_not_contains?: InputMaybe<Scalars['String']>;
  country_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  createdDate?: InputMaybe<Scalars['DateTime']>;
  createdDate_exists?: InputMaybe<Scalars['Boolean']>;
  createdDate_gt?: InputMaybe<Scalars['DateTime']>;
  createdDate_gte?: InputMaybe<Scalars['DateTime']>;
  createdDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  createdDate_lt?: InputMaybe<Scalars['DateTime']>;
  createdDate_lte?: InputMaybe<Scalars['DateTime']>;
  createdDate_not?: InputMaybe<Scalars['DateTime']>;
  createdDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  degree?: InputMaybe<Scalars['String']>;
  degree_contains?: InputMaybe<Scalars['String']>;
  degree_exists?: InputMaybe<Scalars['Boolean']>;
  degree_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  degree_not?: InputMaybe<Scalars['String']>;
  degree_not_contains?: InputMaybe<Scalars['String']>;
  degree_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  dismissedGettingStarted?: InputMaybe<Scalars['Boolean']>;
  dismissedGettingStarted_exists?: InputMaybe<Scalars['Boolean']>;
  dismissedGettingStarted_not?: InputMaybe<Scalars['Boolean']>;
  email?: InputMaybe<Scalars['String']>;
  email_contains?: InputMaybe<Scalars['String']>;
  email_exists?: InputMaybe<Scalars['Boolean']>;
  email_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  email_not?: InputMaybe<Scalars['String']>;
  email_not_contains?: InputMaybe<Scalars['String']>;
  email_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  expertiseAndResourceDescription?: InputMaybe<Scalars['String']>;
  expertiseAndResourceDescription_contains?: InputMaybe<Scalars['String']>;
  expertiseAndResourceDescription_exists?: InputMaybe<Scalars['Boolean']>;
  expertiseAndResourceDescription_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >;
  expertiseAndResourceDescription_not?: InputMaybe<Scalars['String']>;
  expertiseAndResourceDescription_not_contains?: InputMaybe<Scalars['String']>;
  expertiseAndResourceDescription_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >;
  expertiseAndResourceTags_contains_all?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >;
  expertiseAndResourceTags_contains_none?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >;
  expertiseAndResourceTags_contains_some?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >;
  expertiseAndResourceTags_exists?: InputMaybe<Scalars['Boolean']>;
  firstName?: InputMaybe<Scalars['String']>;
  firstName_contains?: InputMaybe<Scalars['String']>;
  firstName_exists?: InputMaybe<Scalars['Boolean']>;
  firstName_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  firstName_not?: InputMaybe<Scalars['String']>;
  firstName_not_contains?: InputMaybe<Scalars['String']>;
  firstName_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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
  institution?: InputMaybe<Scalars['String']>;
  institution_contains?: InputMaybe<Scalars['String']>;
  institution_exists?: InputMaybe<Scalars['Boolean']>;
  institution_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  institution_not?: InputMaybe<Scalars['String']>;
  institution_not_contains?: InputMaybe<Scalars['String']>;
  institution_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  jobTitle?: InputMaybe<Scalars['String']>;
  jobTitle_contains?: InputMaybe<Scalars['String']>;
  jobTitle_exists?: InputMaybe<Scalars['Boolean']>;
  jobTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  jobTitle_not?: InputMaybe<Scalars['String']>;
  jobTitle_not_contains?: InputMaybe<Scalars['String']>;
  jobTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  labs?: InputMaybe<CfLabsNestedFilter>;
  labsCollection_exists?: InputMaybe<Scalars['Boolean']>;
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
  orcidLastModifiedDate?: InputMaybe<Scalars['DateTime']>;
  orcidLastModifiedDate_exists?: InputMaybe<Scalars['Boolean']>;
  orcidLastModifiedDate_gt?: InputMaybe<Scalars['DateTime']>;
  orcidLastModifiedDate_gte?: InputMaybe<Scalars['DateTime']>;
  orcidLastModifiedDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  orcidLastModifiedDate_lt?: InputMaybe<Scalars['DateTime']>;
  orcidLastModifiedDate_lte?: InputMaybe<Scalars['DateTime']>;
  orcidLastModifiedDate_not?: InputMaybe<Scalars['DateTime']>;
  orcidLastModifiedDate_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['DateTime']>>
  >;
  orcidLastSyncDate?: InputMaybe<Scalars['DateTime']>;
  orcidLastSyncDate_exists?: InputMaybe<Scalars['Boolean']>;
  orcidLastSyncDate_gt?: InputMaybe<Scalars['DateTime']>;
  orcidLastSyncDate_gte?: InputMaybe<Scalars['DateTime']>;
  orcidLastSyncDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  orcidLastSyncDate_lt?: InputMaybe<Scalars['DateTime']>;
  orcidLastSyncDate_lte?: InputMaybe<Scalars['DateTime']>;
  orcidLastSyncDate_not?: InputMaybe<Scalars['DateTime']>;
  orcidLastSyncDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  orcidWorks_exists?: InputMaybe<Scalars['Boolean']>;
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
  reachOut?: InputMaybe<Scalars['String']>;
  reachOut_contains?: InputMaybe<Scalars['String']>;
  reachOut_exists?: InputMaybe<Scalars['Boolean']>;
  reachOut_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  reachOut_not?: InputMaybe<Scalars['String']>;
  reachOut_not_contains?: InputMaybe<Scalars['String']>;
  reachOut_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  researchGate?: InputMaybe<Scalars['String']>;
  researchGate_contains?: InputMaybe<Scalars['String']>;
  researchGate_exists?: InputMaybe<Scalars['Boolean']>;
  researchGate_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  researchGate_not?: InputMaybe<Scalars['String']>;
  researchGate_not_contains?: InputMaybe<Scalars['String']>;
  researchGate_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  researchInterests?: InputMaybe<Scalars['String']>;
  researchInterests_contains?: InputMaybe<Scalars['String']>;
  researchInterests_exists?: InputMaybe<Scalars['Boolean']>;
  researchInterests_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  researchInterests_not?: InputMaybe<Scalars['String']>;
  researchInterests_not_contains?: InputMaybe<Scalars['String']>;
  researchInterests_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  researcherId?: InputMaybe<Scalars['String']>;
  researcherId_contains?: InputMaybe<Scalars['String']>;
  researcherId_exists?: InputMaybe<Scalars['Boolean']>;
  researcherId_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  researcherId_not?: InputMaybe<Scalars['String']>;
  researcherId_not_contains?: InputMaybe<Scalars['String']>;
  researcherId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  responsibilities?: InputMaybe<Scalars['String']>;
  responsibilities_contains?: InputMaybe<Scalars['String']>;
  responsibilities_exists?: InputMaybe<Scalars['Boolean']>;
  responsibilities_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  responsibilities_not?: InputMaybe<Scalars['String']>;
  responsibilities_not_contains?: InputMaybe<Scalars['String']>;
  responsibilities_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  role?: InputMaybe<Scalars['String']>;
  role_contains?: InputMaybe<Scalars['String']>;
  role_exists?: InputMaybe<Scalars['Boolean']>;
  role_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  role_not?: InputMaybe<Scalars['String']>;
  role_not_contains?: InputMaybe<Scalars['String']>;
  role_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  teams?: InputMaybe<CfTeamMembershipNestedFilter>;
  teamsCollection_exists?: InputMaybe<Scalars['Boolean']>;
  twitter?: InputMaybe<Scalars['String']>;
  twitter_contains?: InputMaybe<Scalars['String']>;
  twitter_exists?: InputMaybe<Scalars['Boolean']>;
  twitter_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  twitter_not?: InputMaybe<Scalars['String']>;
  twitter_not_contains?: InputMaybe<Scalars['String']>;
  twitter_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  website1?: InputMaybe<Scalars['String']>;
  website1_contains?: InputMaybe<Scalars['String']>;
  website1_exists?: InputMaybe<Scalars['Boolean']>;
  website1_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  website1_not?: InputMaybe<Scalars['String']>;
  website1_not_contains?: InputMaybe<Scalars['String']>;
  website1_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  website2?: InputMaybe<Scalars['String']>;
  website2_contains?: InputMaybe<Scalars['String']>;
  website2_exists?: InputMaybe<Scalars['Boolean']>;
  website2_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  website2_not?: InputMaybe<Scalars['String']>;
  website2_not_contains?: InputMaybe<Scalars['String']>;
  website2_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type UsersLabsCollection = {
  items: Array<Maybe<Labs>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum UsersLabsCollectionOrder {
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

export type UsersLinkingCollections = {
  discoverCollection?: Maybe<DiscoverCollection>;
  entryCollection?: Maybe<EntryCollection>;
  eventSpeakersCollection?: Maybe<EventSpeakersCollection>;
  interestGroupLeadersCollection?: Maybe<InterestGroupLeadersCollection>;
  workingGroupLeadersCollection?: Maybe<WorkingGroupLeadersCollection>;
  workingGroupLeadersOrWorkingGroupMembersCollection?: Maybe<WorkingGroupLeadersOrWorkingGroupMembersCollection>;
  workingGroupMembersCollection?: Maybe<WorkingGroupMembersCollection>;
};

export type UsersLinkingCollectionsDiscoverCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<UsersLinkingCollectionsDiscoverCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
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

export type UsersLinkingCollectionsInterestGroupLeadersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<
      InputMaybe<UsersLinkingCollectionsInterestGroupLeadersCollectionOrder>
    >
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type UsersLinkingCollectionsWorkingGroupLeadersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<UsersLinkingCollectionsWorkingGroupLeadersCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type UsersLinkingCollectionsWorkingGroupLeadersOrWorkingGroupMembersCollectionArgs =
  {
    limit?: InputMaybe<Scalars['Int']>;
    locale?: InputMaybe<Scalars['String']>;
    preview?: InputMaybe<Scalars['Boolean']>;
    skip?: InputMaybe<Scalars['Int']>;
  };

export type UsersLinkingCollectionsWorkingGroupMembersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<UsersLinkingCollectionsWorkingGroupMembersCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum UsersLinkingCollectionsDiscoverCollectionOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export enum UsersLinkingCollectionsEventSpeakersCollectionOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export enum UsersLinkingCollectionsInterestGroupLeadersCollectionOrder {
  InactiveSinceDateAsc = 'inactiveSinceDate_ASC',
  InactiveSinceDateDesc = 'inactiveSinceDate_DESC',
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

export enum UsersLinkingCollectionsWorkingGroupLeadersCollectionOrder {
  InactiveSinceDateAsc = 'inactiveSinceDate_ASC',
  InactiveSinceDateDesc = 'inactiveSinceDate_DESC',
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
  WorkstreamRoleAsc = 'workstreamRole_ASC',
  WorkstreamRoleDesc = 'workstreamRole_DESC',
}

export enum UsersLinkingCollectionsWorkingGroupMembersCollectionOrder {
  InactiveSinceDateAsc = 'inactiveSinceDate_ASC',
  InactiveSinceDateDesc = 'inactiveSinceDate_DESC',
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
  AlumniLocationAsc = 'alumniLocation_ASC',
  AlumniLocationDesc = 'alumniLocation_DESC',
  AlumniSinceDateAsc = 'alumniSinceDate_ASC',
  AlumniSinceDateDesc = 'alumniSinceDate_DESC',
  CityAsc = 'city_ASC',
  CityDesc = 'city_DESC',
  ContactEmailAsc = 'contactEmail_ASC',
  ContactEmailDesc = 'contactEmail_DESC',
  CountryAsc = 'country_ASC',
  CountryDesc = 'country_DESC',
  CreatedDateAsc = 'createdDate_ASC',
  CreatedDateDesc = 'createdDate_DESC',
  DegreeAsc = 'degree_ASC',
  DegreeDesc = 'degree_DESC',
  DismissedGettingStartedAsc = 'dismissedGettingStarted_ASC',
  DismissedGettingStartedDesc = 'dismissedGettingStarted_DESC',
  EmailAsc = 'email_ASC',
  EmailDesc = 'email_DESC',
  FirstNameAsc = 'firstName_ASC',
  FirstNameDesc = 'firstName_DESC',
  GithubAsc = 'github_ASC',
  GithubDesc = 'github_DESC',
  GoogleScholarAsc = 'googleScholar_ASC',
  GoogleScholarDesc = 'googleScholar_DESC',
  InstitutionAsc = 'institution_ASC',
  InstitutionDesc = 'institution_DESC',
  JobTitleAsc = 'jobTitle_ASC',
  JobTitleDesc = 'jobTitle_DESC',
  LastNameAsc = 'lastName_ASC',
  LastNameDesc = 'lastName_DESC',
  LinkedInAsc = 'linkedIn_ASC',
  LinkedInDesc = 'linkedIn_DESC',
  OnboardedAsc = 'onboarded_ASC',
  OnboardedDesc = 'onboarded_DESC',
  OrcidLastModifiedDateAsc = 'orcidLastModifiedDate_ASC',
  OrcidLastModifiedDateDesc = 'orcidLastModifiedDate_DESC',
  OrcidLastSyncDateAsc = 'orcidLastSyncDate_ASC',
  OrcidLastSyncDateDesc = 'orcidLastSyncDate_DESC',
  OrcidAsc = 'orcid_ASC',
  OrcidDesc = 'orcid_DESC',
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
  TwitterAsc = 'twitter_ASC',
  TwitterDesc = 'twitter_DESC',
  Website1Asc = 'website1_ASC',
  Website1Desc = 'website1_DESC',
  Website2Asc = 'website2_ASC',
  Website2Desc = 'website2_DESC',
}

export type UsersTeamsCollection = {
  items: Array<Maybe<TeamMembership>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum UsersTeamsCollectionOrder {
  InactiveSinceDateAsc = 'inactiveSinceDate_ASC',
  InactiveSinceDateDesc = 'inactiveSinceDate_DESC',
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

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroupDeliverables) */
export type WorkingGroupDeliverables = Entry & {
  contentfulMetadata: ContentfulMetadata;
  description?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<WorkingGroupDeliverablesLinkingCollections>;
  status?: Maybe<Scalars['String']>;
  sys: Sys;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroupDeliverables) */
export type WorkingGroupDeliverablesDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroupDeliverables) */
export type WorkingGroupDeliverablesLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroupDeliverables) */
export type WorkingGroupDeliverablesStatusArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type WorkingGroupDeliverablesCollection = {
  items: Array<Maybe<WorkingGroupDeliverables>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type WorkingGroupDeliverablesFilter = {
  AND?: InputMaybe<Array<InputMaybe<WorkingGroupDeliverablesFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<WorkingGroupDeliverablesFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_exists?: InputMaybe<Scalars['Boolean']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  status?: InputMaybe<Scalars['String']>;
  status_contains?: InputMaybe<Scalars['String']>;
  status_exists?: InputMaybe<Scalars['Boolean']>;
  status_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  status_not?: InputMaybe<Scalars['String']>;
  status_not_contains?: InputMaybe<Scalars['String']>;
  status_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
};

export type WorkingGroupDeliverablesLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
  workingGroupsCollection?: Maybe<WorkingGroupsCollection>;
};

export type WorkingGroupDeliverablesLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type WorkingGroupDeliverablesLinkingCollectionsWorkingGroupsCollectionArgs =
  {
    limit?: InputMaybe<Scalars['Int']>;
    locale?: InputMaybe<Scalars['String']>;
    order?: InputMaybe<
      Array<
        InputMaybe<WorkingGroupDeliverablesLinkingCollectionsWorkingGroupsCollectionOrder>
      >
    >;
    preview?: InputMaybe<Scalars['Boolean']>;
    skip?: InputMaybe<Scalars['Int']>;
  };

export enum WorkingGroupDeliverablesLinkingCollectionsWorkingGroupsCollectionOrder {
  CompleteAsc = 'complete_ASC',
  CompleteDesc = 'complete_DESC',
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
}

export enum WorkingGroupDeliverablesOrder {
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
}

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroupLeaders) */
export type WorkingGroupLeaders = Entry & {
  contentfulMetadata: ContentfulMetadata;
  inactiveSinceDate?: Maybe<Scalars['DateTime']>;
  linkedFrom?: Maybe<WorkingGroupLeadersLinkingCollections>;
  role?: Maybe<Scalars['String']>;
  sys: Sys;
  user?: Maybe<Users>;
  workstreamRole?: Maybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroupLeaders) */
export type WorkingGroupLeadersInactiveSinceDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroupLeaders) */
export type WorkingGroupLeadersLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroupLeaders) */
export type WorkingGroupLeadersRoleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroupLeaders) */
export type WorkingGroupLeadersUserArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<UsersFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroupLeaders) */
export type WorkingGroupLeadersWorkstreamRoleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type WorkingGroupLeadersCollection = {
  items: Array<Maybe<WorkingGroupLeaders>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type WorkingGroupLeadersFilter = {
  AND?: InputMaybe<Array<InputMaybe<WorkingGroupLeadersFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<WorkingGroupLeadersFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  inactiveSinceDate?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_exists?: InputMaybe<Scalars['Boolean']>;
  inactiveSinceDate_gt?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_gte?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  inactiveSinceDate_lt?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_lte?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_not?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
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
  workstreamRole?: InputMaybe<Scalars['String']>;
  workstreamRole_contains?: InputMaybe<Scalars['String']>;
  workstreamRole_exists?: InputMaybe<Scalars['Boolean']>;
  workstreamRole_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  workstreamRole_not?: InputMaybe<Scalars['String']>;
  workstreamRole_not_contains?: InputMaybe<Scalars['String']>;
  workstreamRole_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type WorkingGroupLeadersLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
  workingGroupsCollection?: Maybe<WorkingGroupsCollection>;
};

export type WorkingGroupLeadersLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type WorkingGroupLeadersLinkingCollectionsWorkingGroupsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<
      InputMaybe<WorkingGroupLeadersLinkingCollectionsWorkingGroupsCollectionOrder>
    >
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum WorkingGroupLeadersLinkingCollectionsWorkingGroupsCollectionOrder {
  CompleteAsc = 'complete_ASC',
  CompleteDesc = 'complete_DESC',
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
}

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroupLeadersOrWorkingGroupMembers) */
export type WorkingGroupLeadersOrWorkingGroupMembers = Entry & {
  contentfulMetadata: ContentfulMetadata;
  inactiveSinceDate?: Maybe<Scalars['DateTime']>;
  linkedFrom?: Maybe<WorkingGroupLeadersOrWorkingGroupMembersLinkingCollections>;
  sys: Sys;
  user?: Maybe<Users>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroupLeadersOrWorkingGroupMembers) */
export type WorkingGroupLeadersOrWorkingGroupMembersInactiveSinceDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroupLeadersOrWorkingGroupMembers) */
export type WorkingGroupLeadersOrWorkingGroupMembersLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroupLeadersOrWorkingGroupMembers) */
export type WorkingGroupLeadersOrWorkingGroupMembersUserArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<UsersFilter>;
};

export type WorkingGroupLeadersOrWorkingGroupMembersCollection = {
  items: Array<Maybe<WorkingGroupLeadersOrWorkingGroupMembers>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type WorkingGroupLeadersOrWorkingGroupMembersFilter = {
  AND?: InputMaybe<
    Array<InputMaybe<WorkingGroupLeadersOrWorkingGroupMembersFilter>>
  >;
  OR?: InputMaybe<
    Array<InputMaybe<WorkingGroupLeadersOrWorkingGroupMembersFilter>>
  >;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  inactiveSinceDate?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_exists?: InputMaybe<Scalars['Boolean']>;
  inactiveSinceDate_gt?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_gte?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  inactiveSinceDate_lt?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_lte?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_not?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  sys?: InputMaybe<SysFilter>;
  user?: InputMaybe<CfUsersNestedFilter>;
  user_exists?: InputMaybe<Scalars['Boolean']>;
};

export type WorkingGroupLeadersOrWorkingGroupMembersLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
};

export type WorkingGroupLeadersOrWorkingGroupMembersLinkingCollectionsEntryCollectionArgs =
  {
    limit?: InputMaybe<Scalars['Int']>;
    locale?: InputMaybe<Scalars['String']>;
    preview?: InputMaybe<Scalars['Boolean']>;
    skip?: InputMaybe<Scalars['Int']>;
  };

export enum WorkingGroupLeadersOrder {
  InactiveSinceDateAsc = 'inactiveSinceDate_ASC',
  InactiveSinceDateDesc = 'inactiveSinceDate_DESC',
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
  WorkstreamRoleAsc = 'workstreamRole_ASC',
  WorkstreamRoleDesc = 'workstreamRole_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroupMembers) */
export type WorkingGroupMembers = Entry & {
  contentfulMetadata: ContentfulMetadata;
  inactiveSinceDate?: Maybe<Scalars['DateTime']>;
  linkedFrom?: Maybe<WorkingGroupMembersLinkingCollections>;
  sys: Sys;
  user?: Maybe<Users>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroupMembers) */
export type WorkingGroupMembersInactiveSinceDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroupMembers) */
export type WorkingGroupMembersLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroupMembers) */
export type WorkingGroupMembersUserArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<UsersFilter>;
};

export type WorkingGroupMembersCollection = {
  items: Array<Maybe<WorkingGroupMembers>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type WorkingGroupMembersFilter = {
  AND?: InputMaybe<Array<InputMaybe<WorkingGroupMembersFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<WorkingGroupMembersFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  inactiveSinceDate?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_exists?: InputMaybe<Scalars['Boolean']>;
  inactiveSinceDate_gt?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_gte?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  inactiveSinceDate_lt?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_lte?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_not?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  sys?: InputMaybe<SysFilter>;
  user?: InputMaybe<CfUsersNestedFilter>;
  user_exists?: InputMaybe<Scalars['Boolean']>;
};

export type WorkingGroupMembersLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
  workingGroupsCollection?: Maybe<WorkingGroupsCollection>;
};

export type WorkingGroupMembersLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type WorkingGroupMembersLinkingCollectionsWorkingGroupsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<
      InputMaybe<WorkingGroupMembersLinkingCollectionsWorkingGroupsCollectionOrder>
    >
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum WorkingGroupMembersLinkingCollectionsWorkingGroupsCollectionOrder {
  CompleteAsc = 'complete_ASC',
  CompleteDesc = 'complete_DESC',
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
}

export enum WorkingGroupMembersOrder {
  InactiveSinceDateAsc = 'inactiveSinceDate_ASC',
  InactiveSinceDateDesc = 'inactiveSinceDate_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroups) */
export type WorkingGroups = Entry & {
  calendars?: Maybe<Calendars>;
  complete?: Maybe<Scalars['Boolean']>;
  contentfulMetadata: ContentfulMetadata;
  deliverablesCollection?: Maybe<WorkingGroupsDeliverablesCollection>;
  description?: Maybe<WorkingGroupsDescription>;
  externalLink?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<WorkingGroupsLinkingCollections>;
  membersCollection?: Maybe<WorkingGroupsMembersCollection>;
  shortText?: Maybe<Scalars['String']>;
  sys: Sys;
  title?: Maybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroups) */
export type WorkingGroupsCalendarsArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<CalendarsFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroups) */
export type WorkingGroupsCompleteArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroups) */
export type WorkingGroupsDeliverablesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<WorkingGroupsDeliverablesCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<WorkingGroupDeliverablesFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroups) */
export type WorkingGroupsDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroups) */
export type WorkingGroupsExternalLinkArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroups) */
export type WorkingGroupsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroups) */
export type WorkingGroupsMembersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<WorkingGroupLeadersOrWorkingGroupMembersFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroups) */
export type WorkingGroupsShortTextArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/workingGroups) */
export type WorkingGroupsTitleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type WorkingGroupsCollection = {
  items: Array<Maybe<WorkingGroups>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type WorkingGroupsDeliverablesCollection = {
  items: Array<Maybe<WorkingGroupDeliverables>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum WorkingGroupsDeliverablesCollectionOrder {
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
}

export type WorkingGroupsDescription = {
  json: Scalars['JSON'];
  links: WorkingGroupsDescriptionLinks;
};

export type WorkingGroupsDescriptionAssets = {
  block: Array<Maybe<Asset>>;
  hyperlink: Array<Maybe<Asset>>;
};

export type WorkingGroupsDescriptionEntries = {
  block: Array<Maybe<Entry>>;
  hyperlink: Array<Maybe<Entry>>;
  inline: Array<Maybe<Entry>>;
};

export type WorkingGroupsDescriptionLinks = {
  assets: WorkingGroupsDescriptionAssets;
  entries: WorkingGroupsDescriptionEntries;
  resources: WorkingGroupsDescriptionResources;
};

export type WorkingGroupsDescriptionResources = {
  block: Array<ResourceLink>;
};

export type WorkingGroupsFilter = {
  AND?: InputMaybe<Array<InputMaybe<WorkingGroupsFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<WorkingGroupsFilter>>>;
  calendars?: InputMaybe<CfCalendarsNestedFilter>;
  calendars_exists?: InputMaybe<Scalars['Boolean']>;
  complete?: InputMaybe<Scalars['Boolean']>;
  complete_exists?: InputMaybe<Scalars['Boolean']>;
  complete_not?: InputMaybe<Scalars['Boolean']>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  deliverables?: InputMaybe<CfWorkingGroupDeliverablesNestedFilter>;
  deliverablesCollection_exists?: InputMaybe<Scalars['Boolean']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_exists?: InputMaybe<Scalars['Boolean']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  externalLink?: InputMaybe<Scalars['String']>;
  externalLink_contains?: InputMaybe<Scalars['String']>;
  externalLink_exists?: InputMaybe<Scalars['Boolean']>;
  externalLink_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  externalLink_not?: InputMaybe<Scalars['String']>;
  externalLink_not_contains?: InputMaybe<Scalars['String']>;
  externalLink_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  members?: InputMaybe<CfWorkingGroupLeadersOrWorkingGroupMembersNestedFilter>;
  membersCollection_exists?: InputMaybe<Scalars['Boolean']>;
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

export type WorkingGroupsLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
};

export type WorkingGroupsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type WorkingGroupsMembersCollection = {
  items: Array<Maybe<WorkingGroupsMembersItem>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type WorkingGroupsMembersItem =
  | WorkingGroupLeaders
  | WorkingGroupMembers;

export enum WorkingGroupsOrder {
  CompleteAsc = 'complete_ASC',
  CompleteDesc = 'complete_DESC',
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

export type CfEventSpeakersNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfEventSpeakersNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfEventSpeakersNestedFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  sys?: InputMaybe<SysFilter>;
  team_exists?: InputMaybe<Scalars['Boolean']>;
  user_exists?: InputMaybe<Scalars['Boolean']>;
};

export type CfExternalToolsNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfExternalToolsNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfExternalToolsNestedFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_exists?: InputMaybe<Scalars['Boolean']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_exists?: InputMaybe<Scalars['Boolean']>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  url?: InputMaybe<Scalars['String']>;
  url_contains?: InputMaybe<Scalars['String']>;
  url_exists?: InputMaybe<Scalars['Boolean']>;
  url_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  url_not?: InputMaybe<Scalars['String']>;
  url_not_contains?: InputMaybe<Scalars['String']>;
  url_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CfInterestGroupLeadersNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfInterestGroupLeadersNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfInterestGroupLeadersNestedFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  inactiveSinceDate?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_exists?: InputMaybe<Scalars['Boolean']>;
  inactiveSinceDate_gt?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_gte?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  inactiveSinceDate_lt?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_lte?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_not?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
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

export type CfLabsNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfLabsNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfLabsNestedFilter>>>;
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

export type CfNewsNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfNewsNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfNewsNestedFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  frequency?: InputMaybe<Scalars['String']>;
  frequency_contains?: InputMaybe<Scalars['String']>;
  frequency_exists?: InputMaybe<Scalars['Boolean']>;
  frequency_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  frequency_not?: InputMaybe<Scalars['String']>;
  frequency_not_contains?: InputMaybe<Scalars['String']>;
  frequency_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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
  thumbnail_exists?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CfPagesNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfPagesNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfPagesNestedFilter>>>;
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

export type CfTeamMembershipNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfTeamMembershipNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfTeamMembershipNestedFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  inactiveSinceDate?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_exists?: InputMaybe<Scalars['Boolean']>;
  inactiveSinceDate_gt?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_gte?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  inactiveSinceDate_lt?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_lte?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_not?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  role?: InputMaybe<Scalars['String']>;
  role_contains?: InputMaybe<Scalars['String']>;
  role_exists?: InputMaybe<Scalars['Boolean']>;
  role_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  role_not?: InputMaybe<Scalars['String']>;
  role_not_contains?: InputMaybe<Scalars['String']>;
  role_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  team_exists?: InputMaybe<Scalars['Boolean']>;
};

export type CfTeamsNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfTeamsNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfTeamsNestedFilter>>>;
  applicationNumber?: InputMaybe<Scalars['String']>;
  applicationNumber_contains?: InputMaybe<Scalars['String']>;
  applicationNumber_exists?: InputMaybe<Scalars['Boolean']>;
  applicationNumber_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  applicationNumber_not?: InputMaybe<Scalars['String']>;
  applicationNumber_not_contains?: InputMaybe<Scalars['String']>;
  applicationNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  displayName?: InputMaybe<Scalars['String']>;
  displayName_contains?: InputMaybe<Scalars['String']>;
  displayName_exists?: InputMaybe<Scalars['Boolean']>;
  displayName_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  displayName_not?: InputMaybe<Scalars['String']>;
  displayName_not_contains?: InputMaybe<Scalars['String']>;
  displayName_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  expertiseAndResourceTags_contains_all?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >;
  expertiseAndResourceTags_contains_none?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >;
  expertiseAndResourceTags_contains_some?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >;
  expertiseAndResourceTags_exists?: InputMaybe<Scalars['Boolean']>;
  inactiveSince?: InputMaybe<Scalars['DateTime']>;
  inactiveSince_exists?: InputMaybe<Scalars['Boolean']>;
  inactiveSince_gt?: InputMaybe<Scalars['DateTime']>;
  inactiveSince_gte?: InputMaybe<Scalars['DateTime']>;
  inactiveSince_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  inactiveSince_lt?: InputMaybe<Scalars['DateTime']>;
  inactiveSince_lte?: InputMaybe<Scalars['DateTime']>;
  inactiveSince_not?: InputMaybe<Scalars['DateTime']>;
  inactiveSince_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  projectSummary?: InputMaybe<Scalars['String']>;
  projectSummary_contains?: InputMaybe<Scalars['String']>;
  projectSummary_exists?: InputMaybe<Scalars['Boolean']>;
  projectSummary_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  projectSummary_not?: InputMaybe<Scalars['String']>;
  projectSummary_not_contains?: InputMaybe<Scalars['String']>;
  projectSummary_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  projectTitle?: InputMaybe<Scalars['String']>;
  projectTitle_contains?: InputMaybe<Scalars['String']>;
  projectTitle_exists?: InputMaybe<Scalars['Boolean']>;
  projectTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  projectTitle_not?: InputMaybe<Scalars['String']>;
  projectTitle_not_contains?: InputMaybe<Scalars['String']>;
  projectTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  toolsCollection_exists?: InputMaybe<Scalars['Boolean']>;
};

export type CfTutorialsNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfTutorialsNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfTutorialsNestedFilter>>>;
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
  thumbnail_exists?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CfUsersNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfUsersNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfUsersNestedFilter>>>;
  adminNotes?: InputMaybe<Scalars['String']>;
  adminNotes_contains?: InputMaybe<Scalars['String']>;
  adminNotes_exists?: InputMaybe<Scalars['Boolean']>;
  adminNotes_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  adminNotes_not?: InputMaybe<Scalars['String']>;
  adminNotes_not_contains?: InputMaybe<Scalars['String']>;
  adminNotes_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  alumniLocation?: InputMaybe<Scalars['String']>;
  alumniLocation_contains?: InputMaybe<Scalars['String']>;
  alumniLocation_exists?: InputMaybe<Scalars['Boolean']>;
  alumniLocation_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  alumniLocation_not?: InputMaybe<Scalars['String']>;
  alumniLocation_not_contains?: InputMaybe<Scalars['String']>;
  alumniLocation_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  alumniSinceDate?: InputMaybe<Scalars['DateTime']>;
  alumniSinceDate_exists?: InputMaybe<Scalars['Boolean']>;
  alumniSinceDate_gt?: InputMaybe<Scalars['DateTime']>;
  alumniSinceDate_gte?: InputMaybe<Scalars['DateTime']>;
  alumniSinceDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  alumniSinceDate_lt?: InputMaybe<Scalars['DateTime']>;
  alumniSinceDate_lte?: InputMaybe<Scalars['DateTime']>;
  alumniSinceDate_not?: InputMaybe<Scalars['DateTime']>;
  alumniSinceDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  avatar_exists?: InputMaybe<Scalars['Boolean']>;
  biography?: InputMaybe<Scalars['String']>;
  biography_contains?: InputMaybe<Scalars['String']>;
  biography_exists?: InputMaybe<Scalars['Boolean']>;
  biography_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  biography_not?: InputMaybe<Scalars['String']>;
  biography_not_contains?: InputMaybe<Scalars['String']>;
  biography_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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
  contactEmail?: InputMaybe<Scalars['String']>;
  contactEmail_contains?: InputMaybe<Scalars['String']>;
  contactEmail_exists?: InputMaybe<Scalars['Boolean']>;
  contactEmail_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contactEmail_not?: InputMaybe<Scalars['String']>;
  contactEmail_not_contains?: InputMaybe<Scalars['String']>;
  contactEmail_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  country?: InputMaybe<Scalars['String']>;
  country_contains?: InputMaybe<Scalars['String']>;
  country_exists?: InputMaybe<Scalars['Boolean']>;
  country_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  country_not?: InputMaybe<Scalars['String']>;
  country_not_contains?: InputMaybe<Scalars['String']>;
  country_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  createdDate?: InputMaybe<Scalars['DateTime']>;
  createdDate_exists?: InputMaybe<Scalars['Boolean']>;
  createdDate_gt?: InputMaybe<Scalars['DateTime']>;
  createdDate_gte?: InputMaybe<Scalars['DateTime']>;
  createdDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  createdDate_lt?: InputMaybe<Scalars['DateTime']>;
  createdDate_lte?: InputMaybe<Scalars['DateTime']>;
  createdDate_not?: InputMaybe<Scalars['DateTime']>;
  createdDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  degree?: InputMaybe<Scalars['String']>;
  degree_contains?: InputMaybe<Scalars['String']>;
  degree_exists?: InputMaybe<Scalars['Boolean']>;
  degree_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  degree_not?: InputMaybe<Scalars['String']>;
  degree_not_contains?: InputMaybe<Scalars['String']>;
  degree_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  dismissedGettingStarted?: InputMaybe<Scalars['Boolean']>;
  dismissedGettingStarted_exists?: InputMaybe<Scalars['Boolean']>;
  dismissedGettingStarted_not?: InputMaybe<Scalars['Boolean']>;
  email?: InputMaybe<Scalars['String']>;
  email_contains?: InputMaybe<Scalars['String']>;
  email_exists?: InputMaybe<Scalars['Boolean']>;
  email_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  email_not?: InputMaybe<Scalars['String']>;
  email_not_contains?: InputMaybe<Scalars['String']>;
  email_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  expertiseAndResourceDescription?: InputMaybe<Scalars['String']>;
  expertiseAndResourceDescription_contains?: InputMaybe<Scalars['String']>;
  expertiseAndResourceDescription_exists?: InputMaybe<Scalars['Boolean']>;
  expertiseAndResourceDescription_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >;
  expertiseAndResourceDescription_not?: InputMaybe<Scalars['String']>;
  expertiseAndResourceDescription_not_contains?: InputMaybe<Scalars['String']>;
  expertiseAndResourceDescription_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >;
  expertiseAndResourceTags_contains_all?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >;
  expertiseAndResourceTags_contains_none?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >;
  expertiseAndResourceTags_contains_some?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >;
  expertiseAndResourceTags_exists?: InputMaybe<Scalars['Boolean']>;
  firstName?: InputMaybe<Scalars['String']>;
  firstName_contains?: InputMaybe<Scalars['String']>;
  firstName_exists?: InputMaybe<Scalars['Boolean']>;
  firstName_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  firstName_not?: InputMaybe<Scalars['String']>;
  firstName_not_contains?: InputMaybe<Scalars['String']>;
  firstName_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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
  institution?: InputMaybe<Scalars['String']>;
  institution_contains?: InputMaybe<Scalars['String']>;
  institution_exists?: InputMaybe<Scalars['Boolean']>;
  institution_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  institution_not?: InputMaybe<Scalars['String']>;
  institution_not_contains?: InputMaybe<Scalars['String']>;
  institution_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  jobTitle?: InputMaybe<Scalars['String']>;
  jobTitle_contains?: InputMaybe<Scalars['String']>;
  jobTitle_exists?: InputMaybe<Scalars['Boolean']>;
  jobTitle_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  jobTitle_not?: InputMaybe<Scalars['String']>;
  jobTitle_not_contains?: InputMaybe<Scalars['String']>;
  jobTitle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  labsCollection_exists?: InputMaybe<Scalars['Boolean']>;
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
  orcidLastModifiedDate?: InputMaybe<Scalars['DateTime']>;
  orcidLastModifiedDate_exists?: InputMaybe<Scalars['Boolean']>;
  orcidLastModifiedDate_gt?: InputMaybe<Scalars['DateTime']>;
  orcidLastModifiedDate_gte?: InputMaybe<Scalars['DateTime']>;
  orcidLastModifiedDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  orcidLastModifiedDate_lt?: InputMaybe<Scalars['DateTime']>;
  orcidLastModifiedDate_lte?: InputMaybe<Scalars['DateTime']>;
  orcidLastModifiedDate_not?: InputMaybe<Scalars['DateTime']>;
  orcidLastModifiedDate_not_in?: InputMaybe<
    Array<InputMaybe<Scalars['DateTime']>>
  >;
  orcidLastSyncDate?: InputMaybe<Scalars['DateTime']>;
  orcidLastSyncDate_exists?: InputMaybe<Scalars['Boolean']>;
  orcidLastSyncDate_gt?: InputMaybe<Scalars['DateTime']>;
  orcidLastSyncDate_gte?: InputMaybe<Scalars['DateTime']>;
  orcidLastSyncDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  orcidLastSyncDate_lt?: InputMaybe<Scalars['DateTime']>;
  orcidLastSyncDate_lte?: InputMaybe<Scalars['DateTime']>;
  orcidLastSyncDate_not?: InputMaybe<Scalars['DateTime']>;
  orcidLastSyncDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  orcidWorks_exists?: InputMaybe<Scalars['Boolean']>;
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
  reachOut?: InputMaybe<Scalars['String']>;
  reachOut_contains?: InputMaybe<Scalars['String']>;
  reachOut_exists?: InputMaybe<Scalars['Boolean']>;
  reachOut_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  reachOut_not?: InputMaybe<Scalars['String']>;
  reachOut_not_contains?: InputMaybe<Scalars['String']>;
  reachOut_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  researchGate?: InputMaybe<Scalars['String']>;
  researchGate_contains?: InputMaybe<Scalars['String']>;
  researchGate_exists?: InputMaybe<Scalars['Boolean']>;
  researchGate_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  researchGate_not?: InputMaybe<Scalars['String']>;
  researchGate_not_contains?: InputMaybe<Scalars['String']>;
  researchGate_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  researchInterests?: InputMaybe<Scalars['String']>;
  researchInterests_contains?: InputMaybe<Scalars['String']>;
  researchInterests_exists?: InputMaybe<Scalars['Boolean']>;
  researchInterests_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  researchInterests_not?: InputMaybe<Scalars['String']>;
  researchInterests_not_contains?: InputMaybe<Scalars['String']>;
  researchInterests_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  researcherId?: InputMaybe<Scalars['String']>;
  researcherId_contains?: InputMaybe<Scalars['String']>;
  researcherId_exists?: InputMaybe<Scalars['Boolean']>;
  researcherId_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  researcherId_not?: InputMaybe<Scalars['String']>;
  researcherId_not_contains?: InputMaybe<Scalars['String']>;
  researcherId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  responsibilities?: InputMaybe<Scalars['String']>;
  responsibilities_contains?: InputMaybe<Scalars['String']>;
  responsibilities_exists?: InputMaybe<Scalars['Boolean']>;
  responsibilities_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  responsibilities_not?: InputMaybe<Scalars['String']>;
  responsibilities_not_contains?: InputMaybe<Scalars['String']>;
  responsibilities_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  role?: InputMaybe<Scalars['String']>;
  role_contains?: InputMaybe<Scalars['String']>;
  role_exists?: InputMaybe<Scalars['Boolean']>;
  role_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  role_not?: InputMaybe<Scalars['String']>;
  role_not_contains?: InputMaybe<Scalars['String']>;
  role_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  teamsCollection_exists?: InputMaybe<Scalars['Boolean']>;
  twitter?: InputMaybe<Scalars['String']>;
  twitter_contains?: InputMaybe<Scalars['String']>;
  twitter_exists?: InputMaybe<Scalars['Boolean']>;
  twitter_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  twitter_not?: InputMaybe<Scalars['String']>;
  twitter_not_contains?: InputMaybe<Scalars['String']>;
  twitter_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  website1?: InputMaybe<Scalars['String']>;
  website1_contains?: InputMaybe<Scalars['String']>;
  website1_exists?: InputMaybe<Scalars['Boolean']>;
  website1_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  website1_not?: InputMaybe<Scalars['String']>;
  website1_not_contains?: InputMaybe<Scalars['String']>;
  website1_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  website2?: InputMaybe<Scalars['String']>;
  website2_contains?: InputMaybe<Scalars['String']>;
  website2_exists?: InputMaybe<Scalars['Boolean']>;
  website2_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  website2_not?: InputMaybe<Scalars['String']>;
  website2_not_contains?: InputMaybe<Scalars['String']>;
  website2_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CfWorkingGroupDeliverablesNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfWorkingGroupDeliverablesNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfWorkingGroupDeliverablesNestedFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_exists?: InputMaybe<Scalars['Boolean']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  status?: InputMaybe<Scalars['String']>;
  status_contains?: InputMaybe<Scalars['String']>;
  status_exists?: InputMaybe<Scalars['Boolean']>;
  status_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  status_not?: InputMaybe<Scalars['String']>;
  status_not_contains?: InputMaybe<Scalars['String']>;
  status_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
};

export type CfWorkingGroupLeadersOrWorkingGroupMembersNestedFilter = {
  AND?: InputMaybe<
    Array<InputMaybe<CfWorkingGroupLeadersOrWorkingGroupMembersNestedFilter>>
  >;
  OR?: InputMaybe<
    Array<InputMaybe<CfWorkingGroupLeadersOrWorkingGroupMembersNestedFilter>>
  >;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  inactiveSinceDate?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_exists?: InputMaybe<Scalars['Boolean']>;
  inactiveSinceDate_gt?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_gte?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  inactiveSinceDate_lt?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_lte?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_not?: InputMaybe<Scalars['DateTime']>;
  inactiveSinceDate_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  sys?: InputMaybe<SysFilter>;
  user_exists?: InputMaybe<Scalars['Boolean']>;
};

export type CalendarsContentFragment = Pick<
  Calendars,
  'googleCalendarId' | 'name' | 'color' | 'googleApiMetadata'
> & {
  sys: Pick<
    Sys,
    'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
  >;
  linkedFrom?: Maybe<{
    workingGroupsCollection?: Maybe<{
      items: Array<
        Maybe<Pick<WorkingGroups, 'complete'> & { sys: Pick<Sys, 'id'> }>
      >;
    }>;
    interestGroupsCollection?: Maybe<{
      items: Array<
        Maybe<Pick<InterestGroups, 'active'> & { sys: Pick<Sys, 'id'> }>
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
        workingGroupsCollection?: Maybe<{
          items: Array<
            Maybe<Pick<WorkingGroups, 'complete'> & { sys: Pick<Sys, 'id'> }>
          >;
        }>;
        interestGroupsCollection?: Maybe<{
          items: Array<
            Maybe<Pick<InterestGroups, 'active'> & { sys: Pick<Sys, 'id'> }>
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
              workingGroupsCollection?: Maybe<{
                items: Array<
                  Maybe<
                    Pick<WorkingGroups, 'complete'> & { sys: Pick<Sys, 'id'> }
                  >
                >;
              }>;
              interestGroupsCollection?: Maybe<{
                items: Array<
                  Maybe<
                    Pick<InterestGroups, 'active'> & { sys: Pick<Sys, 'id'> }
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

export type FetchDashboardQueryVariables = Exact<{ [key: string]: never }>;

export type FetchDashboardQuery = {
  dashboardCollection?: Maybe<{
    items: Array<
      Maybe<{
        newsCollection?: Maybe<{
          items: Array<
            Maybe<
              Pick<
                News,
                | 'title'
                | 'shortText'
                | 'frequency'
                | 'link'
                | 'linkText'
                | 'publishDate'
              > & {
                sys: Pick<Sys, 'id' | 'firstPublishedAt'>;
                thumbnail?: Maybe<Pick<Asset, 'url'>>;
                text?: Maybe<
                  Pick<NewsText, 'json'> & {
                    links: {
                      entries: {
                        inline: Array<
                          Maybe<
                            | ({ __typename: 'Calendars' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Dashboard' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Discover' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'EventSpeakers' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Events' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'ExternalAuthors' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'ExternalTools' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'InterestGroupLeaders' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'InterestGroups' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Labs' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                                  sys: Pick<Sys, 'id'>;
                                })
                            | ({ __typename: 'Migration' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'News' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Pages' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'ResearchTags' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'TeamMembership' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Teams' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Tutorials' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Users' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'WorkingGroupDeliverables' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'WorkingGroupLeaders' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({
                                __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                              } & { sys: Pick<Sys, 'id'> })
                            | ({ __typename: 'WorkingGroupMembers' } & {
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
        }>;
        pagesCollection?: Maybe<{
          items: Array<
            Maybe<
              Pick<
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
                            | ({ __typename: 'Calendars' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Dashboard' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Discover' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'EventSpeakers' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Events' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'ExternalAuthors' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'ExternalTools' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'InterestGroupLeaders' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'InterestGroups' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Labs' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                                  sys: Pick<Sys, 'id'>;
                                })
                            | ({ __typename: 'Migration' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'News' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Pages' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'ResearchTags' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'TeamMembership' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Teams' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Tutorials' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Users' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'WorkingGroupDeliverables' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'WorkingGroupLeaders' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({
                                __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                              } & { sys: Pick<Sys, 'id'> })
                            | ({ __typename: 'WorkingGroupMembers' } & {
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
        }>;
      }>
    >;
  }>;
};

export type PartialUsersContentFragment = Pick<
  Users,
  'email' | 'firstName' | 'institution' | 'jobTitle' | 'lastName'
> & {
  sys: Pick<
    Sys,
    'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
  >;
  avatar?: Maybe<Pick<Asset, 'url'>>;
};

export type FetchDiscoverQueryVariables = Exact<{ [key: string]: never }>;

export type FetchDiscoverQuery = {
  discoverCollection?: Maybe<{
    items: Array<
      Maybe<{
        pagesCollection?: Maybe<{
          items: Array<
            Maybe<
              Pick<
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
                            | ({ __typename: 'Calendars' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Dashboard' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Discover' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'EventSpeakers' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Events' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'ExternalAuthors' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'ExternalTools' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'InterestGroupLeaders' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'InterestGroups' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Labs' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                                  sys: Pick<Sys, 'id'>;
                                })
                            | ({ __typename: 'Migration' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'News' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Pages' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'ResearchTags' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'TeamMembership' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Teams' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Tutorials' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Users' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'WorkingGroupDeliverables' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'WorkingGroupLeaders' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({
                                __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                              } & { sys: Pick<Sys, 'id'> })
                            | ({ __typename: 'WorkingGroupMembers' } & {
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
        }>;
        trainingCollection?: Maybe<{
          items: Array<
            Maybe<
              Pick<Tutorials, 'title' | 'shortText' | 'link' | 'linkText'> & {
                sys: Pick<Sys, 'id' | 'firstPublishedAt'>;
                thumbnail?: Maybe<Pick<Asset, 'url'>>;
                text?: Maybe<
                  Pick<TutorialsText, 'json'> & {
                    links: {
                      entries: {
                        inline: Array<
                          Maybe<
                            | ({ __typename: 'Calendars' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Dashboard' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Discover' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'EventSpeakers' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Events' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'ExternalAuthors' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'ExternalTools' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'InterestGroupLeaders' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'InterestGroups' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Labs' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                                  sys: Pick<Sys, 'id'>;
                                })
                            | ({ __typename: 'Migration' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'News' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Pages' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'ResearchTags' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'TeamMembership' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Teams' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Tutorials' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'Users' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'WorkingGroupDeliverables' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({ __typename: 'WorkingGroupLeaders' } & {
                                sys: Pick<Sys, 'id'>;
                              })
                            | ({
                                __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                              } & { sys: Pick<Sys, 'id'> })
                            | ({ __typename: 'WorkingGroupMembers' } & {
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
        }>;
        aboutUs?: Maybe<
          Pick<DiscoverAboutUs, 'json'> & {
            links: {
              entries: {
                inline: Array<
                  Maybe<
                    | ({ __typename: 'Calendars' } & { sys: Pick<Sys, 'id'> })
                    | ({ __typename: 'Dashboard' } & { sys: Pick<Sys, 'id'> })
                    | ({ __typename: 'Discover' } & { sys: Pick<Sys, 'id'> })
                    | ({ __typename: 'EventSpeakers' } & {
                        sys: Pick<Sys, 'id'>;
                      })
                    | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                    | ({ __typename: 'ExternalAuthors' } & {
                        sys: Pick<Sys, 'id'>;
                      })
                    | ({ __typename: 'ExternalTools' } & {
                        sys: Pick<Sys, 'id'>;
                      })
                    | ({ __typename: 'InterestGroupLeaders' } & {
                        sys: Pick<Sys, 'id'>;
                      })
                    | ({ __typename: 'InterestGroups' } & {
                        sys: Pick<Sys, 'id'>;
                      })
                    | ({ __typename: 'Labs' } & { sys: Pick<Sys, 'id'> })
                    | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                          sys: Pick<Sys, 'id'>;
                        })
                    | ({ __typename: 'Migration' } & { sys: Pick<Sys, 'id'> })
                    | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
                    | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
                    | ({ __typename: 'ResearchTags' } & {
                        sys: Pick<Sys, 'id'>;
                      })
                    | ({ __typename: 'TeamMembership' } & {
                        sys: Pick<Sys, 'id'>;
                      })
                    | ({ __typename: 'Teams' } & { sys: Pick<Sys, 'id'> })
                    | ({ __typename: 'Tutorials' } & { sys: Pick<Sys, 'id'> })
                    | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
                    | ({ __typename: 'WorkingGroupDeliverables' } & {
                        sys: Pick<Sys, 'id'>;
                      })
                    | ({ __typename: 'WorkingGroupLeaders' } & {
                        sys: Pick<Sys, 'id'>;
                      })
                    | ({
                        __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                      } & { sys: Pick<Sys, 'id'> })
                    | ({ __typename: 'WorkingGroupMembers' } & {
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
                      'url' | 'description' | 'contentType' | 'width' | 'height'
                    > & { sys: Pick<Sys, 'id'> }
                  >
                >;
              };
            };
          }
        >;
        membersCollection?: Maybe<{
          items: Array<
            Maybe<
              Pick<
                Users,
                'email' | 'firstName' | 'institution' | 'jobTitle' | 'lastName'
              > & {
                sys: Pick<
                  Sys,
                  'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
                >;
                avatar?: Maybe<Pick<Asset, 'url'>>;
              }
            >
          >;
        }>;
        membersTeam?: Maybe<{ sys: Pick<Sys, 'id'> }>;
        scientificAdvisoryBoardCollection?: Maybe<{
          items: Array<
            Maybe<
              Pick<
                Users,
                'email' | 'firstName' | 'institution' | 'jobTitle' | 'lastName'
              > & {
                sys: Pick<
                  Sys,
                  'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
                >;
                avatar?: Maybe<Pick<Asset, 'url'>>;
              }
            >
          >;
        }>;
      }>
    >;
  }>;
};

export type EventsContentFragment = Pick<
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
              | ({ __typename: 'Dashboard' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Discover' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ExternalAuthors' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ExternalTools' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'InterestGroupLeaders' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'InterestGroups' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Labs' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                    sys: Pick<Sys, 'id'>;
                  })
              | ({ __typename: 'Migration' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ResearchTags' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'TeamMembership' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Teams' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Tutorials' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'WorkingGroupDeliverables' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupLeaders' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupLeadersOrWorkingGroupMembers' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupMembers' } & {
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
              | ({ __typename: 'Dashboard' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Discover' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ExternalAuthors' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ExternalTools' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'InterestGroupLeaders' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'InterestGroups' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Labs' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                    sys: Pick<Sys, 'id'>;
                  })
              | ({ __typename: 'Migration' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ResearchTags' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'TeamMembership' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Teams' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Tutorials' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'WorkingGroupDeliverables' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupLeaders' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupLeadersOrWorkingGroupMembers' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupMembers' } & {
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
              | ({ __typename: 'Dashboard' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Discover' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ExternalAuthors' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ExternalTools' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'InterestGroupLeaders' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'InterestGroups' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Labs' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                    sys: Pick<Sys, 'id'>;
                  })
              | ({ __typename: 'Migration' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ResearchTags' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'TeamMembership' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Teams' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Tutorials' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'WorkingGroupDeliverables' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupLeaders' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupLeadersOrWorkingGroupMembers' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupMembers' } & {
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
        interestGroupsCollection?: Maybe<{
          items: Array<
            Maybe<
              Pick<
                InterestGroups,
                'name' | 'active' | 'slack' | 'googleDrive'
              > & { sys: Pick<Sys, 'id'> }
            >
          >;
        }>;
      }>;
    }
  >;
  thumbnail?: Maybe<Pick<Asset, 'url'>>;
  speakersCollection?: Maybe<{
    items: Array<
      Maybe<{
        team?: Maybe<
          Pick<Teams, 'displayName' | 'inactiveSince'> & {
            sys: Pick<Sys, 'id'>;
          }
        >;
        user?: Maybe<
          | ({ __typename: 'ExternalAuthors' } & Pick<
              ExternalAuthors,
              'name' | 'orcid'
            >)
          | ({ __typename: 'Users' } & Pick<
              Users,
              | 'alumniSinceDate'
              | 'alumniLocation'
              | 'firstName'
              | 'lastName'
              | 'onboarded'
            > & {
                sys: Pick<Sys, 'id'>;
                teamsCollection?: Maybe<{
                  items: Array<
                    Maybe<
                      Pick<TeamMembership, 'role'> & { sys: Pick<Sys, 'id'> }
                    >
                  >;
                }>;
                avatar?: Maybe<Pick<Asset, 'url'>>;
              })
        >;
      }>
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
                  | ({ __typename: 'Dashboard' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Discover' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ExternalAuthors' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'ExternalTools' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'InterestGroupLeaders' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'InterestGroups' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'Labs' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                        sys: Pick<Sys, 'id'>;
                      })
                  | ({ __typename: 'Migration' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ResearchTags' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'TeamMembership' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'Teams' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Tutorials' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'WorkingGroupDeliverables' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'WorkingGroupLeaders' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({
                      __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                    } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'WorkingGroupMembers' } & {
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
                  | ({ __typename: 'Dashboard' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Discover' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ExternalAuthors' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'ExternalTools' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'InterestGroupLeaders' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'InterestGroups' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'Labs' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                        sys: Pick<Sys, 'id'>;
                      })
                  | ({ __typename: 'Migration' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ResearchTags' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'TeamMembership' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'Teams' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Tutorials' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'WorkingGroupDeliverables' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'WorkingGroupLeaders' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({
                      __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                    } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'WorkingGroupMembers' } & {
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
                  | ({ __typename: 'Dashboard' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Discover' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ExternalAuthors' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'ExternalTools' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'InterestGroupLeaders' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'InterestGroups' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'Labs' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                        sys: Pick<Sys, 'id'>;
                      })
                  | ({ __typename: 'Migration' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ResearchTags' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'TeamMembership' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'Teams' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Tutorials' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'WorkingGroupDeliverables' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'WorkingGroupLeaders' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({
                      __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                    } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'WorkingGroupMembers' } & {
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
            interestGroupsCollection?: Maybe<{
              items: Array<
                Maybe<
                  Pick<
                    InterestGroups,
                    'name' | 'active' | 'slack' | 'googleDrive'
                  > & { sys: Pick<Sys, 'id'> }
                >
              >;
            }>;
          }>;
        }
      >;
      thumbnail?: Maybe<Pick<Asset, 'url'>>;
      speakersCollection?: Maybe<{
        items: Array<
          Maybe<{
            team?: Maybe<
              Pick<Teams, 'displayName' | 'inactiveSince'> & {
                sys: Pick<Sys, 'id'>;
              }
            >;
            user?: Maybe<
              | ({ __typename: 'ExternalAuthors' } & Pick<
                  ExternalAuthors,
                  'name' | 'orcid'
                >)
              | ({ __typename: 'Users' } & Pick<
                  Users,
                  | 'alumniSinceDate'
                  | 'alumniLocation'
                  | 'firstName'
                  | 'lastName'
                  | 'onboarded'
                > & {
                    sys: Pick<Sys, 'id'>;
                    teamsCollection?: Maybe<{
                      items: Array<
                        Maybe<
                          Pick<TeamMembership, 'role'> & {
                            sys: Pick<Sys, 'id'>;
                          }
                        >
                      >;
                    }>;
                    avatar?: Maybe<Pick<Asset, 'url'>>;
                  })
            >;
          }>
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
                        | ({ __typename: 'Dashboard' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Discover' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'EventSpeakers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ExternalAuthors' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'ExternalTools' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'InterestGroupLeaders' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'InterestGroups' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Labs' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                              sys: Pick<Sys, 'id'>;
                            })
                        | ({ __typename: 'Migration' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ResearchTags' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'TeamMembership' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Teams' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Tutorials' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'WorkingGroupDeliverables' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'WorkingGroupLeaders' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({
                            __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                          } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'WorkingGroupMembers' } & {
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
                        | ({ __typename: 'Dashboard' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Discover' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'EventSpeakers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ExternalAuthors' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'ExternalTools' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'InterestGroupLeaders' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'InterestGroups' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Labs' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                              sys: Pick<Sys, 'id'>;
                            })
                        | ({ __typename: 'Migration' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ResearchTags' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'TeamMembership' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Teams' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Tutorials' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'WorkingGroupDeliverables' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'WorkingGroupLeaders' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({
                            __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                          } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'WorkingGroupMembers' } & {
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
                        | ({ __typename: 'Dashboard' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Discover' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'EventSpeakers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ExternalAuthors' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'ExternalTools' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'InterestGroupLeaders' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'InterestGroups' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Labs' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                              sys: Pick<Sys, 'id'>;
                            })
                        | ({ __typename: 'Migration' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ResearchTags' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'TeamMembership' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Teams' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Tutorials' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'WorkingGroupDeliverables' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'WorkingGroupLeaders' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({
                            __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                          } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'WorkingGroupMembers' } & {
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
                  interestGroupsCollection?: Maybe<{
                    items: Array<
                      Maybe<
                        Pick<
                          InterestGroups,
                          'name' | 'active' | 'slack' | 'googleDrive'
                        > & { sys: Pick<Sys, 'id'> }
                      >
                    >;
                  }>;
                }>;
              }
            >;
            thumbnail?: Maybe<Pick<Asset, 'url'>>;
            speakersCollection?: Maybe<{
              items: Array<
                Maybe<{
                  team?: Maybe<
                    Pick<Teams, 'displayName' | 'inactiveSince'> & {
                      sys: Pick<Sys, 'id'>;
                    }
                  >;
                  user?: Maybe<
                    | ({ __typename: 'ExternalAuthors' } & Pick<
                        ExternalAuthors,
                        'name' | 'orcid'
                      >)
                    | ({ __typename: 'Users' } & Pick<
                        Users,
                        | 'alumniSinceDate'
                        | 'alumniLocation'
                        | 'firstName'
                        | 'lastName'
                        | 'onboarded'
                      > & {
                          sys: Pick<Sys, 'id'>;
                          teamsCollection?: Maybe<{
                            items: Array<
                              Maybe<
                                Pick<TeamMembership, 'role'> & {
                                  sys: Pick<Sys, 'id'>;
                                }
                              >
                            >;
                          }>;
                          avatar?: Maybe<Pick<Asset, 'url'>>;
                        })
                  >;
                }>
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
                                    | ({ __typename: 'Dashboard' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Discover' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'EventSpeakers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Events' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalAuthors' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalTools' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'InterestGroupLeaders';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'InterestGroups' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Labs' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Media' } & Pick<
                                        Media,
                                        'url'
                                      > & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'Migration' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'News' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Pages' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ResearchTags' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'TeamMembership' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Teams' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Tutorials' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Users' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupDeliverables';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupLeaders' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupMembers' } & {
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
                                    | ({ __typename: 'Dashboard' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Discover' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'EventSpeakers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Events' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalAuthors' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalTools' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'InterestGroupLeaders';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'InterestGroups' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Labs' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Media' } & Pick<
                                        Media,
                                        'url'
                                      > & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'Migration' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'News' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Pages' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ResearchTags' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'TeamMembership' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Teams' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Tutorials' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Users' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupDeliverables';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupLeaders' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupMembers' } & {
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
                                    | ({ __typename: 'Dashboard' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Discover' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'EventSpeakers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Events' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalAuthors' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalTools' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'InterestGroupLeaders';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'InterestGroups' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Labs' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Media' } & Pick<
                                        Media,
                                        'url'
                                      > & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'Migration' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'News' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Pages' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ResearchTags' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'TeamMembership' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Teams' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Tutorials' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Users' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupDeliverables';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupLeaders' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupMembers' } & {
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
                              interestGroupsCollection?: Maybe<{
                                items: Array<
                                  Maybe<
                                    Pick<
                                      InterestGroups,
                                      | 'name'
                                      | 'active'
                                      | 'slack'
                                      | 'googleDrive'
                                    > & { sys: Pick<Sys, 'id'> }
                                  >
                                >;
                              }>;
                            }>;
                          }
                        >;
                        thumbnail?: Maybe<Pick<Asset, 'url'>>;
                        speakersCollection?: Maybe<{
                          items: Array<
                            Maybe<{
                              team?: Maybe<
                                Pick<Teams, 'displayName' | 'inactiveSince'> & {
                                  sys: Pick<Sys, 'id'>;
                                }
                              >;
                              user?: Maybe<
                                | ({ __typename: 'ExternalAuthors' } & Pick<
                                    ExternalAuthors,
                                    'name' | 'orcid'
                                  >)
                                | ({ __typename: 'Users' } & Pick<
                                    Users,
                                    | 'alumniSinceDate'
                                    | 'alumniLocation'
                                    | 'firstName'
                                    | 'lastName'
                                    | 'onboarded'
                                  > & {
                                      sys: Pick<Sys, 'id'>;
                                      teamsCollection?: Maybe<{
                                        items: Array<
                                          Maybe<
                                            Pick<TeamMembership, 'role'> & {
                                              sys: Pick<Sys, 'id'>;
                                            }
                                          >
                                        >;
                                      }>;
                                      avatar?: Maybe<Pick<Asset, 'url'>>;
                                    })
                              >;
                            }>
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

export type FetchEventsByExternalAuthorIdQueryVariables = Exact<{
  id: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;

export type FetchEventsByExternalAuthorIdQuery = {
  externalAuthors?: Maybe<{
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
                                    | ({ __typename: 'Dashboard' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Discover' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'EventSpeakers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Events' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalAuthors' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalTools' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'InterestGroupLeaders';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'InterestGroups' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Labs' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Media' } & Pick<
                                        Media,
                                        'url'
                                      > & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'Migration' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'News' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Pages' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ResearchTags' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'TeamMembership' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Teams' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Tutorials' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Users' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupDeliverables';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupLeaders' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupMembers' } & {
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
                                    | ({ __typename: 'Dashboard' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Discover' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'EventSpeakers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Events' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalAuthors' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalTools' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'InterestGroupLeaders';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'InterestGroups' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Labs' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Media' } & Pick<
                                        Media,
                                        'url'
                                      > & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'Migration' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'News' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Pages' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ResearchTags' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'TeamMembership' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Teams' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Tutorials' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Users' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupDeliverables';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupLeaders' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupMembers' } & {
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
                                    | ({ __typename: 'Dashboard' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Discover' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'EventSpeakers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Events' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalAuthors' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalTools' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'InterestGroupLeaders';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'InterestGroups' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Labs' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Media' } & Pick<
                                        Media,
                                        'url'
                                      > & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'Migration' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'News' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Pages' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ResearchTags' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'TeamMembership' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Teams' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Tutorials' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Users' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupDeliverables';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupLeaders' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupMembers' } & {
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
                              interestGroupsCollection?: Maybe<{
                                items: Array<
                                  Maybe<
                                    Pick<
                                      InterestGroups,
                                      | 'name'
                                      | 'active'
                                      | 'slack'
                                      | 'googleDrive'
                                    > & { sys: Pick<Sys, 'id'> }
                                  >
                                >;
                              }>;
                            }>;
                          }
                        >;
                        thumbnail?: Maybe<Pick<Asset, 'url'>>;
                        speakersCollection?: Maybe<{
                          items: Array<
                            Maybe<{
                              team?: Maybe<
                                Pick<Teams, 'displayName' | 'inactiveSince'> & {
                                  sys: Pick<Sys, 'id'>;
                                }
                              >;
                              user?: Maybe<
                                | ({ __typename: 'ExternalAuthors' } & Pick<
                                    ExternalAuthors,
                                    'name' | 'orcid'
                                  >)
                                | ({ __typename: 'Users' } & Pick<
                                    Users,
                                    | 'alumniSinceDate'
                                    | 'alumniLocation'
                                    | 'firstName'
                                    | 'lastName'
                                    | 'onboarded'
                                  > & {
                                      sys: Pick<Sys, 'id'>;
                                      teamsCollection?: Maybe<{
                                        items: Array<
                                          Maybe<
                                            Pick<TeamMembership, 'role'> & {
                                              sys: Pick<Sys, 'id'>;
                                            }
                                          >
                                        >;
                                      }>;
                                      avatar?: Maybe<Pick<Asset, 'url'>>;
                                    })
                              >;
                            }>
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

export type FetchEventsByTeamIdQueryVariables = Exact<{
  id: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;

export type FetchEventsByTeamIdQuery = {
  teams?: Maybe<{
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
                                    | ({ __typename: 'Dashboard' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Discover' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'EventSpeakers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Events' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalAuthors' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalTools' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'InterestGroupLeaders';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'InterestGroups' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Labs' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Media' } & Pick<
                                        Media,
                                        'url'
                                      > & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'Migration' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'News' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Pages' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ResearchTags' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'TeamMembership' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Teams' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Tutorials' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Users' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupDeliverables';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupLeaders' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupMembers' } & {
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
                                    | ({ __typename: 'Dashboard' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Discover' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'EventSpeakers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Events' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalAuthors' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalTools' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'InterestGroupLeaders';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'InterestGroups' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Labs' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Media' } & Pick<
                                        Media,
                                        'url'
                                      > & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'Migration' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'News' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Pages' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ResearchTags' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'TeamMembership' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Teams' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Tutorials' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Users' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupDeliverables';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupLeaders' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupMembers' } & {
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
                                    | ({ __typename: 'Dashboard' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Discover' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'EventSpeakers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Events' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalAuthors' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalTools' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'InterestGroupLeaders';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'InterestGroups' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Labs' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Media' } & Pick<
                                        Media,
                                        'url'
                                      > & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'Migration' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'News' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Pages' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ResearchTags' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'TeamMembership' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Teams' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Tutorials' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Users' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupDeliverables';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupLeaders' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'WorkingGroupMembers' } & {
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
                              interestGroupsCollection?: Maybe<{
                                items: Array<
                                  Maybe<
                                    Pick<
                                      InterestGroups,
                                      | 'name'
                                      | 'active'
                                      | 'slack'
                                      | 'googleDrive'
                                    > & { sys: Pick<Sys, 'id'> }
                                  >
                                >;
                              }>;
                            }>;
                          }
                        >;
                        thumbnail?: Maybe<Pick<Asset, 'url'>>;
                        speakersCollection?: Maybe<{
                          items: Array<
                            Maybe<{
                              team?: Maybe<
                                Pick<Teams, 'displayName' | 'inactiveSince'> & {
                                  sys: Pick<Sys, 'id'>;
                                }
                              >;
                              user?: Maybe<
                                | ({ __typename: 'ExternalAuthors' } & Pick<
                                    ExternalAuthors,
                                    'name' | 'orcid'
                                  >)
                                | ({ __typename: 'Users' } & Pick<
                                    Users,
                                    | 'alumniSinceDate'
                                    | 'alumniLocation'
                                    | 'firstName'
                                    | 'lastName'
                                    | 'onboarded'
                                  > & {
                                      sys: Pick<Sys, 'id'>;
                                      teamsCollection?: Maybe<{
                                        items: Array<
                                          Maybe<
                                            Pick<TeamMembership, 'role'> & {
                                              sys: Pick<Sys, 'id'>;
                                            }
                                          >
                                        >;
                                      }>;
                                      avatar?: Maybe<Pick<Asset, 'url'>>;
                                    })
                              >;
                            }>
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

export type FetchWorkingGroupCalendarQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchWorkingGroupCalendarQuery = {
  workingGroups?: Maybe<{ calendars?: Maybe<{ sys: Pick<Sys, 'id'> }> }>;
};

export type FetchInterestGroupCalendarQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchInterestGroupCalendarQuery = {
  interestGroups?: Maybe<{ calendar?: Maybe<{ sys: Pick<Sys, 'id'> }> }>;
};

export type ExternalAuthorsContentFragment = Pick<
  ExternalAuthors,
  'name' | 'orcid'
> & {
  sys: Pick<
    Sys,
    'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
  >;
};

export type FetchExternalAuthorByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchExternalAuthorByIdQuery = {
  externalAuthors?: Maybe<
    Pick<ExternalAuthors, 'name' | 'orcid'> & {
      sys: Pick<
        Sys,
        'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
      >;
    }
  >;
};

export type FetchExternalAuthorsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<
    Array<InputMaybe<ExternalAuthorsOrder>> | InputMaybe<ExternalAuthorsOrder>
  >;
}>;

export type FetchExternalAuthorsQuery = {
  externalAuthorsCollection?: Maybe<
    Pick<ExternalAuthorsCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<ExternalAuthors, 'name' | 'orcid'> & {
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

export type InterestGroupsContentFragment = Pick<
  InterestGroups,
  'name' | 'active' | 'tags' | 'description' | 'slack' | 'googleDrive'
> & {
  sys: Pick<
    Sys,
    'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
  >;
  thumbnail?: Maybe<Pick<Asset, 'url'>>;
  teamsCollection?: Maybe<{
    items: Array<
      Maybe<
        Pick<
          Teams,
          | 'displayName'
          | 'inactiveSince'
          | 'expertiseAndResourceTags'
          | 'projectTitle'
        > & { sys: Pick<Sys, 'id' | 'publishedAt'> }
      >
    >;
  }>;
  leadersCollection?: Maybe<{
    items: Array<
      Maybe<
        Pick<InterestGroupLeaders, 'role' | 'inactiveSinceDate'> & {
          sys: Pick<Sys, 'id' | 'publishedAt'>;
          user?: Maybe<
            Pick<
              Users,
              'firstName' | 'lastName' | 'email' | 'alumniSinceDate'
            > & {
              sys: Pick<Sys, 'id' | 'publishedAt' | 'firstPublishedAt'>;
              avatar?: Maybe<Pick<Asset, 'url'>>;
              teamsCollection?: Maybe<{
                items: Array<
                  Maybe<
                    Pick<TeamMembership, 'role' | 'inactiveSinceDate'> & {
                      team?: Maybe<
                        Pick<Teams, 'inactiveSince' | 'displayName'> & {
                          sys: Pick<Sys, 'id'>;
                        }
                      >;
                    }
                  >
                >;
              }>;
            }
          >;
        }
      >
    >;
  }>;
  calendar?: Maybe<
    Pick<Calendars, 'color' | 'googleCalendarId' | 'name'> & {
      sys: Pick<Sys, 'id'>;
    }
  >;
};

export type FetchInterestGroupByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchInterestGroupByIdQuery = {
  interestGroups?: Maybe<
    Pick<
      InterestGroups,
      'name' | 'active' | 'tags' | 'description' | 'slack' | 'googleDrive'
    > & {
      sys: Pick<
        Sys,
        'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
      >;
      thumbnail?: Maybe<Pick<Asset, 'url'>>;
      teamsCollection?: Maybe<{
        items: Array<
          Maybe<
            Pick<
              Teams,
              | 'displayName'
              | 'inactiveSince'
              | 'expertiseAndResourceTags'
              | 'projectTitle'
            > & { sys: Pick<Sys, 'id' | 'publishedAt'> }
          >
        >;
      }>;
      leadersCollection?: Maybe<{
        items: Array<
          Maybe<
            Pick<InterestGroupLeaders, 'role' | 'inactiveSinceDate'> & {
              sys: Pick<Sys, 'id' | 'publishedAt'>;
              user?: Maybe<
                Pick<
                  Users,
                  'firstName' | 'lastName' | 'email' | 'alumniSinceDate'
                > & {
                  sys: Pick<Sys, 'id' | 'publishedAt' | 'firstPublishedAt'>;
                  avatar?: Maybe<Pick<Asset, 'url'>>;
                  teamsCollection?: Maybe<{
                    items: Array<
                      Maybe<
                        Pick<TeamMembership, 'role' | 'inactiveSinceDate'> & {
                          team?: Maybe<
                            Pick<Teams, 'inactiveSince' | 'displayName'> & {
                              sys: Pick<Sys, 'id'>;
                            }
                          >;
                        }
                      >
                    >;
                  }>;
                }
              >;
            }
          >
        >;
      }>;
      calendar?: Maybe<
        Pick<Calendars, 'color' | 'googleCalendarId' | 'name'> & {
          sys: Pick<Sys, 'id'>;
        }
      >;
    }
  >;
};

export type FetchInterestGroupsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<
    Array<InputMaybe<InterestGroupsOrder>> | InputMaybe<InterestGroupsOrder>
  >;
  where?: InputMaybe<InterestGroupsFilter>;
}>;

export type FetchInterestGroupsQuery = {
  interestGroupsCollection?: Maybe<
    Pick<InterestGroupsCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<
            InterestGroups,
            'name' | 'active' | 'tags' | 'description' | 'slack' | 'googleDrive'
          > & {
            sys: Pick<
              Sys,
              'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
            >;
            thumbnail?: Maybe<Pick<Asset, 'url'>>;
            teamsCollection?: Maybe<{
              items: Array<
                Maybe<
                  Pick<
                    Teams,
                    | 'displayName'
                    | 'inactiveSince'
                    | 'expertiseAndResourceTags'
                    | 'projectTitle'
                  > & { sys: Pick<Sys, 'id' | 'publishedAt'> }
                >
              >;
            }>;
            leadersCollection?: Maybe<{
              items: Array<
                Maybe<
                  Pick<InterestGroupLeaders, 'role' | 'inactiveSinceDate'> & {
                    sys: Pick<Sys, 'id' | 'publishedAt'>;
                    user?: Maybe<
                      Pick<
                        Users,
                        'firstName' | 'lastName' | 'email' | 'alumniSinceDate'
                      > & {
                        sys: Pick<
                          Sys,
                          'id' | 'publishedAt' | 'firstPublishedAt'
                        >;
                        avatar?: Maybe<Pick<Asset, 'url'>>;
                        teamsCollection?: Maybe<{
                          items: Array<
                            Maybe<
                              Pick<
                                TeamMembership,
                                'role' | 'inactiveSinceDate'
                              > & {
                                team?: Maybe<
                                  Pick<
                                    Teams,
                                    'inactiveSince' | 'displayName'
                                  > & { sys: Pick<Sys, 'id'> }
                                >;
                              }
                            >
                          >;
                        }>;
                      }
                    >;
                  }
                >
              >;
            }>;
            calendar?: Maybe<
              Pick<Calendars, 'color' | 'googleCalendarId' | 'name'> & {
                sys: Pick<Sys, 'id'>;
              }
            >;
          }
        >
      >;
    }
  >;
};

export type FetchInterestGroupsByUserIdQueryVariables = Exact<{
  id: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;

export type FetchInterestGroupsByUserIdQuery = {
  interestGroupLeadersCollection?: Maybe<
    Pick<InterestGroupLeadersCollection, 'total'> & {
      items: Array<
        Maybe<{
          linkedFrom?: Maybe<{
            interestGroupsCollection?: Maybe<{
              items: Array<
                Maybe<
                  Pick<
                    InterestGroups,
                    | 'name'
                    | 'active'
                    | 'tags'
                    | 'description'
                    | 'slack'
                    | 'googleDrive'
                  > & {
                    sys: Pick<
                      Sys,
                      | 'id'
                      | 'firstPublishedAt'
                      | 'publishedAt'
                      | 'publishedVersion'
                    >;
                    thumbnail?: Maybe<Pick<Asset, 'url'>>;
                    teamsCollection?: Maybe<{
                      items: Array<
                        Maybe<
                          Pick<
                            Teams,
                            | 'displayName'
                            | 'inactiveSince'
                            | 'expertiseAndResourceTags'
                            | 'projectTitle'
                          > & { sys: Pick<Sys, 'id' | 'publishedAt'> }
                        >
                      >;
                    }>;
                    leadersCollection?: Maybe<{
                      items: Array<
                        Maybe<
                          Pick<
                            InterestGroupLeaders,
                            'role' | 'inactiveSinceDate'
                          > & {
                            sys: Pick<Sys, 'id' | 'publishedAt'>;
                            user?: Maybe<
                              Pick<
                                Users,
                                | 'firstName'
                                | 'lastName'
                                | 'email'
                                | 'alumniSinceDate'
                              > & {
                                sys: Pick<
                                  Sys,
                                  'id' | 'publishedAt' | 'firstPublishedAt'
                                >;
                                avatar?: Maybe<Pick<Asset, 'url'>>;
                                teamsCollection?: Maybe<{
                                  items: Array<
                                    Maybe<
                                      Pick<
                                        TeamMembership,
                                        'role' | 'inactiveSinceDate'
                                      > & {
                                        team?: Maybe<
                                          Pick<
                                            Teams,
                                            'inactiveSince' | 'displayName'
                                          > & { sys: Pick<Sys, 'id'> }
                                        >;
                                      }
                                    >
                                  >;
                                }>;
                              }
                            >;
                          }
                        >
                      >;
                    }>;
                    calendar?: Maybe<
                      Pick<Calendars, 'color' | 'googleCalendarId' | 'name'> & {
                        sys: Pick<Sys, 'id'>;
                      }
                    >;
                  }
                >
              >;
            }>;
          }>;
        }>
      >;
    }
  >;
};

export type NewsContentFragment = Pick<
  News,
  'title' | 'shortText' | 'frequency' | 'link' | 'linkText' | 'publishDate'
> & {
  sys: Pick<Sys, 'id' | 'firstPublishedAt'>;
  thumbnail?: Maybe<Pick<Asset, 'url'>>;
  text?: Maybe<
    Pick<NewsText, 'json'> & {
      links: {
        entries: {
          inline: Array<
            Maybe<
              | ({ __typename: 'Calendars' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Dashboard' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Discover' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ExternalAuthors' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ExternalTools' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'InterestGroupLeaders' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'InterestGroups' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Labs' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                    sys: Pick<Sys, 'id'>;
                  })
              | ({ __typename: 'Migration' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ResearchTags' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'TeamMembership' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Teams' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Tutorials' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'WorkingGroupDeliverables' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupLeaders' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupLeadersOrWorkingGroupMembers' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupMembers' } & {
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

export type FetchNewsByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchNewsByIdQuery = {
  news?: Maybe<
    Pick<
      News,
      'title' | 'shortText' | 'frequency' | 'link' | 'linkText' | 'publishDate'
    > & {
      sys: Pick<Sys, 'id' | 'firstPublishedAt'>;
      thumbnail?: Maybe<Pick<Asset, 'url'>>;
      text?: Maybe<
        Pick<NewsText, 'json'> & {
          links: {
            entries: {
              inline: Array<
                Maybe<
                  | ({ __typename: 'Calendars' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Dashboard' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Discover' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ExternalAuthors' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'ExternalTools' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'InterestGroupLeaders' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'InterestGroups' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'Labs' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                        sys: Pick<Sys, 'id'>;
                      })
                  | ({ __typename: 'Migration' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ResearchTags' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'TeamMembership' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'Teams' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Tutorials' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'WorkingGroupDeliverables' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'WorkingGroupLeaders' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({
                      __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                    } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'WorkingGroupMembers' } & {
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
    }
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
            | 'frequency'
            | 'link'
            | 'linkText'
            | 'publishDate'
          > & {
            sys: Pick<Sys, 'id' | 'firstPublishedAt'>;
            thumbnail?: Maybe<Pick<Asset, 'url'>>;
            text?: Maybe<
              Pick<NewsText, 'json'> & {
                links: {
                  entries: {
                    inline: Array<
                      Maybe<
                        | ({ __typename: 'Calendars' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Dashboard' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Discover' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'EventSpeakers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ExternalAuthors' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'ExternalTools' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'InterestGroupLeaders' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'InterestGroups' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Labs' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                              sys: Pick<Sys, 'id'>;
                            })
                        | ({ __typename: 'Migration' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ResearchTags' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'TeamMembership' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Teams' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Tutorials' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'WorkingGroupDeliverables' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'WorkingGroupLeaders' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({
                            __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                          } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'WorkingGroupMembers' } & {
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

export type PageContentFragment = Pick<
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
              | ({ __typename: 'Dashboard' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Discover' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ExternalAuthors' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ExternalTools' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'InterestGroupLeaders' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'InterestGroups' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Labs' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                    sys: Pick<Sys, 'id'>;
                  })
              | ({ __typename: 'Migration' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ResearchTags' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'TeamMembership' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Teams' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Tutorials' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'WorkingGroupDeliverables' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupLeaders' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupLeadersOrWorkingGroupMembers' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupMembers' } & {
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
                        | ({ __typename: 'Dashboard' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Discover' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'EventSpeakers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ExternalAuthors' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'ExternalTools' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'InterestGroupLeaders' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'InterestGroups' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Labs' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                              sys: Pick<Sys, 'id'>;
                            })
                        | ({ __typename: 'Migration' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ResearchTags' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'TeamMembership' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Teams' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Tutorials' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'WorkingGroupDeliverables' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'WorkingGroupLeaders' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({
                            __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                          } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'WorkingGroupMembers' } & {
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

export type ResearchTagsContentFragment = Pick<
  ResearchTags,
  'name' | 'category' | 'types' | 'entities'
> & { sys: Pick<Sys, 'id'> };

export type FetchResearchTagsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<
    Array<InputMaybe<ResearchTagsOrder>> | InputMaybe<ResearchTagsOrder>
  >;
  where?: InputMaybe<ResearchTagsFilter>;
}>;

export type FetchResearchTagsQuery = {
  researchTagsCollection?: Maybe<
    Pick<ResearchTagsCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<ResearchTags, 'name' | 'category' | 'types' | 'entities'> & {
            sys: Pick<Sys, 'id'>;
          }
        >
      >;
    }
  >;
};

export type TeamsContentFragment = Pick<
  Teams,
  | 'displayName'
  | 'applicationNumber'
  | 'inactiveSince'
  | 'projectSummary'
  | 'projectTitle'
  | 'expertiseAndResourceTags'
> & {
  sys: Pick<
    Sys,
    'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
  >;
  toolsCollection?: Maybe<{
    items: Array<Maybe<Pick<ExternalTools, 'name' | 'description' | 'url'>>>;
  }>;
  linkedFrom?: Maybe<{
    teamMembershipCollection?: Maybe<{
      items: Array<
        Maybe<
          Pick<TeamMembership, 'role' | 'inactiveSinceDate'> & {
            linkedFrom?: Maybe<{
              usersCollection?: Maybe<{
                items: Array<
                  Maybe<
                    Pick<
                      Users,
                      'firstName' | 'lastName' | 'email' | 'alumniSinceDate'
                    > & {
                      sys: Pick<Sys, 'id'>;
                      avatar?: Maybe<Pick<Asset, 'url'>>;
                      labsCollection?: Maybe<{
                        items: Array<
                          Maybe<Pick<Labs, 'name'> & { sys: Pick<Sys, 'id'> }>
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

export type FetchTeamByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchTeamByIdQuery = {
  teams?: Maybe<
    Pick<
      Teams,
      | 'displayName'
      | 'applicationNumber'
      | 'inactiveSince'
      | 'projectSummary'
      | 'projectTitle'
      | 'expertiseAndResourceTags'
    > & {
      sys: Pick<
        Sys,
        'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
      >;
      toolsCollection?: Maybe<{
        items: Array<
          Maybe<Pick<ExternalTools, 'name' | 'description' | 'url'>>
        >;
      }>;
      linkedFrom?: Maybe<{
        teamMembershipCollection?: Maybe<{
          items: Array<
            Maybe<
              Pick<TeamMembership, 'role' | 'inactiveSinceDate'> & {
                linkedFrom?: Maybe<{
                  usersCollection?: Maybe<{
                    items: Array<
                      Maybe<
                        Pick<
                          Users,
                          'firstName' | 'lastName' | 'email' | 'alumniSinceDate'
                        > & {
                          sys: Pick<Sys, 'id'>;
                          avatar?: Maybe<Pick<Asset, 'url'>>;
                          labsCollection?: Maybe<{
                            items: Array<
                              Maybe<
                                Pick<Labs, 'name'> & { sys: Pick<Sys, 'id'> }
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

export type FetchTeamsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Array<InputMaybe<TeamsOrder>> | InputMaybe<TeamsOrder>>;
  where?: InputMaybe<TeamsFilter>;
}>;

export type FetchTeamsQuery = {
  teamsCollection?: Maybe<
    Pick<TeamsCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<
            Teams,
            | 'displayName'
            | 'applicationNumber'
            | 'inactiveSince'
            | 'projectSummary'
            | 'projectTitle'
            | 'expertiseAndResourceTags'
          > & {
            sys: Pick<
              Sys,
              'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
            >;
            toolsCollection?: Maybe<{
              items: Array<
                Maybe<Pick<ExternalTools, 'name' | 'description' | 'url'>>
              >;
            }>;
            linkedFrom?: Maybe<{
              teamMembershipCollection?: Maybe<{
                items: Array<
                  Maybe<
                    Pick<TeamMembership, 'role' | 'inactiveSinceDate'> & {
                      linkedFrom?: Maybe<{
                        usersCollection?: Maybe<{
                          items: Array<
                            Maybe<
                              Pick<
                                Users,
                                | 'firstName'
                                | 'lastName'
                                | 'email'
                                | 'alumniSinceDate'
                              > & {
                                sys: Pick<Sys, 'id'>;
                                avatar?: Maybe<Pick<Asset, 'url'>>;
                                labsCollection?: Maybe<{
                                  items: Array<
                                    Maybe<
                                      Pick<Labs, 'name'> & {
                                        sys: Pick<Sys, 'id'>;
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

export type TutorialsContentFragment = Pick<
  Tutorials,
  'title' | 'shortText' | 'link' | 'linkText'
> & {
  sys: Pick<Sys, 'id' | 'firstPublishedAt'>;
  thumbnail?: Maybe<Pick<Asset, 'url'>>;
  text?: Maybe<
    Pick<TutorialsText, 'json'> & {
      links: {
        entries: {
          inline: Array<
            Maybe<
              | ({ __typename: 'Calendars' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Dashboard' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Discover' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ExternalAuthors' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ExternalTools' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'InterestGroupLeaders' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'InterestGroups' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Labs' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                    sys: Pick<Sys, 'id'>;
                  })
              | ({ __typename: 'Migration' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ResearchTags' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'TeamMembership' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Teams' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Tutorials' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'WorkingGroupDeliverables' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupLeaders' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupLeadersOrWorkingGroupMembers' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupMembers' } & {
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

export type FetchTutorialByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchTutorialByIdQuery = {
  tutorials?: Maybe<
    Pick<Tutorials, 'title' | 'shortText' | 'link' | 'linkText'> & {
      sys: Pick<Sys, 'id' | 'firstPublishedAt'>;
      thumbnail?: Maybe<Pick<Asset, 'url'>>;
      text?: Maybe<
        Pick<TutorialsText, 'json'> & {
          links: {
            entries: {
              inline: Array<
                Maybe<
                  | ({ __typename: 'Calendars' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Dashboard' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Discover' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ExternalAuthors' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'ExternalTools' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'InterestGroupLeaders' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'InterestGroups' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'Labs' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                        sys: Pick<Sys, 'id'>;
                      })
                  | ({ __typename: 'Migration' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ResearchTags' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'TeamMembership' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'Teams' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Tutorials' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'WorkingGroupDeliverables' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'WorkingGroupLeaders' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({
                      __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                    } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'WorkingGroupMembers' } & {
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
    }
  >;
};

export type UsersContentFragment = Pick<
  Users,
  | 'alumniSinceDate'
  | 'alumniLocation'
  | 'biography'
  | 'connections'
  | 'createdDate'
  | 'degree'
  | 'email'
  | 'contactEmail'
  | 'dismissedGettingStarted'
  | 'firstName'
  | 'institution'
  | 'jobTitle'
  | 'lastName'
  | 'country'
  | 'city'
  | 'onboarded'
  | 'orcid'
  | 'orcidLastModifiedDate'
  | 'orcidLastSyncDate'
  | 'orcidWorks'
  | 'questions'
  | 'expertiseAndResourceTags'
  | 'expertiseAndResourceDescription'
  | 'github'
  | 'googleScholar'
  | 'linkedIn'
  | 'researcherId'
  | 'researchGate'
  | 'twitter'
  | 'website1'
  | 'website2'
  | 'role'
  | 'responsibilities'
  | 'researchInterests'
  | 'reachOut'
> & {
  sys: Pick<
    Sys,
    'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
  >;
  avatar?: Maybe<Pick<Asset, 'url'>>;
  teamsCollection?: Maybe<{
    items: Array<
      Maybe<
        Pick<TeamMembership, 'role' | 'inactiveSinceDate'> & {
          team?: Maybe<
            Pick<Teams, 'displayName' | 'inactiveSince'> & {
              sys: Pick<Sys, 'id'>;
              linkedFrom?: Maybe<{
                interestGroupsCollection?: Maybe<{
                  items: Array<
                    Maybe<
                      Pick<InterestGroups, 'active' | 'name'> & {
                        sys: Pick<Sys, 'id'>;
                      }
                    >
                  >;
                }>;
              }>;
            }
          >;
        }
      >
    >;
  }>;
  labsCollection?: Maybe<{
    items: Array<Maybe<Pick<Labs, 'name'> & { sys: Pick<Sys, 'id'> }>>;
  }>;
  linkedFrom?: Maybe<{
    workingGroupMembersCollection?: Maybe<{
      items: Array<
        Maybe<
          Pick<WorkingGroupMembers, 'inactiveSinceDate'> & {
            linkedFrom?: Maybe<{
              workingGroupsCollection?: Maybe<{
                items: Array<
                  Maybe<
                    Pick<WorkingGroups, 'title' | 'complete'> & {
                      sys: Pick<Sys, 'id'>;
                    }
                  >
                >;
              }>;
            }>;
            user?: Maybe<Pick<Users, 'lastName'>>;
          }
        >
      >;
    }>;
    workingGroupLeadersCollection?: Maybe<{
      items: Array<
        Maybe<
          Pick<WorkingGroupLeaders, 'role' | 'inactiveSinceDate'> & {
            linkedFrom?: Maybe<{
              workingGroupsCollection?: Maybe<{
                items: Array<
                  Maybe<
                    Pick<WorkingGroups, 'title' | 'complete'> & {
                      sys: Pick<Sys, 'id'>;
                    }
                  >
                >;
              }>;
            }>;
            user?: Maybe<Pick<Users, 'lastName'>>;
          }
        >
      >;
    }>;
    interestGroupLeadersCollection?: Maybe<{
      items: Array<
        Maybe<{
          linkedFrom?: Maybe<{
            interestGroupsCollection?: Maybe<{
              items: Array<
                Maybe<
                  Pick<InterestGroups, 'active' | 'name'> & {
                    sys: Pick<Sys, 'id'>;
                  }
                >
              >;
            }>;
          }>;
        }>
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
      | 'alumniSinceDate'
      | 'alumniLocation'
      | 'biography'
      | 'connections'
      | 'createdDate'
      | 'degree'
      | 'email'
      | 'contactEmail'
      | 'dismissedGettingStarted'
      | 'firstName'
      | 'institution'
      | 'jobTitle'
      | 'lastName'
      | 'country'
      | 'city'
      | 'onboarded'
      | 'orcid'
      | 'orcidLastModifiedDate'
      | 'orcidLastSyncDate'
      | 'orcidWorks'
      | 'questions'
      | 'expertiseAndResourceTags'
      | 'expertiseAndResourceDescription'
      | 'github'
      | 'googleScholar'
      | 'linkedIn'
      | 'researcherId'
      | 'researchGate'
      | 'twitter'
      | 'website1'
      | 'website2'
      | 'role'
      | 'responsibilities'
      | 'researchInterests'
      | 'reachOut'
    > & {
      sys: Pick<
        Sys,
        'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
      >;
      avatar?: Maybe<Pick<Asset, 'url'>>;
      teamsCollection?: Maybe<{
        items: Array<
          Maybe<
            Pick<TeamMembership, 'role' | 'inactiveSinceDate'> & {
              team?: Maybe<
                Pick<Teams, 'displayName' | 'inactiveSince'> & {
                  sys: Pick<Sys, 'id'>;
                  linkedFrom?: Maybe<{
                    interestGroupsCollection?: Maybe<{
                      items: Array<
                        Maybe<
                          Pick<InterestGroups, 'active' | 'name'> & {
                            sys: Pick<Sys, 'id'>;
                          }
                        >
                      >;
                    }>;
                  }>;
                }
              >;
            }
          >
        >;
      }>;
      labsCollection?: Maybe<{
        items: Array<Maybe<Pick<Labs, 'name'> & { sys: Pick<Sys, 'id'> }>>;
      }>;
      linkedFrom?: Maybe<{
        workingGroupMembersCollection?: Maybe<{
          items: Array<
            Maybe<
              Pick<WorkingGroupMembers, 'inactiveSinceDate'> & {
                linkedFrom?: Maybe<{
                  workingGroupsCollection?: Maybe<{
                    items: Array<
                      Maybe<
                        Pick<WorkingGroups, 'title' | 'complete'> & {
                          sys: Pick<Sys, 'id'>;
                        }
                      >
                    >;
                  }>;
                }>;
                user?: Maybe<Pick<Users, 'lastName'>>;
              }
            >
          >;
        }>;
        workingGroupLeadersCollection?: Maybe<{
          items: Array<
            Maybe<
              Pick<WorkingGroupLeaders, 'role' | 'inactiveSinceDate'> & {
                linkedFrom?: Maybe<{
                  workingGroupsCollection?: Maybe<{
                    items: Array<
                      Maybe<
                        Pick<WorkingGroups, 'title' | 'complete'> & {
                          sys: Pick<Sys, 'id'>;
                        }
                      >
                    >;
                  }>;
                }>;
                user?: Maybe<Pick<Users, 'lastName'>>;
              }
            >
          >;
        }>;
        interestGroupLeadersCollection?: Maybe<{
          items: Array<
            Maybe<{
              linkedFrom?: Maybe<{
                interestGroupsCollection?: Maybe<{
                  items: Array<
                    Maybe<
                      Pick<InterestGroups, 'active' | 'name'> & {
                        sys: Pick<Sys, 'id'>;
                      }
                    >
                  >;
                }>;
              }>;
            }>
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
            | 'alumniSinceDate'
            | 'alumniLocation'
            | 'biography'
            | 'connections'
            | 'createdDate'
            | 'degree'
            | 'email'
            | 'contactEmail'
            | 'dismissedGettingStarted'
            | 'firstName'
            | 'institution'
            | 'jobTitle'
            | 'lastName'
            | 'country'
            | 'city'
            | 'onboarded'
            | 'orcid'
            | 'orcidLastModifiedDate'
            | 'orcidLastSyncDate'
            | 'orcidWorks'
            | 'questions'
            | 'expertiseAndResourceTags'
            | 'expertiseAndResourceDescription'
            | 'github'
            | 'googleScholar'
            | 'linkedIn'
            | 'researcherId'
            | 'researchGate'
            | 'twitter'
            | 'website1'
            | 'website2'
            | 'role'
            | 'responsibilities'
            | 'researchInterests'
            | 'reachOut'
          > & {
            sys: Pick<
              Sys,
              'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
            >;
            avatar?: Maybe<Pick<Asset, 'url'>>;
            teamsCollection?: Maybe<{
              items: Array<
                Maybe<
                  Pick<TeamMembership, 'role' | 'inactiveSinceDate'> & {
                    team?: Maybe<
                      Pick<Teams, 'displayName' | 'inactiveSince'> & {
                        sys: Pick<Sys, 'id'>;
                        linkedFrom?: Maybe<{
                          interestGroupsCollection?: Maybe<{
                            items: Array<
                              Maybe<
                                Pick<InterestGroups, 'active' | 'name'> & {
                                  sys: Pick<Sys, 'id'>;
                                }
                              >
                            >;
                          }>;
                        }>;
                      }
                    >;
                  }
                >
              >;
            }>;
            labsCollection?: Maybe<{
              items: Array<
                Maybe<Pick<Labs, 'name'> & { sys: Pick<Sys, 'id'> }>
              >;
            }>;
            linkedFrom?: Maybe<{
              workingGroupMembersCollection?: Maybe<{
                items: Array<
                  Maybe<
                    Pick<WorkingGroupMembers, 'inactiveSinceDate'> & {
                      linkedFrom?: Maybe<{
                        workingGroupsCollection?: Maybe<{
                          items: Array<
                            Maybe<
                              Pick<WorkingGroups, 'title' | 'complete'> & {
                                sys: Pick<Sys, 'id'>;
                              }
                            >
                          >;
                        }>;
                      }>;
                      user?: Maybe<Pick<Users, 'lastName'>>;
                    }
                  >
                >;
              }>;
              workingGroupLeadersCollection?: Maybe<{
                items: Array<
                  Maybe<
                    Pick<WorkingGroupLeaders, 'role' | 'inactiveSinceDate'> & {
                      linkedFrom?: Maybe<{
                        workingGroupsCollection?: Maybe<{
                          items: Array<
                            Maybe<
                              Pick<WorkingGroups, 'title' | 'complete'> & {
                                sys: Pick<Sys, 'id'>;
                              }
                            >
                          >;
                        }>;
                      }>;
                      user?: Maybe<Pick<Users, 'lastName'>>;
                    }
                  >
                >;
              }>;
              interestGroupLeadersCollection?: Maybe<{
                items: Array<
                  Maybe<{
                    linkedFrom?: Maybe<{
                      interestGroupsCollection?: Maybe<{
                        items: Array<
                          Maybe<
                            Pick<InterestGroups, 'active' | 'name'> & {
                              sys: Pick<Sys, 'id'>;
                            }
                          >
                        >;
                      }>;
                    }>;
                  }>
                >;
              }>;
            }>;
          }
        >
      >;
    }
  >;
};

export type FetchUsersByTeamIdQueryVariables = Exact<{
  id: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;

export type FetchUsersByTeamIdQuery = {
  teamMembershipCollection?: Maybe<
    Pick<TeamMembershipCollection, 'total'> & {
      items: Array<
        Maybe<{
          linkedFrom?: Maybe<{
            usersCollection?: Maybe<{
              items: Array<
                Maybe<
                  Pick<
                    Users,
                    | 'alumniSinceDate'
                    | 'alumniLocation'
                    | 'biography'
                    | 'connections'
                    | 'createdDate'
                    | 'degree'
                    | 'email'
                    | 'contactEmail'
                    | 'dismissedGettingStarted'
                    | 'firstName'
                    | 'institution'
                    | 'jobTitle'
                    | 'lastName'
                    | 'country'
                    | 'city'
                    | 'onboarded'
                    | 'orcid'
                    | 'orcidLastModifiedDate'
                    | 'orcidLastSyncDate'
                    | 'orcidWorks'
                    | 'questions'
                    | 'expertiseAndResourceTags'
                    | 'expertiseAndResourceDescription'
                    | 'github'
                    | 'googleScholar'
                    | 'linkedIn'
                    | 'researcherId'
                    | 'researchGate'
                    | 'twitter'
                    | 'website1'
                    | 'website2'
                    | 'role'
                    | 'responsibilities'
                    | 'researchInterests'
                    | 'reachOut'
                  > & {
                    sys: Pick<
                      Sys,
                      | 'id'
                      | 'firstPublishedAt'
                      | 'publishedAt'
                      | 'publishedVersion'
                    >;
                    avatar?: Maybe<Pick<Asset, 'url'>>;
                    teamsCollection?: Maybe<{
                      items: Array<
                        Maybe<
                          Pick<TeamMembership, 'role' | 'inactiveSinceDate'> & {
                            team?: Maybe<
                              Pick<Teams, 'displayName' | 'inactiveSince'> & {
                                sys: Pick<Sys, 'id'>;
                                linkedFrom?: Maybe<{
                                  interestGroupsCollection?: Maybe<{
                                    items: Array<
                                      Maybe<
                                        Pick<
                                          InterestGroups,
                                          'active' | 'name'
                                        > & { sys: Pick<Sys, 'id'> }
                                      >
                                    >;
                                  }>;
                                }>;
                              }
                            >;
                          }
                        >
                      >;
                    }>;
                    labsCollection?: Maybe<{
                      items: Array<
                        Maybe<Pick<Labs, 'name'> & { sys: Pick<Sys, 'id'> }>
                      >;
                    }>;
                    linkedFrom?: Maybe<{
                      workingGroupMembersCollection?: Maybe<{
                        items: Array<
                          Maybe<
                            Pick<WorkingGroupMembers, 'inactiveSinceDate'> & {
                              linkedFrom?: Maybe<{
                                workingGroupsCollection?: Maybe<{
                                  items: Array<
                                    Maybe<
                                      Pick<
                                        WorkingGroups,
                                        'title' | 'complete'
                                      > & { sys: Pick<Sys, 'id'> }
                                    >
                                  >;
                                }>;
                              }>;
                              user?: Maybe<Pick<Users, 'lastName'>>;
                            }
                          >
                        >;
                      }>;
                      workingGroupLeadersCollection?: Maybe<{
                        items: Array<
                          Maybe<
                            Pick<
                              WorkingGroupLeaders,
                              'role' | 'inactiveSinceDate'
                            > & {
                              linkedFrom?: Maybe<{
                                workingGroupsCollection?: Maybe<{
                                  items: Array<
                                    Maybe<
                                      Pick<
                                        WorkingGroups,
                                        'title' | 'complete'
                                      > & { sys: Pick<Sys, 'id'> }
                                    >
                                  >;
                                }>;
                              }>;
                              user?: Maybe<Pick<Users, 'lastName'>>;
                            }
                          >
                        >;
                      }>;
                      interestGroupLeadersCollection?: Maybe<{
                        items: Array<
                          Maybe<{
                            linkedFrom?: Maybe<{
                              interestGroupsCollection?: Maybe<{
                                items: Array<
                                  Maybe<
                                    Pick<InterestGroups, 'active' | 'name'> & {
                                      sys: Pick<Sys, 'id'>;
                                    }
                                  >
                                >;
                              }>;
                            }>;
                          }>
                        >;
                      }>;
                    }>;
                  }
                >
              >;
            }>;
          }>;
        }>
      >;
    }
  >;
};

export type FetchUsersByLabIdQueryVariables = Exact<{
  id: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;

export type FetchUsersByLabIdQuery = {
  labs?: Maybe<{
    linkedFrom?: Maybe<{
      usersCollection?: Maybe<
        Pick<UsersCollection, 'total'> & {
          items: Array<
            Maybe<
              Pick<
                Users,
                | 'alumniSinceDate'
                | 'alumniLocation'
                | 'biography'
                | 'connections'
                | 'createdDate'
                | 'degree'
                | 'email'
                | 'contactEmail'
                | 'dismissedGettingStarted'
                | 'firstName'
                | 'institution'
                | 'jobTitle'
                | 'lastName'
                | 'country'
                | 'city'
                | 'onboarded'
                | 'orcid'
                | 'orcidLastModifiedDate'
                | 'orcidLastSyncDate'
                | 'orcidWorks'
                | 'questions'
                | 'expertiseAndResourceTags'
                | 'expertiseAndResourceDescription'
                | 'github'
                | 'googleScholar'
                | 'linkedIn'
                | 'researcherId'
                | 'researchGate'
                | 'twitter'
                | 'website1'
                | 'website2'
                | 'role'
                | 'responsibilities'
                | 'researchInterests'
                | 'reachOut'
              > & {
                sys: Pick<
                  Sys,
                  'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
                >;
                avatar?: Maybe<Pick<Asset, 'url'>>;
                teamsCollection?: Maybe<{
                  items: Array<
                    Maybe<
                      Pick<TeamMembership, 'role' | 'inactiveSinceDate'> & {
                        team?: Maybe<
                          Pick<Teams, 'displayName' | 'inactiveSince'> & {
                            sys: Pick<Sys, 'id'>;
                            linkedFrom?: Maybe<{
                              interestGroupsCollection?: Maybe<{
                                items: Array<
                                  Maybe<
                                    Pick<InterestGroups, 'active' | 'name'> & {
                                      sys: Pick<Sys, 'id'>;
                                    }
                                  >
                                >;
                              }>;
                            }>;
                          }
                        >;
                      }
                    >
                  >;
                }>;
                labsCollection?: Maybe<{
                  items: Array<
                    Maybe<Pick<Labs, 'name'> & { sys: Pick<Sys, 'id'> }>
                  >;
                }>;
                linkedFrom?: Maybe<{
                  workingGroupMembersCollection?: Maybe<{
                    items: Array<
                      Maybe<
                        Pick<WorkingGroupMembers, 'inactiveSinceDate'> & {
                          linkedFrom?: Maybe<{
                            workingGroupsCollection?: Maybe<{
                              items: Array<
                                Maybe<
                                  Pick<WorkingGroups, 'title' | 'complete'> & {
                                    sys: Pick<Sys, 'id'>;
                                  }
                                >
                              >;
                            }>;
                          }>;
                          user?: Maybe<Pick<Users, 'lastName'>>;
                        }
                      >
                    >;
                  }>;
                  workingGroupLeadersCollection?: Maybe<{
                    items: Array<
                      Maybe<
                        Pick<
                          WorkingGroupLeaders,
                          'role' | 'inactiveSinceDate'
                        > & {
                          linkedFrom?: Maybe<{
                            workingGroupsCollection?: Maybe<{
                              items: Array<
                                Maybe<
                                  Pick<WorkingGroups, 'title' | 'complete'> & {
                                    sys: Pick<Sys, 'id'>;
                                  }
                                >
                              >;
                            }>;
                          }>;
                          user?: Maybe<Pick<Users, 'lastName'>>;
                        }
                      >
                    >;
                  }>;
                  interestGroupLeadersCollection?: Maybe<{
                    items: Array<
                      Maybe<{
                        linkedFrom?: Maybe<{
                          interestGroupsCollection?: Maybe<{
                            items: Array<
                              Maybe<
                                Pick<InterestGroups, 'active' | 'name'> & {
                                  sys: Pick<Sys, 'id'>;
                                }
                              >
                            >;
                          }>;
                        }>;
                      }>
                    >;
                  }>;
                }>;
              }
            >
          >;
        }
      >;
    }>;
  }>;
};

export type WorkingGroupsContentFragment = Pick<
  WorkingGroups,
  'title' | 'externalLink' | 'shortText' | 'complete'
> & {
  sys: Pick<Sys, 'id' | 'publishedAt'>;
  description?: Maybe<
    Pick<WorkingGroupsDescription, 'json'> & {
      links: {
        entries: {
          inline: Array<
            Maybe<
              | ({ __typename: 'Calendars' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Dashboard' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Discover' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ExternalAuthors' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ExternalTools' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'InterestGroupLeaders' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'InterestGroups' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Labs' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                    sys: Pick<Sys, 'id'>;
                  })
              | ({ __typename: 'Migration' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ResearchTags' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'TeamMembership' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Teams' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Tutorials' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'WorkingGroupDeliverables' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupLeaders' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupLeadersOrWorkingGroupMembers' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'WorkingGroupMembers' } & {
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
  deliverablesCollection?: Maybe<{
    items: Array<
      Maybe<Pick<WorkingGroupDeliverables, 'description' | 'status'>>
    >;
  }>;
  membersCollection?: Maybe<{
    items: Array<
      Maybe<
        | ({ __typename: 'WorkingGroupLeaders' } & Pick<
            WorkingGroupLeaders,
            'workstreamRole' | 'role' | 'inactiveSinceDate'
          > & {
              user?: Maybe<
                Pick<
                  Users,
                  'email' | 'firstName' | 'lastName' | 'alumniSinceDate'
                > & { sys: Pick<Sys, 'id'>; avatar?: Maybe<Pick<Asset, 'url'>> }
              >;
            })
        | ({ __typename: 'WorkingGroupMembers' } & Pick<
            WorkingGroupMembers,
            'inactiveSinceDate'
          > & {
              user?: Maybe<
                Pick<
                  Users,
                  'email' | 'firstName' | 'lastName' | 'alumniSinceDate'
                > & { sys: Pick<Sys, 'id'>; avatar?: Maybe<Pick<Asset, 'url'>> }
              >;
            })
      >
    >;
  }>;
  calendars?: Maybe<
    Pick<Calendars, 'name' | 'color' | 'googleCalendarId'> & {
      sys: Pick<Sys, 'id'>;
    }
  >;
};

export type FetchWorkingGroupByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchWorkingGroupByIdQuery = {
  workingGroups?: Maybe<
    Pick<WorkingGroups, 'title' | 'externalLink' | 'shortText' | 'complete'> & {
      sys: Pick<Sys, 'id' | 'publishedAt'>;
      description?: Maybe<
        Pick<WorkingGroupsDescription, 'json'> & {
          links: {
            entries: {
              inline: Array<
                Maybe<
                  | ({ __typename: 'Calendars' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Dashboard' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Discover' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ExternalAuthors' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'ExternalTools' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'InterestGroupLeaders' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'InterestGroups' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'Labs' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                        sys: Pick<Sys, 'id'>;
                      })
                  | ({ __typename: 'Migration' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ResearchTags' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'TeamMembership' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'Teams' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Tutorials' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'WorkingGroupDeliverables' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'WorkingGroupLeaders' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({
                      __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                    } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'WorkingGroupMembers' } & {
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
      deliverablesCollection?: Maybe<{
        items: Array<
          Maybe<Pick<WorkingGroupDeliverables, 'description' | 'status'>>
        >;
      }>;
      membersCollection?: Maybe<{
        items: Array<
          Maybe<
            | ({ __typename: 'WorkingGroupLeaders' } & Pick<
                WorkingGroupLeaders,
                'workstreamRole' | 'role' | 'inactiveSinceDate'
              > & {
                  user?: Maybe<
                    Pick<
                      Users,
                      'email' | 'firstName' | 'lastName' | 'alumniSinceDate'
                    > & {
                      sys: Pick<Sys, 'id'>;
                      avatar?: Maybe<Pick<Asset, 'url'>>;
                    }
                  >;
                })
            | ({ __typename: 'WorkingGroupMembers' } & Pick<
                WorkingGroupMembers,
                'inactiveSinceDate'
              > & {
                  user?: Maybe<
                    Pick<
                      Users,
                      'email' | 'firstName' | 'lastName' | 'alumniSinceDate'
                    > & {
                      sys: Pick<Sys, 'id'>;
                      avatar?: Maybe<Pick<Asset, 'url'>>;
                    }
                  >;
                })
          >
        >;
      }>;
      calendars?: Maybe<
        Pick<Calendars, 'name' | 'color' | 'googleCalendarId'> & {
          sys: Pick<Sys, 'id'>;
        }
      >;
    }
  >;
};

export type FetchWorkingGroupsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<
    Array<InputMaybe<WorkingGroupsOrder>> | InputMaybe<WorkingGroupsOrder>
  >;
  where?: InputMaybe<WorkingGroupsFilter>;
}>;

export type FetchWorkingGroupsQuery = {
  workingGroupsCollection?: Maybe<
    Pick<WorkingGroupsCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<
            WorkingGroups,
            'title' | 'externalLink' | 'shortText' | 'complete'
          > & {
            sys: Pick<Sys, 'id' | 'publishedAt'>;
            description?: Maybe<
              Pick<WorkingGroupsDescription, 'json'> & {
                links: {
                  entries: {
                    inline: Array<
                      Maybe<
                        | ({ __typename: 'Calendars' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Dashboard' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Discover' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'EventSpeakers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ExternalAuthors' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'ExternalTools' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'InterestGroupLeaders' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'InterestGroups' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Labs' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Media' } & Pick<Media, 'url'> & {
                              sys: Pick<Sys, 'id'>;
                            })
                        | ({ __typename: 'Migration' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'News' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Pages' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ResearchTags' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'TeamMembership' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Teams' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'Tutorials' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Users' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'WorkingGroupDeliverables' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'WorkingGroupLeaders' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({
                            __typename: 'WorkingGroupLeadersOrWorkingGroupMembers';
                          } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'WorkingGroupMembers' } & {
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
            deliverablesCollection?: Maybe<{
              items: Array<
                Maybe<Pick<WorkingGroupDeliverables, 'description' | 'status'>>
              >;
            }>;
            membersCollection?: Maybe<{
              items: Array<
                Maybe<
                  | ({ __typename: 'WorkingGroupLeaders' } & Pick<
                      WorkingGroupLeaders,
                      'workstreamRole' | 'role' | 'inactiveSinceDate'
                    > & {
                        user?: Maybe<
                          Pick<
                            Users,
                            | 'email'
                            | 'firstName'
                            | 'lastName'
                            | 'alumniSinceDate'
                          > & {
                            sys: Pick<Sys, 'id'>;
                            avatar?: Maybe<Pick<Asset, 'url'>>;
                          }
                        >;
                      })
                  | ({ __typename: 'WorkingGroupMembers' } & Pick<
                      WorkingGroupMembers,
                      'inactiveSinceDate'
                    > & {
                        user?: Maybe<
                          Pick<
                            Users,
                            | 'email'
                            | 'firstName'
                            | 'lastName'
                            | 'alumniSinceDate'
                          > & {
                            sys: Pick<Sys, 'id'>;
                            avatar?: Maybe<Pick<Asset, 'url'>>;
                          }
                        >;
                      })
                >
              >;
            }>;
            calendars?: Maybe<
              Pick<Calendars, 'name' | 'color' | 'googleCalendarId'> & {
                sys: Pick<Sys, 'id'>;
              }
            >;
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
                  name: { kind: 'Name', value: 'workingGroupsCollection' },
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
                              name: { kind: 'Name', value: 'complete' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'interestGroupsCollection' },
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
      },
    },
  ],
} as unknown as DocumentNode<CalendarsContentFragment, unknown>;
export const PartialUsersContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PartialUsersContent' },
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
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'institution' } },
          { kind: 'Field', name: { kind: 'Name', value: 'jobTitle' } },
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
        ],
      },
    },
  ],
} as unknown as DocumentNode<PartialUsersContentFragment, unknown>;
export const EventsContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'EventsContent' },
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
                        name: {
                          kind: 'Name',
                          value: 'interestGroupsCollection',
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
                                    name: { kind: 'Name', value: 'active' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'slack' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'googleDrive',
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
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'team' },
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
                              name: { kind: 'Name', value: 'displayName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'inactiveSince' },
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
                                    name: {
                                      kind: 'Name',
                                      value: 'alumniSinceDate',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'alumniLocation',
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
                                    name: {
                                      kind: 'Name',
                                      value: 'teamsCollection',
                                    },
                                    arguments: [
                                      {
                                        kind: 'Argument',
                                        name: { kind: 'Name', value: 'limit' },
                                        value: { kind: 'IntValue', value: '5' },
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
                                                  value: 'role',
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
} as unknown as DocumentNode<EventsContentFragment, unknown>;
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
} as unknown as DocumentNode<ExternalAuthorsContentFragment, unknown>;
export const InterestGroupsContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'InterestGroupsContent' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'InterestGroups' },
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
          { kind: 'Field', name: { kind: 'Name', value: 'active' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tags' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slack' } },
          { kind: 'Field', name: { kind: 'Name', value: 'googleDrive' } },
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
            name: { kind: 'Name', value: 'teamsCollection' },
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
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'publishedAt' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'displayName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'inactiveSince' },
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
                        name: { kind: 'Name', value: 'projectTitle' },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'leadersCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '20' },
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
                        name: { kind: 'Name', value: 'sys' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'publishedAt' },
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
                              name: { kind: 'Name', value: 'sys' },
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
                                      value: 'publishedAt',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'firstPublishedAt',
                                    },
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
                              name: { kind: 'Name', value: 'alumniSinceDate' },
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
                              name: { kind: 'Name', value: 'teamsCollection' },
                              arguments: [
                                {
                                  kind: 'Argument',
                                  name: { kind: 'Name', value: 'limit' },
                                  value: { kind: 'IntValue', value: '5' },
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
                                          name: { kind: 'Name', value: 'role' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'inactiveSinceDate',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'team' },
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
                                                  value: 'inactiveSince',
                                                },
                                              },
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
                                ],
                              },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'role' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'inactiveSinceDate' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'googleCalendarId' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<InterestGroupsContentFragment, unknown>;
export const NewsContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'NewsContent' },
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
          { kind: 'Field', name: { kind: 'Name', value: 'frequency' } },
          { kind: 'Field', name: { kind: 'Name', value: 'link' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linkText' } },
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
          { kind: 'Field', name: { kind: 'Name', value: 'publishDate' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<NewsContentFragment, unknown>;
export const PageContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PageContent' },
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
} as unknown as DocumentNode<PageContentFragment, unknown>;
export const ResearchTagsContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ResearchTagsContent' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'ResearchTags' },
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
          { kind: 'Field', name: { kind: 'Name', value: 'category' } },
          { kind: 'Field', name: { kind: 'Name', value: 'types' } },
          { kind: 'Field', name: { kind: 'Name', value: 'entities' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ResearchTagsContentFragment, unknown>;
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
          { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'applicationNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'inactiveSince' } },
          { kind: 'Field', name: { kind: 'Name', value: 'projectSummary' } },
          { kind: 'Field', name: { kind: 'Name', value: 'projectTitle' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'expertiseAndResourceTags' },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'toolsCollection' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'description' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'url' } },
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
                  name: { kind: 'Name', value: 'teamMembershipCollection' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'limit' },
                      value: { kind: 'IntValue', value: '100' },
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
                              name: { kind: 'Name', value: 'role' },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'inactiveSinceDate',
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
                                    name: {
                                      kind: 'Name',
                                      value: 'usersCollection',
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
                                                  value: 'email',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'alumniSinceDate',
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
                                                        value: 'url',
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'labsCollection',
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
                                                      value: '5',
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
          { kind: 'Field', name: { kind: 'Name', value: 'link' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linkText' } },
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
          { kind: 'Field', name: { kind: 'Name', value: 'alumniSinceDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'alumniLocation' } },
          { kind: 'Field', name: { kind: 'Name', value: 'biography' } },
          { kind: 'Field', name: { kind: 'Name', value: 'connections' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'degree' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'contactEmail' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'dismissedGettingStarted' },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'institution' } },
          { kind: 'Field', name: { kind: 'Name', value: 'jobTitle' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'onboarded' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orcid' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'orcidLastModifiedDate' },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'orcidLastSyncDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orcidWorks' } },
          { kind: 'Field', name: { kind: 'Name', value: 'questions' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'expertiseAndResourceTags' },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'expertiseAndResourceDescription' },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'github' } },
          { kind: 'Field', name: { kind: 'Name', value: 'googleScholar' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linkedIn' } },
          { kind: 'Field', name: { kind: 'Name', value: 'researcherId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'researchGate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'twitter' } },
          { kind: 'Field', name: { kind: 'Name', value: 'website1' } },
          { kind: 'Field', name: { kind: 'Name', value: 'website2' } },
          { kind: 'Field', name: { kind: 'Name', value: 'role' } },
          { kind: 'Field', name: { kind: 'Name', value: 'responsibilities' } },
          { kind: 'Field', name: { kind: 'Name', value: 'researchInterests' } },
          { kind: 'Field', name: { kind: 'Name', value: 'reachOut' } },
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamsCollection' },
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
                        name: { kind: 'Name', value: 'team' },
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
                              name: { kind: 'Name', value: 'displayName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'inactiveSince' },
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
                                      value: 'interestGroupsCollection',
                                    },
                                    arguments: [
                                      {
                                        kind: 'Argument',
                                        name: { kind: 'Name', value: 'limit' },
                                        value: {
                                          kind: 'IntValue',
                                          value: '10',
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
                                                  value: 'active',
                                                },
                                              },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'role' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'inactiveSinceDate' },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'labsCollection' },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
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
                  name: {
                    kind: 'Name',
                    value: 'workingGroupMembersCollection',
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
                              name: {
                                kind: 'Name',
                                value: 'inactiveSinceDate',
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
                                                  value: 'complete',
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
                              name: { kind: 'Name', value: 'user' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
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
                  name: {
                    kind: 'Name',
                    value: 'workingGroupLeadersCollection',
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
                              name: { kind: 'Name', value: 'role' },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'inactiveSinceDate',
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
                                                  value: 'complete',
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
                              name: { kind: 'Name', value: 'user' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
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
                  name: {
                    kind: 'Name',
                    value: 'interestGroupLeadersCollection',
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
                              name: { kind: 'Name', value: 'linkedFrom' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'interestGroupsCollection',
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
                                                  value: 'active',
                                                },
                                              },
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
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UsersContentFragment, unknown>;
export const WorkingGroupsContentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'WorkingGroupsContent' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'publishedAt' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'description' },
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
          { kind: 'Field', name: { kind: 'Name', value: 'externalLink' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shortText' } },
          { kind: 'Field', name: { kind: 'Name', value: 'complete' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deliverablesCollection' },
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
                        name: { kind: 'Name', value: 'description' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'status' },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'membersCollection' },
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
                        name: { kind: 'Name', value: '__typename' },
                      },
                      {
                        kind: 'InlineFragment',
                        typeCondition: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'WorkingGroupLeaders' },
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'workstreamRole' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'role' },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'inactiveSinceDate',
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
                                    name: { kind: 'Name', value: 'email' },
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
                                    name: {
                                      kind: 'Name',
                                      value: 'alumniSinceDate',
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
                        name: { kind: 'Name', value: '__typename' },
                      },
                      {
                        kind: 'InlineFragment',
                        typeCondition: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'WorkingGroupMembers' },
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'inactiveSinceDate',
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
                                    name: { kind: 'Name', value: 'email' },
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
                                    name: {
                                      kind: 'Name',
                                      value: 'alumniSinceDate',
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
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'googleCalendarId' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<WorkingGroupsContentFragment, unknown>;
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
            name: { kind: 'Name', value: 'dashboardCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '1' },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'order' },
                value: { kind: 'EnumValue', value: 'sys_publishedAt_DESC' },
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
                        name: { kind: 'Name', value: 'newsCollection' },
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
                                    kind: 'FragmentSpread',
                                    name: {
                                      kind: 'Name',
                                      value: 'NewsContent',
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
                        name: { kind: 'Name', value: 'pagesCollection' },
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
                                    kind: 'FragmentSpread',
                                    name: {
                                      kind: 'Name',
                                      value: 'PageContent',
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
    ...NewsContentFragmentDoc.definitions,
    ...PageContentFragmentDoc.definitions,
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
            name: { kind: 'Name', value: 'discoverCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '1' },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'order' },
                value: { kind: 'EnumValue', value: 'sys_publishedAt_DESC' },
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
                        name: { kind: 'Name', value: 'pagesCollection' },
                        arguments: [
                          {
                            kind: 'Argument',
                            name: { kind: 'Name', value: 'limit' },
                            value: { kind: 'IntValue', value: '20' },
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
                                    kind: 'FragmentSpread',
                                    name: {
                                      kind: 'Name',
                                      value: 'PageContent',
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
                        name: { kind: 'Name', value: 'trainingCollection' },
                        arguments: [
                          {
                            kind: 'Argument',
                            name: { kind: 'Name', value: 'limit' },
                            value: { kind: 'IntValue', value: '20' },
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
                                    kind: 'FragmentSpread',
                                    name: {
                                      kind: 'Name',
                                      value: 'TutorialsContent',
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
                        name: { kind: 'Name', value: 'aboutUs' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'json' },
                            },
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
                                          name: {
                                            kind: 'Name',
                                            value: 'inline',
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
                                                  value: '__typename',
                                                },
                                              },
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: {
                                                    kind: 'Name',
                                                    value: 'Media',
                                                  },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'url',
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
                                    name: { kind: 'Name', value: 'assets' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'block',
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
                                                  value: 'url',
                                                },
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
                                                name: {
                                                  kind: 'Name',
                                                  value: 'width',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'height',
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
                        name: { kind: 'Name', value: 'membersCollection' },
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
                                    kind: 'FragmentSpread',
                                    name: {
                                      kind: 'Name',
                                      value: 'PartialUsersContent',
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
                        name: { kind: 'Name', value: 'membersTeam' },
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
                        name: {
                          kind: 'Name',
                          value: 'scientificAdvisoryBoardCollection',
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
                                    kind: 'FragmentSpread',
                                    name: {
                                      kind: 'Name',
                                      value: 'PartialUsersContent',
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
    ...PageContentFragmentDoc.definitions,
    ...TutorialsContentFragmentDoc.definitions,
    ...PartialUsersContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchDiscoverQuery, FetchDiscoverQueryVariables>;
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
                  name: { kind: 'Name', value: 'EventsContent' },
                },
              ],
            },
          },
        ],
      },
    },
    ...EventsContentFragmentDoc.definitions,
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
                        name: { kind: 'Name', value: 'EventsContent' },
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
    ...EventsContentFragmentDoc.definitions,
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
                                                        value: 'EventsContent',
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
    ...EventsContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchEventsByUserIdQuery,
  FetchEventsByUserIdQueryVariables
>;
export const FetchEventsByExternalAuthorIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchEventsByExternalAuthorId' },
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
            name: { kind: 'Name', value: 'externalAuthors' },
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
                                                        value: 'EventsContent',
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
    ...EventsContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchEventsByExternalAuthorIdQuery,
  FetchEventsByExternalAuthorIdQueryVariables
>;
export const FetchEventsByTeamIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchEventsByTeamId' },
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
            name: { kind: 'Name', value: 'teams' },
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
                                                        value: 'EventsContent',
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
    ...EventsContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchEventsByTeamIdQuery,
  FetchEventsByTeamIdQueryVariables
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
                  name: { kind: 'Name', value: 'calendars' },
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
export const FetchInterestGroupCalendarDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchInterestGroupCalendar' },
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
            name: { kind: 'Name', value: 'interestGroups' },
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
  FetchInterestGroupCalendarQuery,
  FetchInterestGroupCalendarQueryVariables
>;
export const FetchExternalAuthorByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchExternalAuthorById' },
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
            name: { kind: 'Name', value: 'externalAuthors' },
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
  FetchExternalAuthorByIdQuery,
  FetchExternalAuthorByIdQueryVariables
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
              name: { kind: 'Name', value: 'ExternalAuthorsOrder' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'externalAuthorsCollection' },
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
export const FetchInterestGroupByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchInterestGroupById' },
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
            name: { kind: 'Name', value: 'interestGroups' },
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
                  name: { kind: 'Name', value: 'InterestGroupsContent' },
                },
              ],
            },
          },
        ],
      },
    },
    ...InterestGroupsContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchInterestGroupByIdQuery,
  FetchInterestGroupByIdQueryVariables
>;
export const FetchInterestGroupsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchInterestGroups' },
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
              name: { kind: 'Name', value: 'InterestGroupsOrder' },
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
            name: { kind: 'Name', value: 'InterestGroupsFilter' },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'interestGroupsCollection' },
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
                        name: { kind: 'Name', value: 'InterestGroupsContent' },
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
    ...InterestGroupsContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchInterestGroupsQuery,
  FetchInterestGroupsQueryVariables
>;
export const FetchInterestGroupsByUserIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchInterestGroupsByUserId' },
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
            name: { kind: 'Name', value: 'interestGroupLeadersCollection' },
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
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'user' },
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
                                  name: { kind: 'Name', value: 'id' },
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
                        name: { kind: 'Name', value: 'linkedFrom' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'interestGroupsCollection',
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
                                          kind: 'FragmentSpread',
                                          name: {
                                            kind: 'Name',
                                            value: 'InterestGroupsContent',
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
    ...InterestGroupsContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchInterestGroupsByUserIdQuery,
  FetchInterestGroupsByUserIdQueryVariables
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
                  name: { kind: 'Name', value: 'NewsContent' },
                },
              ],
            },
          },
        ],
      },
    },
    ...NewsContentFragmentDoc.definitions,
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
                        name: { kind: 'Name', value: 'PageContent' },
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
    ...PageContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchPagesQuery, FetchPagesQueryVariables>;
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
              name: { kind: 'Name', value: 'ResearchTagsOrder' },
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
            name: { kind: 'Name', value: 'ResearchTagsFilter' },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'researchTagsCollection' },
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
                        name: { kind: 'Name', value: 'ResearchTagsContent' },
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
    ...ResearchTagsContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchResearchTagsQuery,
  FetchResearchTagsQueryVariables
>;
export const FetchTeamByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchTeamById' },
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
            name: { kind: 'Name', value: 'teams' },
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
} as unknown as DocumentNode<FetchTeamByIdQuery, FetchTeamByIdQueryVariables>;
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
              name: { kind: 'Name', value: 'TeamsOrder' },
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
            name: { kind: 'Name', value: 'TeamsFilter' },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamsCollection' },
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
export const FetchTutorialByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchTutorialById' },
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
            name: { kind: 'Name', value: 'tutorials' },
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
} as unknown as DocumentNode<
  FetchTutorialByIdQuery,
  FetchTutorialByIdQueryVariables
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
export const FetchUsersByTeamIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchUsersByTeamId' },
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
            name: { kind: 'Name', value: 'teamMembershipCollection' },
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
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'team' },
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
                                  name: { kind: 'Name', value: 'id' },
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
                        name: { kind: 'Name', value: 'linkedFrom' },
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
                                          kind: 'FragmentSpread',
                                          name: {
                                            kind: 'Name',
                                            value: 'UsersContent',
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
    ...UsersContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchUsersByTeamIdQuery,
  FetchUsersByTeamIdQueryVariables
>;
export const FetchUsersByLabIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchUsersByLabId' },
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
            name: { kind: 'Name', value: 'labs' },
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
                                      value: 'UsersContent',
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
    ...UsersContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchUsersByLabIdQuery,
  FetchUsersByLabIdQueryVariables
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
                  name: { kind: 'Name', value: 'WorkingGroupsContent' },
                },
              ],
            },
          },
        ],
      },
    },
    ...WorkingGroupsContentFragmentDoc.definitions,
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
              name: { kind: 'Name', value: 'WorkingGroupsOrder' },
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
            name: { kind: 'Name', value: 'WorkingGroupsFilter' },
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
                        name: { kind: 'Name', value: 'WorkingGroupsContent' },
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
    ...WorkingGroupsContentFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchWorkingGroupsQuery,
  FetchWorkingGroupsQueryVariables
>;
