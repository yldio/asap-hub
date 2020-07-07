import React from 'react';
import { render } from '@testing-library/react';

import Headline4 from '../Headline4';
import { viewportCalc } from '../../test-utils';
import { largeDesktopScreen } from '../../pixels';

it('renders the text in an <h4>', () => {
  const { getByText } = render(<Headline4>text</Headline4>);
  expect(getByText('text').tagName).toBe('H4');
});

it('applies the text margin', () => {
  const { getByText } = render(<Headline4>text</Headline4>);
  const { marginTop } = getComputedStyle(getByText('text'));
  expect(marginTop).toMatchInlineSnapshot(`"12px"`);
});

it('renders the text in large font', () => {
  const { getByText } = render(<Headline4>text</Headline4>);
  const { fontSize } = getComputedStyle(getByText('text'));
  expect(viewportCalc(fontSize, largeDesktopScreen)).toMatchInlineSnapshot(
    `"21.25px"`,
  );
});
