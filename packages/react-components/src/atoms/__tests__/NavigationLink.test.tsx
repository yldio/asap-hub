import { render, fireEvent } from '@testing-library/react';
import { StaticRouter, Router } from 'react-router-dom';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';
import { createMemoryHistory } from 'history';

import NavigationLink from '../NavigationLink';

describe.each`
  description           | wrapper
  ${'with a router'}    | ${StaticRouter}
  ${'without a router'} | ${undefined}
`('$description', ({ wrapper }) => {
  it('renders a link with the given text', () => {
    const { getByRole } = render(
      <NavigationLink href="/" icon={<svg />}>
        Text
      </NavigationLink>,
      { wrapper },
    );
    expect(getByRole('link')).toHaveTextContent('Text');
  });

  it('renders a link with the given icon', () => {
    const { getByRole } = render(
      <NavigationLink href="/" icon={<svg />}>
        Text
      </NavigationLink>,
      { wrapper },
    );
    expect(getByRole('link')).toContainHTML('<svg');
  });

  it('renders a link with the given href', () => {
    const { getByRole } = render(
      <NavigationLink href="/" icon={<svg />}>
        Text
      </NavigationLink>,
      { wrapper },
    );
    expect(getByRole('link')).toHaveAttribute('href', '/');
  });

  it('renders the current link with green background', () => {
    const { getByText } = render(
      <>
        <NavigationLink href="/" icon={<svg />}>
          Target
        </NavigationLink>
        <NavigationLink href="/other" icon={<svg />}>
          Other
        </NavigationLink>
      </>,
      { wrapper },
    );
    expect(
      findParentWithStyle(getByText('Target'), 'backgroundColor')
        ?.backgroundColor,
    ).toMatch(/^rgba\(122/);
    expect(
      findParentWithStyle(getByText('Other'), 'backgroundColor')
        ?.backgroundColor,
    ).toBeFalsy();
  });
});

describe('with a router', () => {
  it('does not trigger a full page navigation on click', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    const { getByRole } = render(
      <Router history={history}>
        <NavigationLink href="/location" icon={<svg />}>
          Text
        </NavigationLink>
      </Router>,
    );
    expect(fireEvent.click(getByRole('link'))).toBe(false);
    expect(history.location.pathname).toEqual('/location');
  });

  it('triggers a full page navigation on click of an external link', () => {
    const { getByRole } = render(
      <NavigationLink href="http://example.com/" icon={<svg />}>
        Text
      </NavigationLink>,
    );
    expect(fireEvent.click(getByRole('link'))).toBe(true);
  });
});
