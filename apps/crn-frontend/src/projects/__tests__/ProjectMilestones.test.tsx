import { projects } from '@asap-hub/routing';
import { render, waitFor, screen, act } from '@testing-library/react';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import {
  createListProjectMilestoneResponse,
  createProjectMilestoneResponse,
} from '@asap-hub/fixtures';
import { ListProjectMilestonesResponse } from '@asap-hub/model';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route, Routes } from 'react-router';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import ProjectMilestones from '../ProjectMilestones';
import {
  getProjectMilestones,
  getMilestoneArticles,
  MilestonesListOptions,
} from '../api';
import {
  projectMilestonesIndexState,
  projectMilestonesListItemState,
  projectMilestonesState,
} from '../state';

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});
mockConsoleError();

const mockGetProjectMilestones = getProjectMilestones as jest.MockedFunction<
  typeof getProjectMilestones
>;

const mockGetMilestoneArticles = getMilestoneArticles as jest.MockedFunction<
  typeof getMilestoneArticles
>;

beforeEach(() => {
  mockGetProjectMilestones.mockResolvedValue(
    createListProjectMilestoneResponse(),
  );
  mockGetMilestoneArticles.mockResolvedValue([]);
});

const projectId = 'proj-1';
const renderPage = async (queryString = '', waitForLoad = true) => {
  const basePath = projects({})
    .discoveryProjects({})
    .discoveryProject({ projectId })
    .milestones({}).$;

  const path = queryString ? `${basePath}?${queryString}` : basePath;
  const options: MilestonesListOptions = {
    searchQuery: '',
    currentPage: 0,
    filters: new Set(),
    pageSize: 10,
    grantType: 'supplement',
    projectId,
  };

  const result = render(
    <RecoilRoot
      initializeState={({ reset, set }) => {
        set(projectMilestonesIndexState(options), {
          ids: ['1'],
          total: 1,
        });
        set(
          projectMilestonesListItemState('1'),
          createProjectMilestoneResponse({ key: '1' }),
        );

        reset(projectMilestonesState(options));
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[path]}>
              <Routes>
                <Route
                  path="/projects/discovery/proj-1/milestones?"
                  element={
                    <ProjectMilestones
                      projectId={projectId}
                      isLead={true}
                      hasSupplementGrant={true}
                      loadArticleOptions={jest.fn(() => Promise.resolve([]))}
                    />
                  }
                />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  if (waitForLoad) {
    await waitFor(() =>
      expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
  }

  return result;
};

describe('ProjectMilestones', () => {
  it('renders project milestones page', async () => {
    await renderPage();

    expect(screen.getByRole('heading', { name: 'Milestones' })).toBeVisible();
    expect(screen.getByRole('searchbox')).toBeVisible();
    expect(screen.getByRole('button', { name: /filter/i })).toBeVisible();
  });

  it('keeps the search controls visible while milestones are loading', async () => {
    mockGetProjectMilestones.mockImplementation(
      () =>
        new Promise<ListProjectMilestonesResponse>((resolve) => {
          void resolve;
        }),
    );

    await renderPage('searchQuery=alpha', false);

    expect(
      await screen.findByRole('heading', { name: 'Milestones' }),
    ).toBeVisible();
    expect(screen.getByRole('searchbox')).toBeVisible();
    expect(screen.getByRole('button', { name: /filter/i })).toBeVisible();
  });

  it('fetches milestones depending on the grant type selected', async () => {
    await renderPage();

    const grantTypeDropdown = screen.getByRole('combobox');
    await userEvent.click(grantTypeDropdown);

    await act(async () => {
      await userEvent.click(screen.getByText('Original'));
    });

    await waitFor(() => {
      expect(mockGetProjectMilestones).toHaveBeenCalledWith(
        expect.objectContaining({
          grantType: 'original',
        }),
        expect.anything(),
      );
    });

    await userEvent.click(grantTypeDropdown);

    await act(async () => {
      await userEvent.click(screen.getByText('Supplement'));
    });

    await waitFor(() => {
      expect(mockGetProjectMilestones).toHaveBeenCalledWith(
        expect.objectContaining({
          grantType: 'supplement',
        }),
        expect.anything(),
      );
    });
  });

  it('passes search query and status filters to the milestones fetch', async () => {
    await renderPage('grantType=original&searchQuery=alpha&filter=Complete');

    await waitFor(() => {
      expect(mockGetProjectMilestones).toHaveBeenCalledWith(
        expect.objectContaining({
          grantType: 'original',
          searchQuery: 'alpha',
        }),
        expect.anything(),
      );
    });

    expect(mockGetProjectMilestones.mock.calls[0]?.[0]?.filters).toEqual(
      new Set(['Complete']),
    );
  });

  it('fetches articles for a milestone when expanded', async () => {
    const projectMilestone = createProjectMilestoneResponse({
      articleCount: 1,
      key: 1,
      status: 'In Progress',
    });
    const milestones: ListProjectMilestonesResponse = {
      total: 1,
      items: [projectMilestone],
    };

    mockGetProjectMilestones.mockResolvedValue(milestones);
    mockGetMilestoneArticles.mockResolvedValue([
      { id: 'a1', title: 'Article 1', href: '/a1', type: 'Preprint' },
    ]);

    await renderPage();

    expect(await screen.findByText('Articles (1)')).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: /expand articles/i }),
    );

    expect(screen.getByText('Article 1')).toBeInTheDocument();
  });

  it('throws error when fetching project milestones fails', async () => {
    const error = new Error('API Error');
    mockGetProjectMilestones.mockRejectedValue(error);

    const { getByText } = await renderPage();
    await waitFor(() => expect(mockGetProjectMilestones).toHaveBeenCalled());
    await waitFor(() =>
      expect(getByText(/Something went wrong/i)).toBeVisible(),
    );
  });
});
