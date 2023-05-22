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
import { network, TeamOutputDocumentTypeParameter } from '@asap-hub/routing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent, { specialChars } from '@testing-library/user-event';
import { Suspense } from 'react';
import { Route, StaticRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import {
  createResearchOutput,
  updateTeamResearchOutput,
  getTeam,
} from '../api';
import { refreshTeamState } from '../state';
import TeamOutput from '../TeamOutput';

jest.setTimeout(30000);
jest.mock('../api');
jest.mock('../../users/api');
jest.mock('../../../shared-research/api');

beforeEach(() => {
  window.scrollTo = jest.fn();
});

const baseUser = createUserResponse();
const baseResearchOutput: ResearchOutputResponse = {
  ...createResearchOutputResponse(),
  teams: [
    {
      id: '42',
      displayName: 'Jakobsson, J',
    },
  ],
};

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
  isLinkRequired: boolean = false,
  isEditMode: boolean = false,
  published: boolean = true,
) => {
  const url = isLinkRequired ? /url \(required\)/i : /url \(optional\)/i;

  userEvent.type(screen.getByRole('textbox', { name: url }), link);
  userEvent.type(screen.getByRole('textbox', { name: /title/i }), title);
  userEvent.type(
    screen.getByRole('textbox', { name: /description/i }),
    descriptionMD,
  );

  const typeInput = screen.getByRole('textbox', { name: /Select the type/i });
  userEvent.type(typeInput, type);
  userEvent.type(typeInput, specialChars.enter);

  const identifier = screen.getByRole('textbox', { name: /identifier/i });
  userEvent.type(identifier, 'DOI');
  userEvent.type(identifier, specialChars.enter);
  userEvent.type(
    screen.getByPlaceholderText('DOI number e.g. 10.5555/YFRU1371'),
    doi,
  );
  const button =
    isEditMode && published
      ? screen.getByRole('button', { name: /Save/i })
      : screen.getByRole('button', { name: /Publish/i });
  const saveDraftButton = screen.queryByRole('button', { name: /Save Draft/i });
  return {
    publish: async () => {
      userEvent.click(button);
      await waitFor(() => {
        expect(button).toBeEnabled();
      });
    },
    saveDraft: async () => {
      if (saveDraftButton) {
        userEvent.click(saveDraftButton);
        await waitFor(() => {
          expect(saveDraftButton).toBeEnabled();
        });
      }
    },
  };
};

const mockCreateResearchOutput = createResearchOutput as jest.MockedFunction<
  typeof createResearchOutput
>;

const mockGetTeam = getTeam as jest.MockedFunction<typeof getTeam>;

const mockUpdateResearchOutput =
  updateTeamResearchOutput as jest.MockedFunction<
    typeof updateTeamResearchOutput
  >;

interface RenderPageOptions {
  user?: UserResponse;
  teamId: string;
  teamOutputDocumentType?: TeamOutputDocumentTypeParameter;
  researchOutputData?: ResearchOutputResponse;
}

it('Renders the research output', async () => {
  await renderPage({
    teamId: '42',
    teamOutputDocumentType: 'bioinformatics',
  });

  expect(
    screen.getByRole('heading', { name: /Share bioinformatics/i }),
  ).toBeInTheDocument();
});

it('Shows the not found page if the team does not exist', async () => {
  mockGetTeam.mockResolvedValueOnce(undefined);
  await renderPage({
    teamId: '42',
    teamOutputDocumentType: 'bioinformatics',
  });
  expect(screen.getByText(/Sorry.+page/i)).toBeVisible();
});

it('displays the publish button for new research outputs', async () => {
  await renderPage({
    teamId: '42',
    teamOutputDocumentType: 'bioinformatics',
  });

  expect(screen.getByRole('button', { name: /Publish/i })).toBeInTheDocument();
});

it('displays the save button for existing research outputs', async () => {
  await renderPage({
    teamId: '42',
    teamOutputDocumentType: 'bioinformatics',
    researchOutputData: baseResearchOutput,
  });

  expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
});

it('switches research output type based on parameter', async () => {
  await renderPage({ teamId: '42', teamOutputDocumentType: 'article' });

  expect(
    screen.getByRole('heading', { name: /Share an article/i }),
  ).toBeInTheDocument();
});

it('can publish a form when the data is valid', async () => {
  const teamId = '42';
  const link = 'https://example42.com';
  const title = 'example42 title';
  const descriptionMD = 'example42 description';
  const type = 'Animal Model';
  const doi = '10.0777';

  await renderPage({ teamId, teamOutputDocumentType: 'lab-resource' });

  const { publish } = await mandatoryFields({
    link,
    title,
    descriptionMD,
    type,
    doi,
  });

  userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
  userEvent.click(screen.getByText('Example 1 Lab'));
  userEvent.click(screen.getByRole('textbox', { name: /Authors/i }));
  userEvent.click(screen.getByText('Person A 3'));

  await publish();

  expect(mockCreateResearchOutput).toHaveBeenCalledWith(
    {
      doi,
      documentType: 'Lab Resource',
      sharingStatus: 'Network Only',
      teams: [teamId],
      link,
      title,
      description: '',
      descriptionMD,
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
      workingGroups: [],
      relatedResearch: [],
      labCatalogNumber: undefined,
      publishDate: undefined,
      subtype: undefined,
      usageNotes: '',
      asapFunded: undefined,
      usedInPublication: undefined,
      published: true,
    },
    expect.anything(),
  );
});

