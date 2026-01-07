import {
  AlgoliaSearchClient,
  EMPTY_ALGOLIA_FACET_HITS,
  EMPTY_ALGOLIA_RESPONSE,
} from '@asap-hub/algolia';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { createCsvFileStream } from '@asap-hub/frontend-utils';
import {
  EngagementPerformance,
  ListEngagementAlgoliaResponse,
  MeetingRepAttendanceResponse,
} from '@asap-hub/model';
import { analytics } from '@asap-hub/routing';
import {
  render,
  screen,
  waitFor,
  within,
  renderHook,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { OpensearchClient } from '../../utils/opensearch';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { useAnalyticsAlgolia } from '../../../hooks/algolia';
import { useAnalyticsOpensearch } from '../../../hooks/opensearch';
import {
  getEngagement,
  getEngagementPerformance,
  getMeetingRepAttendance,
} from '../api';
import Engagement from '../Engagement';
import {
  analyticsEngagementState,
  useAnalyticsEngagement,
  useAnalyticsMeetingRepAttendance,
} from '../state';

jest.mock('../api');
mockConsoleError();

// Reusable ErrorBoundary for testing error handling in Suspense-based hooks
let errorCallback: ((error: Error) => void) | null = null;

class TestErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(err: Error) {
    errorCallback?.(err);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Error caught</div>;
    }
    return this.props.children;
  }
}

jest.mock('@asap-hub/algolia', () => ({
  ...jest.requireActual('@asap-hub/algolia'),
  algoliaSearchClientFactory: jest
    .fn()
    .mockReturnValue({} as AlgoliaSearchClient<'crn'>),
}));

jest.mock('../../../hooks/algolia', () => ({
  useAnalyticsAlgolia: jest.fn(),
}));

jest.mock('../../../hooks/opensearch', () => ({
  useAnalyticsOpensearch: jest.fn(),
}));

