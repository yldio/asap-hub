import { render, screen } from '@testing-library/react';

import DashboardSection from '../DashboardSection';

it('renders the title, description and children', () => {
  render(
    <DashboardSection title="Past Events" description="Some description">
      <div>section body</div>
    </DashboardSection>,
  );
  expect(screen.getByText('Past Events')).toBeVisible();
  expect(screen.getByText('Some description')).toBeVisible();
  expect(screen.getByText('section body')).toBeVisible();
});

it('renders a View All link when a href is provided', () => {
  render(
    <DashboardSection
      title="Past Events"
      description="Some description"
      viewAllHref="/events/past"
      viewAllTestId="view-past-events"
    >
      <div>section body</div>
    </DashboardSection>,
  );
  const link = screen.getByTestId('view-past-events').querySelector('a');
  expect(link).toHaveTextContent('View All');
  expect(link).toHaveAttribute('href', '/events/past');
});

it('does not render a View All link without a href', () => {
  render(
    <DashboardSection title="Past Events" description="Some description">
      <div>section body</div>
    </DashboardSection>,
  );
  expect(screen.queryByText('View All →')).not.toBeInTheDocument();
});
