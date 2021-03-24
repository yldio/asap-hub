import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { network } from '@asap-hub/routing';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

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

describe('a navigation item', () => {
  it('is highlighted when it links to the current page', () => {
    const { getByTitle, rerender } = render(
      <StaticRouter key={1} location="/somewhere-else">
        <MainNavigation />
      </StaticRouter>,
    );
    expect(
      findParentWithStyle(getByTitle(/network/i), 'backgroundColor')
        ?.backgroundColor,
    ).toBeFalsy();

    rerender(
      <StaticRouter key={2} location={network({}).$}>
        <MainNavigation />
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
        <MainNavigation />
      </StaticRouter>,
    );
    expect(
      findParentWithStyle(getByTitle(/network/i), 'backgroundColor')
        ?.backgroundColor,
    ).toBeFalsy();

    rerender(
      <StaticRouter key={2} location={network({}).groups({}).$}>
        <MainNavigation />
      </StaticRouter>,
    );
    expect(
      findParentWithStyle(getByTitle(/network/i), 'backgroundColor')
        ?.backgroundColor,
    ).toMatchInlineSnapshot(`"rgba(122, 210, 169, 0.18)"`);
  });
});
