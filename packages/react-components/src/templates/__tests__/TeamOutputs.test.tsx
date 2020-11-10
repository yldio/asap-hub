import React from 'react';
import { render } from '@testing-library/react';

import TeamOutputs from '../TeamOutputs';

it('renders a coming soon text', () => {
  const { getByText } = render(<TeamOutputs />);

  expect(getByText(/more\sto\scome/i)).toBeVisible();
  expect(getByText(/research\soutputs/i)).toBeVisible();
});
