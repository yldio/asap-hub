/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC } from 'react';
import { Outlet } from 'react-router';

import { pearl, rem } from '../ui/theme';
import Breadcrumb from './Breadcrumb';
import Header from './Header';

const shellStyles = css({
  minHeight: '100vh',
  backgroundColor: pearl.rgb,
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
});

const mainStyles = css({
  width: '100%',
  maxWidth: rem(1120),
  margin: '0 auto',
  padding: `${rem(24)} ${rem(24)} ${rem(64)}`,
  boxSizing: 'border-box',
});

const Layout: FC = () => (
  <div css={shellStyles}>
    <Header />
    <main css={mainStyles}>
      <Breadcrumb />
      <Outlet />
    </main>
  </div>
);

export default Layout;
