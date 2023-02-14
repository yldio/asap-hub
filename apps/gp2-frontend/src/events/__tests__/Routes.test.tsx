import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { createListEventResponse } from '@asap-hub/fixtures';
import { MemoryRouter, Route } from 'react-router-dom';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import Routes from '../Routes';
import { getEvents } from '../api';

jest.mock('../api');

const renderRoutes = async () => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/events']}>
              <Route path="/events">
                <Routes />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  return waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};
beforeEach(() => {
  jest.resetAllMocks();
});

describe('Routes', () => {
  const mockGetEvents = getEvents as jest.MockedFunction<typeof getEvents>;
  it('renders the title', async () => {
    mockGetEvents.mockResolvedValue(createListEventResponse(1));
    await renderRoutes();
    expect(screen.getByRole('heading', { name: 'Events' })).toBeInTheDocument();
  });
});
