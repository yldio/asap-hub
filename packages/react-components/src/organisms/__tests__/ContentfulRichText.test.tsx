import {
  getDocument,
  getRichTextField,
  getHyperlinkNode,
  inlineEmbeddedEntryNode,
  inlineEmbeddedEntryNodeLink,
  paragraphNode,
  paragraphWrapper,
  blockAssetNode,
  blockAssetNodeLink,
  getHeadingNode,
} from '@asap-hub/fixtures';
import { BLOCKS } from '@contentful/rich-text-types';
import { render } from '@testing-library/react';

import ContentfulRichText from '../ContentfulRichText';

it('renders <p> as a paragraph', () => {
  const { getByText } = render(
    <ContentfulRichText
      text={getRichTextField({
        jsonDocument: getDocument({ content: paragraphNode }),
      })}
    />,
  );
  expect(getByText('text').tagName).toBe('P');
});

it('renders <iframe>', () => {
  const { getByTitle } = render(
    <ContentfulRichText
      text={getRichTextField({
        jsonDocument: getDocument({
          content: paragraphWrapper(inlineEmbeddedEntryNode),
        }),
        inlineEntries: [inlineEmbeddedEntryNodeLink],
      })}
    />,
  );
  expect(getByTitle(inlineEmbeddedEntryNodeLink.url)).toBeInTheDocument();
});

it('renders <a> as a link', () => {
  const { getByText } = render(
    <ContentfulRichText
      text={getRichTextField({
        jsonDocument: getDocument({
          content: paragraphWrapper(getHyperlinkNode()),
        }),
      })}
    />,
  );
  expect(getByText('anchor').tagName).toBe('A');
  expect(getByText('anchor')).toHaveAttribute('href', 'https://localhost/');
});

it('renders <a> as link with italic text', () => {
  const { getByRole } = render(
    <ContentfulRichText
      text={getRichTextField({
        jsonDocument: getDocument({
          content: paragraphWrapper(
            getHyperlinkNode([
              {
                type: 'italic',
              },
            ]),
          ),
        }),
      })}
    />,
  );

  expect(getByRole('link')).toMatchInlineSnapshot(`
    <a
      class="css-1ensq76-resetStyles-styles-light"
      href="https://localhost/"
      rel="noreferrer noopener"
      target="_blank"
    >
      <i>
        anchor
      </i>
    </a>
  `);
});

it('renders <a> as link with bold text', () => {
  const { getByRole } = render(
    <ContentfulRichText
      text={getRichTextField({
        jsonDocument: getDocument({
          content: paragraphWrapper(
            getHyperlinkNode([
              {
                type: 'bold',
              },
            ]),
          ),
        }),
      })}
    />,
  );
  expect(getByRole('link')).toMatchInlineSnapshot(`
    <a
      class="css-1ensq76-resetStyles-styles-light"
      href="https://localhost/"
      rel="noreferrer noopener"
      target="_blank"
    >
      <b>
        anchor
      </b>
    </a>
  `);
});

it('renders <a> as link with bold and italic text', () => {
  const { getByRole } = render(
    <ContentfulRichText
      text={getRichTextField({
        jsonDocument: getDocument({
          content: paragraphWrapper(
            getHyperlinkNode([
              {
                type: 'italic',
              },
              {
                type: 'bold',
              },
            ]),
          ),
        }),
      })}
    />,
  );

  expect(getByRole('link')).toMatchInlineSnapshot(`
    <a
      class="css-1ensq76-resetStyles-styles-light"
      href="https://localhost/"
      rel="noreferrer noopener"
      target="_blank"
    >
      <b>
        <i>
          anchor
        </i>
      </b>
    </a>
  `);
});

it('renders <a> as link with formatting in the middle', () => {
  const { getByRole } = render(
    <ContentfulRichText
      text={getRichTextField({
        jsonDocument: getDocument({
          content: paragraphWrapper({
            ...getHyperlinkNode(),
            content: [
              {
                nodeType: 'text',
                value: 'bold',
                marks: [
                  {
                    type: 'bold',
                  },
                ],
                data: {},
              },
              {
                nodeType: 'text',
                value: ' normal ',
                marks: [],
                data: {},
              },
              {
                nodeType: 'text',
                value: 'italic',
                marks: [
                  {
                    type: 'italic',
                  },
                ],
                data: {},
              },
            ],
          }),
        }),
      })}
    />,
  );

  expect(getByRole('link')).toMatchInlineSnapshot(`
    <a
      class="css-1ensq76-resetStyles-styles-light"
      href="https://localhost/"
      rel="noreferrer noopener"
      target="_blank"
    >
      <b>
        bold
      </b>
       normal 
      <i>
        italic
      </i>
    </a>
  `);
});

