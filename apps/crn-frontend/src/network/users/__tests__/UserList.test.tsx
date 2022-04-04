import { Suspense } from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { createListUserResponse } from '@asap-hub/fixtures';
import { RecoilRoot } from 'recoil';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';

import UserList from '../UserList';
import { getUsers } from '../api';
import { usersState } from '../state';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';

jest.mock('../api');
jest.mock('../../teams/api');
jest.mock('../../groups/api');

const mockGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;

const renderUserList = async () => {
  const result = render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          usersState({
            currentPage: 0,
            pageSize: CARD_VIEW_PAGE_SIZE,
            filters: new Set(),
            searchQuery: '',
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/users']}>
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

it('renders a list of people when searching with algolia', async () => {
  const listUserResponse = createListUserResponse(2);
  const names = ['Person A', 'Person B'];
  mockGetUsers.mockResolvedValue({
    ...listUserResponse,
    items: listUserResponse.items.map((item, itemIndex) => ({
      ...item,
      displayName: names[itemIndex],
    })),
  });

  const { container } = await renderUserList();
  expect(container.textContent).toContain('Person A');
  expect(container.textContent).toContain('Person B');
});
