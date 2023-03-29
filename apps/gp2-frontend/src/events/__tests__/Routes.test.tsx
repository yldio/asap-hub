import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { gp2 } from '@asap-hub/fixtures';
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
    mockGetEvents.mockResolvedValue(gp2.createListEventResponse(1));
    await renderRoutes();
    expect(screen.getByRole('heading', { name: 'Events' })).toBeInTheDocument();
  });
  it('renders the empty state for the upcoming and the past events', async () => {
    mockGetEvents.mockResolvedValue(gp2.createListEventResponse(0));
    await renderRoutes();

    const upcomingEventsLink = screen.getByRole('link', { name: /upcoming/i });
    const pastEventsLink = screen.getByRole('link', { name: /past/i });

    expect(upcomingEventsLink).toBeVisible();
    expect(pastEventsLink).toBeVisible();

    waitFor(() => {
      userEvent.click(upcomingEventsLink);
      expect(screen.getByText('No upcoming events available')).toBeVisible();
    });

    waitFor(() => {
      userEvent.click(pastEventsLink);
      expect(screen.getByText('No past events available')).toBeVisible();
    });
  });
});
