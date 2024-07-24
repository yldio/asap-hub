import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  waitFor,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { createListTutorialsResponse } from '@asap-hub/fixtures';
import { TutorialsResponse } from '@asap-hub/model';
import { discoverRoutes } from '@asap-hub/routing';
import userEvent from '@testing-library/user-event';

import Routes from '../Routes';

import { getTutorials, getTutorialById } from '../tutorials/api';

jest.mock('../../guides/api');
jest.mock('../tutorials/api');

const mockGetTutorials = getTutorials as jest.MockedFunction<
  typeof getTutorials
>;

const mockGetTutorialById = getTutorialById as jest.MockedFunction<
  typeof getTutorialById
>;

const renderDiscoverPage = async (pathname: string, query = '') => {
  const { container } = render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[{ pathname, search: query }]}>
              <Route path={discoverRoutes.DEFAULT.path}>
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

  return container;
};

it('redirects to the guides page when the index page accessed', async () => {
  await renderDiscoverPage(discoverRoutes.DEFAULT.path);
  expect(
    await screen.findByText(/Guides/i, {
      selector: 'h2',
    }),
  ).toBeVisible();
});

it('renders tutorials list page when the tutorials tab is selected', async () => {
  await renderDiscoverPage(discoverRoutes.DEFAULT.path);

  mockGetTutorials.mockResolvedValue(createListTutorialsResponse(1));

  const tutorialsAnchorTab = screen.getByText(/Tutorials/i, { selector: 'p' });

  expect(tutorialsAnchorTab).toBeVisible();
  expect(screen.queryByText(/Explore our tutorials/i)).not.toBeInTheDocument();

  userEvent.click(tutorialsAnchorTab);
  await waitFor(() =>
    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument(),
  );

  expect(
    await screen.findByText(/Explore our tutorials/i, { selector: 'p' }),
  ).toBeVisible();
});

it('allows search on tutorials list', async () => {
  const tutorialsResponse = createListTutorialsResponse(1);
  mockGetTutorials.mockResolvedValue({
    ...tutorialsResponse,
    items: tutorialsResponse.items.map((tutorial) => ({
      ...tutorial,
      title: 'Tutorial 1',
    })),
  });

  const container = await renderDiscoverPage(
    discoverRoutes.DEFAULT.TUTORIALS.path,
  );

  userEvent.type(screen.getByRole('searchbox'), 'Tutorial 1');

  await waitFor(() =>
    expect(mockGetTutorials).toHaveBeenCalledWith(
      expect.objectContaining({
        searchQuery: 'Tutorial 1',
      }),
      expect.anything(),
    ),
  );
  await waitForElementToBeRemoved(
    container.querySelectorAll('div[class*="animation"]')[0],
  );

  expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
    /Tutorial 1/i,
  );
});

it('renders tutorial page when user clicks tutorial card title', async () => {
  const tutorialsResponse = createListTutorialsResponse(1);
  const tutorial: TutorialsResponse = {
    id: 'uuid-first-tutorial',
    created: '2020-09-07T17:36:54Z',
    title: 'First Tutorial Title',
    authors: [],
    tags: [],
    teams: [],
    relatedEvents: [],
    relatedTutorials: [],
  };

  mockGetTutorials.mockResolvedValue({
    ...tutorialsResponse,
    items: tutorialsResponse.items.map((tutorialItem) => ({
      ...tutorialItem,
      id: 'uuid-first-tutorial',
      title: 'First Tutorial Title',
    })),
  });
  mockGetTutorialById.mockResolvedValue(tutorial);

  await renderDiscoverPage(discoverRoutes.DEFAULT.TUTORIALS.path);

  const tutorialCardTitle = screen.getByText(/First Tutorial Title/i, {
    selector: 'a',
  }) as HTMLAnchorElement;

  expect(tutorialCardTitle).toBeVisible();
  expect(tutorialCardTitle.href).toContain('/tutorials/');

  userEvent.click(tutorialCardTitle);

  expect(
    await screen.findByText(/First Tutorial Title/i, { selector: 'h1' }),
  ).toBeVisible();
});
