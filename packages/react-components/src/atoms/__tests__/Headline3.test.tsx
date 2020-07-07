import React from 'react';
import { render } from '@testing-library/react';

import Headline3 from '../Headline3';
import { viewportCalc } from '../../test-utils';
import { largeDesktopScreen } from '../../pixels';

it('renders the text in an <h3>', () => {
  const { getByText } = render(<Headline3>text</Headline3>);
  expect(getByText('text').tagName).toBe('H3');
});

it('applies the text margin', () => {
  const { getByText } = render(<Headline3>text</Headline3>);
  const { marginTop } = getComputedStyle(getByText('text'));
  expect(marginTop).toMatchInlineSnapshot(`"12px"`);
});

it('renders the text in large font', () => {
  const { getByText } = render(<Headline3>text</Headline3>);
  const { fontSize } = getComputedStyle(getByText('text'));
  expect(viewportCalc(fontSize, largeDesktopScreen)).toMatchInlineSnapshot(
    `"26.56px"`,
  );
});
