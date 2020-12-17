import React, { ContextType } from 'react';
import { RecoilRoot } from 'recoil';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { createUserResponse, createUserTeams } from '@asap-hub/fixtures';
import { UserResponse } from '@asap-hub/model';
import { ToastContext } from '@asap-hub/react-context';
import userEvent from '@testing-library/user-event';
import { readFileSync } from 'fs';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/frontend/src/auth/test-utils';
import { join } from 'path';
import imageCompression from 'browser-image-compression';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { Auth0User, Auth0 } from '@asap-hub/auth';

import UserProfile from '../UserProfile';
import { getUser, patchUser, postUserAvatar } from '../api';
import { refreshUserState } from '../state';

jest.mock('../api');
jest.mock('browser-image-compression');

const imageCompressionMock = imageCompression as jest.MockedFunction<
  typeof imageCompression
>;
imageCompressionMock.getDataUrlFromFile = jest.requireActual(
  'browser-image-compression',
).getDataUrlFromFile;

const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;
const mockPatchUser = patchUser as jest.MockedFunction<typeof patchUser>;
const mockPostUserAvatar = postUserAvatar as jest.MockedFunction<
  typeof postUserAvatar
>;
const standardMockPatchUser = mockPatchUser.getMockImplementation() as typeof patchUser;
const standardMockPostUserAvatar = mockPostUserAvatar.getMockImplementation() as typeof postUserAvatar;

const mockToast = jest.fn() as jest.MockedFunction<
  ContextType<typeof ToastContext>
>;

const renderUserProfile = async (
  userResponse = createUserResponse(),
  { ownUserId = userResponse.id, routeProfileId = userResponse.id } = {},
  auth0Overrides?: (
    auth0Client?: Auth0Client,
    auth0User?: Auth0User,
  ) => Partial<Auth0>,
) => {
  mockGetUser.mockImplementation(async (id) => {
    return id === userResponse.id ? userResponse : undefined;
  });
  mockPatchUser.mockImplementation(async (id, ...args) => {
    if (id === userResponse.id) return standardMockPatchUser(id, ...args);
    throw new Error('404');
  });
  mockPostUserAvatar.mockImplementation(async (id, ...args) => {
    if (id === userResponse.id) return standardMockPostUserAvatar(id, ...args);
    throw new Error('404');
  });

  mockToast.mockClear();

  const result = render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshUserState(userResponse.id), Math.random());
      }}
    >
      <React.Suspense fallback="loading">
        <ToastContext.Provider value={mockToast}>
          <Auth0Provider
            user={{ id: ownUserId }}
            auth0Overrides={auth0Overrides}
          >
            <WhenReady>
              <MemoryRouter initialEntries={[`/${routeProfileId}/`]}>
                <Route path="/:id" component={UserProfile} />
              </MemoryRouter>
            </WhenReady>
          </Auth0Provider>
        </ToastContext.Provider>
      </React.Suspense>
    </RecoilRoot>,
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

it('renders the personal info', async () => {
  const { findByText } = await renderUserProfile({
    ...createUserResponse(),
    displayName: 'Someone',
  });
  expect((await findByText('Someone')).tagName).toBe('H1');
});

it('by default renders the research tab', async () => {
  const { findByText } = await renderUserProfile({
    ...createUserResponse(),
    questions: ['What?'],
  });
  expect(await findByText('What?')).toBeVisible();
});

it('navigates to the background tab', async () => {
  const { findByText } = await renderUserProfile({
    ...createUserResponse(),
    biography: 'My Bio',
  });

  userEvent.click(await findByText(/background/i, { selector: 'nav *' }));
  expect(await findByText('My Bio')).toBeVisible();
});

it('navigates to the outputs tab', async () => {
  const { findByText } = await renderUserProfile(createUserResponse());

  userEvent.click(await findByText(/output/i, { selector: 'nav *' }));
  expect(await findByText(/research.+outputs/i)).toBeVisible();
});

it("links to the user's team", async () => {
  const { findByText } = await renderUserProfile({
    ...createUserResponse(),
    teams: [
      {
        ...createUserTeams({ teams: 1 })[0],
        id: '42',
        displayName: 'Kool Krew',
      },
    ],
  });
  expect(
    (
      await findByText('Kool Krew', { exact: false, selector: 'h2 ~ * *' })
    ).closest('a')!.href,
  ).toContain('42');
});

it("links to the user's team proposal", async () => {
  const { findByText } = await renderUserProfile({
    ...createUserResponse(),
    teams: [
      {
        ...createUserTeams({ teams: 1 })[0],
        proposal: '1337',
      },
    ],
  });
  expect((await findByText(/proposal/i)).closest('a')!.href).toContain('1337');
});
it('does not show a proposal for a user whose team has none', async () => {
  const { queryByText } = await renderUserProfile({
    ...createUserResponse(),
    teams: [
      {
        ...createUserTeams({ teams: 1 })[0],
        proposal: undefined,
      },
    ],
  });
  await waitFor(() => expect(queryByText(/loading/i)).not.toBeInTheDocument());

  expect(queryByText(/proposal/i)).not.toBeInTheDocument();
});

it('renders the 404 page for a missing user', async () => {
  const { findByText } = await renderUserProfile(
    {
      ...createUserResponse(),
      id: '42',
    },
    { routeProfileId: '1337' },
  );
  expect(await findByText(/sorry.+page/i)).toBeVisible();
});

