import React from 'react';
import { render } from '@testing-library/react';

import EventsPage from '../EventsPage';

it('renders the header', () => {
  const { getByRole } = render(<EventsPage />);
  expect(getByRole('heading')).toBeVisible();
});

it('renders the children', () => {
  const { getByText } = render(<EventsPage>Content</EventsPage>);
  expect(getByText('Content')).toBeVisible();
});
