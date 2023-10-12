import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { gp2 } from '@asap-hub/fixtures';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { gp2 as gp2Model } from '@asap-hub/model';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getAlgoliaEvents } from '../../events/api';
import NotificationMessages from '../../NotificationMessages';
import { getOutputs, updateOutput } from '../api';
import { getTags, getContributingCohorts } from '../../shared/api';
import { getAlgoliaProjects } from '../../projects/api';
import { getWorkingGroups } from '../../working-groups/api';
import {
  createEventListAlgoliaResponse,
  createOutputListAlgoliaResponse,
  createProjectListAlgoliaResponse,
} from '../../__fixtures__/algolia';
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
const mockGetTags = getTags as jest.MockedFunction<typeof getTags>;
const mockGetContributingCohorts =
  getContributingCohorts as jest.MockedFunction<typeof getContributingCohorts>;

const mockGetWorkingGroups = getWorkingGroups as jest.MockedFunction<
  typeof getWorkingGroups
>;
const mockGetProjects = getAlgoliaProjects as jest.MockedFunction<
  typeof getAlgoliaProjects
>;
const mockGetEvents = getAlgoliaEvents as jest.MockedFunction<
  typeof getAlgoliaEvents
>;

const renderShareOutput = async (
  path: string,
  output: gp2Model.OutputBaseResponse = gp2.createOutputResponse(),
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
                  <ShareOutput output={output} />
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
    mockGetTags.mockResolvedValue(gp2.createTagsResponse());
    mockGetContributingCohorts.mockResolvedValue(
      gp2.contributingCohortResponse,
    );
    mockGetWorkingGroups.mockResolvedValue(gp2.createWorkingGroupsResponse());
    mockGetProjects.mockResolvedValue(createProjectListAlgoliaResponse(1));
    mockGetEvents.mockResolvedValue(createEventListAlgoliaResponse(1));
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

    mockUpdateOutput.mockResolvedValueOnce(gp2.createOutputResponse());

    await renderShareOutput(getEditPath(id), {
      ...gp2.createOutputResponse(),
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
});
