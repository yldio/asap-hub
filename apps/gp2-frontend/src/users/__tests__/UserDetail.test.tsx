import { mockNavigateWarningsInConsole } from '@asap-hub/dom-test-utils';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { RecoilRoot } from 'recoil';
import { loadInstitutionOptions } from '@asap-hub/frontend-utils';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getEvents } from '../../events/api';
import { getOutputs } from '../../outputs/api';
import { getContributingCohorts, getTags } from '../../shared/api';
import {
  createEventListAlgoliaResponse,
  createOutputListAlgoliaResponse,
} from '../../__fixtures__/algolia';
import { getUser, patchUser } from '../api';
import UserDetail from '../UserDetail';

jest.mock('../api');
jest.mock('@asap-hub/frontend-utils', () => {
  const actual = jest.requireActual('@asap-hub/frontend-utils');
  return {
    ...actual,
    loadInstitutionOptions: jest.fn(),
  };
});
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
              <Routes>
                <Route
                  path={`${gp2Routing.users.template}${
                    gp2Routing.users({}).user.template
                  }/*`}
                  element={<UserDetail currentTime={new Date()} />}
                />
              </Routes>
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

  const mockLoadInstitutionOptions =
    loadInstitutionOptions as jest.MockedFunction<
      typeof loadInstitutionOptions
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

      expect(
        await screen.findByRole('heading', { name: /biography/i }),
      ).toBeVisible();
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

      // Wait for content to render before checking what's not present
      await screen.findByRole('banner');
      await waitFor(() => {
        expect(
          screen.queryByLabelText(/upload.+avatar/i),
        ).not.toBeInTheDocument();
      });
    });
  });
  describe('own profile', () => {
    let consoleWarnSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleWarnSpy = mockNavigateWarningsInConsole();
      // Suppress jsdom "Not implemented: navigation" errors triggered by void navigate()
      // eslint-disable-next-line no-console
      const originalConsoleError = console.error;
      consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation((...args: unknown[]) => {
          const message = args[0]?.toString() || '';
          if (message.includes('Not implemented: navigation')) {
            return;
          }
          originalConsoleError.apply(console, args);
        });
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    const getEditLinkByHref = (pathSegment: string) => {
      const links = screen.getAllByRole('link', { name: 'Edit Edit' });
      const link = links.find(
        (el) => el.getAttribute('href')?.includes(pathSegment),
      );
      if (!link)
        throw new Error(
          `No edit link found with href containing "${pathSegment}"`,
        );
      return link;
    };

    it('renders edit buttons for each section', async () => {
      const user = gp2Fixtures.createUserResponse({
        id: 'testuserid',
        fundingStreams: 'a stream',
      });
      mockGetUser.mockResolvedValueOnce(user);

      await renderUserDetail(user.id);

      // Wait for the last section heading to ensure all sections have rendered
      await screen.findByRole('heading', {
        name: /contributing cohort studies/i,
      });

      const editButtons = screen.getAllByRole('link', {
        name: 'Edit Edit',
      });

      expect(editButtons).toHaveLength(7);
      expect(editButtons.map((button) => button.getAttribute('href'))).toEqual([
        '/users/testuserid/overview/edit-key-info',
        '/users/testuserid/overview/edit-contact-info',
        '/users/testuserid/overview/edit-tags',
        '/users/testuserid/overview/edit-biography',
        '/users/testuserid/overview/edit-questions',
        '/users/testuserid/overview/edit-funding-streams',
        '/users/testuserid/overview/edit-contributing-cohorts',
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

      // Wait for the last section heading to ensure all sections have rendered
      await screen.findByRole('heading', {
        name: /contributing cohort studies/i,
      });

      const editButtons = screen.getAllByRole('link', {
        name: 'Edit Edit',
      });

      const addButtons = screen.getAllByRole('link', {
        name: 'Optional Add',
      });

      expect(editButtons).toHaveLength(4);
      expect(addButtons).toHaveLength(3);
    });
    it('renders the upload avatar button', async () => {
      const user = gp2Fixtures.createUserResponse({
        id: 'testuserid',
      });
      mockGetUser.mockResolvedValueOnce(user);
      await renderUserDetail(user.id);
      // Wait for content to render with deferred transitions
      expect(await screen.findByLabelText(/edit.+avatar/i)).toBeVisible();
      expect(screen.getByLabelText(/upload.+avatar/i)).not.toBeVisible();
    });
    it('saves the key information modal', async () => {
      const user = gp2Fixtures.createUserResponse({
        id: 'testuserid',
      });
      mockGetUser.mockResolvedValueOnce(user);
      await renderUserDetail(user.id);
      await screen.findByRole('heading', { name: /contact details/i });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      await userEvent.click(getEditLinkByHref('edit-key-info'));
      expect(await screen.findByRole('dialog')).toBeVisible();
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

    it('saves the contact information modal', async () => {
      const user = gp2Fixtures.createUserResponse({
        id: 'testuserid',
      });
      mockGetUser.mockResolvedValueOnce(user);
      await renderUserDetail(user.id);
      await screen.findByRole('heading', { name: /contact details/i });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      await userEvent.click(getEditLinkByHref('edit-contact-info'));
      expect(await screen.findByRole('dialog')).toBeVisible();
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

    it('saves the tags modal', async () => {
      const user = gp2Fixtures.createUserResponse({
        id: 'testuserid',
      });
      mockGetUser.mockResolvedValueOnce(user);
      await renderUserDetail(user.id);
      await screen.findByRole('heading', { name: /tags/i });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      await userEvent.click(getEditLinkByHref('edit-tags'));
      expect(await screen.findByRole('dialog')).toBeVisible();
      await userEvent.click(screen.getByRole('button', { name: 'Save' }));
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
      await screen.findByRole('heading', { name: /biography/i });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      await userEvent.click(getEditLinkByHref('edit-biography'));
      expect(await screen.findByRole('dialog')).toBeVisible();
      await userEvent.click(screen.getByRole('button', { name: 'Save' }));
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
      await screen.findByRole('heading', { name: /open questions/i });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      await userEvent.click(getEditLinkByHref('edit-questions'));
      expect(await screen.findByRole('dialog')).toBeVisible();
      await userEvent.click(screen.getByRole('button', { name: 'Save' }));
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
      await screen.findByRole('heading', { name: /financial disclosures/i });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      await userEvent.click(getEditLinkByHref('edit-funding-streams'));
      expect(await screen.findByRole('dialog')).toBeVisible();
      await userEvent.click(screen.getByRole('button', { name: 'Save' }));
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
          {
            contributingCohortId: '7',
            name: 'AGPDS',
            role: 'Investigator',
          },
          {
            contributingCohortId: '11',
            name: 'S3',
            role: 'Co-Investigator',
          },
        ],
      });
      mockGetUser.mockResolvedValueOnce(user);
      mockGetContributingCohorts.mockResolvedValueOnce(
        contributingCohortResponse,
      );
      await renderUserDetail(user.id);
      await screen.findByRole('heading', {
        name: /contributing cohort studies/i,
      });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      await userEvent.click(getEditLinkByHref('edit-contributing-cohorts'));
      expect(await screen.findByRole('dialog')).toBeVisible();
      await userEvent.click(screen.getByRole('button', { name: 'Save' }));
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

    it('searches and displays results from organisations api', async () => {
      const user$ = userEvent.setup({ delay: null });
      mockLoadInstitutionOptions.mockResolvedValue(['ExampleInst']);
      const user = gp2Fixtures.createUserResponse({
        id: 'testuserid',
      });
      mockGetUser.mockResolvedValueOnce(user);
      mockGetEvents
        .mockResolvedValueOnce(createEventListAlgoliaResponse(1))
        .mockResolvedValueOnce(createEventListAlgoliaResponse(1));
      await renderUserDetail(user.id);
      await screen.findByRole('heading', { name: /contact details/i });

      await user$.click(getEditLinkByHref('edit-key-info'));
      await screen.findByRole('dialog');

      const institutionField =
        await screen.findByDisplayValue('Stark Industries');
      fireEvent.change(institutionField, {
        target: { value: 'Stark Industries 1' },
      });
      await waitFor(
        () => expect(screen.getByText('ExampleInst')).toBeVisible(),
        { timeout: 5000 },
      );
      expect(mockLoadInstitutionOptions).toHaveBeenCalledWith(
        'Stark Industries 1',
      );
    });
  });
  describe('the upcoming events tab', () => {
    it('can be switched to', async () => {
      const user = gp2Fixtures.createUserResponse();
      mockGetUser.mockResolvedValueOnce(user);
      await renderUserDetail(user.id);
      await userEvent.click(await screen.findByText(/upcoming events \(1\)/i));
      expect(await screen.findByText(/Event 0/i)).toBeVisible();
    });
  });

  describe('the past events tab', () => {
    it('can be switched to', async () => {
      const user = gp2Fixtures.createUserResponse();
      mockGetUser.mockResolvedValueOnce(user);
      await renderUserDetail(user.id);
      await userEvent.click(await screen.findByText(/past events \(1\)/i));
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
