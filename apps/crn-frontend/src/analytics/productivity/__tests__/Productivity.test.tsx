import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { analytics } from '@asap-hub/routing';
import { RecoilRoot } from 'recoil';

import Productivity from '../Productivity';

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
      ,
    </RecoilRoot>,
  );

  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );

  return result;
};

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
