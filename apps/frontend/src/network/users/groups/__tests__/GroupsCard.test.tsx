import React from 'react';
import { render, waitFor } from '@testing-library/react';
import {
  createListGroupResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/frontend/src/auth/test-utils';
import { StaticRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { mockConsoleError } from '@asap-hub/dom-test-utils';

import ErrorBoundary from '@asap-hub/frontend/src/structure/ErrorBoundary';
import GroupsCard from '../GroupsCard';
import { getUserGroups } from '../api';
import { refreshUserState } from '../../state';

jest.mock('../api');
const mockGetUserGroups = getUserGroups as jest.MockedFunction<
  typeof getUserGroups
>;

mockConsoleError();

const userId = 'u42';

const wrapper: React.FC<Record<string, never>> = ({ children }) => (
  <RecoilRoot
    initializeState={({ set }) => set(refreshUserState(userId), Math.random())}
  >
    <React.Suspense fallback="loading">
      <Auth0Provider user={{ id: '42' }}>
        <WhenReady>
          <StaticRouter>{children}</StaticRouter>
        </WhenReady>
      </Auth0Provider>
    </React.Suspense>
  </RecoilRoot>
);

it('is not rendered when there are no groups', async () => {
  mockGetUserGroups.mockResolvedValue(createListGroupResponse(0));
  const { queryByText } = render(
    <GroupsCard
      user={{ ...createUserResponse({}, 0), id: userId, firstName: 'test' }}
    />,
    { wrapper },
  );
  await waitFor(() => {
    expect(queryByText(/loading/i)).not.toBeInTheDocument();
  });

  expect(queryByText(/test’ groups/i)).not.toBeInTheDocument();
});

it('is rendered when there are groups', async () => {
  mockGetUserGroups.mockResolvedValue(createListGroupResponse(1));
  const { queryByText } = render(
    <GroupsCard
      user={{ ...createUserResponse({}, 1), id: userId, firstName: 'test' }}
    />,
    { wrapper },
  );
  await waitFor(() => {
    expect(queryByText(/loading/i)).not.toBeInTheDocument();
    expect(queryByText(/test’ groups/i)).toBeInTheDocument();
  });
});

it('throws if the user does not exist', async () => {
  mockGetUserGroups.mockResolvedValue(undefined);
  const errorWrapper: React.FC = ({ children }) =>
    React.createElement(wrapper, {}, <ErrorBoundary>{children}</ErrorBoundary>);
  const { findByText } = render(
    <GroupsCard user={{ ...createUserResponse(), id: userId }} />,
    {
      wrapper: errorWrapper,
    },
  );
  expect(await findByText(/failed.+user.+exist/i)).toBeVisible();
});
