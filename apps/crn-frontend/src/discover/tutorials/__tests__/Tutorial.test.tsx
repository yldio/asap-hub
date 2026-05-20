import { TutorialsResponse } from '@asap-hub/model';
import { discover } from '@asap-hub/routing';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getTutorialById } from '../api';
import Tutorial from '../Tutorial';

jest.mock('../api');

const tutorial: TutorialsResponse = {
  id: '1',
  created: '2020-09-07T17:36:54Z',
  title: 'Tutorial Title',
  authors: [],
  tags: [],
  teams: [],
  relatedEvents: [],
  relatedTutorials: [],
};

const mockGetTutorialById = getTutorialById as jest.MockedFunction<
  typeof getTutorialById
>;

const renderPage = async () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  });
  const result = render(
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <Suspense fallback="loading">
          <Auth0Provider user={{}}>
            <WhenReady>
              <MemoryRouter
                initialEntries={[
                  discover({}).tutorials({}).tutorial({
                    tutorialId: tutorial.id,
                  }).$,
                ]}
              >
                <Routes>
                  <Route
                    path={
                      discover.template +
                      discover({}).tutorials.template +
                      discover({}).tutorials({}).tutorial.template
                    }
                    element={<Tutorial />}
                  />
                </Routes>
              </MemoryRouter>
            </WhenReady>
          </Auth0Provider>
        </Suspense>
      </RecoilRoot>
    </QueryClientProvider>,
  );

  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

beforeEach(() => {
  mockGetTutorialById.mockClear();
});

it('renders not found when the tutorial hook doesnt return a tutorial', async () => {
  mockGetTutorialById.mockResolvedValue(undefined);

  const { getByRole } = await renderPage();
  expect(getByRole('heading').textContent).toContain(
    'Sorry! We can’t seem to find that page.',
  );
});

it('renders a tutorial when the tutorial hook returns a tutorial', async () => {
  mockGetTutorialById.mockResolvedValue(tutorial);

  const { getByRole } = await renderPage();
  expect(getByRole('heading').textContent).toContain('Tutorial Title');
});
