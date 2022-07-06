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

it('renders a toast card with paper clip icon', () => {
  const { getByTitle, getByText } = render(
    <ToastCard type="attachment" toastContent="explanation text">
      content
    </ToastCard>,
  );
  expect(getByTitle(/paper ?clip/i)).toBeInTheDocument();
  expect(getByText('explanation text')).toBeVisible();
});

it('renders a toast card with error icon', () => {
  const { getByTitle, getByText } = render(
    <ToastCard type="alert" toastContent="explanation text">
      content
    </ToastCard>,
  );
  expect(getByTitle(/error/i)).toBeInTheDocument();
  expect(getByText('explanation text')).toBeVisible();
});

it('does not renders a toast card when no toast content provided', () => {
  const { queryByTitle } = render(
    <ToastCard type="attachment">content</ToastCard>,
  );
  expect(queryByTitle(/paper ?clip/i)).not.toBeInTheDocument();
});
