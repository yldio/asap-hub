import React from 'react';
import { render } from '@testing-library/react';

import Tooltip from '../Tooltip';

it('does not show the children by default', () => {
  const { getByText } = render(<Tooltip>text</Tooltip>);
  expect(getByText('text')).not.toBeVisible();
});

it('shows a tooltip with the children when shown', () => {
  const { getByRole, getByText } = render(<Tooltip shown>text</Tooltip>);
  expect(getByText('text')).toBeVisible();
  expect(getByRole('tooltip')).toHaveTextContent('text');
});
