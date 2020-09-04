import React from 'react';
import css from '@emotion/css';

import {
  perRem,
  contentSidePaddingWithNavigation,
  tabletScreen,
} from '../pixels';
import { pearl } from '../colors';
import NetworkPageHeader from './NetworkPageHeader';

const styles = css({
  alignSelf: 'stretch',
  background: pearl.rgb,
  display: 'grid',
  gridRowGap: `${24 / perRem}em`,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} ${
    36 / perRem
  }em `,
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridRowGap: `${36 / perRem}em`,
    padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} ${
      72 / perRem
    }em `,
  },
});

const TeamListPage: React.FC = ({ children }) => {
  return (
    <>
      <NetworkPageHeader />
      <article css={styles}>{children}</article>
    </>
  );
};

export default TeamListPage;
