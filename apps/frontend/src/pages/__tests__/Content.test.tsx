import React from 'react';
import {
  render,
  waitForElementToBeRemoved,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import nock from 'nock';
import { PageResponse } from '@asap-hub/model';

import ContentPage from '../Content';
import { API_BASE_URL } from '../../config';

const page: PageResponse = {
  title: 'Page Title',
  text: '<h1>Heading</h1>',
  path: '/path',
};

describe('content page', () => {
  // fetch user by code request
  beforeEach(() => {
    nock.cleanAll();
    nock(API_BASE_URL).get('/pages/privacy-policy').reply(200, page);
  });

  const renderPage = async () => {
    const result = render(
      <MemoryRouter initialEntries={['/privacy-policy']}>
        <Route path="/privacy-policy">
          <ContentPage layoutComponent={React.Fragment} />
        </Route>
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(result.queryByText(/auth0/i)).not.toBeInTheDocument(),
    );

    return result;
  };

  it('renders a loading indicator', async () => {
    const { getByText } = await renderPage();

    const loadingIndicator = getByText(/loading/i);
    expect(loadingIndicator).toBeVisible();

    await waitForElementToBeRemoved(loadingIndicator);
  });

  it('renders a page information', async () => {
    const { findByText } = await renderPage();
    expect(
      await findByText(/heading/i, {
        selector: 'h2',
      }),
    ).toBeVisible();
  });
});
