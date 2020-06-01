import React from 'react';
import { render } from '@testing-library/react';

import Display from '../Display';
import { viewportCalc } from '../../test-utils';
import { largeDesktopScreen } from '../../pixels';

it('renders the text in an <h1>', () => {
  const { getByText } = render(<Display>text</Display>);
  expect(getByText('text').tagName).toBe('H1');
});

it('applies the text padding', () => {
  const { getByText } = render(<Display>text</Display>);
  const { paddingTop } = getComputedStyle(getByText('text'));
  expect(paddingTop).toMatchInlineSnapshot(`"12px"`);
});

it('renders the text in large font', () => {
  const { getByText } = render(<Display>text</Display>);
  const { fontSize } = getComputedStyle(getByText('text'));
  expect(viewportCalc(fontSize, largeDesktopScreen)).toMatchInlineSnapshot(
    `"41.5px"`,
  );
});
