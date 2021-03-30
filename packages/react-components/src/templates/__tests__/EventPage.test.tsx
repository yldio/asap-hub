import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { addDays, formatISO, subDays, subYears } from 'date-fns';
import {
  createCalendarResponse,
  createEventResponse,
  createGroupResponse,
} from '@asap-hub/fixtures';

import EventPage from '../EventPage';

const props: ComponentProps<typeof EventPage> = {
  ...createEventResponse(),
  group: createGroupResponse(),
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

it('renders the event description', () => {
  const { getByText } = render(<EventPage {...props} description="My Desc" />);
  expect(getByText('My Desc')).toBeVisible();
});

it('renders the join event section', () => {
  const { getAllByText } = render(
    <EventPage {...props} endDate={addDays(new Date(), 100).toISOString()} />,
  );
  expect(getAllByText(/join/i)).not.toHaveLength(0);
});

it('renders the event notes', () => {
  const { getByRole } = render(
    <EventPage
      {...props}
      endDate={subDays(new Date(), 100).toISOString()}
      notes="My Notes"
    />,
  );
  expect(getByRole('heading', { name: 'Notes', level: 2 })).toBeVisible();
});

it('renders the video recording', () => {
  const { getByText } = render(
    <EventPage
      {...props}
      endDate={subDays(new Date(), 100).toISOString()}
      videoRecording="My Video"
    />,
  );
  expect(getByText('My Video')).toBeVisible();
});

it('renders the presentation', () => {
  const { getByText } = render(
    <EventPage
      {...props}
      endDate={subDays(new Date(), 100).toISOString()}
      presentation="My Presentation"
    />,
  );
  expect(getByText('My Presentation')).toBeVisible();
});

it('renders additional materials', () => {
  const { getByText } = render(
    <EventPage
      {...props}
      endDate={subDays(new Date(), 100).toISOString()}
      meetingMaterials={[
        { title: 'Example Material', url: 'http://example.com' },
      ]}
    />,
  );
  expect(getByText('Example Material')).toBeVisible();
});

it('renders continue the event conversation when group with slack provided', () => {
  const { queryByTitle, rerender } = render(
    <EventPage
      {...props}
      group={{ ...createGroupResponse(), tools: { slack: 'http://slack.com' } }}
    />,
  );
  expect(queryByTitle(/slack/i)).toBeInTheDocument();
  rerender(<EventPage {...props} group={undefined} />);
  expect(queryByTitle(/slack/i)).not.toBeInTheDocument();
});

it('renders calendar list', () => {
  const { getByText } = render(
    <EventPage
      {...props}
      calendar={{ ...createCalendarResponse(), name: 'Event Calendar' }}
    />,
  );
  expect(getByText('Event Calendar')).toBeVisible();
});
