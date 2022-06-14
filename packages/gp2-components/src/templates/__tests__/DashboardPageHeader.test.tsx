import { render } from '@testing-library/react';

import DashboardPageHeader from '../DashboardPageHeader';

it('renders the header', () => {
  const { getByRole } = render(<DashboardPageHeader />);
  expect(getByRole('heading')).toBeVisible();
});

it('displays welcome mesage', () => {
  const { getByRole } = render(<DashboardPageHeader />);

  expect(getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Welcome to the GP2 Hub!"`,
  );
});

it('displays user first name in welcome mesage', () => {
  const { getByRole } = render(<DashboardPageHeader firstName={'John'} />);

  expect(getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Welcome to the GP2 Hub, John!"`,
  );
});
