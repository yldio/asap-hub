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
  contentType: Maybe<Scalars['String']>;
  contentfulMetadata: ContentfulMetadata;
  description: Maybe<Scalars['String']>;
  fileName: Maybe<Scalars['String']>;
  height: Maybe<Scalars['Int']>;
  linkedFrom: Maybe<AssetLinkingCollections>;
  size: Maybe<Scalars['Int']>;
  sys: Sys;
  title: Maybe<Scalars['String']>;
  url: Maybe<Scalars['String']>;
  width: Maybe<Scalars['Int']>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetContentTypeArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetDescriptionArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetFileNameArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetHeightArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetLinkedFromArgs = {
  allowedLocales: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetSizeArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetTitleArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetUrlArgs = {
  locale: InputMaybe<Scalars['String']>;
  transform: InputMaybe<ImageTransformOptions>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetWidthArgs = {
  locale: InputMaybe<Scalars['String']>;
};

export type AssetCollection = {
  items: Array<Maybe<Asset>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type AssetFilter = {
  AND: InputMaybe<Array<InputMaybe<AssetFilter>>>;
  OR: InputMaybe<Array<InputMaybe<AssetFilter>>>;
  contentType: InputMaybe<Scalars['String']>;
  contentType_contains: InputMaybe<Scalars['String']>;
  contentType_exists: InputMaybe<Scalars['Boolean']>;
  contentType_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contentType_not: InputMaybe<Scalars['String']>;
  contentType_not_contains: InputMaybe<Scalars['String']>;
  contentType_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contentfulMetadata: InputMaybe<ContentfulMetadataFilter>;
  description: InputMaybe<Scalars['String']>;
  description_contains: InputMaybe<Scalars['String']>;
  description_exists: InputMaybe<Scalars['Boolean']>;
  description_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  description_not: InputMaybe<Scalars['String']>;
  description_not_contains: InputMaybe<Scalars['String']>;
  description_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  fileName: InputMaybe<Scalars['String']>;
  fileName_contains: InputMaybe<Scalars['String']>;
  fileName_exists: InputMaybe<Scalars['Boolean']>;
  fileName_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  fileName_not: InputMaybe<Scalars['String']>;
  fileName_not_contains: InputMaybe<Scalars['String']>;
  fileName_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  height: InputMaybe<Scalars['Int']>;
  height_exists: InputMaybe<Scalars['Boolean']>;
  height_gt: InputMaybe<Scalars['Int']>;
  height_gte: InputMaybe<Scalars['Int']>;
  height_in: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  height_lt: InputMaybe<Scalars['Int']>;
  height_lte: InputMaybe<Scalars['Int']>;
  height_not: InputMaybe<Scalars['Int']>;
  height_not_in: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  size: InputMaybe<Scalars['Int']>;
  size_exists: InputMaybe<Scalars['Boolean']>;
  size_gt: InputMaybe<Scalars['Int']>;
  size_gte: InputMaybe<Scalars['Int']>;
  size_in: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  size_lt: InputMaybe<Scalars['Int']>;
  size_lte: InputMaybe<Scalars['Int']>;
  size_not: InputMaybe<Scalars['Int']>;
  size_not_in: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  sys: InputMaybe<SysFilter>;
  title: InputMaybe<Scalars['String']>;
  title_contains: InputMaybe<Scalars['String']>;
  title_exists: InputMaybe<Scalars['Boolean']>;
  title_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not: InputMaybe<Scalars['String']>;
  title_not_contains: InputMaybe<Scalars['String']>;
  title_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  url: InputMaybe<Scalars['String']>;
  url_contains: InputMaybe<Scalars['String']>;
  url_exists: InputMaybe<Scalars['Boolean']>;
  url_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  url_not: InputMaybe<Scalars['String']>;
  url_not_contains: InputMaybe<Scalars['String']>;
  url_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  width: InputMaybe<Scalars['Int']>;
  width_exists: InputMaybe<Scalars['Boolean']>;
  width_gt: InputMaybe<Scalars['Int']>;
  width_gte: InputMaybe<Scalars['Int']>;
  width_in: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  width_lt: InputMaybe<Scalars['Int']>;
  width_lte: InputMaybe<Scalars['Int']>;
  width_not: InputMaybe<Scalars['Int']>;
  width_not_in: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type AssetLinkingCollections = {
  entryCollection: Maybe<EntryCollection>;
};

export type AssetLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
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

export type ContentfulMetadata = {
  tags: Array<Maybe<ContentfulTag>>;
};

export type ContentfulMetadataFilter = {
  tags: InputMaybe<ContentfulMetadataTagsFilter>;
  tags_exists: InputMaybe<Scalars['Boolean']>;
};

export type ContentfulMetadataTagsFilter = {
  id_contains_all: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id_contains_none: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id_contains_some: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/**
 * Represents a tag entity for finding and organizing content easily.
 *     Find out more here: https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/content-tags
 */
export type ContentfulTag = {
  id: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
};

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
  AND: InputMaybe<Array<InputMaybe<EntryFilter>>>;
  OR: InputMaybe<Array<InputMaybe<EntryFilter>>>;
  contentfulMetadata: InputMaybe<ContentfulMetadataFilter>;
  sys: InputMaybe<SysFilter>;
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

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/externalAuthors) */
export type ExternalAuthors = Entry & {
  contentfulMetadata: ContentfulMetadata;
  email: Maybe<Scalars['String']>;
  firstName: Maybe<Scalars['String']>;
  id: Maybe<Scalars['String']>;
  labsCollection: Maybe<ExternalAuthorsLabsCollection>;
  lastName: Maybe<Scalars['String']>;
  linkedFrom: Maybe<ExternalAuthorsLinkingCollections>;
  orcid: Maybe<Scalars['String']>;
  separatorBasicData: Maybe<ExternalAuthorsSeparatorBasicData>;
  sys: Sys;
  teamsCollection: Maybe<ExternalAuthorsTeamsCollection>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/externalAuthors) */
export type ExternalAuthorsEmailArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/externalAuthors) */
export type ExternalAuthorsFirstNameArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/externalAuthors) */
export type ExternalAuthorsIdArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/externalAuthors) */
export type ExternalAuthorsLabsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/externalAuthors) */
export type ExternalAuthorsLastNameArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/externalAuthors) */
export type ExternalAuthorsLinkedFromArgs = {
  allowedLocales: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/externalAuthors) */
export type ExternalAuthorsOrcidArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/externalAuthors) */
export type ExternalAuthorsSeparatorBasicDataArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/externalAuthors) */
export type ExternalAuthorsTeamsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type ExternalAuthorsCollection = {
  items: Array<Maybe<ExternalAuthors>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type ExternalAuthorsFilter = {
  AND: InputMaybe<Array<InputMaybe<ExternalAuthorsFilter>>>;
  OR: InputMaybe<Array<InputMaybe<ExternalAuthorsFilter>>>;
  contentfulMetadata: InputMaybe<ContentfulMetadataFilter>;
  email: InputMaybe<Scalars['String']>;
  email_contains: InputMaybe<Scalars['String']>;
  email_exists: InputMaybe<Scalars['Boolean']>;
  email_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  email_not: InputMaybe<Scalars['String']>;
  email_not_contains: InputMaybe<Scalars['String']>;
  email_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  firstName: InputMaybe<Scalars['String']>;
  firstName_contains: InputMaybe<Scalars['String']>;
  firstName_exists: InputMaybe<Scalars['Boolean']>;
  firstName_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  firstName_not: InputMaybe<Scalars['String']>;
  firstName_not_contains: InputMaybe<Scalars['String']>;
  firstName_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id: InputMaybe<Scalars['String']>;
  id_contains: InputMaybe<Scalars['String']>;
  id_exists: InputMaybe<Scalars['Boolean']>;
  id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id_not: InputMaybe<Scalars['String']>;
  id_not_contains: InputMaybe<Scalars['String']>;
  id_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  labsCollection_exists: InputMaybe<Scalars['Boolean']>;
  lastName: InputMaybe<Scalars['String']>;
  lastName_contains: InputMaybe<Scalars['String']>;
  lastName_exists: InputMaybe<Scalars['Boolean']>;
  lastName_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  lastName_not: InputMaybe<Scalars['String']>;
  lastName_not_contains: InputMaybe<Scalars['String']>;
  lastName_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  orcid: InputMaybe<Scalars['String']>;
  orcid_contains: InputMaybe<Scalars['String']>;
  orcid_exists: InputMaybe<Scalars['Boolean']>;
  orcid_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  orcid_not: InputMaybe<Scalars['String']>;
  orcid_not_contains: InputMaybe<Scalars['String']>;
  orcid_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  separatorBasicData_contains: InputMaybe<Scalars['String']>;
  separatorBasicData_exists: InputMaybe<Scalars['Boolean']>;
  separatorBasicData_not_contains: InputMaybe<Scalars['String']>;
  sys: InputMaybe<SysFilter>;
  teamsCollection_exists: InputMaybe<Scalars['Boolean']>;
};

export type ExternalAuthorsLabsCollection = {
  items: Array<Maybe<Labs>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type ExternalAuthorsLinkingCollections = {
  entryCollection: Maybe<EntryCollection>;
  sharedOutputsCollection: Maybe<SharedOutputsCollection>;
};

export type ExternalAuthorsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type ExternalAuthorsLinkingCollectionsSharedOutputsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum ExternalAuthorsOrder {
  EmailAsc = 'email_ASC',
  EmailDesc = 'email_DESC',
  FirstNameAsc = 'firstName_ASC',
  FirstNameDesc = 'firstName_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  LastNameAsc = 'lastName_ASC',
  LastNameDesc = 'lastName_DESC',
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

export type ExternalAuthorsSeparatorBasicData = {
  json: Scalars['JSON'];
  links: ExternalAuthorsSeparatorBasicDataLinks;
};

export type ExternalAuthorsSeparatorBasicDataAssets = {
  block: Array<Maybe<Asset>>;
  hyperlink: Array<Maybe<Asset>>;
};

export type ExternalAuthorsSeparatorBasicDataEntries = {
  block: Array<Maybe<Entry>>;
  hyperlink: Array<Maybe<Entry>>;
  inline: Array<Maybe<Entry>>;
};

export type ExternalAuthorsSeparatorBasicDataLinks = {
  assets: ExternalAuthorsSeparatorBasicDataAssets;
  entries: ExternalAuthorsSeparatorBasicDataEntries;
};

export type ExternalAuthorsTeamsCollection = {
  items: Array<Maybe<Teams>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

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
  backgroundColor: InputMaybe<Scalars['HexColor']>;
  /**
   * Desired corner radius in pixels.
   *         Results in an image with rounded corners (pass `-1` for a full circle/ellipse).
   *         Defaults to `0`. Uses desired background color as padding color,
   *         unless the format is `JPG` or `JPG_PROGRESSIVE` and resize strategy is `PAD`, then defaults to white.
   */
  cornerRadius: InputMaybe<Scalars['Int']>;
  /** Desired image format. Defaults to the original image format. */
  format: InputMaybe<ImageFormat>;
  /** Desired height in pixels. Defaults to the original image height. */
  height: InputMaybe<Scalars['Dimension']>;
  /**
   * Desired quality of the image in percents.
   *         Used for `PNG8`, `JPG`, `JPG_PROGRESSIVE` and `WEBP` formats.
   */
  quality: InputMaybe<Scalars['Quality']>;
  /** Desired resize focus area. Defaults to `CENTER`. */
  resizeFocus: InputMaybe<ImageResizeFocus>;
  /** Desired resize strategy. Defaults to `FIT`. */
  resizeStrategy: InputMaybe<ImageResizeStrategy>;
  /** Desired width in pixels. Defaults to the original image width. */
  width: InputMaybe<Scalars['Dimension']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/labs) */
export type Labs = Entry & {
  contentfulMetadata: ContentfulMetadata;
  id: Maybe<Scalars['String']>;
  linkedFrom: Maybe<LabsLinkingCollections>;
  name: Maybe<Scalars['String']>;
  sys: Sys;
  test: Maybe<Scalars['Int']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/labs) */
export type LabsIdArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/labs) */
export type LabsLinkedFromArgs = {
  allowedLocales: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/labs) */
export type LabsNameArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/labs) */
export type LabsTestArgs = {
  locale: InputMaybe<Scalars['String']>;
};

export type LabsCollection = {
  items: Array<Maybe<Labs>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type LabsFilter = {
  AND: InputMaybe<Array<InputMaybe<LabsFilter>>>;
  OR: InputMaybe<Array<InputMaybe<LabsFilter>>>;
  contentfulMetadata: InputMaybe<ContentfulMetadataFilter>;
  id: InputMaybe<Scalars['String']>;
  id_contains: InputMaybe<Scalars['String']>;
  id_exists: InputMaybe<Scalars['Boolean']>;
  id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id_not: InputMaybe<Scalars['String']>;
  id_not_contains: InputMaybe<Scalars['String']>;
  id_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name: InputMaybe<Scalars['String']>;
  name_contains: InputMaybe<Scalars['String']>;
  name_exists: InputMaybe<Scalars['Boolean']>;
  name_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name_not: InputMaybe<Scalars['String']>;
  name_not_contains: InputMaybe<Scalars['String']>;
  name_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys: InputMaybe<SysFilter>;
  test: InputMaybe<Scalars['Int']>;
  test_exists: InputMaybe<Scalars['Boolean']>;
  test_gt: InputMaybe<Scalars['Int']>;
  test_gte: InputMaybe<Scalars['Int']>;
  test_in: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  test_lt: InputMaybe<Scalars['Int']>;
  test_lte: InputMaybe<Scalars['Int']>;
  test_not: InputMaybe<Scalars['Int']>;
  test_not_in: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type LabsLinkingCollections = {
  entryCollection: Maybe<EntryCollection>;
  externalAuthorsCollection: Maybe<ExternalAuthorsCollection>;
  sharedOutputsCollection: Maybe<SharedOutputsCollection>;
  usersCollection: Maybe<UsersCollection>;
};

export type LabsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type LabsLinkingCollectionsExternalAuthorsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type LabsLinkingCollectionsSharedOutputsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type LabsLinkingCollectionsUsersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum LabsOrder {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
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
  TestAsc = 'test_ASC',
  TestDesc = 'test_DESC',
}

export type Query = {
  asset: Maybe<Asset>;
  assetCollection: Maybe<AssetCollection>;
  entryCollection: Maybe<EntryCollection>;
  externalAuthors: Maybe<ExternalAuthors>;
  externalAuthorsCollection: Maybe<ExternalAuthorsCollection>;
  labs: Maybe<Labs>;
  labsCollection: Maybe<LabsCollection>;
  sharedOutputs: Maybe<SharedOutputs>;
  sharedOutputsCollection: Maybe<SharedOutputsCollection>;
  teams: Maybe<Teams>;
  teamsCollection: Maybe<TeamsCollection>;
  userTeam: Maybe<UserTeam>;
  userTeamCollection: Maybe<UserTeamCollection>;
  users: Maybe<Users>;
  usersCollection: Maybe<UsersCollection>;
};

export type QueryAssetArgs = {
  id: Scalars['String'];
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
};

export type QueryAssetCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  order: InputMaybe<Array<InputMaybe<AssetOrder>>>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where: InputMaybe<AssetFilter>;
};

export type QueryEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  order: InputMaybe<Array<InputMaybe<EntryOrder>>>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where: InputMaybe<EntryFilter>;
};

export type QueryExternalAuthorsArgs = {
  id: Scalars['String'];
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
};

export type QueryExternalAuthorsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  order: InputMaybe<Array<InputMaybe<ExternalAuthorsOrder>>>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where: InputMaybe<ExternalAuthorsFilter>;
};

