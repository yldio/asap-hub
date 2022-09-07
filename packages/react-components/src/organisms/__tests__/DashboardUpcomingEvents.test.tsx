import { createListEventResponse } from '@asap-hub/fixtures';
import { render } from '@testing-library/react';
import DashboardUpcomingEvents from '../DashboardUpcomingEvents';

it('shows the event cards and the view all link', () => {
  const { getByText, getByRole } = render(
    <DashboardUpcomingEvents
      upcomingEvents={createListEventResponse(3).items}
      upcomingEventsCount={4}
    />,
  );

  expect(getByText('Upcoming Events')).toBeVisible();
  expect(getByText("Here're some upcoming events.")).toBeVisible();

  expect(getByText('Event 1')).toBeVisible();
  expect(getByRole('link', { name: 'View All →' })).toBeVisible();
});

it('does not show the link where there are 3 ore less upcoming evetns', () => {
  const { queryByRole } = render(
    <DashboardUpcomingEvents
      upcomingEvents={createListEventResponse(3).items}
      upcomingEventsCount={3}
    />,
  );
  expect(queryByRole('link', { name: 'View All →' })).not.toBeInTheDocument();
});

it('show the placeholder card if there are no events', () => {
  const { getByText } = render(<DashboardUpcomingEvents />);

  expect(getByText('Upcoming Events')).toBeVisible();
  expect(getByText("Here're some upcoming events.")).toBeVisible();
  expect(getByText('There are no upcoming events.')).toBeVisible();
});
