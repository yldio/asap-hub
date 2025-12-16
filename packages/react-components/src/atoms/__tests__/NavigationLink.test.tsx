import { useEffect } from 'react';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';
import { ThemeProvider } from '@emotion/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { activePrimaryBackgroundColorDefault } from '../../button';
import { color, pine } from '../../colors';
import NavigationLink from '../NavigationLink';

// Helper to capture location in tests
let currentPathname: string | null = null;
const LocationCapture = () => {
  const location = useLocation();
  useEffect(() => {
    currentPathname = location.pathname;
  }, [location]);
  return null;
};

describe.each`
  description           | wrapper
  ${'with a router'}    | ${StaticRouter}
  ${'without a router'} | ${MemoryRouter}
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
    const Wrapper = wrapper;
    render(
      <Wrapper>
        <NavigationLink href="/location" icon={<svg />} enabled={false}>
          Target
        </NavigationLink>
      </Wrapper>,
    );
    const targetElement = screen.getByText('Target');
    // The text is inside a <p>, which is inside a styled div
    const styledDiv = targetElement.parentElement;
    expect(styledDiv).toHaveStyle('opacity: 0.3');
    expect(styledDiv).toHaveStyle('pointer-events: none');
  });
});

describe('with a router', () => {
  it('does not trigger a full page navigation on click', () => {
    currentPathname = null;
    render(
      <MemoryRouter initialEntries={['/']}>
        <LocationCapture />
        <NavigationLink href="/location" icon={<svg />}>
          Text
        </NavigationLink>
      </MemoryRouter>,
    );
    expect(fireEvent.click(screen.getByRole('link'))).toBe(false);
    expect(currentPathname).toEqual('/location');
  });

  it('triggers a full page navigation on click of an external link', () => {
    render(
      <MemoryRouter>
        <NavigationLink href="http://example.com/" icon={<svg />}>
          Text
        </NavigationLink>
      </MemoryRouter>,
    );
    expect(fireEvent.click(screen.getByRole('link'))).toBe(true);
  });

  it('default route is not always highlighted as selected', () => {
    currentPathname = null;
    render(
      <MemoryRouter initialEntries={['/location']}>
        <LocationCapture />
        <NavigationLink href="/" icon={<svg />}>
          Default
        </NavigationLink>
        <NavigationLink href="/other" icon={<svg />}>
          Other
        </NavigationLink>
        <NavigationLink href="/location" icon={<svg />}>
          Target
        </NavigationLink>
      </MemoryRouter>,
    );
    expect(currentPathname).toEqual('/location');
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
      <MemoryRouter>
        <NavigationLink href="http://example.com/" icon={<svg />}>
          Text
        </NavigationLink>
      </MemoryRouter>,
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
        primary100: activePrimaryBackgroundColor,
        primary900: activePrimaryColor,
      },
    };
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <NavigationLink href="http://example.com/" icon={<svg />}>
            Text
          </NavigationLink>
        </ThemeProvider>
      </MemoryRouter>,
    );
    const { color: primaryColor, backgroundColor } = getComputedStyle(
      screen.getByRole('link'),
    );
    expect(primaryColor).toBe(activePrimaryColor.rgb);
    expect(backgroundColor).toBe(activePrimaryBackgroundColor.rgb);
  });
});
