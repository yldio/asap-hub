import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, act, waitFor } from '@testing-library/react';
import {
  createCalendarResponse,
  createEventResponse,
  createInterestGroupResponse,
} from '@asap-hub/fixtures';
import { eventRoutes } from '@asap-hub/routing';

import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import Event from '../Event';
import { getEvent } from '../api';
import { refreshEventState } from '../state';

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

const wrapper: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => (
  <RecoilRoot
    initializeState={({ set }) => set(refreshEventState(id), Math.random())}
  >
    <Auth0Provider user={{}}>
      <WhenReady>
        <Suspense fallback="Loading...">
          <MemoryRouter
            initialEntries={[
              eventRoutes.DEFAULT.DETAILS.buildPath({ eventId: id }),
            ]}
          >
            <Routes>
              <Route
                path={eventRoutes.DEFAULT.DETAILS.relativePath}
                element={children}
              />
            </Routes>
          </MemoryRouter>
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

it('renders tags', async () => {
  mockGetEvent.mockResolvedValue({
    ...createEventResponse(),
    id,
    tags: [
      { id: '1', name: 'Tag 1' },
      { id: '2', name: 'Tag 2' },
    ],
  });
  const { findByText } = render(<Event />, { wrapper });
  expect(await findByText('Tag 1')).toBeVisible();
  expect(await findByText('Tag 2')).toBeVisible();
});

it('renders the speakers list', async () => {
  mockGetEvent.mockResolvedValue({
    ...createEventResponse(),
  });
  const { findByText } = render(<Event />, { wrapper });
  expect(await findByText('Speakers')).toBeVisible();
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

// eslint-disable-next-line jest/no-disabled-tests
it.skip('silently refreshes the event to fetch the meeting link', async () => {
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

it('renders calendar list for active groups', async () => {
  mockGetEvent.mockResolvedValue({
    ...createEventResponse(),
    interestGroup: { ...createInterestGroupResponse(), active: true },
    calendar: { ...createCalendarResponse(), name: 'Event Calendar' },
  });
  const { findByText } = render(<Event />, { wrapper });

  expect(await findByText('Event Calendar')).toBeVisible();
});

it('renders calendar list for events with missing group', async () => {
  mockGetEvent.mockResolvedValue({
    ...createEventResponse(),
    interestGroup: undefined,
    calendar: { ...createCalendarResponse(), name: 'Event Calendar' },
  });
  const { findByText } = render(<Event />, { wrapper });

  expect(await findByText('Event Calendar')).toBeVisible();
});
it('renders continue the event conversation when group with slack provided', async () => {
  mockGetEvent.mockResolvedValue({
    ...createEventResponse(),
    interestGroup: {
      ...createInterestGroupResponse(),
      tools: { slack: 'http://slack.com' },
    },
  });
  const { findByTitle } = render(<Event />, { wrapper });

  expect(await findByTitle(/slack/i)).toBeInTheDocument();
});
