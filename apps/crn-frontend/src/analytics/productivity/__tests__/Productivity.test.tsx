import {
  AlgoliaSearchClient,
  AnalyticsSearchOptionsWithFiltering,
  EMPTY_ALGOLIA_FACET_HITS,
} from '@asap-hub/algolia';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { createCsvFileStream } from '@asap-hub/frontend-utils';
import {
  performanceByDocumentType,
  userProductivityPerformance,
} from '@asap-hub/fixtures';
import {
  SortTeamProductivity,
  TeamProductivityAlgoliaResponse,
  UserProductivityResponse,
} from '@asap-hub/model';
import { useFlags } from '@asap-hub/react-context';
import { analytics } from '@asap-hub/routing';
import { render, screen, waitFor, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { OpensearchClient } from '../../utils/opensearch';
import { useAnalyticsAlgolia } from '../../../hooks/algolia';
import {
  useOpensearchMetrics,
  useAnalyticsOpensearch,
} from '../../../hooks/opensearch';
import {
  getTeamProductivity,
  getTeamProductivityPerformance,
  getUserProductivity,
  getUserProductivityPerformance,
} from '../api';
import Productivity from '../Productivity';

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
  useOpensearchMetrics: jest.fn(),
  useAnalyticsOpensearch: jest.fn(),
}));

jest.mock('@asap-hub/react-context', () => ({
  ...jest.requireActual('@asap-hub/react-context'),
  useFlags: jest.fn(),
}));

// Don't mock ../../../hooks at all - let it use the real implementations
// which are connected to Recoil state and will respond to user interactions

const mockCreateCsvFileStream = createCsvFileStream as jest.MockedFunction<
  typeof createCsvFileStream
>;

mockConsoleError();

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetTeamProductivity = getTeamProductivity as jest.MockedFunction<
  typeof getTeamProductivity
>;

const mockGetTeamProductivityPerformance =
  getTeamProductivityPerformance as jest.MockedFunction<
    typeof getTeamProductivityPerformance
  >;

const mockGetUserProductivity = getUserProductivity as jest.MockedFunction<
  typeof getUserProductivity
>;

const mockGetUserProductivityPerformance =
  getUserProductivityPerformance as jest.MockedFunction<
    typeof getUserProductivityPerformance
  >;

mockGetTeamProductivityPerformance.mockResolvedValue(performanceByDocumentType);
mockGetUserProductivityPerformance.mockResolvedValue(
  userProductivityPerformance,
);

const mockSearchForTagValues = jest.fn() as jest.MockedFunction<
  AlgoliaSearchClient<'analytics'>['searchForTagValues']
>;

const mockUseAnalyticsAlgolia = useAnalyticsAlgolia as jest.MockedFunction<
  typeof useAnalyticsAlgolia
>;

const mockUseOpensearchMetrics = useOpensearchMetrics as jest.MockedFunction<
  typeof useOpensearchMetrics
>;

const mockUseAnalyticsOpensearch =
  useAnalyticsOpensearch as jest.MockedFunction<typeof useAnalyticsOpensearch>;

const mockUseFlags = useFlags as jest.MockedFunction<typeof useFlags>;

