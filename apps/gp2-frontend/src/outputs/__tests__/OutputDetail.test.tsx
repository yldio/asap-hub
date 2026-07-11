import { gp2 as gp2Routing } from '@asap-hub/routing';
import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';

import { gp2 } from '@asap-hub/fixtures';
import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getProjects } from '../../projects/api';
import { getContributingCohorts, getTags } from '../../shared/api';
import { getWorkingGroups } from '../../working-groups/api';
import { createProjectListAlgoliaResponse } from '../../__fixtures__/algolia';
import { getOutput } from '../api';
import OutputDetail from '../OutputDetail';

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
const mockGetProjects = getProjects as jest.MockedFunction<typeof getProjects>;

const renderOutputDetail = async () => {
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                gp2Routing.outputs({}).output({ outputId: 'output-id' }).$,
              ]}
              initialIndex={1}
            >
              <Routes>
                <Route
                  path={`${gp2Routing.outputs.template}${
                    gp2Routing.outputs({}).output.template
                  }/*`}
                  element={<OutputDetail />}
                />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </QueryClientProvider>,
  );

  await waitFor(
    () => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    { timeout: 30_000 },
  );
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
