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
import { ToastContext } from '@asap-hub/react-context';
import {
  network,
  WorkingGroupOutputDocumentTypeParameter,
} from '@asap-hub/routing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent, { specialChars } from '@testing-library/user-event';
import { ContextType, Suspense } from 'react';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory, History } from 'history';
import { RecoilRoot } from 'recoil';
import {
  createResearchOutput,
  updateTeamResearchOutput,
} from '../../teams/api';
import { refreshWorkingGroupState } from '../state';
import WorkingGroupOutput from '../WorkingGroupOutput';

jest.setTimeout(60000);
jest.mock('../api');
jest.mock('../../teams/api');
jest.mock('../../users/api');
jest.mock('../../../shared-research/api');

const mockToast = jest.fn() as jest.MockedFunction<
  ContextType<typeof ToastContext>
>;

const mockCreateResearchOutput = createResearchOutput as jest.MockedFunction<
  typeof createResearchOutput
>;

const mockUpdateResearchOutput =
  updateTeamResearchOutput as jest.MockedFunction<
    typeof updateTeamResearchOutput
  >;

const mandatoryFields = async (
  {
    link = 'http://example.com',
    title = 'example title',
    descriptionMD = 'example description',
    type = 'Preprint',
    doi = '10.1234',
  }: {
    link?: string;
    title?: string;
    descriptionMD?: string;
    type?: string;
    doi?: string;
  },
  isLinkRequired: boolean = true,
) => {
  const url = isLinkRequired ? /url \(required\)/i : /url \(optional\)/i;

  userEvent.type(screen.getByRole('textbox', { name: url }), link);
  userEvent.type(screen.getByRole('textbox', { name: /title/i }), title);
  userEvent.type(
    screen.getByRole('textbox', { name: /description/i }),
    descriptionMD,
  );

  const typeInput = screen.getByRole('textbox', {
    name: /Select the type/i,
  });
  userEvent.type(typeInput, type);
  userEvent.type(typeInput, specialChars.enter);

  const identifier = screen.getByRole('textbox', { name: /identifier/i });
  userEvent.type(identifier, 'DOI');
  userEvent.type(identifier, specialChars.enter);
  userEvent.type(
    screen.getByPlaceholderText('DOI number e.g. 10.5555/YFRU1371'),
    doi,
  );
  userEvent.click(screen.getByRole('textbox', { name: /Authors/i }));
  userEvent.click(screen.getByText('Person A 3'));

  userEvent.click(screen.getByRole('textbox', { name: /Teams/i }));
  userEvent.click(screen.getByText('Abu-Remaileh, M 1'));
  const button = screen.getByRole('button', { name: /Publish/i });
  const saveDraftButton = screen.getByRole('button', { name: /Save Draft/i });
  return {
    publish: async () => {
      userEvent.click(button);
      await waitFor(() => {
        expect(button).toBeEnabled();
      });
    },
    saveDraft: async () => {
      userEvent.click(saveDraftButton);
      await waitFor(() => {
        expect(saveDraftButton).toBeEnabled();
      });
    },
  };
};