beforeEach(() => {
  const mockAlgoliaClient = {
    searchForTagValues: mockSearchForTagValues,
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
  mockUseOpensearchMetrics.mockReturnValue({
    getUserProductivity: jest.fn().mockResolvedValue({ items: [], total: 0 }),
    getUserProductivityPerformance: jest.fn().mockResolvedValue(undefined),
    getPublicationCompliance: jest
      .fn()
      .mockResolvedValue({ items: [], total: 0 }),
    getPreprintCompliance: jest.fn().mockResolvedValue({ items: [], total: 0 }),
    getAnalyticsOSChampion: jest
      .fn()
      .mockResolvedValue({ items: [], total: 0 }),
    getMeetingRepAttendance: jest
      .fn()
      .mockResolvedValue({ items: [], total: 0 }),
    getPreliminaryDataSharing: jest
      .fn()
      .mockResolvedValue({ items: [], total: 0 }),
  });
  mockUseAnalyticsOpensearch.mockReturnValue({
    client: {} as OpensearchClient<unknown>, // Mock opensearch client (not used since flag is false)
  });
  mockUseFlags.mockReturnValue({
    isEnabled: jest.fn().mockReturnValue(false),
    reset: jest.fn(),
    disable: jest.fn(),
    setCurrentOverrides: jest.fn(),
    setEnvironment: jest.fn(),
    enable: jest.fn(),
  });
  mockGetUserProductivity.mockResolvedValue({ items: [], total: 0 });
  mockGetTeamProductivity.mockResolvedValue({ items: [], total: 0 });
});

const defaultTeamOptions: AnalyticsSearchOptionsWithFiltering<SortTeamProductivity> =
  {
    pageSize: 10,
    currentPage: 0,
    timeRange: 'all',
    sort: 'team_asc',
    tags: [],
  };

const userProductivityResponse: UserProductivityResponse = {
  id: '1',
  name: 'Test User',
  isAlumni: false,
  teams: [
    {
      id: '1',
      team: 'Team A',
      isTeamInactive: false,
      isUserInactiveOnTeam: false,
      role: 'Collaborating PI',
    },
  ],
  asapOutput: 200,
  asapPublicOutput: 100,
  ratio: 0.5,
};

const teamProductivityResponse: TeamProductivityAlgoliaResponse = {
  id: '1',
  objectID: '1-team-productivity-all',
  name: 'Team Alessi',
  isInactive: false,
  Article: 50,
  Bioinformatics: 0,
  Dataset: 0,
  'Lab Material': 0,
  Protocol: 0,
};

const renderPage = async (path: string) => {
  const result = render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[path]}>
              <Route path="/analytics/productivity/:metric">
                <Productivity />
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

describe('user productivity', () => {
  it('renders with user data', async () => {
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'user' }).$,
    );
    expect(screen.getAllByText('User Productivity').length).toBe(2);
  });

  it('renders data for different time ranges', async () => {
    // Set up dynamic mock based on the timeRange parameter
    // NOTE: During initial render, multiple queries fire (all, 90d, etc)
    // We only test that changing dropdowns updates the data
    mockGetUserProductivity.mockImplementation(async (_client, options) => {
      if (options.timeRange === '30d') {
        return {
          items: [{ ...userProductivityResponse, asapOutput: 300 }],
          total: 1,
        };
      }
      return { items: [userProductivityResponse], total: 1 };
    });

    // Render the page with initial timeRange
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'user' }).$,
    );

    // Wait for page to be fully rendered
    await waitFor(() => {
      expect(screen.getAllByText('User Productivity')).toHaveLength(2);
    });

    // Find and click the time range dropdown button
    const rangeButton = screen.getByRole('button', {
      name: /Since Hub Launch \(2020\)/i,
    });

    // Change to "Last 30 days" time range
    await act(async () => {
      userEvent.click(rangeButton);
      userEvent.click(screen.getByText(/Last 30 days/i));
    });

    // Wait for the new data to load with asapOutput: 300
    await waitFor(() => {
      expect(screen.getByText('300')).toBeInTheDocument();
    });

    // Change to "Last 90 days"
    await act(async () => {
      userEvent.click(rangeButton);
      userEvent.click(screen.getByText(/Last 90 days/i));
    });

    // Data should change back to default (timeRange='90d' returns default response)
    await waitFor(() => {
      expect(screen.getByText('200')).toBeInTheDocument();
    });
    expect(screen.queryByText('300')).not.toBeInTheDocument();
  });

  it('renders data for different document categories', async () => {
    // Set up dynamic mock based on the documentCategory parameter
    mockGetUserProductivity.mockImplementation(async (_client, options) => {
      if (options.documentCategory === 'protocol') {
        return {
          items: [{ ...userProductivityResponse, asapOutput: 75 }],
          total: 1,
        };
      }
      return { items: [userProductivityResponse], total: 1 };
    });

    // Render the page
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'user' }).$,
    );

    // Wait for page to be fully rendered
    await waitFor(() => {
      expect(screen.getAllByText('User Productivity')).toHaveLength(2);
    });

    // Find and click the document category dropdown button
    const categoryButton = screen.getByRole('button', {
      name: /All/i,
    });

    // Change to "Protocol" document category
    await act(async () => {
      userEvent.click(categoryButton);
      userEvent.click(screen.getByText(/Protocol/));
    });

    // Wait for the new data to load with asapOutput: 75
    await waitFor(() => {
      expect(screen.getByText('75')).toBeInTheDocument();
    });

    // Change to "Article"
    await act(async () => {
      userEvent.click(categoryButton);
      userEvent.click(screen.getByText(/^Article$/));
    });

    // Data should change to default (documentCategory='article' returns default response)
    await waitFor(() => {
      expect(screen.getByText('200')).toBeInTheDocument();
    });
    expect(screen.queryByText('75')).not.toBeInTheDocument();
  });

  it('calls algolia client with the right index name', async () => {
    const { getByTitle } = await renderPage(
      analytics({}).productivity({}).metric({ metric: 'user' }).$,
    );

    await waitFor(() => {
      expect(mockUseAnalyticsAlgolia).toHaveBeenLastCalledWith(
        expect.not.stringContaining('user_desc'),
      );
    });
    await act(async () => {
      userEvent.click(
        getByTitle('User Active Alphabetical Ascending Sort Icon'),
      );
    });
    await waitFor(() => {
      expect(mockUseAnalyticsAlgolia).toHaveBeenCalledWith(
        expect.stringContaining('user_desc'),
      );
    });
  });
});

