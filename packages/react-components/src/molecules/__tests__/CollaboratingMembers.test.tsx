import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { CollaboratingMember } from '@asap-hub/model';

import CollaboratingMembers from '../CollaboratingMembers';

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

const makeMembers = (count: number): CollaboratingMember[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    displayName: `User ${String.fromCharCode(65 + i)}`,
    alumniSinceDate: undefined,
    teams: [{ id: `team-${i}`, displayName: `Team ${i}` }],
    articles: [
      { id: `article-${i}-1`, title: `Article ${i}-1`, type: 'Preprint' },
    ],
  }));

it('renders the empty state when there are no collaborating members', () => {
  renderWithRouter(<CollaboratingMembers collaboratingMembers={[]} />);
  expect(
    screen.getByText(/no member collaborations on this project/i),
  ).toBeInTheDocument();
});

it('renders a custom empty state message', () => {
  renderWithRouter(
    <CollaboratingMembers
      collaboratingMembers={[]}
      emptyStateMessage="Nothing here"
    />,
  );
  expect(screen.getByText('Nothing here')).toBeInTheDocument();
});

it('renders each member with their article count and expands to show articles', async () => {
  const members: CollaboratingMember[] = [
    {
      id: 'user-a',
      displayName: 'Alice Johnson',
      alumniSinceDate: undefined,
      teams: [{ id: 'team-1', displayName: 'Team Alpha' }],
      articles: [
        { id: 'a-1', title: 'First Paper', type: 'Preprint' },
        { id: 'a-2', title: 'Second Paper', type: 'Published' },
      ],
    },
  ];

  renderWithRouter(<CollaboratingMembers collaboratingMembers={members} />);
  expect(screen.getByText(/2 Articles/)).toBeInTheDocument();

  await userEvent.click(
    screen.getByRole('button', { name: /Expand Alice Johnson articles/i }),
  );
  expect(screen.getByText('First Paper')).toBeInTheDocument();
  expect(screen.getByText('Second Paper')).toBeInTheDocument();
  expect(screen.getByText('Publication')).toBeInTheDocument();
  expect(screen.getByText('Preprint')).toBeInTheDocument();
});

it('shows View More when there are more than 8 members and reveals the rest', async () => {
  renderWithRouter(
    <CollaboratingMembers collaboratingMembers={makeMembers(10)} />,
  );

  expect(
    screen.getAllByRole('button', { name: /Expand User [A-Z] articles/ }),
  ).toHaveLength(8);

  await userEvent.click(
    screen.getByRole('button', { name: /View More Collaborators/i }),
  );
  expect(
    screen.getAllByRole('button', { name: /Expand User [A-Z] articles/ }),
  ).toHaveLength(10);
});

