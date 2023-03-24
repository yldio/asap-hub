import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { network } from '@asap-hub/routing';
import {
  createListResearchOutputResponse,
  createUserResponse,
  createWorkingGroupResponse,
} from '@asap-hub/fixtures';
import { RecoilRoot } from 'recoil';
import { createCsvFileStream } from '@asap-hub/frontend-utils';
import userEvent from '@testing-library/user-event';

import Outputs from '../Outputs';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import {
  getDraftResearchOutputs,
  getResearchOutputs,
} from '../../../shared-research/api';
import { createResearchOutputListAlgoliaResponse } from '../../../__fixtures__/algolia';
import {
  MAX_ALGOLIA_RESULTS,
  MAX_SQUIDEX_RESULTS,
} from '../../../shared-research/export';
import { researchOutputsState } from '../../../shared-research/state';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';

jest.mock('@asap-hub/frontend-utils', () => {
  const original = jest.requireActual('@asap-hub/frontend-utils');
  return {
    ...original,
    createCsvFileStream: jest
      .fn()
      .mockImplementation(() => ({ write: jest.fn(), end: jest.fn() })),
  };
});
jest.mock('../../../shared-research/api');
jest.mock('../api');

const mockGetResearchOutputs = getResearchOutputs as jest.MockedFunction<
  typeof getResearchOutputs
>;
const mockGetDraftResearchOutputs =
  getDraftResearchOutputs as jest.MockedFunction<
    typeof getDraftResearchOutputs
  >;
const mockCreateCsvFileStream = createCsvFileStream as jest.MockedFunction<
  typeof createCsvFileStream
>;

const renderOutputs = async (
  workingGroup = createWorkingGroupResponse({}),
  user = createUserResponse(),
  userAssociationMember = false,
  draftOutputs = false,
) => {
  const result = render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          researchOutputsState({
            searchQuery: '',
            filters: new Set<string>(),
            workingGroupId: workingGroup.id,
            currentPage: 0,
            pageSize: CARD_VIEW_PAGE_SIZE,
          }),
        );
        reset(
          researchOutputsState({
            searchQuery: '',
            filters: new Set<string>(),
            workingGroupId: workingGroup.id,
            currentPage: 0,
            pageSize: MAX_ALGOLIA_RESULTS,
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={user}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                {
                  pathname: network({})
                    .workingGroups({})
                    .workingGroup({ workingGroupId: workingGroup.id })
                    .outputs({}).$,
                },
              ]}
            >
              <Route
                path={
                  network({})
                    .workingGroups({})
                    .workingGroup({ workingGroupId: workingGroup.id })
                    .outputs({}).$
                }
              >
                <Outputs
                  userAssociationMember={userAssociationMember}
                  workingGroup={workingGroup}
                  draftOutputs={draftOutputs}
                />
              </Route>
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
it('renders a list of research outputs', async () => {
  mockGetResearchOutputs.mockResolvedValue({
    ...createResearchOutputListAlgoliaResponse(2),
    hits: createResearchOutputListAlgoliaResponse(2).hits.map((hit, index) => ({
      ...hit,
      title: `Test Output ${index}`,
    })),
  });
  const { container } = await renderOutputs();
  await waitFor(() => {
    expect(mockGetResearchOutputs).toHaveBeenCalled();
    expect(container.textContent).toContain('Test Output 0');
    expect(container.textContent).toContain('Test Output 1');
  });
});

it('renders the no outputs component correctly for your own working group', async () => {
  mockGetResearchOutputs.mockResolvedValue({
    ...createResearchOutputListAlgoliaResponse(0),
  });
  const { getByText } = await renderOutputs(undefined, undefined, true);
  expect(
    getByText('Your working group hasn’t shared any research yet!'),
  ).toBeVisible();
});

it('renders the no outputs component correctly for a different working group', async () => {
  mockGetResearchOutputs.mockResolvedValue({
    ...createResearchOutputListAlgoliaResponse(0),
  });
  const { getByText } = await renderOutputs(
    {
      ...createWorkingGroupResponse({}),
      members: [
        {
          user: { ...createUserResponse(), id: 'groupMember' },
          isActive: true,
        },
      ],
    },
    { ...createUserResponse(), id: 'notGroupMember' },
  );
  expect(
    getByText('This working group hasn’t shared any research yet!'),
  ).toBeVisible();
});

it('triggers research output export with custom file name', async () => {
  const filters = new Set();
  const workingGroupId = '12345';
  mockGetResearchOutputs.mockResolvedValue({
    ...createResearchOutputListAlgoliaResponse(2),
  });
  const { getByText } = await renderOutputs({
    ...createWorkingGroupResponse({}),
    id: workingGroupId,
    title: 'WorkingGroup123',
  });

  userEvent.click(getByText(/export as csv/i));
  await waitFor(() =>
    expect(mockGetResearchOutputs).toHaveBeenCalledWith(expect.anything(), {
      searchQuery: '',
      filters,
      workingGroupId,
      currentPage: 0,
      pageSize: MAX_ALGOLIA_RESULTS,
    }),
  );
  expect(mockCreateCsvFileStream).toHaveBeenLastCalledWith(
    expect.stringMatching(
      /SharedOutputs_WorkingGroup_Workinggroup123_\d+\.csv/,
    ),
    expect.anything(),
  );
});

it('triggers draft research output export with custom file name', async () => {
  const filters = new Set();
  const workingGroupId = '12345';
  mockGetDraftResearchOutputs.mockResolvedValue({
    ...createListResearchOutputResponse(2),
  });
  const { getByText } = await renderOutputs(
    {
      ...createWorkingGroupResponse({}),
      id: workingGroupId,
      title: 'WorkingGroup123',
    },
    undefined,
    true,
    true,
  );

  userEvent.click(getByText(/export as csv/i));
  await waitFor(() =>
    expect(mockGetDraftResearchOutputs).toHaveBeenCalledWith(
      {
        searchQuery: '',
        filters,
        workingGroupId,
        draftsOnly: true,
        userAssociationMember: true,
        currentPage: 0,
        pageSize: MAX_SQUIDEX_RESULTS,
      },
      expect.anything(),
    ),
  );
  expect(mockCreateCsvFileStream).toHaveBeenLastCalledWith(
    expect.stringMatching(
      /SharedOutputs_Drafts_WorkingGroup_Workinggroup123_\d+\.csv/,
    ),
    expect.anything(),
  );
});
