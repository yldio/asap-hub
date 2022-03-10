import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { render, waitFor, screen } from '@testing-library/react';
import { PageResponse } from '@asap-hub/model';
import { createPageResponse } from '@asap-hub/fixtures';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';

import Content from '../Content';
import { getPageByPath } from '../api';
import { refreshPageState } from '../state';

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetPageByPath = getPageByPath as jest.MockedFunction<
  typeof getPageByPath
>;

const page: PageResponse = createPageResponse('1');

const renderPage = async (pageId: string = 'privacy-policy') => {
  const result = render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(refreshPageState(page.id), Math.random())
      }
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <Content pageId={pageId} />
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitFor(() =>
    expect(result.queryByText(/auth0/i)).not.toBeInTheDocument(),
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

describe('content page', () => {
  it('renders a page title', async () => {
    mockGetPageByPath.mockResolvedValue(page);
    await renderPage();

    expect(screen.getByRole('heading', { name: /Page 1 text/i })).toBeVisible();
    expect(
      screen.getByRole('heading', { name: /Page 1 title/i }),
    ).toBeVisible();
  });

  it('renders the 404 page for missing content', async () => {
    mockGetPageByPath.mockResolvedValue(undefined);

    await renderPage();
    expect(await screen.findByText(/sorry.+page/i)).toBeVisible();
  });
});
