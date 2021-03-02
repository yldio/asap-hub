import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { disable } from '@asap-hub/flags';

import EventsPageHeader from '../EventsPageHeader';

const props: ComponentProps<typeof EventsPageHeader> = {
  calendarHref: '',
  upcomingHref: '',
  pastHref: '',
};

it('renders the heading', () => {
  const { getByRole } = render(<EventsPageHeader {...props} />);
  expect(getByRole('heading', { level: 1 })).toHaveTextContent(
    'Calendar and Events',
  );
});

it('renders the navigation without upcoming events (REGRESSION)', () => {
  disable('UPCOMING_EVENTS');
  const { getAllByRole } = render(<EventsPageHeader {...props} />);
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['Calendar', 'Past Events']);
});

it('renders the navigation without past events (REGRESSION)', () => {
  disable('PAST_EVENTS');
  const { getAllByRole } = render(<EventsPageHeader {...props} />);
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['Calendar', 'Upcoming Events']);
});

it('renders the navigation', () => {
  const { getAllByRole } = render(<EventsPageHeader {...props} />);
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['Calendar', 'Upcoming Events', 'Past Events']);
});
