import {
  AlgoliaSearchClient,
  AnalyticsSearchOptionsWithFiltering,
  EMPTY_ALGOLIA_FACET_HITS,
} from '@asap-hub/algolia';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import {
  teamCollaborationPerformance,
  userCollaborationPerformance,
  preliminaryDataSharingResponse,
} from '@asap-hub/fixtures';
import { createCsvFileStream } from '@asap-hub/frontend-utils';
import {
  ListTeamCollaborationAlgoliaResponse,
  ListUserCollaborationAlgoliaResponse,
  PreliminaryDataSharingDataObject,
  SortTeamCollaboration,
  SortUserCollaboration,
} from '@asap-hub/model';
import { useFlags } from '@asap-hub/react-context';
import { analytics } from '@asap-hub/routing';
import {
  render,
  screen,
  waitFor,
  within,
  renderHook,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';
import React, { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { OpensearchClient } from '../../utils/opensearch';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { useAnalyticsAlgolia } from '../../../hooks/algolia';
import {
  useAnalyticsOpensearch,
  useOpensearchMetrics,
} from '../../../hooks/opensearch';
import {
  getTeamCollaboration,
  getTeamCollaborationPerformance,
  getUserCollaboration,
  getUserCollaborationPerformance,
  getPreliminaryDataSharing,
} from '../api';
import Collaboration from '../Collaboration';
import { useAnalyticsSharingPrelimFindings } from '../state';

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

jest.mock('../../../hooks/opensearch', () => ({
  useAnalyticsOpensearch: jest.fn(),
  useOpensearchMetrics: jest.fn(),
}));
jest.mock('@asap-hub/react-context', () => ({
  ...jest.requireActual('@asap-hub/react-context'),
  useFlags: jest.fn(),
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

const mockGetPreliminaryDataSharing =
  getPreliminaryDataSharing as jest.MockedFunction<
    typeof getPreliminaryDataSharing
  >;
mockGetPreliminaryDataSharing.mockResolvedValue(preliminaryDataSharingResponse);

const mockSearchForTagValues = jest.fn() as jest.MockedFunction<
  AlgoliaSearchClient<'analytics'>['searchForTagValues']
>;
const mockUseAnalyticsAlgolia = useAnalyticsAlgolia as jest.MockedFunction<
  typeof useAnalyticsAlgolia
>;
const mockUseAnalyticsOpensearch =
  useAnalyticsOpensearch as jest.MockedFunction<typeof useAnalyticsOpensearch>;
const mockUseOpensearchMetrics = useOpensearchMetrics as jest.MockedFunction<
  typeof useOpensearchMetrics
>;
const mockUseFlags = useFlags as jest.MockedFunction<typeof useFlags>;

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
        'Lab Material': 0,
        Protocol: 1,
      },
      outputsCoProducedAcross: {
        byDocumentType: {
          Article: 1,
          Bioinformatics: 0,
          Dataset: 0,
          'Lab Material': 0,
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
            'Lab Material': 0,
            Protocol: 1,
          },
        ],
      },
      objectID: '1',
    },
  ],
};

