import nock from 'nock';
import { RecoilRoot } from 'recoil';
import { Suspense } from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { NewsResponse } from '@asap-hub/model';
import { news } from '@asap-hub/routing';

import News from '../News';
import { API_BASE_URL } from '../../config';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { refreshNewsItemState } from '../state';

const newsOrEvent: NewsResponse = {
  id: '55724942-3408-4ad6-9a73-14b92226ffb6',
  created: '2020-09-07T17:36:54Z',
  title: 'News Title',
  type: 'News',
};

const renderPage = async () => {
  const result = render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(refreshNewsItemState(newsOrEvent.id), Math.random())
      }
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                news({}).article({ articleId: newsOrEvent.id }).$,
              ]}
            >
              <Route path={news.template + news({}).article.template}>
                <News />
              </Route>
            </MemoryRouter>
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

describe('news detail page', () => {
  let nockInterceptor: nock.Interceptor;

  beforeEach(() => {
    nock.cleanAll();
    nockInterceptor = nock(API_BASE_URL, {
      reqheaders: {
        authorization: 'Bearer id_token',
      },
    }).get('/news/55724942-3408-4ad6-9a73-14b92226ffb6');
  });

  it('renders not found when the request returns a 404', async () => {
    nockInterceptor.reply(404);

    const { getByRole } = await renderPage();
    await waitFor(() => nock.isDone());
    expect(getByRole('heading').textContent).toContain(
      'Sorry! We can’t seem to find that page.',
    );
  });

  it('renders title', async () => {
    nockInterceptor.reply(200, newsOrEvent);

    const { getByRole } = await renderPage();
    await waitFor(() => nock.isDone());
    expect(getByRole('heading').textContent).toContain('News Title');
  });
});
