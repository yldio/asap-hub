import {
  AlgoliaSearchClient,
  AnalyticsSearchOptionsWithFiltering,
} from '@asap-hub/algolia';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import {
  teamCollaborationPerformance,
  userCollaborationPerformance,
} from '@asap-hub/fixtures';
import { createCsvFileStream } from '@asap-hub/frontend-utils';
import {
  ListTeamCollaborationAlgoliaResponse,
  ListUserCollaborationAlgoliaResponse,
} from '@asap-hub/model';
import { analytics } from '@asap-hub/routing';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { useAnalyticsAlgolia } from '../../../hooks/algolia';
import {
  getTeamCollaboration,
  getTeamCollaborationPerformance,
  getUserCollaboration,
  getUserCollaborationPerformance,
} from '../api';
import Collaboration from '../Collaboration';

jest.mock('@asap-hub/frontend-utils', () => {
  const original = jest.requireActual('@asap-hub/frontend-utils');
  return {
    ...original,
    createCsvFileStream: jest
      .fn()
      .mockImplementation(() => ({ write: jest.fn(), end: jest.fn() })),
  };
});
jest.mock('../api');
jest.mock('../../../hooks/algolia', () => ({
  useAnalyticsAlgolia: jest.fn(),
}));
mockConsoleError();

afterEach(() => {
  jest.clearAllMocks();
});

const mockCreateCsvFileStream = createCsvFileStream as jest.MockedFunction<
  typeof createCsvFileStream
>;

const mockGetUserCollaboration = getUserCollaboration as jest.MockedFunction<
  typeof getUserCollaboration
>;
const mockGetTeamCollaboration = getTeamCollaboration as jest.MockedFunction<
  typeof getTeamCollaboration
>;

const mockGetTeamCollaborationPerformance =
  getTeamCollaborationPerformance as jest.MockedFunction<
    typeof getTeamCollaborationPerformance
  >;
mockGetTeamCollaborationPerformance.mockResolvedValue(
  teamCollaborationPerformance,
);

const mockGetUserCollaborationPerformance =
  getUserCollaborationPerformance as jest.MockedFunction<
    typeof getUserCollaborationPerformance
  >;
mockGetUserCollaborationPerformance.mockResolvedValue(
  userCollaborationPerformance,
);

const mockSearchForTagValues = jest.fn() as jest.MockedFunction<
  AlgoliaSearchClient<'analytics'>['searchForTagValues']
>;
const mockUseAnalyticsAlgolia = useAnalyticsAlgolia as jest.MockedFunction<
  typeof useAnalyticsAlgolia
>;

const userData: ListUserCollaborationAlgoliaResponse = {
  total: 2,
  items: [
    {
      id: '1',
      alumniSince: undefined,
      name: 'User',
      teams: [
        {
          id: '1',
          team: 'Team A',
          role: 'Key Personnel',
          teamInactiveSince: undefined,
          outputsCoAuthoredWithinTeam: 300,
          outputsCoAuthoredAcrossTeams: 400,
        },
      ],
      totalUniqueOutputsCoAuthoredAcrossTeams: 400,
      totalUniqueOutputsCoAuthoredWithinTeam: 300,
      objectID: '1',
    },
    {
      id: '2',
      alumniSince: undefined,
      name: 'User',
      teams: [
        {
          id: '1',
          team: 'Team A',
          role: 'Key Personnel',
          teamInactiveSince: undefined,
          outputsCoAuthoredWithinTeam: 2,
          outputsCoAuthoredAcrossTeams: 3,
        },
      ],
      totalUniqueOutputsCoAuthoredAcrossTeams: 3,
      totalUniqueOutputsCoAuthoredWithinTeam: 2,
      objectID: '2',
    },
  ],
};

