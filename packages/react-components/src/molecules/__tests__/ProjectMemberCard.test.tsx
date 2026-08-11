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

describe('ProjectMemberCard', () => {
  it('renders member name as a link', () => {
    render(<ProjectMemberCard member={mockMember} />);
    const nameLink = screen.getByRole('link', { name: mockMember.displayName });
    expect(nameLink).toBeInTheDocument();
    expect(nameLink).toHaveAttribute('href', mockMember.href);
  });

  it('renders member role', () => {
    render(<ProjectMemberCard member={mockMember} />);
    expect(screen.getByText('Principal Investigator')).toBeInTheDocument();
  });

  it('renders avatar with initials', () => {
    render(<ProjectMemberCard member={mockMember} />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders "No role assigned" in place of the role when roles is empty', () => {
    const memberWithoutRole = { ...mockMember, roles: [] };
    const { container } = render(
      <ProjectMemberCard member={memberWithoutRole} />,
    );
    expect(container).toHaveTextContent(mockMember.displayName);
    expect(container).not.toHaveTextContent('Principal Investigator');
    expect(screen.getByText('No role assigned')).toBeVisible();
  });

  it('italicises "No role assigned" so it reads as missing data', () => {
    const memberWithoutRole = { ...mockMember, roles: [] };
    render(
      <ProjectMemberCard member={memberWithoutRole} showTeamInfo={false} />,
    );
    expect(screen.getByText('No role assigned')).toHaveStyle(
      'font-style: italic',
    );
  });

  it('does not render "No role assigned" when the member has a role', () => {
    render(<ProjectMemberCard member={mockMember} showTeamInfo={false} />);
    expect(screen.queryByText('No role assigned')).not.toBeInTheDocument();
  });

  it('renders avatar with empty initials when firstName and lastName are undefined', () => {
    const memberWithoutNames = {
      ...mockMember,
      firstName: undefined,
      lastName: undefined,
    };
    render(<ProjectMemberCard member={memberWithoutNames} />);
    expect(screen.getByText(mockMember.displayName)).toBeInTheDocument();
  });

  it('renders with avatar when avatarUrl is provided', () => {
    const memberWithAvatar = {
      ...mockMember,
      avatarUrl: 'https://example.com/avatar.jpg',
    };
    render(<ProjectMemberCard member={memberWithAvatar} />);
    // Avatar component is rendered - just verify the component doesn't crash
    expect(screen.getByText(mockMember.displayName)).toBeInTheDocument();
  });
});
