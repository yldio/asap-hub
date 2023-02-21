import { ComponentProps } from 'react';
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
          title: 'FirstEvent',
          eventOwner: <div>ASAP Team</div>,
          hasSpeakersToBeAnnounced: false,
        },
        {
          ...createEventResponse({}, 1),
          title: 'SecondEvent',
          eventOwner: <div>ASAP Team</div>,
          hasSpeakersToBeAnnounced: false,
        },
      ])}
    />,
  );
  expect(getAllByRole('heading').map(({ textContent }) => textContent)).toEqual(
    ['FirstEvent', 'SecondEvent'],
  );
});
