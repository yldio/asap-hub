import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import MainNavigation from '../MainNavigation';

it('renders the navigation items', () => {
  const { getAllByRole } = render(<MainNavigation />);
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual([
    expect.stringMatching(/network/i),
    expect.stringMatching(/research/i),
    expect.stringMatching(/news/i),
    expect.stringMatching(/calendar/i),
    expect.stringMatching(/discover/i),
  ]);
});

describe('Main Navigation shows correct active item when', () => {
  const renderWithLocation = (location: string) =>
    render(
      <StaticRouter location={location}>
        <MainNavigation />
      </StaticRouter>,
    );

  it('the location matches a menu item href path', () => {
    const { getByRole } = renderWithLocation('/network');

    const networkLink = getByRole('link', {
      name: /network/i,
    }) as HTMLAnchorElement;
    const researchLink = getByRole('link', {
      name: /research/i,
    }) as HTMLAnchorElement;
    const newsLink = getByRole('link', {
      name: /news/i,
    }) as HTMLAnchorElement;
    const calendarLink = getByRole('link', {
      name: /calendar/i,
    }) as HTMLAnchorElement;
    const discoverLink = getByRole('link', {
      name: /discover/i,
    }) as HTMLAnchorElement;

    expect(networkLink.classList.contains('active-link')).toBe(true);
    expect(researchLink.classList.contains('active-link')).toBe(false);
    expect(newsLink.classList.contains('active-link')).toBe(false);
    expect(calendarLink.classList.contains('active-link')).toBe(false);
    expect(discoverLink.classList.contains('active-link')).toBe(false);
  });

  it('the location matches a menu item href "CHILDS" path', () => {
    const { getByRole } = renderWithLocation(
      '/events/6021f36e-2931-418a-8179-f93c1e185772',
    );

    const networkLink = getByRole('link', {
      name: /network/i,
    }) as HTMLAnchorElement;
    const researchLink = getByRole('link', {
      name: /research/i,
    }) as HTMLAnchorElement;
    const newsLink = getByRole('link', { name: /news/i }) as HTMLAnchorElement;
    const calendarLink = getByRole('link', {
      name: /calendar/i,
    }) as HTMLAnchorElement;
    const discoverLink = getByRole('link', {
      name: /discover/i,
    }) as HTMLAnchorElement;

    expect(networkLink.classList.contains('active-link')).toBe(false);
    expect(researchLink.classList.contains('active-link')).toBe(false);
    expect(newsLink.classList.contains('active-link')).toBe(false);
    expect(calendarLink.classList.contains('active-link')).toBe(true);
    expect(discoverLink.classList.contains('active-link')).toBe(false);
  });

  it('the location DO NOT matches a menu item href path', () => {
    const { getByRole } = renderWithLocation('/');

    const networkLink = getByRole('link', {
      name: /network/i,
    }) as HTMLAnchorElement;
    const researchLink = getByRole('link', {
      name: /research/i,
    }) as HTMLAnchorElement;
    const newsLink = getByRole('link', { name: /news/i }) as HTMLAnchorElement;
    const calendarLink = getByRole('link', {
      name: /calendar/i,
    }) as HTMLAnchorElement;
    const discoverLink = getByRole('link', {
      name: /discover/i,
    }) as HTMLAnchorElement;

    expect(networkLink.classList.contains('active-link')).toBe(false);
    expect(researchLink.classList.contains('active-link')).toBe(false);
    expect(newsLink.classList.contains('active-link')).toBe(false);
    expect(calendarLink.classList.contains('active-link')).toBe(false);
    expect(discoverLink.classList.contains('active-link')).toBe(false);
  });
});
