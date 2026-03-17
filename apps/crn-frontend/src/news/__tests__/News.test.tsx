import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route, Routes } from 'react-router';
import { NewsResponse } from '@asap-hub/model';
import { news } from '@asap-hub/routing';

import News from '../News';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getNewsById } from '../api';

jest.mock('../api');

const newsOrEvent: NewsResponse = {
  id: '55724942-3408-4ad6-9a73-14b92226ffb6',
  created: '2020-09-07T17:36:54Z',
  title: 'News Title',
  tags: [],
};

const mockGetNewsById = getNewsById as jest.MockedFunction<typeof getNewsById>;

const renderPage = async () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const result = render(
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                news({}).article({ articleId: newsOrEvent.id }).$,
              ]}
            >
              <Routes>
                <Route
                  path={news.template + news({}).article.template}
                  element={<News />}
                />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
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

describe('news detail page', () => {
  beforeEach(() => {
    mockGetNewsById.mockClear();
  });

  it('renders not found when the request doesnt return a NewsResponse Object', async () => {
    mockGetNewsById.mockResolvedValue(undefined);

    const { getByRole } = await renderPage();
    expect(getByRole('heading').textContent).toContain(
      'Sorry! We can’t seem to find that page.',
    );
  });

  it('renders title', async () => {
    mockGetNewsById.mockResolvedValue(newsOrEvent);

    const { getByRole } = await renderPage();
    expect(getByRole('heading').textContent).toContain('News Title');
  });
});
