import { Suspense } from 'react';
import { User } from '@asap-hub/auth';
import { render, waitFor, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { createDiscoverResponse, createNewsResponse } from '@asap-hub/fixtures';

import WorkingGroups from '../WorkingGroups';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { refreshDiscoverState } from '../state';
import { getDiscover } from '../api';

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetDiscover = getDiscover as jest.MockedFunction<typeof getDiscover>;

const renderDiscoverWorkingGroups = async (user: Partial<User>) => {
  const result = render(
    <Suspense fallback="loading">
      <RecoilRoot
        initializeState={({ set }) => {
          set(refreshDiscoverState, Math.random());
        }}
      >
        <Auth0Provider user={user}>
          <WhenReady>
            <WorkingGroups />
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>
    </Suspense>,
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

it('renders tutorial page with an item', async () => {
  mockGetDiscover.mockResolvedValue({
    ...createDiscoverResponse(),
    workingGroups: [{ ...createNewsResponse(1), title: 'Example Title' }],
  });

  await renderDiscoverWorkingGroups({});
  expect(screen.getByText(/Example Title/)).toBeVisible();
});
