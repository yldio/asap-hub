import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import PreprintCompliance from '../PreprintCompliance';

jest.mock('../api', () => ({
  getPreprintCompliance: jest.fn().mockResolvedValue({
    items: [],
    total: 0,
  }),
}));

jest.mock('../../../hooks', () => ({
  useAnalytics: () => ({ timeRange: 'all' }),
  usePaginationParams: () => ({ currentPage: 0, pageSize: 10 }),
  usePagination: () => ({ numberOfPages: 1, renderPageHref: jest.fn() }),
  useAnalyticsOpensearch: () => ({
    client: {
      search: jest.fn().mockResolvedValue({ items: [], total: 0 }),
      getTagSuggestions: jest.fn(),
    },
  }),
}));

mockConsoleError();

describe('PreprintCompliance', () => {
  it('renders preprint compliance correctly', () => {
    render(
      <RecoilRoot>
        <Suspense fallback="loading">
          <Auth0Provider user={{}}>
            <WhenReady>
              <PreprintCompliance tags={[]} />
            </WhenReady>
          </Auth0Provider>
        </Suspense>
      </RecoilRoot>,
    );

    expect(screen.getByText('Auth0 loading...')).toBeInTheDocument();
  });
});
