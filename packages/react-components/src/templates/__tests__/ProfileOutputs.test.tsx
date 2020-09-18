import React from 'react';
import { render } from '@testing-library/react';

import ProfileOutputs from '../ProfileOutputs';

it('renders a coming soon text', () => {
  const { getByText } = render(<ProfileOutputs />);

  expect(getByText(/coming soon/i)).toBeVisible();
  expect(getByText(/your.+progress/i)).toBeVisible();
});
