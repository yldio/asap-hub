import React from 'react';
import css from '@emotion/css';

import { Header, Navigation } from '../molecules';
import { smallDesktopScreen } from '../pixels';

const showNavigationQuery = `@media (min-width: ${smallDesktopScreen.width}px)`;

const styles = css({
  height: '100%',
  display: 'grid',
  grid: `
    "header  header " max-content
    "content content" auto
  `,
});

const withNavigationStyles = css({
  [showNavigationQuery]: {
    grid: `
      "header header " max-content
      "nav    content" auto / max-content auto
    `,
  },
});

const headerStyles = css({
  gridArea: 'header',
});
const navigationStyles = css({
  display: 'none',
  [showNavigationQuery]: {
    gridArea: 'nav',
    display: 'unset',
  },
});
const contentStyles = css({
  gridArea: 'content',
  overflowX: 'hidden', // prevent grid blowout

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

interface LayoutProps {
  readonly children: React.ReactNode;
  readonly navigation?: boolean;
}
const Layout: React.FC<LayoutProps> = ({ children, navigation = false }) => (
  <article css={[styles, navigation && withNavigationStyles]}>
    {/* order relevant for overlap */}
    <main css={contentStyles}>{children}</main>
    <div css={headerStyles}>
      <Header />
    </div>
    {navigation && (
      <div css={navigationStyles}>
        <Navigation />
      </div>
    )}
  </article>
);

export default Layout;
