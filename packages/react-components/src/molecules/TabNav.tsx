import React from 'react';
import css from '@emotion/css';

import {
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
  perRem,
} from '../pixels';
import { paper } from '../colors';

const shadowWidth = 18;

const containerStyles = css({
  width: `calc(100% + ${(2 * shadowWidth) / perRem}em)`,
  overflowX: 'auto',

  margin: `0 ${-shadowWidth / perRem}em`,
  display: 'grid',
  gridTemplateColumns: `${shadowWidth / perRem}em max-content ${
    shadowWidth / perRem
  }em`,
  '::before, ::after': {
    content: '""',
    position: 'sticky',
  },
  '::before': {
    left: 0,
    background: `linear-gradient(to left, transparent 0%, ${paper.rgb} 100%)`,
  },
  '::after': {
    right: 0,
    background: `linear-gradient(to right, transparent 0%, ${paper.rgb} 100%)`,
  },

  // Hide scrollbar on touch screens where our gradient indicator is sufficient.
  // Do not hide elsewhere, because the scrollbar may be required to actually perform scrolling.
  '@media (pointer: coarse)': {
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': {
      display: 'none',
    },
  },
});

const styles = css({
  display: 'flex',

  margin: 0,
  padding: 0,
  listStyle: 'none',

  '> li:not(:last-of-type)': {
    paddingRight: vminLinearCalc(
      mobileScreen,
      18,
      largeDesktopScreen,
      30,
      'px',
    ),
  },
});

type TabNavChildren =
  | React.ReactElement
  | ReadonlyArray<TabNavChildren | undefined>;
interface TabNavProps {
  readonly children: TabNavChildren;
}
const TabNav: React.FC<TabNavProps> = ({ children }) => (
  <nav css={containerStyles}>
    <ul css={styles}>
      {((Array.isArray(children) ? children : [children]) as ReadonlyArray<
        React.ReactElement
      >)
        .flat(Number.POSITIVE_INFINITY)
        .filter((child) => child && typeof child === 'object')
        .map((child, index) => (
          <li key={index}>{child}</li>
        ))}
    </ul>
  </nav>
);

export default TabNav;
