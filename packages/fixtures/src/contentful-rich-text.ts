import { ContentfulNewsText } from '@asap-hub/model';
import {
  Block,
  BLOCKS,
  Inline,
  INLINES,
  Mark,
  Text,
  TopLevelBlock,
  TopLevelBlockEnum,
} from '@contentful/rich-text-types';

export const paragraphNode = {
  nodeType: 'paragraph' as TopLevelBlockEnum,
  data: {},
  content: [
    {
      nodeType: 'text',
      value: 'text',
      marks: [],
      data: {},
    } as Text,
  ],
};

export const paragraphWrapper = (content: Block | Inline | Text) => ({
  nodeType: 'paragraph' as TopLevelBlockEnum,
  data: {},
  content: [content],
});

export const inlineEmbeddedEntryNode = {
  nodeType: INLINES.EMBEDDED_ENTRY,
  data: {
    target: {
      sys: {
        id: 'entry-id',
        type: 'Link',
        linkType: 'Entry',
      },
    },
  },
  content: [],
};

export const inlineEmbeddedEntryNodeLink = {
  __typename: 'Media',
  sys: {
    id: 'entry-id',
  },
  url: 'https://player.vimeo.com/video/492639198',
};

export const blockAssetNode = {
  nodeType: BLOCKS.EMBEDDED_ASSET,
  data: {
    target: {
      sys: {
        id: 'asset-id',
        type: 'Link',
        linkType: 'Asset',
      },
    },
  },
  content: [],
};

export const blockAssetNodeLink = {
  sys: {
    id: 'asset-id',
  },
  url: 'https://images.ctfassets.net/image.jpg',
  description: null,
  contentType: 'image/jpeg',
  width: 600,
  height: 230,
};

export const getHyperlinkNode = (marks: Mark[] = []) =>
  ({
    nodeType: 'hyperlink' as INLINES.HYPERLINK,
    data: {
      uri: 'https://localhost/',
    },
    content: [
      {
        nodeType: 'text',
        value: 'anchor',
        marks,
        data: {},
      },
    ],
  } as Inline);

export const getHeadingNode = (nodeType: BLOCKS) =>
  ({
    data: {},
    content: [
      {
        data: {},
        marks: [],
        value: 'heading',
        nodeType: 'text',
      },
    ],
    nodeType,
  } as Block);

export const getDocument = ({
  content = paragraphNode,
}: {
  content?: TopLevelBlock;
}) => ({
  nodeType: 'document' as BLOCKS.DOCUMENT,
  data: {},
  content: [content],
});

export const getRichTextField = ({
  jsonDocument = getDocument({}),
  inlineEntries = [],
  blockEntries = [],
  blockAssets = [],
}: {
  jsonDocument?: {
    nodeType: BLOCKS.DOCUMENT;
    data: {};
    content: TopLevelBlock[];
  };
  inlineEntries?: ContentfulNewsText['links']['entries']['inline'];
  blockEntries?: ContentfulNewsText['links']['entries']['block'];
  blockAssets?: ContentfulNewsText['links']['assets']['block'];
}) => ({
  json: jsonDocument,
  links: {
    entries: {
      inline: inlineEntries,
      block: blockEntries,
    },
    assets: {
      block: blockAssets,
    },
  },
});
