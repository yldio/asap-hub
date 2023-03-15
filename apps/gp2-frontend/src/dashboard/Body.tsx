import { getEventListOptions } from '@asap-hub/frontend-utils';
import { DashboardPageBody } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/model';
import { eventMapper } from '../events/EventsList';
import { useEvents } from '../events/state';
import { useNews } from './state';

const pageSize = 3;

type DashboardBodyProps = { currentTime: Date };

const Body: React.FC<DashboardBodyProps> = ({ currentTime }) => {
  const news = useNews();
  const { items, total } = useEvents(
    getEventListOptions<gp2.EventConstraint>(currentTime, {
      past: false,
      pageSize,
    }),
  );
  return (
    <DashboardPageBody
      news={news}
      upcomingEvents={items.map(eventMapper)}
      totalOfUpcomingEvents={total}
    />
  );
};

export default Body;
