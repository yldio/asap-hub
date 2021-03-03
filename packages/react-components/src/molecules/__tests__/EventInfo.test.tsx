import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createEventResponse, createGroupResponse } from '@asap-hub/fixtures';

import EventInfo from '../EventInfo';
import { getLocalTimezone } from '../../localization';

jest.mock('../../localization');

const mockGetLocalTimezone = getLocalTimezone as jest.MockedFunction<
  typeof getLocalTimezone
>;
const props: ComponentProps<typeof EventInfo> = {
  ...createEventResponse(),
  groups: [],
  href: '',
};

it('renders an event', () => {
  const { getByRole } = render(<EventInfo {...props} title="My Event" />);
  expect(getByRole('heading', { level: 3 })).toHaveTextContent('My Event');
});

it('truncates long event titles', () => {
  const { getByRole } = render(
    <EventInfo {...props} title={'blablablha'.repeat(100)} />,
  );

  expect(getByRole('heading', { level: 3 }).textContent).toMatch(/…$/i);
});

it('renders event thumbnail', () => {
  const { getByAltText } = render(
    <EventInfo
      {...props}
      thumbnail={'https://placeholder/40x40'}
      title={'blablablha'}
    />,
  );

  expect(getByAltText(/thumbnail/i).getAttribute('src')).toEqual(
    'https://placeholder/40x40',
  );
});

it('renders placeholder event thumbnail', () => {
  const { getByText } = render(
    <EventInfo
      {...props}
      thumbnail={undefined}
      title={'blablablha'.repeat(100)}
    />,
  );

  expect(getByText(/placeholder/i)).toBeInTheDocument();
});

it('renders the group name linking to the group and icon', () => {
  const { getByText, getByTitle } = render(
    <EventInfo
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
    <EventInfo {...props} groups={[]} />,
  );
  expect(getByText(/asap event/i)).not.toHaveAttribute('href');
  expect(getByTitle('Calendar')).toBeInTheDocument();
});

it("shows the date in the user's local timezone", () => {
  mockGetLocalTimezone.mockReturnValue('America/New_York');
  const { container } = render(
    <EventInfo
      {...props}
      startDate={new Date('2021-08-25T18:00:00Z').toISOString()}
      endDate={new Date('2021-08-25T20:00:00Z').toISOString()}
    />,
  );
  expect(container).toHaveTextContent(/\D25\D.+2:00 PM - 4:00 PM.+EDT/);
});

it('shows start and end day for a multi-day event', () => {
  mockGetLocalTimezone.mockReturnValue('America/New_York');
  const { container } = render(
    <EventInfo
      {...props}
      startDate={new Date('2021-08-25T18:00:00Z').toISOString()}
      endDate={new Date('2021-08-26T20:00:00Z').toISOString()}
    />,
  );
  expect(container).toHaveTextContent(/\D25\D.*\D26\D/);
});
