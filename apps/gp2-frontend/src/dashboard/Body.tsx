import { getEventListOptions } from '@asap-hub/frontend-utils';
import { DashboardPageBody } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/model';
import { eventMapper } from '../events/EventsList';
import { useEvents } from '../events/state';
import { useDashboard, useNews } from './state';

const pageSize = 3;

type DashboardBodyProps = { currentTime: Date };

const Body: React.FC<DashboardBodyProps> = ({ currentTime }) => {
  const news = useNews();
  const dashboard = useDashboard();
  const { items, total } = useEvents(
    getEventListOptions<gp2.EventConstraint>(currentTime, {
      past: false,
      pageSize,
    }),
  );

  const stats = dashboard.items[0]?.latestStats || {
    sampleCount: 0,
    cohortCount: 0,
    articleCount: 0,
  };

  return (
    <DashboardPageBody
      news={news}
      latestStats={stats}
      upcomingEvents={items.map(eventMapper)}
      totalOfUpcomingEvents={total}
    />
  );
};

export default Body;
