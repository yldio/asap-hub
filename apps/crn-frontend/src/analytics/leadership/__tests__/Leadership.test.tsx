import { ListAnalyticsTeamLeadershipResponse } from '@asap-hub/model';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { analytics } from '@asap-hub/routing';

import Leadership from '../Leadership';
import { getAnalyticsLeadership } from '../api';
import { analyticsLeadershipState } from '../state';

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetMemberships = getAnalyticsLeadership as jest.MockedFunction<
  typeof getAnalyticsLeadership
>;

const data: ListAnalyticsTeamLeadershipResponse = {
  total: 2,
  items: [
    {
      id: '1',
      displayName: 'Team 1',
      workingGroupLeadershipRoleCount: 1,
      workingGroupPreviousLeadershipRoleCount: 2,
      workingGroupMemberCount: 3,
      workingGroupPreviousMemberCount: 4,
      interestGroupLeadershipRoleCount: 5,
      interestGroupPreviousLeadershipRoleCount: 6,
      interestGroupMemberCount: 7,
      interestGroupPreviousMemberCount: 8,
    },
    {
      id: '2',
      displayName: 'Team 2',
      workingGroupLeadershipRoleCount: 2,
      workingGroupPreviousLeadershipRoleCount: 3,
      workingGroupMemberCount: 4,
      workingGroupPreviousMemberCount: 5,
      interestGroupLeadershipRoleCount: 4,
      interestGroupPreviousLeadershipRoleCount: 3,
      interestGroupMemberCount: 2,
      interestGroupPreviousMemberCount: 1,
    },
  ],
};

const renderPage = async (
  path = analytics({}).leadership({}).metric({ metric: 'working-group' }).$,
) => {
  const result = render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          analyticsLeadershipState({
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
              <Route path="/analytics/leadership/:metric">
                <Leadership />
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

it('renders with working group data', async () => {
  mockGetMemberships.mockResolvedValueOnce(data);

  await renderPage();
  expect(
    screen.getAllByText('Working Group Leadership & Membership').length,
  ).toBe(2);
});

it('renders with interest group data', async () => {
  mockGetMemberships.mockResolvedValueOnce(data);
  const label = 'Interest Group Leadership & Membership';

  await renderPage();
  const input = screen.getByRole('textbox', { hidden: false });

  userEvent.click(input);
  userEvent.click(screen.getByText(label));

  expect(screen.getAllByText(label).length).toBe(2);
});
