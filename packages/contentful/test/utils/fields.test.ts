import { BLOCKS, TopLevelBlockEnum } from '@contentful/rich-text-types';
import { Entry } from 'contentful-management';
import {
  addLocaleToFields,
  parseRichText,
  patchAndPublish,
  pollContentfulDeliveryApi,
  pollContentfulGql,
  updateEntryFields,
} from '../../src/utils';
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

describe('addLocaleToFields', () => {
  test('adds locale to fields', () => {
    expect(
      addLocaleToFields({
        title: 'News',
        description: 'Very informative news',
      }),
    ).toEqual({
      description: { 'en-US': 'Very informative news' },
      title: { 'en-US': 'News' },
    });
  });
});

describe('updateEntryFields', () => {
  test('updates entry fields', () => {
    expect(
      updateEntryFields(
        {
          fields: {
            title: {
              'en-US': 'Cells',
            },
          },
        } as unknown as Entry,
        {
          title: 'Tissues',
        },
      ),
    ).toEqual({ fields: { title: { 'en-US': 'Tissues' } } });
  });
});

describe('patchAndPublish', () => {
  const getMocks = () => {
    const publish = jest.fn();
    const entry = {
      fields: {},
      patch: jest.fn().mockResolvedValueOnce({ publish }),
    } as unknown as Entry;
    return { publish, entry };
  };

  test('converts data object passed to a json patch with locales', async () => {
    const { entry } = getMocks();
    await patchAndPublish(entry, { foo: 'bar', baz: 1 });
    expect(entry.patch).toHaveBeenCalledWith([
      { op: 'add', path: '/fields/foo', value: { 'en-US': 'bar' } },
      { op: 'add', path: '/fields/baz', value: { 'en-US': 1 } },
    ]);
  });

  test('patches with a "replace" op if field exists on entry', async () => {
    const { entry } = getMocks();
    entry.fields = {
      foo: null,
    };
    await patchAndPublish(entry, { foo: 'bar', baz: 1 });
    expect(entry.patch).toHaveBeenCalledWith([
      { op: 'replace', path: '/fields/foo', value: { 'en-US': 'bar' } },
      { op: 'add', path: '/fields/baz', value: { 'en-US': 1 } },
    ]);
  });

  test('calls publish on the return value of the patch function', async () => {
    const { entry, publish } = getMocks();
    await patchAndPublish(entry, { foo: 'bar' });
    expect(publish).toHaveBeenCalled();
  });
});

describe('pollContentfulGql', () => {
  test('checks version of published data and polls until they match', async () => {
    const userDataWithPublishedVersion1 = {
      users: {
        sys: {
          publishedVersion: 1,
        },
      },
    };

    const userDataWithPublishedVersion2 = {
      users: {
        sys: {
          publishedVersion: 2,
        },
      },
    };

    const fetchData = jest
      .fn()
      .mockResolvedValueOnce(userDataWithPublishedVersion1)
      .mockResolvedValueOnce(userDataWithPublishedVersion1)
      .mockResolvedValueOnce(userDataWithPublishedVersion2);

    await pollContentfulGql(2, fetchData, 'users');
    expect(fetchData).toHaveBeenCalledTimes(3);
  });

  test('throws if polling query does not return a value', async () => {
    const fetchData = jest.fn().mockResolvedValueOnce({
      users: null,
    });

    expect(
      async () => await pollContentfulGql(2, fetchData, 'users'),
    ).rejects.toThrow();
  });
});

describe('pollContentfulDeliveryApi', () => {
  test('checks version of published counter and polls until they match and return entry', async () => {
    const entryDataWithPublishedCounter1 = {
      sys: {
        revision: 1,
      },
    };

    const entryDataWithPublishedCounter2 = {
      sys: {
        revision: 2,
      },
    };

    const fetchEntry = jest
      .fn()
      .mockResolvedValueOnce(entryDataWithPublishedCounter1)
      .mockResolvedValueOnce(entryDataWithPublishedCounter1)
      .mockResolvedValueOnce(entryDataWithPublishedCounter2);

    const response = await pollContentfulDeliveryApi(fetchEntry, 2);
    expect(fetchEntry).toHaveBeenCalledTimes(3);
    expect(response).toEqual(entryDataWithPublishedCounter2);
  });

  test('throws if polling query does not return a value', async () => {
    const fetchEntry = jest.fn().mockResolvedValueOnce(null);

    expect(
      async () => await pollContentfulDeliveryApi(fetchEntry, 2),
    ).rejects.toThrow();
  });
});
