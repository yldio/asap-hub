import { projects } from '@asap-hub/routing';
import { render, waitFor, screen, act } from '@testing-library/react';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { createListProjectMilestoneResponse } from '@asap-hub/fixtures';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route, Routes } from 'react-router';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import ProjectMilestones from '../ProjectMilestones';
import { getProjectMilestones, getMilestoneArticles } from '../api';

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
const renderPage = async (grantType?: string) => {
  const basePath = projects({})
    .discoveryProjects({})
    .discoveryProject({ projectId })
    .milestones({}).$;

  const path = grantType ? `${basePath}?grantType=${grantType}` : basePath;

  const result = render(
    <RecoilRoot>
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

  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );

  return result;
};

describe('ProjectMilestones', () => {
  it('renders project milestones page', async () => {
    await renderPage();

    expect(screen.getByRole('heading', { name: 'Milestones' })).toBeVisible();
  });

  //   it('uses team_asc as the default sort when no sort query param is set', async () => {
  //     await renderPage('sharing-prelim-findings', undefined);

  //     await waitFor(() => {
  //       expect(mockGetPreliminaryDataSharing).toHaveBeenCalled();
  //     });

  //     const [, options] = mockGetPreliminaryDataSharing.mock.calls[0]!;
  //     expect(options.sort).toBe('team_asc');
  //   });

  //   it('uses the sort value from the URL query param when provided', async () => {
  //     await renderPage(
  //       'sharing-prelim-findings',
  //       undefined,
  //       'sort=percent_shared_desc',
  //     );

  //     await waitFor(() => {
  //       expect(mockGetPreliminaryDataSharing).toHaveBeenCalled();
  //     });

  //     const [, options] = mockGetPreliminaryDataSharing.mock.calls[0]!;
  //     expect(options.sort).toBe('percent_shared_desc');
  //   });

  //   it('falls back to team_asc when the URL sort value is invalid', async () => {
  //     await renderPage(
  //       'sharing-prelim-findings',
  //       undefined,
  //       'sort=invalid_sort_value',
  //     );

  //     await waitFor(() => {
  //       expect(mockGetPreliminaryDataSharing).toHaveBeenCalled();
  //     });

  //     const [, options] = mockGetPreliminaryDataSharing.mock.calls[0]!;
  //     expect(options.sort).toBe('team_asc');
  //   });

  //   it('resets pagination to the first page when changing sort', async () => {
  //     await renderPage(
  //       'sharing-prelim-findings',
  //       undefined,
  //       'currentPage=2&sort=team_asc',
  //     );

  //     // Wait for BOTH the initial load (page 2) AND the usePagination
  //     // auto-correction (page 0) to settle before clearing
  //     await waitFor(() => {
  //       const { calls } = mockGetPreliminaryDataSharing.mock;
  //       expect(calls.some(([, opts]) => opts.currentPage === 0)).toBe(true);
  //     });

  //     mockGetPreliminaryDataSharing.mockClear();

  //     await screen.findByText('Percent Shared');

  //     const button = await screen.findByRole('button', {
  //       name: /sort by percent shared/i,
  //     });
  //     await userEvent.click(button);

  //     await waitFor(() => {
  //       expect(mockGetPreliminaryDataSharing).toHaveBeenCalledWith(
  //         expect.anything(),
  //         expect.objectContaining({
  //           currentPage: 0,
  //           sort: 'percent_shared_desc',
  //         }),
  //       );
  //     });

  //     const call = mockGetPreliminaryDataSharing.mock.calls.find(
  //       ([, opts]) => opts.sort === 'percent_shared_desc',
  //     )!;
  //     const [, options] = call;
  //     expect(options.sort).toBe('percent_shared_desc');
  //     expect(options.currentPage).toBe(0);
  //   });

  //   it('updates the sort param in the URL when a sort button is clicked', async () => {
  //     await renderPage('sharing-prelim-findings', undefined, 'sort=team_asc');

  //     await waitFor(() => {
  //       expect(mockGetPreliminaryDataSharing).toHaveBeenCalled();
  //     });

  //     mockGetPreliminaryDataSharing.mockClear();

  //     const button = await screen.findByRole('button', {
  //       name: /sort by percent shared/i,
  //     });
  //     await userEvent.click(button);

  //     await waitFor(() => {
  //       expect(mockGetPreliminaryDataSharing).toHaveBeenCalled();
  //     });

  //     const [, options] = mockGetPreliminaryDataSharing.mock.calls[0]!;
  //     expect(options.sort).toBe('percent_shared_desc');
  //   });

  it('fetches milestones depending on the grant type selected', async () => {
    await renderPage();

    // await waitFor(() => {
    //   expect(mockGetPreliminaryDataSharing).toHaveBeenCalled();
    // });

    // mockGetPreliminaryDataSharing.mockClear();

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

    // const [, options] = mockGetPreliminaryDataSharing.mock.calls[0]!;
    // expect(options.sort).toBe('percent_shared_asc');
  });

  //   it('sets default time range to last 12 months', async () => {
  //     await renderPage('sharing-prelim-findings', undefined);

  //     expect(
  //       screen.getByRole('heading', { name: /Sharing Preliminary Findings/i }),
  //     ).toBeVisible();

  //     expect(
  //       screen.queryByRole('button', {
  //         name: /Since Hub Launch \(2020\)/i,
  //       }),
  //     ).not.toBeInTheDocument();

  //     expect(
  //       screen.getByRole('button', { name: /Last 12 months/i }),
  //     ).toBeVisible();
  //   });

  //   it('can navigate to sharing preliminary findings page', async () => {
  //     await renderPage('user', 'within-team');
  //     const input = screen.getAllByRole('combobox', { hidden: false });

  //     await userEvent.click(input[0]!);
  //     await userEvent.click(screen.getByText('Sharing Preliminary Findings'));

  //     await waitFor(() =>
  //       expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  //     );
  //     expect(
  //       screen.getByRole('heading', { name: /Sharing Preliminary Findings/i }),
  //     ).toBeVisible();
  //     expect(screen.queryByText('User Co-Production')).not.toBeInTheDocument();
  //     expect(screen.queryByText('Type')).not.toBeInTheDocument();
  //   });

  //   it('exports sharing preliminary findings with the current sort applied', async () => {
  //     await renderPage(
  //       'sharing-prelim-findings',
  //       undefined,
  //       'sort=percent_shared_desc',
  //     );
  //     mockGetPreliminaryDataSharing.mockClear();
  //     await userEvent.click(screen.getByText(/csv/i));
  //     await waitFor(() => {
  //       expect(mockGetPreliminaryDataSharing).toHaveBeenCalled();
  //     });
  //     const [, options] = mockGetPreliminaryDataSharing.mock.calls[0]!;
  //     expect(options.sort).toBe('percent_shared_desc');
  //   });

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
