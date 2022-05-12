import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
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

it("renders the join event button, when 'hideMeetingLink' is set to false", () => {
  const { rerender } = render(
    <EventPage
      {...props}
      endDate={addDays(new Date(), 100).toISOString()}
      meetingLink={'link'}
      hideMeetingLink={false}
    />,
  );
  expect(screen.getAllByText(/join the meeting/i)).not.toHaveLength(0);

  rerender(
    <EventPage
      {...props}
      endDate={addDays(new Date(), 100).toISOString()}
      meetingLink={'link'}
      hideMeetingLink={true}
    />,
  );
  expect(screen.queryAllByText(/join the meeting/i)).toHaveLength(0);
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

it('renders calendar list for active groups', () => {
  const { queryByText, rerender } = render(
    <EventPage
      {...props}
      group={{ ...props.group!, active: true }}
      calendar={{ ...createCalendarResponse(), name: 'Event Calendar' }}
    />,
  );
  expect(queryByText('Event Calendar')).toBeVisible();
  rerender(
    <EventPage
      {...props}
      group={{ ...props.group!, active: false }}
      calendar={{ ...createCalendarResponse(), name: 'Event Calendar' }}
    />,
  );
  expect(queryByText('Event Calendar')).not.toBeInTheDocument();
});

it('renders calendar list for events with missing group', () => {
  const { queryByText } = render(
    <EventPage
      {...props}
      group={undefined}
      calendar={{ ...createCalendarResponse(), name: 'Event Calendar' }}
    />,
  );
  expect(queryByText('Event Calendar')).toBeInTheDocument();
});

it('renders the speakers list component', () => {
  const { queryByText } = render(<EventPage {...props} />);
  expect(queryByText('Speakers')).toBeInTheDocument();
});

it('does not the speakers list component if there are no speakers', () => {
  const noSpeakers = { ...props };
  noSpeakers.speakers = [];
  const { queryByText } = render(<EventPage {...noSpeakers} />);
  expect(queryByText('Speakers')).not.toBeInTheDocument();
});
