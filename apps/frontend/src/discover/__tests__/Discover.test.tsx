import { Suspense } from 'react';
import { User } from '@asap-hub/auth';
import { render, waitFor, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import {
  createDiscoverResponse,
  createNewsResponse,
  createPageResponse,
  createUserResponse,
} from '@asap-hub/fixtures';

import Discover from '../Discover';
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
            <Discover />
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

it('renders discover header', async () => {
  mockGetDiscover.mockResolvedValue({
    aboutUs: '',
    members: [],
    pages: [],
    training: [],
    scientificAdvisoryBoard: [],
  });

  await renderDiscover({});
  expect(screen.getByText(/discover/i, { selector: 'h1' })).toBeVisible();
});

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
  expect(screen.getByText(/about/i, { selector: 'h1' })).toBeVisible();
  expect(screen.queryAllByText(/title/i, { selector: 'h2' }).length).toBe(2);
});

it('renders discover with training', async () => {
  mockGetDiscover.mockResolvedValue({
    ...createDiscoverResponse(),
    training: [
      {
        ...createNewsResponse('Demo', 'Training'),
        id: 't1',
      },
    ],
  });

  await renderDiscover({});

  expect(
    screen.getByRole('link', { name: 'Training Demo title' }),
  ).toHaveAttribute('href', '/news/t1');
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
