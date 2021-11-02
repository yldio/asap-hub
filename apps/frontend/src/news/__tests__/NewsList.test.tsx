import nock from 'nock';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { ListNewsResponse } from '@asap-hub/model';
import { authTestUtils } from '@asap-hub/react-components';
import { renderHook } from '@testing-library/react-hooks';
import { createNewsResponse } from '@asap-hub/fixtures';
import { usePagination, usePaginationParams } from '../../hooks';

import NewsAndEventsPage from '../Routes';
import { API_BASE_URL } from '../../config';

const newsAndEvents = (pageSize: number, total: number): ListNewsResponse => ({
  total,
  items: Array.from({ length: pageSize }).map((_, idx) =>
    createNewsResponse(idx + 1),
  ),
});

const renderPage = async () => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={undefined}>
          <MemoryRouter initialEntries={['/news']}>
            <Route path="/news">
              <NewsAndEventsPage />
            </Route>
          </MemoryRouter>
        </authTestUtils.LoggedIn>
      </authTestUtils.WhenReady>
    </authTestUtils.Auth0Provider>,
  );

  await waitFor(() =>
    expect(result.queryByText(/auth0/i)).not.toBeInTheDocument(),
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

describe('news page', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('renders the page title', async () => {
    nock(API_BASE_URL, {
      reqheaders: { authorization: 'Bearer token' },
    })
      .get('/news')
      .query(true)
      .reply(200, newsAndEvents(10, 20));

    const { getByText } = await renderPage();

    expect(getByText('News and Events')).toBeVisible();
  });

  it('renders a counter with the total number of items', async () => {
    const pageSize = 10;
    const numberOfItems = 20;

    nock(API_BASE_URL, {
      reqheaders: { authorization: 'Bearer token' },
    })
      .get('/news')
      .query(true)
      .reply(200, newsAndEvents(pageSize, numberOfItems));

    const { getByText } = await renderPage();

    expect(getByText(`${numberOfItems} results found`)).toBeVisible();
  });

  it('renders a paginated list of news', async () => {
    const pageSize = 5;
    const numberOfItems = 20;
    nock(API_BASE_URL, {
      reqheaders: { authorization: 'Bearer token' },
    })
      .get('/news')
      .query(true)
      .reply(200, newsAndEvents(pageSize, numberOfItems));

    const { result } = renderHook(
      () => ({
        usePaginationParams: usePaginationParams(),
        usePagination: usePagination(numberOfItems, pageSize),
      }),
      {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: [`/news`],
        },
      },
    );

    const { getAllByText } = await renderPage();
    expect(getAllByText('News')).toHaveLength(pageSize);
    expect(result.current.usePagination.numberOfPages).toBe(4);
    expect(result.current.usePaginationParams.currentPage).toBe(0);
  });
});