jest.mock('@asap-hub/frontend-utils', () => {
  const original = jest.requireActual('@asap-hub/frontend-utils');
  return {
    ...original,
    createCsvFileStream: jest
      .fn()
      .mockImplementation(() => ({ write: jest.fn(), end: jest.fn() })),
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetEngagement = getEngagement as jest.MockedFunction<
  typeof getEngagement
>;
const mockGetMeetingRepAttendance =
  getMeetingRepAttendance as jest.MockedFunction<
    typeof getMeetingRepAttendance
  >;

const mockGetPerformance = getEngagementPerformance as jest.MockedFunction<
  typeof getEngagementPerformance
>;

const mockSearchForTagValues = jest.fn() as jest.MockedFunction<
  AlgoliaSearchClient<'analytics'>['searchForTagValues']
>;

const mockSearch = jest.fn() as jest.MockedFunction<
  AlgoliaSearchClient<'analytics'>['search']
>;

const mockGetTagSuggestions = jest.fn() as jest.MockedFunction<
  OpensearchClient<MeetingRepAttendanceResponse>['getTagSuggestions']
>;

const mockAttendanceSearch = jest.fn() as jest.MockedFunction<
  OpensearchClient<MeetingRepAttendanceResponse>['search']
>;

const mockUseAnalyticsAlgolia = useAnalyticsAlgolia as jest.MockedFunction<
  typeof useAnalyticsAlgolia
>;

const mockUseAnalyticsOpensearch =
  useAnalyticsOpensearch as jest.MockedFunction<typeof useAnalyticsOpensearch>;

const mockCreateCsvFileStream = createCsvFileStream as jest.MockedFunction<
  typeof createCsvFileStream
>;

const data: ListEngagementAlgoliaResponse = {
  total: 1,
  items: [
    {
      id: '1',
      name: 'Test Team',
      inactiveSince: null,
      memberCount: 1,
      eventCount: 4,
      totalSpeakerCount: 3,
      uniqueAllRolesCount: 3,
      uniqueAllRolesCountPercentage: 100,
      uniqueKeyPersonnelCount: 2,
      uniqueKeyPersonnelCountPercentage: 67,
      objectID: 'engagement-algolia-id',
    },
  ],
};

const mockAlgoliaClient = {
  searchForTagValues: mockSearchForTagValues,
  search: mockSearch,
};

const mockOpensearchClient = {
  getTagSuggestions: mockGetTagSuggestions,
  search: mockAttendanceSearch,
};

beforeEach(() => {
  jest.clearAllMocks();

  mockUseAnalyticsAlgolia.mockReturnValue({
    client: mockAlgoliaClient as unknown as AlgoliaSearchClient<'analytics'>,
  });
  mockAlgoliaClient.search.mockResolvedValue(EMPTY_ALGOLIA_RESPONSE);
  mockSearchForTagValues.mockResolvedValue({
    ...EMPTY_ALGOLIA_FACET_HITS,
    facetHits: [
      { value: 'tag1', highlighted: 'tag1', count: 1 },
      { value: 'tag2', highlighted: 'tag2', count: 1 },
    ],
  });
  mockGetEngagement.mockResolvedValue(data);
  mockGetMeetingRepAttendance.mockResolvedValue({ items: [], total: 0 });
  const metric = {
    belowAverageMin: 1,
    belowAverageMax: 1,
    averageMin: 1,
    averageMax: 1,
    aboveAverageMin: 1,
    aboveAverageMax: 1,
  };

  const engagementPerformance: EngagementPerformance = {
    events: metric,
    totalSpeakers: metric,
    uniqueAllRoles: metric,
    uniqueKeyPersonnel: metric,
  };
  mockGetPerformance.mockResolvedValue({
    ...engagementPerformance,
  });

  mockUseAnalyticsOpensearch.mockReturnValue({
    client:
      mockOpensearchClient as unknown as OpensearchClient<MeetingRepAttendanceResponse>,
  });
  mockOpensearchClient.getTagSuggestions.mockResolvedValue([]);
});

const renderPage = async (path: string) => {
  const result = render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          analyticsEngagementState({
            currentPage: 0,
            pageSize: 10,
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[path]}>
              <Routes>
                <Route
                  path="/analytics/engagement/:metric"
                  element={<Engagement />}
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

describe('Engagement', () => {
  it('renders with data', async () => {
    await renderPage(
      analytics({}).engagement({}).metric({ metric: 'presenters' }).$,
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /Representation of Presenters/i,
        }),
      ).toBeVisible();
      expect(screen.getByText('Test Team')).toBeInTheDocument();
      expect(screen.getAllByText('1')).toHaveLength(2); // one of the 1s is pagination
      expect(screen.getAllByText('2 (67%)')).toHaveLength(1);
      expect(screen.getAllByText('3')).toHaveLength(1);
      expect(screen.getAllByText('3 (100%)')).toHaveLength(1);
      expect(screen.getAllByText('4')).toHaveLength(1);
    });
  });

  it('calls algolia client with the right index name', async () => {
    await renderPage(
      analytics({}).engagement({}).metric({ metric: 'presenters' }).$,
    );

    await waitFor(() => {
      expect(mockUseAnalyticsAlgolia).toHaveBeenCalled();
    });

    await userEvent.click(
      screen.getByTitle('Active Alphabetical Ascending Sort Icon'),
    );

    // Wait for the component to re-render and call useAnalyticsAlgolia with new sort
    await waitFor(() => {
      expect(mockUseAnalyticsAlgolia).toHaveBeenCalledWith(
        expect.stringContaining('team_desc'),
      );
    });
  });

  it('calls algolia with the correct time range', async () => {
    await renderPage(
      analytics({}).engagement({}).metric({ metric: 'presenters' }).$,
    );

    await waitFor(() => {
      expect(mockGetEngagement).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({ timeRange: 'all' }),
      );
    });

    await userEvent.click(
      screen.getByRole('button', { name: /chevron down/i }),
    );
    await userEvent.click(
      screen.getByRole('link', { name: 'Since Hub Launch (2020)' }),
    );

    await waitFor(() => {
      expect(mockGetEngagement).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({ timeRange: 'all' }),
      );
    });
  });

  it('exports csv when user clicks on CSV button', async () => {
    await renderPage(
      analytics({}).engagement({}).metric({ metric: 'presenters' }).$,
    );

    await userEvent.click(screen.getByText(/csv/i));
    expect(mockCreateCsvFileStream).toHaveBeenCalledWith(
      expect.stringMatching(/engagement_\d+\.csv/),
      expect.anything(),
    );
  });

  describe('search', () => {
    const getSearchBox = () => {
      const searchContainer = screen.getByRole('search') as HTMLElement;
      return within(searchContainer).getByRole('textbox') as HTMLInputElement;
    };
    it('allows typing in search queries', async () => {
      await renderPage(
        analytics({}).engagement({}).metric({ metric: 'presenters' }).$,
      );

      const searchBox = getSearchBox();

      await userEvent.type(searchBox, 'test123');
      await waitFor(() => {
        expect(searchBox.value).toEqual('test123');
        expect(mockSearchForTagValues).toHaveBeenCalledWith(
          ['engagement'],
          'test123',
          {},
        );
      });
    });
  });

  it('renders meeting rep attendance', async () => {
    await renderPage(
      analytics({}).engagement({}).metric({ metric: 'attendance' }).$,
    );

    expect(
      screen.getByRole('heading', {
        name: /Meeting Rep Attendance/i,
      }),
    ).toBeVisible();
  });

  it('can navigate to meeting rep attendance page', async () => {
    await renderPage(
      analytics({}).engagement({}).metric({ metric: 'presenters' }).$,
    );

    expect(
      screen.getByRole('heading', {
        name: /Representation of Presenters/i,
      }),
    ).toBeVisible();

    const input = screen.getAllByRole('textbox', { hidden: false });

    await userEvent.click(input[0]!);
    await userEvent.click(screen.getByText('Meeting Rep Attendance'));

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    expect(
      screen.getByRole('heading', { name: /Meeting Rep Attendance/i }),
    ).toBeVisible();
    expect(
      screen.queryByText(/Representation of Presenters/i),
    ).not.toBeInTheDocument();
  });

  it('exports analytics for meeting rep attendance', async () => {
    await renderPage(
      analytics({}).engagement({}).metric({ metric: 'attendance' }).$,
    );
    await userEvent.click(screen.getByText(/csv/i));
    expect(mockCreateCsvFileStream).toHaveBeenCalledWith(
      expect.stringMatching(/engagement_attendance_\d+\.csv/),
      expect.anything(),
    );
  });

  it('throws error when fails to fetch attendance data', async () => {
    const error = new Error('Failed to fetch engagement data');
    mockGetMeetingRepAttendance.mockRejectedValue(error);
    jest.spyOn(console, 'error').mockImplementation(() => {});

    let caughtError: Error | null = null;
    errorCallback = (err) => {
      caughtError = err;
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot>
        <TestErrorBoundary>
          <Suspense fallback="loading">{children}</Suspense>
        </TestErrorBoundary>
      </RecoilRoot>
    );

    renderHook(
      () =>
        useAnalyticsMeetingRepAttendance({
          currentPage: 0,
          pageSize: 10,
          sort: 'team_asc',
          timeRange: 'all',
          tags: [],
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(caughtError?.message).toBe('Failed to fetch engagement data');
    });

    errorCallback = null;
  });

  it('throws error when engagement state is an Error', async () => {
    const error = new Error('Failed to fetch engagement data');
    mockGetEngagement.mockRejectedValue(error);
    jest.spyOn(console, 'error').mockImplementation(() => {});

    let caughtError: Error | null = null;
    errorCallback = (err) => {
      caughtError = err;
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot>
        <TestErrorBoundary>
          <Suspense fallback="loading">{children}</Suspense>
        </TestErrorBoundary>
      </RecoilRoot>
    );

    renderHook(
      () =>
        useAnalyticsEngagement({
          currentPage: 0,
          pageSize: 10,
          sort: 'team_asc',
          timeRange: 'all',
          tags: ['engagement'],
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(caughtError?.message).toBe('Failed to fetch engagement data');
    });

    errorCallback = null;
  });

  describe('loadTags function', () => {
    it('calls attendanceClient.getTagSuggestions and maps response correctly for attendance page', async () => {
      const mockTagSuggestions = ['team1', 'team2', 'team3'];
      mockGetTagSuggestions.mockResolvedValue(mockTagSuggestions);

      await renderPage(
        analytics({}).engagement({}).metric({ metric: 'attendance' }).$,
      );

      const searchContainer = screen.getByRole('search') as HTMLElement;
      const searchBox = within(searchContainer).getByRole(
        'textbox',
      ) as HTMLInputElement;

      mockGetTagSuggestions.mockClear(); // Clear any previous calls
      await userEvent.type(searchBox, 'test');

      await waitFor(() => {
        expect(mockGetTagSuggestions).toHaveBeenCalledWith('test', 'flat');
      });

      // May be called multiple times due to typing/debounce, verify at least once with correct params
      expect(mockGetTagSuggestions).toHaveBeenCalled();
    });
  });
});
