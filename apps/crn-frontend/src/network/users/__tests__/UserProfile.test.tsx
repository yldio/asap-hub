import { Auth0, Auth0User } from '@asap-hub/auth';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import {
  createListEventResponse,
  createUserResponse,
  createUserTeams,
} from '@asap-hub/fixtures';
import { UserResponse } from '@asap-hub/model';
import { ToastContext } from '@asap-hub/react-context';
import { network } from '@asap-hub/routing';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import imageCompression from 'browser-image-compression';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ContextType, Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { getEvents } from '../../../events/api';
import { getResearchOutputs } from '../../../shared-research/api';
import { createResearchOutputListAlgoliaResponse } from '../../../__fixtures__/algolia';
import { getUser, patchUser, postUserAvatar } from '../api';
import { refreshUserState } from '../state';
import UserProfile from '../UserProfile';

jest.mock('../api');
jest.mock('../groups/api');
jest.mock('browser-image-compression');

jest.mock('../../../shared-research/api');
jest.mock('../../../events/api');
const mockGetResearchOutputs = getResearchOutputs as jest.MockedFunction<
  typeof getResearchOutputs
>;

const imageCompressionMock = imageCompression as jest.MockedFunction<
  typeof imageCompression
>;
const mockUserEventsFromAlgolia = getEvents as jest.MockedFunction<
  typeof getEvents
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
beforeEach(jest.clearAllMocks);

const renderUserProfile = async (
  userResponse = createUserResponse(),
  {
    ownUserId = userResponse.id,
    onboarded = true,
    routeProfileId = userResponse.id,
    currentTime = new Date(),
  } = {},
  auth0Overrides?: (
    auth0Client?: Auth0Client,
    auth0User?: Auth0User,
  ) => Partial<Auth0>,
) => {
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
            user={{ id: ownUserId, onboarded }}
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
                >
                  <UserProfile currentTime={currentTime} />
                </Route>
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
  await renderUserProfile({
    ...createUserResponse(),
    displayName: 'Someone',
  });
  expect((await screen.findByText('Someone')).tagName).toBe('H1');
});

it('by default renders the research tab', async () => {
  await renderUserProfile({
    ...createUserResponse(),
    questions: ['What?'],
  });
  expect(await screen.findByText('What?')).toBeVisible();
});

it('navigates to the background tab', async () => {
  await renderUserProfile({
    ...createUserResponse(),
    biography: 'My Bio',
  });

  const tab = screen.getByRole('link', { name: /background/i });
  userEvent.click(tab);
  expect(await screen.findByText('My Bio')).toBeVisible();
});

it('navigates to the outputs tab', async () => {
  mockGetResearchOutputs.mockResolvedValue({
    ...createResearchOutputListAlgoliaResponse(1),
    hits: createResearchOutputListAlgoliaResponse(1).hits.map((hit, index) => ({
      ...hit,
      title: `Test Output ${index}`,
    })),
  });
  await renderUserProfile(createUserResponse());

  const tab = screen.getByRole('link', { name: /output/i });
  userEvent.click(tab);
  expect(await screen.findByRole('searchbox')).toHaveAttribute(
    'placeholder',
    'Enter a keyword, method, resource…',
  );
  expect(await screen.findByText(/Test Output 0/i)).toBeVisible();
});

it("links to the user's team", async () => {
  await renderUserProfile({
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
      await screen.findByText('Kool Krew', {
        exact: false,
        selector: 'h2 ~ * *',
      })
    ).closest('a')!.href,
  ).toContain('42');
});

it('renders the 404 page for a missing user', async () => {
  await renderUserProfile(
    {
      ...createUserResponse(),
      id: '42',
    },
    { routeProfileId: '1337' },
  );
  expect(await screen.findByText(/sorry.+page/i)).toBeVisible();
});

