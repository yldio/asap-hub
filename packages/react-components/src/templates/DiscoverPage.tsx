import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { perRem } from '../pixels';
import DiscoverPageHeader from './DiscoverPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

type DashboardPageProps = ComponentProps<typeof DiscoverPageHeader>;

const Dashboard: React.FC<React.PropsWithChildren<DashboardPageProps>> = ({ children }) => (
  <article>
    <DiscoverPageHeader />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default Dashboard;
