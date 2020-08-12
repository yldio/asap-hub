import React from 'react';
import css from '@emotion/css';

import {
  perRem,
  vminLinearCalc,
  smallDesktopScreen,
  largeDesktopScreen,
} from '../pixels';
import { steel } from '../colors';
import { Link } from '../atoms';

const width = vminLinearCalc(
  smallDesktopScreen,
  226,
  largeDesktopScreen,
  256,
  'px',
);

const containerStyles = css({
  position: 'relative',
  width,
  height: '100%',
});

const listStyles = css({
  listStyle: 'none',

  position: 'fixed',
  boxSizing: 'border-box',
  width,
  margin: 0,
  padding: `${24 / perRem}em`,
});

const borderStyles = css({
  position: 'fixed',
  height: '100vh',
  top: 0,
  left: width,

  borderRight: `1px solid ${steel.rgb}`,
});

const Navigation: React.FC = () => (
  <nav css={containerStyles}>
    <ul css={listStyles}>
      <li>
        <Link href="/users">Users</Link>
      </li>
      <li>
        <Link href="/teams">Teams</Link>
      </li>
    </ul>
    <div role="presentation" css={borderStyles} />
  </nav>
);

export default Navigation;
