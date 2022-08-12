import { render, fireEvent } from '@testing-library/react';
import { StaticRouter, Router } from 'react-router-dom';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';
import { createMemoryHistory } from 'history';
import { ThemeProvider } from '@emotion/react';

import NavigationLink from '../NavigationLink';
import { color, pine } from '../../colors';
import { activePrimaryBackgroundColorDefault } from '../../button';

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

  it('disables the current link when not enabled', () => {
    const { getByText } = render(
      <NavigationLink href="/location" icon={<svg />} enabled={false}>
        Target
      </NavigationLink>,
    );
    expect(getByText('Target')).toHaveStyle('opacity:0,3');
    expect(getByText('Target').closest('a')).toHaveStyle('pointer-events:none');
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

describe('with ThemeProvider', () => {
  it('uses default colors when no theme whas provided', () => {
    const { getByRole } = render(
      <NavigationLink href="http://example.com/" icon={<svg />}>
        Text
      </NavigationLink>,
    );
    const { color: primaryColor, backgroundColor } = getComputedStyle(
      getByRole('link'),
    );
    expect(primaryColor).toBe(pine.rgb);
    expect(backgroundColor).toBe(activePrimaryBackgroundColorDefault.rgba);
  });
  it('uses ThemeProvider theme primaryColor', () => {
    const activePrimaryBackgroundColor = color(230, 243, 249);
    const activePrimaryColor = color(0, 106, 146);
    const theme = {
      colors: {
        info100: activePrimaryBackgroundColor,
        info900: activePrimaryColor,
      },
    };
    const { getByRole } = render(
      <ThemeProvider theme={theme}>
        <NavigationLink href="http://example.com/" icon={<svg />}>
          Text
        </NavigationLink>
      </ThemeProvider>,
    );
    const { color: primaryColor, backgroundColor } = getComputedStyle(
      getByRole('link'),
    );
    expect(primaryColor).toBe(activePrimaryColor.rgb);
    expect(backgroundColor).toBe(activePrimaryBackgroundColor.rgb);
  });
});