const renderPage = async (metric: string = 'user', type?: string) => {
  const path = analytics({})
    .collaboration({})
    .collaborationPath(type !== undefined ? { metric, type } : { metric }).$;

  const result = render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[path]}>
              <Routes>
                <Route
                  path="/analytics/collaboration/:metric/:type?"
                  element={<Collaboration />}
                />
              </Routes>
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

  const mockOpensearchClient = {
    request: jest.fn(),
  };

  mockSearchForTagValues.mockResolvedValue({
    ...EMPTY_ALGOLIA_FACET_HITS,
    facetHits: [
      { value: 'tag1', highlighted: 'tag1', count: 1 },
      { value: 'tag2', highlighted: 'tag2', count: 1 },
    ],
  });

  mockUseAnalyticsAlgolia.mockReturnValue({
    client: mockAlgoliaClient as unknown as AlgoliaSearchClient<'analytics'>,
  });

  mockUseAnalyticsOpensearch.mockReturnValue({
    client:
      mockOpensearchClient as unknown as OpensearchClient<PreliminaryDataSharingDataObject>,
  });

  mockUseOpensearchMetrics.mockReturnValue({
    getUserCollaboration: jest.fn().mockResolvedValue({ items: [], total: 0 }),
    getUserCollaborationTagSuggestions: jest.fn().mockResolvedValue([]),
    getUserCollaborationPerformance: jest.fn().mockResolvedValue(undefined),
    getPreliminaryDataSharing: jest
      .fn()
      .mockResolvedValue({ items: [], total: 0 }),
    getMeetingRepAttendance: jest
      .fn()
      .mockResolvedValue({ items: [], total: 0 }),
    getPreprintCompliance: jest.fn().mockResolvedValue({ items: [], total: 0 }),
    getPublicationCompliance: jest
      .fn()
      .mockResolvedValue({ items: [], total: 0 }),
    getTeamProductivity: jest.fn().mockResolvedValue({ items: [], total: 0 }),
    getTeamProductivityPerformance: jest.fn().mockResolvedValue(undefined),
    getTeamProductivityTagSuggestions: jest.fn().mockResolvedValue([]),
    getUserProductivity: jest.fn().mockResolvedValue({ items: [], total: 0 }),
    getUserProductivityPerformance: jest.fn().mockResolvedValue(undefined),
    getUserProductivityTagSuggestions: jest.fn().mockResolvedValue([]),
    getAnalyticsOSChampion: jest
      .fn()
      .mockResolvedValue({ items: [], total: 0 }),
  });

  mockUseFlags.mockReturnValue({
    isEnabled: jest.fn().mockReturnValue(false),
    reset: jest.fn(),
    disable: jest.fn(),
    setCurrentOverrides: jest.fn(),
    setEnvironment: jest.fn(),
    enable: jest.fn(),
  });

  mockGetUserCollaboration.mockResolvedValue(userData);
  mockGetTeamCollaboration.mockResolvedValue(teamData);
});

describe('user collaboration', () => {
  it('renders with user data', async () => {
    await renderPage('user', 'within-team');

    expect(screen.getByText('User Co-Production')).toBeVisible();
    expect(screen.queryByText('Team Co-Production')).not.toBeInTheDocument();

    expect(screen.getByText('Co-Production Within Team by User')).toBeVisible();
    expect(
      screen.queryByText('Co-Production Across Teams by User'),
    ).not.toBeInTheDocument();

    const input = screen.getAllByRole('textbox', { hidden: false });

    await userEvent.click(input[1]!);
    await userEvent.click(screen.getByText('Across Teams'));

    expect(
      screen.getByText('Co-Production Across Teams by User'),
    ).toBeVisible();
    expect(
      screen.queryByText('Co-Production Within Team by User'),
    ).not.toBeInTheDocument();
  });

  it('renders data for different document categories', async () => {
    const defaultUserOptions: AnalyticsSearchOptionsWithFiltering<SortUserCollaboration> =
      {
        sort: 'user_asc',
        pageSize: 10,
        currentPage: 0,
        timeRange: 'all',
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
            id: '1-user-collaboration-all-article',
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
    await renderPage('user', 'within-team');

    expect(screen.getByText('300')).toBeVisible();
    expect(screen.queryByText('100')).not.toBeInTheDocument();

    const categoryButton = screen.getByRole('button', {
      name: /all chevron down/i,
    });
    await userEvent.click(categoryButton);
    await userEvent.click(screen.getByText(/Article/));
    await waitFor(() =>
      expect(screen.getAllByText(/Co-Production/)).toHaveLength(2),
    );

    expect(screen.getByText('100')).toBeVisible();
    expect(screen.queryByText('300')).not.toBeInTheDocument();
  });

  it('calls algolia client with the right index name', async () => {
    const { getByTitle } = await renderPage('user', 'within-team');
    await waitFor(() => {
      expect(mockUseAnalyticsAlgolia).toHaveBeenCalledWith(
        expect.not.stringContaining('user_desc'),
      );
    });
    // Clear previous calls to check only new calls after sort change
    mockUseAnalyticsAlgolia.mockClear();
    await userEvent.click(
      getByTitle('User Active Alphabetical Ascending Sort Icon'),
    );
    await waitFor(() => {
      expect(mockUseAnalyticsAlgolia).toHaveBeenCalledWith(
        expect.stringContaining('user_desc'),
      );
    });
  });
});

describe('team collaboration', () => {
  it('renders with team data', async () => {
    await renderPage('team', 'within-team');

    expect(screen.getByText('Team Co-Production')).toBeVisible();
    expect(screen.queryByText('User Co-Production')).not.toBeInTheDocument();

    expect(
      screen.getByText('Co-Production Within Teams by Team'),
    ).toBeVisible();
    expect(
      screen.queryByText('Co-Production Across Teams by Team'),
    ).not.toBeInTheDocument();

    const input = screen.getAllByRole('textbox', { hidden: false });

    await userEvent.click(input[1]!);
    await userEvent.click(screen.getByText('Across Teams'));

    expect(
      screen.getByText('Co-Production Across Teams by Team'),
    ).toBeVisible();
    expect(
      screen.queryByText('Co-Production Within Teams by Team'),
    ).not.toBeInTheDocument();
  });

  it('renders data for different output types', async () => {
    const defaultTeamOptions: AnalyticsSearchOptionsWithFiltering<SortTeamCollaboration> =
      {
        pageSize: 10,
        currentPage: 0,
        timeRange: 'all',
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
            id: '1-team-collaboration-all-public',
            outputsCoProducedWithin: {
              Article: 50,
              Bioinformatics: 0,
              Dataset: 0,
              'Lab Material': 0,
              Protocol: 1,
            },
          },
        ],
        total: 1,
      });
    await renderPage('team', 'within-team');

    expect(screen.getByText('100')).toBeVisible();
    expect(screen.queryByText('50')).not.toBeInTheDocument();

    const outputTypeButton = screen.getByRole('button', {
      name: /ASAP Output chevron down/i,
    });
    await userEvent.click(outputTypeButton);
    await userEvent.click(screen.getByText(/ASAP Public Output/i));
    await waitFor(() =>
      expect(screen.getAllByText(/Co-Production/)).toHaveLength(2),
    );

    expect(screen.getByText('50')).toBeVisible();
    expect(screen.queryByText('100')).not.toBeInTheDocument();
  });

  it('calls algolia client with the right index name', async () => {
    const { getByTitle } = await renderPage('team', 'within-team');
    await waitFor(() => {
      expect(mockUseAnalyticsAlgolia).toHaveBeenCalled();
    });
    // Clear previous calls to check only new calls after sort change
    mockUseAnalyticsAlgolia.mockClear();
    await userEvent.click(
      getByTitle('Active Alphabetical Ascending Sort Icon'),
    );
    await waitFor(() => {
      expect(mockUseAnalyticsAlgolia).toHaveBeenCalledWith(
        expect.stringContaining('team_desc'),
      );
    });
  });
});

