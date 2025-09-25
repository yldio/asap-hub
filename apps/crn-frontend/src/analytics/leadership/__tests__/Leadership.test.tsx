import {
  AlgoliaSearchClient,
  EMPTY_ALGOLIA_FACET_HITS,
  EMPTY_ALGOLIA_RESPONSE,
} from '@asap-hub/algolia';
import { createCsvFileStream } from '@asap-hub/frontend-utils';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { analytics } from '@asap-hub/routing';
import { render, screen, waitFor, within } from '@testing-library/react';
import { when } from 'jest-when';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import * as flags from '@asap-hub/flags';
import { OSChampionOpensearchResponse } from '@asap-hub/model';
import Leadership from '../Leadership';
import { analyticsLeadershipState } from '../state';
import { useAnalyticsAlgolia } from '../../../hooks/algolia';
import { useAnalyticsOpensearch } from '../../../hooks';
import { OpensearchClient } from '../../utils/opensearch';

jest.spyOn(console, 'error').mockImplementation();
jest.mock('@asap-hub/frontend-utils', () => {
  const original = jest.requireActual('@asap-hub/frontend-utils');
  return {
    ...original,
    createCsvFileStream: jest
      .fn()
      .mockImplementation(() => ({ write: jest.fn(), end: jest.fn() })),
  };
});

jest.mock('../../../hooks/algolia', () => ({
  useAnalyticsAlgolia: jest.fn(),
}));

jest.mock('../../../hooks/opensearch', () => ({
  useAnalyticsOpensearch: jest.fn(),
}));

const mockCreateCsvFileStream = createCsvFileStream as jest.MockedFunction<
  typeof createCsvFileStream
>;

const mockSearchForTagValues = jest.fn() as jest.MockedFunction<
  AlgoliaSearchClient<'analytics'>['searchForTagValues']
>;

const mockSearch = jest.fn() as jest.MockedFunction<
  AlgoliaSearchClient<'analytics'>['search']
>;

const mockGetTagSuggestions = jest.fn() as jest.MockedFunction<
  OpensearchClient<OSChampionOpensearchResponse>['getTagSuggestions']
>;

const mockOSChampionSearch = jest.fn() as jest.MockedFunction<
  OpensearchClient<OSChampionOpensearchResponse>['search']
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
    search: mockSearch,
  };

  const mockOpensearchClient = {
    getTagSuggestions: mockGetTagSuggestions,
    search: mockOSChampionSearch,
  };

  mockUseAnalyticsAlgolia.mockReturnValue({
    client: mockAlgoliaClient as unknown as AlgoliaSearchClient<'analytics'>,
  });
  mockAlgoliaClient.search.mockResolvedValue(EMPTY_ALGOLIA_RESPONSE);

  mockUseAnalyticsOpensearch.mockReturnValue({
    client:
      mockOpensearchClient as unknown as OpensearchClient<OSChampionOpensearchResponse>,
  });
  mockOpensearchClient.search.mockResolvedValue({ items: [], total: 0 });
});

const getPath = (metric: string) =>
  analytics({}).leadership({}).metric({ metric }).$;
