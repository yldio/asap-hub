import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/frontend/src/auth/test-utils';
import { createListCalendarResponse } from '@asap-hub/fixtures';

import Events from '../Events';
import { refreshCalendarState } from '../state';
import { getCalendars } from '../api';

jest.mock('../api');

const mockGetCalendars = getCalendars as jest.MockedFunction<
  typeof getCalendars
>;

const renderEventsPage = async () => {
  const result = render(
    <RecoilRoot
      initializeState={({ set }) => set(refreshCalendarState, Math.random())}
    >
      <React.Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[{ pathname: '/events' }]}>
              <Route path={'/events'}>
                <Events />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </React.Suspense>
    </RecoilRoot>,
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

describe('the events calendar page', () => {
  it('Renders the events page header', async () => {
    mockGetCalendars.mockResolvedValue(createListCalendarResponse(0));
    const { getByRole } = await renderEventsPage();
    expect(getByRole('heading', { level: 1 }).textContent).toEqual(
      'Calendar and Events',
    );
  });

  it('renders a google calendar iframe', async () => {
    mockGetCalendars.mockResolvedValue(createListCalendarResponse(0));
    const { getByTitle } = await renderEventsPage();
    expect(getByTitle(/calendar/i).tagName).toBe('IFRAME');
  });

  it('Displays a list of calendars', async () => {
    mockGetCalendars.mockResolvedValue({
      ...createListCalendarResponse(2),
      items: createListCalendarResponse(2).items.map((item, index) => ({
        ...item,
        name: `Calendar ${index}`,
      })),
    });
    const { queryAllByRole } = await renderEventsPage();
    expect(queryAllByRole('listitem').map((item) => item.textContent))
      .toMatchInlineSnapshot(`
      Array [
        "●Calendar 0Add to calendar",
        "●Calendar 1Add to calendar",
      ]
    `);
  });
});