describe('a header edit button', () => {
  it("is not rendered on someone else's profile", async () => {
    const { queryByText, queryByLabelText } = await renderUserProfile(
      { ...createUserResponse(), id: '42' },
      { ownUserId: '1337' },
    );
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    expect(queryByLabelText(/edit/i)).not.toBeInTheDocument();
  });
  it('is not rendered on your own staff profile', async () => {
    const { queryByText, queryByLabelText } = await renderUserProfile({
      ...createUserResponse(),
      role: 'Staff',
    });
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    expect(queryByLabelText(/edit/i)).not.toBeInTheDocument();
  });

  it('is rendered for personal info on your own profile', async () => {
    const { findByLabelText } = await renderUserProfile();
    expect(await findByLabelText(/edit.+personal/i)).toBeVisible();
  });

  it('is rendered for contact info on your own profile', async () => {
    const { findByLabelText } = await renderUserProfile();
    expect(await findByLabelText(/edit.+contact/i)).toBeVisible();
  });

  it('is rendered for avatar on your own profile', async () => {
    const { findByLabelText } = await renderUserProfile();
    expect(await findByLabelText(/edit.+avatar/i)).toBeVisible();
  });

  it('can change personal info', async () => {
    const userProfile: UserResponse = {
      ...createUserResponse(),
      location: 'York',
      id: '42',
    };

    const {
      getByText,
      findByText,
      findByLabelText,
      findByDisplayValue,
    } = await renderUserProfile(userProfile);

    userEvent.click(await findByLabelText(/edit.+personal/i));
    await userEvent.type(await findByDisplayValue('York'), 'shire');
    expect(await findByDisplayValue('Yorkshire')).toBeVisible();

    userEvent.click(getByText(/save/i));
    expect(await findByText('Yorkshire')).toBeVisible();
    expect(mockPatchUser).toHaveBeenLastCalledWith(
      '42',
      expect.objectContaining({ location: 'Yorkshire' }),
      expect.any(String),
    );
  });

  it('can change contact info', async () => {
    const userProfile: UserResponse = {
      ...createUserResponse(),
      contactEmail: 'contact@example.com',
      id: '42',
    };
    const {
      getByText,
      findByText,
      findByLabelText,
      findByDisplayValue,
    } = await renderUserProfile(userProfile);

    userEvent.click(await findByLabelText(/edit.+contact/i));
    await userEvent.type(await findByDisplayValue('contact@example.com'), 'm');
    expect(await findByDisplayValue('contact@example.comm')).toBeVisible();

    userEvent.click(getByText(/save/i));
    expect(
      (await findByText(/contact/i, { selector: 'header *' })).closest('a'),
    ).toHaveAttribute('href', 'mailto:contact@example.comm');
    expect(mockPatchUser).toHaveBeenLastCalledWith(
      '42',
      expect.objectContaining({
        contactEmail: 'contact@example.comm',
      }),
      expect.any(String),
    );
  });

  it('refreshes auth0 id token', async () => {
    const userProfile: UserResponse = {
      ...createUserResponse(),
    };
    const mockToken = jest.fn().mockResolvedValue('token');
    const { getByText, findByLabelText } = await renderUserProfile(
      userProfile,
      {},
      (authClient, user) => ({
        getTokenSilently:
          authClient && user
            ? mockToken
            : () => {
                throw new Error('Not Ready');
              },
      }),
    );
    userEvent.click(await findByLabelText(/edit.+contact/i));

    userEvent.click(getByText(/save/i));
    await waitFor(() => expect(mockToken).toHaveBeenCalled());
  });

  describe('for the avatar', () => {
    const fileBuffer = readFileSync(join(__dirname, 'jpeg.jpg'));
    const file = new File([new Uint8Array(fileBuffer)], 'jpeg.jpg', {
      type: 'image/jpeg',
    });
    beforeEach(() => {
      imageCompressionMock.mockImplementationOnce((fileToCompress) =>
        Promise.resolve(fileToCompress),
      );
    });

    it('updates the avatar', async () => {
      const userProfile: UserResponse = {
        ...createUserResponse(),
        avatarUrl: 'https://placekitten.com/200/300',
        id: '42',
      };
      const { findByLabelText } = await renderUserProfile(userProfile);

      userEvent.upload(await findByLabelText(/upload.+avatar/i), file);
      await waitFor(() =>
        expect(mockPostUserAvatar).toHaveBeenLastCalledWith(
          '42',
          expect.objectContaining({
            avatar: `data:image/jpeg;base64,${fileBuffer.toString('base64')}`,
          }),
          expect.any(String),
        ),
      );
    });

    it('refreshes the Auth0 id token', async () => {
      const userProfile: UserResponse = {
        ...createUserResponse(),
        avatarUrl: 'https://placekitten.com/200/300',
        id: '42',
      };
      const mockToken = jest.fn().mockResolvedValue('token');
      const { findByLabelText } = await renderUserProfile(
        userProfile,
        {},
        (authClient, user) => ({
          getTokenSilently:
            authClient && user
              ? mockToken
              : () => {
                  throw new Error('Not Ready');
                },
        }),
      );

      userEvent.upload(await findByLabelText(/upload.+avatar/i), file);
      await waitFor(() => expect(mockToken).toHaveBeenCalled());
    });

    it('toasts if the upload fails', async () => {
      const userProfile: UserResponse = {
        ...createUserResponse(),
        avatarUrl: 'https://placekitten.com/200/300',
        id: '42',
      };
      const { findByLabelText } = await renderUserProfile(userProfile);

      mockPostUserAvatar.mockRejectedValue(new Error('500'));
      userEvent.upload(await findByLabelText(/upload.+avatar/i), file);
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.stringMatching(/error.+picture/i),
        );
      });
    });
  });
});
