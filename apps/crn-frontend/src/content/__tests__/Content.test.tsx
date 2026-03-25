import { Suspense } from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router';
import { createPageResponse } from '@asap-hub/fixtures';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';

import ContentWithQueryClient, { Content } from '../Content';
import { getPageByPath } from '../api';

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetPageByPath = getPageByPath as jest.MockedFunction<
  typeof getPageByPath
>;

const renderPage = async (pageId: string = 'privacy-notice') => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const result = render(
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <Suspense fallback="loading">
          <Auth0Provider user={{}}>
            <WhenReady>
              <MemoryRouter>
                <Content pageId={pageId} />
              </MemoryRouter>
            </WhenReady>
          </Auth0Provider>
        </Suspense>
      </RecoilRoot>
    </QueryClientProvider>,
  );

  await waitFor(() =>
    expect(result.queryByText(/auth0/i)).not.toBeInTheDocument(),
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

it('renders a page title', async () => {
  // Suppress React 18 warning about state update during render from react-titled
  const consoleErrorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation((message) => {
      if (
        typeof message === 'string' &&
        message.includes(
          "Can't perform a React state update on a component that hasn't mounted yet",
        )
      ) {
        return;
      }
      // eslint-disable-next-line no-console
      console.error(message);
    });

  mockGetPageByPath.mockResolvedValue({
    ...createPageResponse('1'),
    title: 'Example Title',
    text: 'Example Description',
  });
  await renderPage();

  await waitFor(() => {
    expect(
      screen.getByRole('heading', { name: /Example Title/ }),
    ).toBeVisible();
  });
  expect(screen.getByText(/Example Description/)).toBeVisible();
  expect(mockGetPageByPath).toHaveBeenCalled();

  consoleErrorSpy.mockRestore();
});

it('renders the 404 page for missing content', async () => {
  mockGetPageByPath.mockResolvedValue(undefined);

  await renderPage();
  expect(await screen.findByText(/sorry.+page/i)).toBeVisible();
  expect(mockGetPageByPath).toHaveBeenCalled();
});

it('renders using the default export with QueryClient wrapper', async () => {
  mockGetPageByPath.mockResolvedValue(undefined);

  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter>
              <ContentWithQueryClient pageId="test-page" />
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitFor(() =>
    expect(screen.queryByText(/auth0/i)).not.toBeInTheDocument(),
  );
  expect(await screen.findByText(/sorry.+page/i)).toBeVisible();
});
