import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import {
  createResearchOutputResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import { BackendError } from '@asap-hub/frontend-utils';
import {
  ResearchOutputResponse,
  UserResponse,
  ValidationErrorResponse,
} from '@asap-hub/model';
import { editorRef } from '@asap-hub/react-components';
import { network, OutputDocumentTypeParameter } from '@asap-hub/routing';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense, useEffect } from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import {
  createResearchOutput,
  updateTeamResearchOutput,
} from '../../teams/api';
import { getWorkingGroup } from '../api';
import { getImpacts } from '../../../shared-api/impact';
import { refreshWorkingGroupState } from '../state';
import WorkingGroupOutput from '../WorkingGroupOutput';

jest.setTimeout(95000);
jest.mock('../api');
jest.mock('../../teams/api');
jest.mock('../../users/api');
jest.mock('../../../shared-research/api');
jest.mock('../../../shared-api/impact');

let currentLocation: { pathname: string; search: string } | null = null;
const LocationCapture = () => {
  const location = useLocation();
  useEffect(() => {
    currentLocation = { pathname: location.pathname, search: location.search };
  }, [location]);
  return null;
};

let consoleErrorSpy: jest.SpyInstance;

beforeEach(() => {
  currentLocation = null;
  window.scrollTo = jest.fn();
  // TODO: fix act error
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
  jest.clearAllTimers();
});

const mockCreateResearchOutput = createResearchOutput as jest.MockedFunction<
  typeof createResearchOutput
>;

const mockUpdateResearchOutput =
  updateTeamResearchOutput as jest.MockedFunction<
    typeof updateTeamResearchOutput
  >;

const mockGetWorkingGroup = getWorkingGroup as jest.MockedFunction<
  typeof getWorkingGroup
>;

const mockGetImpacts = getImpacts as jest.MockedFunction<typeof getImpacts>;

const mandatoryFields = async (
  {
    link = 'http://example.com',
    title = 'example title',
    descriptionMD = 'example description',
    shortDescription = 'example short description',
    type = 'Preprint',
    doi = '10.1234',
  }: {
    link?: string;
    title?: string;
    descriptionMD?: string;
    shortDescription?: string;
    type?: string;
    doi?: string;
  },
  isLinkRequired: boolean = true,
  user = userEvent.setup({ delay: null }),
) => {
  const url = isLinkRequired ? /url \(required\)/i : /url \(optional\)/i;

  await user.type(screen.getByRole('textbox', { name: url }), link);
  await user.type(screen.getByRole('textbox', { name: /title/i }), title);

  await waitFor(() => expect(editorRef.current).not.toBeNull());
  editorRef.current?.focus();

  const descriptionEditor = screen.getByTestId('editor');
  await user.click(descriptionEditor);
  await user.keyboard('{Tab}');
  fireEvent.input(descriptionEditor, { data: descriptionMD });
  await user.keyboard('{Tab}');

  await user.type(
    screen.getByRole('textbox', { name: /short description/i }),
    shortDescription,
  );

  const typeInput = screen.getByRole('textbox', {
    name: /Select the type/i,
  });
  await user.type(typeInput, type);
  await user.type(typeInput, '{Enter}');

  const identifier = screen.getByRole('textbox', { name: /identifier/i });
  await user.type(identifier, 'DOI');
  await user.type(identifier, '{Enter}');
  await user.type(screen.getByPlaceholderText('e.g. 10.5555/YFRU1371'), doi);
  await user.click(screen.getByRole('textbox', { name: /Authors/i }));
  await user.click(screen.getByText('Person A 3'));

  await user.click(screen.getByRole('textbox', { name: /Teams/i }));
  await user.click(screen.getByText('Abu-Remaileh, M 1'));

  return {
    publish: async () => {
      const button = screen.getByRole('button', { name: /Publish/i });
      await user.click(button);
      await user.click(screen.getByRole('button', { name: /Publish Output/i }));
      await waitFor(
        () => {
          expect(button).toBeEnabled();
        },
        { interval: 50 },
      );
    },
    saveDraft: async () => {
      const saveDraftButton = screen.getByRole('button', {
        name: /Save Draft/i,
      });
      await user.click(saveDraftButton);
      await waitFor(
        () => {
          expect(saveDraftButton).toBeEnabled();
        },
        { interval: 50 },
      );
    },
    updatePublished: async () => {
      const updatePublishedButton = screen.getByRole('button', {
        name: /Save/i,
      });
      await user.click(updatePublishedButton);
      await waitFor(
        () => {
          expect(updatePublishedButton).toBeEnabled();
        },
        { interval: 50 },
      );
    },
  };
};

