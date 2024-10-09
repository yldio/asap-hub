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
import { network, OutputDocumentTypeParameter } from '@asap-hub/routing';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent, { specialChars } from '@testing-library/user-event';
import { Suspense } from 'react';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory, History } from 'history';
import { RecoilRoot } from 'recoil';
import {
  createResearchOutput,
  updateTeamResearchOutput,
} from '../../teams/api';
import { refreshWorkingGroupState } from '../state';
import WorkingGroupOutput from '../WorkingGroupOutput';
import { getWorkingGroup } from '../api';

jest.setTimeout(95000);
jest.mock('../api');
jest.mock('../../teams/api');
jest.mock('../../users/api');
jest.mock('../../../shared-research/api');

beforeEach(() => {
  window.scrollTo = jest.fn();
  // TODO: fix act error
  jest.spyOn(console, 'error').mockImplementation();
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
) => {
  const url = isLinkRequired ? /url \(required\)/i : /url \(optional\)/i;

  userEvent.type(screen.getByRole('textbox', { name: url }), link);
  userEvent.type(screen.getByRole('textbox', { name: /title/i }), title);

  const descriptionEditor = screen.getByTestId('editor');
  userEvent.click(descriptionEditor);
  userEvent.tab();
  fireEvent.input(descriptionEditor, { data: descriptionMD });
  userEvent.tab();

  userEvent.type(
    screen.getByRole('textbox', { name: /short description/i }),
    shortDescription,
  );

  const typeInput = screen.getByRole('textbox', {
    name: /Select the type/i,
  });
  userEvent.type(typeInput, type);
  userEvent.type(typeInput, specialChars.enter);

  const identifier = screen.getByRole('textbox', { name: /identifier/i });
  userEvent.type(identifier, 'DOI');
  userEvent.type(identifier, specialChars.enter);
  userEvent.type(screen.getByPlaceholderText('e.g. 10.5555/YFRU1371'), doi);
  userEvent.click(screen.getByRole('textbox', { name: /Authors/i }));
  userEvent.click(screen.getByText('Person A 3'));

  userEvent.click(screen.getByRole('textbox', { name: /Teams/i }));
  userEvent.click(screen.getByText('Abu-Remaileh, M 1'));

  return {
    publish: async () => {
      const button = screen.getByRole('button', { name: /Publish/i });
      userEvent.click(button);
      userEvent.click(screen.getByRole('button', { name: /Publish Output/i }));
      await waitFor(() => {
        expect(button).toBeEnabled();
      });
    },
    saveDraft: async () => {
      const saveDraftButton = screen.getByRole('button', {
        name: /Save Draft/i,
      });
      userEvent.click(saveDraftButton);
      await waitFor(() => {
        expect(saveDraftButton).toBeEnabled();
      });
    },
    updatePublished: async () => {
      const updatePublishedButton = screen.getByRole('button', {
        name: /Save/i,
      });
      userEvent.click(updatePublishedButton);
      await waitFor(() => {
        expect(updatePublishedButton).toBeEnabled();
      });
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
  history = createMemoryHistory({
    initialEntries: [
      network({})
        .workingGroups({})
        .workingGroup({ workingGroupId })
        .createOutput({ outputDocumentType }).$,
    ],
  }),
}: {
  user?: UserResponse;
  workingGroupId?: string;
  outputDocumentType?: OutputDocumentTypeParameter;
  canEditResearchOutput?: boolean;
  researchOutputData?: ResearchOutputResponse;
  history?: History;
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
            <Router history={history}>
              <Route path={path}>
                <WorkingGroupOutput
                  workingGroupId={workingGroupId}
                  researchOutputData={researchOutputData}
                  versionAction={versionAction}
                />
              </Route>
            </Router>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

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
  const workingGroupId = 'wg1';
  const link = 'https://example42.com';
  const title = 'example42 title';
  const descriptionMD = 'example42 description';
  const shortDescription = 'example42 short description';
  const type = 'Preprint';
  const doi = '10.0777';
  const outputDocumentType = 'article';

  const history = createMemoryHistory({
    initialEntries: [
      network({})
        .workingGroups({})
        .workingGroup({ workingGroupId })
        .createOutput({ outputDocumentType }).$,
    ],
  });

  await renderPage({
    workingGroupId,
    outputDocumentType,
    history,
  });

  const { publish } = await mandatoryFields({
    link,
    title,
    descriptionMD,
    shortDescription,
    type,
    doi,
  });

  userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
  userEvent.click(screen.getByText('Example 1 Lab'));

  await publish();

  expect(mockCreateResearchOutput).toHaveBeenCalledWith(
    {
      doi,
      documentType: 'Article',
      sharingStatus: 'Network Only',
      teams: ['t0'],
      link,
      title,
      descriptionMD,
      shortDescription,
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
    },
    expect.anything(),
  );
  await waitFor(() => {
    expect(history.location.pathname).toBe(
      '/shared-research/research-output-id/publishedNow',
    );
  });
});

it('can save draft when form data is valid', async () => {
  const workingGroupId = 'wg1';
  const link = 'https://example42.com';
  const title = 'example42 title';
  const descriptionMD = 'example42 description';
  const shortDescription = 'example42 short description';
  const type = 'Preprint';
  const doi = '10.0777';
  const outputDocumentType = 'article';

  const history = createMemoryHistory({
    initialEntries: [
      network({})
        .workingGroups({})
        .workingGroup({ workingGroupId })
        .createOutput({ outputDocumentType }).$,
    ],
  });

  await renderPage({
    workingGroupId,
    outputDocumentType,
    history,
  });

  const { saveDraft } = await mandatoryFields({
    link,
    title,
    descriptionMD,
    shortDescription,
    type,
    doi,
  });

  userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
  userEvent.click(screen.getByText('Example 1 Lab'));

  await saveDraft();

  expect(mockCreateResearchOutput).toHaveBeenCalledWith(
    {
      doi,
      documentType: 'Article',
      sharingStatus: 'Network Only',
      teams: ['t0'],
      link,
      title,
      descriptionMD,
      shortDescription,
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
    },
    expect.anything(),
  );
  await waitFor(() => {
    expect(history.location.pathname).toBe(
      '/shared-research/research-output-id',
    );
  });
});

it('will show server side validation error for link', async () => {
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
    outputDocumentType: 'article',
  });
  const { publish } = await mandatoryFields({}, true);

  await publish();

  expect(mockCreateResearchOutput).toHaveBeenCalled();
  expect(
    screen.queryAllByText(
      'A Research Output with this URL already exists. Please enter a different URL.',
    ).length,
  ).toBeGreaterThan(1);

  const url = screen.getByRole('textbox', { name: /URL \(required\)/i });
  userEvent.type(url, 'a');
  url.blur();

  expect(
    screen.queryByText(
      'A Research Output with this URL already exists. Please enter a different URL.',
    ),
  ).toBeNull();
});

