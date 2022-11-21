import { convertText } from '../../src/utils';

describe('rich text utils', () => {
  it('converts simple html to contentful expected rich text format properly', () => {
    const payload = { 'en-US': null };
    const html = '<p>Hello world</p>';

    convertText(payload, html, 'entry-id');

    expect(payload).toEqual({
      'en-US': {
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
    });
  });

  it('converts html with list to contentful expected rich text format properly', () => {
    const payload = { 'en-US': null };
    const html = '<ul><li>item 1</li><li>item 2</li></ul>';

    convertText(payload, html, 'entry-id');

    expect(payload).toEqual({
      'en-US': {
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
    });
  });

  it('gives an error', () => {
    console.log = jest.fn();
    const payload = { 'en-US': null };

    const html =
      '<p><strong>Generating research-enabling resources through the expansion of PPMI</strong> |&nbsp;<u></u></p>';
    expect(payload).toEqual({ 'en-US': null });
    convertText(payload, html, 'entry-id');
    expect(console.log).toBeCalledWith(
      'There is a problem converting rich text from entry entry-id',
    );
  });
});
