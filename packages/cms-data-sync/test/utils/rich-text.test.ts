import { Environment } from 'contentful-management';
import {
  convertHtmlToContentfulFormat,
  createDocumentIfNeeded,
} from '../../src/utils';
import { createInlineAssets, createMediaEntries } from '../../src/utils';

jest.mock('../../src/utils/assets-and-media');

describe('convertHtmlToContentfulFormat', () => {
  it('converts simple html to contentful expected rich text format properly', () => {
    const html = '<p>Hello world</p>';

    expect(convertHtmlToContentfulFormat(html)).toEqual({
      document: {
        content: [
          {
            content: [
              {
                data: {},
                marks: [],
                value: 'Hello world',
                nodeType: 'text',
              },
            ],
            data: {},
            nodeType: 'paragraph',
          },
        ],
        data: {},
        nodeType: 'document',
      },
      inlineAssetBodies: [],
      inlineIFramesBodies: [],
    });
  });

  it('converts html with list to contentful expected rich text format properly', () => {
    const html = '<ul><li>item 1</li><li>item 2</li></ul>';

    expect(convertHtmlToContentfulFormat(html)).toEqual({
      document: {
        content: [
          {
            content: [
              {
                data: {},
                content: [
                  {
                    data: {},
                    content: [
                      {
                        data: {},
                        marks: [],
                        nodeType: 'text',
                        value: '',
                      },
                      {
                        data: {},
                        marks: [],
                        nodeType: 'text',
                        value: 'item 1',
                      },
                    ],
                    nodeType: 'paragraph',
                  },
                ],
                nodeType: 'list-item',
              },
              {
                data: {},
                content: [
                  {
                    data: {},
                    content: [
                      {
                        data: {},
                        marks: [],
                        nodeType: 'text',
                        value: '',
                      },
                      {
                        data: {},
                        marks: [],
                        nodeType: 'text',
                        value: 'item 2',
                      },
                    ],
                    nodeType: 'paragraph',
                  },
                ],
                nodeType: 'list-item',
              },
            ],
            data: {},
            nodeType: 'unordered-list',
          },
        ],
        data: {},
        nodeType: 'document',
      },
      inlineAssetBodies: [],
      inlineIFramesBodies: [],
    });
  });

  it('converts html with inline image', () => {
    const generatedAssetId = '1515595253';
    const squidexAssetId = '8ca5d37d-4bc1-4085-b05e-786c3e6f5a38';
    const html = `<p>some text and now an image <img src="https://cloud.squidex.io/api/assets/crn-2023/${squidexAssetId}/sky.png" alt="blue sky" width="564" height="564" /></p>`;

    expect(convertHtmlToContentfulFormat(html)).toEqual({
      document: {
        content: [
          {
            content: [
              {
                data: {},
                marks: [],
                nodeType: 'text',
                value: 'some text and now an image ',
              },
            ],
            data: {},
            nodeType: 'paragraph',
          },
          {
            content: [],
            data: {
              target: {
                sys: {
                  id: generatedAssetId,
                  linkType: 'Asset',
                  type: 'Link',
                },
              },
            },
            nodeType: 'embedded-asset-block',
          },
        ],
        data: {},
        nodeType: 'document',
      },
      inlineIFramesBodies: [],
      inlineAssetBodies: [
        [
          generatedAssetId,
          {
            fields: {
              description: {
                'en-US': 'blue sky',
              },
              file: {
                'en-US': {
                  contentType: 'image/png',
                  fileName: 'sky.png',
                  upload: `https://cloud.squidex.io/api/assets/crn-2023/${squidexAssetId}/sky.png`,
                },
              },
              title: {
                'en-US': 'sky.png',
              },
            },
          },
        ],
      ],
    });
  });

  it('converts an optional line break to an empty paragraph', async () => {
    const html = `<p>Line 1<wbr>Line 2</p>`;

    expect(convertHtmlToContentfulFormat(html).document.content).toEqual([
      {
        data: {},
        content: [
          {
            data: {},
            marks: [],
            value: 'Line 1',
            nodeType: 'text',
          },
          {
            data: {},
            marks: [],
            value: '\n',
            nodeType: 'text',
          },
          {
            data: {},
            marks: [],
            value: 'Line 2',
            nodeType: 'text',
          },
        ],
        nodeType: 'paragraph',
      },
    ]);
  });

  it('converts a line break to an empty paragraph', async () => {
    const html = `<p>Line 1<br>Line 2</p>`;

    expect(convertHtmlToContentfulFormat(html).document.content).toEqual([
      {
        data: {},
        content: [
          {
            data: {},
            marks: [],
            value: 'Line 1',
            nodeType: 'text',
          },
          {
            data: {},
            marks: [],
            value: '\n',
            nodeType: 'text',
          },
          {
            data: {},
            marks: [],
            value: 'Line 2',
            nodeType: 'text',
          },
        ],
        nodeType: 'paragraph',
      },
    ]);
  });

  it('converts a sup to an paragraph', async () => {
    const html = `<p><sup>XYZ</sup></p>`;

    expect(convertHtmlToContentfulFormat(html).document.content).toEqual([
      {
        data: {},
        content: [
          {
            data: {},
            marks: [
              {
                type: 'superscript',
              },
            ],
            value: 'XYZ',
            nodeType: 'text',
          },
        ],
        nodeType: 'paragraph',
      },
    ]);
  });

  it('converts html encoded entities', async () => {
    const html = `<p>&nbsp;test&nbsp;test&amp;</p>`;

    expect(convertHtmlToContentfulFormat(html).document.content).toEqual([
      {
        data: {},
        content: [
          {
            data: {},
            marks: [],
            value: ' test test&',
            nodeType: 'text',
          },
        ],
        nodeType: 'paragraph',
      },
    ]);
  });

  it('converts html with new line', async () => {
    const html = `<p>line 1</p>\n<p>&nbsp;</p>\n<p>line 2</p>`;
    expect(convertHtmlToContentfulFormat(html).document.content).toEqual([
      {
        content: [{ data: {}, marks: [], nodeType: 'text', value: 'line 1' }],
        data: {},
        nodeType: 'paragraph',
      },
      {
        content: [{ data: {}, marks: [], nodeType: 'text', value: ' ' }],
        data: {},
        nodeType: 'paragraph',
      },
      {
        content: [{ data: {}, marks: [], nodeType: 'text', value: 'line 2' }],
        data: {},
        nodeType: 'paragraph',
      },
    ]);
  });
});

