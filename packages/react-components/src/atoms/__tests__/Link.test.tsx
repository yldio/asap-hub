import React from 'react';
import { render } from '@testing-library/react';

import Link from '../Link';

it('renders the text in an anchor', () => {
  const { getByText } = render(<Link href="#">text</Link>);
  expect(getByText('text').tagName).toBe('A');
});

it('applies the default link color', () => {
  const { getByRole } = render(<Link href="#">text</Link>);
  const { color } = getComputedStyle(getByRole('link'));
  expect(color).toMatchInlineSnapshot(`"rgb(52, 162, 112)"`);
});

it('applies the href to the anchor', () => {
  const { getByRole } = render(
    <Link href="https://parkinsonsroadmap.org/">text</Link>,
  );
  const { href } = getByRole('link') as HTMLAnchorElement;
  expect(href).toBe('https://parkinsonsroadmap.org/');
});

it('sets the anchor target', () => {
  const { getByRole } = render(<Link href="#">text</Link>);
  const { target } = getByRole('link') as HTMLAnchorElement;
  expect(target).toMatchInlineSnapshot(`"_blank"`);
});

it('secures the link against third parties', () => {
  const { getByRole } = render(<Link href="#">text</Link>);
  const { relList } = getByRole('link') as HTMLAnchorElement;
  expect(relList).toContain('noreferrer');
  expect(relList).toContain('noopener');
});
