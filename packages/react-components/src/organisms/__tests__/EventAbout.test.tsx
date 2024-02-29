import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createEventResponse } from '@asap-hub/fixtures';
import { addDays, subDays } from 'date-fns';

import EventAbout from '../EventAbout';

const props: ComponentProps<typeof EventAbout> = {
  ...createEventResponse(),
  tags: [],
  endDate: addDays(new Date(), 1).toISOString(),
};

it('renders the event description', () => {
  const { getByText } = render(
    <EventAbout {...props} description={'<p>description</p>'} />,
  );
  expect(getByText(/About/i)).toBeVisible();
  expect(getByText('description')).toBeVisible();
});
it('omits the event description if empty', () => {
  const { queryByText } = render(
    <EventAbout {...props} description={undefined} />,
  );
  expect(queryByText(/About/i)).not.toBeInTheDocument();
});
it('collapses the event description after the event', () => {
  const { queryByText } = render(
    <EventAbout
      {...props}
      description={undefined}
      endDate={subDays(new Date(), 1).toISOString()}
    />,
  );
  expect(queryByText(/About/i)).not.toBeInTheDocument();
});

it('renders the event tags', () => {
  const { getByText } = render(<EventAbout {...props} tags={['Tag A']} />);
  expect(getByText(/tags/i)).toBeVisible();
  expect(getByText('Tag A')).toBeVisible();
});
it('omits the event tags of empty', () => {
  const { queryByText } = render(<EventAbout {...props} tags={[]} />);
  expect(queryByText(/tags/i)).not.toBeInTheDocument();
});
