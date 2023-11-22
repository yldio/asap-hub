import {
  AlgoliaSearchClient,
  CRNTagSearchEntitiesListArray,
  EMPTY_ALGOLIA_FACET_HITS,
  EMPTY_ALGOLIA_RESPONSE,
} from '@asap-hub/algolia';
import { createUserResponse } from '@asap-hub/fixtures';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { createAlgoliaResponse } from '../../__fixtures__/algolia';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { useAlgolia } from '../../hooks/algolia';

import { getTagSearch } from '../api';
import { refreshTagSearchIndex } from '../state';

import Routes from '../Routes';

jest.mock('../api');
jest.mock('../../hooks/algolia', () => ({
  useAlgolia: jest.fn(),
}));

const mockGetTagSearch = getTagSearch as jest.MockedFunction<
  typeof getTagSearch
>;

const mockSearchForTagValues = jest.fn() as jest.MockedFunction<
  AlgoliaSearchClient<'crn'>['searchForTagValues']
>;
const mockSearch = jest.fn() as jest.MockedFunction<
  AlgoliaSearchClient<'crn'>['search']
>;
beforeEach(() => {
  jest.clearAllMocks();
  const mockUseAlgolia = useAlgolia as jest.MockedFunction<typeof useAlgolia>;
  const mockAlgoliaClient = {
    searchForTagValues: mockSearchForTagValues,
    search: mockSearch,
  };
  mockUseAlgolia.mockReturnValue({
    client: mockAlgoliaClient as unknown as AlgoliaSearchClient<'crn'>,
  });
  mockGetTagSearch.mockResolvedValue(EMPTY_ALGOLIA_RESPONSE);
  mockAlgoliaClient.search.mockResolvedValue(EMPTY_ALGOLIA_RESPONSE);
  mockAlgoliaClient.searchForTagValues.mockResolvedValue(
    EMPTY_ALGOLIA_FACET_HITS,
  );
});

const renderTagsPage = async (query = '') => {
  render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshTagSearchIndex, Math.random());
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[{ pathname: '/', search: query }]}>
              <Routes />
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  return waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

it('allows typing in tag queries', async () => {
  await renderTagsPage();
  const searchBox = screen.getByRole('textbox') as HTMLInputElement;

  userEvent.type(searchBox, 'test123');
  expect(searchBox.value).toEqual('test123');
  await waitFor(() => {
    expect(mockSearchForTagValues).toHaveBeenCalledWith(
      CRNTagSearchEntitiesListArray,
      'test123',
      {
        facetFilters: [],
      },
    );
  });
});

it('Will search algolia using selected tag', async () => {
  mockSearchForTagValues.mockResolvedValue({
    ...EMPTY_ALGOLIA_FACET_HITS,
    facetHits: [{ value: 'LGW', count: 1, highlighted: 'LGW' }],
  });

  await renderTagsPage();

  userEvent.click(screen.getByRole('textbox'));
  userEvent.click(screen.getByText('LGW'));
  await waitFor(() =>
    expect(mockGetTagSearch).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ tags: ['LGW'] }),
    ),
  );
});

it('will lookup new "default options" using previously selected tag filter', async () => {
  mockSearchForTagValues.mockResolvedValue({
    ...EMPTY_ALGOLIA_FACET_HITS,
    facetHits: [
      { value: 'LGW', count: 1, highlighted: 'LGW' },
      { value: 'LTN', count: 1, highlighted: 'LTN' },
    ],
  });
  await renderTagsPage();

  userEvent.click(screen.getByRole('textbox'));
  userEvent.click(screen.getByText('LGW'));
  await waitFor(() => {
    expect(mockGetTagSearch).toHaveBeenCalled();
    expect(mockSearchForTagValues).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ facetFilters: ['_tags:LGW'] }),
    );
  });
});

it('Will show algolia results', async () => {
  mockSearchForTagValues.mockResolvedValue({
    ...EMPTY_ALGOLIA_FACET_HITS,
    facetHits: [{ value: 'LGW', count: 1, highlighted: 'LGW' }],
  });
  const userResponse = createUserResponse();
  const algoliaResponse = createAlgoliaResponse([
    {
      ...userResponse,
      displayName: 'Tom Cruise',
      objectID: userResponse.id,
      __meta: { type: 'user' },
    },
  ]);
  mockGetTagSearch.mockResolvedValueOnce(algoliaResponse);

  await renderTagsPage();

  userEvent.click(screen.getByRole('textbox'));
  userEvent.click(screen.getByText('LGW'));
  await waitFor(() =>
    expect(screen.getByText('Tom Cruise')).toBeInTheDocument(),
  );
});

it('Will show page when algolia rejects with undefined', async () => {
  mockSearchForTagValues.mockResolvedValue({
    ...EMPTY_ALGOLIA_FACET_HITS,
    facetHits: [{ value: 'LGW', count: 1, highlighted: 'LGW' }],
  });

  mockGetTagSearch.mockRejectedValueOnce(undefined);

  await renderTagsPage();

  userEvent.click(screen.getByRole('textbox'));
  userEvent.click(screen.getByText('LGW'));
  await waitFor(() =>
    expect(mockGetTagSearch).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ tags: ['LGW'] }),
    ),
  );
  expect(screen.getByText('Tags Search')).toBeInTheDocument();
});

it('Will show page when algolia rejects with error', async () => {
  jest.spyOn(console, 'error').mockImplementation();

  mockSearchForTagValues.mockResolvedValue({
    ...EMPTY_ALGOLIA_FACET_HITS,
    facetHits: [{ value: 'LGW', count: 1, highlighted: 'LGW' }],
  });

  mockGetTagSearch.mockRejectedValueOnce(new Error('ops'));

  await renderTagsPage();

  userEvent.click(screen.getByRole('textbox'));
  userEvent.click(screen.getByText('LGW'));
  await waitFor(() =>
    expect(mockGetTagSearch).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ tags: ['LGW'] }),
    ),
  );
  expect(screen.getByText('Tags Search')).toBeInTheDocument();
});
