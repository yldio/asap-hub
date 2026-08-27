import { createTeamResponseMembers } from '@asap-hub/fixtures';
import { dashboard, network } from '@asap-hub/routing';
import { fireEvent } from '@testing-library/dom';
import { render, screen, within } from '@testing-library/react';
import { formatISO } from 'date-fns';
import { ComponentProps } from 'react';
import TeamProfileHeader from '../TeamProfileHeader';

const boilerplateProps: ComponentProps<typeof TeamProfileHeader> = {
  id: '42',
  teamId: 'TI1',
  grantId: '000123',
  teamType: 'Discovery Team',
  displayName: 'John, D',
  projectTitle: 'Unknown',
  members: [],
  tags: [],
  lastModifiedDate: formatISO(new Date()),
  teamListElementId: '',
  labCount: 15,
  upcomingEventsCount: 0,
  pastEventsCount: 0,
  projectType: 'Discovery Project',
  isStaff: false,
  teamStatus: 'Active',
  labs: [],
};

it('renders the name as the top-level heading', () => {
  render(<TeamProfileHeader {...boilerplateProps} displayName="John, D" />);

  expect(screen.getByRole('heading')).toHaveTextContent('John, D');
  expect(screen.getByRole('heading').tagName).toBe('H1');
});

it('renders the tag for inactive teams', () => {
  render(
    <TeamProfileHeader
      {...boilerplateProps}
      inactiveSince="2022-09-30T09:00:00Z"
      teamStatus="Inactive"
    />,
  );
  expect(screen.getByText('Inactive', { selector: 'span' })).toBeVisible();
  expect(screen.getByTitle('Inactive Team')).toBeInTheDocument();
});

it('does not render the tag for active teams', () => {
  render(<TeamProfileHeader {...boilerplateProps} inactiveSince={undefined} />);
  expect(screen.queryByText('Inactive')).not.toBeInTheDocument();
});

it('renders a list of members', () => {
  render(
    <TeamProfileHeader
      {...boilerplateProps}
      members={[
        {
          id: '42',
          firstName: 'Unknown',
          lastName: 'Unknown',
          displayName: 'Unknown',
          email: 'foo@bar.com',
          avatarUrl: 'https://example.com',
          role: 'Collaborating PI',
        },
      ]}
    />,
  );
  expect(screen.getAllByRole('img')).toHaveLength(1);
});

it('renders members with multiple roles only once', () => {
  const member = {
    id: '42',
    firstName: 'Unknown',
    lastName: 'Unknown',
    displayName: 'Unknown',
    email: 'foo@bar.com',
    avatarUrl: 'https://example.com',
  };
  render(
    <TeamProfileHeader
      {...boilerplateProps}
      members={[
        { ...member, role: 'Collaborating PI' },
        { ...member, role: 'Key Personnel' },
      ]}
    />,
  );
  expect(screen.getAllByRole('img')).toHaveLength(1);
});

it('does not render past members (alumni or inactive)', () => {
  const member = {
    firstName: 'Unknown',
    lastName: 'Unknown',
    displayName: 'Unknown',
    email: 'foo@bar.com',
    avatarUrl: 'https://example.com',
    role: 'Collaborating PI' as const,
  };
  render(
    <TeamProfileHeader
      {...boilerplateProps}
      members={[
        { ...member, id: 'active' },
        { ...member, id: 'alumni', alumniSinceDate: '2024-01-01' },
        { ...member, id: 'inactive', inactiveSinceDate: '2024-01-01' },
      ]}
    />,
  );
  expect(screen.getAllByRole('img')).toHaveLength(1);
});

it('renders no more than 5 members', () => {
  render(
    <TeamProfileHeader
      {...boilerplateProps}
      members={createTeamResponseMembers({ teamMembers: 6 })}
    />,
  );
  expect(screen.getAllByLabelText(/pic.+ of .+/)).toHaveLength(5);
  expect(screen.getByLabelText(/\+1/)).toBeVisible();
});

