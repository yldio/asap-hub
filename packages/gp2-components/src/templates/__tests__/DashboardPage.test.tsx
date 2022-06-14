import { render } from '@testing-library/react';

import DashboardPage from '../DashboardPage';

it('renders the header', () => {
  const { getByRole } = render(<DashboardPage>Content</DashboardPage>);
  expect(getByRole('heading')).toBeVisible();
  expect(getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Welcome to the GP2 Hub!"`,
  );
});

it('renders the children', () => {
  const { getByText } = render(<DashboardPage>Content</DashboardPage>);
  expect(getByText('Content')).toBeVisible();
});
