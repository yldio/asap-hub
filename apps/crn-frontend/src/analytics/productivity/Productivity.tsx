import { useHistory, useParams } from 'react-router-dom';
import { UserProductivityMetric } from '@asap-hub/react-components/src/organisms/UserProductivityTable';
import { TeamProductivityMetric } from '@asap-hub/react-components/src/organisms/TeamProductivityTable';
import { analytics } from '@asap-hub/routing';
import { AnalyticsProductivityPageBody } from '@asap-hub/react-components';
import { usePagination, usePaginationParams } from '../../hooks';

const Productivity = () => {
  const history = useHistory();
  const { metric } = useParams<{ metric: 'user' | 'team' }>();
  const setMetric = (newMetric: 'user' | 'team') =>
    history.push(
      analytics({}).productivity({}).metric({ metric: newMetric }).$,
    );

  const { currentPage, pageSize } = usePaginationParams();

  const userItems: UserProductivityMetric[] = [
    {
      id: '1',
      name: 'User A',
      alumni: false,
      teams: [{ name: 'Team A', active: true }],
      roles: ['Role A'],
      asapOutput: 1,
      asapPublicOutput: 2,
      ratio: 1,
    },
    {
      id: '2',
      name: 'User B',
      alumni: true,
      teams: [{ name: 'Team B', active: false }],
      roles: ['Role B'],
      asapOutput: 1,
      asapPublicOutput: 2,
      ratio: 1,
    },
    {
      id: '3',
      name: 'User C',
      alumni: false,
      teams: [{ name: 'Team A', active: true }, { name: 'Team C', active: false }],
      roles: ['Role A', 'Role B'],
      asapOutput: 1,
      asapPublicOutput: 2,
      ratio: 1,
    },
    {
      id: '4',
      name: 'User D',
      alumni: false,
      teams: [],
      roles: [],
      asapOutput: 1,
      asapPublicOutput: 2,
      ratio: 1,
    },
  ];
  const teamItems: TeamProductivityMetric[] = [
    {
      id: '1',
      name: 'Team A',
      active: true,
      articles: 1,
      bioinformatics: 2,
      datasets: 3,
      labResources: 4,
      protocols: 5,
    },
    {
      id: '2',
      name: 'Team B',
      active: true,
      articles: 3,
      bioinformatics: 2,
      datasets: 2,
      labResources: 4,
      protocols: 3,
    },
    {
      id: '3',
      name: 'Team C',
      active: false,
      articles: 2,
      bioinformatics: 2,
      datasets: 2,
      labResources: 4,
      protocols: 2,
    },
  ];

  const { numberOfPages, renderPageHref } = usePagination(
    metric === 'user' ? userItems.length : teamItems.length,
    pageSize,
  );

  return (
    <AnalyticsProductivityPageBody
      metric={metric}
      setMetric={setMetric}
      teamData={teamItems}
      userData={userItems}
      currentPageIndex={currentPage}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
    />
  );
};

export default Productivity;
