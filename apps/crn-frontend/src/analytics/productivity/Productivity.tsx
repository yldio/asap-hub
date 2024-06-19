import { AnalyticsProductivityPageBody } from '@asap-hub/react-components';
import { analyticsRoutes } from '@asap-hub/routing';
// import { useHistory, useParams } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAnalytics, usePaginationParams } from '../../hooks';

import TeamProductivity from './TeamProductivity';
import UserProductivity from './UserProductivity';

const Productivity = () => {
  // const history = useHistory();
  const { currentPage } = usePaginationParams();

  const { metric } = useParams<{ metric: 'user' | 'team' }>();
  const setMetric = (newMetric: 'user' | 'team') => {
    // history.push(
    //   analytics({}).productivity({}).metric({ metric: newMetric }).$,
    // );
  };
  const { timeRange } = useAnalytics();

  return (
    <AnalyticsProductivityPageBody
      metric={metric!}
      setMetric={setMetric}
      timeRange={timeRange}
      currentPage={currentPage}
    >
      {metric === 'user' ? <UserProductivity /> : <TeamProductivity />}
    </AnalyticsProductivityPageBody>
  );
};

export default Productivity;