describe('team productivity', () => {
  it('renders with team data', async () => {
    const label = 'Team Productivity';

    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'team' }).$,
    );

    expect(screen.getAllByText(label).length).toBe(2);
  });

  it('renders data for different time ranges', async () => {
    when(mockGetTeamProductivity)
      .calledWith(expect.anything(), {
        ...defaultTeamOptions,
        outputType: 'all',
      })
      .mockResolvedValue({ items: [teamProductivityResponse], total: 1 });
    when(mockGetTeamProductivity)
      .calledWith(expect.anything(), {
        ...defaultTeamOptions,
        timeRange: '90d',
        outputType: 'all',
      })
      .mockResolvedValue({
        items: [
          {
            ...teamProductivityResponse,
            objectID: '1-team-productivity-90d',
            Article: 60,
          },
        ],
        total: 1,
      });
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'team' }).$,
    );

    expect(screen.getByText('50')).toBeVisible();
    expect(screen.queryByText('60')).not.toBeInTheDocument();

    const rangeButton = screen.getByRole('button', {
      name: /Since Hub Launch \(2020\) Chevron Down/i,
    });
    await act(async () => {
      userEvent.click(rangeButton);
      userEvent.click(screen.getByText(/Last 90 days/));
    });
    await waitFor(() =>
      expect(screen.getAllByText('Team Productivity')).toHaveLength(2),
    );

    expect(screen.getByText('60')).toBeVisible();
    expect(screen.queryByText('50')).not.toBeInTheDocument();

    await act(async () => {
      userEvent.click(rangeButton);
      userEvent.click(screen.getByText(/Since Hub Launch \(2020\)/i));
    });
    await waitFor(() =>
      expect(screen.getAllByText('Team Productivity')).toHaveLength(2),
    );

    expect(screen.getByText('50')).toBeVisible();
    expect(screen.queryByText('60')).not.toBeInTheDocument();
  });

  it('renders data for different output types', async () => {
    when(mockGetTeamProductivity)
      .calledWith(expect.anything(), {
        ...defaultTeamOptions,
        outputType: 'all',
      })
      .mockResolvedValue({ items: [teamProductivityResponse], total: 1 });
    when(mockGetTeamProductivity)
      .calledWith(expect.anything(), {
        ...defaultTeamOptions,
        outputType: 'public',
      })
      .mockResolvedValue({
        items: [
          {
            ...teamProductivityResponse,
            objectID: '1-team-productivity-public',
            Article: 60,
          },
        ],
        total: 1,
      });
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'team' }).$,
    );

    expect(screen.getByText('50')).toBeVisible();
    expect(screen.queryByText('60')).not.toBeInTheDocument();

    const outputTypeButton = screen.getByRole('button', {
      name: /ASAP Output chevron down/i,
    });
    await act(async () => {
      userEvent.click(outputTypeButton);
      userEvent.click(screen.getByText(/ASAP Public Output/i));
    });
    await waitFor(() =>
      expect(screen.getAllByText('Team Productivity')).toHaveLength(2),
    );

    expect(screen.getByText('60')).toBeVisible();
    expect(screen.queryByText('50')).not.toBeInTheDocument();

    await act(async () => {
      userEvent.click(outputTypeButton);
      userEvent.click(screen.getByText(/ASAP Output/));
    });
    await waitFor(() =>
      expect(screen.getAllByText('Team Productivity')).toHaveLength(2),
    );

    expect(screen.getByText('50')).toBeVisible();
    expect(screen.queryByText('60')).not.toBeInTheDocument();
  });

  it('calls algolia client with the right index name', async () => {
    const { getByTitle } = await renderPage(
      analytics({}).productivity({}).metric({ metric: 'team' }).$,
    );

    await waitFor(() => {
      expect(mockUseAnalyticsAlgolia).toHaveBeenLastCalledWith(
        expect.not.stringContaining('team_desc'),
      );
    });
    await act(async () => {
      userEvent.click(getByTitle('Active Alphabetical Ascending Sort Icon'));
    });
    await waitFor(() => {
      expect(mockUseAnalyticsAlgolia).toHaveBeenCalledWith(
        expect.stringContaining('team_desc'),
      );
    });
  });
});

