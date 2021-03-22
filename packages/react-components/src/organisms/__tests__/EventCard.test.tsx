import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createEventResponse } from '@asap-hub/fixtures';
import { addMinutes, subDays, subMinutes } from 'date-fns';

import EventCard from '../EventCard';

const props: ComponentProps<typeof EventCard> = {
  ...createEventResponse(),
  groups: [],
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

describe('event is occurring', () => {
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
    expect(getByTitle('Clock')).toBeInTheDocument();
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
    expect(getByTitle('Clock')).toBeInTheDocument();
    expect(getByText(/join/i)).toHaveAttribute('href', 'http://example.com');
  });
});

describe('event is over', () => {
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
    expect(getByTitle('Paper Clip')).toBeInTheDocument();
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
    expect(getByText(/materials \(2\)/i)).toBeVisible();
    expect(getByTitle('Paper Clip')).toBeInTheDocument();
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
    expect(getByTitle('Paper Clip')).toBeInTheDocument();
  });
});
