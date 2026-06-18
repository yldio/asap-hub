import {
  createResearchOutputResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import {
  ResearchOutputResponse,
  RESEARCH_OUTPUT_FLOW_IDS,
  UserResponse,
} from '@asap-hub/model';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { Suspense } from 'react';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { network, OutputDocumentTypeParameter } from '@asap-hub/routing';
import { MemoryRouter, Route, Routes } from 'react-router';
import WorkingGroupOutput from '../WorkingGroupOutput';

jest.mock('../api');
jest.mock('../../users/api');
jest.mock('../../../shared-api/impact');
jest.mock('../../../shared-research/api');

beforeEach(() => {
  jest.clearAllMocks();
});

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
    workingGroups: [
      {
        ...baseUser.workingGroups[0]!,
        id: 'wg1',
        role: 'Project Manager',
        active: true,
      },
    ],
  },
  workingGroupId = 'wg1',
  outputDocumentType = 'article',
  researchOutputData,
  versionAction,
  descriptionUnchangedWarning,
}: {
  user?: UserResponse;
  workingGroupId: string;
  versionAction?: 'create' | 'edit';
  outputDocumentType?: OutputDocumentTypeParameter;
  researchOutputData?: ResearchOutputResponse;
  descriptionUnchangedWarning?: boolean;
}) {
  const path =
    network.template +
    network({}).workingGroups.template +
    network({}).workingGroups({}).workingGroup.template +
    network({}).workingGroups({}).workingGroup({ workingGroupId }).createOutput
      .template;

  const initialPath = network({})
    .workingGroups({})
    .workingGroup({ workingGroupId })
    .createOutput({ outputDocumentType }).$;

  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={user}>
          <WhenReady>
            <MemoryRouter initialEntries={[initialPath]}>
              <Routes>
                <Route
                  path={path}
                  element={
                    <WorkingGroupOutput
                      workingGroupId={workingGroupId}
                      researchOutputData={researchOutputData}
                      versionAction={versionAction}
                      descriptionUnchangedWarning={descriptionUnchangedWarning}
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
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
}

it('passes WORKING_GROUP_CREATE when creating a working group output', async () => {
  await renderPage({
    workingGroupId: 'wg1',
    outputDocumentType: 'bioinformatics',
  });

  expect(getFlowId()).toBe(RESEARCH_OUTPUT_FLOW_IDS.WORKING_GROUP_CREATE);
});

it('passes WORKING_GROUP_EDIT_PUBLISHED when editing a published research output', async () => {
  await renderPage({
    workingGroupId: 'wg1',
    researchOutputData: {
      ...baseResearchOutput,
      published: true,
    },
    versionAction: 'edit',
  });

  expect(getFlowId()).toBe(
    RESEARCH_OUTPUT_FLOW_IDS.WORKING_GROUP_EDIT_PUBLISHED,
  );
});

it('passes WORKING_GROUP_EDIT_DRAFT when editing a draft research output', async () => {
  await renderPage({
    workingGroupId: 'wg1',
    researchOutputData: {
      ...baseResearchOutput,
      published: false,
    },
    versionAction: 'edit',
  });

  expect(getFlowId()).toBe(RESEARCH_OUTPUT_FLOW_IDS.WORKING_GROUP_EDIT_DRAFT);
});

it('passes WORKING_GROUP_ADD_VERSION when creating a new research output version', async () => {
  await renderPage({
    workingGroupId: 'wg1',
    researchOutputData: {
      ...baseResearchOutput,
      published: false,
    },
    versionAction: 'create',
  });

  expect(getFlowId()).toBe(RESEARCH_OUTPUT_FLOW_IDS.WORKING_GROUP_ADD_VERSION);
});

it('passes WORKING_GROUP_DUPLICATE when duplicating a research output', async () => {
  await renderPage({
    workingGroupId: 'wg1',
    researchOutputData: {
      ...baseResearchOutput,
      published: false,
    },
    descriptionUnchangedWarning: true,
  });

  expect(getFlowId()).toBe(RESEARCH_OUTPUT_FLOW_IDS.WORKING_GROUP_DUPLICATE);
});
