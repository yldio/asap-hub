import { createTeamResponseMembers } from '@asap-hub/fixtures';
import { TeamRole } from '@asap-hub/model';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { fireEvent } from '@testing-library/dom';
import { render, screen } from '@testing-library/react';
import { formatISO } from 'date-fns';
import { ComponentProps } from 'react';
import TeamProfileHeader from '../TeamProfileHeader';

const boilerplateProps: ComponentProps<typeof TeamProfileHeader> = {
  id: '42',
  teamId: 'TI1',
  grantId: '000123',
  displayName: 'John, D',
  projectTitle: 'Unknown',
  members: [],
  tags: [],
  manuscripts: [],
  lastModifiedDate: formatISO(new Date()),
  teamListElementId: '',
  labCount: 15,
  upcomingEventsCount: 0,
  pastEventsCount: 0,
  isStaff: false,
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
    <TeamProfileHeader
      {...boilerplateProps}
      pointOfContact={{
        id: 'uuid',
        displayName: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        role: 'Project Manager',
      }}
    />,
  );

  expect(screen.getByText('Contact PM').parentElement).toHaveAttribute(
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

it('renders tabs', () => {
  render(<TeamProfileHeader {...boilerplateProps} />);
  expect(
    screen.getAllByRole('link').map(({ textContent }) => textContent),
  ).toEqual(['About', 'Outputs (0)', 'Upcoming Events (0)', 'Past Events (0)']);
});

it('does not render upcoming events tab when team is inactive', () => {
  render(
    <TeamProfileHeader
      {...boilerplateProps}
      inactiveSince="2022-09-30T09:00:00Z"
    />,
  );
  expect(
    screen.getAllByRole('link').map(({ textContent }) => textContent),
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
    screen.getAllByRole('link').map(({ textContent }) => textContent),
  ).toEqual([
    'About',
    'Team Workspace',
    'Outputs (0)',
    'Upcoming Events (0)',
    'Past Events (0)',
  ]);
});

describe('Share an output button dropdown', () => {
  const renderWithPermissionsContext = (
    canShareResearchOutput: boolean = true,
  ) =>
    render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canShareResearchOutput,
          canEditResearchOutput: true,
          canPublishResearchOutput: true,
        }}
      >
        <TeamProfileHeader {...boilerplateProps} />,
      </ResearchOutputPermissionsContext.Provider>,
    );

  it('renders share an output button when user can share research output', () => {
    renderWithPermissionsContext();

    expect(
      screen.queryByText(/article/i, { selector: 'span' }),
    ).not.toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: /Share an output/i }));
    expect(screen.getByText(/article/i, { selector: 'span' })).toBeVisible();
    expect(
      screen.getByText(/article/i, { selector: 'span' }).closest('a'),
    ).toHaveAttribute('href', '/network/teams/42/create-output/article');
  });

  it('does not render share an output button dropdown when user cannot share research output', () => {
    renderWithPermissionsContext(false);

    expect(
      screen.queryByRole('button', { name: /Share an output/i }),
    ).not.toBeInTheDocument();
  });
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
      <TeamProfileHeader
        {...boilerplateProps}
        pointOfContact={{
          id: 'uuid',
          displayName: 'Patricia Mendes',
          firstName: 'Patricia',
          lastName: 'Mendes',
          role: 'Project Manager' as TeamRole,
          email: 'pm@asap.com',
        }}
      />,
    );

    fireEvent.click(screen.getByTitle(/copy/i));
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith(
      expect.stringMatching(/pm@asap.com/i),
    );
  });
});
