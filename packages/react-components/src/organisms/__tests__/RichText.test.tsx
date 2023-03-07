import { render } from '@testing-library/react';

import RichText from '../RichText';

it('renders <p> as a paragraph', () => {
  const { getByText } = render(<RichText text={'<p>text</p>'} />);
  expect(getByText('text').tagName).toBe('P');
});

it('renders <u> as a underline', () => {
  const { getByText } = render(<RichText text={'<p><u>underline</u></p>'} />);
  expect(getByText('underline').tagName).toBe('U');
});

it('renders <iframe>', () => {
  const { getByTitle } = render(
    <RichText text={'<iframe title="Some Frame" />'} />,
  );
  expect(getByTitle('Some Frame')).toBeInTheDocument();
});

it('renders <a> as a link', () => {
  const { getByText } = render(
    <RichText text={'<a href="https://localhost/">anchor</a>'} />,
  );
  expect(getByText('anchor').tagName).toBe('A');
  expect(getByText('anchor')).toHaveAttribute('href', 'https://localhost/');
});

it('renders <a> as link with italic text', () => {
  const { getByRole } = render(
    <RichText text={'<a href="https://localhost/"><i>anchor</i></a>'} />,
  );
  const link = getByRole('link');

  expect(link).toHaveAttribute('href', 'https://localhost/');
  expect(link.firstElementChild?.innerHTML).toEqual(
    '<i style="color:inherit">anchor</i>',
  );
});

it('renders <a> as link with bold text', () => {
  const { getByRole } = render(
    <RichText text={'<a href="https://localhost/"><b>anchor</b></a>'} />,
  );
  const link = getByRole('link');

  expect(link).toHaveAttribute('href', 'https://localhost/');
  expect(link.firstElementChild?.innerHTML).toEqual(
    '<b style="color:inherit">anchor</b>',
  );
});

it('renders <a> as link with bold and italic text', () => {
  const { getByRole } = render(
    <RichText text={'<a href="https://localhost/"><b><i>anchor</i></b></a>'} />,
  );
  const link = getByRole('link');

  expect(link).toHaveAttribute('href', 'https://localhost/');
  expect(link.firstElementChild?.innerHTML).toEqual(
    '<i style="color:inherit"><b style="color:inherit">anchor</b></i>',
  );
});

it('renders <a> as link with formatting in the middle', () => {
  const { getByRole } = render(
    <RichText
      text={'<a href="https://localhost/"><b>bold</b> normal <i>italic</i></a>'}
    />,
  );
  const link = getByRole('link');

  expect(link).toHaveAttribute('href', 'https://localhost/');
  expect(link.firstElementChild?.innerHTML).toEqual(
    '<b style="color:inherit">bold</b> normal <i style="color:inherit">italic</i>',
  );
});

it('displays error when <a> without an href', () => {
  const { container } = render(<RichText text={'<a>anchor</a>'} />);
  expect(container.textContent).toContain('"anchor" is missing href');
});

it.each([
  [1, 'H4'],
  [2, 'H5'],
  [3, 'H6'],
])('renders <h%i> to %s', (i, expected) => {
  const { getByText } = render(<RichText text={`<h${i}>heading</h${i}>`} />);
  const heading = getByText('heading');
  expect(heading.tagName).toBe(expected);
});

it.each`
  heading | tag         | tagName
  ${`1`}  | ${`b`}      | ${`B`}
  ${`2`}  | ${`b`}      | ${`B`}
  ${`3`}  | ${`b`}      | ${`B`}
  ${`1`}  | ${`strong`} | ${`STRONG`}
  ${`2`}  | ${`strong`} | ${`STRONG`}
  ${`3`}  | ${`strong`} | ${`STRONG`}
  ${`1`}  | ${`i`}      | ${`I`}
  ${`2`}  | ${`i`}      | ${`I`}
  ${`3`}  | ${`i`}      | ${`I`}
  ${`1`}  | ${`em`}     | ${`EM`}
  ${`2`}  | ${`em`}     | ${`EM`}
  ${`3`}  | ${`em`}     | ${`EM`}
`(
  'displays heading <h$heading> with nested tag <$tag>',
  ({ heading, tag, tagName }) => {
    const { getByText } = render(
      <RichText text={`<h${heading}><${tag}>heading</${tag}></h${heading}>`} />,
    );
    expect(getByText('heading').tagName).toEqual(tagName);
  },
);

it.each([1, 2, 3])('displays error when <h%i> has invalid nested tag', (i) => {
  const { container } = render(
    <RichText text={`<h${i}><ul>heading</ul></h${i}>`} />,
  );
  expect(container.textContent).toContain(
    `Styling Error Invalid h${i} heading styling`,
  );
});

it('passes through image props', () => {
  const { getByRole } = render(<RichText text={'<img width="100%" />'} />);
  expect(getByRole('img')).toHaveAttribute('width', '100%');
});

it('sets images max-width to 100%', () => {
  const { getByRole } = render(<RichText text={'<img></img>'} />);
  expect(getByRole('img')).toHaveStyle({ maxWidth: '100%' });
});

describe('with toc', () => {
  it('renders a table of contents based on the headings', () => {
    const { getByText } = render(
      <RichText toc text={'<h1>heading 1</h1><h2>heading 2</h2>'} />,
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
      <RichText text={'<h1>heading 1</h1><h2>heading 2</h2>'} />,
    );
    expect(queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    rerender(<RichText toc text={'<h1>heading 1</h1><h2>heading 2</h2>'} />);
    expect(queryByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('does not display toc heading when there are no headings in the contents', () => {
    const { queryByRole } = render(
      <RichText toc text={'<p>some text without headings</p>'} />,
    );
    expect(queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });
});

describe('with poorText', () => {
  it('renders <a> as a link', () => {
    const { getByText } = render(
      <RichText poorText text={'<a href="https://localhost/">anchor</a>'} />,
    );
    expect(getByText('anchor').tagName).toBe('A');
    expect(getByText('anchor')).toHaveAttribute('href', 'https://localhost/');
  });
  it('renders <p> as a paragraph', () => {
    const { getByText } = render(<RichText poorText text={'<p>text</p>'} />);
    expect(getByText('text').tagName).toBe('P');
  });
  it('strips out other formatting preserving content', () => {
    const { getByText } = render(
      <RichText poorText text={'<b>bold</b> <i>italic</i> text'} />,
    );
    expect(getByText(/text/i).innerHTML).toMatchInlineSnapshot(
      `"bold italic text"`,
    );
  });
});
