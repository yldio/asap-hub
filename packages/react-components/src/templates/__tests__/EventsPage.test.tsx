import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import EventsPage from '../EventsPage';

const props: ComponentProps<typeof EventsPage> = {
  calendarHref: '',
  upcomingHref: '',
};

it('renders the header', () => {
  const { getByRole } = render(<EventsPage {...props} />);
  expect(getByRole('heading', { level: 1 })).toHaveTextContent(
    'Calendar and Events',
  );
});

it('renders the children', () => {
  const { getByText } = render(<EventsPage {...props}>Content</EventsPage>);
  expect(getByText('Content')).toBeVisible();
});
