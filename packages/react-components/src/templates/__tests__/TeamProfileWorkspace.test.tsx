import { createTeamResponse } from '@asap-hub/fixtures';
import { disable, enable } from '@asap-hub/flags';
import {
  act,
  getByRole as getByRoleInContainer,
  getByTestId,
  getByText as getChildByText,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { ComponentProps } from 'react';
import { Route, Router } from 'react-router-dom';

import TeamProfileWorkspace from '../TeamProfileWorkspace';

jest.setTimeout(30000);
beforeEach(jest.clearAllMocks);

const useManuscriptByIdMock = jest.fn().mockImplementation((id: string) => [
  [
    {
      id: '1',
      count: 1,
      title: 'Nice manuscript',
      versions: [],
      discussions: [],
      teamId: 'WH1',
      grantId: '000282',
    },
    {
      id: '2',
      count: 2,
      title: 'A Good Manuscript',
      versions: [],
      discussions: [],
      teamId: 'CS1',
      grantId: '000301',
    },
  ].find((m) => m.id === id),
  jest.fn(),
]);

const team: ComponentProps<typeof TeamProfileWorkspace> = {
  ...createTeamResponse({ teamMembers: 1, tools: 0 }),
  setEligibilityReasons: jest.fn(),
  tools: [],
  isComplianceReviewer: false,
  onUpdateManuscript: jest.fn(),
  isTeamMember: true,
  createDiscussion: jest.fn(),
  useManuscriptById: useManuscriptByIdMock,
  onReplyToDiscussion: jest.fn(),
  onMarkDiscussionAsRead: jest.fn(),
};

it('renders the team workspace page', () => {
  const { getByRole } = render(
    <TeamProfileWorkspace
      {...team}
      useManuscriptById={useManuscriptByIdMock}
      tools={[]}
    />,
  );

  expect(
    getByRole('heading', { name: 'Collaboration Tools (Team Only)' }),
  ).toBeInTheDocument();
});

it('does not display Collaboration Tools section if user is not a team member', () => {
  const { queryByRole } = render(
    <TeamProfileWorkspace {...team} isTeamMember={false} tools={[]} />,
  );

  expect(
    queryByRole('heading', { name: 'Collaboration Tools (Team)' }),
  ).not.toBeInTheDocument();
});

describe('compliance section', () => {
  beforeAll(() => {
    enable('DISPLAY_MANUSCRIPTS');
  });

  afterAll(() => {
    disable('DISPLAY_MANUSCRIPTS');
  });

  it('renders compliance section when feature flag is enabled', () => {
    const teamWithManuscripts: ComponentProps<typeof TeamProfileWorkspace> = {
      ...team,
      manuscripts: [
        {
          id: '1',
          count: 1,
          title: 'Nice manuscript',
          versions: [],
          teamId: 'WH1',
          grantId: '000282',
        },
        {
          id: '2',
          count: 2,
          title: 'A Good Manuscript',
          versions: [],
          teamId: 'WH1',
          grantId: '000282',
        },
      ],
    };
    enable('DISPLAY_MANUSCRIPTS');
    const { getByRole, queryByRole, rerender } = render(
      <TeamProfileWorkspace
        {...teamWithManuscripts}
        useManuscriptById={useManuscriptByIdMock}
        tools={[]}
      />,
    );
    expect(
      getByRole('heading', { name: 'Compliance Review' }),
    ).toBeInTheDocument();

    disable('DISPLAY_MANUSCRIPTS');
    rerender(
      <TeamProfileWorkspace
        {...teamWithManuscripts}
        useManuscriptById={useManuscriptByIdMock}
        tools={[]}
      />,
    );
    expect(queryByRole('heading', { name: 'Compliance' })).toBeNull();
  });

  it('renders all manuscript titles', () => {
    const teamWithManuscripts: ComponentProps<typeof TeamProfileWorkspace> = {
      ...team,
      manuscripts: [
        {
          id: '1',
          count: 1,
          title: 'Nice manuscript',
          versions: [],
          teamId: 'WH1',
          grantId: '000282',
        },
        {
          id: '2',
          count: 2,
          title: 'A Good Manuscript',
          versions: [],
          teamId: 'WH1',
          grantId: '000282',
        },
      ],
    };
    const { container } = render(
      <TeamProfileWorkspace
        {...teamWithManuscripts}
        useManuscriptById={useManuscriptByIdMock}
        tools={[]}
      />,
    );
    expect(container).toHaveTextContent('Nice manuscript');
    expect(container).toHaveTextContent('A Good Manuscript');
  });

  it("should show team's manuscripts and contribution manuscripts in different sections", () => {
    const props: ComponentProps<typeof TeamProfileWorkspace> = {
      ...team,
      manuscripts: [
        {
          id: '1',
          count: 1,
          title: 'Nice manuscript',
          versions: [],
          teamId: 'WH1',
          grantId: '000282',
        },
      ],
      collaborationManuscripts: [
        {
          id: '2',
          count: 2,
          title: 'A Good Manuscript',
          versions: [],
          teamId: 'CS1',
          grantId: '000301',
        },
      ],
    };

    const { container } = render(
      <TeamProfileWorkspace
        {...props}
        useManuscriptById={useManuscriptByIdMock}
        tools={[]}
      />,
    );
    const teamManuscriptsSection = getByTestId(container, 'team-manuscripts');
    const collaborationManuscriptsSection = getByTestId(
      container,
      'collaboration-manuscripts',
    );

    expect(teamManuscriptsSection).toBeInTheDocument();
    expect(collaborationManuscriptsSection).toBeInTheDocument();
    expect(
      getByRoleInContainer(teamManuscriptsSection, 'heading', {
        name: 'Team Submission',
      }),
    ).toBeInTheDocument();
    expect(teamManuscriptsSection).toHaveTextContent('Nice manuscript');
    expect(
      getByRoleInContainer(collaborationManuscriptsSection, 'heading', {
        name: 'Collaborator Submission',
      }),
    ).toBeInTheDocument();
    expect(collaborationManuscriptsSection).toHaveTextContent(
      'A Good Manuscript',
    );
  });

  it('should show a no results message for both team manuscripts and collaboration manuscripts - team member', () => {
    const props: ComponentProps<typeof TeamProfileWorkspace> = {
      ...team,
      manuscripts: [],
      collaborationManuscripts: [],
    };

    const { container } = render(
      <TeamProfileWorkspace {...props} tools={[]} />,
    );

    const teamManuscriptsSection = getByTestId(container, 'team-manuscripts');
    const collaborationManuscriptsSection = getByTestId(
      container,
      'collaboration-manuscripts',
    );

    expect(teamManuscriptsSection).toBeInTheDocument();
    expect(collaborationManuscriptsSection).toBeInTheDocument();
    expect(teamManuscriptsSection).toHaveTextContent(
      'Your team has not submitted a manuscript for compliance review.',
    );
    expect(collaborationManuscriptsSection).toHaveTextContent(
      'Your team has not been listed as a contributor on manuscripts that were submitted for compliance review by other teams.',
    );
  });

  it('should show a no results message for both team manuscripts and collaboration manuscripts - hub staff, not team member', () => {
    const props: ComponentProps<typeof TeamProfileWorkspace> = {
      ...team,
      isTeamMember: false,
      manuscripts: [],
      collaborationManuscripts: [],
    };

    const { container } = render(
      <TeamProfileWorkspace {...props} tools={[]} />,
    );

    const teamManuscriptsSection = getByTestId(container, 'team-manuscripts');
    const collaborationManuscriptsSection = getByTestId(
      container,
      'collaboration-manuscripts',
    );

    expect(teamManuscriptsSection).toBeInTheDocument();
    expect(collaborationManuscriptsSection).toBeInTheDocument();
    expect(teamManuscriptsSection).toHaveTextContent(
      'This team has not submitted a manuscript for compliance review.',
    );
    expect(collaborationManuscriptsSection).toHaveTextContent(
      'This team has not been listed as a contributor on manuscripts that were submitted for compliance review by other teams.',
    );
  });

  it('renders type and lifecycle values when expanded', () => {
    const user = {
      displayName: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      id: 'john-doe',
      teams: [{ id: 'alessi', name: 'Alessi' }],
      avatarUrl: '',
      alumniSinceDate: undefined,
    };
    const teamWithManuscripts: ComponentProps<typeof TeamProfileWorkspace> = {
      ...team,
      manuscripts: [
        {
          id: '1',
          count: 1,
          title: 'Nice manuscript',
          teamId: 'WH1',
          grantId: '000282',
          versions: [
            {
              id: 'version-1',
              type: 'Original Research',
              lifecycle: 'Draft Manuscript (prior to Publication)',
              description: 'A description',
              count: 1,
              manuscriptFile: {
                url: 'http://example.com/file.pdf',
                filename: 'file.pdf',
                id: 'file-id',
              },
              createdBy: user,
              updatedBy: user,
              createdDate: '2020-12-10T20:36:54Z',
              publishedAt: '2020-12-10T20:36:54Z',
              teams: [
                {
                  id: 'team-1',
                  displayName: 'Team 1',
                  inactiveSince: undefined,
                },
                {
                  id: 'team-2',
                  displayName: 'Team 2',
                  inactiveSince: '2022-10-10T20:36:54Z',
                },
              ],
              labs: [{ name: 'Lab 1', id: 'lab-1' }],
              firstAuthors: [],
              correspondingAuthor: [],
              additionalAuthors: [],
            },
          ],
        },
        {
          id: '2',
          count: 2,
          title: 'A Good Manuscript',
          teamId: 'WH1',
          grantId: '000282',
          versions: [
            {
              id: 'version-1',
              type: 'Review / Op-Ed / Letter / Hot Topic',
              lifecycle: 'Preprint',
              description: 'Another description',
              count: 1,
              manuscriptFile: {
                url: 'http://example.com/file.pdf',
                filename: 'file.pdf',
                id: 'file-id',
              },
              createdBy: user,
              updatedBy: user,
              createdDate: '2020-12-10T20:36:54Z',
              publishedAt: '2020-12-10T20:36:54Z',
              teams: [
                {
                  id: 'team-1',
                  displayName: 'Team 1',
                  inactiveSince: undefined,
                },
                {
                  id: 'team-2',
                  displayName: 'Team 2',
                  inactiveSince: '2022-10-10T20:36:54Z',
                },
              ],
              labs: [{ name: 'Lab 1', id: 'lab-1' }],
              firstAuthors: [],
              correspondingAuthor: [],
              additionalAuthors: [],
            },
          ],
        },
      ],
    };
    const { container } = render(
      <TeamProfileWorkspace
        {...teamWithManuscripts}
        useManuscriptById={jest
          .fn()
          .mockImplementation((id) => [
            teamWithManuscripts.manuscripts.find((m) => m.id === id)!,
            jest.fn(),
          ])}
        tools={[]}
      />,
    );

    expect(container).not.toHaveTextContent('Original Research');
    expect(container).not.toHaveTextContent(
      'Draft Manuscript (prior to Publication)',
    );

    const manuscriptTitle = screen.getByText('Nice manuscript');
    const manuscriptCard = manuscriptTitle.closest('div');
    userEvent.click(within(manuscriptCard!).getByTestId('collapsible-button'));

    expect(container).toHaveTextContent('Original Research');
    expect(container).toHaveTextContent(
      'Draft Manuscript (prior to Publication)',
    );
  });

  it('does not show the submit manuscript button when team is inactive', () => {
    const { queryByRole } = render(
      <TeamProfileWorkspace {...team} inactiveSince="a date" tools={[]} />,
    );

    expect(
      queryByRole('button', { name: /submit manuscript/i }),
    ).not.toBeInTheDocument();
  });

  it('renders eligibility modal when user clicks on Share Manuscript', () => {
    const { container, getByRole } = render(
      <TeamProfileWorkspace
        {...team}
        useManuscriptById={useManuscriptByIdMock}
        tools={[]}
      />,
    );

    expect(container).not.toHaveTextContent(
      'Do you need to submit a manuscript?',
    );

    userEvent.click(getByRole('button', { name: /submit manuscript/i }));

    expect(container).toHaveTextContent('Do you need to submit a manuscript?');
  });

  it('hides the eligibility modal when user clicks on Cancel', () => {
    const { container, getByRole } = render(
      <TeamProfileWorkspace {...team} tools={[]} />,
    );

    userEvent.click(getByRole('button', { name: /submit manuscript/i }));

    expect(container).toHaveTextContent('Do you need to submit a manuscript?');

    userEvent.click(getByRole('button', { name: /cancel/i }));

    expect(container).not.toHaveTextContent(
      'Do you need to submit a manuscript?',
    );
  });

  it('redirects to manuscript form when user finishes to fill eligibility modal', () => {
    const history = createMemoryHistory({});
    const { getByRole } = render(
      <Router history={history}>
        <Route path="">
          <TeamProfileWorkspace {...team} tools={[]} />
        </Route>
      </Router>,
    );

    userEvent.click(getByRole('button', { name: /submit manuscript/i }));

    userEvent.click(screen.getByText(/Yes/i));

    userEvent.click(
      screen.getByText(
        'The manuscript resulted from a pivot that was made as part of the team’s ASAP-funded proposal.',
      ),
    );
    userEvent.click(screen.getByText(/Continue/i));

    expect(history.location.pathname).toBe(
      '/network/teams/t0/workspace/create-manuscript',
    );
  });

  it('scrolls to target manuscript when id is provided', async () => {
    jest.useFakeTimers();
    window.scrollTo = jest.fn();
    const teamWithManuscripts: ComponentProps<typeof TeamProfileWorkspace> = {
      ...team,
      manuscripts: [
        {
          id: '1',
          count: 1,
          title: 'Nice manuscript',
          versions: [],
          teamId: 'WH1',
          grantId: '000282',
        },
        {
          id: '2',
          count: 2,
          title: 'A Good Manuscript',
          versions: [],
          teamId: 'WH1',
          grantId: '000282',
        },
      ],
    };

    const { getByText } = render(
      <TeamProfileWorkspace
        {...teamWithManuscripts}
        useManuscriptById={useManuscriptByIdMock}
        tools={[]}
        targetManuscriptId="2"
      />,
    );

    expect(getByText('A Good Manuscript')).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(window.scrollTo).toHaveBeenCalled();
  });
});

it('renders contact project manager when point of contact provided', () => {
  const { getByText } = render(
    <TeamProfileWorkspace
      {...team}
      pointOfContact={{
        displayName: 'Mr PM',
        firstName: 'Mr',
        lastName: 'PM',
        email: 'test@example.com',
        id: '123',
        role: 'Project Manager',
      }}
    />,
  );

  const link = getByText('Mr PM', {
    selector: 'a',
  }) as HTMLAnchorElement;

  expect(link.href).toContain('test@example.com');
  expect(getByText('Team Contact Email')).toBeVisible();
});

it('does not render contact project manager when user is not part a team member', () => {
  const { queryByText } = render(
    <TeamProfileWorkspace
      {...team}
      isTeamMember={false}
      pointOfContact={{
        displayName: 'Mr PM',
        firstName: 'Mr',
        lastName: 'PM',
        email: 'test@example.com',
        id: '123',
        role: 'Project Manager',
      }}
    />,
  );

  expect(queryByText('Team Contact Email')).not.toBeInTheDocument();
});

it('omits contact project manager when point of contact omitted', () => {
  const { queryByText } = render(
    <TeamProfileWorkspace {...team} pointOfContact={undefined} />,
  );

  expect(queryByText('Team Contact Email')).toBe(null);
});

describe('a tool', () => {
  it('is rendered when provided', () => {
    const { getByText } = render(
      <TeamProfileWorkspace
        {...team}
        tools={[
          {
            name: 'Signal',
            description: 'Our chat tool',
            url: 'https://signal.group/our',
          },
        ]}
      />,
    );

    expect(getByText('Signal')).toBeVisible();
  });

  it('has edit links', () => {
    const { getByText } = render(
      <TeamProfileWorkspace
        {...team}
        tools={[
          {
            name: 'Signal',
            description: 'Our chat tool',
            url: 'https://signal.group/our',
          },
          {
            name: 'Discord',
            description: 'Our call tool',
            url: 'https://discord.gg/our',
          },
        ]}
      />,
    );
    const signalCard = getByText('Signal').closest('li')!;
    expect(getChildByText(signalCard, /edit/i).closest('a')).toHaveAttribute(
      'href',
      expect.stringMatching(/\/0(\D|$)/),
    );
    const discordCard = getByText('Discord').closest('li')!;
    expect(getChildByText(discordCard, /edit/i).closest('a')).toHaveAttribute(
      'href',
      expect.stringMatching(/\/1(\D|$)/),
    );
  });

  it('has a delete button', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    const handleDeleteTool = jest.fn();
    const { getByText } = render(
      <TeamProfileWorkspace
        {...team}
        tools={[
          {
            name: 'Signal',
            description: 'Our chat tool',
            url: 'https://signal.group/our',
          },
          {
            name: 'Discord',
            description: 'Our call tool',
            url: 'https://discord.gg/our',
          },
        ]}
        onDeleteTool={handleDeleteTool}
      />,
    );
    const discordCard = getByText('Discord').closest('li')!;

    userEvent.click(getChildByText(discordCard, /delete/i));

    await waitFor(() => expect(handleDeleteTool).toHaveBeenCalledWith(1));
  });
});
