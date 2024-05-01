import { UserCollaborationResponse } from '@asap-hub/model';
import {
  UserCollaborationMetric,
  UserCollaborationTable,
} from '@asap-hub/react-components';
import { usePagination, usePaginationParams } from '../../hooks';
import { useAnalyticsUserCollaboration } from './state';

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
      team: team.team,
      role: team.role,
      isTeamInactive: team.isTeamInactive,
      outputsCoAuthored: team.outputsCoAuthoredAcrossTeams,
    })),
  }));
};

export type CollaborationProps = {
  type: 'within-team' | 'across-teams';
};

const UserCollaboration: React.FC<CollaborationProps> = ({ type }) => {
  const { currentPage, pageSize } = usePaginationParams();
  const { items: data, total } = useAnalyticsUserCollaboration({
    currentPage,
    pageSize,
    timeRange: '30d'
  })

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <UserCollaborationTable
      data={getDataForType(data, type)}
      currentPageIndex={currentPage}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
    />
  );
};

export default UserCollaboration;
