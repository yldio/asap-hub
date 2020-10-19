import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';
import DiscoverPageHeader from './DiscoverPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const articleStyles = css({
  alignSelf: 'stretch',
});

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

type DashboardPageProps = ComponentProps<typeof DiscoverPageHeader>;

const Dashboard: React.FC<DashboardPageProps> = ({ children }) => {
  return (
    <article css={articleStyles}>
      <DiscoverPageHeader />
      <main css={mainStyles}>{children}</main>
    </article>
  );
};

export default Dashboard;
