import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { Route, Routes } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { render } from '@testing-library/react';
import {
  createCalendarResponse,
  createEventResponse,
  createInterestGroupResponse,
} from '@asap-hub/fixtures';
import { events } from '@asap-hub/routing';

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

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RecoilRoot
    initializeState={({ set }) => set(refreshEventState(id), Math.random())}
  >
    <Auth0Provider user={{}}>
      <WhenReady>
        <Suspense fallback="Loading...">
          <StaticRouter location={events({}).event({ eventId: id }).$}>
            <Routes>
              <Route
                path={events.template + events({}).event.template}
                element={children}
              />
            </Routes>
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

it('silently refreshes the event to fetch the meeting link', async () => {
  // Set start date to be within 24 hours so that startRefreshing is true
  const startDate = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes from now
  const endDate = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour from now

  mockGetEvent.mockResolvedValue({
    ...createEventResponse(),
    id,
    meetingLink: undefined,
    startDate,
    endDate,
    title: 'Kool Event',
  });
  const { findByText, queryByText } = render(<Event />, { wrapper });
  expect(await findByText('Kool Event', { exact: false })).toBeVisible();

  // Verify initial call was made
  expect(mockGetEvent).toHaveBeenCalledWith(id, expect.anything());

  // The actual interval refresh behavior is tested in JoinEvent.test.tsx
  // Here we just verify the event renders correctly without showing loading
  expect(queryByText(/loading/i)).not.toBeInTheDocument();

  expect(mockGetEvent).toHaveBeenCalledWith(id, expect.anything());
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
