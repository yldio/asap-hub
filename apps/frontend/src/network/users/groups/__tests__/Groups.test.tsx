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

import UserGroups from '../Groups';
import { getUserGroups } from '../api';

jest.mock('../api');

const mockGetUserGroups = getUserGroups as jest.MockedFunction<
  typeof getUserGroups
>;

const wrapper: React.FC<Record<string, never>> = ({ children }) => (
  <RecoilRoot>
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
    <UserGroups user={{ ...createUserResponse({}, 0), firstName: 'test' }} />,
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
    <UserGroups user={{ ...createUserResponse({}, 1), firstName: 'test' }} />,
    { wrapper },
  );
  await waitFor(() => {
    expect(queryByText(/loading/i)).not.toBeInTheDocument();
    expect(queryByText(/test’ groups/i)).toBeInTheDocument();
  });
});
