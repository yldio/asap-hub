import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import NewsAndEventsPage from '../NewsAndEventsPage';

const props: ComponentProps<typeof NewsAndEventsPage> = {};

it('renders the header', () => {
  const { getByRole } = render(
    <NewsAndEventsPage {...props}>Content</NewsAndEventsPage>,
  );
  expect(getByRole('heading')).toBeVisible();
});

it('renders the children', () => {
  const { getByText } = render(
    <NewsAndEventsPage {...props}>Content</NewsAndEventsPage>,
  );
  expect(getByText('Content')).toBeVisible();
});