describe('search', () => {
  const getSearchBox = () => {
    const searchContainer = screen.getByRole('search') as HTMLElement;
    return within(searchContainer).getByRole('textbox') as HTMLInputElement;
  };
  it('allows typing in search queries', async () => {
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'team' }).$,
    );
    const searchBox = getSearchBox();

    await act(async () => {
      userEvent.type(searchBox, 'test123');
    });
    await waitFor(() =>
      expect(mockSearchForTagValues).toHaveBeenCalledWith(
        ['team-productivity'],
        '3',
        {},
      ),
    );
  });
});

describe('csv export', () => {
  it('exports analytics for user', async () => {
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'user' }).$,
    );
    await act(async () => {
      userEvent.click(screen.getByText(/csv/i));
    });
    expect(mockCreateCsvFileStream).toHaveBeenCalledWith(
      expect.stringMatching(/productivity_user_\d+\.csv/),
      expect.anything(),
    );
  });

  it('exports analytics for teams', async () => {
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'team' }).$,
    );
    const input = screen.getAllByRole('textbox', { hidden: false })[0];

    await act(async () => {
      input && userEvent.click(input);
      userEvent.click(screen.getByText(/csv/i));
    });
    expect(mockCreateCsvFileStream).toHaveBeenCalledWith(
      expect.stringMatching(/productivity_team_\d+\.csv/),
      expect.anything(),
    );
  });

  it('exports user productivity analytics via OpenSearch when flag is enabled', async () => {
    // Set up flag to enable OpenSearch metrics
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

    // Mock OpenSearch metrics methods
    const mockGetUserProductivityOS = jest.fn().mockResolvedValue({
      items: [
        {
          id: 'user-1',
          name: 'Alice OpenSearch',
          isAlumni: false,
          teams: [
            {
              id: 'team-1',
              team: 'Team OpenSearch',
              role: 'Lead PI (Core Leadership)',
              isTeamInactive: false,
              isUserInactiveOnTeam: false,
            },
          ],
          asapOutput: 150,
          asapPublicOutput: 100,
          ratio: 0.67,
        },
      ],
      total: 1,
    });

    const mockGetUserProductivityPerformanceOS = jest.fn().mockResolvedValue({
      asapOutput: {
        belowAverageMin: 0,
        belowAverageMax: 50,
        averageMin: 50,
        averageMax: 100,
        aboveAverageMin: 100,
        aboveAverageMax: 200,
      },
      asapPublicOutput: {
        belowAverageMin: 0,
        belowAverageMax: 30,
        averageMin: 30,
        averageMax: 70,
        aboveAverageMin: 70,
        aboveAverageMax: 150,
      },
      ratio: {
        belowAverageMin: 0,
        belowAverageMax: 0.5,
        averageMin: 0.5,
        averageMax: 0.75,
        aboveAverageMin: 0.75,
        aboveAverageMax: 1.0,
      },
    });

    mockUseOpensearchMetrics.mockReturnValue({
      getUserProductivity: mockGetUserProductivityOS,
      getUserProductivityPerformance: mockGetUserProductivityPerformanceOS,
      getPublicationCompliance: jest
        .fn()
        .mockResolvedValue({ items: [], total: 0 }),
      getPreprintCompliance: jest
        .fn()
        .mockResolvedValue({ items: [], total: 0 }),
      getAnalyticsOSChampion: jest
        .fn()
        .mockResolvedValue({ items: [], total: 0 }),
      getMeetingRepAttendance: jest
        .fn()
        .mockResolvedValue({ items: [], total: 0 }),
      getPreliminaryDataSharing: jest
        .fn()
        .mockResolvedValue({ items: [], total: 0 }),
    });

    // Render the page
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'user' }).$,
    );

    // Wait for page to be fully rendered
    await waitFor(() => {
      expect(screen.getAllByText('User Productivity')).toHaveLength(2);
    });

    // Clear only the Algolia mock after initial render to isolate CSV export behavior
    mockGetUserProductivity.mockClear();

    // Click CSV export button
    await act(async () => {
      userEvent.click(screen.getByText(/csv/i));
    });

    // Verify createCsvFileStream was called with correct filename
    expect(mockCreateCsvFileStream).toHaveBeenCalledWith(
      expect.stringMatching(/productivity_user_\d+\.csv/),
      expect.anything(),
    );

    // Verify OpenSearch getUserProductivity was called with correct parameters during CSV export
    expect(mockGetUserProductivityOS).toHaveBeenCalledWith({
      sort: 'user_asc',
      timeRange: 'all',
      documentCategory: 'all',
      tags: [],
      currentPage: expect.any(Number),
      pageSize: 200,
    });

    // Verify Algolia getUserProductivity was NOT called during CSV export
    expect(mockGetUserProductivity).not.toHaveBeenCalled();
  });
});
