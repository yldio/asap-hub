import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  render,
  waitForElementToBeRemoved,
  screen,
} from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import CreateWorkingGroupOutput from '../CreateWorkingGroupOutput';

const renderCreateWorkingGroupOutput = async (route?: string) => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                route ||
                  gp2Routing
                    .workingGroups({})
                    .workingGroup({ workingGroupId: '1' })
                    .createOutput({ outputDocumentType: 'article' }).$,
              ]}
            >
              <Route
                path={
                  gp2Routing.workingGroups.template +
                  gp2Routing.workingGroups({}).workingGroup.template +
                  gp2Routing
                    .workingGroups({})
                    .workingGroup({ workingGroupId: '1' }).createOutput.template
                }
              >
                <CreateWorkingGroupOutput />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

it('renders the title', async () => {
  await renderCreateWorkingGroupOutput();
  expect(screen.getByRole('heading', { name: /share/i })).toBeVisible();
});
