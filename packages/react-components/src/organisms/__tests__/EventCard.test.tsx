import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createEventResponse } from '@asap-hub/fixtures';

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
