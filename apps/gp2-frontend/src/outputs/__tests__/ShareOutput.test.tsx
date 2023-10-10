import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { gp2 } from '@asap-hub/fixtures';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import NotificationMessages from '../../NotificationMessages';
import { getOutput, getOutputs, updateOutput } from '../api';
import { getTags, getContributingCohorts } from '../../shared/api';
import { getAlgoliaProjects } from '../../projects/api';
import { getWorkingGroups } from '../../working-groups/api';
import ShareOutput from '../ShareOutput';
import {
  createOutputListAlgoliaResponse,
  createProjectListAlgoliaResponse,
} from '../../__fixtures__/algolia';

jest.mock('../../outputs/api');
jest.mock('../../shared/api');
jest.mock('../../projects/api');
jest.mock('../../working-groups/api');

const mockUpdateOutput = updateOutput as jest.MockedFunction<
  typeof updateOutput
>;
const mockGetOutput = getOutput as jest.MockedFunction<typeof getOutput>;
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

const renderShareOutput = async (path: string) => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[path]} initialIndex={1}>
              <Route
                path={
                  gp2Routing.outputs.template +
                  gp2Routing.outputs({}).output.template
                }
              >
                <NotificationMessages>
                  <ShareOutput />
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

const getDetailPagePath = (outputId = 'output-id') =>
  gp2Routing.outputs({}).output({ outputId }).$;

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
  });
  afterEach(jest.resetAllMocks);
  mockConsoleError();
  it('renders the detail page', async () => {
    const outputResponse = gp2.createOutputResponse();
    mockGetOutput.mockResolvedValueOnce(outputResponse);
    await renderShareOutput(getDetailPagePath());
    expect(
      screen.getByRole('heading', { name: outputResponse.title }),
    ).toBeVisible();
    expect(
      screen.getByText(outputResponse.authors[0]!.displayName),
    ).toBeVisible();
  });
  it('renders not found if output was not found in detail page', async () => {
    mockGetOutput.mockResolvedValueOnce(undefined);
    await renderShareOutput(getDetailPagePath());
    expect(
      screen.getByRole('heading', {
        name: /Sorry! We can’t seem to find that page/i,
      }),
    ).toBeVisible();
  });

  it('renders the title in edit page', async () => {
    mockGetOutput.mockResolvedValueOnce(gp2.createOutputResponse());
    await renderShareOutput(getEditPath());
    expect(screen.getByRole('heading', { name: /share/i })).toBeVisible();
  });
  it('renders not found if output was not found in edit page', async () => {
    mockGetOutput.mockResolvedValueOnce(undefined);
    await renderShareOutput(getEditPath());
    expect(
      screen.getByRole('heading', {
        name: /Sorry! We can’t seem to find that page/i,
      }),
    ).toBeVisible();
  });

  it('saves the output in edit page', async () => {
    const title = 'Output title';
    const link = 'https://example.com';
    const id = 'output-id';
    mockGetOutput.mockResolvedValueOnce({
      ...gp2.createOutputResponse(),
      id,
      title,
      link,
      projects: [{ id: '42', title: 'a title' }],
    });
    mockUpdateOutput.mockResolvedValueOnce(gp2.createOutputResponse());

    await renderShareOutput(getEditPath(id));

    userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(await screen.findByRole('button', { name: /save/i })).toBeEnabled();
    expect(mockUpdateOutput).toHaveBeenCalledWith(
      id,
      expect.objectContaining({ title, link }),
      expect.anything(),
    );
  });
});
