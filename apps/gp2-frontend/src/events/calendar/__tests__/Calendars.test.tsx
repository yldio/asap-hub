import { gp2 } from '@asap-hub/fixtures';
import {
  render,
  waitForElementToBeRemoved,
  screen,
} from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getCalendars } from '../api';
import Calendars from '../Calendars';

jest.mock('../api');

const renderCalendars = async () => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/events/calendar']}>
              <Calendars />
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

it('renders calendar', async () => {
  const mockGetCalendars = getCalendars as jest.MockedFunction<
    typeof getCalendars
  >;
  mockGetCalendars.mockResolvedValue(gp2.createListCalendarResponse());
  await renderCalendars();
  expect(screen.getByTitle('Calendar')).toBeVisible();
});
