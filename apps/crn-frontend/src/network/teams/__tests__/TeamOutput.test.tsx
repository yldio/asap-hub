import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { BackendError } from '@asap-hub/frontend-utils';
import {
  ResearchOutputDocumentType,
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
import userEvent from '@testing-library/user-event';
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
  }

  it('Renders the research output', async () => {
    await renderPage({ teamId: '42', outputDocumentType: 'bioinformatics' });

    expect(
      screen.getByRole('heading', { name: /Share bioinformatics/i }),
    ).toBeInTheDocument();
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
        asapFunded: false,
        usedInPublication: false,
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
                      <TeamOutput teamId={teamId} />
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
) {
  const url = isLinkRequired ? /url \(required\)/i : /url \(optional\)/i;

  userEvent.type(screen.getByRole('textbox', { name: url }), link);
  userEvent.type(screen.getByRole('textbox', { name: /title/i }), title);
  userEvent.type(
    screen.getByRole('textbox', { name: /description/i }),
    description,
  );

  userEvent.type(
    screen.getByRole('textbox', { name: /Select the option/i }),
    type,
  );

  const identifier = screen.getByRole('textbox', { name: /identifier/i });
  userEvent.type(identifier, 'DOI');
  identifier.blur();
  userEvent.type(
    await screen.findByRole('textbox', {
      name: /Your DOI must start with/i,
    }),
    doi,
  );
  const button = screen.getByRole('button', { name: /Publish/i });
  return {
    publish: async () => {
      userEvent.click(button);
      await waitFor(() => {
        expect(button).toBeEnabled();
      });
    },
  };
}