const teamData: ListTeamCollaborationAlgoliaResponse = {
  total: 1,
  items: [
    {
      id: '1',
      inactiveSince: undefined,
      name: 'Team 1',
      outputsCoProducedWithin: {
        Article: 100,
        Bioinformatics: 0,
        Dataset: 0,
        'Lab Resource': 0,
        Protocol: 1,
      },
      outputsCoProducedAcross: {
        byDocumentType: {
          Article: 1,
          Bioinformatics: 0,
          Dataset: 0,
          'Lab Resource': 0,
          Protocol: 1,
        },
        byTeam: [
          {
            id: '2',
            name: 'Team 2',
            isInactive: false,
            Article: 1,
            Bioinformatics: 0,
            Dataset: 0,
            'Lab Resource': 0,
            Protocol: 1,
          },
        ],
      },
      objectID: '1',
    },
  ],
};

const renderPage = async (
  metric: string = 'user',
  type: string = 'within-team',
) => {
  const path = analytics({})
    .collaboration({})
    .collaborationPath({ metric, type }).$;
  const result = render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[path]}>
              <Route path="/analytics/collaboration/:metric/:type">
                <Collaboration />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );

  return result;
};

beforeEach(() => {
  const mockAlgoliaClient = {
    searchForTagValues: mockSearchForTagValues,
  };

  mockUseAnalyticsAlgolia.mockReturnValue({
    client: mockAlgoliaClient as unknown as AlgoliaSearchClient<'analytics'>,
  });
  mockGetUserCollaboration.mockResolvedValue(userData);
  mockGetTeamCollaboration.mockResolvedValue(teamData);
});

describe('user collaboration', () => {
  it('renders with user data', async () => {
    await renderPage();

    expect(screen.getByText('User Co-Production')).toBeVisible();
    expect(screen.queryByText('Team Co-Production')).not.toBeInTheDocument();

    expect(screen.getByText('Co-Production Within Team by User')).toBeVisible();
    expect(
      screen.queryByText('Co-Production Across Teams by User'),
    ).not.toBeInTheDocument();

    const input = screen.getAllByRole('textbox', { hidden: false });

    userEvent.click(input[1]!);
    userEvent.click(screen.getByText('Across Teams'));

    expect(
      screen.getByText('Co-Production Across Teams by User'),
    ).toBeVisible();
    expect(
      screen.queryByText('Co-Production Within Team by User'),
    ).not.toBeInTheDocument();
  });

  it('renders data for different document categories', async () => {
    const defaultUserOptions: AnalyticsSearchOptionsWithFiltering = {
      sort: 'user_asc',
      pageSize: 10,
      currentPage: 0,
      timeRange: '30d',
      documentCategory: 'all',
      tags: [],
    };

    when(mockGetUserCollaboration)
      .calledWith(expect.anything(), {
        ...defaultUserOptions,
        documentCategory: 'article',
      })
      .mockResolvedValue({
        items: [
          {
            ...userData.items[0]!,
            objectID: '1-user-collaboration-30d-article',
            teams: [
              {
                ...userData.items[0]!.teams[0]!,
                outputsCoAuthoredWithinTeam: 100,
              },
            ],
          },
        ],
        total: 1,
      });
    await renderPage();

    expect(screen.getByText('300')).toBeVisible();
    expect(screen.queryByText('100')).not.toBeInTheDocument();

    const categoryButton = screen.getByRole('button', {
      name: /all chevron down/i,
    });
    userEvent.click(categoryButton);
    userEvent.click(screen.getByText(/Article/));
    await waitFor(() =>
      expect(screen.getAllByText(/Co-Production/)).toHaveLength(2),
    );

    expect(screen.getByText('100')).toBeVisible();
    expect(screen.queryByText('300')).not.toBeInTheDocument();
  });
});

