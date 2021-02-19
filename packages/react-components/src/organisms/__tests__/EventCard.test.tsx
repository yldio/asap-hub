import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createEventResponse, createGroupResponse } from '@asap-hub/fixtures';

import EventCard from '../EventCard';
import { getLocalTimezone } from '../../localization';

jest.mock('../../localization');

const mockedGetLocalTimezone = getLocalTimezone as jest.MockedFunction<
  typeof getLocalTimezone
>;
const props: ComponentProps<typeof EventCard> = {
  ...createEventResponse(),
  groups: [],
  href: '',
};

it('Renders an event', () => {
  const { getByRole } = render(<EventCard {...props} title="My Event" />);
  expect(getByRole('heading', { level: 3 })).toHaveTextContent('My Event');
});

it('truncates long event titles', () => {
  const { getByRole } = render(
    <EventCard {...props} title={'blablablha'.repeat(100)} />,
  );

  expect(getByRole('heading', { level: 3 }).textContent).toMatch(/…$/i);
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

it('shows that the event is run by ASAP when there is no group', () => {
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

it('to show a properly formatted date in users local timezone', () => {
  mockedGetLocalTimezone.mockReturnValue('America/New_York');
  const { container } = render(
    <EventCard
      {...props}
      startDate={new Date('2021-08-06T18:00:00Z').toISOString()}
      endDate={new Date('2021-08-06T20:00:00Z').toISOString()}
    />,
  );
  expect(container).toHaveTextContent(/2021.+2:00 PM - 4:00 PM.+EDT/);
});
