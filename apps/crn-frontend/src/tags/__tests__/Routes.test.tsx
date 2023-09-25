import {
  AlgoliaSearchClient,
  EMPTY_ALGOLIA_FACET_HITS,
  EMPTY_ALGOLIA_RESPONSE,
} from '@asap-hub/algolia';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
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

import { useAlgolia } from '../../hooks/algolia';
import { getResearchOutputs } from '../../shared-research/api';
import { refreshResearchOutputIndex } from '../../shared-research/state';
import Routes from '../Routes';

jest.mock('../../shared-research/api');
jest.mock('../../hooks/algolia', () => ({
  useAlgolia: jest.fn(),
}));

const mockGetResearchOutputs = getResearchOutputs as jest.MockedFunction<
  typeof getResearchOutputs
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
  mockAlgoliaClient.search.mockResolvedValue(EMPTY_ALGOLIA_RESPONSE);
  mockAlgoliaClient.searchForTagValues.mockResolvedValue(
    EMPTY_ALGOLIA_FACET_HITS,
  );
});

const renderTagsPage = async (query = '') => {
  render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshResearchOutputIndex, Math.random());
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
      ['research-output'],
      'test123',
      { tagFilters: [] },
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
    expect(mockGetResearchOutputs).toHaveBeenCalledWith(
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
    expect(mockGetResearchOutputs).toHaveBeenCalled();
    expect(mockSearchForTagValues).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ tagFilters: ['LGW'] }),
    );
  });
});
