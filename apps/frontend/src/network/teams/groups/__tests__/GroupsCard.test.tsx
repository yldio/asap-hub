import React from 'react';
import { RecoilRoot } from 'recoil';
import { StaticRouter } from 'react-router-dom';
import { createGroupResponse } from '@asap-hub/fixtures';
import { render, waitFor } from '@testing-library/react';

import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/frontend/src/auth/test-utils';
import { getTeamGroups } from '../api';
import GroupsCard from '../GroupsCard';
import { refreshTeamState } from '../../state';

jest.mock('../api');

const mockGetTeamGroups = getTeamGroups as jest.MockedFunction<
  typeof getTeamGroups
>;

const id = 't42';

const wrapper: React.FC<Record<string, never>> = ({ children }) => (
  <RecoilRoot
    initializeState={({ set }) => set(refreshTeamState(id), Math.random())}
  >
    <React.Suspense fallback="loading">
      <Auth0Provider user={{ id: 'u42' }}>
        <WhenReady>
          <StaticRouter>{children}</StaticRouter>
        </WhenReady>
      </Auth0Provider>
    </React.Suspense>
  </RecoilRoot>
);

afterEach(() => {
  mockGetTeamGroups.mockClear();
});

it('requests groups for the given team id', async () => {
  render(<GroupsCard id={id} />, { wrapper });
  await waitFor(() =>
    expect(mockGetTeamGroups).toHaveBeenCalledWith(id, expect.anything()),
  );
});

it('render nothing when there are no groups', async () => {
  mockGetTeamGroups.mockResolvedValue({ total: 0, items: [] });
  const { container, queryByText } = render(<GroupsCard id={id} />, {
    wrapper,
  });
  await waitFor(() => expect(container).not.toHaveTextContent(/loading/i));
  expect(queryByText(/team groups/i)).not.toBeInTheDocument();
});

it('renders the card when there are groups', async () => {
  mockGetTeamGroups.mockResolvedValue({
    total: 1,
    items: [{ ...createGroupResponse() }],
  });
  const { findByText } = render(<GroupsCard id={id} />, { wrapper });
  expect(await findByText(/team groups/i)).toBeVisible();
});

it('links to the group', async () => {
  mockGetTeamGroups.mockResolvedValue({
    total: 1,
    items: [{ ...createGroupResponse(), id: 'g1', name: 'Group 1' }],
  });
  const { findByText, getByText } = render(<GroupsCard id={id} />, { wrapper });
  expect(await findByText(/team groups/i)).toBeVisible();
  expect(getByText('Group 1').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/g1$/),
  );
});
