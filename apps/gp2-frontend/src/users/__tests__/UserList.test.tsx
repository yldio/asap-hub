import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getUsers } from '../api';
import { refreshUsersState } from '../state';
import UserList from '../UserList';

jest.mock('../api');
jest.mock('../../users/api');

const mockGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;

const renderUserList = async (
  listGroupResponse: gp2Model.ListUserResponse = gp2Fixtures.createUsersResponse(),
) => {
  mockGetUsers.mockResolvedValue(listGroupResponse);

  render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshUsersState, Math.random());
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/users/']}>
              <Route path="/users" component={UserList} />
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

it('fetches the user information', async () => {
  await renderUserList();

  await waitFor(() =>
    expect(mockGetUsers).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: { region: [] },
        search: '',
        skip: 0,
        take: 10,
      }),
      expect.anything(),
    ),
  );
});

it('renders a list of fetched groups', async () => {
  await renderUserList({
    total: 2,
    items: gp2Fixtures.createUsersResponse(2).items.map((user, i) => ({
      ...user,
      id: `${i}`,
      displayName: `Display Name ${i}`,
    })),
  });
  expect(
    screen.getByRole('heading', { name: /display name 0/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: /display name 1/i }),
  ).toBeInTheDocument();
});
