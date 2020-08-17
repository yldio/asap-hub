import React from 'react';
import { render } from '@testing-library/react';

import Header from '../Header';
import { findParentWithStyle } from '../../test-utils';

it('renders an ASAP logo', () => {
  const { getByAltText } = render(<Header />);
  expect(getByAltText(/asap.+logo/i)).toHaveAttribute(
    'src',
    expect.stringMatching(/asap/i),
  );
});

it('does not render an opaque background when set to transparent', () => {
  const { getByAltText, rerender } = render(<Header />);
  expect(
    findParentWithStyle(getByAltText(/asap.+logo/i), 'backgroundColor')
      ?.backgroundColor,
  ).toMatchInlineSnapshot(`"rgb(255, 255, 255)"`);

  rerender(<Header transparent />);
  expect(
    findParentWithStyle(getByAltText(/asap.+logo/i), 'backgroundColor'),
  ).toBe(null);
});
