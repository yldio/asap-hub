import { gp2 as gp2Auth } from '@asap-hub/auth';
import { gp2 } from '@asap-hub/fixtures';
import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import {
  MemoryRouter,
  Route,
  Routes as ReactRouterRoutes,
} from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import {
  createAlgoliaResponse,
  createNewsAlgoliaRecord,
} from '../../__fixtures__/algolia';

import { getAlgoliaNews } from '../api';
import Routes from '../Routes';

jest.mock('../api');

afterEach(() => {
  jest.resetAllMocks();
});

const mockGetNews = getAlgoliaNews as jest.MockedFunction<
  typeof getAlgoliaNews
>;
const renderNews = async ({ user = {} }: { user?: Partial<gp2Auth.User> }) => {
  render(
    <Suspense fallback="loading">
      <RecoilRoot>
        <Auth0Provider user={{ ...user, role: 'Network Collaborator' }}>
          <WhenReady>
            <MemoryRouter initialEntries={['/news']}>
              <ReactRouterRoutes>
                <Route path="/news/*" element={<Routes />} />
              </ReactRouterRoutes>
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
    mockGetNews.mockResolvedValue(createAlgoliaResponse<'news'>([]));
    await renderNews({});
    expect(screen.getByRole('heading', { name: 'News' })).toBeVisible();
  });

  it('renders a list of news', async () => {
    const mockedNews = gp2.createNewsResponse().items[0]!;
    const news = createAlgoliaResponse<'news'>([
      createNewsAlgoliaRecord({ ...mockedNews, id: '1', title: 'News 1' }),
      createNewsAlgoliaRecord({ ...mockedNews, id: '2', title: 'News 2' }),
    ]);

    mockGetNews.mockResolvedValue(news);
    await renderNews({});
    expect(screen.getByText('News 1')).toBeVisible();
    expect(screen.getByText('News 2')).toBeVisible();
  });
});
