import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Suspense } from 'react';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { analytics } from '@asap-hub/routing';
import { disable, enable } from '@asap-hub/flags';

import Analytics from '../Routes';
import { getAnalyticsLeadership } from '../leadership/api';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';

jest.mock('../leadership/api');
mockConsoleError();
afterEach(() => {
  jest.clearAllMocks();
});

const mockGetAnalyticsLeadership =
  getAnalyticsLeadership as jest.MockedFunction<typeof getAnalyticsLeadership>;

const renderPage = async (path: string) => {
  const { container } = render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[{ pathname: path }]}>
              <Route path={analytics.template}>
                <Analytics />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

  return container;
};

describe('Analytics page', () => {
  it('renders the Analytics Page successfully', async () => {
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'user' }).$,
    );
    expect(
      await screen.findByText(/Analytics/i, {
        selector: 'h1',
      }),
    ).toBeVisible();
  });

  it('redirects to user productivity page when flag is true', async () => {
    enable('DISPLAY_ANALYTICS_PRODUCTIVITY');

    await renderPage(analytics({}).$);

    expect(
      await screen.findByText(/User Productivity/i, {
        selector: 'h3',
      }),
    ).toBeVisible();
  });

  it('redirects to working group page when productivity flag is false', async () => {
    disable('DISPLAY_ANALYTICS_PRODUCTIVITY');
    mockGetAnalyticsLeadership.mockResolvedValueOnce({ items: [], total: 0 });
    await renderPage(analytics({}).$);

    expect(
      await screen.findByText(/Working Group Leadership & Membership/i, {
        selector: 'h3',
      }),
    ).toBeVisible();
  });
});

describe('Productivity', () => {
  it('renders the productivity tab', async () => {
    await renderPage(
      analytics({}).productivity({}).metric({ metric: 'team' }).$,
    );
    expect(
      await screen.findByText(/Analytics/i, {
        selector: 'h1',
      }),
    ).toBeVisible();
  });
});
describe('Leadership & Membership', () => {
  it('renders the Analytics Page successfully', async () => {
    mockGetAnalyticsLeadership.mockResolvedValueOnce({ items: [], total: 0 });

    await renderPage(
      analytics({}).leadership({}).metric({ metric: 'interest-group' }).$,
    );
    expect(
      await screen.findByText(/Analytics/i, {
        selector: 'h1',
      }),
    ).toBeVisible();
  });

  it('renders error message when the response is not a 2XX', async () => {
    mockGetAnalyticsLeadership.mockRejectedValueOnce(
      new Error('Failed to fetch'),
    );
    await renderPage(
      analytics({}).leadership({}).metric({ metric: 'interest-group' }).$,
    );

    await waitFor(() => {
      expect(mockGetAnalyticsLeadership).toHaveBeenCalled();
    });

    expect(screen.getByText(/Something went wrong/i)).toBeVisible();
  });
});
