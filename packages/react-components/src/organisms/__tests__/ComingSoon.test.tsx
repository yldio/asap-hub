import React from 'react';
import { render } from '@testing-library/react';

import ComingSoon from '../ComingSoon';
import { findParentWithStyle } from '../../test-utils';

it('renders the <strong> coming soon text', () => {
  const { getByText } = render(<ComingSoon>Text</ComingSoon>);
  expect(
    findParentWithStyle(getByText(/coming soon/i), 'fontWeight')?.fontWeight,
  ).toMatchInlineSnapshot(`"bold"`);
});

it('renders the given child text', () => {
  const { getByText } = render(<ComingSoon>Text</ComingSoon>);
  expect(getByText('Text')).toBeVisible();
});
