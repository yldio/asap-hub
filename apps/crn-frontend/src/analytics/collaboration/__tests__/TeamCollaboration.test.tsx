import { AlgoliaSearchClient } from '@asap-hub/algolia';
import { ListTeamCollaborationAlgoliaResponse } from '@asap-hub/model';
import { render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { getTeamCollaboration } from '../api';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { analyticsTeamCollaborationState } from '../state';
import TeamCollaboration from '../TeamCollaboration';

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

const mockGetTeamCollaboration = getTeamCollaboration as jest.MockedFunction<
  typeof getTeamCollaboration
>;

const data: ListTeamCollaborationAlgoliaResponse = {
  total: 2,
  items: [
    {
      id: '1',
      name: 'Team One',
      isInactive: false,
      outputsCoProducedWithin: {
        Article: 4,
        Bioinformatics: 5,
        Dataset: 2,
        'Lab Resource': 2,
        Protocol: 0,
      },
      outputsCoProducedAcross: {
        byDocumentType: {
          Article: 0,
          Bioinformatics: 0,
          Dataset: 0,
          'Lab Resource': 0,
          Protocol: 0,
        },
        byTeam: [],
      },
      objectID: '1',
    },
    {
      id: '2',
      name: 'Team Two',
      isInactive: false,
      outputsCoProducedWithin: {
        Article: 0,
        Bioinformatics: 0,
        Dataset: 0,
        'Lab Resource': 0,
        Protocol: 0,
      },
      outputsCoProducedAcross: {
        byDocumentType: {
          Article: 0,
          Bioinformatics: 0,
          Dataset: 0,
          'Lab Resource': 0,
          Protocol: 0,
        },
        byTeam: [],
      },
      objectID: '2',
    },
  ],
};

const renderPage = async () => {
  const result = render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          analyticsTeamCollaborationState({
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
              <TeamCollaboration type="within-team" />
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

it('renders team collaboration data', async () => {
  mockGetTeamCollaboration.mockResolvedValue(data);

  const { container, getAllByText } = await renderPage();
  expect(container).toHaveTextContent('Team One');
  expect(container).toHaveTextContent('Team Two');

  expect(getAllByText('0')).toHaveLength(6);
  expect(getAllByText('4')).toHaveLength(1);
  expect(getAllByText('5')).toHaveLength(1);
  expect(getAllByText('2')).toHaveLength(2);
});