export type QueryLabsArgs = {
  id: Scalars['String'];
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
};

export type QueryLabsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  order: InputMaybe<Array<InputMaybe<LabsOrder>>>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where: InputMaybe<LabsFilter>;
};

export type QuerySharedOutputsArgs = {
  id: Scalars['String'];
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
};

export type QuerySharedOutputsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  order: InputMaybe<Array<InputMaybe<SharedOutputsOrder>>>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where: InputMaybe<SharedOutputsFilter>;
};

export type QueryTeamsArgs = {
  id: Scalars['String'];
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
};

export type QueryTeamsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  order: InputMaybe<Array<InputMaybe<TeamsOrder>>>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where: InputMaybe<TeamsFilter>;
};

export type QueryUserTeamArgs = {
  id: Scalars['String'];
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
};

export type QueryUserTeamCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  order: InputMaybe<Array<InputMaybe<UserTeamOrder>>>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where: InputMaybe<UserTeamFilter>;
};

export type QueryUsersArgs = {
  id: Scalars['String'];
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
};

export type QueryUsersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  order: InputMaybe<Array<InputMaybe<UsersOrder>>>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where: InputMaybe<UsersFilter>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/sharedOutputs) */
export type SharedOutputs = Entry & {
  authorsCollection: Maybe<SharedOutputsAuthorsCollection>;
  contentfulMetadata: ContentfulMetadata;
  description: Maybe<SharedOutputsDescription>;
  id: Maybe<Scalars['String']>;
  labsCollection: Maybe<SharedOutputsLabsCollection>;
  linkedFrom: Maybe<SharedOutputsLinkingCollections>;
  sys: Sys;
  title: Maybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/sharedOutputs) */
