import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { disable } from '@asap-hub/flags';

import MainNavigation from '../MainNavigation';

const props: ComponentProps<typeof MainNavigation> = {
  discoverAsapHref: '/discover',
  networkHref: '/network',
  sharedResearchHref: '/shared-research',
  newsAndEventsHref: '/news-and-events',
  eventsHref: '/events',
};

it('does not render a calendar navigation items (REGRESSION)', () => {
  disable('EVENTS_PAGE');
  const { getAllByRole } = render(<MainNavigation {...props} />);
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual([
    expect.stringMatching(/network/i),
    expect.stringMatching(/research/i),
    expect.stringMatching(/news and events/i),
    expect.stringMatching(/discover/i),
  ]);
});

it('renders the navigation items', () => {
  const { getAllByRole } = render(<MainNavigation {...props} />);
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual([
    expect.stringMatching(/network/i),
    expect.stringMatching(/research/i),
    expect.stringMatching(/news/i) && expect.not.stringMatching(/events/i),
    expect.stringMatching(/calendar/i),
    expect.stringMatching(/discover/i),
  ]);
});

it('applies the passed href', () => {
  const { getAllByRole } = render(
    <MainNavigation {...props} networkHref="/network" />,
  );
  expect(
    getAllByRole('link').find(({ textContent }) =>
      /network/i.test(textContent ?? ''),
    ),
  ).toHaveAttribute('href', '/network');
});
