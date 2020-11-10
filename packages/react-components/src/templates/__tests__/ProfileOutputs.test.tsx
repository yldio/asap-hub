import React from 'react';
import { render } from '@testing-library/react';

import ProfileOutputs from '../ProfileOutputs';

it('renders a coming soon text', () => {
  const { getByText } = render(<ProfileOutputs />);

  expect(getByText(/more\sto\scome/i)).toBeVisible();
  expect(getByText(/as\sindividuals/i)).toBeVisible();
});
