import { Auth0, Auth0User, gp2 } from '@asap-hub/auth';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import { ToastContext } from '@asap-hub/react-context';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { renderHook } from '@testing-library/react-hooks';
import imageCompression from 'browser-image-compression';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ContextType, Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-test-renderer';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getUser, postUserAvatar } from '../../users/api';
import { refreshUserState } from '../../users/state';
import { useSelectAvatar } from '../useSelectAvatar';

jest.mock('../../users/api');
jest.mock('browser-image-compression');

const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;
const mockPostUserAvatar = postUserAvatar as jest.MockedFunction<
  typeof postUserAvatar
>;
const imageCompressionMock = imageCompression as jest.MockedFunction<
  typeof imageCompression
>;
imageCompressionMock.getDataUrlFromFile = jest.requireActual(
  'browser-image-compression',
).getDataUrlFromFile;
const mockToast = jest.fn() as jest.MockedFunction<
  ContextType<typeof ToastContext>
>;

beforeEach(() => {
  jest.clearAllMocks();
  imageCompressionMock.mockImplementation((fileToCompress) =>
    Promise.resolve(fileToCompress),
  );
});

const wrapper =
  (
    { user }: { user?: gp2Model.UserResponse },
    auth0Overrides?: (
      auth0Client?: Auth0Client,
      auth0User?: Auth0User<gp2.User>,
    ) => Partial<Auth0<gp2.User>>,
  ): React.FC =>
  ({ children }) =>
    (
      <RecoilRoot
        initializeState={({ set }) => {
          user?.id && set(refreshUserState(user.id), Math.random());
        }}
      >
        <Suspense fallback="loading">
          <ToastContext.Provider value={mockToast}>
            <Auth0Provider
              user={{ id: user?.id, onboarded: user?.onboarded }}
              auth0Overrides={auth0Overrides}
            >
              <WhenReady>
                <MemoryRouter
                  initialEntries={[gp2Routing.onboarding({}).coreDetails({}).$]}
                >
                  {children}
                </MemoryRouter>
              </WhenReady>
            </Auth0Provider>
          </ToastContext.Provider>
        </Suspense>
      </RecoilRoot>
    );

describe('useSelectAvatar', () => {
  const fileBuffer = readFileSync(join(__dirname, 'jpeg.jpg'));
  const file = new File([new Uint8Array(fileBuffer)], 'jpeg.jpg', {
    type: 'image/jpeg',
  });

  it('updates the avatar', async () => {
    const user = {
      ...gp2Fixtures.createUserResponse(),
      avatarUrl: 'https://placekitten.com/200/300',
      id: '42',
    };
    mockGetUser.mockResolvedValueOnce(user);

    const { result, waitForNextUpdate } = renderHook(
      () => useSelectAvatar(user.id),
      {
        wrapper: wrapper({ user }),
      },
    );

    await waitForNextUpdate();
    act(() => result.current.onImageSelect(file));
    await waitForNextUpdate();

    expect(mockPostUserAvatar).toHaveBeenLastCalledWith(
      '42',
      expect.objectContaining({
        avatar: `data:image/jpeg;base64,${fileBuffer.toString('base64')}`,
      }),
      expect.any(String),
    );
  });

  it('refreshes the Auth0 id token', async () => {
    const user = {
      ...gp2Fixtures.createUserResponse(),
      avatarUrl: 'https://placekitten.com/200/300',
      id: '42',
    };
    const mockToken = jest.fn().mockResolvedValue('token');
    mockGetUser.mockResolvedValueOnce(user);

    const { result, waitForNextUpdate } = renderHook(
      () => useSelectAvatar(user.id),
      {
        wrapper: wrapper({ user }, (authClient, authUser) => ({
          getTokenSilently:
            authClient && authUser
              ? mockToken
              : () => {
                  throw new Error('Not Ready');
                },
        })),
      },
    );

    await waitForNextUpdate();
    act(() => result.current.onImageSelect(file));
    await waitForNextUpdate();

    expect(mockToken).toHaveBeenCalled();
  });

  it('toasts if the upload fails', async () => {
    const user = {
      ...gp2Fixtures.createUserResponse(),
      avatarUrl: 'https://placekitten.com/200/300',
      id: '42',
    };
    mockGetUser.mockResolvedValueOnce(user);

    const { result, waitForNextUpdate } = renderHook(
      () => useSelectAvatar(user.id),
      {
        wrapper: wrapper({ user }),
      },
    );
    mockPostUserAvatar.mockRejectedValue(new Error('500'));

    await waitForNextUpdate();
    act(() => result.current.onImageSelect(file));
    await waitForNextUpdate();

    expect(mockToast).toHaveBeenCalledWith(
      expect.stringMatching(/error.+picture/i),
    );
  });
});
