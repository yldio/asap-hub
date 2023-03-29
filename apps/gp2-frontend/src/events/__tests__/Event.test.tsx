import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { StaticRouter, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { gp2 } from '@asap-hub/fixtures';
import { events } from '@asap-hub/routing';

import Event from '../Event';
import { getEvent } from '../api';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';

jest.mock('../api');

const id = '42';

const mockGetEvent = getEvent as jest.MockedFunction<typeof getEvent>;
beforeEach(jest.resetAllMocks);

const renderEvent = async () => {
  render(
    <RecoilRoot>
      <Auth0Provider user={{}}>
        <WhenReady>
          <Suspense fallback="Loading...">
            <StaticRouter location={events({}).event({ eventId: id }).$}>
              <Route path={events.template + events({}).event.template}>
                <Event />
              </Route>
            </StaticRouter>
          </Suspense>
        </WhenReady>
      </Auth0Provider>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

it('displays the event with given id', async () => {
  mockGetEvent.mockResolvedValue({
    ...gp2.createEventResponse(),
    id,
    title: 'Kool Event',
  });
  await renderEvent();
  expect(screen.getByText('Kool Event', { exact: false })).toBeVisible();
  expect(mockGetEvent.mock.calls).toEqual([[id, expect.anything()]]);
});

it('generates the back href', async () => {
  mockGetEvent.mockResolvedValue({
    ...gp2.createEventResponse(),
    id,
  });
  await renderEvent();
  expect(screen.getByText(/back/i).closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/events$/),
  );
});

it('falls back to the not found page for a missing event', async () => {
  mockGetEvent.mockResolvedValue(undefined);
  await renderEvent();
  expect(screen.getByText(/sorry.+page/i)).toBeVisible();
});
describe('Event Speakers', () => {
  it('displays the speakers section when there are speakers', async () => {
    mockGetEvent.mockResolvedValue({
      ...gp2.createEventResponse({
        numberOfInternalSpeakers: 1,
        numberOfExternalSpeakers: 0,
        numberOfSpeakersToBeAnnounced: 0,
      }),
      id,
    });
    await renderEvent();
    expect(screen.getAllByText(/Speaker/i)).not.toHaveLength(0);
  });
  it('does not display the speakers section when there are non available', async () => {
    mockGetEvent.mockResolvedValue({
      ...gp2.createEventResponse({
        numberOfInternalSpeakers: 0,
        numberOfExternalSpeakers: 0,
        numberOfSpeakersToBeAnnounced: 0,
      }),
      id,
      title: 'Kool Event',
    });
    await renderEvent();

    expect(screen.queryByText(/Speaker/i)).not.toBeInTheDocument();
  });
});
