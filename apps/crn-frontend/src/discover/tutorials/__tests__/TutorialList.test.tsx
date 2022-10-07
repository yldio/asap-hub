import { Suspense } from 'react';
import { User } from '@asap-hub/auth';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecoilRoot } from 'recoil';
import {
  createDiscoverResponse,
  createNewsResponse,
  createTutorialsResponse,
} from '@asap-hub/fixtures';
import { discover } from '@asap-hub/routing';
import { TutorialsResponse } from '@asap-hub/model';

import Tutorials from '../TutorialList';
import Tutorial from '../Tutorial';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { refreshDiscoverState } from '../../state';
import { getDiscover } from '../../api';
import { getTutorialById } from '../api';

jest.mock('../api');
jest.mock('../tutorials/api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetDiscover = getDiscover as jest.MockedFunction<typeof getDiscover>;

const mockGetTutorialById = getTutorialById as jest.MockedFunction<
  typeof getTutorialById
>;

const tutorial: TutorialsResponse = {
  id: '55724942-3408-4ad6-9a73-14b92226ffb6',
  created: '2020-09-07T17:36:54Z',
  title: 'First One title',
};

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
              <Route
                path={
                  discover.template +
                  discover({}).tutorials.template +
                  discover({}).tutorials({}).tutorial.template
                }
              >
                <Tutorial />
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
      createNewsResponse({ key: 'First One', type: 'Tutorial' }),
      createNewsResponse({ key: 'Second One', type: 'Tutorial' }),
    ],
  });

  await renderDiscoverTutorials({});
  expect(
    screen
      .getAllByRole('heading', { level: 4 })
      .map(({ textContent }) => textContent),
  ).toEqual(['Tutorial First One title', 'Tutorial Second One title']);
});

it('renders the correct title and subtitle', async () => {
  await renderDiscoverTutorials({});

  expect(screen.getByText(/Tutorials/i, { selector: 'h2' })).toBeVisible();
  expect(screen.getByText(/Explore our tutorials/i)).toBeVisible();
});

it('renders tutorial page when user clicks tutorial card title', async () => {
  mockGetDiscover.mockResolvedValue({
    ...createDiscoverResponse(),
    training: [createTutorialsResponse({ key: 'First One' })],
  });

  mockGetTutorialById.mockResolvedValue(tutorial);

  await renderDiscoverTutorials({});

  const tutorialAnchorTitle = screen.getByText(/First One title/i, {
    selector: 'a',
  }) as HTMLAnchorElement;

  expect(tutorialAnchorTitle).toBeVisible();
  expect(tutorialAnchorTitle.href).toContain('/tutorials/');

  userEvent.click(tutorialAnchorTitle);
  await waitFor(() =>
    expect(mockGetTutorialById).toHaveBeenCalledWith(
      'uuid-First One',
      'Bearer access_token',
    ),
  );

  expect(
    await screen.findByText(/First One title/i, { selector: 'h1' }),
  ).toBeVisible();
});
