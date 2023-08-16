import { Environment } from 'contentful-management';
import {
  convertHtmlToContentfulFormat,
  createDocumentIfNeeded,
  removeStylingTagsWrappingIFrameTags,
  removeStylingTagsWrappingImgTags,
  wrapIframeWithPTag,
  wrapPlainTextWithPTag,
  removeSinglePTag,
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
  it('wraps plain text in a paragraph element', () => {
    const html = 'Hello world';

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

  it('converts <a> inside heading properly', async () => {
    const html = `<h4>Team presenting:<strong>Alessi - <a href="https://www.hub.com/id">Person</a></strong></h4>`;
    expect(convertHtmlToContentfulFormat(html).document.content).toEqual([
      {
        content: [
          { data: {}, marks: [], nodeType: 'text', value: 'Team presenting:' },
          {
            data: {},
            marks: [{ type: 'bold' }],
            nodeType: 'text',
            value: 'Alessi - ',
          },
          {
            content: [
              {
                data: {},
                marks: [{ type: 'bold' }],
                nodeType: 'text',
                value: 'Person',
              },
            ],
            data: { uri: 'https://www.hub.com/id' },
            nodeType: 'hyperlink',
          },
        ],
        data: {},
        nodeType: 'heading-4',
      },
    ]);
  });

  it('handles multiple spans nested inside divs', () => {
    const html = '<div><span>Some</span><span> text</span></div>';
    expect(convertHtmlToContentfulFormat(html).document.content).toEqual([
      {
        content: [
          {
            data: {},
            marks: [],
            nodeType: 'text',
            value: 'Some',
          },
          {
            data: {},
            marks: [],
            nodeType: 'text',
            value: ' text',
          },
        ],
        data: {},
        nodeType: 'paragraph',
      },
    ]);
  });

  it('does not split list items with <sup> tags into separate paragraphs', () => {
    const html = '<ul><li>On the 1<sup>st</sup> January</li></ul>';

    expect(convertHtmlToContentfulFormat(html).document.content).toEqual([
      {
        content: [
          {
            content: [
              {
                content: [
                  { data: {}, value: 'On the 1', marks: [], nodeType: 'text' },
                  {
                    data: {},
                    value: 'st',
                    marks: [{ type: 'superscript' }],
                    nodeType: 'text',
                  },
                  { data: {}, value: ' January', marks: [], nodeType: 'text' },
                ],
                data: {},
                nodeType: 'paragraph',
              },
            ],
            data: {},
            nodeType: 'list-item',
          },
        ],
        data: {},
        nodeType: 'unordered-list',
      },
    ]);
  });

  it('handles multiple spans nested inside divs with a list in between', () => {
    const html = `<div>
    <span>Some</span><span> text</span>
    <ol><li>List</li></ol>
    <span>More</span><span> text</span>
    </div>`;
    expect(convertHtmlToContentfulFormat(html).document.content).toEqual([
      {
        content: [
          {
            data: {},
            marks: [],
            nodeType: 'text',
            value: 'Some',
          },
          {
            data: {},
            marks: [],
            nodeType: 'text',
            value: ' text',
          },
        ],
        data: {},
        nodeType: 'paragraph',
      },
      {
        content: [
          {
            content: expect.arrayContaining([]),
            data: {},
            nodeType: 'list-item',
          },
        ],
        data: {},
        nodeType: 'ordered-list',
      },
      {
        content: [
          {
            data: {},
            marks: [],
            nodeType: 'text',
            value: 'More',
          },
          {
            data: {},
            marks: [],
            nodeType: 'text',
            value: ' text',
          },
        ],
        data: {},
        nodeType: 'paragraph',
      },
    ]);
  });

  it('handles nested lists with sibling list items', () => {
    const html = `<div>
      <ul>
        <li>List item 1</li>
        <li>List item 2</li>
        <ul>
          <li>Sublist item</li>
        </ul>
      </ul>
    </div>`;
    expect(convertHtmlToContentfulFormat(html).document.content).toEqual([
      {
        content: [
          {
            content: [
              {
                content: [
                  {
                    data: {},
                    marks: [],
                    nodeType: 'text',
                    value: 'List item 1',
                  },
                ],
                data: {},
                nodeType: 'paragraph',
              },
            ],
            data: {},
            nodeType: 'list-item',
          },
          {
            content: [
              {
                content: [
                  {
                    data: {},
                    marks: [],
                    nodeType: 'text',
                    value: 'List item 2',
                  },
                ],
                data: {},
                nodeType: 'paragraph',
              },
              {
                content: [
                  {
                    content: [
                      {
                        content: [
                          {
                            data: {},
                            marks: [],
                            nodeType: 'text',
                            value: 'Sublist item',
                          },
                        ],
                        data: {},
                        nodeType: 'paragraph',
                      },
                    ],
                    data: {},
                    nodeType: 'list-item',
                  },
                ],
                data: {},
                nodeType: 'unordered-list',
              },
            ],
            data: {},
            nodeType: 'list-item',
          },
        ],
        data: {},
        nodeType: 'unordered-list',
      },
    ]);
  });

  it('handles nested lists without sibling list items', () => {
    const html = `<div>
      <ul>
        <ul>
          <li>Sublist item</li>
        </ul>
      </ul>
    </div>`;
    expect(convertHtmlToContentfulFormat(html).document.content).toEqual([
      {
        content: [
          {
            content: [
              {
                content: [
                  {
                    content: [
                      {
                        content: [
                          {
                            data: {},
                            marks: [],
                            nodeType: 'text',
                            value: 'Sublist item',
                          },
                        ],
                        data: {},
                        nodeType: 'paragraph',
                      },
                    ],
                    data: {},
                    nodeType: 'list-item',
                  },
                ],
                data: {},
                nodeType: 'unordered-list',
              },
            ],
            data: {},
            nodeType: 'list-item',
          },
        ],
        data: {},
        nodeType: 'unordered-list',
      },
    ]);
  });

  it('removes empty section tags from content', () => {
    const html = `<div>
      <section>
      </section>
      <p>Content</p>
    </div>`;
    expect(convertHtmlToContentfulFormat(html).document.content).toEqual([
      {
        content: [
          {
            value: 'Content',
            marks: [],
            data: {},
            nodeType: 'text',
          },
        ],
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
          content: [
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
          nodeType: 'paragraph',
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

describe('removeStylingTagsWrappingIFrameTags', () => {
  it.each`
    tag
    ${`strong`}
    ${`em`}
    ${`b`}
    ${`i`}
  `('removes $tag tag wrapping iframe tag', ({ tag }) => {
    const html = `<strong>Presentation title</strong></p>\n<p><${tag}><iframe src="https://drive.google.com/file/d/id" width="640" height="480"></iframe></${tag}></p>`;
    expect(removeStylingTagsWrappingIFrameTags(html)).toEqual(
      '<strong>Presentation title</strong></p>\n<p><iframe src="https://drive.google.com/file/d/id" width="640" height="480"></iframe></p>',
    );
  });

  it('removes more than one styling tag wrapping iframe tags', () => {
    const html = '<strong><em><iframe src="video"></iframe></em></strong>';
    expect(removeStylingTagsWrappingIFrameTags(html)).toEqual(
      '<iframe src="video"></iframe>',
    );
  });

  it('removes styling tag properly when there is more than one iframe in the html', () => {
    const html =
      '<strong><em><iframe src="video-1"></iframe></em></strong><p><strong>Another video</strong></p><p><strong><iframe src="video-2"></iframe></strong></p>';
    expect(removeStylingTagsWrappingIFrameTags(html)).toEqual(
      '<iframe src="video-1"></iframe><p><strong>Another video</strong></p><p><iframe src="video-2"></iframe></p>',
    );
  });
});

describe('removeStylingTagsWrappingImgTags', () => {
  it.each`
    tag
    ${`strong`}
    ${`em`}
    ${`b`}
    ${`i`}
  `('removes $tag tag wrapping img tag', ({ tag }) => {
    const html = `<strong>Image</strong></p>\n<p><${tag}><img src="https://example/image.png"/></${tag}></p>`;
    expect(removeStylingTagsWrappingImgTags(html)).toEqual(
      '<strong>Image</strong></p>\n<p><img src="https://example/image.png"/></p>',
    );
  });

  it('removes more than one styling tag wrapping img tags', () => {
    const html = '<strong><em><img src="image.png"/></em></strong>';
    expect(removeStylingTagsWrappingImgTags(html)).toEqual(
      '<img src="image.png"/>',
    );
  });

  it('removes styling tag properly when there is more than one img in the html', () => {
    const html =
      '<strong><em><img src="img-1"/></em></strong><p><strong>Another image</strong></p><p><strong><img src="img-2"/></strong></p>';
    expect(removeStylingTagsWrappingImgTags(html)).toEqual(
      '<img src="img-1"/><p><strong>Another image</strong></p><p><img src="img-2"/></p>',
    );
  });
});

describe('wrapIframeWithPTag', () => {
  it('wraps iframe with p tag if not wrapped already', () => {
    const html = '<iframe src="video"></iframe>';
    expect(wrapIframeWithPTag(html)).toEqual(
      '<p><iframe src="video"></iframe></p>',
    );
  });

  it('does not wrap iframe with p tag if wrapped already', () => {
    const html = '<p><iframe src="video"></iframe></p>';
    expect(wrapIframeWithPTag(html)).toEqual(
      '<p><iframe src="video"></iframe></p>',
    );
  });

  it('does not wrap iframe with p tag is wrapped already by a parent element', () => {
    const html = '<p>Presenter 1<br /><iframe src="video"></iframe></p>';
    expect(wrapIframeWithPTag(html)).toEqual(
      '<p>Presenter 1<br><iframe src="video"></iframe></p>',
    );
  });
});

describe('wrapPlainTextWithPTag', () => {
  test('works when text does not have any p tag', () => {
    const input = 'Hello';
    const expectedOutput = '<p>Hello</p>';
    expect(wrapPlainTextWithPTag(input)).toEqual(expectedOutput);
  });

  test('works when there is a paragraph with p tag and one without it', () => {
    const input =
      '<p>SNCAflox delta neo mouse line; first coding exon is flanked by loxP sites.</p>Full name: B6(Cg)-Sncatm1.1Vlb/J mie';
    const expectedOutput =
      '<p>SNCAflox delta neo mouse line; first coding exon is flanked by loxP sites.</p><p>Full name: B6(Cg)-Sncatm1.1Vlb/J mie</p>';
    expect(wrapPlainTextWithPTag(input)).toEqual(expectedOutput);
  });

  test.each`
    tag
    ${`sup`}
    ${`sub`}
    ${`a`}
    ${`strong`}
    ${`b`}
    ${`em`}
    ${`i`}
    ${`span`}
    ${`u`}
  `('does not wrap $tag by p', ({ tag }) => {
    const input = `<p>this is <${tag}>any text</${tag}></p>`;
    const expectedOutput = `<p>this is <${tag}>any text</${tag}></p>`;
    expect(wrapPlainTextWithPTag(input)).toEqual(expectedOutput);
  });

  test.each`
    tag
    ${`h1`}
    ${`h2`}
    ${`h3`}
    ${`h4`}
    ${`h5`}
    ${`h6`}
  `('does not wrap inner text of $tag by p', ({ tag }) => {
    const input = `<${tag}>heading</${tag}>`;
    const expectedOutput = `<${tag}>heading</${tag}>`;
    expect(wrapPlainTextWithPTag(input)).toEqual(expectedOutput);
  });
});

describe('removeSinglePTag', () => {
  test('removes single closing </p>', () => {
    const html = 'Text</p>';
    expect(removeSinglePTag(html)).toEqual('Text');
  });

  test('removes single opening <p>', () => {
    const html = '<p>Text';
    expect(removeSinglePTag(html)).toEqual('Text');
  });

  test('does not remove closing </p> if there is a opening <p>', () => {
    const html = '<p>Text</p>';
    expect(removeSinglePTag(html)).toEqual('<p>Text</p>');
  });
});
