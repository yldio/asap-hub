import { StaticRouter } from 'react-router-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { network } from '@asap-hub/routing';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import MainNavigation from '../MainNavigation';

it('renders the navigation items without projects', () => {
  const { getAllByRole } = render(
    <MemoryRouter>
      <MainNavigation userOnboarded={true} />
    </MemoryRouter>,
  );

  expect(
    getAllByRole('listitem').map((item) => {
      expect(item).toHaveStyle('opacity:');
      return item.textContent;
    }),
  ).toEqual([
    expect.stringMatching(/network/i),
    expect.stringMatching(/research/i),
    expect.stringMatching(/calendar/i),
    expect.stringMatching(/news/i),
    expect.stringMatching(/guides/i),
    expect.stringMatching(/about/i),
  ]);
});

it('renders the navigation items with projects when flag is enabled', () => {
  const { getAllByRole } = render(
    <MemoryRouter>
      <MainNavigation userOnboarded={true} canViewProjects={true} />
    </MemoryRouter>,
  );

  expect(
    getAllByRole('listitem').map((item) => {
      expect(item).toHaveStyle('opacity:');
      return item.textContent;
    }),
  ).toEqual([
    expect.stringMatching(/network/i),
    expect.stringMatching(/projects/i),
    expect.stringMatching(/research/i),
    expect.stringMatching(/calendar/i),
    expect.stringMatching(/news/i),
    expect.stringMatching(/guides/i),
    expect.stringMatching(/about/i),
  ]);
});

it('renders the analytics menu item when allowed', () => {
  const { getByTitle } = render(
    <MemoryRouter>
      <MainNavigation userOnboarded={true} canViewAnalytics={true} />
    </MemoryRouter>,
  );
  expect(getByTitle(/analytics/i)).toBeInTheDocument();
});

describe('a navigation item', () => {
  it('is highlighted when it links to the current page', () => {
    const { getByTitle, rerender } = render(
      <StaticRouter key={1} location="/somewhere-else">
        <MainNavigation userOnboarded={true} canViewProjects={true} />
      </StaticRouter>,
    );
    expect(
      findParentWithStyle(getByTitle(/network/i), 'backgroundColor')
        ?.backgroundColor,
    ).toBeFalsy();

    rerender(
      <StaticRouter key={2} location={network({}).$}>
        <MainNavigation userOnboarded={true} canViewProjects={true} />
      </StaticRouter>,
    );
    expect(
      findParentWithStyle(getByTitle(/network/i), 'backgroundColor')
        ?.backgroundColor,
    ).toMatchInlineSnapshot(`"rgba(122, 210, 169, 0.18)"`);
  });

  it('is highlighted when the current page is in the section it links to', () => {
    const { getByTitle, rerender } = render(
      <StaticRouter key={1} location="/somewhere-else">
        <MainNavigation userOnboarded={true} canViewProjects={true} />
      </StaticRouter>,
    );
    expect(
      findParentWithStyle(getByTitle(/network/i), 'backgroundColor')
        ?.backgroundColor,
    ).toBeFalsy();

    rerender(
      <StaticRouter key={2} location={network({}).interestGroups({}).$}>
        <MainNavigation userOnboarded={true} canViewProjects={true} />
      </StaticRouter>,
    );
    expect(
      findParentWithStyle(getByTitle(/network/i), 'backgroundColor')
        ?.backgroundColor,
    ).toMatchInlineSnapshot(`"rgba(122, 210, 169, 0.18)"`);
  });

  it('is disabled when the current user is not onboarded', () => {
    const { getAllByRole } = render(
      <MemoryRouter>
        <MainNavigation userOnboarded={false} canViewProjects={true} />
      </MemoryRouter>,
    );

    getAllByRole('listitem').map((item) =>
      expect(item).toHaveStyle('opacity: 0,3'),
    );
  });
});
