import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import {
  createListEventResponse,
  createListUserResponse,
  createWorkingGroupResponse,
} from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';
import {
  fireEvent,
  render,
  waitFor,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Network from '../Network';
import { getTeams } from '../teams/api';
import { getGroups } from '../groups/api';
import { useUsers } from '../users/state';
import { getWorkingGroup, getWorkingGroups } from '../working-groups/api';
import { getResearchOutputs } from '../../shared-research/api';
import { getEvents } from '../../events/api';
import { createResearchOutputListAlgoliaResponse } from '../../__fixtures__/algolia';

jest.mock('../users/state', () => ({
  useUsers: jest.fn().mockReturnValue({ items: [], total: 0 }),
}));
jest.mock('../../shared-research/api');

const mockGetResearchOutputs = getResearchOutputs as jest.MockedFunction<
  typeof getResearchOutputs
>;
mockGetResearchOutputs.mockResolvedValue({
  ...createResearchOutputListAlgoliaResponse(1),
});

jest.mock('../teams/api');
jest.mock('../groups/api');
jest.mock('../working-groups/api');
jest.mock('../../events/api');

const mockUseUsers = useUsers as jest.MockedFunction<typeof useUsers>;
const mockGetTeams = getTeams as jest.MockedFunction<typeof getTeams>;
const mockGetGroups = getGroups as jest.MockedFunction<typeof getGroups>;
const mockGetWorkingGroup = getWorkingGroup as jest.MockedFunction<
  typeof getWorkingGroup
>;
const mockGetWorkingGroups = getWorkingGroups as jest.MockedFunction<
  typeof getWorkingGroups
>;
const mockGetWorkingGroupEventsFromAlgolia = getEvents as jest.MockedFunction<
  typeof getEvents
>;

const response = createListEventResponse(7);
mockGetWorkingGroupEventsFromAlgolia.mockResolvedValue(response);

mockUseUsers.mockReturnValue(createListUserResponse(1));

const renderNetworkPage = async (pathname: string, query = '') => {
  render(
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

  await waitForElementToBeRemoved(screen.queryByText(/loading/i), {
    timeout: 30_000,
  });
};

describe('when toggling from teams to users', () => {
  it('changes the placeholder', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    await renderNetworkPage(network({}).teams({}).$);

    expect(
      (screen.getByRole('searchbox') as HTMLInputElement).placeholder,
    ).toMatchInlineSnapshot(`"Enter name, keyword, method, …"`);

    const peopleLink = screen.getByText(/people/i, { selector: 'nav a *' });
    userEvent.click(peopleLink);
    await waitForElementToBeRemoved(screen.queryByText(/loading/i));

    expect(
      (screen.getByRole('searchbox') as HTMLInputElement).placeholder,
    ).toMatchInlineSnapshot(`"Enter name, keyword, institution, …"`);
  });

  it('preserves only the query text', async () => {
    await renderNetworkPage(
      network({}).teams({}).$,
      '?searchQuery=test123&filter=123',
    );
    const searchBox = screen.getByRole('searchbox') as HTMLInputElement;

    expect(searchBox.value).toEqual('test123');

    const toggle = screen.getByText(/people/i, { selector: 'nav a *' });
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
    jest.spyOn(console, 'error').mockImplementation();
    await renderNetworkPage(network({}).users({}).$);

    expect(
      (screen.getByRole('searchbox') as HTMLInputElement).placeholder,
    ).toMatchInlineSnapshot(`"Enter name, keyword, institution, …"`);

    const toggle = screen.getByText(/teams/i, { selector: 'nav a *' });
    fireEvent.click(toggle);

    expect(
      (screen.getByRole('searchbox') as HTMLInputElement).placeholder,
    ).toMatchInlineSnapshot(`"Enter name, keyword, method, …"`);
  });
  it('preserves only query text', async () => {
    await renderNetworkPage(
      network({}).users({}).$,
      'searchQuery=test123&filter=123',
    );
    const searchBox = screen.getByRole('searchbox') as HTMLInputElement;

    expect(searchBox.value).toEqual('test123');

    const toggle = screen.getByText(/teams/i, { selector: 'nav a *' });
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
  jest.spyOn(console, 'error').mockImplementation();
  await renderNetworkPage(network({}).users({}).$);
  const searchBox = screen.getByRole('searchbox') as HTMLInputElement;

  userEvent.type(searchBox, 'test123');
  expect(searchBox.value).toEqual('test123');
});

it('allows selection of user filters', async () => {
  await renderNetworkPage(network({}).users({}).$);

  userEvent.click(screen.getByText('Filters'));
  const checkbox = screen.getByLabelText('Lead PI');
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
  await renderNetworkPage(network({}).groups({}).$);

  userEvent.click(screen.getByText('Filters'));
  const checkbox = screen.getByLabelText('Active');
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

it('allows selection of working group filters', async () => {
  await renderNetworkPage(network({}).workingGroups({}).$);

  userEvent.click(screen.getByText('Filters'));
  const checkbox = screen.getByLabelText('Complete');
  expect(checkbox).not.toBeChecked();

  userEvent.click(checkbox);
  expect(checkbox).toBeChecked();
  await waitFor(() =>
    expect(mockGetWorkingGroups).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filters: new Set(['Complete']),
      }),
      expect.anything(),
    ),
  );
});

it('allows selection of teams filters', async () => {
  await renderNetworkPage(network({}).teams({}).$);

  userEvent.click(screen.getByText('Filters'));
  const checkbox = screen.getByLabelText('Active');
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
  await renderNetworkPage(
    network({}).users({}).$,
    '?filter=Lead+PI+(Core Leadership)',
  );

  userEvent.click(screen.getByText('Filters'));
  const checkbox = screen.getByLabelText('Lead PI');
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
  const workingGroupResponse = createWorkingGroupResponse({});
  mockGetWorkingGroup.mockResolvedValueOnce(workingGroupResponse);
  await renderNetworkPage(
    network({}).workingGroups({}).workingGroup({ workingGroupId: '123' }).$,
  );

  expect(await screen.findByText(/Working Group Description/i)).toBeVisible();
});

it('handles server error for working groups tab', async () => {
  const spy = jest.spyOn(console, 'error').mockImplementation();

  mockGetWorkingGroups.mockRejectedValueOnce(new Error('Failed to fetch'));
  await renderNetworkPage(network({}).workingGroups({}).$);

  await waitFor(() => {
    expect(mockGetWorkingGroups).toHaveBeenCalled();
  });
  expect(screen.getByText(/Something went wrong/i)).toBeVisible();
  await waitFor(() => expect(spy).toHaveBeenCalled());
});
