import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { PAGE_SIZE } from '../../hooks';
import { createEventListAlgoliaResponse } from '../../__fixtures__/algolia';
import { getTagSearchResults } from '../api';
import ResultList, { ResultListProps } from '../ResultList';
import { tagSearchResultsState } from '../state';

jest.mock('../api');

const renderList = async (props: ResultListProps, searchQuery = '') => {
  render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          tagSearchResultsState({
            searchQuery,
            currentPage: 0,
            filters: new Set(),
            pageSize: PAGE_SIZE,
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/events']}>
              <ResultList {...props} />
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  return waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};
beforeEach(() => {
  jest.resetAllMocks();
});

describe('EventsList', () => {
  const mockGetTagSearchResults = getTagSearchResults as jest.MockedFunction<
    typeof getTagSearchResults
  >;
  it('renders events', async () => {
    mockGetTagSearchResults.mockResolvedValue(
      createEventListAlgoliaResponse(1),
    );
    await renderList({ searchQuery: '' });
    expect(screen.getByRole('link', { name: 'Event 0' })).toBeInTheDocument();
  });
});