export type SharedOutputsAuthorsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/sharedOutputs) */
export type SharedOutputsDescriptionArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/sharedOutputs) */
export type SharedOutputsIdArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/sharedOutputs) */
export type SharedOutputsLabsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/sharedOutputs) */
export type SharedOutputsLinkedFromArgs = {
  allowedLocales: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/sharedOutputs) */
export type SharedOutputsTitleArgs = {
  locale: InputMaybe<Scalars['String']>;
};

export type SharedOutputsAuthorsCollection = {
  items: Array<Maybe<SharedOutputsAuthorsItem>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type SharedOutputsAuthorsItem = ExternalAuthors | Users;

export type SharedOutputsCollection = {
  items: Array<Maybe<SharedOutputs>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type SharedOutputsDescription = {
  json: Scalars['JSON'];
  links: SharedOutputsDescriptionLinks;
};

export type SharedOutputsDescriptionAssets = {
  block: Array<Maybe<Asset>>;
  hyperlink: Array<Maybe<Asset>>;
};

export type SharedOutputsDescriptionEntries = {
  block: Array<Maybe<Entry>>;
  hyperlink: Array<Maybe<Entry>>;
  inline: Array<Maybe<Entry>>;
};

export type SharedOutputsDescriptionLinks = {
  assets: SharedOutputsDescriptionAssets;
  entries: SharedOutputsDescriptionEntries;
};

export type SharedOutputsFilter = {
  AND: InputMaybe<Array<InputMaybe<SharedOutputsFilter>>>;
  OR: InputMaybe<Array<InputMaybe<SharedOutputsFilter>>>;
  authorsCollection_exists: InputMaybe<Scalars['Boolean']>;
  contentfulMetadata: InputMaybe<ContentfulMetadataFilter>;
  description_contains: InputMaybe<Scalars['String']>;
  description_exists: InputMaybe<Scalars['Boolean']>;
  description_not_contains: InputMaybe<Scalars['String']>;
  id: InputMaybe<Scalars['String']>;
  id_contains: InputMaybe<Scalars['String']>;
  id_exists: InputMaybe<Scalars['Boolean']>;
  id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id_not: InputMaybe<Scalars['String']>;
  id_not_contains: InputMaybe<Scalars['String']>;
  id_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  labsCollection_exists: InputMaybe<Scalars['Boolean']>;
  sys: InputMaybe<SysFilter>;
  title: InputMaybe<Scalars['String']>;
  title_contains: InputMaybe<Scalars['String']>;
  title_exists: InputMaybe<Scalars['Boolean']>;
  title_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not: InputMaybe<Scalars['String']>;
  title_not_contains: InputMaybe<Scalars['String']>;
  title_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type SharedOutputsLabsCollection = {
  items: Array<Maybe<Labs>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type SharedOutputsLinkingCollections = {
  entryCollection: Maybe<EntryCollection>;
  teamsCollection: Maybe<TeamsCollection>;
};

export type SharedOutputsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type SharedOutputsLinkingCollectionsTeamsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum SharedOutputsOrder {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
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

export type Sys = {
  environmentId: Scalars['String'];
  firstPublishedAt: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  publishedAt: Maybe<Scalars['DateTime']>;
  publishedVersion: Maybe<Scalars['Int']>;
  spaceId: Scalars['String'];
};

export type SysFilter = {
  firstPublishedAt: InputMaybe<Scalars['DateTime']>;
  firstPublishedAt_exists: InputMaybe<Scalars['Boolean']>;
  firstPublishedAt_gt: InputMaybe<Scalars['DateTime']>;
  firstPublishedAt_gte: InputMaybe<Scalars['DateTime']>;
  firstPublishedAt_in: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  firstPublishedAt_lt: InputMaybe<Scalars['DateTime']>;
  firstPublishedAt_lte: InputMaybe<Scalars['DateTime']>;
  firstPublishedAt_not: InputMaybe<Scalars['DateTime']>;
  firstPublishedAt_not_in: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  id: InputMaybe<Scalars['String']>;
  id_contains: InputMaybe<Scalars['String']>;
  id_exists: InputMaybe<Scalars['Boolean']>;
  id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id_not: InputMaybe<Scalars['String']>;
  id_not_contains: InputMaybe<Scalars['String']>;
  id_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  publishedAt: InputMaybe<Scalars['DateTime']>;
  publishedAt_exists: InputMaybe<Scalars['Boolean']>;
  publishedAt_gt: InputMaybe<Scalars['DateTime']>;
  publishedAt_gte: InputMaybe<Scalars['DateTime']>;
  publishedAt_in: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  publishedAt_lt: InputMaybe<Scalars['DateTime']>;
  publishedAt_lte: InputMaybe<Scalars['DateTime']>;
  publishedAt_not: InputMaybe<Scalars['DateTime']>;
  publishedAt_not_in: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  publishedVersion: InputMaybe<Scalars['Float']>;
  publishedVersion_exists: InputMaybe<Scalars['Boolean']>;
  publishedVersion_gt: InputMaybe<Scalars['Float']>;
  publishedVersion_gte: InputMaybe<Scalars['Float']>;
  publishedVersion_in: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  publishedVersion_lt: InputMaybe<Scalars['Float']>;
  publishedVersion_lte: InputMaybe<Scalars['Float']>;
  publishedVersion_not: InputMaybe<Scalars['Float']>;
  publishedVersion_not_in: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/teams) */
export type Teams = Entry & {
  contentfulMetadata: ContentfulMetadata;
  displayName: Maybe<Scalars['String']>;
  id: Maybe<Scalars['String']>;
  linkedFrom: Maybe<TeamsLinkingCollections>;
  outputsCollection: Maybe<TeamsOutputsCollection>;
  sys: Sys;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/teams) */
export type TeamsDisplayNameArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/teams) */
export type TeamsIdArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/teams) */
export type TeamsLinkedFromArgs = {
  allowedLocales: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/teams) */
export type TeamsOutputsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type TeamsCollection = {
  items: Array<Maybe<Teams>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type TeamsFilter = {
  AND: InputMaybe<Array<InputMaybe<TeamsFilter>>>;
  OR: InputMaybe<Array<InputMaybe<TeamsFilter>>>;
  contentfulMetadata: InputMaybe<ContentfulMetadataFilter>;
  displayName: InputMaybe<Scalars['String']>;
  displayName_contains: InputMaybe<Scalars['String']>;
  displayName_exists: InputMaybe<Scalars['Boolean']>;
  displayName_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  displayName_not: InputMaybe<Scalars['String']>;
  displayName_not_contains: InputMaybe<Scalars['String']>;
  displayName_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id: InputMaybe<Scalars['String']>;
  id_contains: InputMaybe<Scalars['String']>;
  id_exists: InputMaybe<Scalars['Boolean']>;
  id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id_not: InputMaybe<Scalars['String']>;
  id_not_contains: InputMaybe<Scalars['String']>;
  id_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  outputsCollection_exists: InputMaybe<Scalars['Boolean']>;
  sys: InputMaybe<SysFilter>;
};

export type TeamsLinkingCollections = {
  entryCollection: Maybe<EntryCollection>;
  externalAuthorsCollection: Maybe<ExternalAuthorsCollection>;
  userTeamCollection: Maybe<UserTeamCollection>;
  usersCollection: Maybe<UsersCollection>;
};

export type TeamsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type TeamsLinkingCollectionsExternalAuthorsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type TeamsLinkingCollectionsUserTeamCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type TeamsLinkingCollectionsUsersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum TeamsOrder {
  DisplayNameAsc = 'displayName_ASC',
  DisplayNameDesc = 'displayName_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

export type TeamsOutputsCollection = {
  items: Array<Maybe<SharedOutputs>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/userTeam) */
export type UserTeam = Entry & {
  contentfulMetadata: ContentfulMetadata;
  linkedFrom: Maybe<UserTeamLinkingCollections>;
  sys: Sys;
  team: Maybe<Teams>;
  user: Maybe<Users>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/userTeam) */
export type UserTeamLinkedFromArgs = {
  allowedLocales: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/userTeam) */
export type UserTeamTeamArgs = {
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/userTeam) */
export type UserTeamUserArgs = {
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
};

export type UserTeamCollection = {
  items: Array<Maybe<UserTeam>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type UserTeamFilter = {
  AND: InputMaybe<Array<InputMaybe<UserTeamFilter>>>;
  OR: InputMaybe<Array<InputMaybe<UserTeamFilter>>>;
  contentfulMetadata: InputMaybe<ContentfulMetadataFilter>;
  sys: InputMaybe<SysFilter>;
  team: InputMaybe<CfTeamsNestedFilter>;
  team_exists: InputMaybe<Scalars['Boolean']>;
  user: InputMaybe<CfUsersNestedFilter>;
  user_exists: InputMaybe<Scalars['Boolean']>;
};

export type UserTeamLinkingCollections = {
  entryCollection: Maybe<EntryCollection>;
  usersCollection: Maybe<UsersCollection>;
};

export type UserTeamLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type UserTeamLinkingCollectionsUsersCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum UserTeamOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
}

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type Users = Entry & {
  contentfulMetadata: ContentfulMetadata;
  email: Maybe<Scalars['String']>;
  firstName: Maybe<Scalars['String']>;
  id: Maybe<Scalars['String']>;
  labsCollection: Maybe<UsersLabsCollection>;
  lastName: Maybe<Scalars['String']>;
  linkedFrom: Maybe<UsersLinkingCollections>;
  orcid: Maybe<Scalars['String']>;
  separatorBasicData: Maybe<UsersSeparatorBasicData>;
  sys: Sys;
  teamsCollection: Maybe<UsersTeamsCollection>;
  type: Maybe<Scalars['String']>;
  userTeam: Maybe<UserTeam>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersEmailArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersFirstNameArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersIdArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersLabsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersLastNameArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersLinkedFromArgs = {
  allowedLocales: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersOrcidArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersSeparatorBasicDataArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersTeamsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersTypeArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/users) */
export type UsersUserTeamArgs = {
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
};

export type UsersCollection = {
  items: Array<Maybe<Users>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type UsersFilter = {
  AND: InputMaybe<Array<InputMaybe<UsersFilter>>>;
  OR: InputMaybe<Array<InputMaybe<UsersFilter>>>;
  contentfulMetadata: InputMaybe<ContentfulMetadataFilter>;
  email: InputMaybe<Scalars['String']>;
  email_contains: InputMaybe<Scalars['String']>;
  email_exists: InputMaybe<Scalars['Boolean']>;
  email_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  email_not: InputMaybe<Scalars['String']>;
  email_not_contains: InputMaybe<Scalars['String']>;
  email_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  firstName: InputMaybe<Scalars['String']>;
  firstName_contains: InputMaybe<Scalars['String']>;
  firstName_exists: InputMaybe<Scalars['Boolean']>;
  firstName_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  firstName_not: InputMaybe<Scalars['String']>;
  firstName_not_contains: InputMaybe<Scalars['String']>;
  firstName_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id: InputMaybe<Scalars['String']>;
  id_contains: InputMaybe<Scalars['String']>;
  id_exists: InputMaybe<Scalars['Boolean']>;
  id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id_not: InputMaybe<Scalars['String']>;
  id_not_contains: InputMaybe<Scalars['String']>;
  id_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  labsCollection_exists: InputMaybe<Scalars['Boolean']>;
  lastName: InputMaybe<Scalars['String']>;
  lastName_contains: InputMaybe<Scalars['String']>;
  lastName_exists: InputMaybe<Scalars['Boolean']>;
  lastName_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  lastName_not: InputMaybe<Scalars['String']>;
  lastName_not_contains: InputMaybe<Scalars['String']>;
  lastName_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  orcid: InputMaybe<Scalars['String']>;
  orcid_contains: InputMaybe<Scalars['String']>;
  orcid_exists: InputMaybe<Scalars['Boolean']>;
  orcid_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  orcid_not: InputMaybe<Scalars['String']>;
  orcid_not_contains: InputMaybe<Scalars['String']>;
  orcid_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  separatorBasicData_contains: InputMaybe<Scalars['String']>;
  separatorBasicData_exists: InputMaybe<Scalars['Boolean']>;
  separatorBasicData_not_contains: InputMaybe<Scalars['String']>;
  sys: InputMaybe<SysFilter>;
  teamsCollection_exists: InputMaybe<Scalars['Boolean']>;
  type: InputMaybe<Scalars['String']>;
  type_contains: InputMaybe<Scalars['String']>;
  type_exists: InputMaybe<Scalars['Boolean']>;
  type_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  type_not: InputMaybe<Scalars['String']>;
  type_not_contains: InputMaybe<Scalars['String']>;
  type_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userTeam: InputMaybe<CfUserTeamNestedFilter>;
  userTeam_exists: InputMaybe<Scalars['Boolean']>;
};

export type UsersLabsCollection = {
  items: Array<Maybe<Labs>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type UsersLinkingCollections = {
  entryCollection: Maybe<EntryCollection>;
  sharedOutputsCollection: Maybe<SharedOutputsCollection>;
  userTeamCollection: Maybe<UserTeamCollection>;
};

export type UsersLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type UsersLinkingCollectionsSharedOutputsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type UsersLinkingCollectionsUserTeamCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum UsersOrder {
  EmailAsc = 'email_ASC',
  EmailDesc = 'email_DESC',
  FirstNameAsc = 'firstName_ASC',
  FirstNameDesc = 'firstName_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  LastNameAsc = 'lastName_ASC',
  LastNameDesc = 'lastName_DESC',
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
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
}

export type UsersSeparatorBasicData = {
  json: Scalars['JSON'];
  links: UsersSeparatorBasicDataLinks;
};

export type UsersSeparatorBasicDataAssets = {
  block: Array<Maybe<Asset>>;
  hyperlink: Array<Maybe<Asset>>;
};

export type UsersSeparatorBasicDataEntries = {
  block: Array<Maybe<Entry>>;
  hyperlink: Array<Maybe<Entry>>;
  inline: Array<Maybe<Entry>>;
};

export type UsersSeparatorBasicDataLinks = {
  assets: UsersSeparatorBasicDataAssets;
  entries: UsersSeparatorBasicDataEntries;
};

export type UsersTeamsCollection = {
  items: Array<Maybe<Teams>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type CfTeamsNestedFilter = {
  AND: InputMaybe<Array<InputMaybe<CfTeamsNestedFilter>>>;
  OR: InputMaybe<Array<InputMaybe<CfTeamsNestedFilter>>>;
  contentfulMetadata: InputMaybe<ContentfulMetadataFilter>;
  displayName: InputMaybe<Scalars['String']>;
  displayName_contains: InputMaybe<Scalars['String']>;
  displayName_exists: InputMaybe<Scalars['Boolean']>;
  displayName_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  displayName_not: InputMaybe<Scalars['String']>;
  displayName_not_contains: InputMaybe<Scalars['String']>;
  displayName_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id: InputMaybe<Scalars['String']>;
  id_contains: InputMaybe<Scalars['String']>;
  id_exists: InputMaybe<Scalars['Boolean']>;
  id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id_not: InputMaybe<Scalars['String']>;
  id_not_contains: InputMaybe<Scalars['String']>;
  id_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  outputsCollection_exists: InputMaybe<Scalars['Boolean']>;
  sys: InputMaybe<SysFilter>;
};

export type CfUserTeamNestedFilter = {
  AND: InputMaybe<Array<InputMaybe<CfUserTeamNestedFilter>>>;
  OR: InputMaybe<Array<InputMaybe<CfUserTeamNestedFilter>>>;
  contentfulMetadata: InputMaybe<ContentfulMetadataFilter>;
  sys: InputMaybe<SysFilter>;
  team_exists: InputMaybe<Scalars['Boolean']>;
  user_exists: InputMaybe<Scalars['Boolean']>;
};

export type CfUsersNestedFilter = {
  AND: InputMaybe<Array<InputMaybe<CfUsersNestedFilter>>>;
  OR: InputMaybe<Array<InputMaybe<CfUsersNestedFilter>>>;
  contentfulMetadata: InputMaybe<ContentfulMetadataFilter>;
  email: InputMaybe<Scalars['String']>;
  email_contains: InputMaybe<Scalars['String']>;
  email_exists: InputMaybe<Scalars['Boolean']>;
  email_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  email_not: InputMaybe<Scalars['String']>;
  email_not_contains: InputMaybe<Scalars['String']>;
  email_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  firstName: InputMaybe<Scalars['String']>;
  firstName_contains: InputMaybe<Scalars['String']>;
  firstName_exists: InputMaybe<Scalars['Boolean']>;
  firstName_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  firstName_not: InputMaybe<Scalars['String']>;
  firstName_not_contains: InputMaybe<Scalars['String']>;
  firstName_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id: InputMaybe<Scalars['String']>;
  id_contains: InputMaybe<Scalars['String']>;
  id_exists: InputMaybe<Scalars['Boolean']>;
  id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id_not: InputMaybe<Scalars['String']>;
  id_not_contains: InputMaybe<Scalars['String']>;
  id_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  labsCollection_exists: InputMaybe<Scalars['Boolean']>;
  lastName: InputMaybe<Scalars['String']>;
  lastName_contains: InputMaybe<Scalars['String']>;
  lastName_exists: InputMaybe<Scalars['Boolean']>;
  lastName_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  lastName_not: InputMaybe<Scalars['String']>;
  lastName_not_contains: InputMaybe<Scalars['String']>;
  lastName_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  orcid: InputMaybe<Scalars['String']>;
  orcid_contains: InputMaybe<Scalars['String']>;
  orcid_exists: InputMaybe<Scalars['Boolean']>;
  orcid_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  orcid_not: InputMaybe<Scalars['String']>;
  orcid_not_contains: InputMaybe<Scalars['String']>;
  orcid_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  separatorBasicData_contains: InputMaybe<Scalars['String']>;
  separatorBasicData_exists: InputMaybe<Scalars['Boolean']>;
  separatorBasicData_not_contains: InputMaybe<Scalars['String']>;
  sys: InputMaybe<SysFilter>;
  teamsCollection_exists: InputMaybe<Scalars['Boolean']>;
  type: InputMaybe<Scalars['String']>;
  type_contains: InputMaybe<Scalars['String']>;
  type_exists: InputMaybe<Scalars['Boolean']>;
  type_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  type_not: InputMaybe<Scalars['String']>;
  type_not_contains: InputMaybe<Scalars['String']>;
  type_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userTeam_exists: InputMaybe<Scalars['Boolean']>;
};

export type FetchUsersQueryVariables = Exact<{ [key: string]: never }>;

export type FetchUsersQuery = {
  usersCollection: Maybe<{ items: Array<Maybe<Pick<Users, 'id'>>> }>;
};

export const FetchUsersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchUsers' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'usersCollection' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
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
  ],
} as unknown as DocumentNode<FetchUsersQuery, FetchUsersQueryVariables>;
