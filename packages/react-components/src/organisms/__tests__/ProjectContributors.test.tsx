import { render, screen } from '@testing-library/react';
import { ProjectMember, TeamDetail } from '@asap-hub/model';
import ProjectContributors from '../ProjectContributors';

const mockFundedTeam: TeamDetail = {
  id: 'team-1',
  name: 'Test Team',
  type: 'Discovery Team',
  researchTheme: 'Neurodegeneration',
  description:
    'This is a test team description explaining their research focus and goals.',
};

const mockProjectMembers: ProjectMember[] = [
  {
    id: 'user-3',
    displayName: 'Alice Johnson',
    firstName: 'Alice',
    lastName: 'Johnson',
    href: '/users/user-3',
  },
  {
    id: 'user-4',
    displayName: 'Bob Williams',
    firstName: 'Bob',
    lastName: 'Williams',
    href: '/users/user-4',
  },
];

describe('ProjectContributors', () => {
  it('renders Contributors title', () => {
    render(<ProjectContributors fundedTeam={mockFundedTeam} />);
    expect(screen.getByText('Contributors')).toBeInTheDocument();
  });

  describe('Team-based projects', () => {
    it('renders Funded Team tab', () => {
      render(<ProjectContributors fundedTeam={mockFundedTeam} />);
      expect(screen.getByText('Funded Team')).toBeInTheDocument();
    });

    it('renders team information', () => {
      render(<ProjectContributors fundedTeam={mockFundedTeam} />);
      expect(screen.getByText('Test Team')).toBeInTheDocument();
      expect(screen.getByText('Discovery Team')).toBeInTheDocument();
      expect(screen.getByText('Neurodegeneration')).toBeInTheDocument();
      expect(screen.getByText(mockFundedTeam.description)).toBeInTheDocument();
    });

    it('renders team without research theme', () => {
      const teamWithoutTheme = { ...mockFundedTeam, researchTheme: undefined };
      render(<ProjectContributors fundedTeam={teamWithoutTheme} />);
      expect(screen.getByText('Discovery Team')).toBeInTheDocument();
      expect(screen.queryByText('Neurodegeneration')).not.toBeInTheDocument();
    });
  });

  describe('Individual-based projects (Project Members)', () => {
    it('renders Project Members tab', () => {
      render(<ProjectContributors projectMembers={mockProjectMembers} />);
      expect(screen.getByText('Project Members')).toBeInTheDocument();
    });

    it('renders all project members', () => {
      render(<ProjectContributors projectMembers={mockProjectMembers} />);
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Williams')).toBeInTheDocument();
    });

    it('does not render Funded Team or Collaborators tabs', () => {
      render(<ProjectContributors projectMembers={mockProjectMembers} />);
      expect(screen.queryByText('Funded Team')).not.toBeInTheDocument();
      expect(screen.queryByText(/Collaborators/)).not.toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('returns null when no funded team provided', () => {
      const { container } = render(
        <ProjectContributors fundedTeam={undefined as unknown as TeamDetail} />,
      );
      expect(container.firstChild).toBeNull();
    });
  });
});
