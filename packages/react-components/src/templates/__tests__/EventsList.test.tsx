import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createEventResponse } from '@asap-hub/fixtures';

import EventsList from '../EventsList';

const props = (
  events: ComponentProps<typeof EventsList>['events'],
): ComponentProps<typeof EventsList> => ({
  events,
  numberOfItems: events.length,
  numberOfPages: 1,
  currentPageIndex: 0,
  renderPageHref: (index) => `#${index}`,
});

it('renders multiple event cards', () => {
  const { getAllByRole } = render(
    <EventsList
      {...props([
        {
          ...createEventResponse({}, 0),
          href: '',
          title: 'FirstEvent',
          groups: [],
        },
        {
          ...createEventResponse({}, 1),
          href: '',
          title: 'SecondEvent',
          groups: [],
        },
      ])}
    />,
  );
  expect(
    getAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(['FirstEvent', 'SecondEvent']);
});

it('only links to events that are not cancelled', () => {
  const { getByRole } = render(
    <EventsList
      {...props([
        {
          ...createEventResponse({}, 0),
          href: 'http://example.com',
          title: 'FirstEvent',
          groups: [],
        },
        {
          ...createEventResponse({}, 1),
          href: 'http://example.com',
          title: 'SecondEvent',
          groups: [],
          status: 'Cancelled',
        },
      ])}
    />,
  );
  expect(
    getByRole('heading', { name: 'FirstEvent' }).closest('a'),
  ).toHaveAttribute('href', 'http://example.com');
  expect(
    getByRole('heading', { name: 'SecondEvent' }).closest('a'),
  ).not.toHaveAttribute('href');
});
