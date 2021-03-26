import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createEventResponse, createGroupResponse } from '@asap-hub/fixtures';

import EventInfo from '../EventInfo';

jest.mock('../../localization');

const props: ComponentProps<typeof EventInfo> = {
  ...createEventResponse(),
  group: undefined,
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

it('does not truncate long event titles when limit is null', () => {
  const { getByRole } = render(
    <EventInfo {...props} titleLimit={null} title={'blablablha'.repeat(100)} />,
  );

  expect(getByRole('heading', { level: 3 }).textContent).not.toMatch(/…$/i);
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
      group={{
        ...createGroupResponse(),
        id: 'grp',
        name: 'My Group',
      }}
    />,
  );
  expect(getByText('My Group')).toHaveAttribute(
    'href',
    expect.stringMatching(/grp$/),
  );
  expect(getByTitle('Group')).toBeInTheDocument();
});

it('shows that the event is run by ASAP when there is no group', () => {
  const { getByText, getByTitle } = render(
    <EventInfo {...props} groups={undefined} />,
  );
  expect(getByText(/asap event/i)).not.toHaveAttribute('href');
  expect(getByTitle('Calendar')).toBeInTheDocument();
});

it('shows the event time', () => {
  const { getByText } = render(
    <EventInfo
      {...props}
      startDate="2021-01-01T08:00:00Z"
      startDateTimeZone="Europe/Tallinn"
    />,
  );
  expect(getByText(/8:00/)).toBeVisible();
});

it('only links to events that are not cancelled', () => {
  const { getByRole, rerender } = render(
    <EventInfo {...props} status="Tentative" />,
  );
  expect(getByRole('heading', { level: 3 }).closest('a')).toHaveAttribute(
    'href',
  );

  rerender(<EventInfo {...props} status="Cancelled" />);
  expect(getByRole('heading', { level: 3 }).closest('a')).not.toHaveAttribute(
    'href',
  );
});
