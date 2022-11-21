import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createCsvFileStream } from '@asap-hub/frontend-utils';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getUsers } from '../api';
import { refreshUsersState } from '../state';
import UserList from '../UserList';
import * as search from '../../hooks/search';
import { MAX_SQUIDEX_RESULTS } from '../export';

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
jest.mock('../../users/api');

const mockGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;

const mockCreateCsvFileStream = createCsvFileStream as jest.MockedFunction<
  typeof createCsvFileStream
>;

const renderUserList = async (
  listGroupResponse: gp2Model.ListUserResponse = gp2Fixtures.createUsersResponse(),
  displayFilters: boolean = false,
  isAdministrator: boolean = false,
) => {
  mockGetUsers.mockResolvedValue(listGroupResponse);

  render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshUsersState, Math.random());
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider
          user={{ role: isAdministrator ? 'Administrator' : undefined }}
        >
          <WhenReady>
            <MemoryRouter initialEntries={['/users/']}>
              <Route path="/users">
                <UserList displayFilters={displayFilters} />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};
afterEach(() => {
  jest.clearAllMocks();
});
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

it('renders the filters modal', async () => {
  await renderUserList(undefined, true);
  expect(screen.getByRole('heading', { name: 'Filters' })).toBeVisible();
});
it('calls the updateFilters with the right arguments', async () => {
  const mockUpdateFilter = jest.fn();
  jest.spyOn(search, 'useSearch').mockImplementation(() => ({
    changeLocation: jest.fn(),
    filters: { region: [] },
    updateFilters: mockUpdateFilter,
  }));
  await renderUserList(undefined, true);
  userEvent.click(screen.getByRole('button', { name: 'Apply' }));
  expect(mockUpdateFilter).toHaveBeenCalledWith('/users', { region: [] });
});

it('triggers export with the same parameters', async () => {
  await renderUserList(undefined, undefined, true);

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
  userEvent.click(screen.getByRole('button', { name: 'Export Export' }));
  expect(mockCreateCsvFileStream).toHaveBeenLastCalledWith(
    expect.stringMatching('user_export.csv'),
    expect.anything(),
  );
  await waitFor(() =>
    expect(mockGetUsers).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: { region: [] },
        search: '',
        skip: 0,
        take: MAX_SQUIDEX_RESULTS,
      }),
      expect.anything(),
    ),
  );
});