it('renders a contact button when there is a pointOfContact', () => {
  render(
    <TeamProfileHeader {...boilerplateProps} pointOfContact="test@test.com" />,
  );

  expect(screen.getByText('Contact').parentElement).toHaveAttribute(
    'href',
    'mailto:test@test.com',
  );
});

it('renders a lab count for multiple labs', () => {
  render(<TeamProfileHeader {...boilerplateProps} labCount={23} />);

  expect(screen.getByText(/23 Labs/i)).toBeVisible();
});

it('renders a lab count for a single lab using singular form', () => {
  render(<TeamProfileHeader {...boilerplateProps} labCount={1} />);

  expect(screen.getByText(/1 Lab(?!s)/i)).toBeVisible();
});

it('does not display labs when 0 labs are available', () => {
  render(<TeamProfileHeader {...boilerplateProps} labCount={0} />);

  expect(screen.queryByText(/Labs/i)).toBeNull();
});

it('does not display labs if isAsapTeam is true', () => {
  render(<TeamProfileHeader {...boilerplateProps} isAsapTeam labCount={5} />);

  expect(screen.queryByText(/Labs/i)).toBeNull();
});

it('renders tabs', () => {
  render(<TeamProfileHeader {...boilerplateProps} />);
  expect(
    within(screen.getByRole('navigation', { name: 'tabs' }))
      .getAllByRole('link')
      .map(({ textContent }) => textContent),
  ).toEqual(['About', 'Outputs (0)', 'Upcoming Events (0)', 'Past Events (0)']);
});

it('does not render upcoming events tab when team is inactive', () => {
  render(
    <TeamProfileHeader
      {...boilerplateProps}
      inactiveSince="2022-09-30T09:00:00Z"
      teamStatus="Inactive"
    />,
  );
  expect(
    within(screen.getByRole('navigation', { name: 'tabs' }))
      .getAllByRole('link')
      .map(({ textContent }) => textContent),
  ).toEqual(['About', 'Outputs (0)', 'Past Events (0)']);
});

it('renders workspace tabs when tools provided', () => {
  render(
    <TeamProfileHeader
      {...boilerplateProps}
      tools={[{ name: '', description: '', url: '' }]}
    />,
  );
  expect(
    within(screen.getByRole('navigation', { name: 'tabs' }))
      .getAllByRole('link')
      .map(({ textContent }) => textContent),
  ).toEqual([
    'About',
    'Team Workspace',
    'Outputs (0)',
    'Upcoming Events (0)',
    'Past Events (0)',
  ]);
});

it('renders compliance tabs when is ASAP team and is staff', () => {
  render(
    <TeamProfileHeader
      {...boilerplateProps}
      isAsapTeam
      isStaff
      manuscriptsCount={0}
    />,
  );
  expect(
    within(screen.getByRole('navigation', { name: 'tabs' }))
      .getAllByRole('link')
      .map(({ textContent }) => textContent),
  ).toEqual([
    'About',
    'Team Workspace',
    'Compliance (0)',
    'Outputs (0)',
    'Upcoming Events (0)',
    'Past Events (0)',
  ]);
});

it('displays upcoming event count when team is active', () => {
  render(
    <TeamProfileHeader
      {...boilerplateProps}
      inactiveSince={undefined}
      upcomingEventsCount={11}
    />,
  );

  const link = screen.getByRole('link', { name: /upcoming events \(11\)/i });
  expect(link).toBeVisible();
});

it('displays past event count', () => {
  render(<TeamProfileHeader {...boilerplateProps} pastEventsCount={11} />);

  expect(screen.getByText('Past Events (11)')).toBeVisible();
});

it('displays shared output count', () => {
  render(<TeamProfileHeader {...boilerplateProps} teamOutputsCount={11} />);

  expect(screen.getByText('Outputs (11)')).toBeVisible();
});