it('makes the articles list scrollable when there are more than 7 articles', async () => {
  const members: CollaboratingMember[] = [
    {
      id: 'user-many',
      displayName: 'Alice Johnson',
      alumniSinceDate: undefined,
      teams: [{ id: 'team-1', displayName: 'Team Alpha' }],
      articles: Array.from({ length: 8 }, (_, i) => ({
        id: `m-${i}`,
        title: `Many ${i}`,
        type: 'Preprint' as const,
      })),
    },
  ];

  renderWithRouter(<CollaboratingMembers collaboratingMembers={members} />);
  await userEvent.click(
    screen.getByRole('button', { name: /Expand Alice Johnson articles/i }),
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
  const members: CollaboratingMember[] = [
    {
      id: 'user-a',
      displayName: 'Alice Johnson',
      alumniSinceDate: undefined,
      teams: [{ id: 'team-1', displayName: 'Team Alpha' }],
      articles: [{ id: 'ro-42', title: 'Some Article', type: 'Preprint' }],
    },
  ];

  renderWithRouter(<CollaboratingMembers collaboratingMembers={members} />);
  await userEvent.click(
    screen.getByRole('button', { name: /Expand Alice Johnson articles/i }),
  );

  expect(screen.getByRole('link', { name: 'Some Article' })).toHaveAttribute(
    'href',
    '/shared-research/ro-42',
  );
});

it('links the member name to their user profile page', () => {
  const members: CollaboratingMember[] = [
    {
      id: 'user-xyz',
      displayName: 'Alice Johnson',
      alumniSinceDate: undefined,
      teams: [{ id: 'team-1', displayName: 'Team Alpha' }],
      articles: [{ id: 'a-1', title: 'A1', type: 'Preprint' }],
    },
  ];

  renderWithRouter(<CollaboratingMembers collaboratingMembers={members} />);
  expect(screen.getByRole('link', { name: 'Alice Johnson' })).toHaveAttribute(
    'href',
    '/network/users/user-xyz',
  );
});

it('shows team name and links to the team for a member on one team', () => {
  const members: CollaboratingMember[] = [
    {
      id: 'user-a',
      displayName: 'Alice Johnson',
      alumniSinceDate: undefined,
      teams: [{ id: 'team-xyz', displayName: 'Team Alpha' }],
      articles: [{ id: 'a-1', title: 'A1', type: 'Preprint' }],
    },
  ];

  renderWithRouter(<CollaboratingMembers collaboratingMembers={members} />);
  expect(screen.getByRole('link', { name: 'Team Alpha' })).toHaveAttribute(
    'href',
    '/network/teams/team-xyz',
  );
});

it('shows "Multiple teams" linking to the user profile for a member on more than one team', () => {
  const members: CollaboratingMember[] = [
    {
      id: 'user-a',
      displayName: 'Alice Johnson',
      alumniSinceDate: undefined,
      teams: [
        { id: 'team-1', displayName: 'Team Alpha' },
        { id: 'team-2', displayName: 'Team Beta' },
      ],
      articles: [{ id: 'a-1', title: 'A1', type: 'Preprint' }],
    },
  ];

  renderWithRouter(<CollaboratingMembers collaboratingMembers={members} />);
  expect(screen.getByRole('link', { name: 'Multiple teams' })).toHaveAttribute(
    'href',
    '/network/users/user-a',
  );
});

it('does not render a team name for a member on no teams', () => {
  const members: CollaboratingMember[] = [
    {
      id: 'user-c',
      displayName: 'Charlie Chavez',
      alumniSinceDate: undefined,
      teams: [],
      articles: [{ id: 'a-1', title: 'A1', type: 'Preprint' }],
    },
  ];

  renderWithRouter(<CollaboratingMembers collaboratingMembers={members} />);
  expect(screen.queryByText(/team/i)).not.toBeInTheDocument();
});

it('expands when clicking the row, but not when clicking the member name link', async () => {
  const members: CollaboratingMember[] = [
    {
      id: 'user-a',
      displayName: 'Alice Johnson',
      alumniSinceDate: undefined,
      teams: [{ id: 'team-1', displayName: 'Team Alpha' }],
      articles: [{ id: 'a-1', title: 'First Paper', type: 'Preprint' }],
    },
  ];

  renderWithRouter(<CollaboratingMembers collaboratingMembers={members} />);

  // Clicking the name link does NOT toggle the row
  await userEvent.click(screen.getByRole('link', { name: 'Alice Johnson' }));
  expect(screen.queryByText('First Paper')).not.toBeInTheDocument();

  // Clicking elsewhere in the row DOES toggle
  await userEvent.click(screen.getByText(/1 Article$/));
  expect(screen.getByText('First Paper')).toBeInTheDocument();
});

it('toggles a row via Enter and Space keys', async () => {
  const members: CollaboratingMember[] = [
    {
      id: 'user-a',
      displayName: 'Alice Johnson',
      alumniSinceDate: undefined,
      teams: [{ id: 'team-1', displayName: 'Team Alpha' }],
      articles: [{ id: 'a-1', title: 'First Paper', type: 'Preprint' }],
    },
  ];

  renderWithRouter(<CollaboratingMembers collaboratingMembers={members} />);

  const row = screen.getByRole('button', {
    name: /Expand Alice Johnson articles/i,
  });
  row.focus();

  await userEvent.keyboard('{Enter}');
  expect(screen.getByText('First Paper')).toBeInTheDocument();

  await userEvent.keyboard(' ');
  expect(screen.queryByText('First Paper')).not.toBeInTheDocument();
});
