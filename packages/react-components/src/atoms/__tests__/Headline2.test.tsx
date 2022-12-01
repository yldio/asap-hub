import { render } from '@testing-library/react';

import Headline2 from '../Headline2';
import { viewportCalc } from '../../test-utils';
import { largeDesktopScreen } from '../../pixels';

it('renders the text in an <h2>', () => {
  const { getByText } = render(<Headline2>text</Headline2>);
  expect(getByText('text').tagName).toBe('H2');
});

it('applies the text margin', () => {
  const { getByText } = render(<Headline2>text</Headline2>);
  const { marginTop } = getComputedStyle(getByText('text'));
  expect(marginTop).toMatchInlineSnapshot(`"12px"`);
});

it('renders the text in large font', () => {
  const { getByText } = render(<Headline2>text</Headline2>);
  const { fontSize } = getComputedStyle(getByText('text'));
  expect(viewportCalc(fontSize, largeDesktopScreen)).toMatchInlineSnapshot(
    `"30px"`,
  );
});

it('removes the text margin', () => {
  const { getByText } = render(<Headline2 noMargin>text</Headline2>);
  const { marginTop, marginBottom } = getComputedStyle(getByText('text'));
  expect(marginTop).toMatchInlineSnapshot(`"0px"`);
  expect(marginBottom).toMatchInlineSnapshot(`"0px"`);
});
