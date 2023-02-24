import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { StaticRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { gp2 } from '@asap-hub/fixtures';
import { events } from '@asap-hub/routing';

import Event from '../Event';
import { getEvent } from '../api';
import { refreshEventState } from '../state';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';

jest.mock('../api');

const id = '42';

const mockGetEvent = getEvent as jest.MockedFunction<typeof getEvent>;
beforeEach(() => {
  mockGetEvent.mockClear();
  mockGetEvent.mockResolvedValue({
    ...gp2.createEventResponse(),
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
    ...gp2.createEventResponse(),
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
