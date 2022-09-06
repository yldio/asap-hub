import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { createEventResponse } from '@asap-hub/fixtures';

import PastEventsDashboardCard from '../PastEventsDashboardCard';

const props: ComponentProps<typeof PastEventsDashboardCard> = {
  events: [],
};

it('renders an event', () => {
  render(
    <PastEventsDashboardCard
      {...props}
      events={[
        {
          ...createEventResponse({}),
          id: 'example',
          title: 'An Event',
          startDate: new Date('1/1/1999').toISOString(),
          presentation: null,
          videoRecording: '<h1>video</h1>',
          notes: undefined,
        },
      ]}
    />,
  );
  expect(screen.getByText('An Event').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/example/),
  );
  expect(screen.getByText('No presentations')).toBeVisible();
  expect(screen.getByText('Videos')).toBeVisible();
  expect(screen.getByText('Notes coming soon')).toBeVisible();
  expect(screen.getByText('FRI, 1 JAN 1999')).toBeVisible();
});
