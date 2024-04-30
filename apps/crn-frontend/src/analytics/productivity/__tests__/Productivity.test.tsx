import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { analytics } from '@asap-hub/routing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getTeamProductivity, getUserProductivity } from '../api';
import Productivity from '../Productivity';

jest.mock('../api');
mockConsoleError();

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetTeamProductivity = getTeamProductivity as jest.MockedFunction<
  typeof getTeamProductivity
>;

const mockGetUserProductivity = getUserProductivity as jest.MockedFunction<
  typeof getUserProductivity
>;

const renderPage = async (
  path = analytics({}).productivity({}).metric({ metric: 'user' }).$,
) => {
  const result = render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[path]}>
              <Route path="/analytics/productivity/:metric">
                <Productivity />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );

  return result;
};

beforeEach(() => {
  mockGetUserProductivity.mockResolvedValue({ items: [], total: 0 });
  mockGetTeamProductivity.mockResolvedValue({ items: [], total: 0 });
});

it('renders with user data', async () => {
  await renderPage();
  expect(screen.getAllByText('User Productivity').length).toBe(2);
});

it('renders with team data', async () => {
  const label = 'Team Productivity';

  await renderPage();
  const input = screen.getByRole('textbox', { hidden: false });

  userEvent.click(input);
  userEvent.click(screen.getByText(label));

  expect(screen.getAllByText(label).length).toBe(2);
});
