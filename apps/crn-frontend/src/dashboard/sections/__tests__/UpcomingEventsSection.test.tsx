import { createListEventResponse } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';

import UpcomingEventsSection from '../UpcomingEventsSection';
import { useEvents } from '../../../events/state';

jest.mock('../../../events/state');

const mockUseEvents = useEvents as jest.MockedFunction<typeof useEvents>;

afterEach(() => {
  jest.clearAllMocks();
});

const mockEvents = (count: number) =>
  mockUseEvents.mockReturnValue(
    createListEventResponse(count) as ReturnType<typeof useEvents>,
  );

it('renders the upcoming events section', () => {
  mockEvents(1);
  render(<UpcomingEventsSection date={new Date()} />);
  expect(screen.getByText('Upcoming Events')).toBeVisible();
});

it('shows a View All link when there are more than 3 events', () => {
  mockEvents(4);
  render(<UpcomingEventsSection date={new Date()} />);
  expect(
    screen.getByTestId('view-upcoming-events').querySelector('a'),
  ).toHaveAttribute('href', '/events/upcoming');
});

it('hides the View All link when there are 3 or fewer events', () => {
  mockEvents(3);
  render(<UpcomingEventsSection date={new Date()} />);
  expect(screen.queryByTestId('view-upcoming-events')).not.toBeInTheDocument();
});
