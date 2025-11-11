import { ComponentProps } from 'react';

import DiscoverPageHeader from './DiscoverPageHeader';
import PageContraints from './PageConstraints';

type DashboardPageProps = ComponentProps<typeof DiscoverPageHeader>;

const Dashboard: React.FC<DashboardPageProps> = ({ children }) => (
  <article>
    <DiscoverPageHeader />
    <PageContraints as="main">{children}</PageContraints>
  </article>
);

export default Dashboard;
