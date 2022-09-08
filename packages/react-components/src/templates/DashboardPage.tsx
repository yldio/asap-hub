import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { perRem } from '../pixels';
import DashboardPageHeader from './DashboardPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

type DashboardPageProps = ComponentProps<typeof DashboardPageHeader>;

const Dashboard: React.FC<DashboardPageProps> = ({
  firstName,
  dismissedGettingStarted,
  children,
}) => (
  <article>
    <DashboardPageHeader
      firstName={firstName}
      dismissedGettingStarted={dismissedGettingStarted}
    />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default Dashboard;
