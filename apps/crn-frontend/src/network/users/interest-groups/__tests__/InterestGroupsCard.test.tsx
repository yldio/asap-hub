import { ReactNode, Suspense } from 'react';
import { render, waitFor } from '@testing-library/react';
import {
  createListInterestGroupResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import { ErrorBoundary } from '@asap-hub/frontend-utils';

import { StaticRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { mockConsoleError } from '@asap-hub/dom-test-utils';

import { Auth0Provider, WhenReady } from '../../../../auth/test-utils';
import InterestGroupsCard from '../InterestGroupsCard';
import { getUserInterestGroups } from '../api';
import { userInterestGroupsState } from '../state';

jest.mock('../api');
const mockGetUserInterestGroups = getUserInterestGroups as jest.MockedFunction<
  typeof getUserInterestGroups
>;

mockConsoleError();

const userId = 'u42';

const renderWithWrapper = (children: ReactNode): ReturnType<typeof render> =>
  render(
    <RecoilRoot
      initializeState={({ reset }) => reset(userInterestGroupsState(userId))}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{ id: '42' }}>
          <WhenReady>
            <StaticRouter>{children}</StaticRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

it('is not rendered when there are no groups', async () => {
  mockGetUserInterestGroups.mockResolvedValue(
    createListInterestGroupResponse(0),
  );
  const { queryByText } = renderWithWrapper(
    <InterestGroupsCard
      user={{ ...createUserResponse({}, 0), id: userId, firstName: 'test' }}
    />,
  );
  await waitFor(() => {
    expect(queryByText(/loading/i)).not.toBeInTheDocument();
  });

  expect(
    queryByText(/interest-groups/i, { selector: 'h3' }),
  ).not.toBeInTheDocument();
});

it('is rendered when there are groups', async () => {
  mockGetUserInterestGroups.mockResolvedValue(
    createListInterestGroupResponse(1),
  );
  const { queryByText } = renderWithWrapper(
    <InterestGroupsCard
      user={{ ...createUserResponse({}, 1), id: userId, firstName: 'test' }}
    />,
  );
  await waitFor(() => {
    expect(queryByText(/loading/i)).not.toBeInTheDocument();
    expect(queryByText(/groups/i, { selector: 'h3' })).toBeInTheDocument();
  });
});

it('throws if the user does not exist', async () => {
  mockGetUserInterestGroups.mockResolvedValue(undefined);
  const { findByText } = renderWithWrapper(
    <ErrorBoundary>
      <InterestGroupsCard user={{ ...createUserResponse(), id: userId }} />
    </ErrorBoundary>,
  );
  expect(await findByText(/failed.+user.+exist/i)).toBeVisible();
});
