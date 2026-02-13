import { Suspense } from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createListUserResponse } from '@asap-hub/fixtures';
import { createCsvFileStream } from '@asap-hub/frontend-utils';
import { User } from '@asap-hub/auth';
import { RecoilRoot } from 'recoil';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';

import UserList from '../UserList';
import { getUsers } from '../api';
import { usersState } from '../state';
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
jest.mock('../api');
jest.mock('../../teams/api');
jest.mock('../../interest-groups/api');
jest.mock('../../working-groups/api');

const mockGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;
const mockCreateCsvFileStream = createCsvFileStream as jest.MockedFunction<
  typeof createCsvFileStream
>;

const renderUserList = async (user: Partial<User> = {}) => {
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
        <Auth0Provider user={user}>
          <WhenReady>
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={['/users']}>
              <Routes>
                <Route path="/users" element={<UserList />} />
              </Routes>
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

beforeEach(() => {
  jest.clearAllMocks();
});

it('renders a list of people when searching with algolia', async () => {
  const listUserResponse = createListUserResponse(2);
  const names = ['Person A', 'Person B'];
  mockGetUsers.mockResolvedValue({
    ...listUserResponse,
    items: listUserResponse.items.map((item, itemIndex) => ({
      ...item,
      fullDisplayName: names[itemIndex]!,
    })),
  });

  const { container } = await renderUserList();
  expect(container.textContent).toContain('Person A');
  expect(container.textContent).toContain('Person B');
});

it('renders an algolia tagged result list and hit', async () => {
  const listUserResponse = createListUserResponse(1);
  mockGetUsers.mockResolvedValue({
    ...listUserResponse,
    algoliaIndexName: 'index',
    algoliaQueryId: 'queryId',
    items: listUserResponse.items.map((item, itemIndex) => ({
      ...item,
      id: 'hitId',
    })),
  });

  const { container } = await renderUserList();
  const resultListHtml = container.querySelector('*[data-insights-index]');
  expect(resultListHtml?.getAttribute('data-insights-index')).toEqual('index');
  const hitHtml = resultListHtml?.querySelector('*[data-insights-object-id]');
  expect(hitHtml?.attributes).toMatchInlineSnapshot(`
    NamedNodeMap {
      "data-insights-object-id": "hitId",
      "data-insights-position": "1",
      "data-insights-query-id": "queryId",
    }
  `);
});

it('shows download button for Staff users', async () => {
  mockGetUsers.mockResolvedValue(createListUserResponse(1));

  const { queryByText } = await renderUserList({ role: 'Staff' });
  expect(queryByText(/csv/i)).toBeInTheDocument();
});

it('does not show download button for non-Staff users', async () => {
  mockGetUsers.mockResolvedValue(createListUserResponse(1));

  const { queryByText } = await renderUserList({ role: 'Grantee' });
  expect(queryByText(/csv/i)).not.toBeInTheDocument();
});

it('triggers export with correct parameters for Staff users', async () => {
  mockGetUsers.mockResolvedValue(createListUserResponse(1));

  const { getByText } = await renderUserList({ role: 'Staff' });
  await userEvent.click(getByText(/csv/i));
  expect(mockCreateCsvFileStream).toHaveBeenCalledWith(
    expect.stringMatching(/People_\d+\.csv/),
    expect.anything(),
  );
});
