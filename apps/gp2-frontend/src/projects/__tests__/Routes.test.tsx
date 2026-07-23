import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { gp2 } from '@asap-hub/fixtures';
import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import {
  createProjectAlgoliaRecord,
  createProjectListAlgoliaResponse,
} from '../../__fixtures__/algolia';
import { getProjects } from '../api';
import ProjectRoutes from '../Routes';

mockConsoleError();

const renderRoutes = async () => {
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/projects']}>
              <Routes>
                <Route path="/projects/*" element={<ProjectRoutes />} />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </QueryClientProvider>,
  );
  return waitFor(
    () => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    { timeout: 30_000 },
  );
};
beforeEach(() => {
  jest.resetAllMocks();
});

jest.mock('../api');
const mockGetProjects = getProjects as jest.MockedFunction<typeof getProjects>;
describe('Routes', () => {
  it('renders a list of projects', async () => {
    const firstGroup = gp2.createProjectResponse({
      id: '42',
      title: 'Project 42',
    });
    const secondGroup = gp2.createProjectResponse({
      id: '11',
      title: 'Project 11',
    });
    mockGetProjects.mockResolvedValue(
      createProjectListAlgoliaResponse(2, {
        hits: [
          createProjectAlgoliaRecord(gp2.createProjectResponse(firstGroup)),
          createProjectAlgoliaRecord(gp2.createProjectResponse(secondGroup)),
        ],
      }),
    );
    await renderRoutes();
    expect(
      screen.getByRole('heading', { name: 'Project 42' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Project 11' }),
    ).toBeInTheDocument();
  }, 30_000);

  it('renders error message when the request is not a 2XX', async () => {
    mockGetProjects.mockRejectedValue(new Error('error'));

    await renderRoutes();
    expect(mockGetProjects).toHaveBeenCalled();
    expect(await screen.findByText(/Something went wrong/i)).toBeVisible();
  });
  it('can perform a search', async () => {
    mockGetProjects.mockResolvedValue(createProjectListAlgoliaResponse(1));
    await renderRoutes();
    await userEvent.type(screen.getByPlaceholderText(/Enter name/i), 'example');
    await waitFor(() =>
      expect(mockGetProjects).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({ searchQuery: 'example' }),
      ),
    );
  });
});
