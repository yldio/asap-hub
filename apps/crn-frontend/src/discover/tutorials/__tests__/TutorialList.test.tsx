import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { ReactNode, Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, waitFor, screen, renderHook } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  createTutorialsResponse,
  createListTutorialsResponse,
} from '@asap-hub/fixtures';
import { createTestQueryClient, Frame } from '@asap-hub/frontend-utils';
import { usePagination, usePaginationParams } from '../../../hooks';

import TutorialList from '../TutorialList';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getTutorials } from '../api';

const MemoryRouterWithFuture = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});
mockConsoleError();

const mockGetTutorials = getTutorials as jest.MockedFunction<
  typeof getTutorials
>;

const pageSize = 10;

const renderTutorials = async (searchQuery = '') => {
  const result = render(
    // fresh query client per render replaces the recoil list-cache reset
    <QueryClientProvider client={createTestQueryClient()}>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/guides-tutorials/tutorials']}>
              <Routes>
                <Route
                  path="/guides-tutorials/tutorials"
                  element={
                    <Frame title={null}>
                      <TutorialList searchQuery={searchQuery} />
                    </Frame>
                  }
                />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </QueryClientProvider>,
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

it('renders tutorial page with two items', async () => {
  mockGetTutorials.mockResolvedValue({
    total: 2,
    items: [
      createTutorialsResponse({ key: 'First One' }),
      createTutorialsResponse({ key: 'Second One' }),
    ],
  });

  await renderTutorials();
  expect(
    screen
      .getAllByRole('heading', { level: 4 })
      .map(({ textContent }) => textContent),
  ).toEqual(['First One title', 'Second One title']);
});

it('renders a counter with the total number of items', async () => {
  const numberOfItems = 20;
  mockGetTutorials.mockResolvedValue(
    createListTutorialsResponse(numberOfItems),
  );

  const { getByText } = await renderTutorials();
  await waitFor(() => expect(mockGetTutorials).toHaveBeenCalled());
  expect(getByText(`${numberOfItems} results found`)).toBeVisible();
});

it('can perform a search', async () => {
  await renderTutorials('searchterm');
  expect(mockGetTutorials).toHaveBeenCalledWith(
    expect.objectContaining({
      searchQuery: 'searchterm',
    }),
    expect.anything(),
  );
});

it('renders error message when the response is not a 2XX', async () => {
  mockGetTutorials.mockRejectedValue(new Error('error'));

  const { getByText } = await renderTutorials();
  expect(mockGetTutorials).toHaveBeenCalled();
  expect(getByText(/Something went wrong/i)).toBeVisible();
});

it('renders a paginated list of tutorials', async () => {
  const numberOfItems = 40;
  mockGetTutorials.mockResolvedValue(
    createListTutorialsResponse(numberOfItems),
  );

  const { result } = renderHook(
    () => ({
      usePaginationParams: usePaginationParams(),
      usePagination: usePagination(numberOfItems, pageSize),
    }),
    {
      wrapper: MemoryRouterWithFuture,
    },
  );

  await renderTutorials();
  expect(result.current.usePagination.numberOfPages).toBe(4);
  expect(result.current.usePaginationParams.currentPage).toBe(0);
});
