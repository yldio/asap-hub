import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { ListTeamProductivityAlgoliaResponse } from '@asap-hub/model';
import { render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { getTeamProductivity } from '../api';
import { analyticsTeamProductivityState } from '../state';
import TeamProductivity from '../TeamProductivity';

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetTeamProductivity = getTeamProductivity as jest.MockedFunction<
  typeof getTeamProductivity
>;

const data: ListTeamProductivityAlgoliaResponse = {
  total: 2,
  items: [
    {
      id: '1',
      objectID: '1-team-productivity-30d',
      name: 'Team Alessi',
      isInactive: false,
      Article: 1,
      Bioinformatics: 2,
      Dataset: 3,
      'Lab Resource': 4,
      Protocol: 5,
    },
    {
      id: '2',
      objectID: '1-user-productivity-30d',
      name: 'Team De Camilli',
      isInactive: false,
      Article: 0,
      Bioinformatics: 0,
      Dataset: 2,
      'Lab Resource': 0,
      Protocol: 1,
    },
  ],
};

const renderPage = async () => {
  const result = render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          analyticsTeamProductivityState({
            currentPage: 0,
            pageSize: 10,
            timeRange: '30d',
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/analytics']}>
              <TeamProductivity />
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

it('renders the team productivity data', async () => {
  mockGetTeamProductivity.mockResolvedValueOnce(data);

  const { container, getAllByText } = await renderPage();
  expect(container).toHaveTextContent('Team Alessi');
  expect(container).toHaveTextContent('Team De Camilli');
  expect(getAllByText('0')).toHaveLength(3);
  expect(getAllByText('1')).toHaveLength(3); // one of the 1s is pagination
  expect(getAllByText('2')).toHaveLength(2);
  expect(getAllByText('3')).toHaveLength(1);
  expect(getAllByText('4')).toHaveLength(1);
  expect(getAllByText('5')).toHaveLength(1);
});
