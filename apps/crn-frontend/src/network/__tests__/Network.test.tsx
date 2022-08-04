import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecoilRoot } from 'recoil';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { network } from '@asap-hub/routing';
import { createListUserResponse } from '@asap-hub/fixtures';

import Network from '../Network';
import { useUsers } from '../users/state';
import { getTeams } from '../teams/api';

jest.mock('../users/state');
jest.mock('../teams/api');
jest.mock('../groups/api');

const mockUseUsers = useUsers as jest.MockedFunction<typeof useUsers>;
const mockGetTeams = getTeams as jest.MockedFunction<typeof getTeams>;

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

it('allows selection of filters', async () => {
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
