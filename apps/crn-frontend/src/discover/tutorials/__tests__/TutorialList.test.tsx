import { Suspense } from 'react';
import { User } from '@asap-hub/auth';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import {
  createDiscoverResponse,
  createTutorialsResponse,
} from '@asap-hub/fixtures';
import { discover } from '@asap-hub/routing';

import Tutorials from '../TutorialList';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { refreshDiscoverState } from '../../state';
import { getDiscover } from '../../api';

jest.mock('../../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetDiscover = getDiscover as jest.MockedFunction<typeof getDiscover>;

const renderDiscoverTutorials = async (user: Partial<User>) => {
  const result = render(
    <Suspense fallback="loading">
      <RecoilRoot
        initializeState={({ set }) => {
          set(refreshDiscoverState, Math.random());
        }}
      >
        <Auth0Provider user={user}>
          <WhenReady>
            <MemoryRouter initialEntries={[{ pathname: discover({}).$ }]}>
              <Route path={discover.template}>
                <Tutorials />
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
  mockGetDiscover.mockResolvedValue({
    ...createDiscoverResponse(),
    training: [
      createTutorialsResponse({ key: 'First One' }),
      createTutorialsResponse({ key: 'Second One' }),
    ],
  });

  await renderDiscoverTutorials({});
  expect(
    screen
      .getAllByRole('heading', { level: 4 })
      .map(({ textContent }) => textContent),
  ).toEqual(['First One title', 'Second One title']);
});

it('renders the correct title and subtitle', async () => {
  await renderDiscoverTutorials({});

  expect(screen.getByText(/Tutorials/i, { selector: 'h2' })).toBeVisible();
  expect(screen.getByText(/Explore our tutorials/i)).toBeVisible();
});
