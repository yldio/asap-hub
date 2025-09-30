import {
  AlgoliaSearchClient,
  EMPTY_ALGOLIA_FACET_HITS,
} from '@asap-hub/algolia';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { enable } from '@asap-hub/flags';
import { analytics } from '@asap-hub/routing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Suspense } from 'react';
import { MemoryRouter, Route, Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { PreprintComplianceOpensearchResponse } from '@asap-hub/model';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { useAnalyticsAlgolia } from '../../../hooks/algolia';
import { useAnalyticsOpensearch } from '../../../hooks';
import { OpensearchClient } from '../../utils/opensearch';
import OpenScience from '../OpenScience';

jest.mock('../../../hooks/algolia', () => ({
  useAnalyticsAlgolia: jest.fn(),
}));

jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useAnalyticsOpensearch: jest.fn(),
  useSearch: () => ({ tags: [], setTags: jest.fn() }),
  useAnalytics: () => ({ timeRange: 'all' }),
}));

mockConsoleError();

const mockSearchForTagValues = jest.fn() as jest.MockedFunction<
  AlgoliaSearchClient<'analytics'>['searchForTagValues']
>;

const mockGetTagSuggestions = jest.fn() as jest.MockedFunction<
  OpensearchClient<PreprintComplianceOpensearchResponse>['getTagSuggestions']
>;

const mockUseAnalyticsAlgolia = useAnalyticsAlgolia as jest.MockedFunction<
  typeof useAnalyticsAlgolia
>;

const mockUseAnalyticsOpensearch =
  useAnalyticsOpensearch as jest.MockedFunction<typeof useAnalyticsOpensearch>;

beforeEach(() => {
  jest.clearAllMocks();

  const mockAlgoliaClient = {
    searchForTagValues: mockSearchForTagValues,
  };

  const mockOpensearchClient = {
    getTagSuggestions: mockGetTagSuggestions,
    search: jest.fn().mockResolvedValue({ items: [], total: 0 }),
  };

  mockUseAnalyticsAlgolia.mockReturnValue({
    client: mockAlgoliaClient as unknown as AlgoliaSearchClient<'analytics'>,
  });
  mockSearchForTagValues.mockResolvedValue({
    ...EMPTY_ALGOLIA_FACET_HITS,
    facetHits: [
      { value: 'tag1', highlighted: 'tag1', count: 1 },
      { value: 'tag2', highlighted: 'tag2', count: 1 },
    ],
  });

  mockUseAnalyticsOpensearch.mockReturnValue({
    client:
      mockOpensearchClient as unknown as OpensearchClient<PreprintComplianceOpensearchResponse>,
  });
  mockGetTagSuggestions.mockResolvedValue(['tag1', 'tag2']);
});

const renderPage = async (path: string) => {
  const result = render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[path]}>
              <Route path="/analytics/open-science/:metric">
                <OpenScience />
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

