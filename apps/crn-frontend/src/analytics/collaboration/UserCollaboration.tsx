import { UserCollaborationResponse } from '@asap-hub/model';
import {
  UserCollaborationMetric,
  UserCollaborationTable,
} from '@asap-hub/react-components';
import { usePagination, usePaginationParams } from '../../hooks';

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

  const userItems: UserCollaborationResponse[] = [
    {
      id: '1',
      name: 'User A',
      isAlumni: false,
      teams: [
        {
          team: 'Team A',
          isTeamInactive: true,
          role: 'Co-PI (Core Leadership)',
          outputsCoAuthoredWithinTeam: 0,
          outputsCoAuthoredAcrossTeams: 2,
        },
      ],
    },
    {
      id: '2',
      name: 'User B',
      isAlumni: true,
      teams: [
        {
          team: 'Team B',
          isTeamInactive: false,
          role: 'Co-PI (Core Leadership)',
          outputsCoAuthoredWithinTeam: 0,
          outputsCoAuthoredAcrossTeams: 2,
        },
      ],
    },
    {
      id: '3',
      name: 'User C',
      isAlumni: false,
      teams: [
        {
          team: 'Team A',
          isTeamInactive: true,
          role: 'Co-PI (Core Leadership)',
          outputsCoAuthoredWithinTeam: 0,
          outputsCoAuthoredAcrossTeams: 2,
        },
        {
          team: 'Team C',
          isTeamInactive: false,
          role: 'Co-PI (Core Leadership)',
          outputsCoAuthoredWithinTeam: 0,
          outputsCoAuthoredAcrossTeams: 2,
        },
        {
          team: 'Team D',
          isTeamInactive: false,
          role: 'Key Personnel',
          outputsCoAuthoredWithinTeam: 5,
          outputsCoAuthoredAcrossTeams: 0,
        },
      ],
    },
    {
      id: '4',
      name: 'User D',
      isAlumni: false,
      teams: [],
    },
  ];

  const { items: data, total } = {
    total: 4,
    items: userItems,
  };

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
