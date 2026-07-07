import { listViewValue, projects, viewParam } from '@asap-hub/routing';
import { render, waitFor, screen } from '@testing-library/react';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { createCsvFileStream, Frame } from '@asap-hub/frontend-utils';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route, Routes } from 'react-router';
import userEvent from '@testing-library/user-event';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { CARD_VIEW_PAGE_SIZE, LIST_VIEW_PAGE_SIZE } from '../../hooks';
import {
  getDraftResearchOutputs,
  getResearchOutputs,
} from '../../shared-research/api';
import ProjectOutputs from '../ProjectOutputs';
import { researchOutputsState } from '../../shared-research/state';
import { createResearchOutputListAlgoliaResponse } from '../../__fixtures__/algolia';
import { MAX_ALGOLIA_RESULTS } from '../../shared-research/export';

jest.mock('@asap-hub/frontend-utils', () => {
  const original = jest.requireActual('@asap-hub/frontend-utils');
  return {
    ...original,
    createCsvFileStream: jest
      .fn()
      .mockImplementation(() => ({ write: jest.fn(), end: jest.fn() })),
  };
});
jest.mock('../../shared-research/api');

afterEach(() => {
  jest.clearAllMocks();
});
mockConsoleError();

const mockGetDraftResearchOutputs =
  getDraftResearchOutputs as jest.MockedFunction<
    typeof getDraftResearchOutputs
  >;

const mockGetResearchOutputs = getResearchOutputs as jest.MockedFunction<
  typeof getResearchOutputs
>;
const mockCreateCsvFileStream = createCsvFileStream as jest.MockedFunction<
  typeof createCsvFileStream
>;

const projectId = 'proj-1';
const projectTitle = 'Test One';
const teamId = 'team-1';

const buildOutput = (i: number) => ({
  ...createResearchOutputResponse(i),
  id: `o${i}`,
  title: `Output ${i}`,
  published: true,
  project: {
    id: projectId,
    title: 'Project Alpha',
    projectType: 'Discovery Project' as const,
  },
});

beforeEach(() => {
  mockGetDraftResearchOutputs.mockResolvedValue({ total: 0, items: [] });
  mockGetResearchOutputs.mockResolvedValue(
    createResearchOutputListAlgoliaResponse(0),
  );
});

type RenderOptions = {
  draftOutputs?: boolean;
  queryString?: string;
  waitForLoad?: boolean;
  projectTeamId?: string;
  draftResearchOutputsError?: Error;
  userAssociationMember?: boolean;
  hasOutputs?: boolean;
};

