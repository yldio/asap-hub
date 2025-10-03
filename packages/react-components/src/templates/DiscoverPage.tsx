import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { rem } from '../pixels';
import DiscoverPageHeader from './DiscoverPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const mainStyles = css({
  padding: `${rem(36)} ${contentSidePaddingWithNavigation(8)}`,
});

type DashboardPageProps = ComponentProps<typeof DiscoverPageHeader>;

const Dashboard: React.FC<DashboardPageProps> = ({ children }) => (
  <article>
    <DiscoverPageHeader />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default Dashboard;
