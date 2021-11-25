import { render } from '@testing-library/react';

import RichText from '../RichText';

it('renders <p> as a paragraph', () => {
  const { getByText } = render(<RichText text={'<p>text</p>'} />);
  expect(getByText('text').tagName).toBe('P');
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

it('displays error when <a> without an href', () => {
  const { container } = render(<RichText text={'<a>anchor</a>'} />);
  expect(container.textContent).toContain('"anchor" is missing href');
});

it('displays error when styling applied within <a>', () => {
  const { container } = render(
    <RichText
      text={'<a href="https://localhost/"><strong>anchor</strong></a>'}
    />,
  );
  expect(container.textContent).toContain(
    'Invalid link styling with href https://localhost/',
  );
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

it.each([1, 2, 3])(
  'displays error when disallowed <h%i> styling applied',
  (i) => {
    const { container } = render(
      <RichText text={`<h${i}><strong>heading</strong></h${i}>`} />,
    );
    expect(container.textContent).toContain(`Invalid h${i} heading styling`);
  },
);

it.each([1, 2, 3])(
  'displays heading when allowed <h%i> styling applied',
  (i) => {
    const { getByText } = render(
      <RichText text={`<h${i}><i>heading</i></h${i}>`} />,
    );
    expect(getByText('heading').tagName).toEqual('I');
  },
);

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