const renderPage = async ({
  draftOutputs = false,
  queryString = '',
  waitForLoad = true,
  projectTeamId,
  draftResearchOutputsError,
  userAssociationMember = true,
  hasOutputs = true,
}: RenderOptions = {}) => {
  const basePath = draftOutputs
    ? projects({})
        .discoveryProjects({})
        .discoveryProject({ projectId })
        .draftOutputs({}).$
    : projects({})
        .discoveryProjects({})
        .discoveryProject({ projectId })
        .outputs({}).$;

  const path = queryString ? `${basePath}?${queryString}` : basePath;
  const searchParams = new URLSearchParams(queryString);
  const currentPage = Number(searchParams.get('currentPage')) ?? 0;
  const isListView = searchParams.get(viewParam) === listViewValue;
  const pageSize = isListView ? LIST_VIEW_PAGE_SIZE : CARD_VIEW_PAGE_SIZE;
  const listScope = projectTeamId ? { teamId: projectTeamId } : { projectId };

  const publishedOptions = {
    searchQuery: '',
    documentType: [],
    currentPage,
    pageSize,
    ...listScope,
  };

  const draftOptions = {
    ...publishedOptions,
    draftsOnly: true as const,
    userAssociationMember,
  };

  const result = render(
    <RecoilRoot
      initializeState={({ reset, set }) => {
        if (draftResearchOutputsError) {
          set(researchOutputsState(draftOptions), draftResearchOutputsError);
        } else {
          reset(researchOutputsState(publishedOptions));
          reset(researchOutputsState(draftOptions));
        }
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider
          user={{
            projects: [
              {
                id: projectId,
                title: 'Project Alpha',
                projectType: 'Discovery Project',
                status: 'Active',
              },
            ],
          }}
        >
          <WhenReady>
            <MemoryRouter initialEntries={[path]}>
              <Routes>
                <Route
                  path="/projects/discovery/:projectId/outputs?"
                  element={
                    <Frame title="Project Outputs">
                      <ProjectOutputs
                        projectId={projectId}
                        projectTitle={projectTitle}
                        teamId={projectTeamId}
                        userAssociationMember={userAssociationMember}
                        hasOutputs={hasOutputs}
                      />
                    </Frame>
                  }
                />
                <Route
                  path="/projects/discovery/:projectId/draft-outputs?"
                  element={
                    <Frame title="Project Draft Outputs">
                      <ProjectOutputs
                        projectId={projectId}
                        projectTitle={projectTitle}
                        teamId={projectTeamId}
                        draftOutputs
                        userAssociationMember={userAssociationMember}
                        hasOutputs={hasOutputs}
                      />
                    </Frame>
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

describe('ProjectOutputs', () => {
  it('renders NoOutputsPage when there are no published outputs', async () => {
    await renderPage({ hasOutputs: false });

    expect(screen.getByText('No outputs available.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'When this project shares an output, it will be listed here.',
      ),
    ).toBeInTheDocument();
  });

  it('renders NoOutputsPage with draft copy when there are no drafts', async () => {
    await renderPage({ draftOutputs: true, hasOutputs: false });

    expect(screen.getByText('No draft outputs available.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'When this project shares a draft output, it will be listed here.',
      ),
    ).toBeInTheDocument();
  });

  describe('published outputs (user-based project)', () => {
    it('fetches published outputs from Algolia filtered by projectId', async () => {
      mockGetResearchOutputs.mockResolvedValueOnce({
        ...createResearchOutputListAlgoliaResponse(1),
        hits: [buildOutput(1) as never],
      });

      await renderPage();

      await waitFor(() => {
        expect(mockGetResearchOutputs).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            projectId,
            searchQuery: '',
            currentPage: 0,
            pageSize: CARD_VIEW_PAGE_SIZE,
          }),
        );
      });

      expect(await screen.findByText('Output 1')).toBeInTheDocument();
    });

    it('does not use teamId filter for user-based projects', async () => {
      await renderPage();

      await waitFor(() => expect(mockGetResearchOutputs).toHaveBeenCalled());

      expect(mockGetResearchOutputs).toHaveBeenCalledWith(
        expect.anything(),
        expect.not.objectContaining({ teamId: expect.anything() }),
      );
    });
  });

  describe('published outputs (team-based project)', () => {
    it('fetches published outputs from Algolia filtered by teamId', async () => {
      mockGetResearchOutputs.mockResolvedValueOnce({
        ...createResearchOutputListAlgoliaResponse(1),
        hits: [buildOutput(1) as never],
      });

      await renderPage({ projectTeamId: teamId });

      await waitFor(() => {
        expect(mockGetResearchOutputs).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            teamId,
            searchQuery: '',
            currentPage: 0,
            pageSize: CARD_VIEW_PAGE_SIZE,
          }),
        );
      });

      expect(await screen.findByText('Output 1')).toBeInTheDocument();
    });

    it('does not use projectId filter for team-based projects', async () => {
      await renderPage({ projectTeamId: teamId });

      await waitFor(() => expect(mockGetResearchOutputs).toHaveBeenCalled());

      expect(mockGetResearchOutputs).toHaveBeenCalledWith(
        expect.anything(),
        expect.not.objectContaining({ projectId: expect.anything() }),
      );
    });
  });

  it('triggers export with custom filename', async () => {
    mockGetResearchOutputs.mockResolvedValueOnce({
      ...createResearchOutputListAlgoliaResponse(1),
      hits: [buildOutput(1) as never],
    });

    const { getByText } = await renderPage({ projectTeamId: teamId });

    await waitFor(() => {
      expect(mockGetResearchOutputs).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          teamId,
          searchQuery: '',
          currentPage: 0,
          pageSize: CARD_VIEW_PAGE_SIZE,
        }),
      );
    });

    const csvButton = getByText(/csv/i).closest('button');
    await userEvent.click(getByText(/csv/i));
    // ExportButton disables the button while the export is in flight; wait for
    // it to re-enable so the trailing setLoading(false) is flushed inside act.
    await waitFor(() => expect(csvButton).toBeEnabled());

    expect(mockCreateCsvFileStream).toHaveBeenLastCalledWith(
      expect.stringMatching(/SharedOutputs_Project_TestOne_\d+\.csv/),
      expect.anything(),
    );
    expect(mockGetResearchOutputs).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({
        teamId,
        searchQuery: '',
        currentPage: 0,
        pageSize: MAX_ALGOLIA_RESULTS,
      }),
    );
  });

  describe('draft outputs', () => {
    it('fetches draft outputs from the research outputs API', async () => {
      mockGetDraftResearchOutputs.mockResolvedValueOnce({
        total: 1,
        items: [
          {
            ...buildOutput(1),
            id: 'd1',
            title: 'Example draft',
            published: false,
          },
        ],
      });

      await renderPage({ draftOutputs: true });

      await waitFor(() => {
        expect(mockGetDraftResearchOutputs).toHaveBeenCalledWith(
          expect.objectContaining({
            projectId,
            draftsOnly: true,
            userAssociationMember: true,
          }),
          'Bearer access_token',
        );
      });

      expect(await screen.findByText('Example draft')).toBeInTheDocument();
      expect(
        screen.queryByText('No draft outputs available.'),
      ).not.toBeInTheDocument();
    });

    it('fetches team drafts by teamId for team-based projects', async () => {
      mockGetDraftResearchOutputs.mockResolvedValueOnce({
        total: 1,
        items: [{ ...buildOutput(1), id: 'd1', title: 'Team draft' }],
      });

      await renderPage({ draftOutputs: true, projectTeamId: teamId });

      await waitFor(() => {
        expect(mockGetDraftResearchOutputs).toHaveBeenCalledWith(
          expect.objectContaining({
            teamId,
            draftsOnly: true,
          }),
          'Bearer access_token',
        );
      });
    });

    it('triggers draft export with custom filename', async () => {
      mockGetDraftResearchOutputs.mockResolvedValueOnce({
        total: 1,
        items: [
          {
            ...buildOutput(1),
            id: 'd1',
            title: 'Example draft',
            published: false,
          },
        ],
      });

      const { getByText } = await renderPage({ draftOutputs: true });

      await waitFor(() => {
        expect(mockGetDraftResearchOutputs).toHaveBeenCalledWith(
          expect.objectContaining({
            projectId,
            draftsOnly: true,
            userAssociationMember: true,
          }),
          'Bearer access_token',
        );
      });

      const csvButton = getByText(/csv/i).closest('button');
      await userEvent.click(getByText(/csv/i));
      // ExportButton disables the button while the export is in flight; wait for
      // it to re-enable so the trailing setLoading(false) is flushed inside act.
      await waitFor(() => expect(csvButton).toBeEnabled());

      expect(mockCreateCsvFileStream).toHaveBeenLastCalledWith(
        expect.stringMatching(/SharedOutputs_Drafts_Project_TestOne_\d+\.csv/),
        expect.anything(),
      );
      expect(mockGetDraftResearchOutputs).toHaveBeenLastCalledWith(
        expect.objectContaining({
          projectId,
          draftsOnly: true,
          searchQuery: '',
          userAssociationMember: true,
          currentPage: 0,
          pageSize: CARD_VIEW_PAGE_SIZE,
        }),
        'Bearer access_token',
      );
    });

    it('shows no drafts when the user is not associated with the project', async () => {
      await renderPage({
        draftOutputs: true,
        userAssociationMember: false,
        hasOutputs: false,
      });

      await waitFor(() =>
        expect(screen.getByText('No draft outputs available.')).toBeVisible(),
      );
    });

    it('displays draft results, not Algolia results, when draftOutputs is true', async () => {
      mockGetDraftResearchOutputs.mockResolvedValueOnce({
        total: 1,
        items: [{ ...buildOutput(1), id: 'd1', title: 'Draft Only Output' }],
      });
      mockGetResearchOutputs.mockResolvedValue({
        ...createResearchOutputListAlgoliaResponse(1),
        hits: [
          { ...buildOutput(2), title: 'Published Algolia Output' } as never,
        ],
      });

      await renderPage({ draftOutputs: true });

      expect(await screen.findByText('Draft Only Output')).toBeInTheDocument();
      expect(
        screen.queryByText('Published Algolia Output'),
      ).not.toBeInTheDocument();
    });

    it('throws error when fetching draft research outputs fails', async () => {
      const error = new Error('API Error');
      mockGetDraftResearchOutputs.mockRejectedValue(error);

      const { getByText } = await renderPage({ draftOutputs: true });

      await waitFor(() =>
        expect(mockGetDraftResearchOutputs).toHaveBeenCalled(),
      );
      await waitFor(() =>
        expect(getByText(/Something went wrong/i)).toBeVisible(),
      );
    });

    it('stores draft research outputs error in state', async () => {
      const error = new Error('Draft outputs error');

      const { getByText } = await renderPage({
        draftOutputs: true,
        draftResearchOutputsError: error,
      });

      await waitFor(() =>
        expect(getByText(/Something went wrong/i)).toBeVisible(),
      );
    });
  });

  it('passes pagination params from the URL to the published outputs fetch', async () => {
    mockGetResearchOutputs.mockResolvedValue({
      ...createResearchOutputListAlgoliaResponse(10),
      hits: Array.from({ length: 10 }, (_, i) => buildOutput(i + 11) as never),
      nbHits: 15,
    });

    await renderPage({ queryString: 'currentPage=1' });

    await waitFor(() => {
      expect(mockGetResearchOutputs).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          currentPage: 1,
          pageSize: CARD_VIEW_PAGE_SIZE,
        }),
      );
    });
  });

  it('uses list view page size when the view URL param is set', async () => {
    mockGetResearchOutputs.mockResolvedValue({
      ...createResearchOutputListAlgoliaResponse(1),
      hits: [buildOutput(1) as never],
    });

    await renderPage({ queryString: `${viewParam}=${listViewValue}` });

    await waitFor(() => {
      expect(mockGetResearchOutputs).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          pageSize: LIST_VIEW_PAGE_SIZE,
        }),
      );
    });
  });

  it('throws error when fetching published research outputs fails', async () => {
    const error = new Error('Algolia Error');
    mockGetResearchOutputs.mockRejectedValue(error);

    const { getByText } = await renderPage();

    await waitFor(() => expect(mockGetResearchOutputs).toHaveBeenCalled());
    await waitFor(() =>
      expect(getByText(/Something went wrong/i)).toBeVisible(),
    );
  });
});
