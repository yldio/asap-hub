import { RecoilRoot } from 'recoil';
import { Suspense } from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';

import { renderHook } from '@testing-library/react-hooks';
import { createNewsResponse } from '@asap-hub/fixtures';
import { usePagination, usePaginationParams } from '../../hooks';

import NewsAndEventsPage from '../Routes';
import { refreshNewsItemState } from '../state';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';

import { getNews } from '../api';

jest.mock('../api');

const mockGetNews = getNews as jest.MockedFunction<typeof getNews>;

const getMockedResponse = (pageSize = 10, numberOfItems = 10) => ({
  total: numberOfItems,
  items: Array.from({ length: pageSize }, (_, idx) => ({
    ...createNewsResponse(idx + 1),
    title: 'News Item',
  })),
});
beforeEach(() => {
  mockGetNews.mockClear();
});

const renderPage = async (newsResponse = createNewsResponse(1)) => {
  const result = render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(refreshNewsItemState(newsResponse.id), Math.random())
      }
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/news']}>
              <Route path="/news">
                <NewsAndEventsPage />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitFor(() =>
    expect(result.queryByText(/auth0/i)).not.toBeInTheDocument(),
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

describe('news page', () => {
  it('renders the page title', async () => {
    const { getByRole } = await renderPage();

    expect(getByRole('heading', { level: 1 })).toHaveTextContent(/News/i);
  });

  it('renders a counter with the total number of items', async () => {
    const pageSize = 10;
    const numberOfItems = 20;
    mockGetNews.mockResolvedValue(getMockedResponse(pageSize, numberOfItems));

    const { getByText } = await renderPage();
    expect(getByText(`${numberOfItems} results found`)).toBeVisible();
  });

  it('renders a paginated list of news', async () => {
    const pageSize = 5;
    const numberOfItems = 20;
    mockGetNews.mockResolvedValue(getMockedResponse(pageSize, numberOfItems));

    const { result } = renderHook(
      () => ({
        usePaginationParams: usePaginationParams(),
        usePagination: usePagination(numberOfItems, pageSize),
      }),
      {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: [`/news`],
        },
      },
    );

    const { getAllByText } = await renderPage();
    expect(getAllByText('News Item')).toHaveLength(pageSize);
    expect(result.current.usePagination.numberOfPages).toBe(4);
    expect(result.current.usePaginationParams.currentPage).toBe(0);
  });

  it('renders error message when when the request it not a 2XX', async () => {
    mockGetNews.mockRejectedValue(new Error('error'));

    const { getByText } = await renderPage();
    expect(getByText('Something went wrong!')).toBeInTheDocument();
  });
});
