import { Suspense } from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { MemoryRouter, Route, Routes } from 'react-router';
import { createUserResponse } from '@asap-hub/fixtures';
import { DiscoverResponse } from '@asap-hub/model';
import { about } from '@asap-hub/routing';

import About from '../Routes';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getDiscover } from '../api';

jest.mock('../api');
mockConsoleError();
afterEach(() => {
  jest.clearAllMocks();
});

const mockGetDiscover = getDiscover as jest.MockedFunction<typeof getDiscover>;

const props: DiscoverResponse = {
  aboutUs: '',
  members: [],
  scientificAdvisoryBoard: [],
};

const renderPage = async () => {
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/about']}>
              <Routes>
                <Route path={`${about.template}/*`} element={<About />} />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </QueryClientProvider>,
  );
  await waitFor(
    () => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    { timeout: 30_000 },
  );
};

describe('the About page', () => {
  it('renders the About Page successfully', async () => {
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

    await renderPage();
    expect(
      await screen.findByText(/About ASAP/i, {
        selector: 'h1',
      }),
    ).toBeVisible();
  });

  it('renders error message when the response is not a 2XX', async () => {
    mockGetDiscover.mockRejectedValue(new Error('error'));

    await renderPage();
    expect(mockGetDiscover).toHaveBeenCalled();
    expect(await screen.findByText(/Something went wrong/i)).toBeVisible();
  });
});
