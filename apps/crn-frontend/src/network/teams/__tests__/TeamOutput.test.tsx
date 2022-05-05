import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import {
  ResearchOutputDocumentType,
  ValidationErrorResponse,
} from '@asap-hub/model';
import {
  ResearchOutputPermissionsContext,
  ToastContext,
} from '@asap-hub/react-context';
import { network, OutputDocumentTypeParameter } from '@asap-hub/routing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContextType, Suspense } from 'react';
import { Route, StaticRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { BackendError } from '@asap-hub/frontend-utils';
import { createTeamResearchOutput } from '../api';
import { refreshTeamState } from '../state';
import TeamOutput, {
  paramOutputDocumentTypeToResearchOutputDocumentType,
} from '../TeamOutput';

jest.mock('../api');
jest.mock('../../users/api');

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
  canCreate?: boolean;
}

const renderPage = async ({
  canCreate = true,
  teamId,
  outputDocumentType = 'bioinformatics',
}: RenderPageOptions) => {
  const path =
    network.template +
    network({}).teams.template +
    network({}).teams({}).team.template +
    network({}).teams({}).team({ teamId }).createOutput.template;

  const result = render(
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
                  value={{ canCreate }}
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
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

it('Renders the research output', async () => {
  const teamId = 'team-id';
  await renderPage({ teamId, outputDocumentType: 'bioinformatics' });

  expect(
    screen.getByRole('heading', { name: /Share bioinformatics/i }),
  ).toBeInTheDocument();
});

it('switches research output type based on parameter', async () => {
  const teamId = 'team-id';
  await renderPage({ teamId, outputDocumentType: 'article' });

  expect(
    screen.getByRole('heading', { name: /Share an article/i }),
  ).toBeInTheDocument();
});

it('Shows NotFoundPage when canCreate in ResearchOutputPermissions is false', async () => {
  const teamId = 'team-id';
  await renderPage({ teamId, canCreate: false });
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
  const teamId = 'team-id';
  const link = 'https://example.com';
  const title = 'example title';
  const description = 'example description';
  const type = 'Animal Model';
  const doi = '10.1234';

  await renderPage({ teamId, outputDocumentType: 'lab-resource' });

  userEvent.type(
    screen.getByRole('textbox', { name: /url \(optional\)/i }),
    link,
  );
  userEvent.type(screen.getByRole('textbox', { name: /title/i }), title);
  userEvent.type(
    screen.getByRole('textbox', { name: /description/i }),
    description,
  );

  userEvent.type(
    screen.getByRole('textbox', { name: /Select the option/i }),
    type,
  );

  userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
  userEvent.click(screen.getByText('Example 1 Lab'));
  userEvent.click(screen.getByRole('textbox', { name: /Authors/i }));
  userEvent.click(screen.getByText('Person A 3'));

  userEvent.type(screen.getByRole('textbox', { name: /identifier/i }), 'DOI');
  userEvent.tab();
  const doiTextBox = await screen.findByRole('textbox', {
    name: /Your DOI must start with/i,
  });
  userEvent.type(doiTextBox, doi);

  const button = screen.getByRole('button', { name: /Publish/i });

  userEvent.click(button);

  await waitFor(() => {
    expect(button).toBeEnabled();
  });
  expect(mockCreateTeamResearchOutput).toHaveBeenCalledWith(
    {
      doi,
      documentType: 'Lab Resource',
      addedDate: expect.anything(),
      tags: [],
      asapFunded: false,
      usedInPublication: false,
      sharingStatus: 'Network Only',
      teams: ['team-id'],
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
  const teamId = 'team-id';
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

  await renderPage({ teamId, outputDocumentType: 'article' });

  userEvent.type(
    screen.getByRole('textbox', { name: /URL \(required\)/i }),
    'http://example.com',
  );
  userEvent.type(
    screen.getByRole('textbox', { name: /title/i }),
    'example title',
  );
  userEvent.type(
    screen.getByRole('textbox', { name: /description/i }),
    'example description',
  );

  userEvent.type(
    screen.getByRole('textbox', { name: /Select the option/i }),
    'Preprint',
  );

  userEvent.type(screen.getByRole('textbox', { name: /identifier/i }), 'DOI');
  userEvent.tab();
  const doiTextBox = await screen.findByRole('textbox', {
    name: /Your DOI must start with/i,
  });
  userEvent.type(doiTextBox, '10.1234');

  const button = screen.getByRole('button', { name: /Publish/i });
  userEvent.click(button);

  await waitFor(() => {
    expect(button).toBeEnabled();
  });
  expect(mockCreateTeamResearchOutput).toHaveBeenCalled();
  expect(
    screen.getByText(
      'A Research Output with this URL already exists. Please enter a different URL.',
    ),
  ).toBeVisible();

  userEvent.type(
    screen.getByRole('textbox', { name: /URL \(required\)/i }),
    'a',
  );
  userEvent.tab();

  expect(
    screen.queryByText(
      'A Research Output with this URL already exists. Please enter a different URL.',
    ),
  ).toBeNull();
  expect(mockToast).not.toHaveBeenCalled();
});

it('will toast server side errors for unknown errors', async () => {
  const teamId = 'team-id';

  mockCreateTeamResearchOutput.mockRejectedValue(
    new Error('Something went wrong'),
  );

  await renderPage({ teamId, outputDocumentType: 'article' });

  userEvent.type(
    screen.getByRole('textbox', { name: /URL \(required\)/i }),
    'http://example.com',
  );
  userEvent.type(
    screen.getByRole('textbox', { name: /title/i }),
    'example title',
  );
  userEvent.type(
    screen.getByRole('textbox', { name: /description/i }),
    'example description',
  );
  userEvent.type(
    screen.getByRole('textbox', { name: /Select the option/i }),
    'Preprint',
  );

  userEvent.type(screen.getByRole('textbox', { name: /identifier/i }), 'DOI');
  userEvent.tab();
  const doiTextBox = await screen.findByRole('textbox', {
    name: /Your DOI must start with/i,
  });
  userEvent.type(doiTextBox, '10.1234');

  const button = screen.getByRole('button', { name: /Publish/i });
  userEvent.click(button);

  await waitFor(() => {
    expect(button).toBeEnabled();
  });
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
