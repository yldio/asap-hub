import React from 'react';
import { render } from '@testing-library/react';

import TeamOutputs from '../TeamOutputs';

it('renders a coming soon text', () => {
  const { getByText } = render(<TeamOutputs />);

  expect(getByText(/coming soon/i)).toBeVisible();
  expect(getByText(/team.+output/i)).toBeVisible();
});
