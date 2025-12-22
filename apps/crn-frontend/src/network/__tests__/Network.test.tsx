import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import {
  createListEventResponse,
  createListInterestGroupResponse,
  createListTeamResponse,
  createListUserResponse,
  createWorkingGroupListResponse,
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
import { getAlgoliaTeams } from '../teams/api';
import { getInterestGroups } from '../interest-groups/api';
import { useUsers } from '../users/state';
import { getWorkingGroup, getWorkingGroups } from '../working-groups/api';
import {
  getResearchOutputs,
  getDraftResearchOutputs,
} from '../../shared-research/api';
import { getEvents } from '../../events/api';
import { createResearchOutputListAlgoliaResponse } from '../../__fixtures__/algolia';

jest.mock('../users/state', () => ({
  useUsers: jest.fn().mockReturnValue({ items: [], total: 0 }),
}));
jest.mock('../../shared-state/shared-research', () => ({
  useResearchThemes: jest.fn().mockReturnValue([]),
  useResearchTags: jest.fn().mockReturnValue([]),
  useResourceTypes: jest.fn().mockReturnValue([]),
}));
jest.mock('../../shared-research/api', () => ({
  getResearchOutputs: jest.fn(),
  getDraftResearchOutputs: jest.fn(),
  getResearchThemes: jest.fn().mockResolvedValue([]),
  getResearchTags: jest.fn(),
  getResourceTypes: jest.fn(),
}));

const mockGetResearchOutputs = getResearchOutputs as jest.MockedFunction<
  typeof getResearchOutputs
>;
mockGetResearchOutputs.mockResolvedValue({
  ...createResearchOutputListAlgoliaResponse(1),
});

const mockGetDraftResearchOutputs =
  getDraftResearchOutputs as jest.MockedFunction<
    typeof getDraftResearchOutputs
  >;
mockGetDraftResearchOutputs.mockResolvedValue({
  items: [],
  total: 0,
});

jest.mock('../teams/api');
jest.mock('../interest-groups/api');
jest.mock('../working-groups/api');
jest.mock('../../events/api');

const mockUseUsers = useUsers as jest.MockedFunction<typeof useUsers>;
const mockGetAlgoliaTeams = getAlgoliaTeams as jest.MockedFunction<
  typeof getAlgoliaTeams
>;
const mockGetGroups = getInterestGroups as jest.MockedFunction<
  typeof getInterestGroups
>;
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
mockGetAlgoliaTeams.mockResolvedValue(createListTeamResponse(1));
mockGetGroups.mockResolvedValue(createListInterestGroupResponse(1));
mockGetWorkingGroups.mockResolvedValue(createWorkingGroupListResponse(1));
mockGetWorkingGroup.mockResolvedValue(createWorkingGroupResponse());

const renderNetworkPage = async (pathname: string, query = '') => {
  const { container } = render(
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

  return container;
};

describe.each([
  ['discovery teams', network({}).discoveryTeams({}).$],
  ['resource teams', network({}).resourceTeams({}).$],
] as const)('when toggling from %s to users', (teamType, teamPath) => {
  it('changes the placeholder', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    const container = await renderNetworkPage(teamPath);

    expect(
      (screen.getByRole('searchbox') as HTMLInputElement).placeholder,
    ).toMatchInlineSnapshot(`"Enter name, keyword, method, …"`);

    const peopleLink = screen.getByText(/people/i, { selector: 'nav a *' });
    userEvent.click(peopleLink);
    const animations = container.querySelectorAll('div[class*="animation"]');
    if (animations.length > 0) {
      await waitForElementToBeRemoved(animations[0]);
    }

    expect(
      (screen.getByRole('searchbox') as HTMLInputElement).placeholder,
    ).toMatchInlineSnapshot(`"Enter name, keyword, institution, …"`);
  });

  it('preserves only the query text', async () => {
    await renderNetworkPage(teamPath, '?searchQuery=test123&filter=123');
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

describe.each([
  ['discovery teams', /discovery teams/i],
  ['resource teams', /resource teams/i],
] as const)('when toggling from users to %s', (teamType, linkPattern) => {
  it('changes the placeholder', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    await renderNetworkPage(network({}).users({}).$);

    expect(
      (screen.getByRole('searchbox') as HTMLInputElement).placeholder,
    ).toMatchInlineSnapshot(`"Enter name, keyword, institution, …"`);

    const toggle = screen.getByText(linkPattern, {
      selector: 'nav a *',
    });
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

    const toggle = screen.getByText(linkPattern, {
      selector: 'nav a *',
    });
    fireEvent.click(toggle);
    expect(searchBox.value).toEqual('test123');
    await waitFor(() => {
      expect(mockGetAlgoliaTeams).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({
          searchQuery: 'test123',
          filters: new Set(),
        }),
      );
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
  await renderNetworkPage(network({}).interestGroups({}).$);

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
      expect.anything(),
      expect.objectContaining({
        filters: new Set(['Complete']),
      }),
    ),
  );
});

describe.each([
  ['discovery team', network({}).discoveryTeams({}).$],
  ['resource team', network({}).resourceTeams({}).$],
] as const)('allows selection of %s filters', (teamTypeName, teamPath) => {
  it(`allows selection of ${teamTypeName} filters`, async () => {
    await renderNetworkPage(teamPath);

    userEvent.click(screen.getByText('Filters'));
    const checkbox = screen.getByLabelText('Active');
    expect(checkbox).not.toBeChecked();

    userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    await waitFor(() =>
      expect(mockGetAlgoliaTeams).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({
          filters: new Set(['Active']),
        }),
      ),
    );
  });
});

it('allows toggling between discovery teams and resource teams', async () => {
  await renderNetworkPage(
    network({}).discoveryTeams({}).$,
    '?searchQuery=test123',
  );

  const resourceTeamsLink = screen.getByText(/resource teams/i, {
    selector: 'nav a *',
  });
  fireEvent.click(resourceTeamsLink);

  const searchBox = screen.getByRole('searchbox') as HTMLInputElement;
  expect(searchBox.value).toEqual('test123');

  await waitFor(() => {
    expect(mockGetAlgoliaTeams).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({
        searchQuery: 'test123',
        filters: new Set(),
      }),
    );
  });
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
