import { render, screen } from '@testing-library/react';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { MemoryRouter, Route } from 'react-router-dom';
import { analytics } from '@asap-hub/routing';

import About from '../Routes';
import { getAnalyticsLeadership } from '../api';

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
    <MemoryRouter initialEntries={['/analytics']}>
      <Route path={analytics.template}>
        <About />
      </Route>
    </MemoryRouter>,
  );
};

describe('Analytics page', () => {
  it('renders the Analytics Page successfully', async () => {
    mockGetMemberships.mockResolvedValueOnce({ items: [], total: 0 });

    await renderPage();
    expect(
      await screen.findByText(/Analytics/i, {
        selector: 'h1',
      }),
    ).toBeVisible();
  });
});
