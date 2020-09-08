import React from 'react';
import css from '@emotion/css';

import {
  perRem,
  contentSidePaddingWithNavigation,
  tabletScreen,
  mobileScreen,
  vminLinearCalc,
} from '../pixels';
import { pearl } from '../colors';
import NetworkPageHeader from './NetworkPageHeader';

const styles = css({
  alignSelf: 'stretch',
  background: pearl.rgb,
  display: 'grid',
  gridRowGap: `${vminLinearCalc(mobileScreen, 24, tabletScreen, 36, 'px')}`,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(
    8,
  )} ${vminLinearCalc(mobileScreen, 36, tabletScreen, 72, 'px')}`,
});

const NetworkPage: React.FC = ({ children }) => {
  return (
    <>
      <NetworkPageHeader />
      <article css={styles}>{children}</article>
    </>
  );
};

export default NetworkPage;
