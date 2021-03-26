import React from 'react';
import { render } from '@testing-library/react';

import EventMaterialsUnavailable from '../EventMaterialsUnavailable';

it('renders a card saying there are no materials available', () => {
  const { getByText } = render(<EventMaterialsUnavailable />);
  expect(getByText(/no .* material/i)).toBeVisible();
});
