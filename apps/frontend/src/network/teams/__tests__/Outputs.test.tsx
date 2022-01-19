import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTeamResponse } from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';

import { RecoilRoot } from 'recoil';
import Outputs from '../Outputs';
import { createResearchOutputListAlgoliaResponse } from '../../../__fixtures__/algolia';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getResearchOutputs } from '../../../shared-research/api';
import { researchOutputsState } from '../../../shared-research/state';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';
import {
  createCsvFileStream,
  MAX_ALGOLIA_RESULTS,
} from '../../../shared-research/export';
import { getTeam } from '../api';

jest.mock('../../../shared-research/api');
jest.mock('../../../shared-research/export');
jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetResearchOutputs = getResearchOutputs as jest.MockedFunction<
  typeof getResearchOutputs
>;

const mockGetTeam = getTeam as jest.MockedFunction<typeof getTeam>;

const mockCreateCsvFileStream = createCsvFileStream as jest.MockedFunction<
  typeof createCsvFileStream
>;

const renderOutputs = async (
  searchQuery = '',
  filters = new Set<string>(),
  teamId = '42',
) => {
  const result = render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          researchOutputsState({
            searchQuery,
            filters,
            teamId,
            currentPage: 0,
            pageSize: CARD_VIEW_PAGE_SIZE,
          }),
        );
        reset(
          researchOutputsState({
            searchQuery,
            filters,
            teamId,
            currentPage: 0,
            pageSize: MAX_ALGOLIA_RESULTS,
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                {
                  pathname: network({}).teams({}).team({ teamId }).outputs({})
                    .$,
                },
              ]}
            >
              <Route
                path={network({}).teams({}).team({ teamId }).outputs({}).$}
              >
                <Outputs teamId={teamId} />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

it('renders search and filter', async () => {
  const { getByRole } = await renderOutputs();
  expect(
    (getByRole('searchbox') as HTMLInputElement).placeholder,
  ).toMatchInlineSnapshot(`"Enter a keyword, method, resource…"`);
});

it('renders a list of research outputs', async () => {
  mockGetResearchOutputs.mockResolvedValue({
    ...createResearchOutputListAlgoliaResponse(2),
    hits: createResearchOutputListAlgoliaResponse(2).hits.map((hit, index) => ({
      ...hit,
      title: `Test Output ${index}`,
    })),
  });
  const { container } = await renderOutputs('');
  expect(container.textContent).toContain('Test Output 0');
  expect(container.textContent).toContain('Test Output 1');
});

it('calls getResearchOutputs with the right arguments', async () => {
  const filters = new Set(['Grant Document']);
  const searchQuery = 'searchterm';
  const teamId = '1234';
  mockGetResearchOutputs.mockResolvedValue({
    ...createResearchOutputListAlgoliaResponse(2),
  });
  const { getByRole, getByText, getByLabelText } = await renderOutputs(
    searchQuery,
    filters,
    teamId,
  );
  userEvent.type(getByRole('searchbox'), searchQuery);

  userEvent.click(getByText('Filters'));
  const checkbox = getByLabelText('Grant Document');
  expect(checkbox).not.toBeChecked();

  userEvent.click(checkbox);
  expect(checkbox).toBeChecked();

  await waitFor(() =>
    expect(mockGetResearchOutputs).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({
        teamId,
        searchQuery,
        filters,
      }),
    ),
  );
});

it('triggers export with the same parameters and custom file name', async () => {
  mockGetTeam.mockResolvedValue({
    ...createTeamResponse(),
    displayName: 'example team 123',
  });
  const filters = new Set(['Grant Document']);
  const searchQuery = 'Some Search';
  const teamId = '12345';
  mockGetResearchOutputs.mockResolvedValue({
    ...createResearchOutputListAlgoliaResponse(2),
  });
  const { getByRole, getByText, getByLabelText } = await renderOutputs(
    searchQuery,
    filters,
    teamId,
  );
  userEvent.type(getByRole('searchbox'), searchQuery);
  userEvent.click(getByText('Filters'));
  userEvent.click(getByLabelText('Grant Document'));
  await waitFor(() =>
    expect(mockGetResearchOutputs).toHaveBeenLastCalledWith(expect.anything(), {
      searchQuery,
      filters,
      teamId,
      currentPage: 0,
      pageSize: CARD_VIEW_PAGE_SIZE,
    }),
  );

  userEvent.click(getByText(/export/i));
  expect(mockCreateCsvFileStream).toHaveBeenLastCalledWith(
    expect.anything(),
    expect.stringMatching(/SharedOutputs_TeamExampleTeam123_\d+\.csv/),
  );
  await waitFor(() =>
    expect(mockGetResearchOutputs).toHaveBeenCalledWith(expect.anything(), {
      searchQuery,
      filters,
      teamId,
      currentPage: 0,
      pageSize: MAX_ALGOLIA_RESULTS,
    }),
  );
});
