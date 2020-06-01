import React from 'react';
import { render } from '@testing-library/react';

import Theme from '../Theme';
import { charcoal, paper } from '../../colors';

it('applies the colors for the given theme variant', () => {
  const { getByText } = render(<Theme variant="dark">text</Theme>);
  expect(getComputedStyle(getByText('text')).backgroundColor).toBe(
    charcoal.rgb,
  );
});

it('defaults to the light variant', () => {
  const { getByText } = render(<Theme>text</Theme>);
  expect(getComputedStyle(getByText('text')).backgroundColor).toBe(paper.rgb);
});
