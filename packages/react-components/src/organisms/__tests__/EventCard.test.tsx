import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { createEventResponse } from '@asap-hub/fixtures';
import { addMinutes, subDays, subMinutes, addDays } from 'date-fns';

import EventCard from '../EventCard';

const props: ComponentProps<typeof EventCard> = {
  ...createEventResponse(),
  hasSpeakersToBeAnnounced: false,
  eventOwner: <div>ASAP Team</div>,
  tags: [],
};
it('shows that an event has been cancelled', () => {
  const { getByTitle, getByText, queryByTitle, queryByText, rerender } = render(
    <EventCard {...props} status="Confirmed" />,
  );
  expect(queryByTitle('Error Icon')).not.toBeInTheDocument();
  expect(queryByText(/cancelled/i)).not.toBeInTheDocument();

  rerender(<EventCard {...props} status="Cancelled" />);
  expect(getByTitle('Error Icon')).toBeInTheDocument();
  expect(getByText(/cancelled/i)).toBeVisible();
});

it('renders the event tags', () => {
  render(<EventCard {...props} tags={['MyTag']} />);
  expect(screen.getByText('MyTag')).toBeVisible();
});

describe('current events', () => {
  it('does not show attachments while event is occurring', () => {
    render(
      <EventCard
        {...props}
        status="Confirmed"
        meetingLink={undefined}
        presentation="123"
        startDate={subMinutes(new Date(), 1).toISOString()}
        endDate={addMinutes(new Date(), 1).toISOString()}
      />,
    );
    expect(screen.getByText(/currently happening/i)).toBeVisible();
    expect(screen.queryByTitle(/paper/i)).not.toBeInTheDocument();
  });

  it('shows cancelled while event is occurring', () => {
    render(
      <EventCard
        {...props}
        status="Cancelled"
        startDate={subMinutes(new Date(), 1).toISOString()}
        endDate={addMinutes(new Date(), 1).toISOString()}
      />,
    );
    expect(screen.getByTitle('Error Icon')).toBeInTheDocument();
    expect(screen.getByText(/cancelled/i)).toBeVisible();
  });
  it('toasts for meetings without meeting link', () => {
    render(
      <EventCard
        {...props}
        status="Confirmed"
        meetingLink={undefined}
        startDate={subMinutes(new Date(), 1).toISOString()}
        endDate={addMinutes(new Date(), 1).toISOString()}
      />,
    );
    expect(screen.getByText(/currently happening/i)).toBeVisible();
  });
  it('toasts for meetings with meeting link', () => {
    render(
      <EventCard
        {...props}
        status="Confirmed"
        meetingLink="http://example.com"
        startDate={subMinutes(new Date(), 1).toISOString()}
        endDate={addMinutes(new Date(), 1).toISOString()}
      />,
    );
    expect(screen.getByText(/currently live/i)).toBeVisible();
    expect(screen.getByText(/join/i).closest('a')).toHaveAttribute(
      'href',
      'http://example.com',
    );
  });

  it('hides the meeting link when hideMeetingLink is set to true', () => {
    render(
      <EventCard
        {...props}
        meetingLink="http://example.com"
        hideMeetingLink={true}
      />,
    );

    expect(screen.queryByText(/join/i)).toBeNull();
  });
  it('toasts for meetings with speakers to be announced', () => {
    render(
      <EventCard
        {...props}
        hasSpeakersToBeAnnounced
        startDate={addMinutes(new Date(), 30).toISOString()}
      />,
    );

    expect(
      screen.queryByText(/more speakers to be announced/i),
    ).toBeInTheDocument();
  });
});

describe('past events', () => {
  it('shows cancelled over materials', () => {
    render(
      <EventCard
        {...props}
        status="Cancelled"
        presentation="132"
        startDate={subDays(new Date(), 2).toISOString()}
        endDate={subDays(new Date(), 1).toISOString()}
      />,
    );
    expect(screen.getByTitle(/error icon/i)).toBeInTheDocument();
    expect(screen.getByText(/cancelled/i)).toBeVisible();
  });
  it('toasts meeting materials coming soon', () => {
    render(
      <EventCard
        {...props}
        status="Confirmed"
        meetingLink="http://example.com"
        meetingMaterials={[]}
        presentation={undefined}
        notes={undefined}
        videoRecording={undefined}
        startDate={subDays(new Date(), 2).toISOString()}
        endDate={subDays(new Date(), 1).toISOString()}
      />,
    );
    expect(screen.getByText(/coming soon/i)).toBeVisible();
    expect(screen.getByTitle(/paper/i)).toBeInTheDocument();
  });
  it('toasts number of available materials', () => {
    render(
      <EventCard
        {...props}
        status="Confirmed"
        meetingLink="http://example.com"
        meetingMaterials={[
          { title: '123', url: 'http://example.com' },
          { title: '345', url: 'http://example.com' },
        ]}
        presentation={'presentation'}
        notes={undefined}
        videoRecording={undefined}
        startDate={subDays(new Date(), 2).toISOString()}
        endDate={subDays(new Date(), 1).toISOString()}
      />,
    );
    expect(screen.getByText(/materials \(3\)/i)).toBeVisible();
    expect(screen.getByTitle(/paper/i)).toBeInTheDocument();
  });

  it('toasts no materials are available', () => {
    render(
      <EventCard
        {...props}
        status="Confirmed"
        meetingLink="http://example.com"
        meetingMaterials={null}
        presentation={null}
        notes={null}
        videoRecording={null}
        startDate={subDays(new Date(), 2).toISOString()}
        endDate={subDays(new Date(), 1).toISOString()}
      />,
    );
    expect(screen.getByText(/no meeting materials/i)).toBeVisible();
    expect(screen.getByTitle(/paper/i)).toBeInTheDocument();
  });

  it("doesn't display toast if none of the conditions are match", () => {
    render(
      <EventCard
        {...props}
        endDate={addDays(new Date(), 1).toISOString()}
        startDate={addDays(new Date(), 2).toISOString()}
      />,
    );

    expect(screen.queryByText(/to be announced/)).not.toBeInTheDocument();
    expect(screen.queryByText(/cancelled/)).not.toBeInTheDocument();
    expect(screen.queryByText(/currently live/)).not.toBeInTheDocument();
    expect(screen.queryByText(/currently happening/)).not.toBeInTheDocument();
  });
});
