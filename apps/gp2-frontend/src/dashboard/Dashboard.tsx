import { Frame } from '@asap-hub/frontend-utils';
import { DashboardPage } from '@asap-hub/gp2-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { ComponentProps, FC, lazy } from 'react';

const loadBody = () =>
  import(/* webpackChunkName: "dashboard-body" */ './Body');
const Body = lazy(loadBody);
loadBody();

type DashboardProps = Pick<
  ComponentProps<typeof DashboardPage>,
  'dismissBanner' | 'showWelcomeBackBanner'
>;

const Dashboard: FC<DashboardProps> = ({
  showWelcomeBackBanner,
  dismissBanner,
}) => {
  const currentUser = useCurrentUserGP2();
  if (!currentUser) {
    throw new Error('Failed to find out who is currently logged in');
  }

  const { firstName } = currentUser;

  return (
    <DashboardPage
      firstName={firstName}
      showWelcomeBackBanner={showWelcomeBackBanner}
      dismissBanner={dismissBanner}
    >
      <Frame title={null}>
        <Body />
      </Frame>
    </DashboardPage>
  );
};

export default Dashboard;
