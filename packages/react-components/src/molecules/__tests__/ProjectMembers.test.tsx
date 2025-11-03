import { render, screen } from '@testing-library/react';
import { ProjectMember } from '@asap-hub/model';
import ProjectMembers from '../ProjectMembers';

const mockMembers: ProjectMember[] = [
  {
    id: '1',
    displayName: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    role: 'Principal Investigator',
    href: '/users/john-doe',
  },
  {
    id: '2',
    displayName: 'Jane Smith',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'Co-Investigator',
    href: '/users/jane-smith',
  },
  {
    id: '3',
    displayName: 'Michael Johnson',
    firstName: 'Michael',
    lastName: 'Johnson',
    role: 'Research Associate',
    href: '/users/michael-johnson',
  },
];

describe('ProjectMembers', () => {
  it('renders all members', () => {
    render(<ProjectMembers members={mockMembers} showTeamInfo={false} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Michael Johnson')).toBeInTheDocument();
  });

  it('renders member roles', () => {
    render(<ProjectMembers members={mockMembers} showTeamInfo={false} />);
    expect(screen.getByText('Principal Investigator')).toBeInTheDocument();
    expect(screen.getByText('Co-Investigator')).toBeInTheDocument();
    expect(screen.getByText('Research Associate')).toBeInTheDocument();
  });

  it('does not show team info when showTeamInfo is false', () => {
    const membersWithTeams = mockMembers.map((m) => ({
      ...m,
      teams: [{ id: 'team-1', displayName: 'Martinez Lab' }],
    }));
    render(<ProjectMembers members={membersWithTeams} showTeamInfo={false} />);
    expect(screen.queryByText('Martinez Lab')).not.toBeInTheDocument();
  });

  it('shows team name for members when showTeamInfo is true', () => {
    const membersWithTeams = mockMembers.map((m) => ({
      ...m,
      teams: [{ id: 'team-1', displayName: 'Martinez Lab' }],
    }));
    render(<ProjectMembers members={membersWithTeams} showTeamInfo={true} />);
    const teamNames = screen.getAllByText('Martinez Lab');
    expect(teamNames).toHaveLength(mockMembers.length);
  });

  it('shows additional teams badge for members with multiple teams', () => {
    const membersWithMultipleTeams = mockMembers.map((m) => ({
      ...m,
      teams: [
        { id: 'team-1', displayName: 'Martinez Lab' },
        { id: 'team-2', displayName: 'Team 2' },
        { id: 'team-3', displayName: 'Team 3' },
      ],
    }));
    render(
      <ProjectMembers members={membersWithMultipleTeams} showTeamInfo={true} />,
    );
    const badges = screen.getAllByText('+2');
    expect(badges).toHaveLength(mockMembers.length);
  });

  it('renders empty state with empty array', () => {
    const { container } = render(
      <ProjectMembers members={[]} showTeamInfo={false} />,
    );
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('renders single member', () => {
    render(<ProjectMembers members={[mockMembers[0]!]} showTeamInfo={false} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('renders all member links correctly', () => {
    render(<ProjectMembers members={mockMembers} showTeamInfo={false} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(mockMembers.length);
    expect(links[0]).toHaveAttribute('href', '#');
    expect(links[0]).toHaveAttribute('href', '#');
    expect(links[0]).toHaveAttribute('href', '#');
  });

  it('uses default showTeamInfo=false when prop is not provided', () => {
    const membersWithTeams = mockMembers.map((m) => ({
      ...m,
      teams: [{ id: 'team-1', displayName: 'Martinez Lab' }],
    }));
    // Don't pass showTeamInfo prop - should default to false
    render(<ProjectMembers members={membersWithTeams} />);
    // Team info should not be shown when using default value
    expect(screen.queryByText('Martinez Lab')).not.toBeInTheDocument();
  });
});
