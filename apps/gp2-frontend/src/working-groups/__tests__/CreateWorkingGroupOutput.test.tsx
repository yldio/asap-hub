import { gp2 } from '@asap-hub/fixtures';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import NotificationMessages from '../../NotificationMessages';
import { createOutput } from '../../outputs/api';
import { getExternalUsers, getUsers } from '../../users/api';
import CreateWorkingGroupOutput from '../CreateWorkingGroupOutput';

jest.mock('../../outputs/api');
jest.mock('../../users/api');

const mockCreateOutput = createOutput as jest.MockedFunction<
  typeof createOutput
>;
const mockGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;
const mockGetExternalUsers = getExternalUsers as jest.MockedFunction<
  typeof getExternalUsers
>;

const renderCreateWorkingGroupOutput = async (
  documentType: gp2Routing.OutputDocumentTypeParameter = 'article',
) => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                gp2Routing
                  .workingGroups({})
                  .workingGroup({ workingGroupId: 'working-group-id-1' })
                  .createOutput({ outputDocumentType: documentType }).$,
              ]}
            >
              <Route
                path={
                  gp2Routing.workingGroups.template +
                  gp2Routing.workingGroups({}).workingGroup.template +
                  gp2Routing
                    .workingGroups({})
                    .workingGroup({ workingGroupId: 'working-group-id-1' })
                    .createOutput.template
                }
              >
                <NotificationMessages>
                  <CreateWorkingGroupOutput />
                </NotificationMessages>
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

it('publishes the output', async () => {
  mockGetUsers.mockResolvedValue({
    total: 1,
    items: [gp2.createUserResponse({ displayName: 'Tony Stark', id: '1' })],
  });
  mockGetExternalUsers.mockResolvedValue({
    total: 1,
    items: [{ displayName: 'Steve Rogers', id: '2' }],
  });
  mockCreateOutput.mockResolvedValueOnce(gp2.createOutputResponse());
  const title = 'this is the output title';
  const link = 'https://example.com';
  await renderCreateWorkingGroupOutput('procedural-form');

  userEvent.type(screen.getByRole('textbox', { name: /title/i }), title);
  userEvent.type(screen.getByRole('textbox', { name: /url/i }), link);
  const authors = screen.getByRole('textbox', { name: /Authors/i });
  userEvent.click(authors);
  userEvent.click(screen.getByText(/Tony Stark/i));
  userEvent.click(authors);
  userEvent.click(screen.getByText(/Steve Rogers \(/i));
  userEvent.click(screen.getByRole('button', { name: /publish/i }));
  expect(await screen.findByRole('button', { name: /publish/i })).toBeEnabled();
  expect(mockCreateOutput).toHaveBeenCalledWith(
    {
      title,
      link,
      documentType: 'Procedural Form',
      authors: [
        {
          userId: '1',
        },
        {
          externalUserId: '2',
        },
      ],
      workingGroupId: 'working-group-id-1',
      projectId: undefined,
    },
    expect.anything(),
  );
});
