import { analyticsRoutes } from '@asap-hub/routing';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { ListEngagementResponse } from '@asap-hub/model';
import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getEngagement } from '../api';
import Engagement from '../Engagement';
import { analyticsEngagementState } from '../state';

jest.mock('../api');
mockConsoleError();

afterEach(() => {
  jest.clearAllMocks();
});
const mockGetEngagement = getEngagement as jest.MockedFunction<
  typeof getEngagement
>;

const data: ListEngagementResponse = {
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
      uniqueKeyPersonnelCount: 2,
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
              <Route path="/analytics/engagement/">
                <Engagement />
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

describe('Engagement', () => {
  it('renders with data', async () => {
    mockGetEngagement.mockResolvedValue(data);

    await renderPage(analyticsRoutes.DEFAULT.ENGAGEMENT.path);

    expect(screen.getAllByText('Representation of Presenters').length).toBe(1);
    expect(screen.getByText('Test Team')).toBeInTheDocument();
    expect(screen.getAllByText('1')).toHaveLength(2); // one of the 1s is pagination
    expect(screen.getAllByText('2')).toHaveLength(1);
    expect(screen.getAllByText('3')).toHaveLength(2);
    expect(screen.getAllByText('4')).toHaveLength(1);
  });
});
