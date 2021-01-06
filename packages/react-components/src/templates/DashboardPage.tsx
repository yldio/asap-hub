import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';
import DashboardPageHeader from './DashboardPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const articleStyles = css({
  alignSelf: 'stretch',
});

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

type DashboardPageProps = ComponentProps<typeof DashboardPageHeader>;

const Dashboard: React.FC<DashboardPageProps> = ({ firstName, children }) => (
  <article css={articleStyles}>
    <DashboardPageHeader firstName={firstName} />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default Dashboard;
