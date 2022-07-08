import { StaticRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { network } from '@asap-hub/routing';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import MainNavigation from '../MainNavigation';

it('renders the navigation items', () => {
  const { getAllByRole } = render(<MainNavigation userOnboarded={true} />);
  expect(
    getAllByRole('listitem').map((item) => {
      expect(item).toHaveStyle('opacity:');
      return item.textContent;
    }),
  ).toEqual([
    expect.stringMatching(/network/i),
    expect.stringMatching(/research/i),
    expect.stringMatching(/calendar/i),
    expect.stringMatching(/discover/i),
    expect.stringMatching(/news/i),
  ]);
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
      <StaticRouter key={2} location={network({}).groups({}).$}>
        <MainNavigation userOnboarded={true} />
      </StaticRouter>,
    );
    expect(
      findParentWithStyle(getByTitle(/network/i), 'backgroundColor')
        ?.backgroundColor,
    ).toMatchInlineSnapshot(`"rgba(122, 210, 169, 0.18)"`);
  });

  it('is disabled when the current user is not onboarded', () => {
    const { getAllByRole } = render(<MainNavigation userOnboarded={false} />);

    getAllByRole('listitem').map((item) =>
      expect(item).toHaveStyle('opacity: 0,3'),
    );
  });
});
