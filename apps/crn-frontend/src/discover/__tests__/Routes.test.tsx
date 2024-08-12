import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
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
import {
  createListGuidesResponse,
  createListTutorialsResponse,
} from '@asap-hub/fixtures';
import { TutorialsResponse } from '@asap-hub/model';
import { discoverRoutes } from '@asap-hub/routing';
import userEvent from '@testing-library/user-event';

import DiscoverRoutes from '../Routes';

import { getTutorials, getTutorialById } from '../tutorials/api';
import { getGuides } from '../../guides/api';

jest.mock('../../guides/api');
jest.mock('../tutorials/api');

const mockGetTutorials = getTutorials as jest.MockedFunction<
  typeof getTutorials
>;

const mockGetTutorialById = getTutorialById as jest.MockedFunction<
  typeof getTutorialById
>;

const mockGetGuides = getGuides as jest.MockedFunction<typeof getGuides>;

const renderDiscoverPage = async (pathname: string, query = '') => {
  const { container } = render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[{ pathname, search: query }]}>
              <Routes>
                <Route
                  path={discoverRoutes.DEFAULT.path}
                  element={<DiscoverRoutes />}
                />
              </Routes>
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
  await renderDiscoverPage(discoverRoutes.DEFAULT.buildPath({}));
  expect(
    await screen.findByText(/Guides/i, {
      selector: 'h2',
    }),
  ).toBeVisible();
});

it('renders tutorials list page when the tutorials tab is selected', async () => {
  mockGetTutorials.mockResolvedValue(createListTutorialsResponse(1));
  mockGetGuides.mockResolvedValue(createListGuidesResponse(1));
  await renderDiscoverPage(discoverRoutes.DEFAULT.GUIDES.buildPath({}));
  await waitFor(() => {
    expect(screen.getByText(/Tutorials/i, { selector: 'p' })).toBeVisible();
  });

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

  await renderDiscoverPage(discoverRoutes.DEFAULT.TUTORIALS.buildPath({}));

  userEvent.type(screen.getByRole('searchbox'), 'Tutorial 1');

  await waitFor(() =>
    expect(mockGetTutorials).toHaveBeenCalledWith(
      expect.objectContaining({
        searchQuery: 'Tutorial 1',
      }),
      expect.anything(),
    ),
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

  await renderDiscoverPage(discoverRoutes.DEFAULT.TUTORIALS.buildPath({}));
  await waitFor(() => {
    expect(
      screen.getByText(/First Tutorial Title/i, {
        selector: 'a',
      }),
    ).toBeVisible();
  });

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
