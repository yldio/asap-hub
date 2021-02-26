import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createEventResponse } from '@asap-hub/fixtures';

import EventDescription from '../EventDescription';

jest.mock('../../localization');

const props: ComponentProps<typeof EventDescription> = {
  ...createEventResponse(),
};

it('renders event description', () => {
  const { getByRole, getByText } = render(
    <EventDescription {...props} description={'<p>description</p>'} />,
  );
  expect(getByRole('heading', { level: 4 })).toHaveTextContent(
    'About this event',
  );
  expect(getByText(/description/i)).toBeInTheDocument();
});

it('renders event tags', () => {
  const { getByRole } = render(
    <EventDescription {...props} tags={['a', 'b']} />,
  );
  expect(getByRole('heading', { level: 4 })).toHaveTextContent('Event tags');
});