describe('sharing prelim findings', () => {
  it('renders sharing prelim findings page', async () => {
    await renderPage('sharing-prelim-findings', undefined);

    expect(
      screen.getByRole('heading', { name: /Sharing Preliminary Findings/i }),
    ).toBeVisible();
    expect(screen.queryByText('User Co-Production')).not.toBeInTheDocument();

    expect(screen.queryByText('Type')).not.toBeInTheDocument();
  });

  it('can navigate to sharing preliminary findings page', async () => {
    await renderPage('user', 'within-team');
    const input = screen.getAllByRole('textbox', { hidden: false });

    await userEvent.click(input[0]!);
    await userEvent.click(screen.getByText('Sharing Preliminary Findings'));

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    expect(
      screen.getByRole('heading', { name: /Sharing Preliminary Findings/i }),
    ).toBeVisible();
    expect(screen.queryByText('User Co-Production')).not.toBeInTheDocument();
    expect(screen.queryByText('Type')).not.toBeInTheDocument();
  });

  it('exports analytics for sharing preliminary findings', async () => {
    await renderPage('sharing-prelim-findings', undefined);
    await userEvent.click(screen.getByText(/csv/i));
    expect(mockCreateCsvFileStream).toHaveBeenCalledWith(
      expect.stringMatching(/collaboration_sharing-prelim-findings_\d+\.csv/),
      expect.anything(),
    );
  });

  it('throws error when preliminary data sharing fails', async () => {
    const error = new Error('API Error');
    mockGetPreliminaryDataSharing.mockRejectedValue(error);
    jest.spyOn(console, 'error').mockImplementation(() => {});

    let caughtError: Error | null = null;

    class ErrorBoundary extends React.Component<
      { children: React.ReactNode },
      { hasError: boolean }
    > {
      state = { hasError: false };

      static getDerivedStateFromError(err: Error) {
        caughtError = err;
        return { hasError: true };
      }

      render() {
        if (this.state.hasError) {
          return <div>Error caught</div>;
        }
        return this.props.children;
      }
    }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot>
        <ErrorBoundary>
          <Suspense fallback="loading">{children}</Suspense>
        </ErrorBoundary>
      </RecoilRoot>
    );

    renderHook(
      () =>
        useAnalyticsSharingPrelimFindings({
          currentPage: 0,
          pageSize: 10,
          sort: 'team_asc',
          tags: [],
          timeRange: 'all',
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(caughtError?.message).toBe('API Error');
    });
  });
});

