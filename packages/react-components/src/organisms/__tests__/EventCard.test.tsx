import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createEventResponse } from '@asap-hub/fixtures';
import { addMinutes, subDays, subMinutes } from 'date-fns';

import EventCard from '../EventCard';

const props: ComponentProps<typeof EventCard> = {
  ...createEventResponse(),
  group: undefined,
  tags: [],
};
it('shows that an event has been cancelled', () => {
  const { getByTitle, getByText, queryByTitle, queryByText, rerender } = render(
    <EventCard {...props} status="Confirmed" />,
  );
  expect(queryByTitle('Alert')).not.toBeInTheDocument();
  expect(queryByText(/cancelled/i)).not.toBeInTheDocument();

  rerender(<EventCard {...props} status="Cancelled" />);
  expect(getByTitle('Alert')).toBeInTheDocument();
  expect(getByText(/cancelled/i)).toBeVisible();
});

it('renders the event tags', () => {
  const { getByText } = render(<EventCard {...props} tags={['MyTag']} />);
  expect(getByText('MyTag')).toBeVisible();
});

describe('current events', () => {
  it('does not show attachments while event is occurring', () => {
    const { getByText, queryByTitle } = render(
      <EventCard
        {...props}
        status="Confirmed"
        meetingLink={undefined}
        presentation="123"
        startDate={subMinutes(new Date(), 1).toISOString()}
        endDate={addMinutes(new Date(), 1).toISOString()}
      />,
    );
    expect(getByText(/currently happening/i)).toBeVisible();
    expect(queryByTitle(/paper/i)).not.toBeInTheDocument();
  });

  it('shows cancelled while event is occurring', () => {
    const { getByText, getByTitle } = render(
      <EventCard
        {...props}
        status="Cancelled"
        startDate={subMinutes(new Date(), 1).toISOString()}
        endDate={addMinutes(new Date(), 1).toISOString()}
      />,
    );
    expect(getByTitle('Alert')).toBeInTheDocument();
    expect(getByText(/cancelled/i)).toBeVisible();
  });
  it('toasts for meetings without meeting link', () => {
    const { getByText, getByTitle } = render(
      <EventCard
        {...props}
        status="Confirmed"
        meetingLink={undefined}
        startDate={subMinutes(new Date(), 1).toISOString()}
        endDate={addMinutes(new Date(), 1).toISOString()}
      />,
    );
    expect(getByText(/currently happening/i)).toBeVisible();
    expect(getByTitle(/clock/i)).toBeInTheDocument();
  });
  it('toasts for meetings with meeting link', () => {
    const { getByText, getByTitle } = render(
      <EventCard
        {...props}
        status="Confirmed"
        meetingLink="http://example.com"
        startDate={subMinutes(new Date(), 1).toISOString()}
        endDate={addMinutes(new Date(), 1).toISOString()}
      />,
    );
    expect(getByText(/currently happening/i)).toBeVisible();
    expect(getByTitle(/clock/i)).toBeInTheDocument();
    expect(getByText(/join/i)).toHaveAttribute('href', 'http://example.com');
  });
});

describe('past events', () => {
  it('shows cancelled over materials', () => {
    const { getByText, getByTitle } = render(
      <EventCard
        {...props}
        status="Cancelled"
        presentation="132"
        startDate={subDays(new Date(), 2).toISOString()}
        endDate={subDays(new Date(), 1).toISOString()}
      />,
    );
    expect(getByTitle(/alert/i)).toBeInTheDocument();
    expect(getByText(/cancelled/i)).toBeVisible();
  });
  it('toasts meeting materials coming soon', () => {
    const { getByText, getByTitle } = render(
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
    expect(getByText(/coming soon/i)).toBeVisible();
    expect(getByTitle(/paper/i)).toBeInTheDocument();
  });
  it('toasts number of available materials', () => {
    const { getByText, getByTitle } = render(
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
    expect(getByText(/materials \(3\)/i)).toBeVisible();
    expect(getByTitle(/paper/i)).toBeInTheDocument();
  });

  it('toasts no materials are available', () => {
    const { getByText, getByTitle } = render(
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
    expect(getByText(/no meeting materials/i)).toBeVisible();
    expect(getByTitle(/paper/i)).toBeInTheDocument();
  });
});