it('can save draft when form data is valid', async () => {
  const teamId = '42';
  const link = 'https://example42.com';
  const title = 'example42 title';
  const descriptionMD = 'example42 description';
  const type = 'Animal Model';
  const doi = '10.0777';

  await renderPage({ teamId, teamOutputDocumentType: 'lab-resource' });

  const { saveDraft } = await mandatoryFields({
    link,
    title,
    descriptionMD,
    type,
    doi,
  });

  userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
  userEvent.click(screen.getByText('Example 1 Lab'));
  userEvent.click(screen.getByRole('textbox', { name: /Authors/i }));
  userEvent.click(screen.getByText('Person A 3'));

  await saveDraft();

  expect(mockCreateResearchOutput).toHaveBeenCalledWith(
    {
      doi,
      documentType: 'Lab Resource',
      sharingStatus: 'Network Only',
      teams: [teamId],
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
      workingGroups: [],
      relatedResearch: [],
      labCatalogNumber: undefined,
      publishDate: undefined,
      subtype: undefined,
      usageNotes: '',
      asapFunded: undefined,
      usedInPublication: undefined,
      published: false,
    },
    expect.anything(),
  );
});

it('can edit a research output', async () => {
  const teamId = baseResearchOutput.teams[0]!.id;
  const { type, descriptionMD, title } = baseResearchOutput;
  const link = 'https://example42.com';
  const doi = '10.0777';

  await renderPage({
    teamId: '42',
    teamOutputDocumentType: 'article',
    researchOutputData: { ...baseResearchOutput, doi },
  });

  const { publish } = await mandatoryFields(
    {
      link,
      title: '',
      descriptionMD: '',
      type,
      doi,
    },
    true,
    true,
  );
  await publish();

  expect(mockUpdateResearchOutput).toHaveBeenCalledWith(
    baseResearchOutput.id,
    expect.objectContaining({
      link,
      title,
      descriptionMD,
      teams: [teamId],
    }),
    expect.anything(),
  );
});

it('can edit a draft research output', async () => {
  const researchOutput = baseResearchOutput;
  const teamId = researchOutput.teams[0]!.id;
  const { type, descriptionMD, title } = researchOutput;
  const link = 'https://example42.com';
  const doi = '10.0777';

  await renderPage({
    teamId: '42',
    teamOutputDocumentType: 'article',
    researchOutputData: { ...researchOutput, doi, published: false },
  });

  const { saveDraft } = await mandatoryFields(
    {
      link,
      title: '',
      descriptionMD: 'descriptionMD',
      type,
      doi,
    },
    true,
    true,
  );
  await saveDraft();

  expect(mockUpdateResearchOutput).toHaveBeenCalledWith(
    researchOutput.id,
    expect.objectContaining({
      link,
      title,
      descriptionMD,
      teams: [teamId],
    }),
    expect.anything(),
  );
});

it('can edit and publish a draft research output', async () => {
  const researchOutput = baseResearchOutput;
  const teamId = researchOutput.teams[0]!.id;
  const { type, title } = researchOutput;
  const link = 'https://example42.com';
  const doi = '10.0777';

  await renderPage({
    teamId: '42',
    teamOutputDocumentType: 'article',
    researchOutputData: { ...researchOutput, doi, published: false },
  });

  const initiallyPublished = false;
  const { publish } = await mandatoryFields(
    {
      link,
      title: '',
      type,
      doi,
    },
    true,
    true,
    initiallyPublished,
  );
  await publish();

  expect(mockUpdateResearchOutput).toHaveBeenCalledWith(
    researchOutput.id,
    expect.objectContaining({
      link,
      title,
      published: true,
      teams: [teamId],
    }),
    expect.anything(),
  );
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

  await renderPage({ teamId: '42', teamOutputDocumentType: 'article' });
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

  await renderPage({ teamId: '42', teamOutputDocumentType: 'article' });

  const { publish } = await mandatoryFields({}, true);

  await publish();

  expect(mockCreateResearchOutput).toHaveBeenCalled();
  expect(
    screen.queryByText(
      'There was an error and we were unable to save your changes. Please try again.',
    ),
  ).toBeInTheDocument();
  expect(window.scrollTo).toBeCalled();
});

it('will toast server side errors for unknown errors in edit mode', async () => {
  const link = 'https://example42.com';
  const title = 'example42 title';
  const descriptionMD = 'example42 description';
  const type = 'Animal Model';
  const doi = '10.0777';
  mockUpdateResearchOutput.mockRejectedValue(new Error('Something went wrong'));

  await renderPage({
    teamId: '42',
    teamOutputDocumentType: 'article',
    researchOutputData: { ...baseResearchOutput, doi },
  });

  const { publish } = await mandatoryFields(
    {
      link,
      title,
      descriptionMD,
      type,
      doi,
    },
    true,
    true,
  );
  await publish();

  expect(mockUpdateResearchOutput).toHaveBeenCalled();
  expect(
    screen.queryByText(
      'There was an error and we were unable to save your changes. Please try again.',
    ),
  ).toBeInTheDocument();
  expect(window.scrollTo).toBeCalled();
});

async function renderPage({
  user = {
    ...baseUser,
    teams: [{ ...baseUser.teams[0]!, id: '42', role: 'Project Manager' }],
  },
  teamId,
  teamOutputDocumentType = 'bioinformatics',
  researchOutputData,
}: RenderPageOptions) {
  const path =
    network.template +
    network({}).teams.template +
    network({}).teams({}).team.template +
    network({}).teams({}).team({ teamId }).createOutput.template;

  render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(refreshTeamState(teamId), Math.random())
      }
    >
      <Suspense fallback="loading">
        <Auth0Provider user={user}>
          <WhenReady>
            <StaticRouter
              location={
                network({})
                  .teams({})
                  .team({ teamId })
                  .createOutput({ teamOutputDocumentType }).$
              }
            >
              <Route path={path}>
                <TeamOutput
                  teamId={teamId}
                  researchOutputData={researchOutputData}
                />
              </Route>
            </StaticRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
}
