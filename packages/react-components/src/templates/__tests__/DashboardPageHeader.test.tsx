import { render, screen } from '@testing-library/react';

import DashboardPageHeader from '../DashboardPageHeader';

it('renders the header', () => {
  const { getByRole } = render(<DashboardPageHeader />);
  expect(getByRole('heading')).toBeVisible();
});

it('displays welcome mesage', () => {
  const { getByRole } = render(<DashboardPageHeader />);

  expect(getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Welcome to the Hub!"`,
  );
});

it('displays user first name in welcome mesage', () => {
  const { getByRole } = render(<DashboardPageHeader firstName={'John'} />);

  expect(getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Welcome to the Hub, John!"`,
  );
});

it('switches off the subtext if user dismissed the getting started text', () => {
  render(
    <DashboardPageHeader firstName={'Mike'} dismissedGettingStarted={false} />,
  );

  expect(
    screen.getByText(/The ASAP Hub is the private meeting point for/),
  ).toBeVisible();

  render(
    <DashboardPageHeader firstName={'Mike'} dismissedGettingStarted={true} />,
  );

  expect(
    screen.queryByText(/The ASAP Hub is the private meeting point for/),
  ).toBeNull();
});
