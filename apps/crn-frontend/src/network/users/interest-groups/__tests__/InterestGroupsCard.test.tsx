import { mockConsoleError } from '@asap-hub/dom-test-utils';
import {
  createListInterestGroupResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import { ErrorBoundary } from '@asap-hub/frontend-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import { ReactNode, Suspense } from 'react';
import { StaticRouter } from 'react-router';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../../../auth/test-utils';
import { getUserInterestGroups } from '../api';
import InterestGroupsCard from '../InterestGroupsCard';

jest.mock('../api');
const mockGetUserInterestGroups = getUserInterestGroups as jest.MockedFunction<
  typeof getUserInterestGroups
>;

mockConsoleError();

const userId = 'u42';

const renderWithWrapper = (children: ReactNode): ReturnType<typeof render> => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <Suspense fallback="loading">
          <Auth0Provider user={{ id: '42' }}>
            <WhenReady>
              <StaticRouter location="/">{children}</StaticRouter>
            </WhenReady>
          </Auth0Provider>
        </Suspense>
      </RecoilRoot>
    </QueryClientProvider>,
  );
};

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
