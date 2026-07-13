import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { addDays, addMinutes, formatISO, subDays, subYears } from 'date-fns';
import {
  createCalendarResponse,
  createEventResponse,
} from '@asap-hub/fixtures';

import EventDetailPage from '../EventDetailPage';

const props: ComponentProps<typeof EventDetailPage> = {
  ...createEventResponse(),
  hasFinished: false,
  hasSpeakersToBeAnnounced: false,
  tags: [],
  eventOwner: <div>ASAP Team</div>,
  eventConversation: <div>Event Conversation</div>,
  displayCalendar: false,
  backHref: '/prev',
  getIconForDocumentType: jest.fn(),
};

const renderPage = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

it('renders the event title', () => {
  renderPage(<EventDetailPage {...props} title="My Event" />);
  expect(screen.getByRole('heading', { name: 'My Event' })).toBeVisible();
});

it('does not truncate a long event title', () => {
  const title =
    'A very long event title that would normally get cut off'.padEnd(80, 'x');
  renderPage(<EventDetailPage {...props} title={title} />);
  expect(screen.getByText(title)).toBeVisible();
});

it('renders a back link', () => {
  renderPage(<EventDetailPage {...props} backHref="/prev" />);
  expect(screen.getByText(/back/i).closest('a')).toHaveAttribute(
    'href',
    '/prev',
  );
});

it('renders the cancellation banner for a cancelled event', () => {
  renderPage(<EventDetailPage {...props} status="Cancelled" />);
  expect(screen.getByText('The event has been cancelled.')).toBeVisible();
});

it('renders the live banner with the meeting link while the event is happening', () => {
  renderPage(
    <EventDetailPage
      {...props}
      status="Confirmed"
      meetingLink="http://example.com"
      startDate={addMinutes(new Date(), 1).toISOString()}
      endDate={addMinutes(new Date(), 30).toISOString()}
    />,
  );
  expect(screen.getByText('This event is happening now.')).toBeVisible();
  expect(screen.getByText('Join Meeting Now').closest('a')).toHaveAttribute(
    'href',
    'http://example.com',
  );
});

it('renders the last updated date', () => {
  renderPage(
    <EventDetailPage
      {...props}
      lastModifiedDate={formatISO(subYears(new Date(), 2))}
    />,
  );
  expect(screen.getByText(/update/i)).toHaveTextContent(/2 year/i);
});

it('renders the about section with description and tags', () => {
  renderPage(
    <EventDetailPage {...props} description="My Desc" tags={['My Tag']} />,
  );
  expect(screen.getByText('About this event')).toBeVisible();
  expect(screen.getByText('My Desc')).toBeVisible();
  expect(screen.getAllByText('My Tag').length).toBeGreaterThan(0);
});

it('collapses the description initially, even for upcoming events', () => {
  renderPage(
    <EventDetailPage
      {...props}
      description="My Desc"
      endDate={addDays(new Date(), 1).toISOString()}
    />,
  );
  expect(screen.getByRole('button', { name: /show more/i })).toBeVisible();
});

it('omits the about section without description and tags', () => {
  renderPage(<EventDetailPage {...props} description="" tags={[]} />);
  expect(screen.queryByText('About this event')).not.toBeInTheDocument();
});

it("renders the join event button, when 'hideMeetingLink' is set to false", () => {
  const endDate = addDays(new Date(), 100).toISOString();
  const { rerender } = renderPage(
    <EventDetailPage
      {...props}
      endDate={endDate}
      meetingLink="link"
      hideMeetingLink={false}
    />,
  );
  expect(screen.getAllByText(/join the meeting/i)).not.toHaveLength(0);

  rerender(
    <MemoryRouter>
      <EventDetailPage
        {...props}
        endDate={endDate}
        meetingLink="link"
        hideMeetingLink={true}
      />
    </MemoryRouter>,
  );
  expect(screen.queryAllByText(/join the meeting/i)).toHaveLength(0);
});

it('renders the event materials once the event has ended', () => {
  renderPage(
    <EventDetailPage
      {...props}
      endDate={subDays(new Date(), 100).toISOString()}
      notes="My Notes"
      videoRecording="My Video"
      presentation="My Presentation"
    />,
  );
  expect(
    screen.getByRole('heading', { name: 'Notes', level: 2 }),
  ).toBeVisible();
  expect(screen.getByText('My Video')).toBeVisible();
  expect(screen.getByText('My Presentation')).toBeVisible();
});

it('renders calendar list when displayCalendar is true', () => {
  renderPage(
    <EventDetailPage
      {...props}
      displayCalendar
      calendar={{ ...createCalendarResponse(), name: 'Event Calendar' }}
    />,
  );
  expect(screen.getByText('Event Calendar')).toBeInTheDocument();
});

it('renders related research when there are items to display', () => {
  renderPage(
    <EventDetailPage
      {...props}
      relatedResearch={[
        {
          id: '123',
          title: 'My Research',
          type: '3D Printing',
          documentType: 'Article',
          teams: [],
          workingGroups: [],
        },
      ]}
    />,
  );
  expect(screen.getByText('My Research')).toBeVisible();
});

it('renders related tutorials when there are items to display', () => {
  renderPage(
    <EventDetailPage
      {...props}
      relatedTutorials={[
        {
          title: 'Tutorial1',
          id: 'tutorial-1',
          created: new Date(2003, 1, 1, 1).toISOString(),
        },
      ]}
    />,
  );
  expect(screen.getByText('Related Tutorials')).toBeVisible();
  expect(screen.getByText(/Tutorial1/i)).toBeVisible();
});

it('renders the children', () => {
  renderPage(<EventDetailPage {...props}>Children</EventDetailPage>);
  expect(screen.getByText('Children')).toBeVisible();
});

it('renders the footer cta only when the event has not finished', () => {
  const { rerender } = renderPage(
    <EventDetailPage {...props} hasFinished={false} />,
  );
  expect(screen.getByText('Contact tech support')).toBeVisible();

  rerender(
    <MemoryRouter>
      <EventDetailPage {...props} hasFinished />
    </MemoryRouter>,
  );
  expect(screen.queryByText('Contact tech support')).not.toBeInTheDocument();
});
