import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { CollaboratingTeam, FundedTeam, ProjectMember } from '@asap-hub/model';
import ProjectContributors from '../ProjectContributors';

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

const makeCollaboratingTeams = (count: number): CollaboratingTeam[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `team-${i + 1}`,
    displayName: `Team ${String.fromCharCode(65 + i)}`,
    articles: [
      {
        id: `article-${i}-1`,
        title: `Article ${i}-1`,
        type: 'Preprint' as const,
      },
    ],
  }));

const mockFundedTeam: FundedTeam = {
  id: 'team-1',
  displayName: 'Test Team',
  teamType: 'Discovery Team',
  researchTheme: 'Neurodegeneration',
  teamDescription:
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
      expect(
        screen.getByText(mockFundedTeam.teamDescription ?? ''),
      ).toBeInTheDocument();
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
        <ProjectContributors fundedTeam={undefined as unknown as FundedTeam} />,
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Collaborators tab', () => {
    it('shows team count in the tab label', () => {
      renderWithRouter(
        <ProjectContributors
          fundedTeam={mockFundedTeam}
          collaboratingTeams={makeCollaboratingTeams(3)}
        />,
      );
      expect(screen.getByText('Collaborators (3)')).toBeInTheDocument();
    });

    it('renders the collaborating teams in the Collaborators tab', async () => {
      renderWithRouter(
        <ProjectContributors
          fundedTeam={mockFundedTeam}
          collaboratingTeams={makeCollaboratingTeams(2)}
        />,
      );
      await userEvent.click(screen.getByText('Collaborators (2)'));
      expect(
        screen.getByRole('button', { name: /Expand Team A articles/i }),
      ).toBeInTheDocument();
    });

    it('renders the empty state in the Collaborators tab', async () => {
      renderWithRouter(
        <ProjectContributors
          fundedTeam={mockFundedTeam}
          collaboratingTeams={[]}
        />,
      );
      await userEvent.click(screen.getByText('Collaborators (0)'));
      expect(
        screen.getByText(/no team collaborations on this project/i),
      ).toBeInTheDocument();
    });

    it('switches back to the Funded Team tab from Collaborators', async () => {
      renderWithRouter(
        <ProjectContributors
          fundedTeam={mockFundedTeam}
          collaboratingTeams={makeCollaboratingTeams(2)}
        />,
      );

      // Default tab shows funded team's description
      expect(
        screen.getByText(mockFundedTeam.teamDescription ?? ''),
      ).toBeInTheDocument();

      await userEvent.click(screen.getByText('Collaborators (2)'));
      expect(
        screen.queryByText(mockFundedTeam.teamDescription ?? ''),
      ).not.toBeInTheDocument();

      await userEvent.click(screen.getByText('Funded Team'));
      expect(
        screen.getByText(mockFundedTeam.teamDescription ?? ''),
      ).toBeInTheDocument();
    });
  });
});
