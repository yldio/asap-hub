import React from 'react';
import css from '@emotion/css';

import { perRem, tabletScreen, mobileScreen, vminLinearCalc } from '../pixels';
import { pearl } from '../colors';
import NetworkPageHeader from './NetworkPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const mainStyles = css({
  alignSelf: 'stretch',
  background: pearl.rgb,
  display: 'grid',
  gridRowGap: `${vminLinearCalc(mobileScreen, 24, tabletScreen, 36, 'px')}`,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const articleStyles = css({
  alignSelf: 'stretch',
  padding: `0 0 ${vminLinearCalc(mobileScreen, 36, tabletScreen, 72, 'px')}`,
});

type NetworkPageProps = {
  toggleOnChange: () => undefined;
  page: 'teams' | 'users';
};
const NetworkPage: React.FC<NetworkPageProps> = ({
  children,
  toggleOnChange,
  page,
}) => {
  return (
    <article css={articleStyles}>
      <NetworkPageHeader toggleOnChange={toggleOnChange} page={page} />
      <main css={mainStyles}>{children}</main>
    </article>
  );
};

export default NetworkPage;
