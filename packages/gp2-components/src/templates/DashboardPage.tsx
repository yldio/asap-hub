import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import {
  contentSidePaddingWithNavigation,
  pixels,
} from '@asap-hub/react-components';

import DashboardPageHeader from './DashboardPageHeader';

const { perRem } = pixels;
const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

type DashboardPageProps = ComponentProps<typeof DashboardPageHeader>;

const Dashboard: React.FC<DashboardPageProps> = ({ firstName, children }) => (
  <article>
    <DashboardPageHeader firstName={firstName} />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default Dashboard;
