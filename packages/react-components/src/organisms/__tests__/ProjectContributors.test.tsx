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

    it('renders empty state when there are no collaborating teams', async () => {
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

    it('renders collaborating teams with article counts and expands to show articles', async () => {
      const teams: CollaboratingTeam[] = [
        {
          id: 'team-a',
          displayName: 'Team Alpha',
          articles: [
            { id: 'a-1', title: 'Alpha One', type: 'Preprint' },
            { id: 'a-2', title: 'Alpha Two', type: 'Published' },
          ],
        },
      ];

      renderWithRouter(
        <ProjectContributors
          fundedTeam={mockFundedTeam}
          collaboratingTeams={teams}
        />,
      );
      await userEvent.click(screen.getByText('Collaborators (1)'));
      expect(screen.getByText(/2 Articles/)).toBeInTheDocument();

      await userEvent.click(
        screen.getByRole('button', { name: /Expand Team Alpha articles/i }),
      );
      expect(screen.getByText('Alpha One')).toBeInTheDocument();
      expect(screen.getByText('Alpha Two')).toBeInTheDocument();
      // 'Published' renders as 'Publication' pill
      expect(screen.getByText('Publication')).toBeInTheDocument();
      expect(screen.getByText('Preprint')).toBeInTheDocument();
    });

    it('shows View More when there are more than 10 collaborating teams', async () => {
      renderWithRouter(
        <ProjectContributors
          fundedTeam={mockFundedTeam}
          collaboratingTeams={makeCollaboratingTeams(12)}
        />,
      );
      await userEvent.click(screen.getByText('Collaborators (12)'));

      // Only first 10 visible initially
      expect(
        screen.getAllByRole('button', {
          name: /Expand Team [A-Z] articles/,
        }),
      ).toHaveLength(10);

      await userEvent.click(
        screen.getByRole('button', { name: /View More Collaborators/i }),
      );
      expect(
        screen.getAllByRole('button', {
          name: /Expand Team [A-Z] articles/,
        }),
      ).toHaveLength(12);
    });

    it('AC02: makes the articles list scrollable when there are more than 7 articles', async () => {
      const teams: CollaboratingTeam[] = [
        {
          id: 'team-many',
          displayName: 'Team Many',
          articles: Array.from({ length: 8 }, (_, i) => ({
            id: `m-${i}`,
            title: `Many ${i}`,
            type: 'Preprint' as const,
          })),
        },
      ];

      renderWithRouter(
        <ProjectContributors
          fundedTeam={mockFundedTeam}
          collaboratingTeams={teams}
        />,
      );
      await userEvent.click(screen.getByText('Collaborators (1)'));
      await userEvent.click(
        screen.getByRole('button', { name: /Expand Team Many articles/i }),
      );

      // The articles list is the only <ul> containing the article titles
      const list = screen.getByText('Many 0').closest('ul');
      expect(list).not.toBeNull();
      expect(list as HTMLElement).toHaveStyleRule('overflow-y', 'auto');
      expect(list as HTMLElement).toHaveStyleRule(
        'max-height',
        expect.stringMatching(/em$/),
      );
    });

    it('AC03: links each article title to its research output detail page', async () => {
      const teams: CollaboratingTeam[] = [
        {
          id: 'team-a',
          displayName: 'Team Alpha',
          articles: [{ id: 'ro-42', title: 'Some Article', type: 'Preprint' }],
        },
      ];

      renderWithRouter(
        <ProjectContributors
          fundedTeam={mockFundedTeam}
          collaboratingTeams={teams}
        />,
      );
      await userEvent.click(screen.getByText('Collaborators (1)'));
      await userEvent.click(
        screen.getByRole('button', { name: /Expand Team Alpha articles/i }),
      );

      expect(
        screen.getByRole('link', { name: 'Some Article' }),
      ).toHaveAttribute('href', '/shared-research/ro-42');
    });

    it('AC04: links each collaborating team name to its team detail page', async () => {
      const teams: CollaboratingTeam[] = [
        {
          id: 'team-xyz',
          displayName: 'Team XYZ',
          articles: [{ id: 'a-1', title: 'A1', type: 'Preprint' }],
        },
      ];

      renderWithRouter(
        <ProjectContributors
          fundedTeam={mockFundedTeam}
          collaboratingTeams={teams}
        />,
      );
      await userEvent.click(screen.getByText('Collaborators (1)'));

      expect(screen.getByRole('link', { name: 'Team XYZ' })).toHaveAttribute(
        'href',
        '/network/teams/team-xyz',
      );
    });

    it('uses each collaborating team’s own type to pick its icon', async () => {
      const teams: CollaboratingTeam[] = [
        {
          id: 'discovery-team',
          displayName: 'Discovery Co',
          teamType: 'Discovery Team',
          articles: [{ id: 'a-1', title: 'A1', type: 'Preprint' }],
        },
        {
          id: 'resource-team',
          displayName: 'Resource Co',
          teamType: 'Resource Team',
          articles: [{ id: 'a-2', title: 'A2', type: 'Preprint' }],
        },
      ];

      renderWithRouter(
        <ProjectContributors
          fundedTeam={mockFundedTeam}
          collaboratingTeams={teams}
        />,
      );
      await userEvent.click(screen.getByText('Collaborators (2)'));

      const discoveryRow = screen
        .getByRole('link', { name: 'Discovery Co' })
        .closest('[role="button"]') as HTMLElement;
      const resourceRow = screen
        .getByRole('link', { name: 'Resource Co' })
        .closest('[role="button"]') as HTMLElement;

      expect(discoveryRow.querySelector('title')?.textContent).toBe(
        'Discovery Team Icon',
      );
      expect(resourceRow.querySelector('title')?.textContent).toBe(
        'Resource Team Icon',
      );
    });

    it('expands when clicking anywhere on the row, but not on the team link', async () => {
      const teams: CollaboratingTeam[] = [
        {
          id: 'team-a',
          displayName: 'Team Alpha',
          articles: [{ id: 'a-1', title: 'Alpha One', type: 'Preprint' }],
        },
      ];

      renderWithRouter(
        <ProjectContributors
          fundedTeam={mockFundedTeam}
          collaboratingTeams={teams}
        />,
      );
      await userEvent.click(screen.getByText('Collaborators (1)'));

      // Clicking the link itself does NOT toggle the row
      await userEvent.click(screen.getByRole('link', { name: 'Team Alpha' }));
      expect(screen.queryByText('Alpha One')).not.toBeInTheDocument();

      // Clicking the article-count area (anywhere else in the row) DOES toggle
      await userEvent.click(screen.getByText(/1 Article$/));
      expect(screen.getByText('Alpha One')).toBeInTheDocument();
    });

    it('toggles row via Enter and Space keys', async () => {
      const teams: CollaboratingTeam[] = [
        {
          id: 'team-a',
          displayName: 'Team Alpha',
          articles: [{ id: 'a-1', title: 'Alpha One', type: 'Preprint' }],
        },
      ];

      renderWithRouter(
        <ProjectContributors
          fundedTeam={mockFundedTeam}
          collaboratingTeams={teams}
        />,
      );
      await userEvent.click(screen.getByText('Collaborators (1)'));

      const row = screen.getByRole('button', {
        name: /Expand Team Alpha articles/i,
      });
      row.focus();

      await userEvent.keyboard('{Enter}');
      expect(screen.getByText('Alpha One')).toBeInTheDocument();

      await userEvent.keyboard(' ');
      expect(screen.queryByText('Alpha One')).not.toBeInTheDocument();
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
