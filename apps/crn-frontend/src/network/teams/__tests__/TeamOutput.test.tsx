import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { BackendError } from '@asap-hub/frontend-utils';
import {
  ResearchOutputDocumentType,
  ResearchOutputResponse,
  ValidationErrorResponse,
} from '@asap-hub/model';
import {
  ResearchOutputPermissionsContext,
  ToastContext,
} from '@asap-hub/react-context';
import { network, OutputDocumentTypeParameter } from '@asap-hub/routing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent, { specialChars } from '@testing-library/user-event';
import { ContextType, Suspense } from 'react';
import { Route, StaticRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { createTeamResearchOutput } from '../api';
import { refreshTeamState } from '../state';
import TeamOutput, {
  paramOutputDocumentTypeToResearchOutputDocumentType,
} from '../TeamOutput';

jest.setTimeout(30000);
jest.mock('../api');
jest.mock('../../users/api');
jest.mock('../../../shared-research/api');

describe('TeamOutput', () => {
  const mockToast = jest.fn() as jest.MockedFunction<
    ContextType<typeof ToastContext>
  >;
  const mockCreateTeamResearchOutput =
    createTeamResearchOutput as jest.MockedFunction<
      typeof createTeamResearchOutput
    >;

  interface RenderPageOptions {
    teamId: string;
    outputDocumentType?: OutputDocumentTypeParameter;
    canCreateUpdate?: boolean;
    researchOutputData?: ResearchOutputResponse;
  }

  it('Renders the research output', async () => {
    await renderPage({ teamId: '42', outputDocumentType: 'bioinformatics' });

    expect(
      screen.getByRole('heading', { name: /Share bioinformatics/i }),
    ).toBeInTheDocument();
  });

  it('Renders the correct button in create mode', async () => {
    await renderPage({
      teamId: '42',
      outputDocumentType: 'bioinformatics',
    });

    expect(
      screen.getByRole('button', { name: /Publish/i }),
    ).toBeInTheDocument();
  });

  it('Renders the correct button in edit mode', async () => {
    await renderPage({
      teamId: '42',
      outputDocumentType: 'bioinformatics',
      researchOutputData: createResearchOutputResponse(),
    });

    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
  });

  it('switches research output type based on parameter', async () => {
    await renderPage({ teamId: '42', outputDocumentType: 'article' });

    expect(
      screen.getByRole('heading', { name: /Share an article/i }),
    ).toBeInTheDocument();
  });

  it('Shows NotFoundPage when canCreate in ResearchOutputPermissions is false', async () => {
    await renderPage({ teamId: '42', canCreateUpdate: false });
    expect(
      screen.queryByRole('heading', { name: /Share/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /Sorry! We can’t seem to find that page/i,
      }),
    ).toBeInTheDocument();
  });

  it('can submit a form when form data is valid', async () => {
    const teamId = 'team-42';
    const link = 'https://example42.com';
    const title = 'example42 title';
    const description = 'example42 description';
    const type = 'Animal Model';
    const doi = '10.0777';

    await renderPage({ teamId, outputDocumentType: 'lab-resource' });

    const { publish } = await mandatoryFields({
      link,
      title,
      description,
      type,
      doi,
    });

    userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
    userEvent.click(screen.getByText('Example 1 Lab'));
    userEvent.click(screen.getByRole('textbox', { name: /Authors/i }));
    userEvent.click(screen.getByText('Person A 3'));

    await publish();

    expect(mockCreateTeamResearchOutput).toHaveBeenCalledWith(
      {
        doi,
        documentType: 'Lab Resource',
        addedDate: expect.anything(),
        tags: [],
        sharingStatus: 'Network Only',
        teams: [teamId],
        link,
        title,
        description,
        type,
        labs: ['l0'],
        authors: [
          {
            userId: 'u2',
          },
        ],
        methods: [],
        organisms: [],
        environments: [],
        labCatalogNumber: undefined,
        publishDate: undefined,
        subtype: undefined,
        usageNotes: '',
        asapFunded: undefined,
        usedInPublication: undefined,
      },
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

    mockCreateTeamResearchOutput.mockRejectedValue(
      new BackendError('example', validationResponse, 400),
    );

    await renderPage({ teamId: '42', outputDocumentType: 'article' });
    const { publish } = await mandatoryFields({}, true);

    await publish();

    expect(mockCreateTeamResearchOutput).toHaveBeenCalled();
    expect(
      screen.getByText(
        'A Research Output with this URL already exists. Please enter a different URL.',
      ),
    ).toBeVisible();

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
    mockCreateTeamResearchOutput.mockRejectedValue(
      new Error('Something went wrong'),
    );

    await renderPage({ teamId: '42', outputDocumentType: 'article' });

    const { publish } = await mandatoryFields({}, true);

    await publish();

    expect(mockCreateTeamResearchOutput).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith(
      'There was an error and we were unable to save your changes. Please try again.',
    );
  });

  it('will toast server side errors for unknown errors in edit mode', async () => {
    const link = 'https://example42.com';
    const title = 'example42 title';
    const description = 'example42 description';
    const type = 'Animal Model';
    const doi = '10.0777';

    mockCreateTeamResearchOutput.mockRejectedValue(
      new Error('Something went wrong'),
    );

    await renderPage({
      teamId: '42',
      outputDocumentType: 'article',
      researchOutputData: { ...createResearchOutputResponse(), doi },
    });

    const { publish } = await mandatoryFields(
      {
        link,
        title,
        description,
        type,
        doi,
      },
      true,
      true,
    );

    await publish();

    expect(mockCreateTeamResearchOutput).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith(
      'There was an error and we were unable to save your changes. Please try again.',
    );
  });

  it.each<{
    param: OutputDocumentTypeParameter;
    outputType: ResearchOutputDocumentType;
  }>([
    { param: 'article', outputType: 'Article' },
    { param: 'bioinformatics', outputType: 'Bioinformatics' },
    { param: 'dataset', outputType: 'Dataset' },
    { param: 'lab-resource', outputType: 'Lab Resource' },
    { param: 'protocol', outputType: 'Protocol' },
    { param: 'unknown' as OutputDocumentTypeParameter, outputType: 'Article' },
  ])('maps from $param to $outputType', ({ param, outputType }) => {
    expect(paramOutputDocumentTypeToResearchOutputDocumentType(param)).toEqual(
      outputType,
    );
  });

  async function renderPage({
    canCreateUpdate = true,
    teamId,
    outputDocumentType = 'bioinformatics',
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
          <ToastContext.Provider value={mockToast}>
            <Auth0Provider user={{}}>
              <WhenReady>
                <StaticRouter
                  location={
                    network({})
                      .teams({})
                      .team({ teamId })
                      .createOutput({ outputDocumentType }).$
                  }
                >
                  <ResearchOutputPermissionsContext.Provider
                    value={{ canCreateUpdate }}
                  >
                    <Route path={path}>
                      <TeamOutput
                        teamId={teamId}
                        researchOutputData={researchOutputData}
                      />
                    </Route>
                  </ResearchOutputPermissionsContext.Provider>
                </StaticRouter>
              </WhenReady>
            </Auth0Provider>
          </ToastContext.Provider>
        </Suspense>
      </RecoilRoot>,
    );
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  }
});
async function mandatoryFields(
  {
    link = 'http://example.com',
    title = 'example title',
    description = 'example description',
    type = 'Preprint',
    doi = '10.1234',
  }: {
    link?: string;
    title?: string;
    description?: string;
    type?: string;
    doi?: string;
  },
  isLinkRequired: boolean = false,
  isEditMode: boolean = false,
) {
  const url = isLinkRequired ? /url \(required\)/i : /url \(optional\)/i;

  userEvent.type(screen.getByRole('textbox', { name: url }), link);
  userEvent.type(screen.getByRole('textbox', { name: /title/i }), title);
  userEvent.type(
    screen.getByRole('textbox', { name: /description/i }),
    description,
  );

  const typeInput = screen.getByRole('textbox', { name: /Select the option/i });
  userEvent.type(typeInput, type);
  userEvent.type(typeInput, specialChars.enter);

  const identifier = screen.getByRole('textbox', { name: /identifier/i });
  userEvent.type(identifier, 'DOI');
  userEvent.type(identifier, specialChars.enter);
  userEvent.type(
    screen.getByPlaceholderText('DOI number e.g. 10.5555/YFRU1371'),
    doi,
  );
  const button = isEditMode
    ? screen.getByRole('button', { name: /Save/i })
    : screen.getByRole('button', { name: /Publish/i });
  return {
    publish: async () => {
      userEvent.click(button);
      await waitFor(() => {
        expect(button).toBeEnabled();
      });
    },
  };
}
