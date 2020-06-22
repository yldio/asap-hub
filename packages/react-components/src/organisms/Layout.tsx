import React from 'react';
import css from '@emotion/css';

import { Header } from '../molecules';
import { vminLinearCalc, mobileScreen, largeDesktopScreen } from '../pixels';

const containerStyles = css({
  width: '100%',
  height: '100%',

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
  justifyContent: 'center',
  alignItems: 'center',
});

interface LayoutProps {
  children: React.ReactNode | React.ReactNodeArray;
}
const Layout: React.FC<LayoutProps> = ({ children }) => (
  <article css={containerStyles}>
    <Header />
    <main css={contentStyles}>{children}</main>
  </article>
);

export default Layout;
