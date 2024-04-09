import { AnalyticsProductivityPageBody } from '@asap-hub/react-components';
import { analytics } from '@asap-hub/routing';
import { useHistory, useParams } from 'react-router-dom';

import TeamProductivity from './TeamProductivity';
import UserProductivity from './UserProductivity';

const Productivity = () => {
  const history = useHistory();
  const { metric } = useParams<{ metric: 'user' | 'team' }>();
  const setMetric = (newMetric: 'user' | 'team') =>
    history.push(
      analytics({}).productivity({}).metric({ metric: newMetric }).$,
    );

  return (
    <AnalyticsProductivityPageBody metric={metric} setMetric={setMetric}>
      {metric === 'user' ? <UserProductivity /> : <TeamProductivity />}
    </AnalyticsProductivityPageBody>
  );
};

export default Productivity;
