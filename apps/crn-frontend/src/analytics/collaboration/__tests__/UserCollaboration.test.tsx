import {
  ListUserCollaborationAlgoliaResponse,
  UserCollaborationResponse,
} from '@asap-hub/model';
import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { userCollaborationPerformance } from '@asap-hub/fixtures';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { getUserCollaboration, getUserCollaborationPerformance } from '../api';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { analyticsUserCollaborationState } from '../state';
import UserCollaboration from '../UserCollaboration';

jest.mock('@asap-hub/algolia', () => ({
  ...jest.requireActual('@asap-hub/algolia'),
  algoliaSearchClientFactory: jest
    .fn()
    .mockReturnValue({} as AlgoliaSearchClient<'analytics'>),
}));

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetUserCollaboration = getUserCollaboration as jest.MockedFunction<
  typeof getUserCollaboration
>;

const mockGetUserCollaborationPerformance =
  getUserCollaborationPerformance as jest.MockedFunction<
    typeof getUserCollaborationPerformance
  >;
mockGetUserCollaborationPerformance.mockResolvedValue(
  userCollaborationPerformance,
);

const mockAlgoliaSearchClientFactory =
  algoliaSearchClientFactory as jest.MockedFunction<
    typeof algoliaSearchClientFactory
  >;

const mockSetSort = jest.fn();

const userTeam: UserCollaborationResponse['teams'][number] = {
  id: '1',
  team: 'Team A',
  teamInactiveSince: undefined,
  role: 'Collaborating PI',
  outputsCoAuthoredWithinTeam: 1,
  outputsCoAuthoredAcrossTeams: 2,
};

const data: ListUserCollaborationAlgoliaResponse = {
  total: 2,
  items: [
    {
      id: '1',
      name: 'Ted Mosby',
      alumniSince: undefined,
      teams: [userTeam],
      totalUniqueOutputsCoAuthoredAcrossTeams: 2,
      totalUniqueOutputsCoAuthoredWithinTeam: 1,
      objectID: '1',
    },
    {
      id: '2',
      name: 'Robin Scherbatsky',
      alumniSince: undefined,
      teams: [{ ...userTeam, role: 'Key Personnel' }],
      totalUniqueOutputsCoAuthoredAcrossTeams: 2,
      totalUniqueOutputsCoAuthoredWithinTeam: 1,
      objectID: '2',
    },
  ],
};

const renderPage = async () => {
  const result = render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          analyticsUserCollaborationState({
            currentPage: 0,
            pageSize: 10,
            timeRange: '30d',
            tags: [],
            sort: 'user_asc',
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/analytics']}>
              <UserCollaboration
                type="within-team"
                tags={[]}
                setSort={mockSetSort}
                sort={'user_asc'}
              />
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

it('renders the user collaboration data', async () => {
  mockGetUserCollaboration.mockResolvedValue(data);

  const { container, getAllByText } = await renderPage();
  expect(container).toHaveTextContent('Ted Mosby');
  expect(container).toHaveTextContent('Collaborating PI');
  expect(container).toHaveTextContent('Robin Scherbatsky');
  expect(container).toHaveTextContent('Key Personnel');
  expect(getAllByText('1')).toHaveLength(3); // one of the 1s is pagination
});

it('calls algolia client with the right index name', async () => {
  mockGetUserCollaboration.mockResolvedValue(data);
  mockGetUserCollaborationPerformance.mockResolvedValue(
    userCollaborationPerformance,
  );

  const { getByTitle } = await renderPage();

  await waitFor(() => {
    expect(mockAlgoliaSearchClientFactory).toHaveBeenLastCalledWith(
      expect.objectContaining({
        algoliaIndex: expect.not.stringContaining('_user_desc'),
      }),
    );
  });

  userEvent.click(getByTitle('User Active Alphabetical Ascending Sort Icon'));
  expect(mockSetSort).toHaveBeenCalledWith('user_desc');
});
