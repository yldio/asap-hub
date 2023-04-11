import { pixels } from '@asap-hub/react-components';
import DashboardHeader from '../organisms/DashboardHeader';
import { mainStyles } from '../layout';

import PageNotifications from './PageNotifications';

const { rem } = pixels;

const Dashboard: React.FC = ({ children }) => (
  <PageNotifications page="dashboard">
    {(notification) => (
      <article
        css={notification ? { position: 'relative', marginTop: rem(48) } : {}}
      >
        <DashboardHeader />
        <main css={mainStyles}>{children}</main>
      </article>
    )}
  </PageNotifications>
);
export default Dashboard;