it('will toast server side errors for unknown errors', async () => {
  mockCreateResearchOutput.mockRejectedValue(new Error('Something went wrong'));

  await renderPage({
    outputDocumentType: 'article',
  });

  const { publish } = await mandatoryFields({}, true);

  await publish();

  expect(mockCreateResearchOutput).toHaveBeenCalled();
  expect(
    screen.queryByText(
      'There was an error and we were unable to save your changes. Please try again.',
    ),
  ).toBeInTheDocument();
  expect(window.scrollTo).toHaveBeenCalled();
});

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
    const id = 'RO-ID';
    const workingGroupId = 'wg1';
    const link = 'https://example42.com';
    const title = 'example42 title';
    const descriptionMD = 'example42 description';
    const shortDescription = 'example42 short description';
    const outputDocumentType = 'report';

    const history = createMemoryHistory({
      initialEntries: [
        network({})
          .workingGroups({})
          .workingGroup({ workingGroupId })
          .createOutput({ outputDocumentType }).$,
      ],
    });
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
      history,
    });

    const button = screen.getByRole('button', { name: buttonName });
    userEvent.click(button);
    if (buttonName === 'Publish') {
      userEvent.click(screen.getByRole('button', { name: /Publish Output/i }));
    }
    await waitFor(() => {
      expect(button).toBeEnabled();
      expect(history.location.pathname).toBe(
        buttonName === 'Publish'
          ? '/shared-research/research-output-id/publishedNow'
          : '/shared-research/research-output-id',
      );
    });

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