it('navigates between user and team collaboration pages', async () => {
  await renderPage('user', 'within-team');
  const input = screen.getAllByRole('textbox', { hidden: false });

  await userEvent.click(input[0]!);
  await userEvent.click(screen.getByText('Team Co-Production'));

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

    await renderPage('user', 'within-team');
    const searchBox = getSearchBox();

    await userEvent.type(searchBox, 'test123');
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
    await renderPage('user', 'within-team');
    await userEvent.click(screen.getByText(/csv/i));
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

      input && (await userEvent.click(input));
      await userEvent.click(screen.getByText(/csv/i));
      expect(mockCreateCsvFileStream).toHaveBeenCalledWith(
        expect.stringMatching(/collaboration_team_\d+\.csv/),
        expect.anything(),
      );
    },
  );

  it('exports user collaboration analytics via OpenSearch when flag is enabled', async () => {
    mockUseFlags.mockReturnValue({
      isEnabled: jest
        .fn()
        .mockImplementation((flag: string) => flag === 'OPENSEARCH_METRICS'),
      reset: jest.fn(),
      disable: jest.fn(),
      setCurrentOverrides: jest.fn(),
      setEnvironment: jest.fn(),
      enable: jest.fn(),
    });

    const mockGetUserCollaborationOS = jest.fn().mockResolvedValue(userData);
    const mockGetUserCollaborationPerformanceOS = jest
      .fn()
      .mockResolvedValue(userCollaborationPerformance);

    mockUseOpensearchMetrics.mockReturnValue({
      getUserCollaboration: mockGetUserCollaborationOS,
      getUserCollaborationTagSuggestions: jest.fn().mockResolvedValue([]),
      getUserCollaborationPerformance: mockGetUserCollaborationPerformanceOS,
      getPreliminaryDataSharing: jest
        .fn()
        .mockResolvedValue({ items: [], total: 0 }),
      getMeetingRepAttendance: jest
        .fn()
        .mockResolvedValue({ items: [], total: 0 }),
      getPreprintCompliance: jest
        .fn()
        .mockResolvedValue({ items: [], total: 0 }),
      getPublicationCompliance: jest
        .fn()
        .mockResolvedValue({ items: [], total: 0 }),
      getTeamProductivity: jest.fn().mockResolvedValue({ items: [], total: 0 }),
      getTeamProductivityPerformance: jest.fn().mockResolvedValue(undefined),
      getTeamProductivityTagSuggestions: jest.fn().mockResolvedValue([]),
      getUserProductivity: jest.fn().mockResolvedValue({ items: [], total: 0 }),
      getUserProductivityPerformance: jest.fn().mockResolvedValue(undefined),
      getUserProductivityTagSuggestions: jest.fn().mockResolvedValue([]),
      getAnalyticsOSChampion: jest
        .fn()
        .mockResolvedValue({ items: [], total: 0 }),
    });

    await renderPage('user', 'within-team');

    // Clear only the Algolia mock after initial render
    mockGetUserCollaboration.mockClear();

    await userEvent.click(screen.getByText(/csv/i));

    expect(mockCreateCsvFileStream).toHaveBeenCalledWith(
      expect.stringMatching(/collaboration_user_\d+\.csv/),
      expect.anything(),
    );

    expect(mockGetUserCollaborationOS).toHaveBeenCalledWith({
      documentCategory: 'all',
      sort: 'user_asc',
      tags: [],
      timeRange: 'all',
      currentPage: expect.any(Number),
      pageSize: 200,
    });

    expect(mockGetUserCollaboration).not.toHaveBeenCalled();
  });
});