const renderPage = async (metric = 'working-group') => {
  const result = render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          analyticsLeadershipState({
            currentPage: 0,
            pageSize: 10,
            sort: 'team_asc',
            tags: [],
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[getPath(metric)]}>
              <Route path="/analytics/leadership/:metric">
                <Leadership />
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

it('renders with working group data', async () => {
  await renderPage();
  expect(
    screen.getAllByText('Working Group Leadership & Membership').length,
  ).toBe(2);
});

it('renders with interest group data', async () => {
  await renderPage('interest-group');
  expect(
    screen.getAllByText('Interest Group Leadership & Membership').length,
  ).toBe(2);
});

it('renders with open science data if flag is on', async () => {
  jest.spyOn(flags, 'isEnabled').mockReturnValue(true);
  await renderPage('os-champion');
  expect(screen.getAllByText('Open Science Champion').length).toBe(2);
});

it('switches to interest group data', async () => {
  jest.spyOn(console, 'error').mockImplementation();
  const label = /Interest Group Leadership & Membership/;

  await renderPage('working-group');
  const input = screen.getAllByRole('textbox', { hidden: false })[0]!;
  userEvent.click(input);
  userEvent.click(screen.getByText(label));

  expect(screen.getAllByText(label).length).toBe(2);
});

it('switches to open science champion data if flag is on', async () => {
  jest.spyOn(console, 'error').mockImplementation();
  jest.spyOn(flags, 'isEnabled').mockReturnValue(true);
  const label = /Open Science Champion/;

  await renderPage();
  const input = screen.getAllByRole('textbox', { hidden: false })[0]!;
  userEvent.click(input);
  userEvent.click(screen.getByText(label));

  expect(screen.getAllByText(label).length).toBe(3);
});

it('redirects to working group if OS Champion feature flag is off', async () => {
  jest.spyOn(flags, 'isEnabled').mockReturnValue(false);
  await renderPage('os-champion');
  expect(
    screen.getAllByText('Working Group Leadership & Membership').length,
  ).toBe(2);
});

it('calls algolia client with the right index name', async () => {
  await renderPage();

  await waitFor(() => {
    expect(mockUseAnalyticsAlgolia).toHaveBeenLastCalledWith(
      expect.not.stringContaining('team_desc'),
    );
  });
  userEvent.click(screen.getByTitle('Active Alphabetical Ascending Sort Icon'));
  await waitFor(() => {
    expect(mockUseAnalyticsAlgolia).toHaveBeenLastCalledWith(
      expect.stringContaining('team_desc'),
    );
  });
});

describe('search', () => {
  const getSearchBox = () => {
    const searchContainer = screen.getByRole('search') as HTMLElement;
    return within(searchContainer).getByRole('textbox') as HTMLInputElement;
  };
  describe('algolia', () => {
    it('allows typing in search queries', async () => {
      await renderPage();
      const searchBox = getSearchBox();

      userEvent.type(searchBox, 'test123');
      expect(searchBox.value).toEqual('test123');
      await waitFor(() =>
        expect(mockSearchForTagValues).toHaveBeenCalledWith(
          ['team-leadership'],
          'test123',
          {},
        ),
      );
    });
    it('Will search algolia using selected team', async () => {
      mockSearchForTagValues.mockResolvedValue({
        ...EMPTY_ALGOLIA_FACET_HITS,
        facetHits: [{ value: 'Alessi', count: 1, highlighted: 'Alessi' }],
      });

      await renderPage();
      const searchBox = getSearchBox();

      userEvent.click(searchBox);
      userEvent.click(screen.getByText('Alessi'));
      await waitFor(() =>
        expect(mockSearch).toHaveBeenCalledWith(
          expect.anything(),
          expect.anything(),
          expect.objectContaining({ tagFilters: [['Alessi']] }),
        ),
      );
    });
  });

  describe('opensearch', () => {
    it('allows typing in search queries', async () => {
      jest.spyOn(flags, 'isEnabled').mockReturnValue(true);
      await renderPage('os-champion');
      const searchBox = getSearchBox();

      userEvent.type(searchBox, 'test123');
      expect(searchBox.value).toEqual('test123');
      await waitFor(() =>
        expect(mockGetTagSuggestions).toHaveBeenCalledWith('test123'),
      );
    });
    it('Will search opensearch using selected team', async () => {
      jest.spyOn(flags, 'isEnabled').mockReturnValue(true);
      mockGetTagSuggestions.mockResolvedValue(['Alessi']);

      await renderPage('os-champion');
      const searchBox = getSearchBox();

      userEvent.click(searchBox);
      userEvent.click(screen.getByText('Alessi'));
      await waitFor(() =>
        expect(mockOSChampionSearch).toHaveBeenCalledWith(
          ['Alessi'],
          0,
          10,
          'all',
        ),
      );
    });
  });
});

describe('csv export', () => {
  it('exports analytics for working groups', async () => {
    await renderPage();
    userEvent.click(screen.getByText(/csv/i));
    expect(mockCreateCsvFileStream).toHaveBeenCalledWith(
      expect.stringMatching(/leadership_working-group_\d+\.csv/),
      expect.anything(),
    );
  });

  it('exports analytics for interest groups', async () => {
    await renderPage('interest-group');
    userEvent.click(screen.getByText(/csv/i));
    expect(mockCreateCsvFileStream).toHaveBeenCalledWith(
      expect.stringMatching(/leadership_interest-group_\d+\.csv/),
      expect.anything(),
    );
  });

  it('exports analytics for os champion', async () => {
    jest.spyOn(flags, 'isEnabled').mockReturnValue(true);
    await renderPage('os-champion');
    userEvent.click(screen.getByText(/csv/i));
    expect(mockCreateCsvFileStream).toHaveBeenCalledWith(
      expect.stringMatching(/leadership_os-champion_\d+\.csv/),
      expect.anything(),
    );
  });
});

it('renders data for different time ranges', async () => {
  const osChampionResponse: OSChampionOpensearchResponse = {
    objectID: 'object-id-1',
    teamId: 'team-id-1',
    teamName: 'Team One',
    isTeamInactive: false,
    teamAwardsCount: 20,
    timeRange: 'all',
    users: [
      {
        id: 'user-id-1',
        name: 'Test User One',
        awardsCount: 1,
      },
      {
        id: 'user-id-2',
        name: 'Test User Two',
        awardsCount: 1,
      },
    ],
  };
  jest.spyOn(flags, 'isEnabled').mockReturnValue(true);
  when(mockOSChampionSearch)
    .calledWith([], 0, 10, 'all')
    .mockResolvedValue({ items: [osChampionResponse], total: 1 });
  when(mockOSChampionSearch)
    .calledWith([], 0, 10, '30d')
    .mockResolvedValue({
      items: [
        {
          ...osChampionResponse,
          objectID: 'object-id-2',
          timeRange: '30d',
          teamAwardsCount: 10,
        },
      ],
      total: 1,
    });
  await renderPage('os-champion');

  expect(screen.getByText('20')).toBeVisible();
  expect(screen.queryByText('10')).not.toBeInTheDocument();

  const rangeButton = screen.getByRole('button', {
    name: /Since Hub Launch \(2020\) Chevron Down/i,
  });
  userEvent.click(rangeButton);
  userEvent.click(screen.getByText(/Last 30 days/));
  await waitFor(() =>
    expect(screen.getAllByText('Open Science Champion')).toHaveLength(2),
  );

  expect(screen.getByText('10')).toBeVisible();
  expect(screen.queryByText('20')).not.toBeInTheDocument();
});
