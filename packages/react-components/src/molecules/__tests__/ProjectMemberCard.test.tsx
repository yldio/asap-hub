import { render, screen } from '@testing-library/react';
import { ProjectMember } from '@asap-hub/model';
import ProjectMemberCard from '../ProjectMemberCard';

const mockMember: ProjectMember = {
  id: '1',
  displayName: 'John Doe',
  firstName: 'John',
  lastName: 'Doe',
  role: 'Principal Investigator',
  href: '/users/john-doe',
  avatarUrl: undefined,
};

describe('ProjectMemberCard', () => {
  it('renders member name as a link', () => {
    render(<ProjectMemberCard member={mockMember} />);
    const nameLink = screen.getByRole('link', { name: mockMember.displayName });
    expect(nameLink).toBeInTheDocument();
    expect(nameLink).toHaveAttribute('href', '#');
  });

  it('renders member role', () => {
    render(<ProjectMemberCard member={mockMember} showTeamInfo={false} />);
    expect(screen.getByText(mockMember.role!)).toBeInTheDocument();
  });

  it('renders avatar with initials', () => {
    render(<ProjectMemberCard member={mockMember} showTeamInfo={false} />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('does not render role when not provided', () => {
    const memberWithoutRole = { ...mockMember, role: undefined };
    const { container } = render(
      <ProjectMemberCard member={memberWithoutRole} showTeamInfo={false} />,
    );
    expect(container).toHaveTextContent(mockMember.displayName);
    expect(container).not.toHaveTextContent('Principal Investigator');
  });

  it('does not show team info when showTeamInfo is false', () => {
    const memberWithTeam = {
      ...mockMember,
      teams: [{ id: 'team-1', displayName: 'Alpha Team' }],
    };
    render(<ProjectMemberCard member={memberWithTeam} showTeamInfo={false} />);
    expect(screen.queryByText('Alpha Team')).not.toBeInTheDocument();
  });

  it('shows team name when showTeamInfo is true and member has teams', () => {
    const memberWithTeam = {
      ...mockMember,
      teams: [{ id: 'team-1', displayName: 'Alpha Team' }],
    };
    render(<ProjectMemberCard member={memberWithTeam} showTeamInfo={true} />);
    expect(screen.getByText('Alpha Team')).toBeInTheDocument();
  });

  it('shows additional teams badge when member has multiple teams', () => {
    const memberWithMultipleTeams = {
      ...mockMember,
      teams: [
        { id: 'team-1', displayName: 'Alpha Team' },
        { id: 'team-2', displayName: 'Genomics Lab' },
        { id: 'team-3', displayName: 'Neuroscience Team' },
        { id: 'team-4', displayName: 'PD Consortium' },
      ],
    };
    render(
      <ProjectMemberCard
        member={memberWithMultipleTeams}
        showTeamInfo={true}
      />,
    );
    expect(screen.getByText('Alpha Team')).toBeInTheDocument();
    expect(screen.getByText('+3')).toBeInTheDocument();
  });

  it('does not show badge when member has only one team', () => {
    const memberWithOneTeam = {
      ...mockMember,
      teams: [{ id: 'team-1', displayName: 'Alpha Team' }],
    };
    render(
      <ProjectMemberCard member={memberWithOneTeam} showTeamInfo={true} />,
    );
    expect(screen.getByText('Alpha Team')).toBeInTheDocument();
    expect(screen.queryByText(/\+\d+/)).not.toBeInTheDocument();
  });

  it('does not show team info when member has no teams', () => {
    render(<ProjectMemberCard member={mockMember} showTeamInfo={true} />);
    expect(screen.queryByText(/Lab/)).not.toBeInTheDocument();
    expect(screen.queryByText(/\+\d+/)).not.toBeInTheDocument();
  });

  it('renders with avatar when avatarUrl is provided', () => {
    const memberWithAvatar = {
      ...mockMember,
      avatarUrl: 'https://example.com/avatar.jpg',
    };
    render(
      <ProjectMemberCard member={memberWithAvatar} showTeamInfo={false} />,
    );
    // Avatar component is rendered - just verify the component doesn't crash
    expect(screen.getByText(mockMember.displayName)).toBeInTheDocument();
  });
});
