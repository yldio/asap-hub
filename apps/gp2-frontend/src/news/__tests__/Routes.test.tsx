import { User } from '@asap-hub/auth';
import { gp2 } from '@asap-hub/fixtures';
import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';

import { getNews } from '../../dashboard/api';
import Routes from '../Routes';

jest.mock('../../dashboard/api');

afterEach(() => {
  jest.resetAllMocks();
});
const mockGetNews = getNews as jest.MockedFunction<typeof getNews>;
const renderNews = async ({ user = {} }: { user?: Partial<User> }) => {
  render(
    <Suspense fallback="loading">
      <RecoilRoot>
        <Auth0Provider user={{ ...user, role: 'Network Collaborator' }}>
          <WhenReady>
            <MemoryRouter initialEntries={['/news']}>
              <Route path="/news">
                <Routes />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>
    </Suspense>,
  );
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
};

describe('Routes', () => {
  it('renders the title', async () => {
    mockGetNews.mockResolvedValue({ items: [], total: 0 });
    await renderNews({});
    expect(screen.getByRole('heading', { name: 'News' })).toBeVisible();
  });

  it('renders a list of news', async () => {
    const mockedNews = gp2.createNewsResponse().items[0]!;
    const news = gp2.createNewsResponse([
      { ...mockedNews, id: '1', title: 'News 1' },
      { ...mockedNews, id: '2', title: 'News 2' },
    ]);

    mockGetNews.mockResolvedValue(news);
    await renderNews({});
    expect(screen.getByText('News 1')).toBeVisible();
    expect(screen.getByText('News 2')).toBeVisible();
  });
});
