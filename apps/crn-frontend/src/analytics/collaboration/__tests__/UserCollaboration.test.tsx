import { Auth0Provider } from '@asap-hub/crn-frontend/src/auth/test-utils';
import {
  ListUserCollaborationResponse,
  UserCollaborationResponse,
} from '@asap-hub/model';
import { render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { getUserCollaboration } from '../api';
import { analyticsUserCollaborationState } from '../state';
import UserCollaboration from '../UserCollaboration';

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetUserCollaboration = getUserCollaboration as jest.MockedFunction<
  typeof getUserCollaboration
>;

const userTeam: UserCollaborationResponse['teams'][number] = {
  team: 'Team A',
  isTeamInactive: false,
  role: 'Collaborating PI',
  outputsCoAuthoredWithinTeam: 1,
  outputsCoAuthoredAcrossTeams: 2,
};

const data: ListUserCollaborationResponse = {
  total: 2,
  items: [
    {
      id: '1',
      name: 'Ted Mosby',
      isAlumni: false,
      teams: [userTeam],
    },
    {
      id: '2',
      name: 'Robin Scherbatsky',
      isAlumni: false,
      teams: [{ ...userTeam, role: 'Key Personnel' }],
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
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <MemoryRouter initialEntries={['/analytics']}>
            <UserCollaboration type="within-team" />
          </MemoryRouter>
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
  mockGetUserCollaboration.mockResolvedValueOnce(data);

  const { container, getAllByText } = await renderPage();
  expect(container).toHaveTextContent('Ted Mosby');
  expect(container).toHaveTextContent('Collaborating PI');
  expect(container).toHaveTextContent('Robin Scherbatsky');
  expect(container).toHaveTextContent('Key Personnel');
  expect(getAllByText('1')).toHaveLength(3); // one of the 1s is pagination
});
