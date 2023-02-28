import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { render, waitFor, screen } from '@testing-library/react';
import { createPageResponse } from '@asap-hub/fixtures';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';

import Content from '../Content';
import { getPageByPath } from '../api';

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetPageByPath = getPageByPath as jest.MockedFunction<
  typeof getPageByPath
>;

const renderPage = async (pageId: string = 'privacy-policy') => {
  const result = render(
    <RecoilRoot>
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

it('renders a page title', async () => {
  mockGetPageByPath.mockResolvedValue({
    ...createPageResponse('1'),
    title: 'Example Title',
    text: 'Example Description',
  });
  await renderPage();

  expect(screen.getByRole('heading', { name: /Example Title/ })).toBeVisible();
  expect(screen.getByText(/Example Description/)).toBeVisible();
  expect(mockGetPageByPath).toHaveBeenCalled();
});

it('renders the 404 page for missing content', async () => {
  mockGetPageByPath.mockResolvedValue(undefined);

  await renderPage();
  expect(await screen.findByText(/sorry.+page/i)).toBeVisible();
  expect(mockGetPageByPath).toHaveBeenCalled();
});
