import React from 'react';
import css from '@emotion/css';

import {
  perRem,
  tabletScreen,
  mobileScreen,
  vminLinearCalcClamped,
} from '../pixels';
import { pearl } from '../colors';
import NewsAndEventsPageHeader from './NewsAndEventsPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const mainStyles = css({
  alignSelf: 'stretch',
  background: pearl.rgb,
  display: 'grid',
  gridRowGap: `${vminLinearCalcClamped(
    mobileScreen,
    24,
    tabletScreen,
    36,
    'px',
  )}`,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const articleStyles = css({
  alignSelf: 'stretch',
  padding: `0 0 ${vminLinearCalcClamped(
    mobileScreen,
    36,
    tabletScreen,
    72,
    'px',
  )}`,
});

const NewsAndEventsPage: React.FC = ({ children }) => {
  return (
    <article css={articleStyles}>
      <NewsAndEventsPageHeader />
      <main css={mainStyles}>{children}</main>
    </article>
  );
};

export default NewsAndEventsPage;
