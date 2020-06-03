import React from 'react';
import { render } from '@testing-library/react';

import Paragraph from '../Paragraph';
import { ember } from '../../colors';

it('renders the text in a <p>', () => {
  const { getByText } = render(<Paragraph>text</Paragraph>);
  expect(getByText('text').tagName).toBe('P');
});

it('applies the text padding', () => {
  const { getByText } = render(<Paragraph>text</Paragraph>);
  const { paddingTop } = getComputedStyle(getByText('text'));
  expect(paddingTop).toMatchInlineSnapshot(`"12px"`);
});

it('renders primary text in a larger font', () => {
  const { getByText, rerender } = render(<Paragraph>text</Paragraph>);
  const normalFontSize = Number(
    getComputedStyle(getByText('text')).fontSize.replace(/em$/, ''),
  );

  rerender(<Paragraph primary>text</Paragraph>);
  const primaryFontSize = Number(
    getComputedStyle(getByText('text')).fontSize.replace(/em$/, ''),
  );

  expect(primaryFontSize).toBeGreaterThan(normalFontSize);
});

it('renders a given accent color', () => {
  const { getByText } = render(<Paragraph accent="ember">text</Paragraph>);
  const { color } = getComputedStyle(getByText('text'));
  expect(color).toBe(ember.rgb);
});