const baseUser = createUserResponse();
const renderPage = async ({
  user = {
    ...baseUser,
    workingGroups: [
      {
        ...baseUser.workingGroups[0]!,
        id: 'wg1',
        role: 'Project Manager',
        active: true,
      },
    ],
  },
  workingGroupId = 'wg1',
  versionAction = undefined,
  outputDocumentType = 'article',
  researchOutputData,
  initialEntries = [
    network({})
      .workingGroups({})
      .workingGroup({ workingGroupId })
      .createOutput({ outputDocumentType }).$,
  ],
}: {
  user?: UserResponse;
  workingGroupId?: string;
  outputDocumentType?: OutputDocumentTypeParameter;
  canEditResearchOutput?: boolean;
  researchOutputData?: ResearchOutputResponse;
  initialEntries?: string[];
  versionAction?: 'create' | 'edit';
} = {}) => {
  const path =
    network.template +
    network({}).workingGroups.template +
    network({}).workingGroups({}).workingGroup.template +
    network({}).workingGroups({}).workingGroup({ workingGroupId }).createOutput
      .template;

  render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(refreshWorkingGroupState(workingGroupId), Math.random())
      }
    >
      <Suspense fallback="loading">
        <Auth0Provider user={user}>
          <WhenReady>
            <MemoryRouter initialEntries={initialEntries}>
              <LocationCapture />
              <Routes>
                <Route
                  path={path}
                  element={
                    <WorkingGroupOutput
                      workingGroupId={workingGroupId}
                      researchOutputData={researchOutputData}
                      versionAction={versionAction}
                    />
                  }
                />
                <Route path="*" element={<div>Redirected</div>} />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

beforeEach(() => {
  currentLocation = null;
  mockGetImpacts.mockResolvedValue({
    total: 0,
    items: [],
  });
});

