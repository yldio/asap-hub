import React from 'react';
import nock from 'nock';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { ListNewsAndEventsResponse } from '@asap-hub/model';
import { authTestUtils } from '@asap-hub/react-components';

import NewsAndEventsPage from '../Routes';
import { API_BASE_URL } from '../../config';

const newsAndEvents: ListNewsAndEventsResponse = {
  total: 2,
  items: [
    {
      id: '55724942-3408-4ad6-9a73-14b92226ffb6',
      created: '2020-09-07T17:36:54Z',
      title: 'News Title',
      type: 'News',
    },
    {
      id: '55724942-3408-4ad6-9a73-14b92226ffb77',
      created: '2020-09-07T17:36:54Z',
      title: 'Event Title',
      type: 'Event',
    },
  ],
};

const renderPage = async () => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={undefined}>
          <MemoryRouter initialEntries={['/news-and-events']}>
            <Route path="/news-and-events">
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

describe('news and events page', () => {
  let nockInterceptor: nock.Interceptor;

  beforeEach(() => {
    nock.cleanAll();
    nockInterceptor = nock(API_BASE_URL, {
      reqheaders: {
        authorization: 'Bearer token',
      },
    })
      .get('/news-and-events')
      .query(true);
  });

  it('renders title', async () => {
    nockInterceptor.reply(200, newsAndEvents);

    const { container } = await renderPage();

    await waitFor(() => nock.isDone());
    expect(container.textContent).toContain('News Title');
    expect(container.textContent).toContain('Event Title');
  });
});
