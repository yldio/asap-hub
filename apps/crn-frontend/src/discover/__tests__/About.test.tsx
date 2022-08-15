import { Suspense } from 'react';
import { User } from '@asap-hub/auth';
import { render, waitFor, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { createUserResponse } from '@asap-hub/fixtures';
import { DiscoverResponse } from '@asap-hub/model';

import About from '../About';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { refreshDiscoverState } from '../state';
import { getDiscover } from '../api';

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetDiscover = getDiscover as jest.MockedFunction<typeof getDiscover>;

const props: DiscoverResponse = {
  aboutUs: '',
  members: [],
  pages: [],
  scientificAdvisoryBoard: [],
  training: [],
  workingGroups: [],
};

const renderDiscoverAbout = async (user: Partial<User>) => {
  const result = render(
    <Suspense fallback="loading">
      <RecoilRoot
        initializeState={({ set }) => {
          set(refreshDiscoverState, Math.random());
        }}
      >
        <Auth0Provider user={user}>
          <WhenReady>
            <About />
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

it('renders about with members', async () => {
  mockGetDiscover.mockResolvedValue({
    ...props,
    members: [
      {
        ...createUserResponse(),
        id: 'uuid',
        displayName: 'John Doe',
        jobTitle: 'CEO',
        institution: 'ASAP',
      },
    ],
    scientificAdvisoryBoard: [],
  });

  await renderDiscoverAbout({});
  expect(screen.getByText('John Doe').closest('a')!.href).toContain('uuid');
  expect(screen.getByText('CEO')).toBeInTheDocument();
  expect(screen.getByText('ASAP')).toBeInTheDocument();
});
it('renders about with scientific advisory board', async () => {
  mockGetDiscover.mockResolvedValue({
    ...props,
    scientificAdvisoryBoard: [
      {
        ...createUserResponse(),
        id: 'uuid',
        displayName: 'John Doe',
      },
    ],
  });

  await renderDiscoverAbout({});
  expect(screen.getByText('John Doe').closest('a')!.href).toContain('uuid');
});
