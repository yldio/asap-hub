import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import {
  createDiscoverResponse,
  createTutorialsResponse,
} from '@asap-hub/fixtures';
import { TutorialsResponse } from '@asap-hub/model';
import { discover } from '@asap-hub/routing';
import userEvent from '@testing-library/user-event';

import Routes from '../Routes';

import { getDiscover } from '../api';
import { getTutorialById } from '../tutorials/api';

jest.mock('../api');
jest.mock('../tutorials/api');

const mockGetDiscover = getDiscover as jest.MockedFunction<typeof getDiscover>;

const mockGetTutorialById = getTutorialById as jest.MockedFunction<
  typeof getTutorialById
>;

const renderDiscoverPage = async (pathname: string, query = '') => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[{ pathname, search: query }]}>
              <Route path={discover.template}>
                <Routes />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
};
it('redirects to the guides page when the index page accessed', async () => {
  await renderDiscoverPage(discover({}).$);
  expect(
    await screen.findByText(/Guides/i, {
      selector: 'h2',
    }),
  ).toBeVisible();
});

it('renders tutorial page when user clicks tutorial card title', async () => {
  await renderDiscoverPage(discover({}).$);

  const tutorial: TutorialsResponse = {
    id: '55724942-3408-4ad6-9a73-14b92226ffb6',
    created: '2020-09-07T17:36:54Z',
    title: 'First One title',
  };

  mockGetDiscover.mockResolvedValue({
    ...createDiscoverResponse(),
    training: [createTutorialsResponse({ key: 'First One' })],
  });

  mockGetTutorialById.mockResolvedValue(tutorial);

  const tutorialsAnchorTab = screen.getByText(/Tutorials/i);
  expect(tutorialsAnchorTab).toBeVisible();

  userEvent.click(tutorialsAnchorTab);

  await waitFor(() =>
    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument(),
  );

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
