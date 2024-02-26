import { render, screen } from '@testing-library/react';

import DashboardPage from '../DashboardPage';

it('renders the header', () => {
  const { getByRole } = render(<DashboardPage>Content</DashboardPage>);
  expect(getByRole('heading')).toBeVisible();
  expect(getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Welcome to the Hub!"`,
  );
});

it('renders the children', () => {
  const { getByText } = render(<DashboardPage>Content</DashboardPage>);
  expect(getByText('Content')).toBeVisible();
});

it('renders the header with a name', () => {
  render(<DashboardPage firstName="ExampleName" />);
  expect(
    screen.getByRole('heading', {
      name: 'Welcome to the Hub, ExampleName ExampleName!',
    }),
  ).toBeVisible();
});
