import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';

import { gp2 } from '@asap-hub/fixtures';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { getOutput } from '../api';
import OutputDetail from '../OutputDetail';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { createProjectListAlgoliaResponse } from '../../__fixtures__/algolia';
import { getTags, getContributingCohorts } from '../../shared/api';
import { getAlgoliaProjects } from '../../projects/api';
import { getWorkingGroups } from '../../working-groups/api';

jest.mock('../api');
jest.mock('../../shared/api');
jest.mock('../../projects/api');
jest.mock('../../working-groups/api');

const mockGetOutput = getOutput as jest.MockedFunction<typeof getOutput>;
const mockGetTags = getTags as jest.MockedFunction<typeof getTags>;
const mockGetContributingCohorts =
  getContributingCohorts as jest.MockedFunction<typeof getContributingCohorts>;

const mockGetWorkingGroups = getWorkingGroups as jest.MockedFunction<
  typeof getWorkingGroups
>;
const mockGetProjects = getAlgoliaProjects as jest.MockedFunction<
  typeof getAlgoliaProjects
>;

const renderOutputDetail = async () => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                gp2Routing.outputs({}).output({ outputId: 'output-id' }).$,
              ]}
              initialIndex={1}
            >
              <Route
                path={
                  gp2Routing.outputs.template +
                  gp2Routing.outputs({}).output.template
                }
              >
                <OutputDetail />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

describe('OutputDetail', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockGetOutput.mockResolvedValue(gp2.createOutputResponse());
    mockGetTags.mockResolvedValueOnce(gp2.createTagsResponse());
    mockGetContributingCohorts.mockResolvedValueOnce(
      gp2.contributingCohortResponse,
    );
    mockGetWorkingGroups.mockResolvedValueOnce(
      gp2.createWorkingGroupsResponse(),
    );
    mockGetProjects.mockResolvedValueOnce(createProjectListAlgoliaResponse(1));
  });
  afterEach(jest.resetAllMocks);

  it('renders the detail page', async () => {
    const outputResponse = gp2.createOutputResponse();
    await renderOutputDetail();
    expect(
      screen.getByRole('heading', { name: outputResponse.title }),
    ).toBeVisible();
    expect(
      screen.getByText(outputResponse.authors[0]!.displayName),
    ).toBeVisible();
  });

  it('renders not found if output was not found in detail page', async () => {
    mockGetOutput.mockResolvedValueOnce(undefined);
    await renderOutputDetail();
    expect(
      screen.getByRole('heading', {
        name: /Sorry! We can’t seem to find that page/i,
      }),
    ).toBeVisible();
  });
});
