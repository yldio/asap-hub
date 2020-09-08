import React from 'react';
import { render } from '@testing-library/react';

import UserNavigation from '../UserNavigation';

it('renders a placeholder text', () => {
  const { container } = render(<UserNavigation />);
  expect(container.textContent).toMatch(/user nav/i);
});
