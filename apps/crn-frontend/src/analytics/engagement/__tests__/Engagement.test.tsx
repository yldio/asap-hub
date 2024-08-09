import { analyticsRoutes } from '@asap-hub/routing';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { ListEngagementResponse } from '@asap-hub/model';
import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { ListEngagementAlgoliaResponse } from '@asap-hub/model';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getEngagement } from '../api';
import Engagement from '../Engagement';
import { analyticsEngagementState } from '../state';

jest.mock('../api');
mockConsoleError();

jest.mock('@asap-hub/algolia', () => ({
  ...jest.requireActual('@asap-hub/algolia'),
  algoliaSearchClientFactory: jest
    .fn()
    .mockReturnValue({} as AlgoliaSearchClient<'crn'>),
}));

afterEach(() => {
  jest.clearAllMocks();
});

const mockAlgoliaSearchClientFactory =
  algoliaSearchClientFactory as jest.MockedFunction<
    typeof algoliaSearchClientFactory
  >;

const mockGetEngagement = getEngagement as jest.MockedFunction<
  typeof getEngagement
>;

const data: ListEngagementAlgoliaResponse = {
  total: 1,
  items: [
    {
      id: '1',
      name: 'Test Team',
      inactiveSince: null,
      memberCount: 1,
      eventCount: 4,
      totalSpeakerCount: 3,
      uniqueAllRolesCount: 3,
      uniqueAllRolesCountPercentage: 100,
      uniqueKeyPersonnelCount: 2,
      uniqueKeyPersonnelCountPercentage: 67,
      objectID: 'engagement-algolia-id',
    },
  ],
};

const renderPage = async (path: string) => {
  const result = render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          analyticsEngagementState({
            currentPage: 0,
            pageSize: 10,
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[path]}>
              <Routes>
                <Route
                  path="/analytics/engagement/"
                  element={<Engagement />}
                ></Route>
              </Routes>
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

describe('Engagement', () => {
  it('renders with data', async () => {
    mockGetEngagement.mockResolvedValue(data);

    await renderPage(analyticsRoutes.DEFAULT.ENGAGEMENT.buildPath({}));

    expect(screen.getAllByText('Representation of Presenters').length).toBe(1);
    expect(screen.getByText('Test Team')).toBeInTheDocument();
    expect(screen.getAllByText('1')).toHaveLength(2); // one of the 1s is pagination
    expect(screen.getAllByText('2 (67%)')).toHaveLength(1);
    expect(screen.getAllByText('3')).toHaveLength(1);
    expect(screen.getAllByText('3 (100%)')).toHaveLength(1);
    expect(screen.getAllByText('4')).toHaveLength(1);
  });

  it('calls algolia client with the right index name', async () => {
    mockGetEngagement.mockResolvedValue(data);

    await renderPage(analyticsRoutes.DEFAULT.ENGAGEMENT.buildPath({}));

    await waitFor(() => {
      expect(mockAlgoliaSearchClientFactory).toHaveBeenLastCalledWith(
        expect.objectContaining({
          algoliaIndex: expect.not.stringContaining('_team_desc'),
        }),
      );
    });

    userEvent.click(
      screen.getByTitle('Active Alphabetical Ascending Sort Icon'),
    );

    await waitFor(() => {
      expect(mockAlgoliaSearchClientFactory).toHaveBeenLastCalledWith(
        expect.objectContaining({
          algoliaIndex: expect.stringContaining('_team_desc'),
        }),
      );
    });
  });
});