it.each([
  [BLOCKS.HEADING_1, 'H4'],
  [BLOCKS.HEADING_2, 'H5'],
  [BLOCKS.HEADING_3, 'H6'],
])('renders %s to %s', (nodeType, expected) => {
  const { getByText } = render(
    <ContentfulRichText
      text={getRichTextField({
        jsonDocument: getDocument({
          content: paragraphWrapper(getHeadingNode(nodeType)),
        }),
      })}
    />,
  );
  const heading = getByText('heading');
  expect(heading.tagName).toBe(expected);
});

it.each([1, 2, 3])(
  'displays error when disallowed <h%i> styling applied',
  (i) => {
    const { container } = render(
      <ContentfulRichText text={`<h${i}><strong>heading</strong></h${i}>`} />,
    );
    expect(container.textContent).toContain(`Invalid h${i} heading styling`);
  },
);

it.each([1, 2, 3])(
  'displays heading when allowed <h%i> styling applied',
  (i) => {
    const { getByText } = render(
      <ContentfulRichText text={`<h${i}><i>heading</i></h${i}>`} />,
    );
    expect(getByText('heading').tagName).toEqual('I');
  },
);

it('passes through image props', () => {
  const { getByRole } = render(
    <ContentfulRichText
      text={getRichTextField({
        jsonDocument: getDocument({
          content: paragraphWrapper(blockAssetNode),
        }),
        blockAssets: [blockAssetNodeLink],
      })}
    />,
  );
  expect(getByRole('img')).toHaveAttribute('width', '100%');
});

it('sets images max-width to 100%', () => {
  const { getByRole } = render(
    <ContentfulRichText
      text={getRichTextField({
        jsonDocument: getDocument({
          content: paragraphWrapper(blockAssetNode),
        }),
        blockAssets: [blockAssetNodeLink],
      })}
    />,
  );
  expect(getByRole('img')).toHaveStyle({ maxWidth: '100%' });
});

describe('with toc', () => {
  it('renders a table of contents based on the headings', () => {
    const { getByText } = render(
      <ContentfulRichText toc text={'<h1>heading 1</h1><h2>heading 2</h2>'} />,
    );

    const tocEntry1 = getByText('heading 1', {
      selector: 'nav li a',
    }) as HTMLAnchorElement;
    const tocEntry2 = getByText('heading 2', {
      selector: 'nav li a',
    }) as HTMLAnchorElement;
    const heading1 = getByText('heading 1', { selector: 'h4' });
    const heading2 = getByText('heading 2', { selector: 'h5' });

    expect(heading1.id).not.toBe(heading2.id);
    expect(tocEntry1.href).toBe(
      new URL(`#${heading1.id}`, globalThis.location.href).toString(),
    );
    expect(tocEntry2.href).toBe(
      new URL(`#${heading2.id}`, globalThis.location.href).toString(),
    );
  });
  it('only displays toc heading when toc enabled', () => {
    const { queryByRole, rerender } = render(
      <ContentfulRichText text={'<h1>heading 1</h1><h2>heading 2</h2>'} />,
    );
    expect(queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    rerender(
      <ContentfulRichText toc text={'<h1>heading 1</h1><h2>heading 2</h2>'} />,
    );
    expect(queryByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('does not display toc heading when there are no headings in the contents', () => {
    const { queryByRole } = render(
      <ContentfulRichText toc text={'<p>some text without headings</p>'} />,
    );
    expect(queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });
});

describe('with poorText', () => {
  it('renders <a> as a link', () => {
    const { getByText } = render(
      <ContentfulRichText
        poorText
        text={'<a href="https://localhost/">anchor</a>'}
      />,
    );
    expect(getByText('anchor').tagName).toBe('A');
    expect(getByText('anchor')).toHaveAttribute('href', 'https://localhost/');
  });
  it('renders <p> as a paragraph', () => {
    const { getByText } = render(
      <ContentfulRichText poorText text={'<p>text</p>'} />,
    );
    expect(getByText('text').tagName).toBe('P');
  });
  it('strips out other formatting preserving content', () => {
    const { getByText } = render(
      <ContentfulRichText poorText text={'<b>bold</b> <i>italic</i> text'} />,
    );
    expect(getByText(/text/i).innerHTML).toMatchInlineSnapshot(
      `"bold italic text"`,
    );
  });
});
