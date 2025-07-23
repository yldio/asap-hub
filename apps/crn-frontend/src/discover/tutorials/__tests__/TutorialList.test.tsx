import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import {
  createTutorialsResponse,
  createListTutorialsResponse,
} from '@asap-hub/fixtures';
import { Frame } from '@asap-hub/frontend-utils';
import { usePagination, usePaginationParams } from '../../../hooks';

import TutorialList from '../TutorialList';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getTutorials } from '../api';
import { tutorialsListState } from '../state';

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
    <Suspense fallback="loading">
      <RecoilRoot
        initializeState={({ reset }) => {
          reset(
            tutorialsListState({
              searchQuery,
              currentPage: 0,
              filters: new Set(),
              pageSize: 10,
            }),
          );
        }}
      >
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/guides-tutorials/tutorials']}>
              <Route path="/guides-tutorials/tutorials">
                <Frame title={null}>
                  <TutorialList searchQuery={searchQuery} />
                </Frame>
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>
    </Suspense>,
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

function TestComponent({ total }: { total: number }) {
  const paginationParams = usePaginationParams();
  const pagination = usePagination(total, pageSize);

  // For debugging
  return (
    <div>
      <div data-testid="number-of-pages">{pagination.numberOfPages}</div>
      <div data-testid="current-page">{paginationParams.currentPage}</div>
    </div>
  );
}

it('renders a paginated list of tutorials', async () => {
  const numberOfItems = 40;
  mockGetTutorials.mockResolvedValue(
    createListTutorialsResponse(numberOfItems),
  );

  const { getByTestId } = render(
    <MemoryRouter initialEntries={['/guides-tutorials/tutorials']}>
      <TestComponent total={numberOfItems} />
    </MemoryRouter>,
  );

  await waitFor(() => {
    expect(getByTestId('number-of-pages').textContent).toBe('4');
    expect(getByTestId('current-page').textContent).toBe('0');
  });
});
