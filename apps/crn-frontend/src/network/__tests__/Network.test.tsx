import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { createListUserResponse } from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Network from '../Network';
import { getTeams } from '../teams/api';
import { getGroups } from '../groups/api';
import { useUsers } from '../users/state';
import { getWorkingGroups } from '../working-groups/api';

jest.mock('../users/state', () => ({
  useUsers: jest.fn().mockReturnValue({ items: [], total: 0 }),
}));

jest.mock('../teams/api');
jest.mock('../groups/api');
jest.mock('../working-groups/api');

const mockUseUsers = useUsers as jest.MockedFunction<typeof useUsers>;
const mockGetTeams = getTeams as jest.MockedFunction<typeof getTeams>;
const mockGetGroups = getGroups as jest.MockedFunction<typeof getGroups>;
const mockGetWorkingGroups = getWorkingGroups as jest.MockedFunction<
  typeof getWorkingGroups
>;

mockUseUsers.mockReturnValue(createListUserResponse(1));

const renderNetworkPage = async (pathname: string, query = '') => {
  const result = render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[{ pathname, search: query }]}>
              <Route path={network.template}>
                <Network />
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

describe('when toggling from teams to users', () => {
  it('changes the placeholder', async () => {
    const { getByText, queryByText, getByRole } = await renderNetworkPage(
      network({}).teams({}).$,
    );

    expect(
      (getByRole('searchbox') as HTMLInputElement).placeholder,
    ).toMatchInlineSnapshot(`"Enter name, keyword, method, …"`);

    const peopleLink = getByText(/people/i, { selector: 'nav a *' });
    userEvent.click(peopleLink);
    await waitFor(() =>
      expect(queryByText(/Loading/i)).not.toBeInTheDocument(),
    );

    expect(
      (getByRole('searchbox') as HTMLInputElement).placeholder,
    ).toMatchInlineSnapshot(`"Enter name, keyword, institution, …"`);
  });

  it('preserves only the query text', async () => {
    const { getByText, getByRole } = await renderNetworkPage(
      network({}).teams({}).$,
      '?searchQuery=test123&filter=123',
    );
    const searchBox = getByRole('searchbox') as HTMLInputElement;

    expect(searchBox.value).toEqual('test123');

    const toggle = getByText(/people/i, { selector: 'nav a *' });
    fireEvent.click(toggle);
    expect(searchBox.value).toEqual('test123');
    await waitFor(() => {
      expect(mockUseUsers).toHaveBeenLastCalledWith(
        expect.objectContaining({
          searchQuery: 'test123',
          filters: new Set(),
        }),
      );
    });
  });
});

describe('when toggling from users to teams', () => {
  it('changes the placeholder', async () => {
    const { getByText, queryByText, getByRole } = await renderNetworkPage(
      network({}).users({}).$,
    );

    expect(
      (getByRole('searchbox') as HTMLInputElement).placeholder,
    ).toMatchInlineSnapshot(`"Enter name, keyword, institution, …"`);

    const toggle = getByText(/teams/i, { selector: 'nav a *' });
    fireEvent.click(toggle);
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    expect(
      (getByRole('searchbox') as HTMLInputElement).placeholder,
    ).toMatchInlineSnapshot(`"Enter name, keyword, method, …"`);
  });
  it('preserves only query text', async () => {
    const { getByText, getByRole } = await renderNetworkPage(
      network({}).users({}).$,
      'searchQuery=test123&filter=123',
    );
    const searchBox = getByRole('searchbox') as HTMLInputElement;

    expect(searchBox.value).toEqual('test123');

    const toggle = getByText(/teams/i, { selector: 'nav a *' });
    fireEvent.click(toggle);
    expect(searchBox.value).toEqual('test123');
    await waitFor(() => {
      const [[options]] = mockGetTeams.mock.calls.slice(-1);
      expect(options).toMatchObject({
        searchQuery: 'test123',
        filters: new Set(),
      });
    });
  });
});

it('allows typing in search queries', async () => {
  const { getByRole } = await renderNetworkPage(network({}).users({}).$);
  const searchBox = getByRole('searchbox') as HTMLInputElement;

  userEvent.type(searchBox, 'test123');
  expect(searchBox.value).toEqual('test123');
});

it('allows selection of user filters', async () => {
  const { getByText, getByLabelText } = await renderNetworkPage(
    network({}).users({}).$,
  );

  userEvent.click(getByText('Filters'));
  const checkbox = getByLabelText('Lead PI');
  expect(checkbox).not.toBeChecked();

  userEvent.click(checkbox);
  expect(checkbox).toBeChecked();
  await waitFor(() =>
    expect(mockUseUsers).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filters: new Set(['Lead PI (Core Leadership)']),
      }),
    ),
  );
});

it('allows selection of group filters', async () => {
  const { getByText, getByLabelText } = await renderNetworkPage(
    network({}).groups({}).$,
  );

  userEvent.click(getByText('Filters'));
  const checkbox = getByLabelText('Active');
  expect(checkbox).not.toBeChecked();

  userEvent.click(checkbox);
  expect(checkbox).toBeChecked();
  await waitFor(() =>
    expect(mockGetGroups).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filters: new Set(['Active']),
      }),
      expect.anything(),
    ),
  );
});

it('allows selection of teams filters', async () => {
  const { getByText, getByLabelText } = await renderNetworkPage(
    network({}).teams({}).$,
  );

  userEvent.click(getByText('Filters'));
  const checkbox = getByLabelText('Active');
  expect(checkbox).not.toBeChecked();

  userEvent.click(checkbox);
  expect(checkbox).toBeChecked();
  await waitFor(() =>
    expect(mockGetGroups).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filters: new Set(['Active']),
      }),
      expect.anything(),
    ),
  );
});

it('reads filters from url', async () => {
  const { getByText, getByLabelText } = await renderNetworkPage(
    network({}).users({}).$,
    '?filter=Lead+PI+(Core Leadership)',
  );

  userEvent.click(getByText('Filters'));
  const checkbox = getByLabelText('Lead PI');
  expect(checkbox).toBeChecked();
  await waitFor(() =>
    expect(mockUseUsers).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filters: new Set(['Lead PI (Core Leadership)']),
      }),
    ),
  );
});

it('renders working-group profile page', async () => {
  await renderNetworkPage(
    network({}).workingGroups({}).workingGroup({ workingGroupId: '123' }).$,
  );

  expect(await screen.findByText(/Working Group Description/i)).toBeVisible();
});

it('handles server error nicely for working groups tab', async () => {
  mockGetWorkingGroups.mockRejectedValueOnce(new Error('Failed to fetch'));
  const { getByText } = await renderNetworkPage(
    network({}).workingGroups({}).$,
  );

  await waitFor(() => {
    expect(mockGetWorkingGroups).toHaveBeenCalled();
    expect(getByText(/Something went wrong/i)).toBeVisible();
  });
});
