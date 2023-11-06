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
import {
  createAlgoliaResponse,
  createEventListAlgoliaResponse,
  createNewsListAlgoliaResponse,
  createOutputListAlgoliaResponse,
  createProjectListAlgoliaResponse,
  createUserListAlgoliaResponse,
} from '../../__fixtures__/algolia';
import { getTagSearchResults } from '../api';
import ResultList, { ResultListProps } from '../ResultList';
import { tagSearchResultsState } from '../state';

jest.mock('../api');

const renderList = async (props: ResultListProps, tags?: string[]) => {
  render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          tagSearchResultsState({
            tags: tags || [],
            currentPage: 0,
            entityType: new Set(),
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

describe('ResultList', () => {
  const mockGetTagSearchResults = getTagSearchResults as jest.MockedFunction<
    typeof getTagSearchResults
  >;
  it('renders events', async () => {
    mockGetTagSearchResults.mockResolvedValue(
      createEventListAlgoliaResponse(1),
    );
    await renderList({}, ['test']);
    expect(screen.getByRole('link', { name: 'Event 0' })).toBeInTheDocument();
  });

  it('renders users', async () => {
    mockGetTagSearchResults.mockResolvedValue(createUserListAlgoliaResponse(1));
    await renderList({}, ['test']);
    expect(
      screen.getByRole('link', { name: 'Tony Stark 0, PhD' }),
    ).toBeInTheDocument();
  });

  it('renders projects', async () => {
    mockGetTagSearchResults.mockResolvedValue(
      createProjectListAlgoliaResponse(1),
    );
    await renderList({}, ['test']);
    expect(
      screen.getByRole('link', { name: 'Project Title' }),
    ).toBeInTheDocument();
  });

  it('renders outputs', async () => {
    mockGetTagSearchResults.mockResolvedValue(
      createOutputListAlgoliaResponse(1),
    );
    await renderList({ filters: new Set() }, ['test']);
    expect(screen.getByRole('link', { name: 'Output 1' })).toBeInTheDocument();
  });

  it('does not render unsupported types', async () => {
    mockGetTagSearchResults.mockResolvedValue(
      createNewsListAlgoliaResponse(1, 1),
    );
    await renderList({ filters: new Set() }, ['test']);
    expect(
      screen.queryByRole('link', { name: 'News 1' }),
    ).not.toBeInTheDocument();
  });

  it('renders empty state', async () => {
    mockGetTagSearchResults.mockResolvedValue(
      createAlgoliaResponse<'event'>([]),
    );
    await renderList({ filters: new Set() }, []);
    expect(
      screen.getByRole('heading', { name: 'Explore any tags.' }),
    ).toBeInTheDocument();
  });
});
