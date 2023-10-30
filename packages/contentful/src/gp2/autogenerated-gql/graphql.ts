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

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/announcements) */
export type Announcements = Entry & {
  contentfulMetadata: ContentfulMetadata;
  deadline?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  link?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<AnnouncementsLinkingCollections>;
  sys: Sys;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/announcements) */
export type AnnouncementsDeadlineArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/announcements) */
export type AnnouncementsDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/announcements) */
export type AnnouncementsLinkArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/announcements) */
export type AnnouncementsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type AnnouncementsCollection = {
  items: Array<Maybe<Announcements>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type AnnouncementsFilter = {
  AND?: InputMaybe<Array<InputMaybe<AnnouncementsFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<AnnouncementsFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  deadline?: InputMaybe<Scalars['DateTime']>;
  deadline_exists?: InputMaybe<Scalars['Boolean']>;
  deadline_gt?: InputMaybe<Scalars['DateTime']>;
  deadline_gte?: InputMaybe<Scalars['DateTime']>;
  deadline_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  deadline_lt?: InputMaybe<Scalars['DateTime']>;
  deadline_lte?: InputMaybe<Scalars['DateTime']>;
  deadline_not?: InputMaybe<Scalars['DateTime']>;
  deadline_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_exists?: InputMaybe<Scalars['Boolean']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  link?: InputMaybe<Scalars['String']>;
  link_contains?: InputMaybe<Scalars['String']>;
  link_exists?: InputMaybe<Scalars['Boolean']>;
  link_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  link_not?: InputMaybe<Scalars['String']>;
  link_not_contains?: InputMaybe<Scalars['String']>;
  link_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
};

export type AnnouncementsLinkingCollections = {
  dashboardCollection?: Maybe<DashboardCollection>;
  entryCollection?: Maybe<EntryCollection>;
};

export type AnnouncementsLinkingCollectionsDashboardCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<AnnouncementsLinkingCollectionsDashboardCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type AnnouncementsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum AnnouncementsLinkingCollectionsDashboardCollectionOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export enum AnnouncementsOrder {
  DeadlineAsc = 'deadline_ASC',
  DeadlineDesc = 'deadline_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

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
  guideCollection?: Maybe<GuideCollection>;
  newsCollection?: Maybe<NewsCollection>;
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

export type AssetLinkingCollectionsGuideCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<AssetLinkingCollectionsGuideCollectionOrder>>
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
  CopyMeetingLinkAsc = 'copyMeetingLink_ASC',
  CopyMeetingLinkDesc = 'copyMeetingLink_DESC',
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

export enum AssetLinkingCollectionsGuideCollectionOrder {
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

export enum AssetLinkingCollectionsNewsCollectionOrder {
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
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
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
  OrcidLastModifiedDateAsc = 'orcidLastModifiedDate_ASC',
  OrcidLastModifiedDateDesc = 'orcidLastModifiedDate_DESC',
  OrcidLastSyncDateAsc = 'orcidLastSyncDate_ASC',
  OrcidLastSyncDateDesc = 'orcidLastSyncDate_DESC',
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
  CopyMeetingLinkAsc = 'copyMeetingLink_ASC',
  CopyMeetingLinkDesc = 'copyMeetingLink_DESC',
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
  studyLink?: Maybe<Scalars['String']>;
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

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/contributingCohorts) */
export type ContributingCohortsStudyLinkArgs = {
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
  studyLink?: InputMaybe<Scalars['String']>;
  studyLink_contains?: InputMaybe<Scalars['String']>;
  studyLink_exists?: InputMaybe<Scalars['Boolean']>;
  studyLink_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  studyLink_not?: InputMaybe<Scalars['String']>;
  studyLink_not_contains?: InputMaybe<Scalars['String']>;
  studyLink_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
};

export type ContributingCohortsLinkingCollections = {
  contributingCohortsMembershipCollection?: Maybe<ContributingCohortsMembershipCollection>;
  entryCollection?: Maybe<EntryCollection>;
  outputsCollection?: Maybe<OutputsCollection>;
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

export type ContributingCohortsLinkingCollectionsOutputsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<
      InputMaybe<ContributingCohortsLinkingCollectionsOutputsCollectionOrder>
    >
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum ContributingCohortsLinkingCollectionsContributingCohortsMembershipCollectionOrder {
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

export enum ContributingCohortsLinkingCollectionsOutputsCollectionOrder {
  AccessionNumberAsc = 'accessionNumber_ASC',
  AccessionNumberDesc = 'accessionNumber_DESC',
  AddedDateAsc = 'addedDate_ASC',
  AddedDateDesc = 'addedDate_DESC',
  AdminNotesAsc = 'adminNotes_ASC',
  AdminNotesDesc = 'adminNotes_DESC',
  DocumentTypeAsc = 'documentType_ASC',
  DocumentTypeDesc = 'documentType_DESC',
  DoiAsc = 'doi_ASC',
  DoiDesc = 'doi_DESC',
  Gp2SupportedAsc = 'gp2Supported_ASC',
  Gp2SupportedDesc = 'gp2Supported_DESC',
  LastUpdatedPartialAsc = 'lastUpdatedPartial_ASC',
  LastUpdatedPartialDesc = 'lastUpdatedPartial_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  PublishDateAsc = 'publishDate_ASC',
  PublishDateDesc = 'publishDate_DESC',
  RridAsc = 'rrid_ASC',
  RridDesc = 'rrid_DESC',
  SharingStatusAsc = 'sharingStatus_ASC',
  SharingStatusDesc = 'sharingStatus_DESC',
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

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/contributingCohortsMembership) */
export type ContributingCohortsMembership = Entry & {
  contentfulMetadata: ContentfulMetadata;
  contributingCohort?: Maybe<ContributingCohorts>;
  linkedFrom?: Maybe<ContributingCohortsMembershipLinkingCollections>;
  role?: Maybe<Scalars['String']>;
  sys: Sys;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/contributingCohortsMembership) */
export type ContributingCohortsMembershipContributingCohortArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<ContributingCohortsFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/contributingCohortsMembership) */
export type ContributingCohortsMembershipLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/contributingCohortsMembership) */
export type ContributingCohortsMembershipRoleArgs = {
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
  OrcidLastModifiedDateAsc = 'orcidLastModifiedDate_ASC',
  OrcidLastModifiedDateDesc = 'orcidLastModifiedDate_DESC',
  OrcidLastSyncDateAsc = 'orcidLastSyncDate_ASC',
  OrcidLastSyncDateDesc = 'orcidLastSyncDate_DESC',
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

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/dashboard) */
export type Dashboard = Entry & {
  announcementsCollection?: Maybe<DashboardAnnouncementsCollection>;
  contentfulMetadata: ContentfulMetadata;
  guidesCollection?: Maybe<DashboardGuidesCollection>;
  latestStats?: Maybe<LatestStats>;
  linkedFrom?: Maybe<DashboardLinkingCollections>;
  sys: Sys;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/dashboard) */
export type DashboardAnnouncementsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<DashboardAnnouncementsCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<AnnouncementsFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/dashboard) */
export type DashboardGuidesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<DashboardGuidesCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<GuideFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/dashboard) */
export type DashboardLatestStatsArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<LatestStatsFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/dashboard) */
export type DashboardLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type DashboardAnnouncementsCollection = {
  items: Array<Maybe<Announcements>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum DashboardAnnouncementsCollectionOrder {
  DeadlineAsc = 'deadline_ASC',
  DeadlineDesc = 'deadline_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export type DashboardCollection = {
  items: Array<Maybe<Dashboard>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type DashboardFilter = {
  AND?: InputMaybe<Array<InputMaybe<DashboardFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<DashboardFilter>>>;
  announcements?: InputMaybe<CfAnnouncementsNestedFilter>;
  announcementsCollection_exists?: InputMaybe<Scalars['Boolean']>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  guides?: InputMaybe<CfGuideNestedFilter>;
  guidesCollection_exists?: InputMaybe<Scalars['Boolean']>;
  latestStats?: InputMaybe<CfLatestStatsNestedFilter>;
  latestStats_exists?: InputMaybe<Scalars['Boolean']>;
  sys?: InputMaybe<SysFilter>;
};

export type DashboardGuidesCollection = {
  items: Array<Maybe<Guide>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum DashboardGuidesCollectionOrder {
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

export type DashboardLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
};

export type DashboardLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

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
  where?: InputMaybe<EventSpeakersUserFilter>;
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
  user?: InputMaybe<CfuserMultiTypeNestedFilter>;
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
  CopyMeetingLinkAsc = 'copyMeetingLink_ASC',
  CopyMeetingLinkDesc = 'copyMeetingLink_DESC',
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

export type EventSpeakersUserFilter = {
  AND?: InputMaybe<Array<InputMaybe<EventSpeakersUserFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<EventSpeakersUserFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  orcid?: InputMaybe<Scalars['String']>;
  orcid_contains?: InputMaybe<Scalars['String']>;
  orcid_exists?: InputMaybe<Scalars['Boolean']>;
  orcid_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  orcid_not?: InputMaybe<Scalars['String']>;
  orcid_not_contains?: InputMaybe<Scalars['String']>;
  orcid_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type Events = Entry & {
  calendar?: Maybe<Calendars>;
  contentfulMetadata: ContentfulMetadata;
  copyMeetingLink?: Maybe<Scalars['Boolean']>;
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
  tagsCollection?: Maybe<EventsTagsCollection>;
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
  where?: InputMaybe<CalendarsFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/events) */
export type EventsCopyMeetingLinkArgs = {
  locale?: InputMaybe<Scalars['String']>;
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
export type EventsTagsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<EventsTagsCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TagsFilter>;
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
  copyMeetingLink?: InputMaybe<Scalars['Boolean']>;
  copyMeetingLink_exists?: InputMaybe<Scalars['Boolean']>;
  copyMeetingLink_not?: InputMaybe<Scalars['Boolean']>;
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
  tags?: InputMaybe<CfTagsNestedFilter>;
  tagsCollection_exists?: InputMaybe<Scalars['Boolean']>;
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
  outputsCollection?: Maybe<OutputsCollection>;
};

export type EventsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type EventsLinkingCollectionsOutputsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<EventsLinkingCollectionsOutputsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum EventsLinkingCollectionsOutputsCollectionOrder {
  AccessionNumberAsc = 'accessionNumber_ASC',
  AccessionNumberDesc = 'accessionNumber_DESC',
  AddedDateAsc = 'addedDate_ASC',
  AddedDateDesc = 'addedDate_DESC',
  AdminNotesAsc = 'adminNotes_ASC',
  AdminNotesDesc = 'adminNotes_DESC',
  DocumentTypeAsc = 'documentType_ASC',
  DocumentTypeDesc = 'documentType_DESC',
  DoiAsc = 'doi_ASC',
  DoiDesc = 'doi_DESC',
  Gp2SupportedAsc = 'gp2Supported_ASC',
  Gp2SupportedDesc = 'gp2Supported_DESC',
  LastUpdatedPartialAsc = 'lastUpdatedPartial_ASC',
  LastUpdatedPartialDesc = 'lastUpdatedPartial_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  PublishDateAsc = 'publishDate_ASC',
  PublishDateDesc = 'publishDate_DESC',
  RridAsc = 'rrid_ASC',
  RridDesc = 'rrid_DESC',
  SharingStatusAsc = 'sharingStatus_ASC',
  SharingStatusDesc = 'sharingStatus_DESC',
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
  CopyMeetingLinkAsc = 'copyMeetingLink_ASC',
  CopyMeetingLinkDesc = 'copyMeetingLink_DESC',
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
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
}

export type EventsTagsCollection = {
  items: Array<Maybe<Tags>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum EventsTagsCollectionOrder {
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
  AccessionNumberAsc = 'accessionNumber_ASC',
  AccessionNumberDesc = 'accessionNumber_DESC',
  AddedDateAsc = 'addedDate_ASC',
  AddedDateDesc = 'addedDate_DESC',
  AdminNotesAsc = 'adminNotes_ASC',
  AdminNotesDesc = 'adminNotes_DESC',
  DocumentTypeAsc = 'documentType_ASC',
  DocumentTypeDesc = 'documentType_DESC',
  DoiAsc = 'doi_ASC',
  DoiDesc = 'doi_DESC',
  Gp2SupportedAsc = 'gp2Supported_ASC',
  Gp2SupportedDesc = 'gp2Supported_DESC',
  LastUpdatedPartialAsc = 'lastUpdatedPartial_ASC',
  LastUpdatedPartialDesc = 'lastUpdatedPartial_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  PublishDateAsc = 'publishDate_ASC',
  PublishDateDesc = 'publishDate_DESC',
  RridAsc = 'rrid_ASC',
  RridDesc = 'rrid_DESC',
  SharingStatusAsc = 'sharingStatus_ASC',
  SharingStatusDesc = 'sharingStatus_DESC',
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

/** Model for Tools and Tutorials guides [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/guide) */
export type Guide = Entry & {
  contentfulMetadata: ContentfulMetadata;
  descriptionCollection?: Maybe<GuideDescriptionCollection>;
  icon?: Maybe<Asset>;
  linkedFrom?: Maybe<GuideLinkingCollections>;
  sys: Sys;
  title?: Maybe<Scalars['String']>;
};

/** Model for Tools and Tutorials guides [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/guide) */
export type GuideDescriptionCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<GuideDescriptionCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<GuideDescriptionFilter>;
};

/** Model for Tools and Tutorials guides [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/guide) */
export type GuideIconArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

/** Model for Tools and Tutorials guides [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/guide) */
export type GuideLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** Model for Tools and Tutorials guides [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/guide) */
export type GuideTitleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type GuideCollection = {
  items: Array<Maybe<Guide>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/guideDescription) */
export type GuideDescription = Entry & {
  bodyText?: Maybe<Scalars['String']>;
  contentfulMetadata: ContentfulMetadata;
  linkText?: Maybe<Scalars['String']>;
  linkUrl?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<GuideDescriptionLinkingCollections>;
  sys: Sys;
  title?: Maybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/guideDescription) */
export type GuideDescriptionBodyTextArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/guideDescription) */
export type GuideDescriptionLinkTextArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/guideDescription) */
export type GuideDescriptionLinkUrlArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/guideDescription) */
export type GuideDescriptionLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/guideDescription) */
export type GuideDescriptionTitleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type GuideDescriptionCollection = {
  items: Array<Maybe<GuideDescription>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum GuideDescriptionCollectionOrder {
  LinkTextAsc = 'linkText_ASC',
  LinkTextDesc = 'linkText_DESC',
  LinkUrlAsc = 'linkUrl_ASC',
  LinkUrlDesc = 'linkUrl_DESC',
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

export type GuideDescriptionFilter = {
  AND?: InputMaybe<Array<InputMaybe<GuideDescriptionFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<GuideDescriptionFilter>>>;
  bodyText?: InputMaybe<Scalars['String']>;
  bodyText_contains?: InputMaybe<Scalars['String']>;
  bodyText_exists?: InputMaybe<Scalars['Boolean']>;
  bodyText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  bodyText_not?: InputMaybe<Scalars['String']>;
  bodyText_not_contains?: InputMaybe<Scalars['String']>;
  bodyText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  linkText?: InputMaybe<Scalars['String']>;
  linkText_contains?: InputMaybe<Scalars['String']>;
  linkText_exists?: InputMaybe<Scalars['Boolean']>;
  linkText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  linkText_not?: InputMaybe<Scalars['String']>;
  linkText_not_contains?: InputMaybe<Scalars['String']>;
  linkText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  linkUrl?: InputMaybe<Scalars['String']>;
  linkUrl_contains?: InputMaybe<Scalars['String']>;
  linkUrl_exists?: InputMaybe<Scalars['Boolean']>;
  linkUrl_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  linkUrl_not?: InputMaybe<Scalars['String']>;
  linkUrl_not_contains?: InputMaybe<Scalars['String']>;
  linkUrl_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type GuideDescriptionLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
  guideCollection?: Maybe<GuideCollection>;
};

export type GuideDescriptionLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type GuideDescriptionLinkingCollectionsGuideCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<GuideDescriptionLinkingCollectionsGuideCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum GuideDescriptionLinkingCollectionsGuideCollectionOrder {
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

export enum GuideDescriptionOrder {
  LinkTextAsc = 'linkText_ASC',
  LinkTextDesc = 'linkText_DESC',
  LinkUrlAsc = 'linkUrl_ASC',
  LinkUrlDesc = 'linkUrl_DESC',
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

export type GuideFilter = {
  AND?: InputMaybe<Array<InputMaybe<GuideFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<GuideFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  description?: InputMaybe<CfGuideDescriptionNestedFilter>;
  descriptionCollection_exists?: InputMaybe<Scalars['Boolean']>;
  icon_exists?: InputMaybe<Scalars['Boolean']>;
  sys?: InputMaybe<SysFilter>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type GuideLinkingCollections = {
  dashboardCollection?: Maybe<DashboardCollection>;
  entryCollection?: Maybe<EntryCollection>;
};

export type GuideLinkingCollectionsDashboardCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<GuideLinkingCollectionsDashboardCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type GuideLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum GuideLinkingCollectionsDashboardCollectionOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export enum GuideOrder {
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
  dashboardCollection?: Maybe<DashboardCollection>;
  entryCollection?: Maybe<EntryCollection>;
};

export type LatestStatsLinkingCollectionsDashboardCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<LatestStatsLinkingCollectionsDashboardCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type LatestStatsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum LatestStatsLinkingCollectionsDashboardCollectionOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

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
  contentfulMetadata: ContentfulMetadata;
  link?: Maybe<Scalars['String']>;
  linkText?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<NewsLinkingCollections>;
  publishDate?: Maybe<Scalars['DateTime']>;
  shortText?: Maybe<Scalars['String']>;
  sys: Sys;
  thumbnail?: Maybe<Asset>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
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
export type NewsShortTextArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** Hub News [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/news) */
export type NewsThumbnailArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

/** Hub News [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/news) */
export type NewsTitleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** Hub News [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/news) */
export type NewsTypeArgs = {
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
  thumbnail_exists?: InputMaybe<Scalars['Boolean']>;
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
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type Outputs = Entry & {
  accessionNumber?: Maybe<Scalars['String']>;
  addedDate?: Maybe<Scalars['DateTime']>;
  adminNotes?: Maybe<Scalars['String']>;
  authorsCollection?: Maybe<OutputsAuthorsCollection>;
  contentfulMetadata: ContentfulMetadata;
  contributingCohortsCollection?: Maybe<OutputsContributingCohortsCollection>;
  createdBy?: Maybe<Users>;
  description?: Maybe<Scalars['String']>;
  documentType?: Maybe<Scalars['String']>;
  doi?: Maybe<Scalars['String']>;
  gp2Supported?: Maybe<Scalars['String']>;
  lastUpdatedPartial?: Maybe<Scalars['DateTime']>;
  link?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<OutputsLinkingCollections>;
  publishDate?: Maybe<Scalars['DateTime']>;
  relatedEntitiesCollection?: Maybe<OutputsRelatedEntitiesCollection>;
  relatedEventsCollection?: Maybe<OutputsRelatedEventsCollection>;
  relatedOutputsCollection?: Maybe<OutputsRelatedOutputsCollection>;
  rrid?: Maybe<Scalars['String']>;
  sharingStatus?: Maybe<Scalars['String']>;
  subtype?: Maybe<Scalars['String']>;
  sys: Sys;
  tagsCollection?: Maybe<OutputsTagsCollection>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Users>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsAccessionNumberArgs = {
  locale?: InputMaybe<Scalars['String']>;
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
  where?: InputMaybe<OutputsAuthorsFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsContributingCohortsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<OutputsContributingCohortsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ContributingCohortsFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsCreatedByArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<UsersFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsDescriptionArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsDocumentTypeArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsDoiArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsGp2SupportedArgs = {
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
export type OutputsRelatedEntitiesCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<OutputsRelatedEntitiesFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsRelatedEventsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<OutputsRelatedEventsCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<EventsFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsRelatedOutputsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<OutputsRelatedOutputsCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<OutputsFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsRridArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsSharingStatusArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsSubtypeArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/outputs) */
export type OutputsTagsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<OutputsTagsCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TagsFilter>;
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
  where?: InputMaybe<UsersFilter>;
};

export type OutputsAuthorsCollection = {
  items: Array<Maybe<OutputsAuthorsItem>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type OutputsAuthorsFilter = {
  AND?: InputMaybe<Array<InputMaybe<OutputsAuthorsFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<OutputsAuthorsFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  orcid?: InputMaybe<Scalars['String']>;
  orcid_contains?: InputMaybe<Scalars['String']>;
  orcid_exists?: InputMaybe<Scalars['Boolean']>;
  orcid_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  orcid_not?: InputMaybe<Scalars['String']>;
  orcid_not_contains?: InputMaybe<Scalars['String']>;
  orcid_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
};

export type OutputsAuthorsItem = ExternalUsers | Users;

export type OutputsCollection = {
  items: Array<Maybe<Outputs>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type OutputsContributingCohortsCollection = {
  items: Array<Maybe<ContributingCohorts>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum OutputsContributingCohortsCollectionOrder {
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
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

export type OutputsFilter = {
  AND?: InputMaybe<Array<InputMaybe<OutputsFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<OutputsFilter>>>;
  accessionNumber?: InputMaybe<Scalars['String']>;
  accessionNumber_contains?: InputMaybe<Scalars['String']>;
  accessionNumber_exists?: InputMaybe<Scalars['Boolean']>;
  accessionNumber_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  accessionNumber_not?: InputMaybe<Scalars['String']>;
  accessionNumber_not_contains?: InputMaybe<Scalars['String']>;
  accessionNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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
  authors?: InputMaybe<CfauthorsMultiTypeNestedFilter>;
  authorsCollection_exists?: InputMaybe<Scalars['Boolean']>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  contributingCohorts?: InputMaybe<CfContributingCohortsNestedFilter>;
  contributingCohortsCollection_exists?: InputMaybe<Scalars['Boolean']>;
  createdBy?: InputMaybe<CfUsersNestedFilter>;
  createdBy_exists?: InputMaybe<Scalars['Boolean']>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_exists?: InputMaybe<Scalars['Boolean']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  documentType?: InputMaybe<Scalars['String']>;
  documentType_contains?: InputMaybe<Scalars['String']>;
  documentType_exists?: InputMaybe<Scalars['Boolean']>;
  documentType_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  documentType_not?: InputMaybe<Scalars['String']>;
  documentType_not_contains?: InputMaybe<Scalars['String']>;
  documentType_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  doi?: InputMaybe<Scalars['String']>;
  doi_contains?: InputMaybe<Scalars['String']>;
  doi_exists?: InputMaybe<Scalars['Boolean']>;
  doi_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  doi_not?: InputMaybe<Scalars['String']>;
  doi_not_contains?: InputMaybe<Scalars['String']>;
  doi_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  gp2Supported?: InputMaybe<Scalars['String']>;
  gp2Supported_contains?: InputMaybe<Scalars['String']>;
  gp2Supported_exists?: InputMaybe<Scalars['Boolean']>;
  gp2Supported_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  gp2Supported_not?: InputMaybe<Scalars['String']>;
  gp2Supported_not_contains?: InputMaybe<Scalars['String']>;
  gp2Supported_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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
  relatedEntities?: InputMaybe<CfrelatedEntitiesMultiTypeNestedFilter>;
  relatedEntitiesCollection_exists?: InputMaybe<Scalars['Boolean']>;
  relatedEvents?: InputMaybe<CfEventsNestedFilter>;
  relatedEventsCollection_exists?: InputMaybe<Scalars['Boolean']>;
  relatedOutputs?: InputMaybe<CfOutputsNestedFilter>;
  relatedOutputsCollection_exists?: InputMaybe<Scalars['Boolean']>;
  rrid?: InputMaybe<Scalars['String']>;
  rrid_contains?: InputMaybe<Scalars['String']>;
  rrid_exists?: InputMaybe<Scalars['Boolean']>;
  rrid_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  rrid_not?: InputMaybe<Scalars['String']>;
  rrid_not_contains?: InputMaybe<Scalars['String']>;
  rrid_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sharingStatus?: InputMaybe<Scalars['String']>;
  sharingStatus_contains?: InputMaybe<Scalars['String']>;
  sharingStatus_exists?: InputMaybe<Scalars['Boolean']>;
  sharingStatus_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sharingStatus_not?: InputMaybe<Scalars['String']>;
  sharingStatus_not_contains?: InputMaybe<Scalars['String']>;
  sharingStatus_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  subtype?: InputMaybe<Scalars['String']>;
  subtype_contains?: InputMaybe<Scalars['String']>;
  subtype_exists?: InputMaybe<Scalars['Boolean']>;
  subtype_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  subtype_not?: InputMaybe<Scalars['String']>;
  subtype_not_contains?: InputMaybe<Scalars['String']>;
  subtype_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  tags?: InputMaybe<CfTagsNestedFilter>;
  tagsCollection_exists?: InputMaybe<Scalars['Boolean']>;
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
  outputsCollection?: Maybe<OutputsCollection>;
};

export type OutputsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type OutputsLinkingCollectionsOutputsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<OutputsLinkingCollectionsOutputsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum OutputsLinkingCollectionsOutputsCollectionOrder {
  AccessionNumberAsc = 'accessionNumber_ASC',
  AccessionNumberDesc = 'accessionNumber_DESC',
  AddedDateAsc = 'addedDate_ASC',
  AddedDateDesc = 'addedDate_DESC',
  AdminNotesAsc = 'adminNotes_ASC',
  AdminNotesDesc = 'adminNotes_DESC',
  DocumentTypeAsc = 'documentType_ASC',
  DocumentTypeDesc = 'documentType_DESC',
  DoiAsc = 'doi_ASC',
  DoiDesc = 'doi_DESC',
  Gp2SupportedAsc = 'gp2Supported_ASC',
  Gp2SupportedDesc = 'gp2Supported_DESC',
  LastUpdatedPartialAsc = 'lastUpdatedPartial_ASC',
  LastUpdatedPartialDesc = 'lastUpdatedPartial_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  PublishDateAsc = 'publishDate_ASC',
  PublishDateDesc = 'publishDate_DESC',
  RridAsc = 'rrid_ASC',
  RridDesc = 'rrid_DESC',
  SharingStatusAsc = 'sharingStatus_ASC',
  SharingStatusDesc = 'sharingStatus_DESC',
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

export enum OutputsOrder {
  AccessionNumberAsc = 'accessionNumber_ASC',
  AccessionNumberDesc = 'accessionNumber_DESC',
  AddedDateAsc = 'addedDate_ASC',
  AddedDateDesc = 'addedDate_DESC',
  AdminNotesAsc = 'adminNotes_ASC',
  AdminNotesDesc = 'adminNotes_DESC',
  DocumentTypeAsc = 'documentType_ASC',
  DocumentTypeDesc = 'documentType_DESC',
  DoiAsc = 'doi_ASC',
  DoiDesc = 'doi_DESC',
  Gp2SupportedAsc = 'gp2Supported_ASC',
  Gp2SupportedDesc = 'gp2Supported_DESC',
  LastUpdatedPartialAsc = 'lastUpdatedPartial_ASC',
  LastUpdatedPartialDesc = 'lastUpdatedPartial_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  PublishDateAsc = 'publishDate_ASC',
  PublishDateDesc = 'publishDate_DESC',
  RridAsc = 'rrid_ASC',
  RridDesc = 'rrid_DESC',
  SharingStatusAsc = 'sharingStatus_ASC',
  SharingStatusDesc = 'sharingStatus_DESC',
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

export type OutputsRelatedEntitiesCollection = {
  items: Array<Maybe<OutputsRelatedEntitiesItem>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type OutputsRelatedEntitiesFilter = {
  AND?: InputMaybe<Array<InputMaybe<OutputsRelatedEntitiesFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<OutputsRelatedEntitiesFilter>>>;
  calendar_exists?: InputMaybe<Scalars['Boolean']>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  milestonesCollection_exists?: InputMaybe<Scalars['Boolean']>;
  resourcesCollection_exists?: InputMaybe<Scalars['Boolean']>;
  sys?: InputMaybe<SysFilter>;
  tagsCollection_exists?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type OutputsRelatedEntitiesItem = Projects | WorkingGroups;

export type OutputsRelatedEventsCollection = {
  items: Array<Maybe<Events>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum OutputsRelatedEventsCollectionOrder {
  CopyMeetingLinkAsc = 'copyMeetingLink_ASC',
  CopyMeetingLinkDesc = 'copyMeetingLink_DESC',
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

export type OutputsRelatedOutputsCollection = {
  items: Array<Maybe<Outputs>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum OutputsRelatedOutputsCollectionOrder {
  AccessionNumberAsc = 'accessionNumber_ASC',
  AccessionNumberDesc = 'accessionNumber_DESC',
  AddedDateAsc = 'addedDate_ASC',
  AddedDateDesc = 'addedDate_DESC',
  AdminNotesAsc = 'adminNotes_ASC',
  AdminNotesDesc = 'adminNotes_DESC',
  DocumentTypeAsc = 'documentType_ASC',
  DocumentTypeDesc = 'documentType_DESC',
  DoiAsc = 'doi_ASC',
  DoiDesc = 'doi_DESC',
  Gp2SupportedAsc = 'gp2Supported_ASC',
  Gp2SupportedDesc = 'gp2Supported_DESC',
  LastUpdatedPartialAsc = 'lastUpdatedPartial_ASC',
  LastUpdatedPartialDesc = 'lastUpdatedPartial_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  PublishDateAsc = 'publishDate_ASC',
  PublishDateDesc = 'publishDate_DESC',
  RridAsc = 'rrid_ASC',
  RridDesc = 'rrid_DESC',
  SharingStatusAsc = 'sharingStatus_ASC',
  SharingStatusDesc = 'sharingStatus_DESC',
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

export type OutputsTagsCollection = {
  items: Array<Maybe<Tags>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum OutputsTagsCollectionOrder {
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
  resources: PagesTextResources;
};

export type PagesTextResources = {
  block: Array<ResourceLink>;
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
  where?: InputMaybe<UsersFilter>;
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
  tagsCollection?: Maybe<ProjectsTagsCollection>;
  title?: Maybe<Scalars['String']>;
  traineeProject?: Maybe<Scalars['Boolean']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/projects) */
export type ProjectsCalendarArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<CalendarsFilter>;
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
export type ProjectsTagsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<ProjectsTagsCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TagsFilter>;
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
  tags?: InputMaybe<CfTagsNestedFilter>;
  tagsCollection_exists?: InputMaybe<Scalars['Boolean']>;
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
  AccessionNumberAsc = 'accessionNumber_ASC',
  AccessionNumberDesc = 'accessionNumber_DESC',
  AddedDateAsc = 'addedDate_ASC',
  AddedDateDesc = 'addedDate_DESC',
  AdminNotesAsc = 'adminNotes_ASC',
  AdminNotesDesc = 'adminNotes_DESC',
  DocumentTypeAsc = 'documentType_ASC',
  DocumentTypeDesc = 'documentType_DESC',
  DoiAsc = 'doi_ASC',
  DoiDesc = 'doi_DESC',
  Gp2SupportedAsc = 'gp2Supported_ASC',
  Gp2SupportedDesc = 'gp2Supported_DESC',
  LastUpdatedPartialAsc = 'lastUpdatedPartial_ASC',
  LastUpdatedPartialDesc = 'lastUpdatedPartial_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  PublishDateAsc = 'publishDate_ASC',
  PublishDateDesc = 'publishDate_DESC',
  RridAsc = 'rrid_ASC',
  RridDesc = 'rrid_DESC',
  SharingStatusAsc = 'sharingStatus_ASC',
  SharingStatusDesc = 'sharingStatus_DESC',
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

export type ProjectsTagsCollection = {
  items: Array<Maybe<Tags>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum ProjectsTagsCollectionOrder {
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

export type Query = {
  announcements?: Maybe<Announcements>;
  announcementsCollection?: Maybe<AnnouncementsCollection>;
  asset?: Maybe<Asset>;
  assetCollection?: Maybe<AssetCollection>;
  calendars?: Maybe<Calendars>;
  calendarsCollection?: Maybe<CalendarsCollection>;
  contributingCohorts?: Maybe<ContributingCohorts>;
  contributingCohortsCollection?: Maybe<ContributingCohortsCollection>;
  contributingCohortsMembership?: Maybe<ContributingCohortsMembership>;
  contributingCohortsMembershipCollection?: Maybe<ContributingCohortsMembershipCollection>;
  dashboard?: Maybe<Dashboard>;
  dashboardCollection?: Maybe<DashboardCollection>;
  entryCollection?: Maybe<EntryCollection>;
  eventSpeakers?: Maybe<EventSpeakers>;
  eventSpeakersCollection?: Maybe<EventSpeakersCollection>;
  events?: Maybe<Events>;
  eventsCollection?: Maybe<EventsCollection>;
  externalUsers?: Maybe<ExternalUsers>;
  externalUsersCollection?: Maybe<ExternalUsersCollection>;
  guide?: Maybe<Guide>;
  guideCollection?: Maybe<GuideCollection>;
  guideDescription?: Maybe<GuideDescription>;
  guideDescriptionCollection?: Maybe<GuideDescriptionCollection>;
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
  tags?: Maybe<Tags>;
  tagsCollection?: Maybe<TagsCollection>;
  users?: Maybe<Users>;
  usersCollection?: Maybe<UsersCollection>;
  workingGroupMembership?: Maybe<WorkingGroupMembership>;
  workingGroupMembershipCollection?: Maybe<WorkingGroupMembershipCollection>;
  workingGroupNetwork?: Maybe<WorkingGroupNetwork>;
  workingGroupNetworkCollection?: Maybe<WorkingGroupNetworkCollection>;
  workingGroups?: Maybe<WorkingGroups>;
  workingGroupsCollection?: Maybe<WorkingGroupsCollection>;
};

export type QueryAnnouncementsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryAnnouncementsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<AnnouncementsOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<AnnouncementsFilter>;
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

export type QueryGuideArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryGuideCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<GuideOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<GuideFilter>;
};

export type QueryGuideDescriptionArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryGuideDescriptionCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<GuideDescriptionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<GuideDescriptionFilter>;
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

export type QueryTagsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
};

export type QueryTagsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<TagsOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TagsFilter>;
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

export type ResourceLink = {
  sys: ResourceSys;
};

export type ResourceSys = {
  linkType: Scalars['String'];
  type: Scalars['String'];
  urn: Scalars['String'];
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

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/tags) */
export type Tags = Entry & {
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<TagsLinkingCollections>;
  name?: Maybe<Scalars['String']>;
  sys: Sys;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/tags) */
export type TagsLinkedFromArgs = {
  allowedLocales?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/tags) */
export type TagsNameArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

export type TagsCollection = {
  items: Array<Maybe<Tags>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type TagsFilter = {
  AND?: InputMaybe<Array<InputMaybe<TagsFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<TagsFilter>>>;
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

export type TagsLinkingCollections = {
  entryCollection?: Maybe<EntryCollection>;
  eventsCollection?: Maybe<EventsCollection>;
  outputsCollection?: Maybe<OutputsCollection>;
  projectsCollection?: Maybe<ProjectsCollection>;
  usersCollection?: Maybe<UsersCollection>;
  workingGroupsCollection?: Maybe<WorkingGroupsCollection>;
};

export type TagsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type TagsLinkingCollectionsEventsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<TagsLinkingCollectionsEventsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type TagsLinkingCollectionsOutputsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<TagsLinkingCollectionsOutputsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type TagsLinkingCollectionsProjectsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<TagsLinkingCollectionsProjectsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type TagsLinkingCollectionsUsersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<TagsLinkingCollectionsUsersCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type TagsLinkingCollectionsWorkingGroupsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<
    Array<InputMaybe<TagsLinkingCollectionsWorkingGroupsCollectionOrder>>
  >;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum TagsLinkingCollectionsEventsCollectionOrder {
  CopyMeetingLinkAsc = 'copyMeetingLink_ASC',
  CopyMeetingLinkDesc = 'copyMeetingLink_DESC',
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

export enum TagsLinkingCollectionsOutputsCollectionOrder {
  AccessionNumberAsc = 'accessionNumber_ASC',
  AccessionNumberDesc = 'accessionNumber_DESC',
  AddedDateAsc = 'addedDate_ASC',
  AddedDateDesc = 'addedDate_DESC',
  AdminNotesAsc = 'adminNotes_ASC',
  AdminNotesDesc = 'adminNotes_DESC',
  DocumentTypeAsc = 'documentType_ASC',
  DocumentTypeDesc = 'documentType_DESC',
  DoiAsc = 'doi_ASC',
  DoiDesc = 'doi_DESC',
  Gp2SupportedAsc = 'gp2Supported_ASC',
  Gp2SupportedDesc = 'gp2Supported_DESC',
  LastUpdatedPartialAsc = 'lastUpdatedPartial_ASC',
  LastUpdatedPartialDesc = 'lastUpdatedPartial_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  PublishDateAsc = 'publishDate_ASC',
  PublishDateDesc = 'publishDate_DESC',
  RridAsc = 'rrid_ASC',
  RridDesc = 'rrid_DESC',
  SharingStatusAsc = 'sharingStatus_ASC',
  SharingStatusDesc = 'sharingStatus_DESC',
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

export enum TagsLinkingCollectionsProjectsCollectionOrder {
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

export enum TagsLinkingCollectionsUsersCollectionOrder {
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
  OrcidLastModifiedDateAsc = 'orcidLastModifiedDate_ASC',
  OrcidLastModifiedDateDesc = 'orcidLastModifiedDate_DESC',
  OrcidLastSyncDateAsc = 'orcidLastSyncDate_ASC',
  OrcidLastSyncDateDesc = 'orcidLastSyncDate_DESC',
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

export enum TagsLinkingCollectionsWorkingGroupsCollectionOrder {
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

export enum TagsOrder {
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
  lastName?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<UsersLinkingCollections>;
  linkedIn?: Maybe<Scalars['String']>;
  onboarded?: Maybe<Scalars['Boolean']>;
  orcid?: Maybe<Scalars['String']>;
  orcidLastModifiedDate?: Maybe<Scalars['DateTime']>;
  orcidLastSyncDate?: Maybe<Scalars['DateTime']>;
  orcidWorks?: Maybe<Scalars['JSON']>;
  positions?: Maybe<Scalars['JSON']>;
  questions?: Maybe<Array<Maybe<Scalars['String']>>>;
  region?: Maybe<Scalars['String']>;
  researchGate?: Maybe<Scalars['String']>;
  researcherId?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  sys: Sys;
  tagsCollection?: Maybe<UsersTagsCollection>;
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
export type UsersOrcidLastModifiedDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersOrcidLastSyncDateArgs = {
  locale?: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/users) */
export type UsersOrcidWorksArgs = {
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
export type UsersTagsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<UsersTagsCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TagsFilter>;
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
  tags?: InputMaybe<CfTagsNestedFilter>;
  tagsCollection_exists?: InputMaybe<Scalars['Boolean']>;
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
  AccessionNumberAsc = 'accessionNumber_ASC',
  AccessionNumberDesc = 'accessionNumber_DESC',
  AddedDateAsc = 'addedDate_ASC',
  AddedDateDesc = 'addedDate_DESC',
  AdminNotesAsc = 'adminNotes_ASC',
  AdminNotesDesc = 'adminNotes_DESC',
  DocumentTypeAsc = 'documentType_ASC',
  DocumentTypeDesc = 'documentType_DESC',
  DoiAsc = 'doi_ASC',
  DoiDesc = 'doi_DESC',
  Gp2SupportedAsc = 'gp2Supported_ASC',
  Gp2SupportedDesc = 'gp2Supported_DESC',
  LastUpdatedPartialAsc = 'lastUpdatedPartial_ASC',
  LastUpdatedPartialDesc = 'lastUpdatedPartial_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  PublishDateAsc = 'publishDate_ASC',
  PublishDateDesc = 'publishDate_DESC',
  RridAsc = 'rrid_ASC',
  RridDesc = 'rrid_DESC',
  SharingStatusAsc = 'sharingStatus_ASC',
  SharingStatusDesc = 'sharingStatus_DESC',
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
  OrcidLastModifiedDateAsc = 'orcidLastModifiedDate_ASC',
  OrcidLastModifiedDateDesc = 'orcidLastModifiedDate_DESC',
  OrcidLastSyncDateAsc = 'orcidLastSyncDate_ASC',
  OrcidLastSyncDateDesc = 'orcidLastSyncDate_DESC',
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

export type UsersTagsCollection = {
  items: Array<Maybe<Tags>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum UsersTagsCollectionOrder {
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
  where?: InputMaybe<UsersFilter>;
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
  description?: Maybe<WorkingGroupsDescription>;
  leadingMembers?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<WorkingGroupsLinkingCollections>;
  membersCollection?: Maybe<WorkingGroupsMembersCollection>;
  milestonesCollection?: Maybe<WorkingGroupsMilestonesCollection>;
  primaryEmail?: Maybe<Scalars['String']>;
  resourcesCollection?: Maybe<WorkingGroupsResourcesCollection>;
  secondaryEmail?: Maybe<Scalars['String']>;
  shortDescription?: Maybe<Scalars['String']>;
  sys: Sys;
  tagsCollection?: Maybe<WorkingGroupsTagsCollection>;
  title?: Maybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/6ekgyp1432o9/content_types/workingGroups) */
export type WorkingGroupsCalendarArgs = {
  locale?: InputMaybe<Scalars['String']>;
  preview?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<CalendarsFilter>;
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
export type WorkingGroupsTagsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<WorkingGroupsTagsCollectionOrder>>>;
  preview?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TagsFilter>;
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
  calendar?: InputMaybe<CfCalendarsNestedFilter>;
  calendar_exists?: InputMaybe<Scalars['Boolean']>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_exists?: InputMaybe<Scalars['Boolean']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
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
  tags?: InputMaybe<CfTagsNestedFilter>;
  tagsCollection_exists?: InputMaybe<Scalars['Boolean']>;
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
  AccessionNumberAsc = 'accessionNumber_ASC',
  AccessionNumberDesc = 'accessionNumber_DESC',
  AddedDateAsc = 'addedDate_ASC',
  AddedDateDesc = 'addedDate_DESC',
  AdminNotesAsc = 'adminNotes_ASC',
  AdminNotesDesc = 'adminNotes_DESC',
  DocumentTypeAsc = 'documentType_ASC',
  DocumentTypeDesc = 'documentType_DESC',
  DoiAsc = 'doi_ASC',
  DoiDesc = 'doi_DESC',
  Gp2SupportedAsc = 'gp2Supported_ASC',
  Gp2SupportedDesc = 'gp2Supported_DESC',
  LastUpdatedPartialAsc = 'lastUpdatedPartial_ASC',
  LastUpdatedPartialDesc = 'lastUpdatedPartial_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  PublishDateAsc = 'publishDate_ASC',
  PublishDateDesc = 'publishDate_DESC',
  RridAsc = 'rrid_ASC',
  RridDesc = 'rrid_DESC',
  SharingStatusAsc = 'sharingStatus_ASC',
  SharingStatusDesc = 'sharingStatus_DESC',
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

export type WorkingGroupsTagsCollection = {
  items: Array<Maybe<Tags>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export enum WorkingGroupsTagsCollectionOrder {
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

export type CfAnnouncementsNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfAnnouncementsNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfAnnouncementsNestedFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  deadline?: InputMaybe<Scalars['DateTime']>;
  deadline_exists?: InputMaybe<Scalars['Boolean']>;
  deadline_gt?: InputMaybe<Scalars['DateTime']>;
  deadline_gte?: InputMaybe<Scalars['DateTime']>;
  deadline_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  deadline_lt?: InputMaybe<Scalars['DateTime']>;
  deadline_lte?: InputMaybe<Scalars['DateTime']>;
  deadline_not?: InputMaybe<Scalars['DateTime']>;
  deadline_not_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_exists?: InputMaybe<Scalars['Boolean']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  link?: InputMaybe<Scalars['String']>;
  link_contains?: InputMaybe<Scalars['String']>;
  link_exists?: InputMaybe<Scalars['Boolean']>;
  link_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  link_not?: InputMaybe<Scalars['String']>;
  link_not_contains?: InputMaybe<Scalars['String']>;
  link_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
};

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
  studyLink?: InputMaybe<Scalars['String']>;
  studyLink_contains?: InputMaybe<Scalars['String']>;
  studyLink_exists?: InputMaybe<Scalars['Boolean']>;
  studyLink_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  studyLink_not?: InputMaybe<Scalars['String']>;
  studyLink_not_contains?: InputMaybe<Scalars['String']>;
  studyLink_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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

export type CfEventsNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfEventsNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfEventsNestedFilter>>>;
  calendar_exists?: InputMaybe<Scalars['Boolean']>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  copyMeetingLink?: InputMaybe<Scalars['Boolean']>;
  copyMeetingLink_exists?: InputMaybe<Scalars['Boolean']>;
  copyMeetingLink_not?: InputMaybe<Scalars['Boolean']>;
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
  tagsCollection_exists?: InputMaybe<Scalars['Boolean']>;
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

export type CfGuideDescriptionNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfGuideDescriptionNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfGuideDescriptionNestedFilter>>>;
  bodyText?: InputMaybe<Scalars['String']>;
  bodyText_contains?: InputMaybe<Scalars['String']>;
  bodyText_exists?: InputMaybe<Scalars['Boolean']>;
  bodyText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  bodyText_not?: InputMaybe<Scalars['String']>;
  bodyText_not_contains?: InputMaybe<Scalars['String']>;
  bodyText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  linkText?: InputMaybe<Scalars['String']>;
  linkText_contains?: InputMaybe<Scalars['String']>;
  linkText_exists?: InputMaybe<Scalars['Boolean']>;
  linkText_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  linkText_not?: InputMaybe<Scalars['String']>;
  linkText_not_contains?: InputMaybe<Scalars['String']>;
  linkText_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  linkUrl?: InputMaybe<Scalars['String']>;
  linkUrl_contains?: InputMaybe<Scalars['String']>;
  linkUrl_exists?: InputMaybe<Scalars['Boolean']>;
  linkUrl_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  linkUrl_not?: InputMaybe<Scalars['String']>;
  linkUrl_not_contains?: InputMaybe<Scalars['String']>;
  linkUrl_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CfGuideNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfGuideNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfGuideNestedFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  descriptionCollection_exists?: InputMaybe<Scalars['Boolean']>;
  icon_exists?: InputMaybe<Scalars['Boolean']>;
  sys?: InputMaybe<SysFilter>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CfLatestStatsNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfLatestStatsNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfLatestStatsNestedFilter>>>;
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

export type CfOutputsNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfOutputsNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfOutputsNestedFilter>>>;
  accessionNumber?: InputMaybe<Scalars['String']>;
  accessionNumber_contains?: InputMaybe<Scalars['String']>;
  accessionNumber_exists?: InputMaybe<Scalars['Boolean']>;
  accessionNumber_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  accessionNumber_not?: InputMaybe<Scalars['String']>;
  accessionNumber_not_contains?: InputMaybe<Scalars['String']>;
  accessionNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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
  contributingCohortsCollection_exists?: InputMaybe<Scalars['Boolean']>;
  createdBy_exists?: InputMaybe<Scalars['Boolean']>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_exists?: InputMaybe<Scalars['Boolean']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  documentType?: InputMaybe<Scalars['String']>;
  documentType_contains?: InputMaybe<Scalars['String']>;
  documentType_exists?: InputMaybe<Scalars['Boolean']>;
  documentType_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  documentType_not?: InputMaybe<Scalars['String']>;
  documentType_not_contains?: InputMaybe<Scalars['String']>;
  documentType_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  doi?: InputMaybe<Scalars['String']>;
  doi_contains?: InputMaybe<Scalars['String']>;
  doi_exists?: InputMaybe<Scalars['Boolean']>;
  doi_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  doi_not?: InputMaybe<Scalars['String']>;
  doi_not_contains?: InputMaybe<Scalars['String']>;
  doi_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  gp2Supported?: InputMaybe<Scalars['String']>;
  gp2Supported_contains?: InputMaybe<Scalars['String']>;
  gp2Supported_exists?: InputMaybe<Scalars['Boolean']>;
  gp2Supported_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  gp2Supported_not?: InputMaybe<Scalars['String']>;
  gp2Supported_not_contains?: InputMaybe<Scalars['String']>;
  gp2Supported_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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
  relatedEntitiesCollection_exists?: InputMaybe<Scalars['Boolean']>;
  relatedEventsCollection_exists?: InputMaybe<Scalars['Boolean']>;
  relatedOutputsCollection_exists?: InputMaybe<Scalars['Boolean']>;
  rrid?: InputMaybe<Scalars['String']>;
  rrid_contains?: InputMaybe<Scalars['String']>;
  rrid_exists?: InputMaybe<Scalars['Boolean']>;
  rrid_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  rrid_not?: InputMaybe<Scalars['String']>;
  rrid_not_contains?: InputMaybe<Scalars['String']>;
  rrid_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sharingStatus?: InputMaybe<Scalars['String']>;
  sharingStatus_contains?: InputMaybe<Scalars['String']>;
  sharingStatus_exists?: InputMaybe<Scalars['Boolean']>;
  sharingStatus_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sharingStatus_not?: InputMaybe<Scalars['String']>;
  sharingStatus_not_contains?: InputMaybe<Scalars['String']>;
  sharingStatus_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  subtype?: InputMaybe<Scalars['String']>;
  subtype_contains?: InputMaybe<Scalars['String']>;
  subtype_exists?: InputMaybe<Scalars['Boolean']>;
  subtype_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  subtype_not?: InputMaybe<Scalars['String']>;
  subtype_not_contains?: InputMaybe<Scalars['String']>;
  subtype_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
  tagsCollection_exists?: InputMaybe<Scalars['Boolean']>;
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
  updatedBy_exists?: InputMaybe<Scalars['Boolean']>;
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

export type CfTagsNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfTagsNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfTagsNestedFilter>>>;
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
  tagsCollection_exists?: InputMaybe<Scalars['Boolean']>;
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
  description_contains?: InputMaybe<Scalars['String']>;
  description_exists?: InputMaybe<Scalars['Boolean']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
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
  tagsCollection_exists?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CfauthorsMultiTypeNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfauthorsMultiTypeNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfauthorsMultiTypeNestedFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  orcid?: InputMaybe<Scalars['String']>;
  orcid_contains?: InputMaybe<Scalars['String']>;
  orcid_exists?: InputMaybe<Scalars['Boolean']>;
  orcid_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  orcid_not?: InputMaybe<Scalars['String']>;
  orcid_not_contains?: InputMaybe<Scalars['String']>;
  orcid_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
};

export type CfrelatedEntitiesMultiTypeNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfrelatedEntitiesMultiTypeNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfrelatedEntitiesMultiTypeNestedFilter>>>;
  calendar_exists?: InputMaybe<Scalars['Boolean']>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  milestonesCollection_exists?: InputMaybe<Scalars['Boolean']>;
  resourcesCollection_exists?: InputMaybe<Scalars['Boolean']>;
  sys?: InputMaybe<SysFilter>;
  tagsCollection_exists?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_exists?: InputMaybe<Scalars['Boolean']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CfuserMultiTypeNestedFilter = {
  AND?: InputMaybe<Array<InputMaybe<CfuserMultiTypeNestedFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CfuserMultiTypeNestedFilter>>>;
  contentfulMetadata?: InputMaybe<ContentfulMetadataFilter>;
  orcid?: InputMaybe<Scalars['String']>;
  orcid_contains?: InputMaybe<Scalars['String']>;
  orcid_exists?: InputMaybe<Scalars['Boolean']>;
  orcid_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  orcid_not?: InputMaybe<Scalars['String']>;
  orcid_not_contains?: InputMaybe<Scalars['String']>;
  orcid_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys?: InputMaybe<SysFilter>;
};

export type AnnouncementsContentDataFragment = Pick<
  Announcements,
  'description' | 'deadline' | 'link'
> & { sys: Pick<Sys, 'id'> };

export type FetchAnnouncementsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
}>;

export type FetchAnnouncementsQuery = {
  announcementsCollection?: Maybe<
    Pick<AnnouncementsCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<Announcements, 'description' | 'deadline' | 'link'> & {
            sys: Pick<Sys, 'id'>;
          }
        >
      >;
    }
  >;
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
  'name' | 'studyLink'
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
        Maybe<
          Pick<ContributingCohorts, 'name' | 'studyLink'> & {
            sys: Pick<Sys, 'id'>;
          }
        >
      >;
    }
  >;
};

export type FetchDashboardQueryVariables = Exact<{
  orderAnnouncements?: InputMaybe<
    | Array<InputMaybe<DashboardAnnouncementsCollectionOrder>>
    | InputMaybe<DashboardAnnouncementsCollectionOrder>
  >;
}>;

export type FetchDashboardQuery = {
  dashboardCollection?: Maybe<
    Pick<DashboardCollection, 'total'> & {
      items: Array<
        Maybe<{
          latestStats?: Maybe<
            Pick<LatestStats, 'sampleCount' | 'articleCount' | 'cohortCount'>
          >;
          announcementsCollection?: Maybe<{
            items: Array<
              Maybe<
                Pick<Announcements, 'description' | 'deadline' | 'link'> & {
                  sys: Pick<Sys, 'id'>;
                }
              >
            >;
          }>;
          guidesCollection?: Maybe<{
            items: Array<
              Maybe<
                Pick<Guide, 'title'> & {
                  sys: Pick<Sys, 'id'>;
                  icon?: Maybe<Pick<Asset, 'url'>>;
                  descriptionCollection?: Maybe<{
                    items: Array<
                      Maybe<
                        Pick<
                          GuideDescription,
                          'title' | 'bodyText' | 'linkUrl' | 'linkText'
                        > & { sys: Pick<Sys, 'id'> }
                      >
                    >;
                  }>;
                }
              >
            >;
          }>;
        }>
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
  | 'googleId'
  | 'copyMeetingLink'
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
  tagsCollection?: Maybe<
    Pick<EventsTagsCollection, 'total'> & {
      items: Array<Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>>;
    }
  >;
  notes?: Maybe<
    Pick<EventsNotes, 'json'> & {
      links: {
        entries: {
          inline: Array<
            Maybe<
              | ({ __typename: 'Announcements' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Calendars' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ContributingCohorts' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'ContributingCohortsMembership' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'Dashboard' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ExternalUsers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Guide' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'GuideDescription' } & { sys: Pick<Sys, 'id'> })
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
              | ({ __typename: 'Tags' } & { sys: Pick<Sys, 'id'> })
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
              | ({ __typename: 'Announcements' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Calendars' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ContributingCohorts' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'ContributingCohortsMembership' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'Dashboard' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ExternalUsers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Guide' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'GuideDescription' } & { sys: Pick<Sys, 'id'> })
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
              | ({ __typename: 'Tags' } & { sys: Pick<Sys, 'id'> })
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
              | ({ __typename: 'Announcements' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Calendars' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ContributingCohorts' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'ContributingCohortsMembership' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'Dashboard' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ExternalUsers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Guide' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'GuideDescription' } & { sys: Pick<Sys, 'id'> })
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
              | ({ __typename: 'Tags' } & { sys: Pick<Sys, 'id'> })
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
      | 'googleId'
      | 'copyMeetingLink'
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
      tagsCollection?: Maybe<
        Pick<EventsTagsCollection, 'total'> & {
          items: Array<Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>>;
        }
      >;
      notes?: Maybe<
        Pick<EventsNotes, 'json'> & {
          links: {
            entries: {
              inline: Array<
                Maybe<
                  | ({ __typename: 'Announcements' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Calendars' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ContributingCohorts' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'ContributingCohortsMembership' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'Dashboard' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ExternalUsers' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Guide' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'GuideDescription' } & {
                      sys: Pick<Sys, 'id'>;
                    })
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
                  | ({ __typename: 'Tags' } & { sys: Pick<Sys, 'id'> })
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
                  | ({ __typename: 'Announcements' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Calendars' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ContributingCohorts' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'ContributingCohortsMembership' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'Dashboard' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ExternalUsers' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Guide' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'GuideDescription' } & {
                      sys: Pick<Sys, 'id'>;
                    })
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
                  | ({ __typename: 'Tags' } & { sys: Pick<Sys, 'id'> })
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
                  | ({ __typename: 'Announcements' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Calendars' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ContributingCohorts' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'ContributingCohortsMembership' } & {
                      sys: Pick<Sys, 'id'>;
                    })
                  | ({ __typename: 'Dashboard' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'ExternalUsers' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'Guide' } & { sys: Pick<Sys, 'id'> })
                  | ({ __typename: 'GuideDescription' } & {
                      sys: Pick<Sys, 'id'>;
                    })
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
                  | ({ __typename: 'Tags' } & { sys: Pick<Sys, 'id'> })
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
            | 'googleId'
            | 'copyMeetingLink'
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
            tagsCollection?: Maybe<
              Pick<EventsTagsCollection, 'total'> & {
                items: Array<
                  Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>
                >;
              }
            >;
            notes?: Maybe<
              Pick<EventsNotes, 'json'> & {
                links: {
                  entries: {
                    inline: Array<
                      Maybe<
                        | ({ __typename: 'Announcements' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Calendars' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'ContributingCohorts' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'ContributingCohortsMembership' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Dashboard' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'EventSpeakers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ExternalUsers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Guide' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'GuideDescription' } & {
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
                        | ({ __typename: 'Tags' } & { sys: Pick<Sys, 'id'> })
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
                        | ({ __typename: 'Announcements' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Calendars' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'ContributingCohorts' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'ContributingCohortsMembership' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Dashboard' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'EventSpeakers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ExternalUsers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Guide' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'GuideDescription' } & {
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
                        | ({ __typename: 'Tags' } & { sys: Pick<Sys, 'id'> })
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
                        | ({ __typename: 'Announcements' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Calendars' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'ContributingCohorts' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'ContributingCohortsMembership' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Dashboard' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'EventSpeakers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ExternalUsers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Guide' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'GuideDescription' } & {
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
                        | ({ __typename: 'Tags' } & { sys: Pick<Sys, 'id'> })
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
                        | 'googleId'
                        | 'copyMeetingLink'
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
                        tagsCollection?: Maybe<
                          Pick<EventsTagsCollection, 'total'> & {
                            items: Array<
                              Maybe<
                                Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }
                              >
                            >;
                          }
                        >;
                        notes?: Maybe<
                          Pick<EventsNotes, 'json'> & {
                            links: {
                              entries: {
                                inline: Array<
                                  Maybe<
                                    | ({ __typename: 'Announcements' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Calendars' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ContributingCohorts' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'ContributingCohortsMembership';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'Dashboard' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'EventSpeakers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Events' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalUsers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Guide' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'GuideDescription' } & {
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
                                    | ({ __typename: 'Tags' } & {
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
                                    | ({ __typename: 'Announcements' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Calendars' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ContributingCohorts' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'ContributingCohortsMembership';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'Dashboard' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'EventSpeakers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Events' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalUsers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Guide' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'GuideDescription' } & {
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
                                    | ({ __typename: 'Tags' } & {
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
                                    | ({ __typename: 'Announcements' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Calendars' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ContributingCohorts' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'ContributingCohortsMembership';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'Dashboard' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'EventSpeakers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Events' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalUsers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Guide' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'GuideDescription' } & {
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
                                    | ({ __typename: 'Tags' } & {
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
                        | 'googleId'
                        | 'copyMeetingLink'
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
                        tagsCollection?: Maybe<
                          Pick<EventsTagsCollection, 'total'> & {
                            items: Array<
                              Maybe<
                                Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }
                              >
                            >;
                          }
                        >;
                        notes?: Maybe<
                          Pick<EventsNotes, 'json'> & {
                            links: {
                              entries: {
                                inline: Array<
                                  Maybe<
                                    | ({ __typename: 'Announcements' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Calendars' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ContributingCohorts' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'ContributingCohortsMembership';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'Dashboard' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'EventSpeakers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Events' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalUsers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Guide' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'GuideDescription' } & {
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
                                    | ({ __typename: 'Tags' } & {
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
                                    | ({ __typename: 'Announcements' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Calendars' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ContributingCohorts' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'ContributingCohortsMembership';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'Dashboard' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'EventSpeakers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Events' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalUsers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Guide' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'GuideDescription' } & {
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
                                    | ({ __typename: 'Tags' } & {
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
                                    | ({ __typename: 'Announcements' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Calendars' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ContributingCohorts' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({
                                        __typename: 'ContributingCohortsMembership';
                                      } & { sys: Pick<Sys, 'id'> })
                                    | ({ __typename: 'Dashboard' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'EventSpeakers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Events' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'ExternalUsers' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'Guide' } & {
                                        sys: Pick<Sys, 'id'>;
                                      })
                                    | ({ __typename: 'GuideDescription' } & {
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
                                    | ({ __typename: 'Tags' } & {
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

export type FetchExternalUserByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchExternalUserByIdQuery = {
  externalUsers?: Maybe<
    Pick<ExternalUsers, 'name' | 'orcid'> & {
      sys: Pick<
        Sys,
        'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
      >;
    }
  >;
};

export type NewsContentDataFragment = Pick<
  News,
  'title' | 'shortText' | 'link' | 'linkText' | 'publishDate' | 'type'
> & {
  sys: Pick<Sys, 'id' | 'firstPublishedAt'>;
  thumbnail?: Maybe<Pick<Asset, 'url'>>;
};

export type FetchNewsByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type FetchNewsByIdQuery = {
  news?: Maybe<
    Pick<
      News,
      'title' | 'shortText' | 'link' | 'linkText' | 'publishDate' | 'type'
    > & {
      sys: Pick<Sys, 'id' | 'firstPublishedAt'>;
      thumbnail?: Maybe<Pick<Asset, 'url'>>;
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
            'title' | 'shortText' | 'link' | 'linkText' | 'publishDate' | 'type'
          > & {
            sys: Pick<Sys, 'id' | 'firstPublishedAt'>;
            thumbnail?: Maybe<Pick<Asset, 'url'>>;
          }
        >
      >;
    }
  >;
};

export type RelatedOutputDataFragment = Pick<
  Outputs,
  'title' | 'documentType' | 'type'
> & {
  sys: Pick<Sys, 'id'>;
  relatedEntitiesCollection?: Maybe<{
    items: Array<
      Maybe<
        | ({ __typename: 'Projects' } & Pick<Projects, 'title'> & {
              sys: Pick<Sys, 'id'>;
            })
        | ({ __typename: 'WorkingGroups' } & Pick<WorkingGroups, 'title'> & {
              sys: Pick<Sys, 'id'>;
            })
      >
    >;
  }>;
};

export type OutputsContentDataFragment = Pick<
  Outputs,
  | 'title'
  | 'documentType'
  | 'type'
  | 'subtype'
  | 'description'
  | 'gp2Supported'
  | 'sharingStatus'
  | 'link'
  | 'addedDate'
  | 'publishDate'
  | 'lastUpdatedPartial'
  | 'doi'
  | 'rrid'
  | 'accessionNumber'
> & {
  sys: Pick<
    Sys,
    'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
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
  tagsCollection?: Maybe<
    Pick<OutputsTagsCollection, 'total'> & {
      items: Array<Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>>;
    }
  >;
  relatedOutputsCollection?: Maybe<{
    items: Array<
      Maybe<
        Pick<Outputs, 'title' | 'documentType' | 'type'> & {
          sys: Pick<Sys, 'id'>;
          relatedEntitiesCollection?: Maybe<{
            items: Array<
              Maybe<
                | ({ __typename: 'Projects' } & Pick<Projects, 'title'> & {
                      sys: Pick<Sys, 'id'>;
                    })
                | ({ __typename: 'WorkingGroups' } & Pick<
                    WorkingGroups,
                    'title'
                  > & { sys: Pick<Sys, 'id'> })
              >
            >;
          }>;
        }
      >
    >;
  }>;
  linkedFrom?: Maybe<{
    outputsCollection?: Maybe<{
      items: Array<
        Maybe<
          Pick<Outputs, 'title' | 'documentType' | 'type'> & {
            sys: Pick<Sys, 'id'>;
            relatedEntitiesCollection?: Maybe<{
              items: Array<
                Maybe<
                  | ({ __typename: 'Projects' } & Pick<Projects, 'title'> & {
                        sys: Pick<Sys, 'id'>;
                      })
                  | ({ __typename: 'WorkingGroups' } & Pick<
                      WorkingGroups,
                      'title'
                    > & { sys: Pick<Sys, 'id'> })
                >
              >;
            }>;
          }
        >
      >;
    }>;
  }>;
  relatedEventsCollection?: Maybe<
    Pick<OutputsRelatedEventsCollection, 'total'> & {
      items: Array<
        Maybe<Pick<Events, 'title' | 'endDate'> & { sys: Pick<Sys, 'id'> }>
      >;
    }
  >;
  relatedEntitiesCollection?: Maybe<
    Pick<OutputsRelatedEntitiesCollection, 'total'> & {
      items: Array<
        Maybe<
          | ({ __typename: 'Projects' } & Pick<Projects, 'title'> & {
                sys: Pick<Sys, 'id'>;
              })
          | ({ __typename: 'WorkingGroups' } & Pick<WorkingGroups, 'title'> & {
                sys: Pick<Sys, 'id'>;
              })
        >
      >;
    }
  >;
  contributingCohortsCollection?: Maybe<
    Pick<OutputsContributingCohortsCollection, 'total'> & {
      items: Array<
        Maybe<
          Pick<ContributingCohorts, 'name' | 'studyLink'> & {
            sys: Pick<Sys, 'id'>;
          }
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
      | 'description'
      | 'gp2Supported'
      | 'sharingStatus'
      | 'link'
      | 'addedDate'
      | 'publishDate'
      | 'lastUpdatedPartial'
      | 'doi'
      | 'rrid'
      | 'accessionNumber'
    > & {
      sys: Pick<
        Sys,
        'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
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
      tagsCollection?: Maybe<
        Pick<OutputsTagsCollection, 'total'> & {
          items: Array<Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>>;
        }
      >;
      relatedOutputsCollection?: Maybe<{
        items: Array<
          Maybe<
            Pick<Outputs, 'title' | 'documentType' | 'type'> & {
              sys: Pick<Sys, 'id'>;
              relatedEntitiesCollection?: Maybe<{
                items: Array<
                  Maybe<
                    | ({ __typename: 'Projects' } & Pick<Projects, 'title'> & {
                          sys: Pick<Sys, 'id'>;
                        })
                    | ({ __typename: 'WorkingGroups' } & Pick<
                        WorkingGroups,
                        'title'
                      > & { sys: Pick<Sys, 'id'> })
                  >
                >;
              }>;
            }
          >
        >;
      }>;
      linkedFrom?: Maybe<{
        outputsCollection?: Maybe<{
          items: Array<
            Maybe<
              Pick<Outputs, 'title' | 'documentType' | 'type'> & {
                sys: Pick<Sys, 'id'>;
                relatedEntitiesCollection?: Maybe<{
                  items: Array<
                    Maybe<
                      | ({ __typename: 'Projects' } & Pick<
                          Projects,
                          'title'
                        > & { sys: Pick<Sys, 'id'> })
                      | ({ __typename: 'WorkingGroups' } & Pick<
                          WorkingGroups,
                          'title'
                        > & { sys: Pick<Sys, 'id'> })
                    >
                  >;
                }>;
              }
            >
          >;
        }>;
      }>;
      relatedEventsCollection?: Maybe<
        Pick<OutputsRelatedEventsCollection, 'total'> & {
          items: Array<
            Maybe<Pick<Events, 'title' | 'endDate'> & { sys: Pick<Sys, 'id'> }>
          >;
        }
      >;
      relatedEntitiesCollection?: Maybe<
        Pick<OutputsRelatedEntitiesCollection, 'total'> & {
          items: Array<
            Maybe<
              | ({ __typename: 'Projects' } & Pick<Projects, 'title'> & {
                    sys: Pick<Sys, 'id'>;
                  })
              | ({ __typename: 'WorkingGroups' } & Pick<
                  WorkingGroups,
                  'title'
                > & { sys: Pick<Sys, 'id'> })
            >
          >;
        }
      >;
      contributingCohortsCollection?: Maybe<
        Pick<OutputsContributingCohortsCollection, 'total'> & {
          items: Array<
            Maybe<
              Pick<ContributingCohorts, 'name' | 'studyLink'> & {
                sys: Pick<Sys, 'id'>;
              }
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
            | 'description'
            | 'gp2Supported'
            | 'sharingStatus'
            | 'link'
            | 'addedDate'
            | 'publishDate'
            | 'lastUpdatedPartial'
            | 'doi'
            | 'rrid'
            | 'accessionNumber'
          > & {
            sys: Pick<
              Sys,
              'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
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
            tagsCollection?: Maybe<
              Pick<OutputsTagsCollection, 'total'> & {
                items: Array<
                  Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>
                >;
              }
            >;
            relatedOutputsCollection?: Maybe<{
              items: Array<
                Maybe<
                  Pick<Outputs, 'title' | 'documentType' | 'type'> & {
                    sys: Pick<Sys, 'id'>;
                    relatedEntitiesCollection?: Maybe<{
                      items: Array<
                        Maybe<
                          | ({ __typename: 'Projects' } & Pick<
                              Projects,
                              'title'
                            > & { sys: Pick<Sys, 'id'> })
                          | ({ __typename: 'WorkingGroups' } & Pick<
                              WorkingGroups,
                              'title'
                            > & { sys: Pick<Sys, 'id'> })
                        >
                      >;
                    }>;
                  }
                >
              >;
            }>;
            linkedFrom?: Maybe<{
              outputsCollection?: Maybe<{
                items: Array<
                  Maybe<
                    Pick<Outputs, 'title' | 'documentType' | 'type'> & {
                      sys: Pick<Sys, 'id'>;
                      relatedEntitiesCollection?: Maybe<{
                        items: Array<
                          Maybe<
                            | ({ __typename: 'Projects' } & Pick<
                                Projects,
                                'title'
                              > & { sys: Pick<Sys, 'id'> })
                            | ({ __typename: 'WorkingGroups' } & Pick<
                                WorkingGroups,
                                'title'
                              > & { sys: Pick<Sys, 'id'> })
                          >
                        >;
                      }>;
                    }
                  >
                >;
              }>;
            }>;
            relatedEventsCollection?: Maybe<
              Pick<OutputsRelatedEventsCollection, 'total'> & {
                items: Array<
                  Maybe<
                    Pick<Events, 'title' | 'endDate'> & { sys: Pick<Sys, 'id'> }
                  >
                >;
              }
            >;
            relatedEntitiesCollection?: Maybe<
              Pick<OutputsRelatedEntitiesCollection, 'total'> & {
                items: Array<
                  Maybe<
                    | ({ __typename: 'Projects' } & Pick<Projects, 'title'> & {
                          sys: Pick<Sys, 'id'>;
                        })
                    | ({ __typename: 'WorkingGroups' } & Pick<
                        WorkingGroups,
                        'title'
                      > & { sys: Pick<Sys, 'id'> })
                  >
                >;
              }
            >;
            contributingCohortsCollection?: Maybe<
              Pick<OutputsContributingCohortsCollection, 'total'> & {
                items: Array<
                  Maybe<
                    Pick<ContributingCohorts, 'name' | 'studyLink'> & {
                      sys: Pick<Sys, 'id'>;
                    }
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
                | 'description'
                | 'gp2Supported'
                | 'sharingStatus'
                | 'link'
                | 'addedDate'
                | 'publishDate'
                | 'lastUpdatedPartial'
                | 'doi'
                | 'rrid'
                | 'accessionNumber'
              > & {
                sys: Pick<
                  Sys,
                  'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
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
                tagsCollection?: Maybe<
                  Pick<OutputsTagsCollection, 'total'> & {
                    items: Array<
                      Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>
                    >;
                  }
                >;
                relatedOutputsCollection?: Maybe<{
                  items: Array<
                    Maybe<
                      Pick<Outputs, 'title' | 'documentType' | 'type'> & {
                        sys: Pick<Sys, 'id'>;
                        relatedEntitiesCollection?: Maybe<{
                          items: Array<
                            Maybe<
                              | ({ __typename: 'Projects' } & Pick<
                                  Projects,
                                  'title'
                                > & { sys: Pick<Sys, 'id'> })
                              | ({ __typename: 'WorkingGroups' } & Pick<
                                  WorkingGroups,
                                  'title'
                                > & { sys: Pick<Sys, 'id'> })
                            >
                          >;
                        }>;
                      }
                    >
                  >;
                }>;
                linkedFrom?: Maybe<{
                  outputsCollection?: Maybe<{
                    items: Array<
                      Maybe<
                        Pick<Outputs, 'title' | 'documentType' | 'type'> & {
                          sys: Pick<Sys, 'id'>;
                          relatedEntitiesCollection?: Maybe<{
                            items: Array<
                              Maybe<
                                | ({ __typename: 'Projects' } & Pick<
                                    Projects,
                                    'title'
                                  > & { sys: Pick<Sys, 'id'> })
                                | ({ __typename: 'WorkingGroups' } & Pick<
                                    WorkingGroups,
                                    'title'
                                  > & { sys: Pick<Sys, 'id'> })
                              >
                            >;
                          }>;
                        }
                      >
                    >;
                  }>;
                }>;
                relatedEventsCollection?: Maybe<
                  Pick<OutputsRelatedEventsCollection, 'total'> & {
                    items: Array<
                      Maybe<
                        Pick<Events, 'title' | 'endDate'> & {
                          sys: Pick<Sys, 'id'>;
                        }
                      >
                    >;
                  }
                >;
                relatedEntitiesCollection?: Maybe<
                  Pick<OutputsRelatedEntitiesCollection, 'total'> & {
                    items: Array<
                      Maybe<
                        | ({ __typename: 'Projects' } & Pick<
                            Projects,
                            'title'
                          > & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'WorkingGroups' } & Pick<
                            WorkingGroups,
                            'title'
                          > & { sys: Pick<Sys, 'id'> })
                      >
                    >;
                  }
                >;
                contributingCohortsCollection?: Maybe<
                  Pick<OutputsContributingCohortsCollection, 'total'> & {
                    items: Array<
                      Maybe<
                        Pick<ContributingCohorts, 'name' | 'studyLink'> & {
                          sys: Pick<Sys, 'id'>;
                        }
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
                | 'description'
                | 'gp2Supported'
                | 'sharingStatus'
                | 'link'
                | 'addedDate'
                | 'publishDate'
                | 'lastUpdatedPartial'
                | 'doi'
                | 'rrid'
                | 'accessionNumber'
              > & {
                sys: Pick<
                  Sys,
                  'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
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
                tagsCollection?: Maybe<
                  Pick<OutputsTagsCollection, 'total'> & {
                    items: Array<
                      Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>
                    >;
                  }
                >;
                relatedOutputsCollection?: Maybe<{
                  items: Array<
                    Maybe<
                      Pick<Outputs, 'title' | 'documentType' | 'type'> & {
                        sys: Pick<Sys, 'id'>;
                        relatedEntitiesCollection?: Maybe<{
                          items: Array<
                            Maybe<
                              | ({ __typename: 'Projects' } & Pick<
                                  Projects,
                                  'title'
                                > & { sys: Pick<Sys, 'id'> })
                              | ({ __typename: 'WorkingGroups' } & Pick<
                                  WorkingGroups,
                                  'title'
                                > & { sys: Pick<Sys, 'id'> })
                            >
                          >;
                        }>;
                      }
                    >
                  >;
                }>;
                linkedFrom?: Maybe<{
                  outputsCollection?: Maybe<{
                    items: Array<
                      Maybe<
                        Pick<Outputs, 'title' | 'documentType' | 'type'> & {
                          sys: Pick<Sys, 'id'>;
                          relatedEntitiesCollection?: Maybe<{
                            items: Array<
                              Maybe<
                                | ({ __typename: 'Projects' } & Pick<
                                    Projects,
                                    'title'
                                  > & { sys: Pick<Sys, 'id'> })
                                | ({ __typename: 'WorkingGroups' } & Pick<
                                    WorkingGroups,
                                    'title'
                                  > & { sys: Pick<Sys, 'id'> })
                              >
                            >;
                          }>;
                        }
                      >
                    >;
                  }>;
                }>;
                relatedEventsCollection?: Maybe<
                  Pick<OutputsRelatedEventsCollection, 'total'> & {
                    items: Array<
                      Maybe<
                        Pick<Events, 'title' | 'endDate'> & {
                          sys: Pick<Sys, 'id'>;
                        }
                      >
                    >;
                  }
                >;
                relatedEntitiesCollection?: Maybe<
                  Pick<OutputsRelatedEntitiesCollection, 'total'> & {
                    items: Array<
                      Maybe<
                        | ({ __typename: 'Projects' } & Pick<
                            Projects,
                            'title'
                          > & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'WorkingGroups' } & Pick<
                            WorkingGroups,
                            'title'
                          > & { sys: Pick<Sys, 'id'> })
                      >
                    >;
                  }
                >;
                contributingCohortsCollection?: Maybe<
                  Pick<OutputsContributingCohortsCollection, 'total'> & {
                    items: Array<
                      Maybe<
                        Pick<ContributingCohorts, 'name' | 'studyLink'> & {
                          sys: Pick<Sys, 'id'>;
                        }
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

export type FetchOutputsByExternalUserIdQueryVariables = Exact<{
  id: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;

export type FetchOutputsByExternalUserIdQuery = {
  externalUsers?: Maybe<{
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
                | 'description'
                | 'gp2Supported'
                | 'sharingStatus'
                | 'link'
                | 'addedDate'
                | 'publishDate'
                | 'lastUpdatedPartial'
                | 'doi'
                | 'rrid'
                | 'accessionNumber'
              > & {
                sys: Pick<
                  Sys,
                  'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
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
                tagsCollection?: Maybe<
                  Pick<OutputsTagsCollection, 'total'> & {
                    items: Array<
                      Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>
                    >;
                  }
                >;
                relatedOutputsCollection?: Maybe<{
                  items: Array<
                    Maybe<
                      Pick<Outputs, 'title' | 'documentType' | 'type'> & {
                        sys: Pick<Sys, 'id'>;
                        relatedEntitiesCollection?: Maybe<{
                          items: Array<
                            Maybe<
                              | ({ __typename: 'Projects' } & Pick<
                                  Projects,
                                  'title'
                                > & { sys: Pick<Sys, 'id'> })
                              | ({ __typename: 'WorkingGroups' } & Pick<
                                  WorkingGroups,
                                  'title'
                                > & { sys: Pick<Sys, 'id'> })
                            >
                          >;
                        }>;
                      }
                    >
                  >;
                }>;
                linkedFrom?: Maybe<{
                  outputsCollection?: Maybe<{
                    items: Array<
                      Maybe<
                        Pick<Outputs, 'title' | 'documentType' | 'type'> & {
                          sys: Pick<Sys, 'id'>;
                          relatedEntitiesCollection?: Maybe<{
                            items: Array<
                              Maybe<
                                | ({ __typename: 'Projects' } & Pick<
                                    Projects,
                                    'title'
                                  > & { sys: Pick<Sys, 'id'> })
                                | ({ __typename: 'WorkingGroups' } & Pick<
                                    WorkingGroups,
                                    'title'
                                  > & { sys: Pick<Sys, 'id'> })
                              >
                            >;
                          }>;
                        }
                      >
                    >;
                  }>;
                }>;
                relatedEventsCollection?: Maybe<
                  Pick<OutputsRelatedEventsCollection, 'total'> & {
                    items: Array<
                      Maybe<
                        Pick<Events, 'title' | 'endDate'> & {
                          sys: Pick<Sys, 'id'>;
                        }
                      >
                    >;
                  }
                >;
                relatedEntitiesCollection?: Maybe<
                  Pick<OutputsRelatedEntitiesCollection, 'total'> & {
                    items: Array<
                      Maybe<
                        | ({ __typename: 'Projects' } & Pick<
                            Projects,
                            'title'
                          > & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'WorkingGroups' } & Pick<
                            WorkingGroups,
                            'title'
                          > & { sys: Pick<Sys, 'id'> })
                      >
                    >;
                  }
                >;
                contributingCohortsCollection?: Maybe<
                  Pick<OutputsContributingCohortsCollection, 'total'> & {
                    items: Array<
                      Maybe<
                        Pick<ContributingCohorts, 'name' | 'studyLink'> & {
                          sys: Pick<Sys, 'id'>;
                        }
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
                | 'description'
                | 'gp2Supported'
                | 'sharingStatus'
                | 'link'
                | 'addedDate'
                | 'publishDate'
                | 'lastUpdatedPartial'
                | 'doi'
                | 'rrid'
                | 'accessionNumber'
              > & {
                sys: Pick<
                  Sys,
                  'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
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
                tagsCollection?: Maybe<
                  Pick<OutputsTagsCollection, 'total'> & {
                    items: Array<
                      Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>
                    >;
                  }
                >;
                relatedOutputsCollection?: Maybe<{
                  items: Array<
                    Maybe<
                      Pick<Outputs, 'title' | 'documentType' | 'type'> & {
                        sys: Pick<Sys, 'id'>;
                        relatedEntitiesCollection?: Maybe<{
                          items: Array<
                            Maybe<
                              | ({ __typename: 'Projects' } & Pick<
                                  Projects,
                                  'title'
                                > & { sys: Pick<Sys, 'id'> })
                              | ({ __typename: 'WorkingGroups' } & Pick<
                                  WorkingGroups,
                                  'title'
                                > & { sys: Pick<Sys, 'id'> })
                            >
                          >;
                        }>;
                      }
                    >
                  >;
                }>;
                linkedFrom?: Maybe<{
                  outputsCollection?: Maybe<{
                    items: Array<
                      Maybe<
                        Pick<Outputs, 'title' | 'documentType' | 'type'> & {
                          sys: Pick<Sys, 'id'>;
                          relatedEntitiesCollection?: Maybe<{
                            items: Array<
                              Maybe<
                                | ({ __typename: 'Projects' } & Pick<
                                    Projects,
                                    'title'
                                  > & { sys: Pick<Sys, 'id'> })
                                | ({ __typename: 'WorkingGroups' } & Pick<
                                    WorkingGroups,
                                    'title'
                                  > & { sys: Pick<Sys, 'id'> })
                              >
                            >;
                          }>;
                        }
                      >
                    >;
                  }>;
                }>;
                relatedEventsCollection?: Maybe<
                  Pick<OutputsRelatedEventsCollection, 'total'> & {
                    items: Array<
                      Maybe<
                        Pick<Events, 'title' | 'endDate'> & {
                          sys: Pick<Sys, 'id'>;
                        }
                      >
                    >;
                  }
                >;
                relatedEntitiesCollection?: Maybe<
                  Pick<OutputsRelatedEntitiesCollection, 'total'> & {
                    items: Array<
                      Maybe<
                        | ({ __typename: 'Projects' } & Pick<
                            Projects,
                            'title'
                          > & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'WorkingGroups' } & Pick<
                            WorkingGroups,
                            'title'
                          > & { sys: Pick<Sys, 'id'> })
                      >
                    >;
                  }
                >;
                contributingCohortsCollection?: Maybe<
                  Pick<OutputsContributingCohortsCollection, 'total'> & {
                    items: Array<
                      Maybe<
                        Pick<ContributingCohorts, 'name' | 'studyLink'> & {
                          sys: Pick<Sys, 'id'>;
                        }
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

export type FetchOutputsByEventIdQueryVariables = Exact<{
  id: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;

export type FetchOutputsByEventIdQuery = {
  events?: Maybe<{
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
                | 'description'
                | 'gp2Supported'
                | 'sharingStatus'
                | 'link'
                | 'addedDate'
                | 'publishDate'
                | 'lastUpdatedPartial'
                | 'doi'
                | 'rrid'
                | 'accessionNumber'
              > & {
                sys: Pick<
                  Sys,
                  'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
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
                tagsCollection?: Maybe<
                  Pick<OutputsTagsCollection, 'total'> & {
                    items: Array<
                      Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>
                    >;
                  }
                >;
                relatedOutputsCollection?: Maybe<{
                  items: Array<
                    Maybe<
                      Pick<Outputs, 'title' | 'documentType' | 'type'> & {
                        sys: Pick<Sys, 'id'>;
                        relatedEntitiesCollection?: Maybe<{
                          items: Array<
                            Maybe<
                              | ({ __typename: 'Projects' } & Pick<
                                  Projects,
                                  'title'
                                > & { sys: Pick<Sys, 'id'> })
                              | ({ __typename: 'WorkingGroups' } & Pick<
                                  WorkingGroups,
                                  'title'
                                > & { sys: Pick<Sys, 'id'> })
                            >
                          >;
                        }>;
                      }
                    >
                  >;
                }>;
                linkedFrom?: Maybe<{
                  outputsCollection?: Maybe<{
                    items: Array<
                      Maybe<
                        Pick<Outputs, 'title' | 'documentType' | 'type'> & {
                          sys: Pick<Sys, 'id'>;
                          relatedEntitiesCollection?: Maybe<{
                            items: Array<
                              Maybe<
                                | ({ __typename: 'Projects' } & Pick<
                                    Projects,
                                    'title'
                                  > & { sys: Pick<Sys, 'id'> })
                                | ({ __typename: 'WorkingGroups' } & Pick<
                                    WorkingGroups,
                                    'title'
                                  > & { sys: Pick<Sys, 'id'> })
                              >
                            >;
                          }>;
                        }
                      >
                    >;
                  }>;
                }>;
                relatedEventsCollection?: Maybe<
                  Pick<OutputsRelatedEventsCollection, 'total'> & {
                    items: Array<
                      Maybe<
                        Pick<Events, 'title' | 'endDate'> & {
                          sys: Pick<Sys, 'id'>;
                        }
                      >
                    >;
                  }
                >;
                relatedEntitiesCollection?: Maybe<
                  Pick<OutputsRelatedEntitiesCollection, 'total'> & {
                    items: Array<
                      Maybe<
                        | ({ __typename: 'Projects' } & Pick<
                            Projects,
                            'title'
                          > & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'WorkingGroups' } & Pick<
                            WorkingGroups,
                            'title'
                          > & { sys: Pick<Sys, 'id'> })
                      >
                    >;
                  }
                >;
                contributingCohortsCollection?: Maybe<
                  Pick<OutputsContributingCohortsCollection, 'total'> & {
                    items: Array<
                      Maybe<
                        Pick<ContributingCohorts, 'name' | 'studyLink'> & {
                          sys: Pick<Sys, 'id'>;
                        }
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
              | ({ __typename: 'Announcements' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Calendars' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ContributingCohorts' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'ContributingCohortsMembership' } & {
                  sys: Pick<Sys, 'id'>;
                })
              | ({ __typename: 'Dashboard' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'EventSpeakers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'ExternalUsers' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'Guide' } & { sys: Pick<Sys, 'id'> })
              | ({ __typename: 'GuideDescription' } & { sys: Pick<Sys, 'id'> })
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
              | ({ __typename: 'Tags' } & { sys: Pick<Sys, 'id'> })
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
                        | ({ __typename: 'Announcements' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Calendars' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'ContributingCohorts' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'ContributingCohortsMembership' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Dashboard' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'EventSpeakers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Events' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'ExternalUsers' } & {
                            sys: Pick<Sys, 'id'>;
                          })
                        | ({ __typename: 'Guide' } & { sys: Pick<Sys, 'id'> })
                        | ({ __typename: 'GuideDescription' } & {
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
                        | ({ __typename: 'Tags' } & { sys: Pick<Sys, 'id'> })
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
  | 'traineeProject'
  | 'opportunitiesLink'
> & {
  sys: Pick<
    Sys,
    'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
  >;
  tagsCollection?: Maybe<
    Pick<ProjectsTagsCollection, 'total'> & {
      items: Array<Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>>;
    }
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
      | 'traineeProject'
      | 'opportunitiesLink'
    > & {
      sys: Pick<
        Sys,
        'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
      >;
      tagsCollection?: Maybe<
        Pick<ProjectsTagsCollection, 'total'> & {
          items: Array<Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>>;
        }
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
  where?: InputMaybe<ProjectsFilter>;
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
            | 'traineeProject'
            | 'opportunitiesLink'
          > & {
            sys: Pick<
              Sys,
              'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
            >;
            tagsCollection?: Maybe<
              Pick<ProjectsTagsCollection, 'total'> & {
                items: Array<
                  Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>
                >;
              }
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

export type FetchProjectsByUserQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  userId: Scalars['String'];
}>;

export type FetchProjectsByUserQuery = {
  projectMembershipCollection?: Maybe<
    Pick<ProjectMembershipCollection, 'total'> & {
      items: Array<
        Maybe<{
          linkedFrom?: Maybe<{
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
                      | 'traineeProject'
                      | 'opportunitiesLink'
                    > & {
                      sys: Pick<
                        Sys,
                        | 'id'
                        | 'firstPublishedAt'
                        | 'publishedAt'
                        | 'publishedVersion'
                      >;
                      tagsCollection?: Maybe<
                        Pick<ProjectsTagsCollection, 'total'> & {
                          items: Array<
                            Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>
                          >;
                        }
                      >;
                      membersCollection?: Maybe<
                        Pick<ProjectsMembersCollection, 'total'> & {
                          items: Array<
                            Maybe<
                              Pick<ProjectMembership, 'role'> & {
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
                        Pick<ProjectsMilestonesCollection, 'total'> & {
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
                        Pick<ProjectsResourcesCollection, 'total'> & {
                          items: Array<
                            Maybe<
                              Pick<
                                Resources,
                                | 'type'
                                | 'title'
                                | 'description'
                                | 'externalLink'
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
          }>;
        }>
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

export type TagsContentDataFragment = Pick<Tags, 'name'> & {
  sys: Pick<Sys, 'id'>;
};

export type FetchTagsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Array<InputMaybe<TagsOrder>> | InputMaybe<TagsOrder>>;
}>;

export type FetchTagsQuery = {
  tagsCollection?: Maybe<
    Pick<TagsCollection, 'total'> & {
      items: Array<Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>>;
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
  | 'biography'
  | 'questions'
  | 'fundingStreams'
  | 'blog'
  | 'linkedIn'
  | 'twitter'
  | 'github'
  | 'googleScholar'
  | 'orcid'
  | 'orcidLastModifiedDate'
  | 'orcidLastSyncDate'
  | 'orcidWorks'
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
  tagsCollection?: Maybe<
    Pick<UsersTagsCollection, 'total'> & {
      items: Array<Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>>;
    }
  >;
  contributingCohortsCollection?: Maybe<{
    items: Array<
      Maybe<
        Pick<ContributingCohortsMembership, 'role'> & {
          contributingCohort?: Maybe<
            Pick<ContributingCohorts, 'name' | 'studyLink'> & {
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
      | 'biography'
      | 'questions'
      | 'fundingStreams'
      | 'blog'
      | 'linkedIn'
      | 'twitter'
      | 'github'
      | 'googleScholar'
      | 'orcid'
      | 'orcidLastModifiedDate'
      | 'orcidLastSyncDate'
      | 'orcidWorks'
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
      tagsCollection?: Maybe<
        Pick<UsersTagsCollection, 'total'> & {
          items: Array<Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>>;
        }
      >;
      contributingCohortsCollection?: Maybe<{
        items: Array<
          Maybe<
            Pick<ContributingCohortsMembership, 'role'> & {
              contributingCohort?: Maybe<
                Pick<ContributingCohorts, 'name' | 'studyLink'> & {
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
            | 'biography'
            | 'questions'
            | 'fundingStreams'
            | 'blog'
            | 'linkedIn'
            | 'twitter'
            | 'github'
            | 'googleScholar'
            | 'orcid'
            | 'orcidLastModifiedDate'
            | 'orcidLastSyncDate'
            | 'orcidWorks'
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
            tagsCollection?: Maybe<
              Pick<UsersTagsCollection, 'total'> & {
                items: Array<
                  Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>
                >;
              }
            >;
            contributingCohortsCollection?: Maybe<{
              items: Array<
                Maybe<
                  Pick<ContributingCohortsMembership, 'role'> & {
                    contributingCohort?: Maybe<
                      Pick<ContributingCohorts, 'name' | 'studyLink'> & {
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

export type FetchUsersByProjectIdsQueryVariables = Exact<{
  ids: Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>;
}>;

export type FetchUsersByProjectIdsQuery = {
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

export type FetchUsersByWorkingGroupIdsQueryVariables = Exact<{
  ids: Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>;
}>;

export type FetchUsersByWorkingGroupIdsQuery = {
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

export type FetchUsersByTagIdsQueryVariables = Exact<{
  ids: Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>;
}>;

export type FetchUsersByTagIdsQuery = {
  usersCollection?: Maybe<
    Pick<UsersCollection, 'total'> & {
      items: Array<Maybe<{ sys: Pick<Sys, 'id'> }>>;
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
            | 'primaryEmail'
            | 'secondaryEmail'
            | 'leadingMembers'
          > & {
            sys: Pick<
              Sys,
              'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
            >;
            description?: Maybe<Pick<WorkingGroupsDescription, 'json'>>;
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
            tagsCollection?: Maybe<
              Pick<WorkingGroupsTagsCollection, 'total'> & {
                items: Array<
                  Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>
                >;
              }
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
            | 'primaryEmail'
            | 'secondaryEmail'
            | 'leadingMembers'
          > & {
            sys: Pick<
              Sys,
              'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
            >;
            description?: Maybe<Pick<WorkingGroupsDescription, 'json'>>;
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
            tagsCollection?: Maybe<
              Pick<WorkingGroupsTagsCollection, 'total'> & {
                items: Array<
                  Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>
                >;
              }
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
            | 'primaryEmail'
            | 'secondaryEmail'
            | 'leadingMembers'
          > & {
            sys: Pick<
              Sys,
              'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
            >;
            description?: Maybe<Pick<WorkingGroupsDescription, 'json'>>;
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
            tagsCollection?: Maybe<
              Pick<WorkingGroupsTagsCollection, 'total'> & {
                items: Array<
                  Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>
                >;
              }
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
            | 'primaryEmail'
            | 'secondaryEmail'
            | 'leadingMembers'
          > & {
            sys: Pick<
              Sys,
              'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
            >;
            description?: Maybe<Pick<WorkingGroupsDescription, 'json'>>;
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
            tagsCollection?: Maybe<
              Pick<WorkingGroupsTagsCollection, 'total'> & {
                items: Array<
                  Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>
                >;
              }
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
                    description?: Maybe<Pick<WorkingGroupsDescription, 'json'>>;
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
                    tagsCollection?: Maybe<
                      Pick<WorkingGroupsTagsCollection, 'total'> & {
                        items: Array<
                          Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>
                        >;
                      }
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
                    description?: Maybe<Pick<WorkingGroupsDescription, 'json'>>;
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
                    tagsCollection?: Maybe<
                      Pick<WorkingGroupsTagsCollection, 'total'> & {
                        items: Array<
                          Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>
                        >;
                      }
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
                    description?: Maybe<Pick<WorkingGroupsDescription, 'json'>>;
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
                    tagsCollection?: Maybe<
                      Pick<WorkingGroupsTagsCollection, 'total'> & {
                        items: Array<
                          Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>
                        >;
                      }
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
                    description?: Maybe<Pick<WorkingGroupsDescription, 'json'>>;
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
                    tagsCollection?: Maybe<
                      Pick<WorkingGroupsTagsCollection, 'total'> & {
                        items: Array<
                          Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>
                        >;
                      }
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
  | 'primaryEmail'
  | 'secondaryEmail'
  | 'leadingMembers'
> & {
  sys: Pick<
    Sys,
    'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
  >;
  description?: Maybe<Pick<WorkingGroupsDescription, 'json'>>;
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
  tagsCollection?: Maybe<
    Pick<WorkingGroupsTagsCollection, 'total'> & {
      items: Array<Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>>;
    }
  >;
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
      | 'primaryEmail'
      | 'secondaryEmail'
      | 'leadingMembers'
    > & {
      sys: Pick<
        Sys,
        'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
      >;
      description?: Maybe<Pick<WorkingGroupsDescription, 'json'>>;
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
      tagsCollection?: Maybe<
        Pick<WorkingGroupsTagsCollection, 'total'> & {
          items: Array<Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>>;
        }
      >;
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
            | 'primaryEmail'
            | 'secondaryEmail'
            | 'leadingMembers'
          > & {
            sys: Pick<
              Sys,
              'id' | 'firstPublishedAt' | 'publishedAt' | 'publishedVersion'
            >;
            description?: Maybe<Pick<WorkingGroupsDescription, 'json'>>;
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
            tagsCollection?: Maybe<
              Pick<WorkingGroupsTagsCollection, 'total'> & {
                items: Array<
                  Maybe<Pick<Tags, 'name'> & { sys: Pick<Sys, 'id'> }>
                >;
              }
            >;
          }
        >
      >;
    }
  >;
};

export const AnnouncementsContentDataFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AnnouncementsContentData' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Announcements' },
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
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'deadline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'link' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AnnouncementsContentDataFragment, unknown>;
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
          { kind: 'Field', name: { kind: 'Name', value: 'studyLink' } },
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
          { kind: 'Field', name: { kind: 'Name', value: 'googleId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'copyMeetingLink' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tagsCollection' },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
              ],
            },
          },
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
          { kind: 'Field', name: { kind: 'Name', value: 'publishDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<NewsContentDataFragment, unknown>;
export const RelatedOutputDataFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'RelatedOutputData' },
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
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'relatedEntitiesCollection' },
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
                        name: { kind: 'Name', value: '__typename' },
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
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'title' },
                            },
                          ],
                        },
                      },
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
} as unknown as DocumentNode<RelatedOutputDataFragment, unknown>;
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
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gp2Supported' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sharingStatus' } },
          { kind: 'Field', name: { kind: 'Name', value: 'link' } },
          { kind: 'Field', name: { kind: 'Name', value: 'addedDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'publishDate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lastUpdatedPartial' },
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tagsCollection' },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'relatedOutputsCollection' },
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
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'RelatedOutputData' },
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
                  name: { kind: 'Name', value: 'outputsCollection' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'limit' },
                      value: { kind: 'IntValue', value: '60' },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'order' },
                      value: {
                        kind: 'ListValue',
                        values: [{ kind: 'EnumValue', value: 'addedDate_ASC' }],
                      },
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
                                value: 'RelatedOutputData',
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
            name: { kind: 'Name', value: 'relatedEventsCollection' },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'endDate' },
                      },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'doi' } },
          { kind: 'Field', name: { kind: 'Name', value: 'rrid' } },
          { kind: 'Field', name: { kind: 'Name', value: 'accessionNumber' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'relatedEntitiesCollection' },
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
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'title' },
                            },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
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
        ],
      },
    },
    ...RelatedOutputDataFragmentDoc.definitions,
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tagsCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '6' },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
              ],
            },
          },
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
export const TagsContentDataFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TagsContentData' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Tags' },
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
} as unknown as DocumentNode<TagsContentDataFragment, unknown>;
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tagsCollection' },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'biography' } },
          { kind: 'Field', name: { kind: 'Name', value: 'questions' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fundingStreams' } },
          { kind: 'Field', name: { kind: 'Name', value: 'blog' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linkedIn' } },
          { kind: 'Field', name: { kind: 'Name', value: 'twitter' } },
          { kind: 'Field', name: { kind: 'Name', value: 'github' } },
          { kind: 'Field', name: { kind: 'Name', value: 'googleScholar' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orcid' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'orcidLastModifiedDate' },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'orcidLastSyncDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orcidWorks' } },
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
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'studyLink' },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'role' } },
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'description' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'json' } },
              ],
            },
          },
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tagsCollection' },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
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
export const FetchAnnouncementsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchAnnouncements' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'limit' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'announcementsCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'limit' },
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
                          value: 'AnnouncementsContentData',
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
    ...AnnouncementsContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchAnnouncementsQuery,
  FetchAnnouncementsQueryVariables
>;
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
export const FetchDashboardDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchDashboard' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'orderAnnouncements' },
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: {
                kind: 'Name',
                value: 'DashboardAnnouncementsCollectionOrder',
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
            name: { kind: 'Name', value: 'dashboardCollection' },
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
                        kind: 'Field',
                        name: { kind: 'Name', value: 'latestStats' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'sampleCount' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'articleCount' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'cohortCount' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'announcementsCollection',
                        },
                        arguments: [
                          {
                            kind: 'Argument',
                            name: { kind: 'Name', value: 'order' },
                            value: {
                              kind: 'Variable',
                              name: {
                                kind: 'Name',
                                value: 'orderAnnouncements',
                              },
                            },
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
                                      value: 'description',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'deadline' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'link' },
                                  },
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
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'guidesCollection' },
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
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'icon' },
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
                                    name: {
                                      kind: 'Name',
                                      value: 'descriptionCollection',
                                    },
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
                                                  value: 'bodyText',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'linkUrl',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'linkText',
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
} as unknown as DocumentNode<FetchDashboardQuery, FetchDashboardQueryVariables>;
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
export const FetchExternalUserByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchExternalUserById' },
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
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'ExternalUsersContentData' },
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
  FetchExternalUserByIdQuery,
  FetchExternalUserByIdQueryVariables
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
export const FetchOutputsByExternalUserIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchOutputsByExternalUserId' },
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
  FetchOutputsByExternalUserIdQuery,
  FetchOutputsByExternalUserIdQueryVariables
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
export const FetchOutputsByEventIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchOutputsByEventId' },
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
  FetchOutputsByEventIdQuery,
  FetchOutputsByEventIdQueryVariables
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
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'where' },
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'ProjectsFilter' },
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
export const FetchProjectsByUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchProjectsByUser' },
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
      ],
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
                                    name: { kind: 'Name', value: 'userId' },
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
                                            value: 'ProjectsContentData',
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
    ...ProjectsContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  FetchProjectsByUserQuery,
  FetchProjectsByUserQueryVariables
>;
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
export const FetchTagsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchTags' },
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
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'order' },
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'TagsOrder' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tagsCollection' },
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
                        name: { kind: 'Name', value: 'TagsContentData' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...TagsContentDataFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<FetchTagsQuery, FetchTagsQueryVariables>;
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
export const FetchUsersByProjectIdsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchUsersByProjectIds' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'ids' } },
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
                              name: { kind: 'Name', value: 'ids' },
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
  FetchUsersByProjectIdsQuery,
  FetchUsersByProjectIdsQueryVariables
>;
export const FetchUsersByWorkingGroupIdsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchUsersByWorkingGroupIds' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'ids' } },
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
                              name: { kind: 'Name', value: 'ids' },
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
  FetchUsersByWorkingGroupIdsQuery,
  FetchUsersByWorkingGroupIdsQueryVariables
>;
export const FetchUsersByTagIdsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchUsersByTagIds' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'ids' } },
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
            name: { kind: 'Name', value: 'usersCollection' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'tags' },
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
                                    name: { kind: 'Name', value: 'ids' },
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
  FetchUsersByTagIdsQuery,
  FetchUsersByTagIdsQueryVariables
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