it('displays the draft shared output count', () => {
  render(<TeamProfileHeader {...boilerplateProps} teamDraftOutputsCount={5} />);
  expect(screen.getByText('Draft Outputs (5)')).toBeVisible();
  render(<TeamProfileHeader {...boilerplateProps} teamDraftOutputsCount={0} />);
  expect(screen.getByText('Draft Outputs (0)')).toBeVisible();
});

it('does not display the draft shared output count', () => {
  render(
    <TeamProfileHeader
      {...boilerplateProps}
      teamDraftOutputsCount={undefined}
    />,
  );
  expect(screen.queryByText('Draft Outputs')).toBeNull();
});

describe('copy button', () => {
  const originalNavigator = window.navigator;
  Object.assign(window.navigator, {
    clipboard: {
      writeText: () => {},
    },
  });

  beforeEach(() => {
    jest.spyOn(window.navigator.clipboard, 'writeText');
  });
  afterEach(() => {
    Object.assign(window.navigator, originalNavigator);
  });

  it('adds pm email to clipboard when user clicks on copy button', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });
    jest.spyOn(navigator.clipboard, 'writeText');
    render(
      <TeamProfileHeader {...boilerplateProps} pointOfContact="pm@asap.com" />,
    );

    fireEvent.click(screen.getByTitle(/copy/i));
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith(
      expect.stringMatching(/pm@asap.com/i),
    );
  });
});

it('renders project icon and links to discovery project when linkedProjectId and projectType are present', () => {
  render(
    <TeamProfileHeader
      {...boilerplateProps}
      teamType="Discovery Team"
      projectType="Discovery Project"
      linkedProjectId="123"
      projectTitle="Test Project"
    />,
  );
  expect(screen.getByText('Test Project').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/discovery\/123/),
  );
});

it('renders project icon and links to resource project when linkedProjectId and projectType are present', () => {
  render(
    <TeamProfileHeader
      {...boilerplateProps}
      teamType="Resource Team"
      projectType="Resource Project"
      linkedProjectId="456"
      projectTitle="Resource Test Project"
    />,
  );
  expect(
    screen.getByText('Resource Test Project').closest('a'),
  ).toHaveAttribute('href', expect.stringMatching(/resource\/456/));
});

it('renders the Discovery Project icon for Discovery Team', () => {
  render(
    <TeamProfileHeader
      {...boilerplateProps}
      teamType="Discovery Team"
      linkedProjectId="123"
      projectTitle="Test Project"
    />,
  );
  expect(screen.getByTestId('project-icon')).toContainHTML('<svg');
});

it('renders the Resource Project icon for Resource Team', () => {
  render(
    <TeamProfileHeader
      {...boilerplateProps}
      teamType="Resource Team"
      linkedProjectId="123"
      projectTitle="Test Project"
    />,
  );
  expect(screen.getByTestId('project-icon')).toContainHTML('<svg');
});

it('renders breadcrumbs to the discovery teams list', () => {
  render(
    <TeamProfileHeader
      {...boilerplateProps}
      teamType="Discovery Team"
      displayName="John, D"
    />,
  );

  const breadcrumbs = within(
    screen.getByRole('navigation', { name: 'breadcrumbs' }),
  );
  expect(breadcrumbs.getByRole('link', { name: 'Home' })).toHaveAttribute(
    'href',
    dashboard({}).$,
  );
  expect(
    breadcrumbs.getByRole('link', { name: 'Discovery Teams' }),
  ).toHaveAttribute('href', network({}).discoveryTeams({}).$);
  expect(breadcrumbs.getByText('John, D')).toBeVisible();
});

it('renders breadcrumbs to the resource teams list', () => {
  render(<TeamProfileHeader {...boilerplateProps} teamType="Resource Team" />);

  const breadcrumbs = within(
    screen.getByRole('navigation', { name: 'breadcrumbs' }),
  );
  expect(
    breadcrumbs.getByRole('link', { name: 'Resource Teams' }),
  ).toHaveAttribute('href', network({}).resourceTeams({}).$);
});
