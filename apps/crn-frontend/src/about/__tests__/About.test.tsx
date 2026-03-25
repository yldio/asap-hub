import { Suspense } from 'react';
import { User } from '@asap-hub/auth';
import { render, waitFor, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route, Routes } from 'react-router';
import { createUserResponse } from '@asap-hub/fixtures';
import { DiscoverResponse } from '@asap-hub/model';

import About from '../About';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getDiscover } from '../api';

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetDiscover = getDiscover as jest.MockedFunction<typeof getDiscover>;

const props: DiscoverResponse = {
  aboutUs: '',
  members: [],
  scientificAdvisoryBoard: [],
};

const renderPage = async (user: Partial<User>) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <Suspense fallback="loading">
          <Auth0Provider user={user}>
            <WhenReady>
              <MemoryRouter initialEntries={['/about']}>
                <Routes>
                  <Route path="/about/*" element={<About />} />
                </Routes>
              </MemoryRouter>
            </WhenReady>
          </Auth0Provider>
        </Suspense>
      </RecoilRoot>
    </QueryClientProvider>,
  );
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
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

  await renderPage({});
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

  await renderPage({});
  expect(screen.getByText('John Doe').closest('a')!.href).toContain('uuid');
});
