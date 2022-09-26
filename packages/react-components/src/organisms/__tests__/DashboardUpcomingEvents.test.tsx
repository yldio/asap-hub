import { createListEventResponse } from '@asap-hub/fixtures';
import { render } from '@testing-library/react';
import DashboardUpcomingEvents from '../DashboardUpcomingEvents';

it('shows the event cards and the view all link', () => {
  const { getByText } = render(
    <DashboardUpcomingEvents
      upcomingEvents={createListEventResponse(4, { customTitle: 'TestEvent' })}
    />,
  );

  expect(getByText('TestEvent 1')).toBeVisible();
  expect(getByText('TestEvent 2')).toBeVisible();
  expect(getByText('TestEvent 3')).toBeVisible();
});

it('does not show the link where there are 3 ore less upcoming events', () => {
  const { queryByRole } = render(
    <DashboardUpcomingEvents upcomingEvents={createListEventResponse(3)} />,
  );
  expect(queryByRole('link', { name: 'View All →' })).not.toBeInTheDocument();
});

it('show the placeholder card if there are no events', () => {
  const { getByText } = render(<DashboardUpcomingEvents />);

  expect(getByText('There are no upcoming events.')).toBeVisible();
});