it('Renders the working group research output form with relevant fields', async () => {
  await renderPage({
    outputDocumentType: 'article',
  });

  expect(
    screen.getByRole('heading', { name: /Share a Working Group Article/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('textbox', { name: 'Authors (required)' }),
  ).toBeVisible();
  expect(
    screen.getByText('Add an abstract or a summary that describes this work.'),
  ).toBeVisible();
});

it('displays the research output with one version in create mode', async () => {
  await renderPage({
    outputDocumentType: 'article',
    versionAction: 'create',
    researchOutputData: createResearchOutputResponse(),
  });

  expect(screen.getByText(/#1/i)).toBeInTheDocument();
});

it('displays the research output with no version in edit mode', async () => {
  await renderPage({
    outputDocumentType: 'article',
    versionAction: 'edit',
    researchOutputData: createResearchOutputResponse(),
  });

  expect(screen.queryByText(/#1/i)).not.toBeInTheDocument();
});

it('shows the sorry not found page when the working group does not exist', async () => {
  mockGetWorkingGroup.mockResolvedValueOnce(undefined);
  await renderPage({
    outputDocumentType: 'article',
  });
  expect(screen.getByText(/sorry.+page/i)).toBeVisible();
});
it('can submit a form when form data is valid', async () => {
  // Override default mock for this test
  mockCreateResearchOutput.mockResolvedValue({
    ...createResearchOutputResponse(),
    id: 'research-output-id',
    published: true,
  });

  const user = userEvent.setup({ delay: null });
  const workingGroupId = 'wg1';
  const link = 'https://example42.com';
  const title = 'example42 title';
  const descriptionMD = 'example42 description';
  const shortDescription = 'example42 short description';
  const type = 'Code';
  const doi = '10.0777';
  const outputDocumentType = 'bioinformatics';

  await renderPage({
    workingGroupId,
    outputDocumentType,
    initialEntries: [
      network({})
        .workingGroups({})
        .workingGroup({ workingGroupId })
        .createOutput({ outputDocumentType }).$,
    ],
  });

  const { publish } = await mandatoryFields(
    {
      link,
      title,
      descriptionMD,
      shortDescription,
      type,
      doi,
    },
    true,
    user,
  );

  await user.click(screen.getByRole('textbox', { name: /Labs/i }));
  await user.click(screen.getByText('Example 1 Lab'));

  await publish();

  expect(mockCreateResearchOutput).toHaveBeenCalledWith(
    {
      doi,
      documentType: 'Bioinformatics',
      sharingStatus: 'Network Only',
      teams: ['t0'],
      link,
      title,
      descriptionMD,
      shortDescription,
      changelog: '',
      description: '',
      type,
      labs: ['l0'],
      authors: [
        {
          userId: 'user-id-2',
        },
      ],
      relatedResearch: [],
      relatedEvents: [],
      methods: [],
      organisms: [],
      environments: [],
      keywords: [],
      workingGroups: ['wg1'],
      publishDate: undefined,
      subtype: undefined,
      usageNotes: '',
      asapFunded: undefined,
      usedInPublication: undefined,
      published: true,
      categories: [],
      impact: '',
    },
    expect.anything(),
  );
  await waitFor(
    () => {
      expect(currentLocation?.pathname).toBe(
        '/shared-research/research-output-id/publishedNow',
      );
    },
    { interval: 50 },
  );
});

it('can save draft when form data is valid', async () => {
  const user = userEvent.setup({ delay: null });
  const workingGroupId = 'wg1';
  const link = 'https://example42.com';
  const title = 'example42 title';
  const descriptionMD = 'example42 description';
  const shortDescription = 'example42 short description';
  const type = 'Code';
  const doi = '10.0777';
  const outputDocumentType = 'bioinformatics';

  await renderPage({
    workingGroupId,
    outputDocumentType,
    initialEntries: [
      network({})
        .workingGroups({})
        .workingGroup({ workingGroupId })
        .createOutput({ outputDocumentType }).$,
    ],
  });

  const { saveDraft } = await mandatoryFields(
    {
      link,
      title,
      descriptionMD,
      shortDescription,
      type,
      doi,
    },
    true,
    user,
  );

  await user.click(screen.getByRole('textbox', { name: /Labs/i }));
  await user.click(screen.getByText('Example 1 Lab'));

  await saveDraft();

  expect(mockCreateResearchOutput).toHaveBeenCalledWith(
    {
      doi,
      documentType: 'Bioinformatics',
      sharingStatus: 'Network Only',
      teams: ['t0'],
      link,
      title,
      descriptionMD,
      shortDescription,
      changelog: '',
      description: '',
      type,
      labs: ['l0'],
      authors: [
        {
          userId: 'user-id-2',
        },
      ],
      methods: [],
      organisms: [],
      environments: [],
      keywords: [],
      relatedResearch: [],
      relatedEvents: [],
      workingGroups: ['wg1'],
      publishDate: undefined,
      subtype: undefined,
      usageNotes: '',
      asapFunded: undefined,
      usedInPublication: undefined,
      published: false,
      categories: [],
      impact: '',
    },
    expect.anything(),
  );
  await waitFor(
    () => {
      expect(currentLocation?.pathname).toBe(
        '/shared-research/research-output-id',
      );
    },
    { interval: 50 },
  );
}, 60000);

it('can publish a new version for an output', async () => {
  const user = userEvent.setup({ delay: null });
  const baseResearchOutput = createResearchOutputResponse();
  const { descriptionMD, title, shortDescription } = baseResearchOutput;
  const link = 'https://example42.com';
  const doi = '10.0777';
  const changelog = 'creating new version';

  await renderPage({
    versionAction: 'create',
    researchOutputData: { ...baseResearchOutput, documentType: 'Article' },
  });

  await mandatoryFields(
    {
      link,
      title,
      descriptionMD: '',
      shortDescription,
      type: 'Preprint',
      doi,
    },
    true,
    user,
  );

  await user.type(
    screen.getByRole('textbox', { name: /changelog/i }),
    changelog,
  );

  await user.click(screen.getByRole('button', { name: /Save/i }));
  const button = screen.getByRole('button', { name: /Publish new version/i });
  await user.click(button);

  await waitFor(
    () => {
      expect(mockUpdateResearchOutput).toHaveBeenCalledWith(
        baseResearchOutput.id,
        expect.objectContaining({
          changelog,
          relatedManuscriptVersion: undefined,
          descriptionMD,
          doi,
          link,
          createVersion: true,
          type: 'Preprint',
          documentType: 'Article',
        }),
        expect.anything(),
      );
    },
    { interval: 50 },
  );
}, 60000);

it('will show server side validation error for link', async () => {
  const user = userEvent.setup({ delay: null });
  const validationResponse: ValidationErrorResponse = {
    message: 'Validation error',
    error: 'Bad Request',
    statusCode: 400,
    data: [
      { instancePath: '/link', keyword: '', params: {}, schemaPath: 'link' },
    ],
  };

  mockCreateResearchOutput.mockRejectedValue(
    new BackendError('example', validationResponse, 400),
  );

  await renderPage({
    outputDocumentType: 'bioinformatics',
  });
  const { publish } = await mandatoryFields({ type: 'Code' }, true, user);

  await publish();

  expect(mockCreateResearchOutput).toHaveBeenCalled();
  // Verify error is shown - validation errors trigger the generic error toast
  await waitFor(() => {
    expect(
      screen.queryByText(
        'There was an error and we were unable to save your changes. Please try again.',
      ),
    ).toBeInTheDocument();
  });
});

it('will toast server side errors for unknown errors', async () => {
  const user = userEvent.setup({ delay: null });
  mockCreateResearchOutput.mockRejectedValue(new Error('Something went wrong'));

  await renderPage({
    outputDocumentType: 'bioinformatics',
  });

  const { publish } = await mandatoryFields({ type: 'Code' }, true, user);

  await publish();

  expect(mockCreateResearchOutput).toHaveBeenCalled();
  expect(
    screen.queryByText(
      'There was an error and we were unable to save your changes. Please try again.',
    ),
  ).toBeInTheDocument();
  expect(window.scrollTo).toHaveBeenCalled();
}, 60000);

it('display a toast warning when creating a new version', async () => {
  await renderPage({
    versionAction: 'create',
  });
  expect(
    screen.queryByText(
      'The previous output page will be replaced with a summarised version history section.',
    ),
  ).toBeInTheDocument();
});

it.each([
  {
    status: 'draft',
    buttonName: 'Save Draft',
    published: false,
    shouldPublish: false,
  },
  {
    status: 'published',
    buttonName: 'Save',
    published: true,
    shouldPublish: false,
  },
  {
    status: 'draft',
    buttonName: 'Publish',
    published: false,
    shouldPublish: true,
  },
])(
  'can edit a $status working group research output',
  async ({ buttonName, published, shouldPublish }) => {
    const user = userEvent.setup({ delay: null });
    const id = 'RO-ID';
    const workingGroupId = 'wg1';
    const link = 'https://example42.com';
    const title = 'example42 title';
    const descriptionMD = 'example42 description';
    const shortDescription = 'example42 short description';
    const outputDocumentType = 'report';

    await renderPage({
      workingGroupId,
      outputDocumentType,
      researchOutputData: {
        ...createResearchOutputResponse(),
        id,
        link,
        title,
        descriptionMD,
        shortDescription,
        published,
        statusChangedBy: {
          id: 'user-id-1',
          firstName: 'User',
          lastName: 'One',
        },
        isInReview: false,
      },
      initialEntries: [
        network({})
          .workingGroups({})
          .workingGroup({ workingGroupId })
          .createOutput({ outputDocumentType }).$,
      ],
    });

    const button = screen.getByRole('button', { name: buttonName });
    await user.click(button);
    if (buttonName === 'Publish') {
      await user.click(screen.getByRole('button', { name: /Publish Output/i }));
    }
    await waitFor(
      () => {
        expect(button).toBeEnabled();
        expect(currentLocation?.pathname).toBe(
          buttonName === 'Publish'
            ? '/shared-research/research-output-id/publishedNow'
            : '/shared-research/research-output-id',
        );
      },
      { interval: 50 },
    );

    expect(mockUpdateResearchOutput).toHaveBeenCalledWith(
      id,
      expect.objectContaining({
        documentType: 'Grant Document',
        link,
        title,
        descriptionMD,
        shortDescription,
        workingGroups: [workingGroupId],
        published: shouldPublish,
        statusChangedById: 'user-id-1',
        isInReview: false,
      }),
      expect.anything(),
    );
  },
);