describe('createDocumentIfNeeded', () => {
  let envMock: Environment;

  const createInlineAssetsMock = createInlineAssets as jest.Mock;
  const createMediaEntriesMock = createMediaEntries as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns document from html and creates inline assets and media', async () => {
    const document = await createDocumentIfNeeded(
      envMock,
      '<p>Hello World</p><img src="asap-asset.png"/><iframe src="https://example.com"/>',
    );

    expect(document).toEqual({
      content: [
        {
          content: [
            { data: {}, marks: [], nodeType: 'text', value: 'Hello World' },
          ],
          data: {},
          nodeType: 'paragraph',
        },
        {
          content: [],
          data: {
            target: {
              sys: { id: '125869887', linkType: 'Asset', type: 'Link' },
            },
          },
          nodeType: 'embedded-asset-block',
        },
        {
          content: [],
          data: {
            target: {
              sys: { id: '632849614', linkType: 'Entry', type: 'Link' },
            },
          },
          nodeType: 'embedded-entry-inline',
        },
      ],
      data: {},
      nodeType: 'document',
    });
    expect(createInlineAssetsMock).toHaveBeenCalledWith(envMock, [
      [
        expect.any(String),
        {
          fields: {
            file: {
              'en-US': {
                contentType: 'image/png',
                fileName: 'asap-asset.png',
                upload: 'asap-asset.png',
              },
            },
            title: {
              'en-US': 'asap-asset.png',
            },
          },
        },
      ],
    ]);

    expect(createMediaEntriesMock).toHaveBeenCalledWith(envMock, [
      [
        expect.any(String),
        {
          fields: {
            url: {
              'en-US': 'https://example.com',
            },
          },
        },
      ],
    ]);
  });

  it('returns null if html input is null and does not create asset/media', async () => {
    const document = await createDocumentIfNeeded(envMock, null);

    expect(document).toBe(null);
    expect(createInlineAssetsMock).not.toHaveBeenCalled();
    expect(createMediaEntriesMock).not.toHaveBeenCalled();
  });

  it('returns null if html input is an empty string and does not create asset/media', async () => {
    const document = await createDocumentIfNeeded(envMock, '');

    expect(document).toBe(null);
    expect(createInlineAssetsMock).not.toHaveBeenCalled();
    expect(createMediaEntriesMock).not.toHaveBeenCalled();
  });
});
