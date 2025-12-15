import { Auth0, Auth0User, gp2 } from '@asap-hub/auth';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { ToastContext } from '@asap-hub/react-context';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { Auth0Client } from '@auth0/auth0-spa-js';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import imageCompression from 'browser-image-compression';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ContextType, Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import {
  getInstitutions,
  getUser,
  patchUser,
  postUserAvatar,
} from '../../users/api';
import CoreDetails from '../CoreDetails';

jest.mock('browser-image-compression');
jest.mock('../../users/api');

const mockToast = jest.fn() as jest.MockedFunction<
  ContextType<typeof ToastContext>
>;

mockConsoleError();

const renderCoreDetails = async (
  id: string,
  auth0Overrides?: (
    auth0Client?: Auth0Client,
    auth0User?: Auth0User<gp2.User>,
  ) => Partial<Auth0<gp2.User>>,
) => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <ToastContext.Provider value={mockToast}>
          <Auth0Provider
            user={{ onboarded: false, id }}
            auth0Overrides={auth0Overrides}
          >
            <WhenReady>
              <MemoryRouter
                initialEntries={[gp2Routing.onboarding({}).coreDetails({}).$]}
              >
                <Routes>
                  <Route
                    path={`${gp2Routing.onboarding({}).coreDetails.template}/*`}
                    element={<CoreDetails />}
                  />
                </Routes>
              </MemoryRouter>
            </WhenReady>
          </Auth0Provider>
        </ToastContext.Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

const fileBuffer = readFileSync(join(__dirname, 'jpeg.jpg'));
const file = new File([new Uint8Array(fileBuffer)], 'jpeg.jpg', {
  type: 'image/jpeg',
});

describe('CoreDetails', () => {
  beforeEach(jest.resetAllMocks);
  const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;
  const mockPatchUser = patchUser as jest.MockedFunction<typeof patchUser>;
  const mockPostUserAvatar = postUserAvatar as jest.MockedFunction<
    typeof postUserAvatar
  >;
  const mockGetInstitutions = getInstitutions as jest.MockedFunction<
    typeof getInstitutions
  >;
  const imageCompressionMock = imageCompression as jest.MockedFunction<
    typeof imageCompression
  >;
  imageCompressionMock.getDataUrlFromFile = jest.requireActual(
    'browser-image-compression',
  ).getDataUrlFromFile;

  // TODO: Fix this test after React Router v6 migration - CoreDetails.tsx contains nested Route components that need migration
  it.skip('renders header with title', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderCoreDetails(user.id);
    expect(screen.getByRole('heading', { name: /tony stark/i })).toBeVisible();
  });

  it('renders not found if no user is returned', async () => {
    mockGetUser.mockResolvedValueOnce(undefined);
    await renderCoreDetails('unknown-id');
    expect(
      screen.getByRole('heading', {
        name: 'Sorry! We can’t seem to find that page.',
      }),
    ).toBeVisible();
  });

  // TODO: Fix this test after React Router v6 migration - CoreDetails.tsx contains nested Route components that need migration
  it.skip('renders the primary email', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderCoreDetails(user.id);
    expect(screen.getByRole('link', { name: /T@ark.io/i })).toBeVisible();
  });

  // TODO: Fix this test after React Router v6 migration - CoreDetails.tsx contains nested Route components that need migration
  it.skip('renders the alternative email', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce({
      ...user,
      alternativeEmail: 'alternative@stark.com',
    });
    await renderCoreDetails(user.id);
    expect(
      screen.getByRole('link', { name: /alternative@stark.com/i }),
    ).toBeVisible();
  });

  // TODO: Fix this test after React Router v6 migration - CoreDetails.tsx contains nested Route components that need migration
  it.skip('opens the key information modal', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderCoreDetails(user.id);
    const [keyInformationEditButton] = screen.getAllByRole('link', {
      name: 'Edit Edit',
    });
    await userEvent.click(keyInformationEditButton!);
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  // TODO: Fix this test after React Router v6 migration - CoreDetails.tsx contains nested Route components that need migration
  it.skip('searches and displays results from organisations api', async () => {
    mockGetInstitutions.mockResolvedValue({
      number_of_results: 1,
      time_taken: 0,
      items: [
        {
          name: 'ExampleInst',
          id: 'id-1',
          email_address: 'example@example.com',
          status: '',
          wikipedia_url: '',
          established: 1999,
          aliases: [],
          acronyms: [],
          links: [],
          types: [],
        },
      ],
    });
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderCoreDetails(user.id);
    const [keyInformationEditButton] = screen.getAllByRole('link', {
      name: 'Edit Edit',
    });
    await userEvent.click(keyInformationEditButton!);

    await userEvent.type(
      await screen.findByDisplayValue('Stark Industries'),
      ' 1',
    );
    expect(await screen.findByText('ExampleInst')).toBeVisible();
    expect(mockGetInstitutions).toHaveBeenCalledWith({
      searchQuery: 'Stark Industries 1',
    });
  });

  // TODO: Fix this test after React Router v6 migration - CoreDetails.tsx contains nested Route components that need migration
  it.skip('saves the key information modal', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderCoreDetails(user.id);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const [keyInformationEditButton] = screen.getAllByRole('link', {
      name: 'Edit Edit',
    });
    await userEvent.click(keyInformationEditButton!);
    expect(screen.getByRole('dialog')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(mockPatchUser).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ firstName: 'Tony', lastName: 'Stark' }),
      expect.anything(),
    );
  });

  // TODO: Fix this test after React Router v6 migration - CoreDetails.tsx contains nested Route components that need migration
  it.skip('saves the contact information modal', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderCoreDetails(user.id);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const [, contactInformationEditButton] = screen.getAllByRole('link', {
      name: 'Edit Edit',
    });
    await userEvent.click(contactInformationEditButton!);
    expect(screen.getByRole('dialog')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(mockPatchUser).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        alternativeEmail: 'tony.stark@avengers.com',
        telephone: {
          countryCode: '+1',
          number: '0123456789',
        },
      }),
      expect.anything(),
    );
  });

  // TODO: Fix this test after React Router v6 migration - CoreDetails.tsx contains nested Route components that need migration
  it.skip('updates the avatar', async () => {
    const user = {
      ...gp2Fixtures.createUserResponse(),
      avatarUrl: 'https://placekitten.com/200/300',
      id: '42',
    };
    mockGetUser.mockResolvedValueOnce(user);
    imageCompressionMock.mockImplementationOnce((fileToCompress) =>
      Promise.resolve(fileToCompress),
    );
    await renderCoreDetails(user.id);

    await userEvent.upload(
      await screen.findByLabelText(/upload.+avatar/i),
      file,
    );
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
});
