import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { createEventResponse } from '@asap-hub/fixtures';

import EventInfo from '../EventInfo';

jest.mock('../../localization');

const eventOwner = <div>ASAP Team</div>;
const props: ComponentProps<typeof EventInfo> = {
  ...createEventResponse(),
  tags: [],
  eventOwner,
};

it('renders an event', () => {
  render(<EventInfo {...props} title="My Event" />);
  expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
    'My Event',
  );
});

it('truncates long event titles', () => {
  render(<EventInfo {...props} title={'blablablha'.repeat(100)} />);

  expect(screen.getByRole('heading', { level: 3 }).textContent).toMatch(/…$/i);
});

it('does not truncate long event titles when limit is null', () => {
  render(
    <EventInfo {...props} titleLimit={null} title={'blablablha'.repeat(100)} />,
  );

  expect(screen.getByRole('heading', { level: 3 }).textContent).not.toMatch(
    /…$/i,
  );
});

it('renders event thumbnail', () => {
  render(
    <EventInfo
      {...props}
      thumbnail={'https://placeholder/40x40'}
      title={'blablablha'}
    />,
  );

  expect(screen.getByAltText(/thumbnail/i).getAttribute('src')).toEqual(
    'https://placeholder/40x40',
  );
});

it('renders placeholder event thumbnail', () => {
  render(
    <EventInfo
      {...props}
      thumbnail={undefined}
      title={'blablablha'.repeat(100)}
    />,
  );

  expect(screen.getByText(/placeholder/i)).toBeInTheDocument();
});

it('shows the event time', () => {
  render(
    <EventInfo
      {...props}
      startDate="2021-01-01T08:00:00Z"
      startDateTimeZone="Europe/Tallinn"
    />,
  );
  expect(screen.getByText(/8:00/)).toBeVisible();
});

it('only links to events that are not cancelled', () => {
  const { rerender } = render(
    <EventInfo {...props} title="My Event" status="Tentative" />,
  );
  expect(screen.getByText(/My Event/).closest('a')).toHaveAttribute('href');

  rerender(<EventInfo {...props} title="My Event" status="Cancelled" />);
  expect(screen.getByText(/My Event/).closest('a')).toBeNull();
});

it('displays the tags', () => {
  render(<EventInfo {...props} tags={['one tag']} />);

  expect(screen.getByText(/one tag/i)).toBeInTheDocument();
});
