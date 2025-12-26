import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { render, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createPageResponse } from '@asap-hub/fixtures';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';

import Content from '../Content';
import { getPageByPath } from '../api';

jest.mock('../api');

beforeEach(() => {
  jest.resetAllMocks();
});

const mockGetPageByPath = getPageByPath as jest.MockedFunction<
  typeof getPageByPath
>;

const renderPage = async (pageId: string = 'privacy-notice') => {
  render(
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
    </RecoilRoot>,
  );

  await waitFor(() =>
    expect(screen.queryByText(/auth0/i)).not.toBeInTheDocument(),
  );
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
};

it('renders a page title', async () => {
  // Suppress React 18 warning about state update during render from react-titled
  // react-titled v1.1.1 uses an older React pattern where it updates parent state synchronously
  // during child render (via Context). React 18's strict mode now warns about this because
  // it violates the new concurrent rendering model where render should be "pure" without side effects.
  // Use an alternative (maybe react-helmet-async)
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

  await renderPage('not-a-page');
  expect(await screen.findByText(/sorry.+page/i)).toBeVisible();
  expect(mockGetPageByPath).toHaveBeenCalled();
});
