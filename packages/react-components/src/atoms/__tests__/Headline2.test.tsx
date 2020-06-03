import React from 'react';
import { render } from '@testing-library/react';

import Headline2 from '../Headline2';
import { viewportCalc } from '../../test-utils';
import { largeDesktopScreen } from '../../pixels';

it('renders the text in an <h2>', () => {
  const { getByText } = render(<Headline2>text</Headline2>);
  expect(getByText('text').tagName).toBe('H2');
});

it('applies the text padding', () => {
  const { getByText } = render(<Headline2>text</Headline2>);
  const { paddingTop } = getComputedStyle(getByText('text'));
  expect(paddingTop).toMatchInlineSnapshot(`"12px"`);
});

it('renders the text in large font', () => {
  const { getByText } = render(<Headline2>text</Headline2>);
  const { fontSize } = getComputedStyle(getByText('text'));
  expect(viewportCalc(fontSize, largeDesktopScreen)).toMatchInlineSnapshot(
    `"33.2px"`,
  );
});
