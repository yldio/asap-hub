import {
  createManuscriptVersionResponse,
  createResearchOutputResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import {
  ManuscriptVersionResponse,
  ResearchOutputResponse,
  RESEARCH_OUTPUT_FLOW_IDS,
  UserResponse,
} from '@asap-hub/model';
import { userEvent } from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { network, OutputDocumentTypeParameter } from '@asap-hub/routing';
import { MemoryRouter, Route, Routes } from 'react-router';
import TeamOutput from '../TeamOutput';
import { getManuscriptVersions } from '../api';

jest.mock('../api');
jest.mock('../../users/api');
jest.mock('../../../shared-api/impact');
jest.mock('../../../shared-research/api');

beforeEach(() => {
  jest.clearAllMocks();
});

const mockGetManuscriptVersions = getManuscriptVersions as jest.MockedFunction<
  typeof getManuscriptVersions
>;

const getFlowId = () =>
  document.querySelector('[data-flow-id]')?.getAttribute('data-flow-id');

const baseResearchOutput: ResearchOutputResponse = {
  ...createResearchOutputResponse(),
  teams: [
    {
      id: '42',
      displayName: 'Jakobsson, J',
      teamType: 'Discovery Team',
    },
  ],
};

const baseUser = createUserResponse();

async function renderPage({
  user = {
    ...baseUser,
    teams: [{ ...baseUser.teams[0]!, id: '42', role: 'Project Manager' }],
  },
  teamId,
  outputDocumentType = 'bioinformatics',
  researchOutputData,
  versionAction,
  latestManuscriptVersion,
  isDuplicate = false,
}: {
  user?: UserResponse;
  teamId: string;
  versionAction?: 'create' | 'edit';
  outputDocumentType?: OutputDocumentTypeParameter;
  researchOutputData?: ResearchOutputResponse;
  latestManuscriptVersion?: ManuscriptVersionResponse;
  isDuplicate?: boolean;
}) {
  const path =
    network.template +
    network({}).teams.template +
    network({}).teams({}).team.template +
    network({}).teams({}).team({ teamId }).createOutput.template;

  const initialPath = network({})
    .teams({})
    .team({ teamId })
    .createOutput({ outputDocumentType }).$;

  render(
    <RecoilRoot>
      <QueryClientProvider client={createTestQueryClient()}>
        <Suspense fallback="loading">
          <Auth0Provider user={user}>
            <WhenReady>
              <MemoryRouter initialEntries={[initialPath]}>
                <Routes>
                  <Route
                    path={path}
                    element={
                      <TeamOutput
                        teamId={teamId}
                        researchOutputData={researchOutputData}
                        versionAction={versionAction}
                        latestManuscriptVersion={latestManuscriptVersion}
                        isDuplicate={isDuplicate}
                      />
                    }
                  />
                </Routes>
              </MemoryRouter>
            </WhenReady>
          </Auth0Provider>
        </Suspense>
      </QueryClientProvider>
    </RecoilRoot>,
  );
  await waitFor(
    () => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    { timeout: 30_000 },
  );
}

it('passes TEAM_CREATE_MANUAL for a new manual team output', async () => {
  await renderPage({
    teamId: '42',
    outputDocumentType: 'bioinformatics',
  });

  expect(getFlowId()).toBe(RESEARCH_OUTPUT_FLOW_IDS.TEAM_CREATE_MANUAL);
});

it('passes TEAM_CREATE_MANUAL for a new manual team article when Create manually is selected', async () => {
  await renderPage({
    teamId: '42',
    outputDocumentType: 'article',
  });

  await userEvent.click(screen.getByLabelText('Create manually'));

  expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /Create/i }));

  expect(getFlowId()).toBe(RESEARCH_OUTPUT_FLOW_IDS.TEAM_CREATE_MANUAL);
});

it('passes TEAM_CREATE_IMPORTED_FROM_MANUSCRIPT when creating a team article from a manuscript', async () => {
  mockGetManuscriptVersions.mockResolvedValue({
    total: 1,
    items: [
      {
        id: 'mv-manuscript-id-1',
        hasLinkedResearchOutput: false,
        title: 'Version One',
        url: 'http://example.com',
        type: 'Original Research',
        lifecycle: 'Preprint',
      },
    ],
  });

  await renderPage({
    teamId: '42',
    outputDocumentType: 'article',
  });

  await userEvent.click(screen.getByLabelText('Import from compliance'));
  const input = screen.getByRole('combobox');
  await userEvent.type(input, 'Version');
  const option = await screen.findByText('Version One');
  await userEvent.click(option);

  await userEvent.click(screen.getByRole('button', { name: /import/i }));

  expect(getFlowId()).toBe(
    RESEARCH_OUTPUT_FLOW_IDS.TEAM_CREATE_IMPORTED_FROM_MANUSCRIPT,
  );
});

it('passes TEAM_EDIT_PUBLISHED when editing a published research output', async () => {
  await renderPage({
    teamId: '42',
    researchOutputData: {
      ...baseResearchOutput,
      published: true,
    },
    versionAction: 'edit',
  });

  expect(getFlowId()).toBe(RESEARCH_OUTPUT_FLOW_IDS.TEAM_EDIT_PUBLISHED);
});

it('passes TEAM_EDIT_DRAFT when editing a draft research output', async () => {
  await renderPage({
    teamId: '42',
    researchOutputData: {
      ...baseResearchOutput,
      published: false,
    },
    versionAction: 'edit',
  });

  expect(getFlowId()).toBe(RESEARCH_OUTPUT_FLOW_IDS.TEAM_EDIT_DRAFT);
});

it('passes TEAM_ADD_VERSION when creating a new research output version', async () => {
  await renderPage({
    teamId: '42',
    researchOutputData: {
      ...baseResearchOutput,
      published: false,
    },
    versionAction: 'create',
  });

  expect(getFlowId()).toBe(RESEARCH_OUTPUT_FLOW_IDS.TEAM_ADD_VERSION);
});

it('passes TEAM_ADD_VERSION_FROM_MANUSCRIPT when creating a new research output version from research output linked to manuscript with latest version', async () => {
  const latestManuscriptVersion = createManuscriptVersionResponse();
  await renderPage({
    teamId: '42',
    researchOutputData: {
      ...baseResearchOutput,
      documentType: 'Article',
      relatedManuscript: 'manuscript-id-1',
    },
    versionAction: 'create',
    latestManuscriptVersion,
  });

  expect(getFlowId()).toBe(
    RESEARCH_OUTPUT_FLOW_IDS.TEAM_ADD_VERSION_FROM_MANUSCRIPT,
  );
});

it('passes TEAM_DUPLICATE when duplicating a research output', async () => {
  await renderPage({
    teamId: '42',
    researchOutputData: {
      ...baseResearchOutput,
      published: false,
      documentType: 'Article',
    },
    isDuplicate: true,
  });

  expect(getFlowId()).toBe(RESEARCH_OUTPUT_FLOW_IDS.TEAM_DUPLICATE);
});
