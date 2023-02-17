import { BLOCKS, TopLevelBlockEnum } from '@contentful/rich-text-types';

export const assetId_1 = 'image1';
export const assetId_2 = 'image2';
export const inexistentAssetId = 'not-found';
export const baseAssetUrl = 'https://images.ctfassets.net/envId';

export const documentWithAssets = {
  data: {},
  content: [
    {
      data: {},
      content: [
        {
          data: {},
          marks: [],
          value: 'Here it will appear an image',
          nodeType: 'text' as const,
        },
      ],
      nodeType: 'paragraph' as TopLevelBlockEnum,
    },
    {
      data: {
        target: {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: assetId_1,
          },
        },
      },
      content: [],
      nodeType: 'embedded-asset-block' as TopLevelBlockEnum,
    },
    {
      data: {},
      content: [
        {
          data: {},
          marks: [],
          value: "below there's a cat",
          nodeType: 'text' as const,
        },
      ],
      nodeType: 'paragraph' as TopLevelBlockEnum,
    },
    {
      data: {
        target: {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: assetId_2,
          },
        },
      },
      content: [],
      nodeType: 'embedded-asset-block' as TopLevelBlockEnum,
    },
    {
      data: {},
      content: [{ data: {}, marks: [], value: ' ', nodeType: 'text' as const }],
      nodeType: 'paragraph' as TopLevelBlockEnum,
    },
  ],
  nodeType: 'document' as BLOCKS.DOCUMENT,
};

export const linksWithAssets = {
  entries: {
    inline: [],
  },
  assets: {
    block: [
      {
        sys: { id: assetId_1 },
        url: `${baseAssetUrl}/${assetId_1}/penguin.jpeg`,
        description: 'A very cute baby penguin walking',
        contentType: 'image/png',
      },
      {
        sys: { id: assetId_2 },
        url: `${baseAssetUrl}/${assetId_2}/cat.png`,
        description: 'cat',
        contentType: 'image/png',
      },
    ],
  },
};

const entryId_1 = 'pdf-id';
const entryId_2 = 'video-id';

export const documentWithEntries = {
  data: {},
  content: [
    {
      data: {},
      content: [
        {
          data: {},
          marks: [],
          value: 'A nice pdf',
          nodeType: 'text' as const,
        },
      ],
      nodeType: 'paragraph' as TopLevelBlockEnum,
    },
    {
      data: {
        target: {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: entryId_1,
          },
        },
      },
      content: [],
      nodeType: 'embedded-entry-inline' as TopLevelBlockEnum,
    },
    {
      data: {},
      content: [
        {
          data: {},
          marks: [],
          value: 'A good video',
          nodeType: 'text' as const,
        },
      ],
      nodeType: 'paragraph' as TopLevelBlockEnum,
    },
    {
      data: {
        target: {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: entryId_2,
          },
        },
      },
      content: [],
      nodeType: 'embedded-entry-inline' as TopLevelBlockEnum,
    },
    {
      data: {},
      content: [{ data: {}, marks: [], value: ' ', nodeType: 'text' as const }],
      nodeType: 'paragraph' as TopLevelBlockEnum,
    },
  ],
  nodeType: 'document' as BLOCKS.DOCUMENT,
};

export const linksWithEntries = {
  entries: {
    inline: [
      {
        sys: { id: entryId_1 },
        url: `http://drive.com/document`,
      },
      {
        sys: { id: entryId_2 },
        url: `http://vimeo.com/video`,
      },
    ],
  },
  assets: {
    block: [],
  },
};
