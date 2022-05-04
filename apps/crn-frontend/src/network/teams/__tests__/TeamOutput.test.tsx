import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import {
  ResearchOutputDocumentType,
  ValidationErrorResponse,
} from '@asap-hub/model';
import { ToastContext, useFlags } from '@asap-hub/react-context';
import { network, OutputDocumentTypeParameter } from '@asap-hub/routing';
import { fireEvent } from '@testing-library/dom';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import { ContextType, Suspense } from 'react';
import { Route, StaticRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { BackendError } from '../../../api-util';
import { createTeamResearchOutput } from '../api';
import { refreshTeamState } from '../state';
import TeamOutput, {
  paramOutputDocumentTypeToResearchOutputDocumentType,
} from '../TeamOutput';

jest.mock('../api');
jest.mock('../../users/api');

const ENTER_KEYCODE = 13;

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
  featureFlagEnabled?: boolean;
}

const renderPage = async ({
  featureFlagEnabled = true,
  teamId,
  outputDocumentType = 'bioinformatics',
}: RenderPageOptions) => {
  const {
    result: {
      current: { disable, enable },
    },
  } = renderHook(useFlags);

  if (featureFlagEnabled) {
    enable('ROMS_FORM');
  } else {
    disable('ROMS_FORM');
  }

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
                <Route path={path}>
                  <TeamOutput teamId={teamId} />
                </Route>
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

it('Shows NotFoundPage when feature flag is off', async () => {
  const teamId = 'team-id';
  await renderPage({ teamId, featureFlagEnabled: false });
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

  await renderPage({ teamId, outputDocumentType: 'lab-resource' });

  fireEvent.change(screen.getByLabelText(/url/i), {
    target: { value: 'http://example.com' },
  });
  fireEvent.change(screen.getByLabelText(/title/i), {
    target: { value: 'example title' },
  });
  fireEvent.change(screen.getByLabelText(/description/i), {
    target: { value: 'example description' },
  });
  userEvent.type(screen.getByLabelText(/Select the option/i), 'Animal Model');
  fireEvent.keyDown(screen.getByLabelText(/Select the option/i), {
    keyCode: ENTER_KEYCODE,
  });

  userEvent.click(screen.getByLabelText(/Labs/i));
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  userEvent.click(screen.getByText('Example 1 Lab'));

  userEvent.click(screen.getByLabelText(/Authors/i));
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  userEvent.click(screen.getByText('Person A 3'));

  const button = screen.getByRole('button', { name: /Publish/i });

  userEvent.click(button);

  await waitFor(() => {
    expect(mockCreateTeamResearchOutput).toHaveBeenCalledWith(
      {
        documentType: 'Lab Resource',
        addedDate: expect.anything(),
        tags: [],
        asapFunded: false,
        usedInPublication: false,
        sharingStatus: 'Network Only',
        teams: ['team-id'],
        link: 'http://example.com',
        title: 'example title',
        description: 'example description',
        type: 'Animal Model',
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
    expect(button).toBeEnabled();
  });
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

  fireEvent.change(screen.getByLabelText(/url/i), {
    target: { value: 'http://example.com' },
  });
  fireEvent.change(screen.getByLabelText(/title/i), {
    target: { value: 'example title' },
  });
  fireEvent.change(screen.getByLabelText(/description/i), {
    target: { value: 'example description' },
  });
  userEvent.type(screen.getByLabelText(/Select the option/i), 'Preprint');

  const button = screen.getByRole('button', { name: /Publish/i });
  userEvent.click(button);

  await waitFor(() => {
    expect(mockCreateTeamResearchOutput).toHaveBeenCalled();
    expect(button).toBeEnabled();
  });
  expect(
    screen.getByText(
      'A Research Output with this URL already exists. Please enter a different URL.',
    ),
  ).toBeVisible();

  userEvent.type(screen.getByLabelText(/url/i), 'a');
  fireEvent.focusOut(screen.getByLabelText(/url/i));

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

  fireEvent.change(screen.getByLabelText(/url/i), {
    target: { value: 'http://example.com' },
  });
  fireEvent.change(screen.getByLabelText(/title/i), {
    target: { value: 'example title' },
  });
  fireEvent.change(screen.getByLabelText(/description/i), {
    target: { value: 'example description' },
  });
  userEvent.type(screen.getByLabelText(/Select the option/i), 'Preprint');

  const button = screen.getByRole('button', { name: /Publish/i });
  userEvent.click(button);

  await waitFor(() => {
    expect(mockCreateTeamResearchOutput).toHaveBeenCalled();
    expect(button).toBeEnabled();
  });
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
