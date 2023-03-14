import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  createListResearchOutputResponse,
  createTeamResponse,
} from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';

import { RecoilRoot } from 'recoil';
import { createCsvFileStream } from '@asap-hub/frontend-utils';
import Outputs from '../Outputs';
import { createResearchOutputListAlgoliaResponse } from '../../../__fixtures__/algolia';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import {
  getDraftResearchOutputs,
  getResearchOutputs,
} from '../../../shared-research/api';
import { researchOutputsState } from '../../../shared-research/state';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';
import {
  MAX_ALGOLIA_RESULTS,
  MAX_SQUIDEX_RESULTS,
} from '../../../shared-research/export';

jest.mock('@asap-hub/frontend-utils', () => {
  const original = jest.requireActual('@asap-hub/frontend-utils');
  return {
    ...original,
    createCsvFileStream: jest
      .fn()
      .mockImplementation(() => ({ write: jest.fn(), end: jest.fn() })),
  };
});
jest.mock('../../../shared-research/api');
jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const mockGetResearchOutputs = getResearchOutputs as jest.MockedFunction<
  typeof getResearchOutputs
>;
const mockGetDraftResearchOutputs =
  getDraftResearchOutputs as jest.MockedFunction<
    typeof getDraftResearchOutputs
  >;

const mockCreateCsvFileStream = createCsvFileStream as jest.MockedFunction<
  typeof createCsvFileStream
>;

const renderOutputs = async (
  searchQuery = '',
  filters = new Set<string>(),
  team = createTeamResponse(),
  userAssociationMember = false,
  draftOutputs = false,
) => {
  const result = render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          researchOutputsState({
            searchQuery,
            filters,
            teamId: team.id,
            currentPage: 0,
            pageSize: CARD_VIEW_PAGE_SIZE,
          }),
        );
        reset(
          researchOutputsState({
            searchQuery,
            filters,
            teamId: team.id,
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
                  pathname: network({})
                    .teams({})
                    .team({ teamId: team.id })
                    .outputs({}).$,
                },
              ]}
            >
              <Route
                path={
                  network({}).teams({}).team({ teamId: team.id }).outputs({}).$
                }
              >
                <Outputs
                  userAssociationMember={userAssociationMember}
                  draftOutputs={draftOutputs}
                  team={team}
                />
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
    { ...createTeamResponse(), id: teamId },
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
  const filters = new Set(['Grant Document']);
  const searchQuery = 'Some Search';
  const teamId = '12345';
  mockGetResearchOutputs.mockResolvedValue({
    ...createResearchOutputListAlgoliaResponse(2),
  });
  const { getByRole, getByText, getByLabelText } = await renderOutputs(
    searchQuery,
    filters,
    { ...createTeamResponse(), id: teamId, displayName: 'example team 123' },
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
    expect.stringMatching(/SharedOutputs_Team_ExampleTeam123_\d+\.csv/),
    expect.anything(),
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

it('triggers draft research output export with custom file name', async () => {
  const filters = new Set();
  const teamId = '12345';
  mockGetDraftResearchOutputs.mockResolvedValue({
    ...createListResearchOutputResponse(2),
  });

  const { getByText } = await renderOutputs(
    '',
    new Set(),
    {
      ...createTeamResponse({}),
      id: teamId,
      displayName: 'Team123',
    },
    true,
    true,
  );

  userEvent.click(getByText(/export as csv/i));
  await waitFor(() =>
    expect(mockGetDraftResearchOutputs).toHaveBeenCalledWith(
      {
        searchQuery: '',
        filters,
        associationId: teamId,
        draftsOnly: true,
        userAssociationMember: true,
        currentPage: 0,
        pageSize: MAX_SQUIDEX_RESULTS,
      },
      expect.anything(),
    ),
  );
  expect(mockCreateCsvFileStream).toHaveBeenLastCalledWith(
    expect.stringMatching(/SharedOutputs_Drafts_Team_Team123_\d+\.csv/),
    expect.anything(),
  );
});
