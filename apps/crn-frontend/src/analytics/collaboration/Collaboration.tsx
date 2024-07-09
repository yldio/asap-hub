import { AnalyticsCollaborationPageBody } from '@asap-hub/react-components';
// import { analyticsRoutes } from '@asap-hub/routing';
// import { useHistory, useParams } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import UserCollaboration from './UserCollaboration';
import TeamCollaboration from './TeamCollaboration';
import { useAnalytics, usePaginationParams } from '../../hooks';

const Collaboration = () => {
  // const history = useHistory();
  const { metric, type } = useParams<{
    metric: 'user' | 'team';
    type: 'within-team' | 'across-teams';
  }>();
  const { timeRange } = useAnalytics();
  const { currentPage } = usePaginationParams();

  const setMetric = (newMetric: 'user' | 'team') => {
    // history.push(
    //   analytics({})
    //     .collaboration({})
    //     .collaborationPath({ metric: newMetric, type }).$,
    // );
  };
  const setType = (newType: 'within-team' | 'across-teams') => {
    // history.push(
    //   analytics({})
    //     .collaboration({})
    //     .collaborationPath({ metric, type: newType }).$,
    // );
  };
  return (
    <AnalyticsCollaborationPageBody
      //fix
      metric={metric!}
      type={type!}
      setMetric={setMetric}
      setType={setType}
      timeRange={timeRange}
      currentPage={currentPage}
    >
      {metric === 'user' ? (
        <UserCollaboration type={type!} />
      ) : (
        <TeamCollaboration type={type!} />
      )}
    </AnalyticsCollaborationPageBody>
  );
};

export default Collaboration;
