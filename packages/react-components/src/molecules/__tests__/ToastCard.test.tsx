import React from 'react';
import { render } from '@testing-library/react';

import ToastCard from '../ToastCard';
import { Link } from '../../atoms';

it('renders a toast card with children', () => {
  const { getByText } = render(<ToastCard>content</ToastCard>);
  expect(getByText('content')).toBeVisible();
});

it('does not render a toast when no message is provided', () => {
  const { queryByTitle } = render(<ToastCard>content</ToastCard>);
  expect(queryByTitle('Alert')).not.toBeInTheDocument();
});
it('renders a toast card with a link', () => {
  const { getByRole } = render(
    <ToastCard toastContent={<Link href="http://example.com">test</Link>}>
      content
    </ToastCard>,
  );
  expect(getByRole('link')).toHaveAttribute('href', 'http://example.com');
});

it('renders a toast card with alert', () => {
  const { getByTitle, getByText } = render(
    <ToastCard toastContent="Warning">content</ToastCard>,
  );
  expect(getByTitle('Alert')).toBeInTheDocument();
  expect(getByText('Warning')).toBeVisible();
});

it('renders a toast card with paper clip icon', () => {
  const { getByTitle, getByText } = render(
    <ToastCard type="attachment" toastContent="explanation text">
      content
    </ToastCard>,
  );
  expect(getByTitle('Paper Clip')).toBeInTheDocument();
  expect(getByText('explanation text')).toBeVisible();
});

it('renders a toast card with a clock icon', () => {
  const { getByTitle, getByText } = render(
    <ToastCard type="live" toastContent="explanation text">
      content
    </ToastCard>,
  );
  expect(getByTitle('Clock')).toBeInTheDocument();
  expect(getByText('explanation text')).toBeVisible();
});
