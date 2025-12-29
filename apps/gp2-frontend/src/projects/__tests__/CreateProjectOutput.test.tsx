import { mockActWarningsInConsole } from '@asap-hub/dom-test-utils';
import { gp2 } from '@asap-hub/fixtures';
import { BackendError } from '@asap-hub/frontend-utils';
import { ValidationErrorResponse } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getEvents } from '../../events/api';
import NotificationMessages from '../../NotificationMessages';
import { createOutput, getOutputs } from '../../outputs/api';
import { getContributingCohorts, getTags } from '../../shared/api';
import { getUsersAndExternalUsers } from '../../users/api';
import { getWorkingGroups } from '../../working-groups/api';
import {
  createEventListAlgoliaResponse,
  createOutputListAlgoliaResponse,
  createProjectListAlgoliaResponse,
} from '../../__fixtures__/algolia';
import { getProject, getProjects } from '../api';
import CreateProjectOutput from '../CreateProjectOutput';

jest.mock('../../events/api.ts');
jest.mock('../../outputs/api');
jest.mock('../../shared/api');
jest.mock('../../users/api');
jest.mock('../../working-groups/api');
jest.mock('../api');

jest.setTimeout(60000);

const mockCreateOutput = createOutput as jest.MockedFunction<
  typeof createOutput
>;

const mockGetOutputs = getOutputs as jest.MockedFunction<typeof getOutputs>;
const mockGetTags = getTags as jest.MockedFunction<typeof getTags>;
const mockGetContributingCohorts =
  getContributingCohorts as jest.MockedFunction<typeof getContributingCohorts>;

const mockGetWorkingGroups = getWorkingGroups as jest.MockedFunction<
  typeof getWorkingGroups
>;
const mockGetProjects = getProjects as jest.MockedFunction<typeof getProjects>;

const mockGetProjectById = getProject as jest.MockedFunction<typeof getProject>;
const mockGetEvents = getEvents as jest.MockedFunction<typeof getEvents>;
const mockGetUsersAndExternalUsers =
  getUsersAndExternalUsers as jest.MockedFunction<
    typeof getUsersAndExternalUsers
  >;

const renderCreateProjectOutput = async (
  documentType: gp2Routing.OutputDocumentTypeParameter = 'article',
) => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                gp2Routing
                  .projects({})
                  .project({ projectId: 'project-id-1' })
                  .createOutput({ outputDocumentType: documentType }).$,
              ]}
            >
              <Routes>
                <Route
                  path={
                    gp2Routing.projects.template +
                    gp2Routing.projects({}).project.template +
                    gp2Routing
                      .projects({})
                      .project({ projectId: 'project-id-1' }).createOutput
                      .template +
                    '/*'
                  }
                  element={
                    <NotificationMessages>
                      <CreateProjectOutput />
                    </NotificationMessages>
                  }
                />
                <Route path="*" element={<div />} />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

