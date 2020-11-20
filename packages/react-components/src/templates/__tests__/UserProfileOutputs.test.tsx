import React from 'react';
import { render } from '@testing-library/react';

import UserProfileOutputs from '../UserProfileOutputs';

it('renders a coming soon text', () => {
  const { getByText } = render(<UserProfileOutputs />);

  expect(getByText(/more\sto\scome/i)).toBeVisible();
  expect(getByText(/as\sindividuals/i)).toBeVisible();
});
