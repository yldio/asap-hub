import React from 'react';
import { render } from '@testing-library/react';

import RecordOutputPage from '../RecordOutputPage';

it('renders the top-level heading', () => {
  const { getByText } = render(<RecordOutputPage />);
  expect(getByText(/output/i, { selector: 'h1' })).toBeVisible();
});

it('renders the form', () => {
  const { getByLabelText } = render(<RecordOutputPage />);
  expect(getByLabelText(/url/i)).toBeVisible();
});
