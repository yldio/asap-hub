import React from 'react';
import css from '@emotion/css';

import { Header, Navigation } from '../molecules';
import { steel } from '../colors';
import {
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
  perRem,
} from '../pixels';

const containerStyles = css({
  position: 'relative',
  minWidth: '100%',
  minHeight: '100%',

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
  top: 0,
  position: 'absolute',
});

const navigationContentStyles = css({
  marginLeft: `${256 / perRem}em`,
});

const centerStyles = css({
  justifyContent: 'center',
});

const headerStyles = css({
  position: 'relative',
  borderBottom: `1px solid ${steel.rgb}`,
});

interface LayoutProps {
  readonly center?: boolean;
  readonly children: React.ReactNode;
  readonly navigation?: boolean;
}
const Layout: React.FC<LayoutProps> = ({
  center,
  children,
  navigation = false,
}) => (
  <article css={containerStyles}>
    <div css={headerStyles}>
      <Header />
      {navigation && (
        <div css={navigationStyles}>
          <Navigation />
        </div>
      )}
    </div>
    <main
      css={[
        contentStyles,
        navigation && navigationContentStyles,
        center && centerStyles,
      ]}
    >
      {children}
    </main>
  </article>
);

export default Layout;
