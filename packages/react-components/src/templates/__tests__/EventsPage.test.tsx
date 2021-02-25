import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import EventsPage from '../EventsPage';

const props: ComponentProps<typeof EventsPage> = {
  calendarHref: '',
  upcomingHref: '',
};

it('renders the header', () => {
  const { getByRole } = render(<EventsPage {...props} />);
  expect(getByRole('heading')).toBeVisible();
});

it('renders the children', () => {
  const { getByText } = render(<EventsPage {...props}>Content</EventsPage>);
  expect(getByText('Content')).toBeVisible();
});
