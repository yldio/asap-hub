import { convertHtmlToContentfulFormat } from '../../src/utils';

describe('convertHtmlToContentfulFormat', () => {
  it('converts simple html to contentful expected rich text format properly', () => {
    const html = '<p>Hello world</p>';

    expect(convertHtmlToContentfulFormat(html)).toEqual({
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
    });
  });

  it('converts html with list to contentful expected rich text format properly', () => {
    const html = '<ul><li>item 1</li><li>item 2</li></ul>';

    expect(convertHtmlToContentfulFormat(html)).toEqual({
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
    });
  });
});
