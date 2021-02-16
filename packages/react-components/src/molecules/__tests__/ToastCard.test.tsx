import React from 'react';
import { render } from '@testing-library/react';

import ToastCard from '../ToastCard';

it('renders a toast card with children', () => {
  const { getByText } = render(<ToastCard>content</ToastCard>);
  expect(getByText('content')).toBeVisible();
});

it('renders a toast card with alert', () => {
  const { getByTitle, getByText } = render(
    <ToastCard toastText="Warning">content</ToastCard>,
  );
  expect(getByTitle('Alert')).toBeInTheDocument();
  expect(getByText('Warning')).toBeVisible();
});
