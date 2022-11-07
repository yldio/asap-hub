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
  newsCollection: Maybe<NewsCollection>;
};

export type AssetLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type AssetLinkingCollectionsNewsCollectionArgs = {
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

/** Meta data to store the state of content model through migrations [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/migration) */
export type Migration = Entry & {
  contentTypeId: Maybe<Scalars['String']>;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom: Maybe<MigrationLinkingCollections>;
  state: Maybe<Scalars['JSON']>;
  sys: Sys;
};

/** Meta data to store the state of content model through migrations [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/migration) */
export type MigrationContentTypeIdArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** Meta data to store the state of content model through migrations [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/migration) */
export type MigrationLinkedFromArgs = {
  allowedLocales: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** Meta data to store the state of content model through migrations [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/migration) */
export type MigrationStateArgs = {
  locale: InputMaybe<Scalars['String']>;
};

export type MigrationCollection = {
  items: Array<Maybe<Migration>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type MigrationFilter = {
  AND: InputMaybe<Array<InputMaybe<MigrationFilter>>>;
  OR: InputMaybe<Array<InputMaybe<MigrationFilter>>>;
  contentTypeId: InputMaybe<Scalars['String']>;
  contentTypeId_contains: InputMaybe<Scalars['String']>;
  contentTypeId_exists: InputMaybe<Scalars['Boolean']>;
  contentTypeId_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contentTypeId_not: InputMaybe<Scalars['String']>;
  contentTypeId_not_contains: InputMaybe<Scalars['String']>;
  contentTypeId_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contentfulMetadata: InputMaybe<ContentfulMetadataFilter>;
  state_exists: InputMaybe<Scalars['Boolean']>;
  sys: InputMaybe<SysFilter>;
};

export type MigrationLinkingCollections = {
  entryCollection: Maybe<EntryCollection>;
};

export type MigrationLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
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
  frequency: Maybe<Scalars['String']>;
  id: Maybe<Scalars['String']>;
  link: Maybe<Scalars['String']>;
  linkText: Maybe<Scalars['String']>;
  linkedFrom: Maybe<NewsLinkingCollections>;
  shortText: Maybe<Scalars['String']>;
  sys: Sys;
  text: Maybe<NewsText>;
  thumbnail: Maybe<Asset>;
  title: Maybe<Scalars['String']>;
};

/** ASAP Hub News [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/news) */
export type NewsFrequencyArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** ASAP Hub News [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/news) */
export type NewsIdArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** ASAP Hub News [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/news) */
export type NewsLinkArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** ASAP Hub News [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/news) */
export type NewsLinkTextArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** ASAP Hub News [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/news) */
export type NewsLinkedFromArgs = {
  allowedLocales: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** ASAP Hub News [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/news) */
export type NewsShortTextArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** ASAP Hub News [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/news) */
export type NewsTextArgs = {
  locale: InputMaybe<Scalars['String']>;
};

/** ASAP Hub News [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/news) */
export type NewsThumbnailArgs = {
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
};

/** ASAP Hub News [See type definition](https://app.contentful.com/spaces/5v6w5j61tndm/content_types/news) */
export type NewsTitleArgs = {
  locale: InputMaybe<Scalars['String']>;
};

export type NewsCollection = {
  items: Array<Maybe<News>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type NewsFilter = {
  AND: InputMaybe<Array<InputMaybe<NewsFilter>>>;
  OR: InputMaybe<Array<InputMaybe<NewsFilter>>>;
  contentfulMetadata: InputMaybe<ContentfulMetadataFilter>;
  frequency: InputMaybe<Scalars['String']>;
  frequency_contains: InputMaybe<Scalars['String']>;
  frequency_exists: InputMaybe<Scalars['Boolean']>;
  frequency_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  frequency_not: InputMaybe<Scalars['String']>;
  frequency_not_contains: InputMaybe<Scalars['String']>;
  frequency_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id: InputMaybe<Scalars['String']>;
  id_contains: InputMaybe<Scalars['String']>;
  id_exists: InputMaybe<Scalars['Boolean']>;
  id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id_not: InputMaybe<Scalars['String']>;
  id_not_contains: InputMaybe<Scalars['String']>;
  id_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  link: InputMaybe<Scalars['String']>;
  linkText: InputMaybe<Scalars['String']>;
  linkText_contains: InputMaybe<Scalars['String']>;
  linkText_exists: InputMaybe<Scalars['Boolean']>;
  linkText_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  linkText_not: InputMaybe<Scalars['String']>;
  linkText_not_contains: InputMaybe<Scalars['String']>;
  linkText_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  link_contains: InputMaybe<Scalars['String']>;
  link_exists: InputMaybe<Scalars['Boolean']>;
  link_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  link_not: InputMaybe<Scalars['String']>;
  link_not_contains: InputMaybe<Scalars['String']>;
  link_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  shortText: InputMaybe<Scalars['String']>;
  shortText_contains: InputMaybe<Scalars['String']>;
  shortText_exists: InputMaybe<Scalars['Boolean']>;
  shortText_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  shortText_not: InputMaybe<Scalars['String']>;
  shortText_not_contains: InputMaybe<Scalars['String']>;
  shortText_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sys: InputMaybe<SysFilter>;
  text_contains: InputMaybe<Scalars['String']>;
  text_exists: InputMaybe<Scalars['Boolean']>;
  text_not_contains: InputMaybe<Scalars['String']>;
  thumbnail_exists: InputMaybe<Scalars['Boolean']>;
  title: InputMaybe<Scalars['String']>;
  title_contains: InputMaybe<Scalars['String']>;
  title_exists: InputMaybe<Scalars['Boolean']>;
  title_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_not: InputMaybe<Scalars['String']>;
  title_not_contains: InputMaybe<Scalars['String']>;
  title_not_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type NewsLinkingCollections = {
  entryCollection: Maybe<EntryCollection>;
};

export type NewsLinkingCollectionsEntryCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export enum NewsOrder {
  FrequencyAsc = 'frequency_ASC',
  FrequencyDesc = 'frequency_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  LinkTextAsc = 'linkText_ASC',
  LinkTextDesc = 'linkText_DESC',
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
};

export type Query = {
  asset: Maybe<Asset>;
  assetCollection: Maybe<AssetCollection>;
  entryCollection: Maybe<EntryCollection>;
  migration: Maybe<Migration>;
  migrationCollection: Maybe<MigrationCollection>;
  news: Maybe<News>;
  newsCollection: Maybe<NewsCollection>;
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

export type QueryMigrationArgs = {
  id: Scalars['String'];
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
};

export type QueryMigrationCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  order: InputMaybe<Array<InputMaybe<MigrationOrder>>>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where: InputMaybe<MigrationFilter>;
};

export type QueryNewsArgs = {
  id: Scalars['String'];
  locale: InputMaybe<Scalars['String']>;
  preview: InputMaybe<Scalars['Boolean']>;
};

export type QueryNewsCollectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  locale: InputMaybe<Scalars['String']>;
  order: InputMaybe<Array<InputMaybe<NewsOrder>>>;
  preview: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  where: InputMaybe<NewsFilter>;
};

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

export type FetchNewsQueryVariables = Exact<{ [key: string]: never }>;

export type FetchNewsQuery = {
  newsCollection: Maybe<{
    items: Array<
      Maybe<
        Pick<
          News,
          'id' | 'title' | 'shortText' | 'frequency' | 'link' | 'linkText'
        >
      >
    >;
  }>;
};

export const FetchNewsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'FetchNews' },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'shortText' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'frequency' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'link' } },
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
} as unknown as DocumentNode<FetchNewsQuery, FetchNewsQueryVariables>;
