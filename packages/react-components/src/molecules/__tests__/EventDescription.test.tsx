import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createEventResponse } from '@asap-hub/fixtures';

import EventDescription from '../EventDescription';

const props: ComponentProps<typeof EventDescription> = {
  ...createEventResponse(),
};

it('renders event description', () => {
  const { getByRole, getByText } = render(
    <EventDescription
      {...props}
      tags={[]}
      description={'<p>description</p>'}
    />,
  );
  expect(getByRole('heading', { level: 2 })).toHaveTextContent(
    'About this event',
  );
  expect(getByText(/description/i)).toBeInTheDocument();
});

it('renders event tags', () => {
  const { getByRole } = render(
    <EventDescription {...props} description={undefined} tags={['a', 'b']} />,
  );
  expect(getByRole('heading', { level: 2 })).toHaveTextContent('Event tags');
});
