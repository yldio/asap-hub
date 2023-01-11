import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { network } from '@asap-hub/routing';
import { createUserResponse } from '@asap-hub/fixtures';

import { RecoilRoot } from 'recoil';
import Outputs from '../Outputs';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';

jest.mock('../../../shared-research/api');
jest.mock('../api');

const renderOutputs = async (workingGroupId = '42', userId = 'user-id') => {
  const result = render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{ ...createUserResponse(), id: userId }}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                {
                  pathname: network({})
                    .workingGroups({})
                    .workingGroup({ workingGroupId })
                    .outputs({}).$,
                },
              ]}
            >
              <Route
                path={
                  network({})
                    .workingGroups({})
                    .workingGroup({ workingGroupId })
                    .outputs({}).$
                }
              >
                <Outputs workingGroupId={workingGroupId} />
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

it('renders the no outputs component correctly', async () => {
  const { getByText } = await renderOutputs('');
  expect(
    getByText('This working group hasn’t shared any research.'),
  ).toBeVisible();
});

it('renders the no outputs component correctly for own team', async () => {
  const { getByText } = await renderOutputs('working-group-id', 'user-id-0');
  expect(
    getByText('Your working group hasn’t shared any research.'),
  ).toBeVisible();
});
