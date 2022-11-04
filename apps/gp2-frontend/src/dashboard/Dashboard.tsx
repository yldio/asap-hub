import { Frame } from '@asap-hub/frontend-utils';
import { DashboardPage } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { FC, lazy } from 'react';
import { useDashboardState } from './state';

const loadBody = () =>
  import(/* webpackChunkName: "dashboard-body" */ './Body');
const Body = lazy(loadBody);
loadBody();

const Dashboard: FC<Record<string, never>> = () => {
  const currentUser = useCurrentUserGP2();
  if (!currentUser) {
    throw new Error('Failed to find out who is currently logged in');
  }

  const { firstName, id } = currentUser;
  const dashboard = useDashboardState();

  if (dashboard) {
    return (
      <DashboardPage firstName={firstName}>
        <Frame title={null}>
          <Body {...dashboard} userId={id} />
        </Frame>
      </DashboardPage>
    );
  }

  return <NotFoundPage />;
};

export default Dashboard;
