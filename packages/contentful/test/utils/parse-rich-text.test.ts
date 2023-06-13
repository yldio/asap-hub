// eslint-disable-file camelcase no-useless-escape
import { BLOCKS, TopLevelBlockEnum } from '@contentful/rich-text-types';
import { parseRichText } from '../../src/utils';
import {
  assetId_1,
  assetId_2,
  baseAssetUrl,
  documentWithAssets,
  documentWithEntries,
  inexistentAssetId,
  linksWithAssets,
  linksWithEntries,
} from '../rich-text.fixtures';

describe('parseRichText', () => {
  beforeEach(jest.resetAllMocks);
  describe('embedded-asset-block', () => {
    test('outputs html with img tag when asset is image', () => {
      const rtf = {
        json: documentWithAssets,
        links: linksWithAssets,
      };
      expect(parseRichText(rtf)).toEqual(
        `<p>Here it will appear an image</p><img src=\"https://images.ctfassets.net/envId/image1/penguin.jpeg\" alt=A very cute baby penguin walking/><p>below there&#39;s a cat</p><img src=\"https://images.ctfassets.net/envId/image2/cat.png\" alt=cat/><p> </p>`,
      );
    });

    test('outputs html with iframe tag when asset is pdf', () => {
      const rtf = {
        json: documentWithAssets,
        links: {
          entries: {
            inline: [],
          },
          assets: {
            block: [
              {
                sys: { id: assetId_1 },
                url: `${baseAssetUrl}/${assetId_1}/file-1.pdf`,
                contentType: 'application/pdf',
                width: 200,
                height: 300,
              },
              {
                sys: { id: assetId_2 },
                url: `${baseAssetUrl}/${assetId_2}/file-2.pdf`,
                contentType: 'application/pdf',
              },
            ],
          },
        },
      };
      expect(parseRichText(rtf)).toEqual(
        `<p>Here it will appear an image</p><iframe src=\"https://images.ctfassets.net/envId/image1/file-1.pdf\" width=\"200\" height=\"300\"><p>below there&#39;s a cat</p><iframe src=\"https://images.ctfassets.net/envId/image2/file-2.pdf\"><p> </p>`,
      );
    });

    test('outputs html with iframe tag when asset is video', () => {
      const rtf = {
        json: documentWithAssets,
        links: {
          entries: {
            inline: [],
          },
          assets: {
            block: [
              {
                sys: { id: assetId_1 },
                url: `${baseAssetUrl}/${assetId_1}/video-1.mp4`,
                contentType: 'video/mp4',
                width: 200,
                height: 300,
              },
              {
                sys: { id: assetId_2 },
                url: `${baseAssetUrl}/${assetId_2}/video-2.mp4`,
                contentType: 'video/mp4',
              },
            ],
          },
        },
      };
      expect(parseRichText(rtf)).toEqual(
        `<p>Here it will appear an image</p><iframe src=\"https://images.ctfassets.net/envId/image1/video-1.mp4\" width=\"200\" height=\"300\" allowFullScreen><p>below there&#39;s a cat</p><iframe src=\"https://images.ctfassets.net/envId/image2/video-2.mp4\" allowFullScreen><p> </p>`,
      );
    });

    test('throws an error if rtf is linked to an asset that does not exist', () => {
      const rtf = {
        json: {
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
                    id: inexistentAssetId,
                  },
                },
              },
              content: [],
              nodeType: 'embedded-asset-block' as TopLevelBlockEnum,
            },
          ],
          nodeType: 'document' as BLOCKS.DOCUMENT,
        },
        links: linksWithAssets,
      };
      expect(() => parseRichText(rtf)).toThrowError(
        'Asset with id not-found does not exist in contentful',
      );
    });
  });

  describe('embedded-entry-inline', () => {
    test('outputs html with iframe tag', () => {
      const rtf = {
        json: documentWithEntries,
        links: linksWithEntries,
      };
      expect(parseRichText(rtf)).toEqual(
        `<p>A nice pdf</p><iframe src=\"http://drive.com/document\"/><p>A good video</p><iframe src=\"http://vimeo.com/video\"/><p> </p>`,
      );
    });

    test('throws an error if rtf is linked to an entry that does not exist', () => {
      const rtf = {
        json: {
          data: {},
          content: [
            {
              data: {
                target: {
                  sys: {
                    type: 'Link',
                    linkType: 'Entry',
                    id: inexistentAssetId,
                  },
                },
              },
              content: [],
              nodeType: 'embedded-entry-inline' as TopLevelBlockEnum,
            },
          ],
          nodeType: 'document' as BLOCKS.DOCUMENT,
        },
        links: linksWithEntries,
      };
      expect(() => parseRichText(rtf)).toThrowError(
        'Entry with id not-found does not exist in contentful',
      );
    });
  });
});
