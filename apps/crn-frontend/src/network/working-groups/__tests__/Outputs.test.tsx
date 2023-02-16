import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { network } from '@asap-hub/routing';
import {
  createUserResponse,
  createWorkingGroupResponse,
} from '@asap-hub/fixtures';

import { RecoilRoot } from 'recoil';
import Outputs from '../Outputs';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getResearchOutputs } from '../../../shared-research/api';
import { createResearchOutputListAlgoliaResponse } from '../../../__fixtures__/algolia';

jest.mock('../../../shared-research/api');
jest.mock('../api');

const mockGetResearchOutputs = getResearchOutputs as jest.MockedFunction<
  typeof getResearchOutputs
>;
mockGetResearchOutputs.mockResolvedValue({
  ...createResearchOutputListAlgoliaResponse(0),
});

const renderOutputs = async (
  workingGroup = createWorkingGroupResponse({}),
  user = createUserResponse(),
) => {
  const result = render(
    <RecoilRoot>
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
                <Outputs workingGroup={workingGroup} />
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

it('renders the no outputs component correctly for your own team', async () => {
  const { getByText } = await renderOutputs(
    {
      ...createWorkingGroupResponse({}),
      members: [{ user: { ...createUserResponse(), id: 'groupMember' } }],
    },
    { ...createUserResponse(), id: 'groupMember' },
  );
  expect(
    getByText('Your working group hasn’t shared any research yet!'),
  ).toBeVisible();
});

it('renders the no outputs component correctly for a different team', async () => {
  const { getByText } = await renderOutputs(
    {
      ...createWorkingGroupResponse({}),
      members: [{ user: { ...createUserResponse(), id: 'groupMember' } }],
    },
    { ...createUserResponse(), id: 'notGroupMember' },
  );
  expect(
    getByText('This working group hasn’t shared any research yet!'),
  ).toBeVisible();
});
