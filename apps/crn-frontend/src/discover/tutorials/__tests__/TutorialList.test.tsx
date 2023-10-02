import { Suspense } from 'react';
import { User } from '@asap-hub/auth';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { RecoilRoot } from 'recoil';
import {
  createTutorialsResponse,
  createListTutorialsResponse,
} from '@asap-hub/fixtures';
import { discover } from '@asap-hub/routing';
import { usePagination, usePaginationParams } from '../../../hooks';

import TutorialList from '../TutorialList';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getTutorials } from '../api';
import { tutorialsIndexState } from '../state';

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetTutorials = getTutorials as jest.MockedFunction<
  typeof getTutorials
>;
const pageSize = 10;

const renderTutorials = async (user: Partial<User> = {}, searchQuery = '') => {
  const result = render(
    <Suspense fallback="loading">
      <RecoilRoot
        initializeState={({ reset }) =>
          reset(
            tutorialsIndexState({
              currentPage: 0,
              pageSize,
              searchQuery: '',
              filters: new Set(),
            }),
          )
        }
      >
        <Auth0Provider user={user}>
          <WhenReady>
            <MemoryRouter initialEntries={[{ pathname: discover({}).$ }]}>
              <Route path={discover.template}>
                <TutorialList searchQuery={searchQuery} />
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
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: [`/guides-tutorials/tutorials`],
      },
    },
  );

  await renderTutorials();
  expect(result.current.usePagination.numberOfPages).toBe(4);
  expect(result.current.usePaginationParams.currentPage).toBe(0);
});
