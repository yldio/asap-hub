import { User } from '@asap-hub/auth';
import { createListEventResponse } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';

import PastEventsSection from '../PastEventsSection';
import { useEvents } from '../../../events/state';

jest.mock('../../../events/state');

const mockUseEvents = useEvents as jest.MockedFunction<typeof useEvents>;
const user = {} as User;

afterEach(() => {
  jest.clearAllMocks();
});

it('renders the past events section', () => {
  mockUseEvents.mockReturnValue(
    createListEventResponse(2) as ReturnType<typeof useEvents>,
  );
  render(<PastEventsSection date={new Date()} user={user} />);
  expect(screen.getByText('Past Events')).toBeVisible();
});

it('always shows a View All link to past events', () => {
  mockUseEvents.mockReturnValue(
    createListEventResponse(0) as ReturnType<typeof useEvents>,
  );
  render(<PastEventsSection date={new Date()} user={user} />);
  expect(
    screen.getByTestId('view-past-events').querySelector('a'),
  ).toHaveAttribute('href', '/events/past');
});
