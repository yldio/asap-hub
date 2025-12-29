import {
  createTeamManuscriptResponse,
  createTeamResponse,
} from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';
import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode, Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getManuscript, markDiscussionAsRead } from '../api';
import { useManuscriptToast } from '../useManuscriptToast';
import Workspace from '../Workspace';

jest.setTimeout(60000);
jest.mock('../api', () => ({
  getManuscript: jest.fn(),
  markDiscussionAsRead: jest.fn().mockResolvedValue({}),
}));

jest.mock('../useManuscriptToast', () => ({
  useManuscriptToast: jest.fn(),
}));

const id = '42';

const renderWithWrapper = (
  children: ReactNode,
  user = {},
): ReturnType<typeof render> =>
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={user}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                network({}).teams({}).team({ teamId: id }).workspace({}).$,
              ]}
            >
              <Routes>
                <Route
                  path={`${network.template}${network({}).teams.template}${
                    network({}).teams({}).team.template
                  }${
                    network({}).teams({}).team({ teamId: id }).workspace
                      .template
                  }/*`}
                  element={children}
                />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

const mockSetFormType = jest.fn();

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation();
  (useManuscriptToast as jest.Mock).mockImplementation(() => ({
    setFormType: mockSetFormType,
  }));
});

it('should mark discussion as read and remove discussion notification dot', async () => {
  (markDiscussionAsRead as jest.Mock).mockResolvedValue({});
  (getManuscript as jest.Mock).mockResolvedValue({
    ...createTeamManuscriptResponse(),
    discussions: [
      {
        id: 'discussion-id-1',
        read: false,
        title: 'Where does Lorem Ipsum come from?',
        text: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
        lastUpdatedAt: '2025-04-01T15:00:00.000Z',
        createdDate: '2025-03-31T10:00:00.000Z',
        createdBy: {
          alumniSinceDate: undefined,
          avatarUrl: undefined,
          displayName: 'John Doe',
          firstName: 'John',
          id: 'user-id-1',
          lastName: 'Doe',
          teams: [
            {
              id: 'team-id-1',
              name: 'Team 1',
            },
          ],
        },
        replies: [],
      },
    ],
  });

  const screen = renderWithWrapper(
    <Workspace
      team={{
        ...createTeamResponse(),
        id,
        tools: [],
        manuscripts: [createTeamManuscriptResponse()],
      }}
    />,
  );

  await userEvent.click(await screen.findByTestId('collapsible-button'));

  expect(screen.getByTitle('Notification Dot')).toBeInTheDocument();

  await userEvent.click(screen.getByText('Discussions'));
  await act(async () => {
    await userEvent.click(
      await screen.findByTestId(
        'discussion-collapsible-button-discussion-id-1',
      ),
    );
  });

  await waitFor(() => {
    expect(markDiscussionAsRead).toHaveBeenCalledWith(
      'discussion-id-1',
      expect.any(String),
    );
  });

  expect(screen.queryByTitle('Notification Dot')).not.toBeInTheDocument();
});

it('if there are still unread discussions, the notification dot should be shown', async () => {
  (markDiscussionAsRead as jest.Mock).mockResolvedValue({});
  (getManuscript as jest.Mock).mockResolvedValue({
    ...createTeamManuscriptResponse(),
    discussions: [
      {
        id: 'discussion-id-1',
        read: false,
        title: 'Where does Lorem Ipsum come from?',
        text: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
        lastUpdatedAt: '2025-04-01T15:00:00.000Z',
        createdDate: '2025-03-31T10:00:00.000Z',
        createdBy: {
          alumniSinceDate: undefined,
          avatarUrl: undefined,
          displayName: 'John Doe',
          firstName: 'John',
          id: 'user-id-1',
          lastName: 'Doe',
          teams: [
            {
              id: 'team-id-1',
              name: 'Team 1',
            },
          ],
        },
        replies: [],
      },
      {
        id: 'discussion-id-2',
        read: false,
        title: 'Discussion 2',
        text: 'A discussion with a long title',
        lastUpdatedAt: '2025-04-01T15:00:00.000Z',
        createdDate: '2025-03-31T10:00:00.000Z',
        createdBy: {
          alumniSinceDate: undefined,
          avatarUrl: undefined,
          displayName: 'Jane Doe',
          firstName: 'Jane',
          id: 'user-id-2',
          lastName: 'Doe',
          teams: [
            {
              id: 'team-id-2',
              name: 'Team 2',
            },
          ],
        },
        replies: [],
      },
    ],
  });

  const screen = renderWithWrapper(
    <Workspace
      team={{
        ...createTeamResponse(),
        id,
        tools: [],
        manuscripts: [createTeamManuscriptResponse()],
      }}
    />,
  );

  await userEvent.click(await screen.findByTestId('collapsible-button'));

  expect(screen.getByTitle('Notification Dot')).toBeInTheDocument();

  await userEvent.click(screen.getByText('Discussions'));
  await act(async () => {
    await userEvent.click(
      await screen.findByTestId(
        'discussion-collapsible-button-discussion-id-1',
      ),
    );
  });

  await waitFor(() => {
    expect(markDiscussionAsRead).toHaveBeenCalledWith(
      'discussion-id-1',
      expect.any(String),
    );
  });

  expect(screen.getByTitle('Notification Dot')).toBeInTheDocument();
});
