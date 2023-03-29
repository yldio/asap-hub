import { Auth0, Auth0User, gp2 } from '@asap-hub/auth';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
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
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import {
  getContributingCohorts,
  getInstitutions,
  getUser,
  patchUser,
  postUserAvatar,
} from '../../users/api';
import Preview from '../Preview';

jest.mock('browser-image-compression');
jest.mock('../../users/api');

const fileBuffer = readFileSync(join(__dirname, 'jpeg.jpg'));
const file = new File([new Uint8Array(fileBuffer)], 'jpeg.jpg', {
  type: 'image/jpeg',
});

const mockToast = jest.fn() as jest.MockedFunction<
  ContextType<typeof ToastContext>
>;

mockConsoleError();

const renderPreview = async (
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
                initialEntries={[gp2Routing.onboarding({}).preview({}).$]}
              >
                <Route path={gp2Routing.onboarding({}).preview.template}>
                  <Preview />
                </Route>
              </MemoryRouter>
            </WhenReady>
          </Auth0Provider>
        </ToastContext.Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

describe('Preview', () => {
  beforeEach(jest.resetAllMocks);
  const contributingCohortResponse: gp2Model.ContributingCohortResponse[] = [
    { id: '7', name: 'AGPDS' },
    { id: '11', name: 'S3' },
  ];
  const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;
  const mockPatchUser = patchUser as jest.MockedFunction<typeof patchUser>;
  const mockPostUserAvatar = postUserAvatar as jest.MockedFunction<
    typeof postUserAvatar
  >;
  const mockGetContributingCohorts =
    getContributingCohorts as jest.MockedFunction<
      typeof getContributingCohorts
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

  it('renders header with title', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderPreview(user.id);
    expect(screen.getByRole('heading', { name: /tony stark/i })).toBeVisible();
  });

  it('renders not found if no user is returned', async () => {
    mockGetUser.mockResolvedValueOnce(undefined);
    await renderPreview('unknown-id');
    expect(
      screen.getByRole('heading', {
        name: 'Sorry! We can’t seem to find that page.',
      }),
    ).toBeVisible();
  });

  it('renders the primary email', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderPreview(user.id);
    expect(screen.getByRole('link', { name: /T@ark.io/i })).toBeVisible();
  });

  it('renders the secondary email', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce({
      ...user,
      secondaryEmail: 'secondary@stark.com',
    });
    await renderPreview(user.id);
    expect(
      screen.getByRole('link', { name: /secondary@stark.com/i }),
    ).toBeVisible();
  });

  it('renders projects and working groups', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderPreview(user.id);
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Working Groups' }),
    ).toBeVisible();
  });

  it('renders questions, funding providers, contributing cohorts and external profiles', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    mockGetContributingCohorts.mockResolvedValueOnce(
      contributingCohortResponse,
    );
    await renderPreview(user.id);
    expect(
      screen.getByRole('heading', { name: 'Open Questions' }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Funding Providers' }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Contributing Cohort Studies' }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'External Profiles' }),
    ).toBeVisible();
  });

  it('opens the key information modal', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderPreview(user.id);
    const [keyInformationEditButton] = screen.getAllByRole('link', {
      name: 'Edit Edit',
    });
    userEvent.click(keyInformationEditButton);
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('searches and displays results from organisations api', async () => {
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
    await renderPreview(user.id);
    const [keyInformationEditButton] = screen.getAllByRole('link', {
      name: 'Edit Edit',
    });
    userEvent.click(keyInformationEditButton);

    userEvent.type(await screen.findByDisplayValue('Stark Industries'), ' 1');
    expect(await screen.findByText('ExampleInst')).toBeVisible();
    expect(mockGetInstitutions).toHaveBeenCalledWith({
      searchQuery: 'Stark Industries 1',
    });
  });

  it('saves the key information modal', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderPreview(user.id);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const [keyInformationEditButton] = screen.getAllByRole('link', {
      name: 'Edit Edit',
    });
    userEvent.click(keyInformationEditButton);
    expect(screen.getByRole('dialog')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(mockPatchUser).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ firstName: 'Tony', lastName: 'Stark' }),
      expect.anything(),
    );
  });

  it('saves the contact information modal', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderPreview(user.id);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const [, contactInformationEditButton] = screen.getAllByRole('link', {
      name: 'Edit Edit',
    });
    userEvent.click(contactInformationEditButton);
    expect(screen.getByRole('dialog')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(mockPatchUser).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        secondaryEmail: 'tony.stark@avengers.com',
        telephone: {
          countryCode: '+1',
          number: '0123456789',
        },
      }),
      expect.anything(),
    );
  });

  it('saves the biography modal', async () => {
    const biography = 'this is some biography';
    const user = { ...gp2Fixtures.createUserResponse(), biography };
    mockGetUser.mockResolvedValueOnce(user);
    await renderPreview(user.id);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const [, , , biographyEditButton] = screen.getAllByRole('link', {
      name: 'Edit Edit',
    });
    userEvent.click(biographyEditButton);
    expect(screen.getByRole('dialog')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(mockPatchUser).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ biography }),
      expect.anything(),
    );
  });

  it('saves the keywords modal', async () => {
    const keywords = ['Genetics'] as gp2Model.Keyword[];
    const user = { ...gp2Fixtures.createUserResponse(), keywords };
    mockGetUser.mockResolvedValueOnce(user);
    await renderPreview(user.id);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const [, , keywordsEditButton] = screen.getAllByRole('link', {
      name: 'Edit Edit',
    });
    userEvent.click(keywordsEditButton);
    expect(screen.getByRole('dialog')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(mockPatchUser).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ keywords }),
      expect.anything(),
    );
  });

  it('saves the open questions modal', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderPreview(user.id);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const [, , , , openQuestionsButton] = screen.getAllByRole('link', {
      name: 'Edit Edit',
    });
    userEvent.click(openQuestionsButton);
    expect(screen.getByRole('dialog')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(mockPatchUser).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        questions: ['a first question?', 'a second question?'],
      }),
      expect.anything(),
    );
  });

  it('saves the funding providers modal', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderPreview(user.id);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const [fundingProvidersButton] = screen.getAllByRole('link', {
      name: 'Optional Add',
    });
    userEvent.click(fundingProvidersButton);
    expect(screen.getByRole('dialog')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(mockPatchUser).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        fundingStreams: '',
      }),
      expect.anything(),
    );
  });

  it('opens the contributing cohorts modal', async () => {
    const contributingCohorts: gp2Model.UserContributingCohort[] = [
      {
        contributingCohortId: '11',
        name: 'some name',
        role: 'Lead Investigator',
        studyUrl: 'http://example.com/study',
      },
    ];
    const user = { ...gp2Fixtures.createUserResponse(), contributingCohorts };
    mockGetUser.mockResolvedValueOnce(user);
    mockGetContributingCohorts.mockResolvedValueOnce(
      contributingCohortResponse,
    );

    await renderPreview(user.id);
    const [, , , , , cohortEditButton] = screen.getAllByRole('link', {
      name: 'Edit Edit',
    });
    userEvent.click(cohortEditButton);
    expect(await screen.findByRole('dialog')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    const expectedCohorts = contributingCohorts.map(
      ({ contributingCohortId, role, studyUrl }) => ({
        contributingCohortId,
        role,
        studyUrl,
      }),
    );
    expect(mockPatchUser).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ contributingCohorts: expectedCohorts }),
      expect.anything(),
    );
  });

  it('opens the external profiles modal', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderPreview(user.id);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const [, , , , , , externalProfilesButton] = screen.getAllByRole('link', {
      name: 'Edit Edit',
    });
    userEvent.click(externalProfilesButton);
    expect(screen.getByRole('dialog')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(mockPatchUser).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        social: {
          googleScholar: 'https://scholar.google.com',
          orcid: 'https://orcid.org/1234-1234-1234-1234',
          researchGate: 'https://researchid.com/rid/',
          researcherId: 'https://researcherid.com/rid/R-1234-1234',
          blog: 'https://www.blogger.com',
          twitter: 'https://twitter.com',
          linkedIn: 'https://www.linkedin.com',
          github: 'https://github.com/',
        },
      }),
      expect.anything(),
    );
  });

  it('updates the avatar', async () => {
    const user = {
      ...gp2Fixtures.createUserResponse(),
      avatarUrl: 'https://placekitten.com/200/300',
      id: '42',
    };
    mockGetUser.mockResolvedValueOnce(user);
    imageCompressionMock.mockImplementationOnce((fileToCompress) =>
      Promise.resolve(fileToCompress),
    );
    await renderPreview(user.id);

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
});