describe('a header edit button', () => {
  it("is not rendered on someone else's profile", async () => {
    await renderUserProfile(
      { ...createUserResponse(), id: '42' },
      { ownUserId: '1337' },
    );
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    expect(screen.queryByLabelText(/edit/i)).not.toBeInTheDocument();
  });

  it('is rendered for personal info on your own profile', async () => {
    await renderUserProfile();
    expect(await screen.findByLabelText(/edit.+personal/i)).toBeVisible();
  });

  it('is rendered for contact info on your own profile', async () => {
    await renderUserProfile();
    expect(await screen.findByLabelText(/edit.+contact/i)).toBeVisible();
  });

  it('is rendered for avatar on your own profile', async () => {
    await renderUserProfile();
    expect(await screen.findByLabelText(/edit.+avatar/i)).toBeVisible();
  });

  it('can change personal info', async () => {
    const userProfile: UserResponse = {
      ...createUserResponse(),
      city: 'Lon',
      country: 'United Kingdom of Great Britain and Northern Ireland',
      id: '42',
    };

    await renderUserProfile(userProfile);

    userEvent.click(await screen.findByLabelText(/edit.+personal/i));
    userEvent.type(await screen.findByDisplayValue('Lon'), 'don');
    expect(await screen.findByDisplayValue('London')).toBeVisible();

    userEvent.click(screen.getByText(/save/i));
    expect(await screen.findByText(/London/i)).toBeVisible();
    expect(mockPatchUser).toHaveBeenLastCalledWith(
      '42',
      expect.objectContaining({ city: 'London' }),
      expect.any(String),
    );
  });

  it('remains on the same tab after closing a modal', async () => {
    const userProfile: UserResponse = {
      ...createUserResponse(),
      biography: 'My Bio',
    };

    await renderUserProfile(userProfile);

    // Open and close on research tab
    userEvent.click(
      await screen.findByText(/research/i, { selector: 'nav *' }),
    );
    expect(screen.getByText(/role on asap network/i)).toBeVisible();
    expect(screen.queryByText(/your details/i)).toBeNull();
    userEvent.click(await screen.findByLabelText(/edit.+personal/i));
    expect(screen.getByText(/role on asap network/i)).toBeVisible();
    expect(screen.getByText(/your details/i)).toBeVisible();
    userEvent.click(screen.getByTitle(/Close/i));
    expect(screen.getByText(/role on asap network/i)).toBeVisible();
    expect(screen.queryByText(/your details/i)).toBeNull();

    // Open and close on background tab
    userEvent.click(
      await screen.findByText(/background/i, { selector: 'nav *' }),
    );
    expect(await screen.findByText('My Bio')).toBeVisible();
    userEvent.click(await screen.findByLabelText(/edit.+personal/i));
    expect(screen.getByText(/my bio/i)).toBeVisible();
    expect(screen.getByText(/your details/i)).toBeVisible();
    userEvent.click(screen.getByTitle(/Close/i));
    expect(screen.getByText(/my bio/i)).toBeVisible();
    expect(screen.queryByText(/your details/i)).toBeNull();
  });

  it('can change contact info', async () => {
    const userProfile: UserResponse = {
      ...createUserResponse(),
      contactEmail: 'contact@example.com',
      id: '42',
    };

    await renderUserProfile(userProfile);

    userEvent.click(await screen.findByLabelText(/edit.+contact/i));
    userEvent.type(await screen.findByDisplayValue('contact@example.com'), 'm');
    expect(
      await screen.findByDisplayValue('contact@example.comm'),
    ).toBeVisible();

    userEvent.click(screen.getByText(/save/i));
    expect(
      (await screen.findByText(/contact/i, { selector: 'header *' })).closest(
        'a',
      ),
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
    await renderUserProfile(userProfile, {}, (authClient, user) => ({
      getTokenSilently:
        authClient && user
          ? mockToken
          : () => {
              throw new Error('Not Ready');
            },
    }));
    userEvent.click(await screen.findByLabelText(/edit.+contact/i));

    userEvent.click(screen.getByText(/save/i));
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
      await renderUserProfile(userProfile);

      userEvent.upload(await screen.findByLabelText(/upload.+avatar/i), file);
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
      await renderUserProfile(userProfile, {}, (authClient, user) => ({
        getTokenSilently:
          authClient && user
            ? mockToken
            : () => {
                throw new Error('Not Ready');
              },
      }));

      userEvent.upload(await screen.findByLabelText(/upload.+avatar/i), file);
      await waitFor(() => expect(mockToken).toHaveBeenCalled());
    });

    it('toasts if the upload fails', async () => {
      const userProfile: UserResponse = {
        ...createUserResponse(),
        avatarUrl: 'https://placekitten.com/200/300',
        id: '42',
      };
      await renderUserProfile(userProfile);

      mockPostUserAvatar.mockRejectedValue(new Error('500'));
      userEvent.upload(await screen.findByLabelText(/upload.+avatar/i), file);
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.stringMatching(/error.+picture/i),
        );
      });
    });
  });
});

