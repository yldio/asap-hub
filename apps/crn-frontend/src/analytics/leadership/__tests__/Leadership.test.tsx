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
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import Leadership from '../Leadership';
import { analyticsLeadershipState } from '../state';
import { useAnalyticsAlgolia } from '../../../hooks/algolia';

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

const mockCreateCsvFileStream = createCsvFileStream as jest.MockedFunction<
  typeof createCsvFileStream
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

beforeEach(() => {
  jest.clearAllMocks();

  const mockAlgoliaClient = {
    searchForTagValues: mockSearchForTagValues,
    search: mockSearch,
  };

  mockUseAnalyticsAlgolia.mockReturnValue({
    client: mockAlgoliaClient as unknown as AlgoliaSearchClient<'analytics'>,
  });
  mockAlgoliaClient.search.mockResolvedValue(EMPTY_ALGOLIA_RESPONSE);
});

const renderPage = async (
  path = analytics({}).leadership({}).metric({ metric: 'working-group' }).$,
) => {
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
            <MemoryRouter initialEntries={[path]}>
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
  const label = 'Interest Group Leadership & Membership';

  await renderPage();
  const input = screen.getAllByRole('textbox', { hidden: false })[0];

  input && userEvent.click(input);
  userEvent.click(screen.getByText(label));

  expect(screen.getAllByText(label).length).toBe(2);
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
    const label = 'Interest Group Leadership & Membership';

    await renderPage();
    const input = screen.getAllByRole('textbox', { hidden: false })[0];

    input && userEvent.click(input);
    userEvent.click(screen.getByText(label));
    userEvent.click(screen.getByText(/csv/i));
    expect(mockCreateCsvFileStream).toHaveBeenCalledWith(
      expect.stringMatching(/leadership_interest-group_\d+\.csv/),
      expect.anything(),
    );
  });
});
