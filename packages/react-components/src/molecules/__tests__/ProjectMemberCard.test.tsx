import { render, screen } from '@testing-library/react';
import { GroupedProjectMember } from '../../utils';
import ProjectMemberCard from '../ProjectMemberCard';

const mockMember: GroupedProjectMember = {
  id: '1',
  displayName: 'John Doe',
  firstName: 'John',
  lastName: 'Doe',
  roles: ['Principal Investigator'],
  href: '/users/john-doe',
  avatarUrl: undefined,
};

const mockIsEnabled = jest.fn();
jest.mock('@asap-hub/react-context', () => ({
  ...jest.requireActual('@asap-hub/react-context'),
  useFlags: () => ({ isEnabled: mockIsEnabled }),
}));

describe('ProjectMemberCard', () => {
  it('renders member name as a link', () => {
    render(<ProjectMemberCard member={mockMember} />);
    const nameLink = screen.getByRole('link', { name: mockMember.displayName });
    expect(nameLink).toBeInTheDocument();
    expect(nameLink).toHaveAttribute('href', '#');
  });

  it('renders member role', () => {
    render(<ProjectMemberCard member={mockMember} />);
    expect(screen.getByText('Principal Investigator')).toBeInTheDocument();
  });

  it('renders avatar with initials', () => {
    render(<ProjectMemberCard member={mockMember} />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('does not render role when roles is empty', () => {
    const memberWithoutRole = { ...mockMember, roles: [] };
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

  it('renders avatar with empty initials when firstName and lastName are undefined', () => {
    const memberWithoutNames = {
      ...mockMember,
      firstName: undefined,
      lastName: undefined,
    };
    render(
      <ProjectMemberCard member={memberWithoutNames} showTeamInfo={false} />,
    );
    expect(screen.getByText(mockMember.displayName)).toBeInTheDocument();
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

  describe('member avatar award badge', () => {
    beforeEach(() => {
      mockIsEnabled.mockReturnValue(true);
    });

    const memberWithAward = {
      ...mockMember,
      avatarUrl: 'https://example.com/avatar.jpg',
      latestAward: {
        name: 'Open Science Champion',
        date: '2024-01-01',
        iconUrl: 'new',
      },
    };

    it('displays member avatar with badge if user has a latest award', () => {
      const { getByAltText } = render(
        <ProjectMemberCard member={memberWithAward} />,
      );

      const badge = getByAltText('Open Science Champion');
      expect(badge).toHaveAttribute('src', 'new');
    });

    it('does not render an award badge when the user has none', () => {
      const { queryByAltText } = render(
        <ProjectMemberCard
          member={{ ...memberWithAward, latestAward: undefined }}
        />,
      );

      expect(queryByAltText('Open Science Champion')).not.toBeInTheDocument();
    });

    it('does not render an award badge when the latest award has no icon', () => {
      const { queryByAltText } = render(
        <ProjectMemberCard
          member={{
            ...memberWithAward,
            latestAward: { name: 'Open Science Champion', date: '2024-01-01' },
          }}
        />,
      );

      expect(queryByAltText('Open Science Champion')).not.toBeInTheDocument();
    });

    it('does not render an award badge when STAGING_MODE is disabled', () => {
      mockIsEnabled.mockReturnValue(false);
      const { queryByAltText } = render(
        <ProjectMemberCard member={memberWithAward} />,
      );

      expect(queryByAltText('Open Science Champion')).not.toBeInTheDocument();
    });
  });
});
