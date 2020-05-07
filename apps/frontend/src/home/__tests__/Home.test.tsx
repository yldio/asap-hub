import React from 'react';
import { render } from '@testing-library/react';

import Home from '../Home';

test('renders asap link', () => {
  const { getByText } = render(<Home />);
  const linkElement = getByText(/aligning science/i);
  expect(linkElement).toBeInTheDocument();
});
