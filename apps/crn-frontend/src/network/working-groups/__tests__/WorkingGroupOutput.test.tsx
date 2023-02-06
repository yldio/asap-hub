import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { BackendError } from '@asap-hub/frontend-utils';
import {
  ResearchOutputResponse,
  ValidationErrorResponse,
} from '@asap-hub/model';
import {
  ResearchOutputPermissionsContext,
  ToastContext,
} from '@asap-hub/react-context';
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
  isLinkRequired: boolean = true,
) => {
  const url = isLinkRequired ? /url \(required\)/i : /url \(optional\)/i;

  userEvent.type(screen.getByRole('textbox', { name: url }), link);
  userEvent.type(screen.getByRole('textbox', { name: /title/i }), title);
  userEvent.type(
    screen.getByRole('textbox', { name: /description/i }),
    description,
  );

  const typeInput = screen.getByRole('textbox', {
    name: /Select the option/i,
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
  return {
    publish: async () => {
      userEvent.click(button);
      await waitFor(() => {
        expect(button).toBeEnabled();
      });
    },
  };
};

const renderPage = async ({
  canCreateUpdate = true,
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
  workingGroupId?: string;
  workingGroupOutputDocumentType?: WorkingGroupOutputDocumentTypeParameter;
  canCreateUpdate?: boolean;
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
          <Auth0Provider user={{}}>
            <WhenReady>
              <Router history={history}>
                <ResearchOutputPermissionsContext.Provider
                  value={{ canCreateUpdate }}
                >
                  <Route path={path}>
                    <WorkingGroupOutput
                      workingGroupId={workingGroupId}
                      researchOutputData={researchOutputData}
                    />
                  </Route>
                </ResearchOutputPermissionsContext.Provider>
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
    workingGroupId: '42',
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

it('Shows NotFoundPage when canCreate in ResearchOutputPermissions is false', async () => {
  await renderPage({ workingGroupId: '42', canCreateUpdate: false });
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
  const workingGroupId = 'wg-42';
  const link = 'https://example42.com';
  const title = 'example42 title';
  const description = 'example42 description';
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
    description,
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
      description,
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
      workingGroups: ['wg-42'],
      publishDate: undefined,
      subtype: undefined,
      usageNotes: '',
      asapFunded: undefined,
      usedInPublication: undefined,
      publishingEntity: 'Working Group',
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
    workingGroupId: '42',
    workingGroupOutputDocumentType: 'article',
  });
  const { publish } = await mandatoryFields({}, true);

  await publish();

  expect(mockCreateResearchOutput).toHaveBeenCalled();
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
  mockCreateResearchOutput.mockRejectedValue(new Error('Something went wrong'));

  await renderPage({
    workingGroupId: '42',
    workingGroupOutputDocumentType: 'article',
  });

  const { publish } = await mandatoryFields({}, true);

  await publish();

  expect(mockCreateResearchOutput).toHaveBeenCalled();
  expect(mockToast).toHaveBeenCalledWith(
    'There was an error and we were unable to save your changes. Please try again.',
  );
});

it('can edit a report working group research output', async () => {
  const id = 'RO-ID';
  const workingGroupId = 'wg-42';
  const link = 'https://example42.com';
  const title = 'example42 title';
  const description = 'example42 description';
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
      description,
    },
    history,
  });

  const button = screen.getByRole('button', { name: /Save/i });
  userEvent.click(button);
  await waitFor(() => {
    expect(button).toBeEnabled();
    expect(history.location.pathname).toBe(
      '/shared-research/research-output-id',
    );
  });

  expect(mockUpdateResearchOutput).toHaveBeenCalledWith(
    id,
    expect.objectContaining({
      documentType: 'Report',
      link,
      title,
      description,
      workingGroups: [workingGroupId],
      publishingEntity: 'Working Group',
    }),
    expect.anything(),
  );
});
