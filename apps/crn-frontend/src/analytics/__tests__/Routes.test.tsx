import { render, screen } from '@testing-library/react';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { MemoryRouter, Route } from 'react-router-dom';
import { analytics } from '@asap-hub/routing';

import About from '../Routes';
import { getMemberships } from '../api';

jest.mock('../api');
mockConsoleError();
afterEach(() => {
  jest.clearAllMocks();
});

const mockGetMemberships = getMemberships as jest.MockedFunction<
  typeof getMemberships
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
    mockGetMemberships.mockReturnValue([]);

    await renderPage();
    expect(
      await screen.findByText(/Analytics/i, {
        selector: 'h1',
      }),
    ).toBeVisible();
  });
});