const baseUser = createUserResponse();
const renderPage = async ({
  user = {
    ...baseUser,
    workingGroups: [
      { ...baseUser.workingGroups[0]!, id: 'wg1', role: 'Project Manager' },
    ],
  },
  workingGroupId = 'wg1',
  workingGroupOutputDocumentType = 'article',
  researchOutputData,
  history = createMemoryHistory({
    initialEntries: [
      network({})
        .workingGroups({})
        .workingGroup({ workingGroupId })
        .createOutput({ workingGroupOutputDocumentType }).$,
    ],
  }),
}: {
  user?: UserResponse;
  workingGroupId?: string;
  workingGroupOutputDocumentType?: WorkingGroupOutputDocumentTypeParameter;
  canEditResearchOutput?: boolean;
  researchOutputData?: ResearchOutputResponse;
  history?: History;
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
        <ToastContext.Provider value={mockToast}>
          <Auth0Provider user={user}>
            <WhenReady>
              <Router history={history}>
                <Route path={path}>
                  <WorkingGroupOutput
                    workingGroupId={workingGroupId}
                    researchOutputData={researchOutputData}
                  />
                </Route>
              </Router>
            </WhenReady>
          </Auth0Provider>
        </ToastContext.Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

it('Renders the working group research output form with relevant fields', async () => {
  await renderPage({
    workingGroupOutputDocumentType: 'article',
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

it('can submit a form when form data is valid', async () => {
  const workingGroupId = 'wg1';
  const link = 'https://example42.com';
  const title = 'example42 title';
  const descriptionMD = 'example42 description';
  const type = 'Preprint';
  const doi = '10.0777';
  const workingGroupOutputDocumentType = 'article';

  const history = createMemoryHistory({
    initialEntries: [
      network({})
        .workingGroups({})
        .workingGroup({ workingGroupId })
        .createOutput({ workingGroupOutputDocumentType }).$,
    ],
  });

  await renderPage({
    workingGroupId,
    workingGroupOutputDocumentType,
    history,
  });

  const { publish } = await mandatoryFields({
    link,
    title,
    descriptionMD,
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
      tags: [],
      sharingStatus: 'Network Only',
      teams: ['t0'],
      link,
      title,
      descriptionMD,
      description: '',
      type,
      labs: ['l0'],
      authors: [
        {
          userId: 'user-id-2',
        },
      ],
      relatedResearch: [],
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
    },
    expect.anything(),
    true,
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
  const type = 'Preprint';
  const doi = '10.0777';
  const workingGroupOutputDocumentType = 'article';

  const history = createMemoryHistory({
    initialEntries: [
      network({})
        .workingGroups({})
        .workingGroup({ workingGroupId })
        .createOutput({ workingGroupOutputDocumentType }).$,
    ],
  });

  await renderPage({
    workingGroupId,
    workingGroupOutputDocumentType,
    history,
  });

  const { saveDraft } = await mandatoryFields({
    link,
    title,
    descriptionMD,
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
      tags: [],
      sharingStatus: 'Network Only',
      teams: ['t0'],
      link,
      title,
      descriptionMD,
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
      workingGroups: ['wg1'],
      publishDate: undefined,
      subtype: undefined,
      usageNotes: '',
      asapFunded: undefined,
      usedInPublication: undefined,
    },
    expect.anything(),
    false,
  );
  await waitFor(() => {
    expect(history.location.pathname).toBe(
      '/shared-research/research-output-id',
    );
  });
});

it('displays sorry page when user does not have editing permissions', async () => {
  await renderPage({
    user: {
      ...baseUser,
      workingGroups: [{ ...baseUser.workingGroups[0]!, role: 'Member' }],
    },
    canEditResearchOutput: false,
    researchOutputData: {
      ...createResearchOutputResponse(),
      published: true,
    },
  });
  expect(screen.getByText(/sorry.+page/i)).toBeVisible();
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
    workingGroupOutputDocumentType: 'article',
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
  expect(mockToast).not.toHaveBeenCalled();
});

it('will toast server side errors for unknown errors', async () => {
  mockCreateResearchOutput.mockRejectedValue(new Error('Something went wrong'));

  await renderPage({
    workingGroupOutputDocumentType: 'article',
  });

  const { publish } = await mandatoryFields({}, true);

  await publish();

  expect(mockCreateResearchOutput).toHaveBeenCalled();
  expect(mockToast).toHaveBeenCalledWith(
    'There was an error and we were unable to save your changes. Please try again.',
  );
});

it.each([
  { status: 'draft', buttonName: 'Save Draft', published: false },
  { status: 'published', buttonName: 'Save', published: true },
  { status: 'draft', buttonName: 'Publish', published: false },
])(
  'can edit a $status working group research output',
  async ({ buttonName, published }) => {
    const id = 'RO-ID';
    const workingGroupId = 'wg1';
    const link = 'https://example42.com';
    const title = 'example42 title';
    const descriptionMD = 'example42 description';
    const workingGroupOutputDocumentType = 'report';

    const history = createMemoryHistory({
      initialEntries: [
        network({})
          .workingGroups({})
          .workingGroup({ workingGroupId })
          .createOutput({ workingGroupOutputDocumentType }).$,
      ],
    });
    await renderPage({
      workingGroupId,
      workingGroupOutputDocumentType,
      researchOutputData: {
        ...createResearchOutputResponse(),
        id,
        link,
        title,
        descriptionMD,
        published,
      },
      history,
    });

    const button = screen.getByRole('button', { name: buttonName });
    userEvent.click(button);
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
        workingGroups: [workingGroupId],
      }),
      expect.anything(),
      published,
    );
  },
);
