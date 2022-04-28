import { Auth0, Auth0User } from '@asap-hub/auth';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { createUserResponse, createUserTeams } from '@asap-hub/fixtures';
import { UserResponse } from '@asap-hub/model';
import { ToastContext } from '@asap-hub/react-context';
import { network } from '@asap-hub/routing';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import imageCompression from 'browser-image-compression';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ContextType, Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { getResearchOutputs } from '../../../shared-research/api';
import { createResearchOutputListAlgoliaResponse } from '../../../__fixtures__/algolia';
import { getUser, patchUser, postUserAvatar } from '../api';
import { refreshUserState } from '../state';
import UserProfile from '../UserProfile';

jest.mock('../api');
jest.mock('../groups/api');
jest.mock('browser-image-compression');

jest.mock('../../../shared-research/api');

const mockGetResearchOutputs = getResearchOutputs as jest.MockedFunction<
  typeof getResearchOutputs
>;

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
const standardMockPatchUser =
  mockPatchUser.getMockImplementation() as typeof patchUser;
const standardMockPostUserAvatar =
  mockPostUserAvatar.getMockImplementation() as typeof postUserAvatar;

const mockToast = jest.fn() as jest.MockedFunction<
  ContextType<typeof ToastContext>
>;

const renderUserProfile = async ({
  userResponse = createUserResponse(),
  ownUserId = userResponse.id,
  routeProfileId = userResponse.id,
  auth0Overrides,
}: {
  userResponse?: UserResponse;
  ownUserId?: string;
  routeProfileId?: string;
  auth0Overrides?: (
    auth0Client?: Auth0Client,
    auth0User?: Auth0User,
  ) => Partial<Auth0>;
} = {}) => {
  mockGetUser.mockImplementation(async (id) =>
    id === userResponse.id ? userResponse : undefined,
  );
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
      <Suspense fallback="loading">
        <ToastContext.Provider value={mockToast}>
          <Auth0Provider
            user={{ id: ownUserId }}
            auth0Overrides={auth0Overrides}
          >
            <WhenReady>
              <MemoryRouter
                initialEntries={[
                  network({}).users({}).user({ userId: routeProfileId }).$,
                ]}
              >
                <Route
                  path={
                    network.template +
                    network({}).users.template +
                    network({}).users({}).user.template
                  }
                  component={UserProfile}
                />
              </MemoryRouter>
            </WhenReady>
          </Auth0Provider>
        </ToastContext.Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

jest.retryTimes(3);
it('renders the personal info', async () => {
  const { findByText } = await renderUserProfile({
    userResponse: {
      ...createUserResponse(),
      displayName: 'Someone',
    },
  });
  expect((await findByText('Someone')).tagName).toBe('H1');
});

it('by default renders the research tab', async () => {
  const { findByText } = await renderUserProfile({
    userResponse: {
      ...createUserResponse(),
      questions: ['What?'],
    },
  });
  expect(await findByText('What?')).toBeVisible();
});

it('navigates to the background tab', async () => {
  const { findByText } = await renderUserProfile({
    userResponse: {
      ...createUserResponse(),
      biography: 'My Bio',
    },
  });

  userEvent.click(await findByText(/background/i, { selector: 'nav *' }));
  expect(await findByText('My Bio')).toBeVisible();
});

it('navigates to the outputs tab', async () => {
  mockGetResearchOutputs.mockResolvedValue({
    ...createResearchOutputListAlgoliaResponse(1),
    hits: createResearchOutputListAlgoliaResponse(1).hits.map((hit, index) => ({
      ...hit,
      title: `Test Output ${index}`,
    })),
  });
  const { findByText, findByRole } = await renderUserProfile({
    userResponse: createUserResponse(),
  });

  userEvent.click(await findByText(/output/i, { selector: 'nav *' }));
  expect(await findByRole('searchbox')).toHaveAttribute(
    'placeholder',
    'Enter a keyword, method, resource…',
  );
  expect(await findByText(/Test Output 0/i)).toBeVisible();
});

it("links to the user's team", async () => {
  const { findByText } = await renderUserProfile({
    userResponse: {
      ...createUserResponse(),
      teams: [
        {
          ...createUserTeams({ teams: 1 })[0],
          id: '42',
          displayName: 'Kool Krew',
        },
      ],
    },
  });
  expect(
    (
      await findByText('Kool Krew', { exact: false, selector: 'h2 ~ * *' })
    ).closest('a')!.href,
  ).toContain('42');
});

it('renders the 404 page for a missing user', async () => {
  const { findByText } = await renderUserProfile({
    userResponse: {
      ...createUserResponse(),
      id: '42',
    },
    routeProfileId: '1337',
  });
  expect(await findByText(/sorry.+page/i)).toBeVisible();
});

describe('a header edit button', () => {
  it("is not rendered on someone else's profile", async () => {
    const { queryByText, queryByLabelText } = await renderUserProfile({
      userResponse: { ...createUserResponse(), id: '42' },
      ownUserId: '1337',
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
    const userResponse: UserResponse = {
      ...createUserResponse(),
      city: 'Lon',
      country: 'United Kingdom of Great Britain and Northern Ireland',
      id: '42',
    };

    const { getByText, findByText, findByLabelText, findByDisplayValue } =
      await renderUserProfile({ userResponse });

    userEvent.click(await findByLabelText(/edit.+personal/i));
    userEvent.type(await findByDisplayValue('Lon'), 'don');
    expect(await findByDisplayValue('London')).toBeVisible();

    userEvent.click(getByText(/save/i));
    expect(await findByText(/London/i)).toBeVisible();
    expect(mockPatchUser).toHaveBeenLastCalledWith(
      '42',
      expect.objectContaining({ city: 'London' }),
      expect.any(String),
    );
  });

  it('remains on the same tab after closing a modal', async () => {
    const userResponse: UserResponse = {
      ...createUserResponse(),
      biography: 'My Bio',
    };

    const { getByText, getByTitle, queryByText, findByLabelText, findByText } =
      await renderUserProfile({ userResponse });

    // Open and close on research tab
    userEvent.click(await findByText(/research/i, { selector: 'nav *' }));
    expect(getByText(/role on asap network/i)).toBeVisible();
    expect(queryByText(/your details/i)).toBeNull();
    userEvent.click(await findByLabelText(/edit.+personal/i));
    expect(getByText(/role on asap network/i)).toBeVisible();
    expect(getByText(/your details/i)).toBeVisible();
    userEvent.click(getByTitle(/Close/i));
    expect(getByText(/role on asap network/i)).toBeVisible();
    expect(queryByText(/your details/i)).toBeNull();

    // Open and close on background tab
    userEvent.click(await findByText(/background/i, { selector: 'nav *' }));
    expect(await findByText('My Bio')).toBeVisible();
    userEvent.click(await findByLabelText(/edit.+personal/i));
    expect(getByText(/my bio/i)).toBeVisible();
    expect(getByText(/your details/i)).toBeVisible();
    userEvent.click(getByTitle(/Close/i));
    expect(getByText(/my bio/i)).toBeVisible();
    expect(queryByText(/your details/i)).toBeNull();
  });

  it('can change contact info', async () => {
    const userResponse: UserResponse = {
      ...createUserResponse(),
      contactEmail: 'contact@example.com',
      id: '42',
    };
    const { getByText, findByText, findByLabelText, findByDisplayValue } =
      await renderUserProfile({ userResponse });

    userEvent.click(await findByLabelText(/edit.+contact/i));
    userEvent.type(await findByDisplayValue('contact@example.com'), 'm');
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
    const userResponse: UserResponse = {
      ...createUserResponse(),
    };
    const mockToken = jest.fn().mockResolvedValue('token');
    const { getByText, findByLabelText } = await renderUserProfile({
      userResponse,
      auth0Overrides: (authClient, user) => ({
        getTokenSilently:
          authClient && user
            ? mockToken
            : () => {
                throw new Error('Not Ready');
              },
      }),
    });
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
