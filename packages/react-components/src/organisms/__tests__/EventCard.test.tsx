import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createEventResponse, createGroupResponse } from '@asap-hub/fixtures';

import EventCard from '../EventCard';

const props: ComponentProps<typeof EventCard> = {
  ...createEventResponse(),
  groups: [],
  href: '',
};

it('Renders an event', () => {
  const { getByRole } = render(<EventCard {...props} title="My Event" />);
  expect(getByRole('heading', { level: 4 })).toHaveTextContent('My Event');
});

it('truncates long event titles', () => {
  const { getByRole } = render(
    <EventCard {...props} title={'blablablha'.repeat(100)} />,
  );

  expect(getByRole('heading', { level: 4 }).textContent).toMatch(/…$/i);
});

it('renders the group name linking to the group and icon', () => {
  const { getByText, getByTitle } = render(
    <EventCard
      {...props}
      groups={[
        {
          ...createGroupResponse(),
          name: 'My Group',
          href: '/my-group',
        },
      ]}
    />,
  );
  expect(getByText('My Group')).toHaveAttribute('href', '/my-group');
  expect(getByTitle('Group')).toBeInTheDocument();
});

it('shows the the event is run by ASAP when there is no group', () => {
  const { getByText, getByTitle } = render(
    <EventCard {...props} groups={[]} />,
  );
  expect(getByText(/asap event/i)).not.toHaveAttribute('href');
  expect(getByTitle('Calendar')).toBeInTheDocument();
});

it('shows that an event has been cancelled', () => {
  const { getByTitle, getByText } = render(
    <EventCard {...props} status="Cancelled" />,
  );
  expect(getByTitle('Alert')).toBeInTheDocument();
  expect(getByText(/cancelled/i)).toBeVisible();
});
