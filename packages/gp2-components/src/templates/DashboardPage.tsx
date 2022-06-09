import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import DashboardPageHeader from './DashboardPageHeader';
import { pixels } from '@asap-hub/react-components';

const { rem } = pixels;

const mainStyles = css({
  padding: `${rem(36)} 0`,
});

type DashboardPageProps = ComponentProps<typeof DashboardPageHeader>;

const Dashboard: React.FC<DashboardPageProps> = ({ firstName, children }) => (
  <article>
    <DashboardPageHeader firstName={firstName} />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default Dashboard;
