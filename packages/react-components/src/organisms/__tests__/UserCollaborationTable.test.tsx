import { TeamRole } from '@asap-hub/model';
import { render } from '@testing-library/react';
import UserCollaborationTable, {
  UserCollaborationMetric,
} from '../UserCollaborationTable';

describe('UserCollaborationTable', () => {
  const pageControlsProps = {
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
  };

  const userTeam: UserCollaborationMetric['teams'][number] = {
    team: 'Team A',
    isTeamInactive: false,
    role: 'Collaborating PI',
    outputsCoAuthored: 2,
  };
  const user: UserCollaborationMetric = {
    id: '1',
    name: 'Test User',
    isAlumni: false,
    teams: [userTeam],
  };

  it('renders data', () => {
    const data = [user];
    const { getByText } = render(
      <UserCollaborationTable data={data} {...pageControlsProps} />,
    );
    expect(getByText('Test User')).toBeInTheDocument();
  });

  it('displays alumni badge', () => {
    const data = [
      {
        ...user,
        isAlumni: true,
      },
    ];
    const { getByTitle } = render(
      <UserCollaborationTable data={data} {...pageControlsProps} />,
    );
    expect(getByTitle('Alumni Member')).toBeInTheDocument();
  });

  it('displays inactive badge', () => {
    const data: UserCollaborationMetric[] = [
      {
        ...user,
        teams: [{ ...userTeam, team: 'Team A', isTeamInactive: true }],
      },
    ];
    const { getByTitle } = render(
      <UserCollaborationTable data={data} {...pageControlsProps} />,
    );
    expect(getByTitle('Inactive Team')).toBeInTheDocument();
  });

  it('handles multiple teams', () => {
    const data: UserCollaborationMetric[] = [
      {
        ...user,
        teams: [
          { ...userTeam, team: 'Team A' },
          { ...userTeam, team: 'Team B' },
        ],
      },
    ];
    const { getByText } = render(
      <UserCollaborationTable data={data} {...pageControlsProps} />,
    );
    expect(getByText('Multiple teams')).toBeInTheDocument();
  });

  it('handles multiple roles', () => {
    const data: UserCollaborationMetric[] = [
      {
        ...user,
        teams: [
          { ...userTeam, team: 'Team A', role: 'Co-PI (Core Leadership)' },
          { ...userTeam, team: 'Team B', role: 'Key Personnel' },
        ],
      },
    ];
    const { getByText } = render(
      <UserCollaborationTable data={data} {...pageControlsProps} />,
    );
    expect(getByText('Multiple roles')).toBeInTheDocument();
  });

  it('handles multiple values', () => {
    const data: UserCollaborationMetric[] = [
      {
        ...user,
        teams: [
          { ...userTeam, team: 'Team A', outputsCoAuthored: 4 },
          { ...userTeam, team: 'Team B', outputsCoAuthored: 2 },
        ],
      },
    ];
    const { getByText } = render(
      <UserCollaborationTable data={data} {...pageControlsProps} />,
    );
    expect(getByText('Multiple values')).toBeInTheDocument();
  });

  it('displays no team', () => {
    const data: UserCollaborationMetric[] = [
      {
        ...user,
        teams: [],
      },
    ];
    const { getByText } = render(
      <UserCollaborationTable data={data} {...pageControlsProps} />,
    );
    expect(getByText('No team')).toBeInTheDocument();
  });

  it('displays no role', () => {
    const data: UserCollaborationMetric[] = [
      {
        ...user,
        teams: [{ ...userTeam, role: null as unknown as TeamRole }],
      },
    ];
    const { getByText } = render(
      <UserCollaborationTable data={data} {...pageControlsProps} />,
    );
    expect(getByText('No role')).toBeInTheDocument();
  });

  it('displays no values', () => {
    const data: UserCollaborationMetric[] = [
      {
        ...user,
        teams: [],
      },
    ];
    const { getByText } = render(
      <UserCollaborationTable data={data} {...pageControlsProps} />,
    );
    expect(getByText('No values')).toBeInTheDocument();
  });
});