describe('OpenScience', () => {
  beforeEach(() => {
    enable('ANALYTICS_PHASE_TWO');
  });

  it('renders with preprint-compliance metric', async () => {
    await renderPage(
      analytics({}).openScience({}).metric({ metric: 'preprint-compliance' }).$,
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Preprint Compliance' }),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Posted Prior to Journal Submission'),
      ).toBeInTheDocument();
    });
    // The table rendering is tested in PreprintCompliance.test.tsx
  });

  it('renders with publication-compliance metric', async () => {
    await renderPage(
      analytics({}).openScience({}).metric({ metric: 'publication-compliance' })
        .$,
    );

    // Check that the publication compliance section is rendered
    expect(
      screen.getByRole('heading', { name: 'Publication Compliance' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Percent compliance by research output type for each team.',
      ),
    ).toBeInTheDocument();
  });

  it('renders metric dropdown with correct options', async () => {
    await renderPage(
      analytics({}).openScience({}).metric({ metric: 'preprint-compliance' }).$,
    );

    // Check that the dropdown shows the correct current value
    expect(screen.getByDisplayValue('preprint-compliance')).toBeInTheDocument();

    // Check that the component renders without errors
    expect(screen.getAllByRole('heading', { name: 'Metric' })).toHaveLength(1);
    expect(
      screen.getByText(/Number of preprints posted to a preprint repository/),
    ).toBeInTheDocument();
  });

  it('changes route when metric dropdown selection changes', async () => {
    const history = createMemoryHistory({
      initialEntries: [
        analytics({}).openScience({}).metric({ metric: 'preprint-compliance' })
          .$,
      ],
    });

    const result = render(
      <RecoilRoot>
        <Suspense fallback="loading">
          <Auth0Provider user={{}}>
            <WhenReady>
              <Router history={history}>
                <Route path="/analytics/open-science/:metric">
                  <OpenScience />
                </Route>
              </Router>
            </WhenReady>
          </Auth0Provider>
        </Suspense>
      </RecoilRoot>,
    );

    await waitFor(() =>
      expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    // Verify we start with preprint-compliance
    expect(
      screen.getByRole('heading', { name: 'Preprint Compliance' }),
    ).toBeInTheDocument();

    const dropdownIndicators = screen.getAllByTitle('Chevron Down');
    userEvent.click(dropdownIndicators[0]!);

    await waitFor(() => {
      expect(screen.getByText('Publication Compliance')).toBeInTheDocument();
    });
    userEvent.click(screen.getByText('Publication Compliance'));

    expect(history.location.pathname).toBe(
      analytics({}).openScience({}).metric({ metric: 'publication-compliance' })
        .$,
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Publication Compliance' }),
      ).toBeInTheDocument();
    });
  });

  describe('OpenSearch tag loading', () => {
    it('uses OpenSearch client for tag suggestions', async () => {
      await renderPage(
        analytics({}).openScience({}).metric({ metric: 'preprint-compliance' })
          .$,
      );

      expect(mockUseAnalyticsOpensearch).toHaveBeenCalledWith(
        'preprint-compliance',
      );
    });
  });

  describe('PreprintCompliance state management', () => {
    it('handles preprint compliance data fetching', async () => {
      const mockPreprintData = {
        items: [
          {
            objectID: 'team1',
            teamId: 'team1',
            teamName: 'Test Team',
            isTeamInactive: false,
            numberOfPreprints: 5,
            numberOfPublications: 3,
            ranking: 'ADEQUATE',
            timeRange: 'all',
            postedPriorPercentage: 80,
          },
        ],
        total: 1,
      };

      const mockSearch = jest.fn().mockResolvedValue(mockPreprintData);
      const mockOpensearchClient = {
        getTagSuggestions: mockGetTagSuggestions,
        search: mockSearch,
      };

      mockUseAnalyticsOpensearch.mockReturnValue({
        client:
          mockOpensearchClient as unknown as OpensearchClient<PreprintComplianceOpensearchResponse>,
      });

      await renderPage(
        analytics({}).openScience({}).metric({ metric: 'preprint-compliance' })
          .$,
      );

      expect(mockUseAnalyticsOpensearch).toHaveBeenCalledWith(
        'preprint-compliance',
      );
    });

    it('uses OpenSearch client for data fetching', async () => {
      const mockPreprintData = {
        items: [],
        total: 0,
      };

      const mockSearch = jest.fn().mockResolvedValue(mockPreprintData);
      const mockOpensearchClient = {
        getTagSuggestions: mockGetTagSuggestions,
        search: mockSearch,
      };

      mockUseAnalyticsOpensearch.mockReturnValue({
        client:
          mockOpensearchClient as unknown as OpensearchClient<PreprintComplianceOpensearchResponse>,
      });

      await renderPage(
        analytics({}).openScience({}).metric({ metric: 'preprint-compliance' })
          .$,
      );

      expect(mockUseAnalyticsOpensearch).toHaveBeenCalledWith(
        'preprint-compliance',
      );
    });
  });
});
