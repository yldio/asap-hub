import React from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';

const styles = css({
  display: 'flex',
  margin: 0,
  padding: 0,
  listStyle: 'none',

  '> li:not(:last-of-type)': {
    paddingRight: `${18 / perRem}em`,
  },
});

interface TabNavProps {
  readonly children: React.ReactElement | ReadonlyArray<React.ReactElement>;
}
const TabNav: React.FC<TabNavProps> = ({ children }) => (
  <nav>
    <ul css={styles}>
      {((Array.isArray(children) ? children : [children]) as ReadonlyArray<
        React.ReactElement
      >).map((child, index) => (
        <li key={index}>{child}</li>
      ))}
    </ul>
  </nav>
);

export default TabNav;
