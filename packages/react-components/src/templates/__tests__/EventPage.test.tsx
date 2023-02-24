import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { addDays, formatISO, subDays, subYears } from 'date-fns';
import {
  createCalendarResponse,
  createEventResponse,
} from '@asap-hub/fixtures';

import EventPage from '../EventPage';

const props: ComponentProps<typeof EventPage> = {
  ...createEventResponse(),
  eventOwner: <div>ASAP Team</div>,
  eventConversation: <div>ASAP Team</div>,
  displayCalendar: false,
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

it('renders calendar list when displayCalendar is true', () => {
  const { queryByText } = render(
    <EventPage
      {...props}
      displayCalendar
      calendar={{ ...createCalendarResponse(), name: 'Event Calendar' }}
    />,
  );
  expect(queryByText('Event Calendar')).toBeInTheDocument();
});

it('renders the children', () => {
  const { queryByText } = render(<EventPage {...props}>Children</EventPage>);
  expect(queryByText('Children')).toBeVisible();
});
