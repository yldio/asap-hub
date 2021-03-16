import React from 'react';
import { render } from '@testing-library/react';
import { disable } from '@asap-hub/flags';
import { events, searchQueryParam } from '@asap-hub/routing';
import { StaticRouter } from 'react-router-dom';

import EventsPageHeader from '../EventsPageHeader';

it('renders the heading', () => {
  const { getByRole } = render(<EventsPageHeader />);
  expect(getByRole('heading', { level: 1 })).toHaveTextContent(
    'Calendar and Events',
  );
});

it('renders the navigation without upcoming events (REGRESSION)', () => {
  disable('UPCOMING_EVENTS');
  const { getAllByRole } = render(<EventsPageHeader />);
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['Calendar', 'Past Events']);
});

it('renders the navigation without past events (REGRESSION)', () => {
  disable('PAST_EVENTS');
  const { getAllByRole } = render(<EventsPageHeader />);
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['Calendar', 'Upcoming Events']);
});

it('renders the navigation', () => {
  const { getAllByRole } = render(<EventsPageHeader />);
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['Calendar', 'Upcoming Events', 'Past Events']);
});

it('preserves search query when navigating', () => {
  const { getByText } = render(
    <StaticRouter location={events({}).upcoming({}).$}>
      <EventsPageHeader searchQuery="searchterm" />
    </StaticRouter>,
  );
  expect(
    new URL(getByText(/past/i).closest('a')!.href).searchParams.get(
      searchQueryParam,
    ),
  ).toBe('searchterm');
});
