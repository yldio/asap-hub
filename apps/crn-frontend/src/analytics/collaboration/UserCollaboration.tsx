import {
  UserCollaborationPerformance,
  UserCollaborationResponse,
} from '@asap-hub/model';
import {
  UserCollaborationMetric,
  UserCollaborationTable,
} from '@asap-hub/react-components';
import { useAnalytics, usePagination, usePaginationParams } from '../../hooks';
import {
  useAnalyticsUserCollaboration,
  useUserCollaborationPerformance,
} from './state';

const getDataForType = (
  data: UserCollaborationResponse[],
  type: 'within-team' | 'across-teams',
): UserCollaborationMetric[] => {
  if (type === 'within-team') {
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      isAlumni: row.isAlumni,
      teams: row.teams.map((team) => ({
        id: team.id,
        team: team.team,
        role: team.role,
        isTeamInactive: team.isTeamInactive,
        outputsCoAuthored: team.outputsCoAuthoredWithinTeam,
      })),
    }));
  }
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    isAlumni: row.isAlumni,
    teams: row.teams.map((team) => ({
      id: team.id,
      team: team.team,
      role: team.role,
      isTeamInactive: team.isTeamInactive,
      outputsCoAuthored: team.outputsCoAuthoredAcrossTeams,
    })),
  }));
};
const getPerformanceForType = (
  performance: UserCollaborationPerformance,
  type: 'within-team' | 'across-teams',
) => {
  if (type === 'within-team') {
    return performance.withinTeam;
  }
  return performance.acrossTeam;
};

export type CollaborationProps = {
  type: 'within-team' | 'across-teams';
};

const UserCollaboration: React.FC<CollaborationProps> = ({ type }) => {
  const { currentPage, pageSize } = usePaginationParams();

  const { timeRange } = useAnalytics();

  const { items: data, total } = useAnalyticsUserCollaboration({
    currentPage,
    pageSize,
    timeRange,
    tags: [],
    sort: '',
  });

  const performance = useUserCollaborationPerformance({ timeRange });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <UserCollaborationTable
      data={getDataForType(data, type)}
      performance={getPerformanceForType(performance, type)}
      currentPageIndex={currentPage}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
    />
  );
};

export default UserCollaboration;
