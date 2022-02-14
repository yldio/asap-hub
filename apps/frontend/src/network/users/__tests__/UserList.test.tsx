import { Suspense } from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { createListUserResponse } from '@asap-hub/fixtures';
import { RecoilRoot } from 'recoil';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/frontend/src/auth/test-utils';

import { renderHook } from '@testing-library/react-hooks';
import { useFlags } from '@asap-hub/react-context';
import UserList from '../UserList';
import { getUsers, getUsersWithAlgolia } from '../api';
import { usersState } from '../state';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';

jest.mock('../api');
jest.mock('../../teams/api');
jest.mock('../../groups/api');

const mockGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;
const mockGetUsersWithAlgolia = getUsersWithAlgolia as jest.MockedFunction<
  typeof getUsersWithAlgolia
>;

const renderUserList = async (opts: { algoliaEnabled: boolean }) => {
  const {
    result: {
      current: { disable, enable },
    },
  } = renderHook(useFlags);
  if (opts.algoliaEnabled) {
    enable('ALGOLIA_USER_SEARCH');
  } else {
    disable('ALGOLIA_USER_SEARCH');
  }

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

it('renders a list of people', async () => {
  const listUserResponse = createListUserResponse(2);
  const names = ['Person A', 'Person B'];

  mockGetUsers.mockResolvedValue({
    ...listUserResponse,
    items: listUserResponse.items.map((item, itemIndex) => ({
      ...item,
      displayName: names[itemIndex],
    })),
  });

  const { container } = await renderUserList({ algoliaEnabled: false });
  expect(container.textContent).toContain('Person A');
  expect(container.textContent).toContain('Person B');
});

it('renders a list of people when searching with algolia', async () => {
  const listUserResponse = createListUserResponse(2);
  const names = ['Person A', 'Person B'];
  mockGetUsersWithAlgolia.mockResolvedValue({
    ...listUserResponse,
    items: listUserResponse.items.map((item, itemIndex) => ({
      ...item,
      displayName: names[itemIndex],
    })),
  });

  const { container } = await renderUserList({ algoliaEnabled: true });
  expect(container.textContent).toContain('Person A');
  expect(container.textContent).toContain('Person B');
});
