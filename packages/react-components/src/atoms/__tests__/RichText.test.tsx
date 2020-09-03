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

it('renders <h1> as an heading', () => {
  const { getByText } = render(<RichText text={'<h1>heading</h1>'} />);
  const heading = getByText('heading');
  expect(heading.tagName).toBe('H2');
});

it('renders table of contents based on headings', () => {
  const { getByRole, getByText } = render(
    <RichText toc text={'<h1>heading 1</h1><h2>heading 2</h2>'} />,
  );

  expect(getByRole('navigation')).toBeDefined();

  const heading1 = getByText('heading 1', { selector: 'h2' });
  expect(heading1).toHaveAttribute('id', 'heading-1');

  const heading2 = getByText('heading 2', { selector: 'h3' });
  expect(heading2).toHaveAttribute('id', 'heading-2');
});
