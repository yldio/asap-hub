import { eventRoutes, searchQueryParam } from '@asap-hub/routing';
import { render } from '@testing-library/react';
import { StaticRouter } from 'react-router-dom/server';
import EventsPageHeader from '../EventsPageHeader';

it('renders the heading', () => {
  const { getByRole } = render(<EventsPageHeader />);
  expect(getByRole('heading', { level: 1 })).toHaveTextContent(
    'Calendar and Events',
  );
});

it('renders the navigation', () => {
  const { getAllByRole } = render(<EventsPageHeader />);
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['Upcoming Events', 'Past Events', 'Subscribe to Calendars']);
});

it('preserves search query when navigating', () => {
  const { getByText } = render(
    <StaticRouter location={eventRoutes.DEFAULT.UPCOMING.path}>
      <EventsPageHeader searchQuery="searchterm" />
    </StaticRouter>,
  );
  expect(
    new URL(getByText(/past/i).closest('a')!.href).searchParams.get(
      searchQueryParam,
    ),
  ).toBe('searchterm');
});
