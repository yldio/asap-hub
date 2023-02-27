import { Frame, getEventListOptions } from '@asap-hub/frontend-utils';
import { DashboardPage } from '@asap-hub/gp2-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { ComponentProps, FC, lazy } from 'react';
import { eventMapper } from '../events/EventsList';
import { useEvents } from '../events/state';
import { useNews } from './state';

const loadBody = () =>
  import(/* webpackChunkName: "dashboard-body" */ './Body');
const Body = lazy(loadBody);
loadBody();

const pageSize = 3;

type DashboardProps = Pick<
  ComponentProps<typeof DashboardPage>,
  'dismissBanner' | 'showWelcomeBackBanner'
> & { currentTime: Date };

const Dashboard: FC<DashboardProps> = ({
  showWelcomeBackBanner,
  dismissBanner,
  currentTime,
}) => {
  const currentUser = useCurrentUserGP2();
  if (!currentUser) {
    throw new Error('Failed to find out who is currently logged in');
  }

  const { firstName } = currentUser;
  const news = useNews();
  const { items, total } = useEvents(
    getEventListOptions(currentTime, {
      past: false,
      pageSize,
    }),
  );

  return (
    <DashboardPage
      firstName={firstName}
      showWelcomeBackBanner={showWelcomeBackBanner}
      dismissBanner={dismissBanner}
    >
      <Frame title={null}>
        <Body
          news={news}
          upcomingEvents={items.map(eventMapper)}
          totalOfUpcomingEvents={total}
        />
      </Frame>
    </DashboardPage>
  );
};

export default Dashboard;
