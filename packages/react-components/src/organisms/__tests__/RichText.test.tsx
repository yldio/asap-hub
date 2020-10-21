import React from 'react';
import { render } from '@testing-library/react';

import RichText from '../RichText';

it('renders <p> as a paragraph', () => {
  const { getByText } = render(<RichText text={'<p>text</p>'} />);
  expect(getByText('text').tagName).toBe('P');
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

it('Displays error when styling applied within <a>', () => {
  const { container } = render(
    <RichText
      text={'<a href="https://localhost/"><strong>anchor</strong></a>'}
    />,
  );
  expect(container.textContent).toContain(
    'Invalid link styling with href https://localhost/',
  );
});

it.each([1, 2])('renders <h$i> one heading level lower', (i) => {
  const { getByText } = render(<RichText text={`<h${i}>heading</h${i}>`} />);
  const heading = getByText('heading');
  expect(heading.tagName).toBe(`H${i + 1}`);
});

it.each([1, 2])('displays error when disallowed <h$i> styling applied', (i) => {
  const { container } = render(
    <RichText text={`<h${i}><strong>heading</strong></h${i}>`} />,
  );
  expect(container.textContent).toContain(`Invalid h${i} heading styling`);
});

it.each([1, 2])('displays heading when allowed <h$i> styling applied', (i) => {
  const { getByRole } = render(
    <RichText text={`<h${i}><i>heading</i></h${i}>`} />,
  );
  expect(getByRole('heading').firstElementChild?.tagName).toEqual('I');
  expect(getByRole('heading').textContent).toEqual('heading');
});

it('Displays error when styling applied to h2', () => {
  const { container } = render(
    <RichText text={'<h2><strong>anchor</strong></h2>'} />,
  );
  expect(container.textContent).toContain('Invalid h2 heading styling');
});

it('passes through image props', () => {
  const { getByRole } = render(
    <RichText text={'<img data-test="test123" alt="alt text"></img>'} />,
  );
  expect(getByRole('img')).toHaveAttribute('data-test', 'test123');
  expect(getByRole('img')).toHaveAttribute('alt', 'alt text');
});

it('sets blank alt when omitted', () => {
  const { getByRole } = render(<RichText text={'<img></img>'} />);
  expect(getByRole('img')).toHaveAttribute('alt');
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
    const heading1 = getByText('heading 1', { selector: 'h2' });
    const heading2 = getByText('heading 2', { selector: 'h3' });

    expect(heading1.id).not.toBe(heading2.id);
    expect(tocEntry1.href).toBe(
      new URL(`#${heading1.id}`, globalThis.location.href).toString(),
    );
    expect(tocEntry2.href).toBe(
      new URL(`#${heading2.id}`, globalThis.location.href).toString(),
    );
  });
});
