import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import Events from '../Events';

const renderEvents = async () => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{ role: 'Administrator' }}>
          <WhenReady>
            <MemoryRouter initialEntries={['/users/']}>
              <Route path="/users">
                <Events />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};
afterEach(jest.clearAllMocks);

it('renders the events', async () => {
  await renderEvents();
  expect(screen.getByRole('heading', { name: 'Events' })).toBeVisible();
});
