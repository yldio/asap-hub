import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route } from 'react-router-dom';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render, waitFor } from '@testing-library/react';
import { gp2 } from '@asap-hub/model';
import { getUsers } from '../api';
import { refreshUsersState } from '../state';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import UserList from '../UserList';

jest.mock('../api');
jest.mock('../../users/api');

const mockGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;

const renderUserList = async (
  listGroupResponse: gp2.ListUserResponse = gp2Fixtures.createUsersResponse(),
) => {
  mockGetUsers.mockResolvedValue(listGroupResponse);

  const result = render(
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
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

it('fetches the user information', async () => {
  await renderUserList();

  await waitFor(() =>
    expect(mockGetUsers).toHaveBeenCalledWith(
      expect.objectContaining({
        currentPage: 0,
      }),
      expect.anything(),
    ),
  );
});

it('renders a list of fetched groups', async () => {
  const { container } = await renderUserList({
    total: 2,
    items: gp2Fixtures.createUsersResponse(2).items.map((user, i) => ({
      ...user,
      id: `${i}`,
      displayName: `Display Name ${i}`,
    })),
  });
  expect(container.textContent).toContain('Display Name 0');
  expect(container.textContent).toContain('Display Name 1');
});
