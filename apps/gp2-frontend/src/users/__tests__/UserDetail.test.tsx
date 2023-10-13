import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getEvents } from '../../events/api';
import { getOutputs } from '../../outputs/api';
import { getContributingCohorts, getTags } from '../../shared/api';
import {
  createEventListAlgoliaResponse,
  createOutputListAlgoliaResponse,
} from '../../__fixtures__/algolia';
import { getInstitutions, getUser, patchUser } from '../api';
import UserDetail from '../UserDetail';

jest.mock('../api');
jest.mock('../../outputs/api');
jest.mock('../../events/api');
jest.mock('../../shared/api');

const renderUserDetail = async (id: string) => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[gp2Routing.users({}).user({ userId: id }).$]}
            >
              <Route
                path={
                  gp2Routing.users.template + gp2Routing.users({}).user.template
                }
              >
                <UserDetail currentTime={new Date()} />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

describe('UserDetail', () => {
  beforeEach(jest.resetAllMocks);
  const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;
  const mockPatchUser = patchUser as jest.MockedFunction<typeof patchUser>;
  const mockGetOutputs = getOutputs as jest.MockedFunction<typeof getOutputs>;
  const mockGetEvents = getEvents as jest.MockedFunction<typeof getEvents>;
  const mockGetTags = getTags as jest.MockedFunction<typeof getTags>;

  const mockGetInstitutions = getInstitutions as jest.MockedFunction<
    typeof getInstitutions
  >;

  const mockGetContributingCohorts =
    getContributingCohorts as jest.MockedFunction<
      typeof getContributingCohorts
    >;

  const contributingCohortResponse: gp2Model.ContributingCohortResponse[] = [
    { id: '7', name: 'AGPDS' },
    { id: '11', name: 'S3' },
  ];
  beforeEach(() => {
    mockGetOutputs.mockResolvedValue(createOutputListAlgoliaResponse(1));
    mockGetEvents.mockResolvedValue(createEventListAlgoliaResponse(1));
    mockGetTags.mockResolvedValue(gp2Fixtures.createTagsResponse());
  });

  it('renders header with title', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderUserDetail(user.id);
    expect(screen.getByRole('banner')).toBeVisible();
  });

  it('renders not found if no user is returned', async () => {
    mockGetUser.mockResolvedValueOnce(undefined);
    await renderUserDetail('unknown-id');
    expect(
      screen.getByRole('heading', {
        name: 'Sorry! We can’t seem to find that page.',
      }),
    ).toBeVisible();
  });

  describe('Details section', () => {
    it('renders the section headings', async () => {
      const user = gp2Fixtures.createUserResponse();
      user.fundingStreams = 'a stream';
      mockGetUser.mockResolvedValueOnce(user);

      await renderUserDetail(user.id);

      expect(screen.getByRole('heading', { name: /biography/i })).toBeVisible();
      expect(screen.getByRole('heading', { name: /Tags/i })).toBeVisible();
      expect(
        screen.getByRole('heading', { name: /Contact details/i }),
      ).toBeVisible();
      expect(
        screen.getByRole('heading', { name: /Financial Disclosures/i }),
      ).toBeVisible();
    });
  });
  describe('external profile', () => {
    it('does not render upload avatar button if user is not the current user', async () => {
      const user = gp2Fixtures.createUserResponse();
      mockGetUser.mockResolvedValueOnce(user);

      await renderUserDetail(user.id);

      expect(
        screen.queryByLabelText(/upload.+avatar/i),
      ).not.toBeInTheDocument();
    });
  });
  describe('own profile', () => {
    it('renders edit buttons for each section', async () => {
      const user = gp2Fixtures.createUserResponse({
        id: 'testuserid',
        fundingStreams: 'a stream',
      });
      mockGetUser.mockResolvedValueOnce(user);

      await renderUserDetail(user.id);

      const editButtons = screen.getAllByRole('link', {
        name: 'Edit Edit',
      });

      expect(editButtons.length).toBe(8);

      expect(editButtons.map((button) => button.getAttribute('href'))).toEqual([
        '/users/testuserid/overview/edit-key-info',
        '/users/testuserid/overview/edit-contact-info',
        '/users/testuserid/overview/edit-tags',
        '/users/testuserid/overview/edit-biography',
        '/users/testuserid/overview/edit-questions',
        '/users/testuserid/overview/edit-funding-streams',
        '/users/testuserid/overview/edit-contributing-cohorts',
        '/users/testuserid/overview/edit-external-profiles',
      ]);
    });

    it('renders placeholders for each section when they are not defined', async () => {
      const user = gp2Fixtures.createUserResponse({
        id: 'testuserid',
        questions: [],
        contributingCohorts: [],
        social: undefined,
      });
      mockGetUser.mockResolvedValueOnce(user);

      await renderUserDetail(user.id);

      const editButtons = screen.getAllByRole('link', {
        name: 'Edit Edit',
      });

      const addButtons = screen.getAllByRole('link', {
        name: 'Optional Add',
      });

      expect((await editButtons).length).toBe(4);
      expect((await addButtons).length).toBe(4);
    });
    it('renders the upload avatar button', async () => {
      const user = gp2Fixtures.createUserResponse({
        id: 'testuserid',
      });
      mockGetUser.mockResolvedValueOnce(user);
      await renderUserDetail(user.id);
      expect(screen.getByLabelText(/upload.+avatar/i)).toBeVisible();
    });
    it('saves the key information modal', async () => {
      const user = gp2Fixtures.createUserResponse({
        id: 'testuserid',
      });
      mockGetUser.mockResolvedValueOnce(user);
      await renderUserDetail(user.id);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      const [keyInformationEditButton] = screen.getAllByRole('link', {
        name: 'Edit Edit',
      });
      userEvent.click(keyInformationEditButton!);
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
      const user = gp2Fixtures.createUserResponse({
        id: 'testuserid',
      });
      mockGetUser.mockResolvedValueOnce(user);
      await renderUserDetail(user.id);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      const [, contactInformationEditButton] = screen.getAllByRole('link', {
        name: 'Edit Edit',
      });
      userEvent.click(contactInformationEditButton!);
      expect(screen.getByRole('dialog')).toBeVisible();
      userEvent.click(screen.getByRole('button', { name: 'Save' }));
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

    it('saves the tags modal', async () => {
      const user = gp2Fixtures.createUserResponse({
        id: 'testuserid',
      });
      mockGetUser.mockResolvedValueOnce(user);
      await renderUserDetail(user.id);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      const [, , tagsEditButton] = screen.getAllByRole('link', {
        name: 'Edit Edit',
      });
      userEvent.click(tagsEditButton!);
      expect(screen.getByRole('dialog')).toBeVisible();
      userEvent.click(screen.getByRole('button', { name: 'Save' }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
      expect(mockPatchUser).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          tags: user.tags.map(({ id }) => ({ id })),
        }),
        expect.anything(),
      );
    });

    it('saves the biography modal', async () => {
      const user = gp2Fixtures.createUserResponse({
        id: 'testuserid',
      });
      mockGetUser.mockResolvedValueOnce(user);
      await renderUserDetail(user.id);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      const [, , , biographyEditButton] = screen.getAllByRole('link', {
        name: 'Edit Edit',
      });
      userEvent.click(biographyEditButton!);
      expect(screen.getByRole('dialog')).toBeVisible();
      userEvent.click(screen.getByRole('button', { name: 'Save' }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
      expect(mockPatchUser).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ biography: user.biography }),
        expect.anything(),
      );
    });

    it('saves the questions modal', async () => {
      const user = gp2Fixtures.createUserResponse({
        id: 'testuserid',
      });
      mockGetUser.mockResolvedValueOnce(user);
      await renderUserDetail(user.id);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      const [, , , , questionsEditButton] = screen.getAllByRole('link', {
        name: 'Edit Edit',
      });
      userEvent.click(questionsEditButton!);
      expect(screen.getByRole('dialog')).toBeVisible();
      userEvent.click(screen.getByRole('button', { name: 'Save' }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
      expect(mockPatchUser).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ questions: user.questions }),
        expect.anything(),
      );
    });

    it('saves the funding streams modal', async () => {
      const user = gp2Fixtures.createUserResponse({
        id: 'testuserid',
        fundingStreams: 'a stream',
      });
      mockGetUser.mockResolvedValueOnce(user);
      await renderUserDetail(user.id);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      const [, , , , , fundingStreamsEditButton] = screen.getAllByRole('link', {
        name: 'Edit Edit',
      });
      userEvent.click(fundingStreamsEditButton!);
      expect(screen.getByRole('dialog')).toBeVisible();
      userEvent.click(screen.getByRole('button', { name: 'Save' }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
      expect(mockPatchUser).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ fundingStreams: user.fundingStreams }),
        expect.anything(),
      );
    });

    it('saves the contributing cohorts modal', async () => {
      const user = gp2Fixtures.createUserResponse({
        id: 'testuserid',
        contributingCohorts: [
          { contributingCohortId: '7', name: 'AGPDS', role: 'Investigator' },
          { contributingCohortId: '11', name: 'S3', role: 'Co-Investigator' },
        ],
      });
      mockGetUser.mockResolvedValueOnce(user);
      mockGetContributingCohorts.mockResolvedValueOnce(
        contributingCohortResponse,
      );
      await renderUserDetail(user.id);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      const [, , , , , contributingCohortsEditButton] = screen.getAllByRole(
        'link',
        {
          name: 'Edit Edit',
        },
      );
      userEvent.click(contributingCohortsEditButton!);
      expect(screen.getByRole('dialog')).toBeVisible();
      userEvent.click(screen.getByRole('button', { name: 'Save' }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
      expect(mockPatchUser).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          contributingCohorts: [
            {
              contributingCohortId: '7',
              role: 'Investigator',
            },
            {
              contributingCohortId: '11',
              role: 'Co-Investigator',
            },
          ],
        }),
        expect.anything(),
      );
    });

    it('saves the external profiles modal', async () => {
      const user = gp2Fixtures.createUserResponse({
        id: 'testuserid',
      });
      const userRequest = gp2Fixtures.createUserPatchRequest();
      mockGetUser.mockResolvedValueOnce(user);
      await renderUserDetail(user.id);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      const [, , , , , , externalProfilesEditButton] = screen.getAllByRole(
        'link',
        {
          name: 'Edit Edit',
        },
      );
      userEvent.click(externalProfilesEditButton!);
      expect(screen.getByRole('dialog')).toBeVisible();
      userEvent.click(screen.getByRole('button', { name: 'Save' }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
      expect(mockPatchUser).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          social: userRequest.social,
          orcid: userRequest.orcid,
        }),
        expect.anything(),
      );
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
      const user = gp2Fixtures.createUserResponse({
        id: 'testuserid',
      });
      mockGetUser.mockResolvedValueOnce(user);
      await renderUserDetail(user.id);
      const [keyInformationEditButton] = screen.getAllByRole('link', {
        name: 'Edit Edit',
      });
      userEvent.click(keyInformationEditButton!);

      userEvent.type(await screen.findByDisplayValue('Stark Industries'), ' 1');
      expect(await screen.findByText('ExampleInst')).toBeVisible();
      expect(mockGetInstitutions).toHaveBeenCalledWith({
        searchQuery: 'Stark Industries 1',
      });
    });
  });
  describe('the upcoming events tab', () => {
    it('can be switched to', async () => {
      const user = gp2Fixtures.createUserResponse();
      mockGetUser.mockResolvedValueOnce(user);
      await renderUserDetail(user.id);
      userEvent.click(await screen.findByText(/upcoming events \(1\)/i));
      expect(await screen.findByText(/Event 0/i)).toBeVisible();
    });
  });

  describe('the past events tab', () => {
    it('can be switched to', async () => {
      const user = gp2Fixtures.createUserResponse();
      mockGetUser.mockResolvedValueOnce(user);
      await renderUserDetail(user.id);
      userEvent.click(await screen.findByText(/past events \(1\)/i));
      expect(await screen.findByText(/Event 0/i)).toBeVisible();
    });
  });
  it('displays the correct count', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    mockGetEvents
      .mockResolvedValueOnce(createEventListAlgoliaResponse(2))
      .mockResolvedValueOnce(createEventListAlgoliaResponse(3));
    await renderUserDetail(user.id);
    expect(await screen.findByText(/upcoming events \(2\)/i)).toBeVisible();
    expect(await screen.findByText(/past events \(3\)/i)).toBeVisible();
  });
});