describe('team collaboration', () => {
  it('renders with team data', async () => {
    await renderPage('team');

    expect(screen.getByText('Team Co-Production')).toBeVisible();
    expect(screen.queryByText('User Co-Production')).not.toBeInTheDocument();

    expect(
      screen.getByText('Co-Production Within Teams by Team'),
    ).toBeVisible();
    expect(
      screen.queryByText('Co-Production Across Teams by Team'),
    ).not.toBeInTheDocument();

    const input = screen.getAllByRole('textbox', { hidden: false });

    userEvent.click(input[1]!);
    userEvent.click(screen.getByText('Across Teams'));

    expect(
      screen.getByText('Co-Production Across Teams by Team'),
    ).toBeVisible();
    expect(
      screen.queryByText('Co-Production Within Teams by Team'),
    ).not.toBeInTheDocument();
  });

  it('renders data for different output types', async () => {
    const defaultTeamOptions: AnalyticsSearchOptionsWithFiltering = {
      pageSize: 10,
      currentPage: 0,
      timeRange: '30d',
      outputType: 'all',
      sort: 'team_asc',
      tags: [],
    };

    when(mockGetTeamCollaboration)
      .calledWith(expect.anything(), {
        ...defaultTeamOptions,
        outputType: 'public',
      })
      .mockResolvedValue({
        items: [
          {
            ...teamData.items[0]!,
            objectID: '1-team-collaboration-30d-public',
            outputsCoProducedWithin: {
              Article: 50,
              Bioinformatics: 0,
              Dataset: 0,
              'Lab Resource': 0,
              Protocol: 1,
            },
          },
        ],
        total: 1,
      });
    await renderPage('team');

    expect(screen.getByText('100')).toBeVisible();
    expect(screen.queryByText('50')).not.toBeInTheDocument();

    const outputTypeButton = screen.getByRole('button', {
      name: /ASAP Output chevron down/i,
    });
    userEvent.click(outputTypeButton);
    userEvent.click(screen.getByText(/ASAP Public Output/i));
    await waitFor(() =>
      expect(screen.getAllByText(/Co-Production/)).toHaveLength(2),
    );

    expect(screen.getByText('50')).toBeVisible();
    expect(screen.queryByText('100')).not.toBeInTheDocument();
  });
});

it('navigates between user and team collaboration pages', async () => {
  await renderPage();
  const input = screen.getAllByRole('textbox', { hidden: false });

  userEvent.click(input[0]!);
  userEvent.click(screen.getByText('Team Co-Production'));

  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  expect(screen.getByText('Team Co-Production')).toBeVisible();
  expect(screen.queryByText('User Co-Production')).not.toBeInTheDocument();
});

describe('search', () => {
  const getSearchBox = () => {
    const searchContainer = screen.getByRole('search') as HTMLElement;
    return within(searchContainer).getByRole('textbox') as HTMLInputElement;
  };
  it('allows typing in search queries', async () => {
    const mockAlgoliaClient = {
      searchForTagValues: mockSearchForTagValues,
    };

    mockUseAnalyticsAlgolia.mockReturnValue({
      client: mockAlgoliaClient as unknown as AlgoliaSearchClient<'analytics'>,
    });

    await renderPage();
    const searchBox = getSearchBox();

    userEvent.type(searchBox, 'test123');
    expect(searchBox.value).toEqual('test123');
    await waitFor(() =>
      expect(mockSearchForTagValues).toHaveBeenCalledWith(
        ['user-collaboration'],
        'test123',
        {},
      ),
    );
  });
});

describe('csv export', () => {
  it('exports analytics for user', async () => {
    await renderPage('user');
    userEvent.click(screen.getByText(/csv/i));
    expect(mockCreateCsvFileStream).toHaveBeenCalledWith(
      expect.stringMatching(/collaboration_user_\d+\.csv/),
      expect.anything(),
    );
  });

  it.each(['within-team', 'across-teams'])(
    'exports analytics for teams (%s)',
    async (type) => {
      await renderPage('team', type);
      const input = screen.getAllByRole('textbox', { hidden: false })[0];

      input && userEvent.click(input);
      userEvent.click(screen.getByText(/csv/i));
      expect(mockCreateCsvFileStream).toHaveBeenCalledWith(
        expect.stringMatching(/collaboration_team_\d+\.csv/),
        expect.anything(),
      );
    },
  );
});
