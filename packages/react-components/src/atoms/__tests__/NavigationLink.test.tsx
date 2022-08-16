import { findParentWithStyle } from '@asap-hub/dom-test-utils';
import { ThemeProvider } from '@emotion/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router, StaticRouter } from 'react-router-dom';
import { activePrimaryBackgroundColorDefault } from '../../button';
import { color, pine } from '../../colors';
import NavigationLink from '../NavigationLink';

describe.each`
  description           | wrapper
  ${'with a router'}    | ${StaticRouter}
  ${'without a router'} | ${undefined}
`('$description', ({ wrapper }) => {
  it('renders a link with the given text', () => {
    render(
      <NavigationLink href="/" icon={<svg />}>
        Text
      </NavigationLink>,
      { wrapper },
    );
    expect(screen.getByRole('link')).toHaveTextContent('Text');
  });

  it('renders a link with the given icon', () => {
    render(
      <NavigationLink href="/" icon={<svg />}>
        Text
      </NavigationLink>,
      { wrapper },
    );
    expect(screen.getByRole('link')).toContainHTML('<svg');
  });

  it('renders a link with the given href', () => {
    render(
      <NavigationLink href="/" icon={<svg />}>
        Text
      </NavigationLink>,
      { wrapper },
    );
    expect(screen.getByRole('link')).toHaveAttribute('href', '/');
  });

  it('renders the current link with green background', () => {
    render(
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
      findParentWithStyle(screen.getByText('Target'), 'backgroundColor')
        ?.backgroundColor,
    ).toMatch(/^rgba\(122/);
    expect(
      findParentWithStyle(screen.getByText('Other'), 'backgroundColor')
        ?.backgroundColor,
    ).toBeFalsy();
  });

  it('disables the current link when not enabled', () => {
    render(
      <NavigationLink href="/location" icon={<svg />} enabled={false}>
        Target
      </NavigationLink>,
    );
    expect(screen.getByText('Target')).toHaveStyle('opacity:0,3');
    expect(screen.getByText('Target').closest('a')).toHaveStyle(
      'pointer-events:none',
    );
  });
});

describe('with a router', () => {
  it('does not trigger a full page navigation on click', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <Router history={history}>
        <NavigationLink href="/location" icon={<svg />}>
          Text
        </NavigationLink>
      </Router>,
    );
    expect(fireEvent.click(screen.getByRole('link'))).toBe(false);
    expect(history.location.pathname).toEqual('/location');
  });

  it('triggers a full page navigation on click of an external link', () => {
    render(
      <NavigationLink href="http://example.com/" icon={<svg />}>
        Text
      </NavigationLink>,
    );
    expect(fireEvent.click(screen.getByRole('link'))).toBe(true);
  });

  it('default route is not always highlighted as selected', () => {
    const history = createMemoryHistory({ initialEntries: ['/location'] });
    render(
      <Router history={history}>
        <NavigationLink href="/" icon={<svg />}>
          Default
        </NavigationLink>
        <NavigationLink href="/other" icon={<svg />}>
          Other
        </NavigationLink>
        <NavigationLink href="/location" icon={<svg />}>
          Target
        </NavigationLink>
      </Router>,
    );
    expect(history.location.pathname).toEqual('/location');
    expect(
      findParentWithStyle(screen.getByText('Target'), 'backgroundColor')
        ?.backgroundColor,
    ).toMatch(/^rgba\(122/);
    expect(
      findParentWithStyle(screen.getByText('Other'), 'backgroundColor')
        ?.backgroundColor,
    ).toBeFalsy();
    expect(
      findParentWithStyle(screen.getByText('Default'), 'backgroundColor')
        ?.backgroundColor,
    ).toBeFalsy();
  });
});

describe('with ThemeProvider', () => {
  it('uses default colors when no theme whas provided', () => {
    render(
      <NavigationLink href="http://example.com/" icon={<svg />}>
        Text
      </NavigationLink>,
    );
    const { color: primaryColor, backgroundColor } = getComputedStyle(
      screen.getByRole('link'),
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
    render(
      <ThemeProvider theme={theme}>
        <NavigationLink href="http://example.com/" icon={<svg />}>
          Text
        </NavigationLink>
      </ThemeProvider>,
    );
    const { color: primaryColor, backgroundColor } = getComputedStyle(
      screen.getByRole('link'),
    );
    expect(primaryColor).toBe(activePrimaryColor.rgb);
    expect(backgroundColor).toBe(activePrimaryBackgroundColor.rgb);
  });
});
