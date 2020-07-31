import React from 'react';
import css from '@emotion/css';

import { Header, Navigation } from '../molecules';
import {
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
  perRem,
} from '../pixels';

const containerStyles = css({
  position: 'relative',
  minWidth: '100vw',
  minHeight: '100vh',

  display: 'flex',
  flexDirection: 'column',
});

const contentStyles = css({
  flexGrow: 1,
  padding: `${vminLinearCalc(
    mobileScreen,
    36,
    largeDesktopScreen,
    72,
    'px',
  )} ${vminLinearCalc(mobileScreen, 24, largeDesktopScreen, 159, 'px')}`,

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const navigationStyles = css({
  position: 'absolute',
});

const navigationContentStyles = css({
  marginLeft: `${256 / perRem}em`,
});

interface LayoutProps {
  readonly children: React.ReactNode;
  readonly navigation?: boolean;
}
const Layout: React.FC<LayoutProps> = ({ children, navigation = false }) => (
  <article css={containerStyles}>
    <Header />
    {navigation && (
      <div css={navigationStyles}>
        <Navigation />
      </div>
    )}
    <main css={[contentStyles, navigation && navigationContentStyles]}>
      {children}
    </main>
  </article>
);

export default Layout;
