import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { gp2 as gp2Model, ValidationErrorResponse } from '@asap-hub/model';
import { BackendError } from '@asap-hub/frontend-utils';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { OutputFormPage } from '@asap-hub/gp2-components';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getEvents } from '../../events/api';
import NotificationMessages from '../../NotificationMessages';
import { getProjects } from '../../projects/api';
import { getContributingCohorts, getTags } from '../../shared/api';
import { getWorkingGroups } from '../../working-groups/api';
import {
  createEventListAlgoliaResponse,
  createOutputListAlgoliaResponse,
  createProjectListAlgoliaResponse,
} from '../../__fixtures__/algolia';
import { getOutputs, updateOutput, getGeneratedOutputContent } from '../api';
import ShareOutput from '../ShareOutput';

jest.mock('../api');
jest.mock('../../shared/api');
jest.mock('../../projects/api');
jest.mock('../../working-groups/api');
jest.mock('../../events/api.ts');

const mockUpdateOutput = updateOutput as jest.MockedFunction<
  typeof updateOutput
>;

const mockGetOutputs = getOutputs as jest.MockedFunction<typeof getOutputs>;
const mockGetGeneratedOutputContent =
  getGeneratedOutputContent as jest.MockedFunction<
    typeof getGeneratedOutputContent
  >;
const mockGetTags = getTags as jest.MockedFunction<typeof getTags>;
const mockGetContributingCohorts =
  getContributingCohorts as jest.MockedFunction<typeof getContributingCohorts>;

const mockGetWorkingGroups = getWorkingGroups as jest.MockedFunction<
  typeof getWorkingGroups
>;
const mockGetProjects = getProjects as jest.MockedFunction<typeof getProjects>;
const mockGetEvents = getEvents as jest.MockedFunction<typeof getEvents>;

const renderShareOutput = async (
  path: string,
  output: gp2Model.OutputBaseResponse = gp2Fixtures.createOutputResponse(),
) => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[path]} initialIndex={1}>
              <Route
                path={
                  gp2Routing.outputs.template +
                  gp2Routing.outputs({}).output.template +
                  gp2Routing.outputs({}).output({ outputId: 'output-id' }).edit
                    .template
                }
              >
                <NotificationMessages>
                  <OutputFormPage>
                    <ShareOutput output={output} />
                  </OutputFormPage>
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

const getEditPath = (outputId = 'output-id') =>
  gp2Routing.outputs({}).output({ outputId }).edit({}).$;

describe('ShareOutput', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockGetOutputs.mockResolvedValue(createOutputListAlgoliaResponse(1));
    mockGetTags.mockResolvedValue(gp2Fixtures.createTagsResponse());
    mockGetContributingCohorts.mockResolvedValue(
      gp2Fixtures.contributingCohortResponse,
    );
    mockGetWorkingGroups.mockResolvedValue(
      gp2Fixtures.createWorkingGroupsResponse(),
    );
    mockGetProjects.mockResolvedValue(createProjectListAlgoliaResponse(1));
    mockGetEvents.mockResolvedValue(createEventListAlgoliaResponse(1));
    window.scrollTo = jest.fn();
  });
  afterEach(jest.resetAllMocks);
  mockConsoleError();

  it('renders the title in edit page', async () => {
    await renderShareOutput(getEditPath());
    expect(screen.getByRole('heading', { name: /share/i })).toBeVisible();
  });
  it('saves the output in edit page', async () => {
    const title = 'Output title';
    const link = 'https://example.com';
    const id = 'output-id';

    mockUpdateOutput.mockResolvedValueOnce(gp2Fixtures.createOutputResponse());

    await renderShareOutput(getEditPath(id), {
      ...gp2Fixtures.createOutputResponse(),
      id,
      title,
      link,
      projects: [{ id: '42', title: 'a title' }],
    });

    userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(await screen.findByRole('button', { name: /save/i })).toBeEnabled();
    expect(mockUpdateOutput).toHaveBeenCalledWith(
      id,
      expect.objectContaining({ title, link }),
      expect.anything(),
    );
  });

  it('generates the short description based on the current description', async () => {
    const id = 'output-id';

    mockGetGeneratedOutputContent.mockResolvedValueOnce({
      shortDescription: 'test generated short description 1',
    });

    await renderShareOutput(getEditPath(id), {
      ...gp2Fixtures.createOutputResponse(),
      id,
    });

    userEvent.click(screen.getByRole('button', { name: /Generate/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('textbox', { name: /short description/i }),
      ).toHaveValue('test generated short description 1');
    });
  });

  it('will show server side validation error for link', async () => {
    const title = 'Output title';
    const link = 'https://example.com';
    const id = 'output-id';
    const validationResponse: ValidationErrorResponse = {
      message: 'Validation error',
      error: 'Bad Request',
      statusCode: 400,
      data: [
        { instancePath: '/link', keyword: '', params: {}, schemaPath: 'link' },
      ],
    };

    mockUpdateOutput.mockRejectedValueOnce(
      new BackendError('example', validationResponse, 400),
    );

    await renderShareOutput(getEditPath(id), {
      ...gp2Fixtures.createOutputResponse(),
      id,
      title,
      link,
      projects: [{ id: '42', title: 'a title' }],
    });

    userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(await screen.findByRole('button', { name: /save/i })).toBeEnabled();

    expect(mockUpdateOutput).toHaveBeenCalled();
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

  it('will toast server side errors for unknown errors', async () => {
    const title = 'Output title';
    const link = 'https://example.com';
    const id = 'output-id';
    mockUpdateOutput.mockRejectedValueOnce(new Error('Something went wrong'));

    await renderShareOutput(getEditPath(id), {
      ...gp2Fixtures.createOutputResponse(),
      id,
      title,
      link,
      projects: [{ id: '42', title: 'a title' }],
    });

    userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(await screen.findByRole('button', { name: /save/i })).toBeEnabled();

    expect(mockUpdateOutput).toHaveBeenCalled();
    expect(
      screen.queryByText(
        'There was an error and we were unable to save your changes. Please try again.',
      ),
    ).toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenCalled();
  });
});
