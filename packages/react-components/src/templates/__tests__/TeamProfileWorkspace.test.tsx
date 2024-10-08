import { createTeamResponse } from '@asap-hub/fixtures';
import { disable, enable } from '@asap-hub/flags';
import {
  getByText as getChildByText,
  render,
  waitFor,
  screen,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { ComponentProps } from 'react';
import { Route, Router } from 'react-router-dom';

import TeamProfileWorkspace from '../TeamProfileWorkspace';

beforeEach(jest.clearAllMocks);

const team: ComponentProps<typeof TeamProfileWorkspace> = {
  ...createTeamResponse({ teamMembers: 1, tools: 0 }),
  setEligibilityReasons: jest.fn(),
  tools: [],
};
it('renders the team workspace page', () => {
  const { getByRole } = render(<TeamProfileWorkspace {...team} tools={[]} />);

  expect(
    getByRole('heading', { name: 'Collaboration Tools (Team Only)' }),
  ).toBeInTheDocument();
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
          title: 'Nice manuscript',
          versions: [],
        },
        {
          id: '2',
          title: 'A Good Manuscript',
          versions: [],
        },
      ],
    };
    enable('DISPLAY_MANUSCRIPTS');
    const { getByRole, queryByRole, rerender } = render(
      <TeamProfileWorkspace {...teamWithManuscripts} tools={[]} />,
    );
    expect(
      getByRole('heading', { name: 'Compliance Review' }),
    ).toBeInTheDocument();

    disable('DISPLAY_MANUSCRIPTS');
    rerender(<TeamProfileWorkspace {...teamWithManuscripts} tools={[]} />);
    expect(queryByRole('heading', { name: 'Compliance' })).toBeNull();
  });

  it('renders all manuscript titles', () => {
    const teamWithManuscripts: ComponentProps<typeof TeamProfileWorkspace> = {
      ...team,
      manuscripts: [
        {
          id: '1',
          title: 'Nice manuscript',
          versions: [],
        },
        {
          id: '2',
          title: 'A Good Manuscript',
          versions: [],
        },
      ],
    };
    const { container } = render(
      <TeamProfileWorkspace {...teamWithManuscripts} tools={[]} />,
    );
    expect(container).toHaveTextContent('Nice manuscript');
    expect(container).toHaveTextContent('A Good Manuscript');
  });

  it('renders type and lifecycle values when expanded', () => {
    const teamWithManuscripts: ComponentProps<typeof TeamProfileWorkspace> = {
      ...team,
      manuscripts: [
        {
          id: '1',
          title: 'Nice manuscript',
          versions: [
            {
              type: 'Original Research',
              lifecycle: 'Draft Manuscript(prior to Publication)',
              manuscriptFile: {
                url: 'http://example.com/file.pdf',
                filename: 'file.pdf',
                id: 'file-id',
              },
              createdBy: {
                displayName: 'John Doe',
                firstName: 'John',
                lastName: 'Doe',
                id: 'john-doe',
                teams: [{ id: 'alessi', name: 'Alessi' }],
                avatarUrl: '',
                alumniSinceDate: undefined,
              },
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
            },
          ],
        },
        {
          id: '2',
          title: 'A Good Manuscript',
          versions: [
            {
              type: 'Review / Op-Ed / Letter / Hot Topic',
              lifecycle: 'Preprint',
              manuscriptFile: {
                url: 'http://example.com/file.pdf',
                filename: 'file.pdf',
                id: 'file-id',
              },
              createdBy: {
                displayName: 'Jane Doe',
                firstName: 'Jane',
                lastName: 'Doe',
                id: 'jane-doe',
                teams: [{ id: 'de-camilli', name: 'De Camilli' }],
                avatarUrl: '',
                alumniSinceDate: undefined,
              },
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
            },
          ],
        },
      ],
    };
    const { container } = render(
      <TeamProfileWorkspace {...teamWithManuscripts} tools={[]} />,
    );

    expect(container).not.toHaveTextContent('Original Research');
    expect(container).not.toHaveTextContent(
      'Draft Manuscript(prior to Publication)',
    );

    const manuscriptTitle = screen.getByText('Nice manuscript');
    const manuscriptCard = manuscriptTitle.closest('div');
    userEvent.click(within(manuscriptCard!).getByRole('button'));

    expect(container).toHaveTextContent('Original Research');
    expect(container).toHaveTextContent(
      'Draft Manuscript(prior to Publication)',
    );
  });

  it('renders eligibility modal when user clicks on Share Manuscript', () => {
    const { container, getByRole } = render(
      <TeamProfileWorkspace {...team} tools={[]} />,
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
