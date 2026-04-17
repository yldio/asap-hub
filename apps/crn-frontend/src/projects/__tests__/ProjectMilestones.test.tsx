import { projects } from '@asap-hub/routing';
import { render, waitFor, screen, act, within } from '@testing-library/react';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import {
  createListProjectMilestoneResponse,
  createProjectMilestoneResponse,
  createProjectAim,
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
  createProjectMilestone,
  putMilestoneArticles,
} from '../api';
import {
  projectMilestonesIndexState,
  projectMilestonesListItemState,
  projectMilestonesState,
  RefreshMilestonesListOptions,
} from '../state';
import { ManuscriptToastProvider } from '../../network/teams/ManuscriptToastProvider';

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

const mockCreateProjectMilestone =
  createProjectMilestone as jest.MockedFunction<typeof createProjectMilestone>;

const mockPutMilestoneArticles = putMilestoneArticles as jest.MockedFunction<
  typeof putMilestoneArticles
>;

const mockLoadArticleOptions = jest.fn(() =>
  Promise.resolve([
    {
      label: 'Project Article 1',
      value: 'article-1',
      documentType: 'Article',
      type: 'Preprint',
    },
  ]),
);

beforeEach(() => {
  mockGetProjectMilestones.mockResolvedValue(
    createListProjectMilestoneResponse(),
  );
  mockGetMilestoneArticles.mockResolvedValue([]);
  mockCreateProjectMilestone.mockResolvedValue({ id: 'milestone-1' });
  mockPutMilestoneArticles.mockResolvedValue(undefined);
});

const projectId = 'proj-1';
const renderPage = async (queryString = '', waitForLoad = true) => {
  const basePath = projects({})
    .discoveryProjects({})
    .discoveryProject({ projectId })
    .milestones({}).$;

  const path = queryString ? `${basePath}?${queryString}` : basePath;
  const options: RefreshMilestonesListOptions = {
    searchQuery: '',
    currentPage: 0,
    filters: new Set(),
    pageSize: 10,
    grantType: 'supplement',
    projectId,
    refreshToken: 1,
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
              <ManuscriptToastProvider>
                <Routes>
                  <Route
                    path="/projects/discovery/proj-1/milestones?"
                    element={
                      <ProjectMilestones
                        projectId={projectId}
                        isLead={true}
                        hasSupplementGrant={true}
                        aims={[
                          createProjectAim({ key: 1, order: 1 }),
                          createProjectAim({ key: 2, order: 2 }),
                        ]}
                        loadArticleOptions={mockLoadArticleOptions}
                      />
                    }
                  />
                </Routes>
              </ManuscriptToastProvider>
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
        new Promise((resolve) => {
          setTimeout(() => resolve({ total: 0, items: [] }), 10);
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

  it('displays Add New Milestone button if on supplement grant milestones page and user is lead', async () => {
    await renderPage();

    expect(
      await screen.findByRole('button', {
        name: /Add New Milestone/i,
      }),
    ).toBeInTheDocument();
  });

  it('can create a milestone when the data is valid', async () => {
    jest.useFakeTimers();

    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });
    await renderPage();

    const addNewMilestoneButton = await screen.findByRole('button', {
      name: /Add New Milestone/i,
    });

    await user.click(addNewMilestoneButton);

    await user.type(
      screen.getByRole('textbox', { name: /Description/i }),
      'Some description',
    );

    await user.click(screen.getByRole('button', { name: '#1' }));

    const relatedArticlesLabel = screen
      .getByText('Related Articles')
      .closest('div')!;

    const articlesInput = within(relatedArticlesLabel!).getByRole('combobox');
    await user.click(articlesInput);

    const option = await screen.findByText(/Project Article 1/i);
    await user.click(option);

    const submitButton = await screen.findByRole('button', {
      name: 'Confirm',
    });
    await user.click(submitButton);

    const confirmButton = await screen.findByRole('button', {
      name: /confirm and notify/i,
    });
    await user.click(confirmButton);

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    await act(async () => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(mockCreateProjectMilestone).toHaveBeenCalledWith(
        projectId,
        {
          description: 'Some description',
          status: 'Pending',
          grantType: 'supplement',
          relatedArticleIds: ['article-1'],
          aimIds: ['uuid-1'],
        },
        'Bearer access_token',
      );
    });

    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /confirm and notify/i }),
      ).not.toBeInTheDocument();
    });
    expect(
      screen.getByText(/Milestone added successfully./i),
    ).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('displays error toast when there is an error creating a manuscript', async () => {
    mockCreateProjectMilestone.mockRejectedValueOnce(new Error('error'));
    await renderPage();

    const addNewMilestoneButton = await screen.findByRole('button', {
      name: /Add New Milestone/i,
    });

    await userEvent.click(addNewMilestoneButton);

    await userEvent.type(
      screen.getByRole('textbox', { name: /Description/i }),
      'Some description',
    );

    await userEvent.click(screen.getByRole('button', { name: '#1' }));

    const relatedArticlesLabel = screen
      .getByText('Related Articles')
      .closest('div')!;

    const articlesInput = within(relatedArticlesLabel!).getByRole('combobox');
    await userEvent.click(articlesInput);

    const option = await screen.findByText(/Project Article 1/i);
    await userEvent.click(option);

    const submitButton = await screen.findByRole('button', {
      name: 'Confirm',
    });
    await userEvent.click(submitButton);

    const confirmButton = await screen.findByRole('button', {
      name: /confirm and notify/i,
    });
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(
        screen.getByText('An error has occurred. Please try again later.'),
      ).toBeInTheDocument();
    });
  });

  it('displays error toast when saving articles fails', async () => {
    mockPutMilestoneArticles.mockRejectedValueOnce(new Error('save failed'));

    await renderPage();

    const [editButton] = await screen.findAllByRole('button', { name: /edit/i });
    await userEvent.click(editButton!);

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(
        screen.getByText('An error has occurred. Please try again later.'),
      ).toBeInTheDocument();
    });
  });
});
