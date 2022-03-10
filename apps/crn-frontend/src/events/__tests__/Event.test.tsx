import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { StaticRouter, Route } from 'react-router-dom';
import { render, act, waitFor } from '@testing-library/react';
import { createEventResponse } from '@asap-hub/fixtures';
import { events } from '@asap-hub/routing';

import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import Event from '../Event';
import { getEvent } from '../api';
import { refreshEventState } from '../state';

jest.useFakeTimers('modern');
jest.mock('../api');

const id = '42';

const mockGetEvent = getEvent as jest.MockedFunction<typeof getEvent>;
beforeEach(() => {
  mockGetEvent.mockClear();
  mockGetEvent.mockResolvedValue({
    ...createEventResponse(),
    id,
  });
});

const wrapper: React.FC = ({ children }) => (
  <RecoilRoot
    initializeState={({ set }) => set(refreshEventState(id), Math.random())}
  >
    <Auth0Provider user={{}}>
      <WhenReady>
        <Suspense fallback="Loading...">
          <StaticRouter location={events({}).event({ eventId: id }).$}>
            <Route path={events.template + events({}).event.template}>
              {children}
            </Route>
          </StaticRouter>
        </Suspense>
      </WhenReady>
    </Auth0Provider>
  </RecoilRoot>
);

it('displays the event with given id', async () => {
  mockGetEvent.mockResolvedValue({
    ...createEventResponse(),
    id,
    title: 'Kool Event',
  });
  const { findByText } = render(<Event />, { wrapper });
  expect(await findByText('Kool Event', { exact: false })).toBeVisible();
  expect(mockGetEvent.mock.calls).toEqual([[id, expect.anything()]]);
});

it('generates the back href', async () => {
  const { findByText } = render(<Event />, { wrapper });
  expect((await findByText(/back/i)).closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/events$/),
  );
});

it('falls back to the not found page for a missing event', async () => {
  mockGetEvent.mockResolvedValue(undefined);
  const { findByText } = render(<Event />, { wrapper });
  expect(await findByText(/sorry.+page/i)).toBeVisible();
});

it('silently refreshes the event to fetch the meeting link', async () => {
  mockGetEvent.mockResolvedValue({
    ...createEventResponse(),
    id,
    meetingLink: undefined,
    startDate: new Date().toISOString(),
    title: 'Kool Event',
  });
  const { getByText, findByText, queryByText } = render(<Event />, { wrapper });
  expect(await findByText('Kool Event', { exact: false })).toBeVisible();

  mockGetEvent.mockResolvedValue({
    ...createEventResponse(),
    id,
    meetingLink: 'https://example.com/meeting',
    startDate: new Date().toISOString(),
    title: 'New Title',
  });
  act(() => {
    jest.advanceTimersByTime(5 * 60 * 1000);
  });

  let hasShownLoading = false;
  await waitFor(() => {
    if (queryByText(/loading/i)) hasShownLoading = true;
    expect(getByText('New Title')).toBeVisible();
  });
  expect(hasShownLoading).toBe(false);
});