describe('Create Projects Output', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockGetOutputs.mockResolvedValue(createOutputListAlgoliaResponse(1));
    mockGetTags.mockResolvedValue(gp2.createTagsResponse());
    mockGetContributingCohorts.mockResolvedValue(
      gp2.contributingCohortResponse,
    );
    mockGetWorkingGroups.mockResolvedValue(gp2.createWorkingGroupsResponse());
    mockGetProjects.mockResolvedValue(createProjectListAlgoliaResponse(1));
    mockGetEvents.mockResolvedValue(createEventListAlgoliaResponse(1));
    mockGetProjectById.mockResolvedValue(
      gp2.createProjectResponse({ id: 'project-id-1' }),
    );
    mockGetUsersAndExternalUsers.mockResolvedValue({
      items: [
        gp2.createUserResponse({ displayName: 'Tony Stark', id: '1' }),
        { displayName: 'Steve Rogers', id: '2' },
      ],
      total: 2,
    });
    window.scrollTo = jest.fn();
  });

  it('renders the title', async () => {
    await renderCreateProjectOutput();
    expect(screen.getByRole('heading', { name: /share/i })).toBeVisible();
  });

  it('publishes the output', async () => {
    mockCreateOutput.mockResolvedValueOnce(gp2.createOutputResponse());
    const title = 'this is the output title';
    const link = 'https://example.com';
    await renderCreateProjectOutput('procedural-form');

    await userEvent.type(
      screen.getByRole('textbox', { name: /title/i }),
      title,
    );
    await userEvent.type(screen.getByRole('textbox', { name: /^url/i }), link);
    await userEvent.type(
      screen.getByRole('textbox', { name: /^description/i }),
      'An interesting article',
    );
    await userEvent.type(
      screen.getByRole('textbox', { name: /^short description/i }),
      'An article',
    );
    const authors = screen.getByRole('textbox', { name: /Authors/i });
    await userEvent.click(authors);
    await userEvent.click(screen.getByText('Tony Stark'));
    await userEvent.click(authors);
    await userEvent.click(screen.getByText(/Steve Rogers \(/i));
    await userEvent.click(
      screen.getByRole('textbox', { name: /identifier type/i }),
    );
    await userEvent.click(screen.getByText(/^none/i));
    expect(screen.getByText('Project Title')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Publish' }));
    await userEvent.click(
      screen.getByRole('button', { name: 'Publish Output' }),
    );

    await waitFor(() => {
      expect(mockCreateOutput).toHaveBeenCalledWith(
        {
          createVersion: false,
          title,
          link,
          description: 'An interesting article',
          shortDescription: 'An article',
          sharingStatus: 'GP2 Only',
          documentType: 'Procedural Form',
          projectIds: [],
          workingGroupIds: undefined,
          authors: [
            {
              userId: '1',
            },
            {
              externalUserId: '2',
            },
          ],
          mainEntityId: 'project-id-1',
          tagIds: [],
          contributingCohortIds: [],
          relatedOutputIds: [],
          relatedEventIds: [],
        },
        expect.anything(),
      );
    });
  });

  it('will show server side validation error for link', async () => {
    // Suppress act() warnings from async validation state updates
    const consoleSpy = mockActWarningsInConsole('error');

    const validationResponse: ValidationErrorResponse = {
      message: 'Validation error',
      error: 'Bad Request',
      statusCode: 400,
      data: [
        { instancePath: '/link', keyword: '', params: {}, schemaPath: 'link' },
      ],
    };
    mockCreateOutput.mockRejectedValueOnce(
      new BackendError('example', validationResponse, 400),
    );

    const title = 'this is the output title';
    const link = 'https://example.com';
    await renderCreateProjectOutput('procedural-form');

    const user = userEvent.setup({ delay: null });

    await user.type(screen.getByRole('textbox', { name: /title/i }), title);
    await user.type(screen.getByRole('textbox', { name: /^url/i }), link);
    await user.type(
      screen.getByRole('textbox', { name: /^description/i }),
      'An interesting article',
    );
    await user.type(
      screen.getByRole('textbox', { name: /^short description/i }),
      'An article',
    );
    const authors = screen.getByRole('textbox', { name: /Authors/i });
    await user.click(authors);
    await user.click(screen.getByText('Tony Stark'));
    await user.click(screen.getByRole('textbox', { name: /identifier type/i }));
    await user.click(screen.getByText(/^none/i));
    expect(screen.getByText('Project Title')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Publish' }));
    await user.click(screen.getByRole('button', { name: 'Publish Output' }));

    await waitFor(() => {
      expect(mockCreateOutput).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(
        screen.queryAllByText(
          'An Output with this URL already exists. Please enter a different URL.',
        ).length,
      ).toBeGreaterThanOrEqual(1);
    });
    expect(window.scrollTo).toHaveBeenCalled();

    const url = screen.getByRole('textbox', { name: /URL \(required\)/i });
    await user.clear(url);
    await user.type(url, 'a');
    await user.keyboard('{Tab}');

    await waitFor(
      () => {
        expect(
          screen.queryByText(
            'An Output with this URL already exists. Please enter a different URL.',
          ),
        ).toBeNull();
      },
      { timeout: 3000 },
    );

    consoleSpy.mockRestore();
  });
});
