import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { analytics } from '@asap-hub/routing';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import Engagement from '../Engagement';
import { getEngagement } from '../api';
import { ListEngagementResponse } from '@asap-hub/model';

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
      eventCount: 2,
      totalSpeakerCount: 3,
      uniqueAllRolesCount: 3,
      uniqueKeyPersonnelCount: 2,
    },
  ],
};

const renderPage = async (path: string) => {
  const result = render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[path]}>
              <Route path="/analytics/engagement/">
                <Engagement />
              </Route>
            </MemoryRouter>
            ,
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

    await renderPage(analytics({}).engagement({}).$);

    expect(screen.getAllByText('Representation of Presenters').length).toBe(1);
    expect(screen.getByText('Test Team')).toBeInTheDocument();
  });
});
