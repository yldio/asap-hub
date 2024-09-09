import { AlgoliaSearchClient, EMPTY_ALGOLIA_RESPONSE } from '@asap-hub/algolia';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { createCsvFileStream } from '@asap-hub/frontend-utils';
import {
  EngagementPerformance,
  ListEngagementAlgoliaResponse,
} from '@asap-hub/model';
import { analytics } from '@asap-hub/routing';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { useAnalyticsAlgolia } from '../../../hooks/algolia';
import { getEngagement, getEngagementPerformance } from '../api';
import Engagement from '../Engagement';
import { analyticsEngagementState } from '../state';

jest.mock('../api');
mockConsoleError();

jest.mock('@asap-hub/algolia', () => ({
  ...jest.requireActual('@asap-hub/algolia'),
  algoliaSearchClientFactory: jest
    .fn()
    .mockReturnValue({} as AlgoliaSearchClient<'crn'>),
}));

jest.mock('../../../hooks/algolia', () => ({
  useAnalyticsAlgolia: jest.fn(),
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

const mockGetPerformance = getEngagementPerformance as jest.MockedFunction<
  typeof getEngagementPerformance
>;

const mockSearchForTagValues = jest.fn() as jest.MockedFunction<
  AlgoliaSearchClient<'analytics'>['searchForTagValues']
>;

const mockSearch = jest.fn() as jest.MockedFunction<
  AlgoliaSearchClient<'analytics'>['search']
>;

const mockUseAnalyticsAlgolia = useAnalyticsAlgolia as jest.MockedFunction<
  typeof useAnalyticsAlgolia
>;

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
beforeEach(() => {
  jest.clearAllMocks();

  mockUseAnalyticsAlgolia.mockReturnValue({
    client: mockAlgoliaClient as unknown as AlgoliaSearchClient<'analytics'>,
  });
  mockAlgoliaClient.search.mockResolvedValue(EMPTY_ALGOLIA_RESPONSE);
  mockGetEngagement.mockResolvedValue(data);
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
              <Route path="/analytics/engagement/">
                <Engagement />
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

describe('Engagement', () => {
  it('renders with data', async () => {
    await renderPage(analytics({}).engagement({}).$);

    expect(screen.getAllByText('Representation of Presenters').length).toBe(1);
    expect(screen.getByText('Test Team')).toBeInTheDocument();
    expect(screen.getAllByText('1')).toHaveLength(2); // one of the 1s is pagination
    expect(screen.getAllByText('2 (67%)')).toHaveLength(1);
    expect(screen.getAllByText('3')).toHaveLength(1);
    expect(screen.getAllByText('3 (100%)')).toHaveLength(1);
    expect(screen.getAllByText('4')).toHaveLength(1);
  });

  it('calls algolia client with the right index name', async () => {
    await renderPage(analytics({}).engagement({}).$);

    await waitFor(() => {
      expect(mockUseAnalyticsAlgolia).toHaveBeenLastCalledWith(
        expect.not.stringContaining('team_desc'),
      );
    });

    userEvent.click(
      screen.getByTitle('Active Alphabetical Ascending Sort Icon'),
    );

    await waitFor(() => {
      expect(mockUseAnalyticsAlgolia).toHaveBeenLastCalledWith(
        expect.stringContaining('team_desc'),
      );
    });
  });

  it('calls algolia with the correct time range', async () => {
    await renderPage(analytics({}).engagement({}).$);

    await waitFor(() => {
      expect(mockGetEngagement).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({ timeRange: 'all' }),
      );
    });

    userEvent.click(screen.getByRole('button', { name: /chevron down/i }));
    userEvent.click(
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
    await renderPage(analytics({}).engagement({}).$);

    userEvent.click(screen.getByText(/csv/i));
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
      await renderPage(analytics({}).engagement({}).$);

      const searchBox = getSearchBox();

      userEvent.type(searchBox, 'test123');
      expect(searchBox.value).toEqual('test123');
      await waitFor(() =>
        expect(mockSearchForTagValues).toHaveBeenCalledWith(
          ['engagement'],
          'test123',
          {},
        ),
      );
    });
  });
});
