import React from 'react';
import {
  render,
  waitForElementToBeRemoved,
  waitFor,
} from '@testing-library/react';
import nock from 'nock';
import { PageResponse } from '@asap-hub/model';
import { createPageResponse } from '@asap-hub/fixtures';

import Content from '../Content';
import { API_BASE_URL } from '../../config';

const page: PageResponse = createPageResponse('1');

describe('content page', () => {
  // fetch user by code request
  beforeEach(() => {
    nock.cleanAll();
    nock(API_BASE_URL).get('/pages/privacy-policy').reply(200, page);
  });

  const renderPage = async () => {
    const result = render(<Content pageId="privacy-policy" />);

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
      await findByText(/text/i, {
        selector: 'h4',
      }),
    ).toBeVisible();
  });

  it('renders the 404 page for missing content', async () => {
    nock.cleanAll();
    nock(API_BASE_URL).get('/pages/privacy-policy').reply(404);

    const { findByText } = await renderPage();
    expect(await findByText(/sorry.+page/i)).toBeVisible();
  });
});
