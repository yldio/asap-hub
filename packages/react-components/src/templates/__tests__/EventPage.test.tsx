import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { formatISO, subYears } from 'date-fns';
import { createEventResponse } from '@asap-hub/fixtures';

import EventPage from '../EventPage';

const props: ComponentProps<typeof EventPage> = {
  ...createEventResponse(),
  groups: createEventResponse().groups.map((group) => ({
    ...group,
    href: '#',
  })),
  backHref: '/prev',
};

it('renders the event info', () => {
  const { getByText } = render(<EventPage {...props} title="My Event" />);
  expect(getByText('My Event')).toBeVisible();
});

it('renders a back link', () => {
  const { getByText } = render(<EventPage {...props} backHref="/prev" />);
  expect(getByText(/back/i).closest('a')).toHaveAttribute('href', '/prev');
});

it('renders the last updated date', () => {
  const { getByText } = render(
    <EventPage
      {...props}
      lastModifiedDate={formatISO(subYears(new Date(), 2))}
    />,
  );
  expect(getByText(/update/i)).toHaveTextContent(/2 year/i);
});

it('renders the join event section', () => {
  const { getAllByText } = render(<EventPage {...props} />);
  expect(getAllByText(/join/i)).not.toHaveLength(0);
});
