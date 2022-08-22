import { Suspense } from 'react';
import { User } from '@asap-hub/auth';
import { render, waitFor, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import {
  createListReminderResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { disable } from '@asap-hub/flags';

import Dashboard from '../Dashboard';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { refreshDashboardState } from '../state';
import { getDashboard, getReminders } from '../api';
import { getUser, patchUser } from '../../network/users/api';
import { refreshUserState } from '../../network/users/state';

jest.mock('../api');
jest.mock('../../events/api');
jest.mock('../../shared-research/api');
jest.mock('../../network/teams/api');
jest.mock('../../network/users/api');

const userResponse = createUserResponse({});
afterEach(() => {
  jest.clearAllMocks();
});
const mockGetDashboard = getDashboard as jest.MockedFunction<
  typeof getDashboard
>;
const mockGetReminders = getReminders as jest.MockedFunction<
  typeof getReminders
>;
const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;
const mockPatchUser = patchUser as jest.MockedFunction<typeof patchUser>;

const renderDashboard = async (user: Partial<User>) => {
  const result = render(
    <MemoryRouter>
      <Suspense fallback="loading">
        <RecoilRoot
          initializeState={({ set }) => {
            set(refreshDashboardState, Math.random());
            set(refreshUserState(userResponse.id), Math.random());
          }}
        >
          <Auth0Provider user={user}>
            <WhenReady>
              <Dashboard />
            </WhenReady>
          </Auth0Provider>
        </RecoilRoot>
      </Suspense>
    </MemoryRouter>,
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

it('renders dashboard header', async () => {
  await renderDashboard({});
  expect(await screen.findByText(/welcome/i, { selector: 'h1' })).toBeVisible();
});

it('renders dashboard with news', async () => {
  mockGetDashboard.mockResolvedValue({
    news: [
      {
        id: '55724942-3408-4ad6-9a73-14b92226ffb6',
        created: '2020-09-07T17:36:54Z',
        title: 'News Title',
        type: 'News',
      },
      {
        id: '55724942-3408-4ad6-9a73-14b92226ffb77',
        created: '2020-09-07T17:36:54Z',
        title: 'Event Title',
        type: 'Event',
      },
    ],
    pages: [],
  });

  await renderDashboard({
    firstName: 'John',
  });
  expect(await screen.findByText(/john/i, { selector: 'h1' })).toBeVisible();
  expect(screen.queryAllByText(/title/i, { selector: 'h4' }).length).toBe(2);
});

it('renders reminders', async () => {
  const reminderResponse = createListReminderResponse(1);

  mockGetReminders.mockResolvedValue({
    ...reminderResponse,
    items: reminderResponse.items.map((reminder) => ({
      ...reminder,
      description: 'Example Reminder',
      entity: 'Event',
    })),
  });

  await renderDashboard({});
  expect(mockGetReminders).toHaveBeenCalled();
  expect(await screen.findByText(/Example Reminder/i)).toBeVisible();
  expect(screen.getByTitle('Event')).toBeInTheDocument();
});

it('does not show getting started with feature flag disabled ((REGRESSION))', async () => {
  disable('GETTING_STARTED');
  mockGetUser.mockResolvedValue({
    ...userResponse,
    dismissedGettingStarted: false,
  });
  await renderDashboard({});

  expect(screen.queryByText(/Get Started with ASAP/i)).toBeNull();
});

it('toggles the not show getting started', async () => {
  mockGetUser.mockResolvedValue({
    ...userResponse,
    dismissedGettingStarted: true,
  });
  await renderDashboard({});
  await waitFor(() =>
    expect(screen.queryByText(/Get Started with ASAP/i)).toBeNull(),
  );
});

it('shows and can dismiss getting started', async () => {
  mockGetUser.mockResolvedValue({
    ...userResponse,
    dismissedGettingStarted: false,
  });
  await renderDashboard({});

  expect(screen.queryByText(/Get Started with ASAP/i)).toBeVisible();
  userEvent.click(screen.getByText(/show/i));

  expect(screen.getByText(/Remove help/i)).toBeVisible();
  expect(screen.getByText(/Cancel/i).closest('a')).toHaveAttribute('href', '/');
  expect(screen.getByTitle('Close').closest('a')).toHaveAttribute('href', '/');

  userEvent.click(screen.getByText('Remove'));

  await waitFor(() => {
    expect(mockPatchUser).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ dismissedGettingStarted: true }),
      expect.anything(),
    );
    expect(screen.queryByText(/Remove help/i)).toBeNull();
  });
});
