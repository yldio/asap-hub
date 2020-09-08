import React from 'react';
import css from '@emotion/css';

import {
  perRem,
  vminLinearCalc,
  smallDesktopScreen,
  largeDesktopScreen,
} from '../pixels';
import { Link } from '../atoms';

const width = vminLinearCalc(
  smallDesktopScreen,
  226,
  largeDesktopScreen,
  256,
  'px',
);

const containerStyles = css({
  width,
});

const listStyles = css({
  listStyle: 'none',
  margin: 0,
  boxSizing: 'border-box',
  padding: `${24 / perRem}em`,
  width,
});

const MainNavigation: React.FC<{}> = () => (
  <nav css={containerStyles}>
    <ul css={listStyles}>
      <li>
        <Link href="/users">Users</Link>
      </li>
      <li>
        <Link href="/teams">Teams</Link>
      </li>
    </ul>
  </nav>
);

export default MainNavigation;
