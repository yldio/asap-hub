import { Suspense } from 'react';
import { User } from '@asap-hub/auth';
import { render, waitFor, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import {
  createDiscoverResponse,
  createPageResponse,
  createUserResponse,
} from '@asap-hub/fixtures';

import Guides from '../Guides';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { refreshDiscoverState } from '../state';
import { getDiscover } from '../api';

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetDiscover = getDiscover as jest.MockedFunction<typeof getDiscover>;

const renderDiscover = async (user: Partial<User>) => {
  const result = render(
    <Suspense fallback="loading">
      <RecoilRoot
        initializeState={({ set }) => {
          set(refreshDiscoverState, Math.random());
        }}
      >
        <Auth0Provider user={user}>
          <WhenReady>
            <Guides />
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

it('renders discover with guidance, about and pages', async () => {
  mockGetDiscover.mockResolvedValue({
    ...createDiscoverResponse(),
    aboutUs: '<h1>About us</h1>',
    pages: [createPageResponse('1'), createPageResponse('2')],
    training: [],
    members: [],
    scientificAdvisoryBoard: [],
  });

  await renderDiscover({});
  expect(screen.getByText(/about/i, { selector: 'h2' })).toBeVisible();
  expect(
    screen.getByText(/Grantee Guidance/i, { selector: 'h2' }),
  ).toBeVisible();
  expect(screen.queryAllByText(/title/i, { selector: 'h4' }).length).toBe(2);
});

it('renders discover with members', async () => {
  mockGetDiscover.mockResolvedValue({
    ...createDiscoverResponse(),
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

  await renderDiscover({});
  expect(screen.getByText('John Doe').closest('a')!.href).toContain('uuid');
  expect(screen.getByText('CEO')).toBeInTheDocument();
  expect(screen.getByText('ASAP')).toBeInTheDocument();
});
it('renders discover with scientific advisory board', async () => {
  mockGetDiscover.mockResolvedValue({
    ...createDiscoverResponse(),
    scientificAdvisoryBoard: [
      {
        ...createUserResponse(),
        id: 'uuid',
        displayName: 'John Doe',
      },
    ],
  });

  await renderDiscover({});
  expect(screen.getByText('John Doe').closest('a')!.href).toContain('uuid');
});
