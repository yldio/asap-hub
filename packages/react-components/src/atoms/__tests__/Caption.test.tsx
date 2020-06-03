import React from 'react';
import { render } from '@testing-library/react';

import Caption from '../Caption';
import { ember } from '../../colors';

it('renders the text in a <p>', () => {
  const { getByText } = render(
    <figure>
      the figure
      <Caption>text</Caption>
    </figure>,
  );
  expect(getByText('text').tagName).toBe('FIGCAPTION');
});

it('applies the text padding', () => {
  const { getByText } = render(
    <figure>
      the figure
      <Caption>text</Caption>
    </figure>,
  );
  const { paddingTop } = getComputedStyle(getByText('text'));
  expect(paddingTop).toMatchInlineSnapshot(`"12px"`);
});

it('renders a given accent color', () => {
  const { getByText } = render(
    <figure>
      the figure
      <Caption accent="ember">text</Caption>
    </figure>,
  );
  const { color } = getComputedStyle(getByText('text'));
  expect(color).toBe(ember.rgb);
});
