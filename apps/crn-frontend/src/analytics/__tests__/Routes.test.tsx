import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Suspense } from 'react';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { analytics } from '@asap-hub/routing';

import About from '../Routes';
import { getAnalyticsLeadership } from '../api';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';

jest.mock('../api');
mockConsoleError();
afterEach(() => {
  jest.clearAllMocks();
});

const mockGetMemberships = getAnalyticsLeadership as jest.MockedFunction<
  typeof getAnalyticsLeadership
>;

const renderPage = async () => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/analytics']}>
              <Route path={analytics.template}>
                <About />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

describe('Analytics page', () => {
  it('renders the Analytics Page successfully', async () => {
    mockGetMemberships.mockResolvedValueOnce({ items: [], total: 0 });

    await renderPage();
    expect(
      await screen.findByText(/Analytics/i, {
        selector: 'h1',
      }),
    ).toBeInTheDocument();
  });

  it('renders error message when the response is not a 2XX', async () => {
    mockGetMemberships.mockRejectedValue(new Error('Failed to fetch'));

    await renderPage();

    expect(mockGetMemberships).toHaveBeenCalled();
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });
});
