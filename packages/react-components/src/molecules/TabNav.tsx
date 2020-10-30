import React from 'react';
import css from '@emotion/css';

import { vminLinearCalc, mobileScreen, largeDesktopScreen } from '../pixels';

const styles = css({
  display: 'flex',
  flexWrap: 'wrap',
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

interface TabNavProps {
  readonly children:
    | React.ReactElement
    | ReadonlyArray<React.ReactElement | undefined>;
}
const TabNav: React.FC<TabNavProps> = ({ children }) => (
  <nav>
    <ul css={styles}>
      {((Array.isArray(children) ? children : [children]) as ReadonlyArray<
        React.ReactElement
      >)
        .filter((child) => child && typeof child === 'object')
        .map((child, index) => (
          <li key={index}>{child}</li>
        ))}
    </ul>
  </nav>
);

export default TabNav;