it('renders number of shared outputs', async () => {
  mockGetResearchOutputs.mockResolvedValue({
    ...createResearchOutputListAlgoliaResponse(5),
  });
  await renderUserProfile(createUserResponse());

  expect(await screen.findByText(/Shared Outputs \(5\)/i)).toBeVisible();
});

it('renders number of upcoming events', async () => {
  const response = createListEventResponse(7);
  mockUserEventsFromAlgolia.mockResolvedValue(response);
  await renderUserProfile(createUserResponse());

  expect(await screen.findByText(/Upcoming Events \(7\)/i)).toBeVisible();
});

it('renders number of past events', async () => {
  const response = createListEventResponse(7, { isEventInThePast: true });
  mockUserEventsFromAlgolia.mockResolvedValue(response);
  await renderUserProfile(createUserResponse());

  expect(await screen.findByText(/Past Events \(7\)/i)).toBeVisible();
});

it('navigates to the upcoming events tab', async () => {
  const currentTime = new Date('2021-12-28T14:00:00.000Z');
  const response = createListEventResponse(1);
  mockUserEventsFromAlgolia.mockResolvedValue(response);

  const userResponse = createUserResponse();
  await renderUserProfile(userResponse, { currentTime });

  const tab = screen.getByRole('link', { name: /upcoming/i });
  userEvent.click(tab);
  expect(await screen.findByRole('searchbox')).toHaveAttribute(
    'placeholder',
    'Search by topic, presenting team, …',
  );
  expect(await screen.findByText(/Event 0/i)).toBeVisible();
  expect(mockUserEventsFromAlgolia).toBeCalledTimes(2);
  expect(mockUserEventsFromAlgolia).toHaveBeenCalledWith(expect.anything(), {
    after: '2021-12-28T13:00:00.000Z',
    currentPage: 0,
    filters: new Set(),
    pageSize: 10,
    searchQuery: '',
    constraint: {
      userId: userResponse.id,
    },
  });
});

it('navigates to the past events tab', async () => {
  const currentTime = new Date('2021-12-28T14:00:00.000Z');
  const response = createListEventResponse(1, { isEventInThePast: true });
  mockUserEventsFromAlgolia.mockResolvedValue(response);

  const userResponse = createUserResponse();
  await renderUserProfile(userResponse, { currentTime });

  const tab = screen.getByRole('link', { name: /past/i });
  userEvent.click(tab);
  expect(await screen.findByRole('searchbox')).toHaveAttribute(
    'placeholder',
    'Search by topic, presenting team, …',
  );
  expect(await screen.findByText(/Event 0/i)).toBeVisible();
  expect(mockUserEventsFromAlgolia).toBeCalledTimes(2);
  expect(mockUserEventsFromAlgolia).toHaveBeenCalledWith(expect.anything(), {
    after: '2021-12-28T13:00:00.000Z',
    currentPage: 0,
    filters: new Set(),
    pageSize: 10,
    searchQuery: '',
    constraint: {
      userId: userResponse.id,
    },
  });
});
