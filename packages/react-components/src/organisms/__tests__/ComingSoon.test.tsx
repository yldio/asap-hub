import React from 'react';
import { render } from '@testing-library/react';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import ComingSoon from '../ComingSoon';

it('renders the <strong> coming soon text', () => {
  const { getByText } = render(<ComingSoon>Text</ComingSoon>);
  expect(
    findParentWithStyle(getByText(/more to come/i), 'fontWeight')?.fontWeight,
  ).toMatchInlineSnapshot(`"bold"`);
});

it('renders the given child text', () => {
  const { getByText } = render(<ComingSoon>Text</ComingSoon>);
  expect(getByText('Text')).toBeVisible();
});
