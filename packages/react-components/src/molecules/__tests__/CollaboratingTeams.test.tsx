import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { CollaboratingTeam } from '@asap-hub/model';

import CollaboratingTeams from '../CollaboratingTeams';

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

const makeTeams = (count: number): CollaboratingTeam[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `team-${i + 1}`,
    displayName: `Team ${String.fromCharCode(65 + i)}`,
    articles: [
      { id: `article-${i}-1`, title: `Article ${i}-1`, type: 'Preprint' },
    ],
  }));

it('renders the empty state when there are no collaborating teams', () => {
  renderWithRouter(<CollaboratingTeams collaboratingTeams={[]} />);
  expect(
    screen.getByText(/no team collaborations on this project/i),
  ).toBeInTheDocument();
});

it('renders a custom empty state message', () => {
  renderWithRouter(
    <CollaboratingTeams
      collaboratingTeams={[]}
      emptyStateMessage="Nothing here"
    />,
  );
  expect(screen.getByText('Nothing here')).toBeInTheDocument();
});

it('renders each team with its article count and expands to show articles', async () => {
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

  renderWithRouter(<CollaboratingTeams collaboratingTeams={teams} />);
  expect(screen.getByText(/2 Articles/)).toBeInTheDocument();

  await userEvent.click(
    screen.getByRole('button', { name: /Expand Team Alpha articles/i }),
  );
  expect(screen.getByText('Alpha One')).toBeInTheDocument();
  expect(screen.getByText('Alpha Two')).toBeInTheDocument();
  // 'Published' renders as a 'Publication' pill
  expect(screen.getByText('Publication')).toBeInTheDocument();
  expect(screen.getByText('Preprint')).toBeInTheDocument();
});

it('shows View More when there are more than 10 teams and reveals the rest', async () => {
  renderWithRouter(<CollaboratingTeams collaboratingTeams={makeTeams(12)} />);

  expect(
    screen.getAllByRole('button', { name: /Expand Team [A-Z] articles/ }),
  ).toHaveLength(10);

  await userEvent.click(
    screen.getByRole('button', { name: /View More Collaborators/i }),
  );
  expect(
    screen.getAllByRole('button', { name: /Expand Team [A-Z] articles/ }),
  ).toHaveLength(12);
});

it('makes the articles list scrollable when there are more than 7 articles', async () => {
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

  renderWithRouter(<CollaboratingTeams collaboratingTeams={teams} />);
  await userEvent.click(
    screen.getByRole('button', { name: /Expand Team Many articles/i }),
  );

  const list = screen.getByText('Many 0').closest('ul');
  expect(list).not.toBeNull();
  expect(list as HTMLElement).toHaveStyleRule('overflow-y', 'auto');
  expect(list as HTMLElement).toHaveStyleRule(
    'max-height',
    expect.stringMatching(/em$/),
  );
});

it('links each article title to its research output detail page', async () => {
  const teams: CollaboratingTeam[] = [
    {
      id: 'team-a',
      displayName: 'Team Alpha',
      articles: [{ id: 'ro-42', title: 'Some Article', type: 'Preprint' }],
    },
  ];

  renderWithRouter(<CollaboratingTeams collaboratingTeams={teams} />);
  await userEvent.click(
    screen.getByRole('button', { name: /Expand Team Alpha articles/i }),
  );

  expect(screen.getByRole('link', { name: 'Some Article' })).toHaveAttribute(
    'href',
    '/shared-research/ro-42',
  );
});

it('links each team name to its team detail page', () => {
  const teams: CollaboratingTeam[] = [
    {
      id: 'team-xyz',
      displayName: 'Team XYZ',
      articles: [{ id: 'a-1', title: 'A1', type: 'Preprint' }],
    },
  ];

  renderWithRouter(<CollaboratingTeams collaboratingTeams={teams} />);
  expect(screen.getByRole('link', { name: 'Team XYZ' })).toHaveAttribute(
    'href',
    '/network/teams/team-xyz',
  );
});

it('picks each team’s icon from its own team type', () => {
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

  renderWithRouter(<CollaboratingTeams collaboratingTeams={teams} />);

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

it('expands when clicking the row, but not when clicking the team link', async () => {
  const teams: CollaboratingTeam[] = [
    {
      id: 'team-a',
      displayName: 'Team Alpha',
      articles: [{ id: 'a-1', title: 'Alpha One', type: 'Preprint' }],
    },
  ];

  renderWithRouter(<CollaboratingTeams collaboratingTeams={teams} />);

  // Clicking the link itself does NOT toggle the row
  await userEvent.click(screen.getByRole('link', { name: 'Team Alpha' }));
  expect(screen.queryByText('Alpha One')).not.toBeInTheDocument();

  // Clicking elsewhere in the row DOES toggle
  await userEvent.click(screen.getByText(/1 Article$/));
  expect(screen.getByText('Alpha One')).toBeInTheDocument();
});

it('toggles a row via Enter and Space keys', async () => {
  const teams: CollaboratingTeam[] = [
    {
      id: 'team-a',
      displayName: 'Team Alpha',
      articles: [{ id: 'a-1', title: 'Alpha One', type: 'Preprint' }],
    },
  ];

  renderWithRouter(<CollaboratingTeams collaboratingTeams={teams} />);

  const row = screen.getByRole('button', {
    name: /Expand Team Alpha articles/i,
  });
  row.focus();

  await userEvent.keyboard('{Enter}');
  expect(screen.getByText('Alpha One')).toBeInTheDocument();

  await userEvent.keyboard(' ');
  expect(screen.queryByText('Alpha One')).not.toBeInTheDocument();
});
