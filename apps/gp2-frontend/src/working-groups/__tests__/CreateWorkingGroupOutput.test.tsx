import { gp2 } from '@asap-hub/fixtures';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ValidationErrorResponse } from '@asap-hub/model';
import { BackendError } from '@asap-hub/frontend-utils';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getEvents } from '../../events/api';
import NotificationMessages from '../../NotificationMessages';
import { createOutput, getOutputs } from '../../outputs/api';
import { getProjects } from '../../projects/api';
import { getContributingCohorts, getTags } from '../../shared/api';
import { getUsersAndExternalUsers } from '../../users/api';
import {
  createEventListAlgoliaResponse,
  createOutputListAlgoliaResponse,
  createProjectListAlgoliaResponse,
} from '../../__fixtures__/algolia';
import { getWorkingGroup, getWorkingGroups } from '../api';
import CreateWorkingGroupOutput from '../CreateWorkingGroupOutput';

jest.mock('../../events/api.ts');
jest.mock('../../outputs/api');
jest.mock('../../projects/api');
jest.mock('../../shared/api');
jest.mock('../../users/api');
jest.mock('../api');

jest.setTimeout(60_000);

const mockCreateOutput = createOutput as jest.MockedFunction<
  typeof createOutput
>;
const mockGetUsersAndExternalUsers =
  getUsersAndExternalUsers as jest.MockedFunction<
    typeof getUsersAndExternalUsers
  >;

const mockGetOutputs = getOutputs as jest.MockedFunction<typeof getOutputs>;
const mockGetTags = getTags as jest.MockedFunction<typeof getTags>;
const mockGetContributingCohorts =
  getContributingCohorts as jest.MockedFunction<typeof getContributingCohorts>;

const mockGetWorkingGroups = getWorkingGroups as jest.MockedFunction<
  typeof getWorkingGroups
>;
const mockGetWorkingGroupById = getWorkingGroup as jest.MockedFunction<
  typeof getWorkingGroup
>;
const mockGetProjects = getProjects as jest.MockedFunction<typeof getProjects>;
const mockGetEvents = getEvents as jest.MockedFunction<typeof getEvents>;

const renderCreateWorkingGroupOutput = async (
  outputDocumentType: gp2Routing.OutputDocumentTypeParameter = 'article',
) => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                gp2Routing.workingGroups.DEFAULT.DETAILS.CREATE_OUTPUT.buildPath(
                  { workingGroupId: 'working-group-id-1', outputDocumentType },
                ),
              ]}
            >
              <Route
                path={gp2Routing.workingGroups.DEFAULT.DETAILS.CREATE_OUTPUT.buildPath(
                  { workingGroupId: 'working-group-id-1', outputDocumentType },
                )}
              >
                <NotificationMessages>
                  <CreateWorkingGroupOutput />
                </NotificationMessages>
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

describe('Create WorkingGroup Output', () => {
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
    mockGetWorkingGroupById.mockResolvedValue(
      gp2.createWorkingGroupResponse({ id: 'working-group-id-1' }),
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
    await renderCreateWorkingGroupOutput();
    expect(screen.getByRole('heading', { name: /share/i })).toBeVisible();
  });

  it('publishes the output', async () => {
    mockCreateOutput.mockResolvedValueOnce(gp2.createOutputResponse());
    const title = 'this is the output title';
    const link = 'https://example.com';
    await renderCreateWorkingGroupOutput('procedural-form');

    userEvent.type(screen.getByRole('textbox', { name: /title/i }), title);
    userEvent.type(screen.getByRole('textbox', { name: /^url/i }), link);
    userEvent.type(
      screen.getByRole('textbox', { name: /^description/i }),
      'An interesting article',
    );
    userEvent.type(
      screen.getByRole('textbox', { name: /^short description/i }),
      'An article',
    );
    const authors = screen.getByRole('textbox', { name: /Authors/i });
    userEvent.click(authors);
    userEvent.click(screen.getByText('Tony Stark'));
    userEvent.click(authors);
    userEvent.click(screen.getByText(/Steve Rogers \(/i));
    userEvent.click(screen.getByRole('textbox', { name: /identifier type/i }));
    userEvent.click(screen.getByText(/^none/i));
    expect(screen.getByText('Working Group Title')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Publish' }));
    userEvent.click(screen.getByRole('button', { name: 'Publish Output' }));

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
          authors: [
            {
              userId: '1',
            },
            {
              externalUserId: '2',
            },
          ],
          workingGroupIds: [],
          projectIds: undefined,
          mainEntityId: 'working-group-id-1',
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
    await renderCreateWorkingGroupOutput('procedural-form');

    userEvent.type(screen.getByRole('textbox', { name: /title/i }), title);
    userEvent.type(screen.getByRole('textbox', { name: /^url/i }), link);
    userEvent.type(
      screen.getByRole('textbox', { name: /^description/i }),
      'An interesting article',
    );
    userEvent.type(
      screen.getByRole('textbox', { name: /^short description/i }),
      'An article',
    );
    const authors = screen.getByRole('textbox', { name: /Authors/i });
    userEvent.click(authors);
    userEvent.click(screen.getByText('Tony Stark'));
    userEvent.click(screen.getByRole('textbox', { name: /identifier type/i }));
    userEvent.click(screen.getByText(/^none/i));
    expect(screen.getByText('Working Group Title')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Publish' }));
    userEvent.click(screen.getByRole('button', { name: 'Publish Output' }));
    await waitFor(() => {
      expect(mockCreateOutput).toHaveBeenCalled();
    });
    expect(
      screen.queryAllByText(
        'An Output with this URL already exists. Please enter a different URL.',
      ).length,
    ).toBeGreaterThan(1);
    expect(window.scrollTo).toHaveBeenCalled();

    const url = screen.getByRole('textbox', { name: /URL \(required\)/i });
    userEvent.type(url, 'a');
    url.blur();

    expect(
      screen.queryByText(
        'An Output with this URL already exists. Please enter a different URL.',
      ),
    ).toBeNull();
  });
});
