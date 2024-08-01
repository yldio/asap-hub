import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { createListNewsResponse } from '@asap-hub/fixtures';
import { NewsFrequency } from '@asap-hub/model';
import { newsRoutes } from '@asap-hub/routing';
import { fireEvent } from '@testing-library/dom';
import { render, renderHook, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { usePagination, usePaginationParams } from '../../hooks';
import { getNews } from '../api';
import NewsPage from '../Routes';
import { newsIndexState } from '../state';

jest.mock('../api');

const mockGetNews = getNews as jest.MockedFunction<typeof getNews>;
const pageSize = 10;

afterEach(() => {
  mockGetNews.mockClear();
});
mockConsoleError();

const renderPage = async () => {
  const result = render(
    <RecoilRoot
      initializeState={({ reset }) =>
        reset(
          newsIndexState({
            currentPage: 0,
            pageSize,
            filters: new Set<NewsFrequency>(),
            searchQuery: '',
          }),
        )
      }
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[newsRoutes.DEFAULT.buildPath({})]}>
              <Routes>
                <Route path={newsRoutes.DEFAULT.path} element={<NewsPage />} />
              </Routes>
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

it('renders the page title', async () => {
  mockGetNews.mockResolvedValue(createListNewsResponse(pageSize, pageSize));

  const { getByRole } = await renderPage();

  expect(getByRole('heading', { level: 1 })).toHaveTextContent(/News/i);
});

it('renders a counter with the total number of items', async () => {
  const numberOfItems = 20;
  mockGetNews.mockResolvedValue(
    createListNewsResponse(pageSize, numberOfItems),
  );

  const { getByText } = await renderPage();
  await waitFor(() => {
    expect(mockGetNews).toHaveBeenCalled();
    expect(getByText(`${numberOfItems} results found`)).toBeVisible();
  });
});

it('renders a paginated list of news', async () => {
  const numberOfItems = 40;
  mockGetNews.mockResolvedValue(
    createListNewsResponse(pageSize, numberOfItems),
  );

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
  await waitFor(() => {
    expect(getAllByText('News Item')).toHaveLength(pageSize);
  });
  expect(result.current.usePagination.numberOfPages).toBe(4);
  expect(result.current.usePaginationParams.currentPage).toBe(0);
});

it('renders error message when when the request it not a 2XX', async () => {
  mockGetNews.mockRejectedValue(new Error('error'));

  const { getByText } = await renderPage();
  await waitFor(() => {
    expect(mockGetNews).toHaveBeenCalled();
    expect(getByText(/Something went wrong/i)).toBeVisible();
  });
});

it('can perform a search', async () => {
  mockGetNews.mockResolvedValue(createListNewsResponse(pageSize));
  const { getByPlaceholderText } = await renderPage();
  fireEvent.change(getByPlaceholderText(/news/i), {
    target: { value: 'example' },
  });
  await waitFor(() =>
    expect(mockGetNews).toHaveBeenLastCalledWith(
      expect.objectContaining({ searchQuery: 'example' }),
      expect.anything(),
    ),
  );
});

it('can perform a filter search', async () => {
  mockGetNews.mockResolvedValue(createListNewsResponse(pageSize));
  const { getByTitle, getByText } = await renderPage();
  userEvent.click(getByTitle('Filter'));
  userEvent.click(getByText(/Biweekly/i));

  await waitFor(() =>
    expect(mockGetNews).toHaveBeenLastCalledWith(
      expect.objectContaining({ filters: new Set('Biweekly Newsletter') }),
      expect.anything(),
    ),
  );
});
