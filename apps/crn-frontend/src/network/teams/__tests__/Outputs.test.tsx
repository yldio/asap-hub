import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  createListResearchOutputResponse,
  createTeamResponse,
} from '@asap-hub/fixtures';
import { TeamRole } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { createCsvFileStream } from '@asap-hub/frontend-utils';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { RecoilRoot } from 'recoil';
import { auth0State } from '../../../auth/state';
import Outputs from '../Outputs';
import { createResearchOutputListAlgoliaResponse } from '../../../__fixtures__/algolia';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import {
  getDraftResearchOutputs,
  getResearchOutputs,
} from '../../../shared-research/api';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';
import { MAX_CONTENTFUL_RESULTS } from '../../../shared-research/export';

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
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const result = render(
    <QueryClientProvider client={queryClient}>
      <RecoilRoot
        initializeState={({ set }) =>
          set(auth0State, {
            getTokenSilently: jest.fn().mockResolvedValue('test_token'),
          } as never)
        }
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
                <Routes>
                  <Route
                    path={
                      network({})
                        .teams({})
                        .team({ teamId: team.id })
                        .outputs({}).$
                    }
                    element={
                      <Outputs
                        userAssociationMember={userAssociationMember}
                        draftOutputs={draftOutputs}
                        team={team}
                      />
                    }
                  />
                </Routes>
              </MemoryRouter>
            </WhenReady>
          </Auth0Provider>
        </Suspense>
      </RecoilRoot>
    </QueryClientProvider>,
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
  await userEvent.type(getByRole('searchbox'), searchQuery);

  await userEvent.click(getByText('Filters'));
  const checkbox = getByLabelText('Grant Document');
  expect(checkbox).not.toBeChecked();

  await userEvent.click(checkbox);
  await waitFor(() => expect(checkbox).toBeChecked());

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
  const { getByRole, getByText, getByLabelText, findByText } =
    await renderOutputs(searchQuery, filters, {
      ...createTeamResponse(),
      id: teamId,
      displayName: 'example team 123',
    });
  await userEvent.type(getByRole('searchbox'), searchQuery);
  await userEvent.click(getByText('Filters'));
  await userEvent.click(getByLabelText('Grant Document'));
  await waitFor(() =>
    expect(mockGetResearchOutputs).toHaveBeenLastCalledWith(expect.anything(), {
      searchQuery,
      filters,
      teamId,
      currentPage: 0,
      pageSize: CARD_VIEW_PAGE_SIZE,
    }),
  );

  const csvButton = await findByText(/csv/i);
  await act(async () => {
    await userEvent.click(csvButton);
  });
  await waitFor(() => {
    expect(mockCreateCsvFileStream).toHaveBeenLastCalledWith(
      expect.stringMatching(/SharedOutputs_Team_ExampleTeam123_\d+\.csv/),
      expect.anything(),
    );
  });
  await waitFor(() =>
    expect(mockGetResearchOutputs).toHaveBeenCalledWith(expect.anything(), {
      searchQuery,
      filters,
      teamId,
      currentPage: 0,
      pageSize: CARD_VIEW_PAGE_SIZE,
    }),
  );
});

it('triggers draft research output export with custom file name', async () => {
  const filters = new Set();
  const teamId = '12345';
  mockGetDraftResearchOutputs.mockResolvedValue({
    ...createListResearchOutputResponse(2),
  });

  const { findByText } = await renderOutputs(
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

  await userEvent.click(await findByText(/csv/i));
  await waitFor(() =>
    expect(mockGetDraftResearchOutputs).toHaveBeenCalledWith(
      {
        searchQuery: '',
        filters,
        teamId,
        draftsOnly: true,
        userAssociationMember: true,
        currentPage: 0,
        pageSize: MAX_CONTENTFUL_RESULTS,
      },
      expect.anything(),
    ),
  );
  expect(mockCreateCsvFileStream).toHaveBeenLastCalledWith(
    expect.stringMatching(/SharedOutputs_Drafts_Team_Team123_\d+\.csv/),
    expect.anything(),
  );
});

it('uses team pointOfContact for contact email', async () => {
  mockGetResearchOutputs.mockResolvedValue({
    ...createResearchOutputListAlgoliaResponse(0),
  });
  const team = {
    ...createTeamResponse(),
    pointOfContact: 'project@example.com',
    members: [
      {
        ...createTeamResponse({ teamMembers: 1 }).members[0]!,
        role: 'Project Manager' as TeamRole,
        email: 'pm@example.com',
      },
    ],
  };

  const { findByRole } = await renderOutputs('', new Set(), team);
  expect(await findByRole('link', { name: /contact the PM/i })).toHaveAttribute(
    'href',
    'mailto:project@example.com',
  );
});
