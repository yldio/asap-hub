import { convertHtmlToContentfulFormat } from '../../src/utils';

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
    });
  });

  it('converts html with inline image', () => {
    const assetId = '8ca5d37d-4bc1-4085-b05e-786c3e6f5a38';
    const html = `<p>some text and now an image <img src="https://cloud.squidex.io/api/assets/crn-2023/${assetId}/sky.png" alt="blue sky" width="564" height="564" /></p>`;

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
                  id: assetId,
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
      inlineAssetBodies: [
        [
          assetId,
          {
            fields: {
              description: {
                'en-US': 'blue sky',
              },
              file: {
                'en-US': {
                  contentType: 'image/png',
                  fileName: 'sky.png',
                  upload: `https://cloud.squidex.io/api/assets/crn-2023/${assetId}/sky.png`,
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
});
