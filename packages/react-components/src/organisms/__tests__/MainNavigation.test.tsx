import { StaticRouter, MemoryRouter } from 'react-router';
import { render, fireEvent } from '@testing-library/react';
import { network } from '@asap-hub/routing';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import MainNavigation from '../MainNavigation';
import { charcoal } from '../../colors';

it('renders the navigation items', () => {
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
        <MainNavigation userOnboarded={true} />
      </StaticRouter>,
    );
    expect(
      findParentWithStyle(getByTitle(/network/i), 'backgroundColor')
        ?.backgroundColor,
    ).toBeFalsy();

    rerender(
      <StaticRouter key={2} location={network({}).$}>
        <MainNavigation userOnboarded={true} />
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
        <MainNavigation userOnboarded={true} />
      </StaticRouter>,
    );
    expect(
      findParentWithStyle(getByTitle(/network/i), 'backgroundColor')
        ?.backgroundColor,
    ).toBeFalsy();

    rerender(
      <StaticRouter key={2} location={network({}).interestGroups({}).$}>
        <MainNavigation userOnboarded={true} />
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
        <MainNavigation userOnboarded={false} />
      </MemoryRouter>,
    );

    getAllByRole('listitem').map((item) =>
      expect(item).toHaveStyle('opacity: 0,3'),
    );
  });

  it('stays highlighted for the active route when collapsed', () => {
    const { getByTitle } = render(
      <StaticRouter location={network({}).$}>
        <MainNavigation userOnboarded={true} collapsed />
      </StaticRouter>,
    );
    expect(
      findParentWithStyle(getByTitle(/network/i), 'backgroundColor')
        ?.backgroundColor,
    ).toMatchInlineSnapshot(`"rgba(122, 210, 169, 0.18)"`);
  });
});

describe('the collapse toggle', () => {
  // The toggle only renders at desktop widths (display:none below), so role
  // queries must opt in to hidden elements under jsdom's no-media-query DOM.
  it('is not rendered without an onToggleCollapse handler', () => {
    const { queryByRole } = render(
      <MemoryRouter>
        <MainNavigation userOnboarded={true} />
      </MemoryRouter>,
    );
    expect(queryByRole('button', { hidden: true })).not.toBeInTheDocument();
  });

  it('shows a Collapse Menu control when expanded', () => {
    const onToggleCollapse = jest.fn();
    const { getByRole } = render(
      <MemoryRouter>
        <MainNavigation
          userOnboarded={true}
          onToggleCollapse={onToggleCollapse}
        />
      </MemoryRouter>,
    );
    const button = getByRole('button', {
      name: 'Collapse Menu',
      hidden: true,
    });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(button);
    expect(onToggleCollapse).toHaveBeenCalledTimes(1);
  });

  it('shows an Expand Menu control when collapsed', () => {
    const onToggleCollapse = jest.fn();
    const { getByRole } = render(
      <MemoryRouter>
        <MainNavigation
          userOnboarded={true}
          collapsed
          onToggleCollapse={onToggleCollapse}
        />
      </MemoryRouter>,
    );
    const button = getByRole('button', { name: 'Expand Menu', hidden: true });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);
    expect(onToggleCollapse).toHaveBeenCalledTimes(1);
  });

  it('is disabled and cannot collapse while the menu is not ready', () => {
    const onToggleCollapse = jest.fn();
    const { getByRole } = render(
      <MemoryRouter>
        <MainNavigation
          userOnboarded={false}
          onToggleCollapse={onToggleCollapse}
        />
      </MemoryRouter>,
    );
    const button = getByRole('button', { hidden: true });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onToggleCollapse).not.toHaveBeenCalled();
  });

  it('uses the sidebar label colour in both states', () => {
    const { getByRole, rerender } = render(
      <MemoryRouter>
        <MainNavigation userOnboarded={true} onToggleCollapse={jest.fn()} />
      </MemoryRouter>,
    );
    // charcoal, matching the other sidebar labels (not the lighter lead grey).
    expect(
      getByRole('button', { name: 'Collapse Menu', hidden: true }),
    ).toHaveStyle(`color: ${charcoal.rgb}`);

    rerender(
      <MemoryRouter>
        <MainNavigation
          userOnboarded={true}
          collapsed
          onToggleCollapse={jest.fn()}
        />
      </MemoryRouter>,
    );
    expect(
      getByRole('button', { name: 'Expand Menu', hidden: true }),
    ).toHaveStyle(`color: ${charcoal.rgb}`);
  });

  it('keeps the toggle left-aligned in both states so the icon never shifts', () => {
    const { getByRole, rerender } = render(
      <MemoryRouter>
        <MainNavigation userOnboarded={true} onToggleCollapse={jest.fn()} />
      </MemoryRouter>,
    );
    expect(
      getByRole('button', { name: 'Collapse Menu', hidden: true }),
    ).toHaveStyle('justify-content: flex-start');

    rerender(
      <MemoryRouter>
        <MainNavigation
          userOnboarded={true}
          collapsed
          onToggleCollapse={jest.fn()}
        />
      </MemoryRouter>,
    );
    // Same alignment collapsed — the icon column position never changes.
    expect(
      getByRole('button', { name: 'Expand Menu', hidden: true }),
    ).toHaveStyle('justify-content: flex-start');
  });

  it('shows a tooltip on the collapsed toggle, like the nav items', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <MainNavigation
          userOnboarded={true}
          collapsed
          onToggleCollapse={jest.fn()}
        />
      </MemoryRouter>,
    );
    const toggle = getByRole('button', { name: 'Expand Menu', hidden: true });
    expect(toggle.querySelector('[role="tooltip"]')?.textContent).toBe(
      'Expand Menu',
    );
  });
});

describe('a collapsed navigation item', () => {
  it('renders a tooltip with the item label', () => {
    const { getAllByRole } = render(
      <MemoryRouter>
        <MainNavigation userOnboarded={true} collapsed />
      </MemoryRouter>,
    );
    const tooltips = getAllByRole('tooltip', { hidden: true }).map(
      (t) => t.textContent,
    );
    expect(tooltips).toEqual(
      expect.arrayContaining([
        'Network',
        'Projects',
        'Shared Research',
        'Calendar & Events',
        'News',
        'Guides & Tutorials',
        'About ASAP',
      ]),
    );
  });
});

describe('while the menu is animating open', () => {
  // Labels are kept in the collapsed (icon-only) layout until the rail reaches
  // full width, so they can't wrap inside a not-yet-full-width column.
  it('keeps labels hidden even though the menu is expanded', () => {
    const { queryAllByRole, rerender } = render(
      <MemoryRouter>
        <MainNavigation userOnboarded={true} collapsed={false} animating />
      </MemoryRouter>,
    );
    // The icon-only layout renders a tooltip span per item (label hidden).
    expect(queryAllByRole('tooltip', { hidden: true }).length).toBeGreaterThan(
      0,
    );

    // Once the animation finishes, labels are shown and the tooltip spans go.
    rerender(
      <MemoryRouter>
        <MainNavigation
          userOnboarded={true}
          collapsed={false}
          animating={false}
        />
      </MemoryRouter>,
    );
    expect(queryAllByRole('tooltip', { hidden: true })).toHaveLength(0);
  });
});
