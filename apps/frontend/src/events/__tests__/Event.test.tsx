import React, { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { StaticRouter, Route } from 'react-router-dom';
import { render, act } from '@testing-library/react';
import { createEventResponse, createGroupResponse } from '@asap-hub/fixtures';

import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/frontend/src/auth/test-utils';
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
    <StaticRouter location={`/${id}`}>
      <Auth0Provider user={{}}>
        <WhenReady>
          <Suspense fallback="Loading...">
            <Route path="/:id">{children}</Route>
          </Suspense>
        </WhenReady>
      </Auth0Provider>
    </StaticRouter>
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

it('generates the group hrefs', async () => {
  mockGetEvent.mockResolvedValue({
    ...createEventResponse(),
    id,
    groups: [{ ...createGroupResponse(), id: 'grp42', name: 'Kool Group' }],
  });
  const { findByText } = render(<Event />, { wrapper });
  expect((await findByText('Kool Group')).closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/grp42$/),
  );
});

it('falls back to the not found page for a missing event', async () => {
  mockGetEvent.mockResolvedValue(undefined);
  const { findByText } = render(<Event />, { wrapper });
  expect(await findByText(/sorry.+page/i)).toBeVisible();
});

it('refreshes the event to fetch the meeting link', async () => {
  mockGetEvent.mockResolvedValue({
    ...createEventResponse(),
    id,
    meetingLink: undefined,
    startDate: new Date().toISOString(),
    title: 'Kool Event',
  });
  const { findByText } = render(<Event />, { wrapper });
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
  expect(await findByText('New Title', { exact: false })).toBeVisible();
});
