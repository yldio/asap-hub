import React from 'react';
import { render } from '@testing-library/react';

import ToastCard from '../ToastCard';

it('renders a toast card with children', () => {
  const { getByText } = render(<ToastCard>content</ToastCard>);
  expect(getByText('content')).toBeVisible();
});

it('does not render a toast when no message is provided', () => {
  const { queryByTitle } = render(<ToastCard>content</ToastCard>);
  expect(queryByTitle('Alert')).not.toBeInTheDocument();
});

it('renders a toast card with alert', () => {
  const { getByTitle, getByText } = render(
    <ToastCard toastText="Warning">content</ToastCard>,
  );
  expect(getByTitle('Alert')).toBeInTheDocument();
  expect(getByText('Warning')).toBeVisible();
});
