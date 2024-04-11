import { Auth0Provider } from '@asap-hub/crn-frontend/src/auth/test-utils';
import {
  ListUserProductivityResponse,
  UserProductivityResponse,
} from '@asap-hub/model';
import { render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { getUserProductivity } from '../api';
import { analyticsUserProductivityState } from '../state';
import UserProductivity from '../UserProductivity';

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetUserProductivity = getUserProductivity as jest.MockedFunction<
  typeof getUserProductivity
>;

const userTeam: UserProductivityResponse['teams'][number] = {
  team: 'Team A',
  isTeamInactive: false,
  isUserInactiveOnTeam: false,
  role: 'Collaborating PI',
};

const data: ListUserProductivityResponse = {
  total: 2,
  items: [
    {
      id: '1',
      name: 'Ted Mosby',
      isAlumni: false,
      teams: [userTeam],
      asapOutput: 3,
      asapPublicOutput: 1,
      ratio: '0.33',
    },
    {
      id: '2',
      name: 'Robin Scherbatsky',
      isAlumni: false,
      teams: [{ ...userTeam, role: 'Key Personnel' }],
      asapOutput: 4,
      asapPublicOutput: 1,
      ratio: '0.25',
    },
  ],
};

const renderPage = async () => {
  const result = render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          analyticsUserProductivityState({
            currentPage: 0,
            pageSize: 10,
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <MemoryRouter initialEntries={['/analytics']}>
            <UserProductivity />
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

it('renders the user productivity data', async () => {
  mockGetUserProductivity.mockResolvedValueOnce(data);

  const { container, getAllByText } = await renderPage();
  expect(container).toHaveTextContent('Ted Mosby');
  expect(container).toHaveTextContent('Collaborating PI');
  expect(container).toHaveTextContent('Robin Scherbatsky');
  expect(container).toHaveTextContent('Key Personnel');
  expect(getAllByText('1')).toHaveLength(3); // one of the 1s is pagination
  expect(getAllByText('3')).toHaveLength(1);
  expect(getAllByText('4')).toHaveLength(1);
  expect(getAllByText('0.33')).toHaveLength(1);
  expect(getAllByText('0.25')).toHaveLength(1);
});
