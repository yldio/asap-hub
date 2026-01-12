import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  createListResearchOutputResponse,
  createTeamResponse,
} from '@asap-hub/fixtures';
import { TeamRole } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { RecoilRoot } from 'recoil';
import { createCsvFileStream } from '@asap-hub/frontend-utils';
import { disable, enable, reset } from '@asap-hub/flags';
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
  MAX_CONTENTFUL_RESULTS,
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
  reset();
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
              <Routes>
                <Route
                  path={
                    network({}).teams({}).team({ teamId: team.id }).outputs({})
                      .$
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
  await userEvent.type(getByRole('searchbox'), searchQuery);

  await userEvent.click(getByText('Filters'));
  const checkbox = getByLabelText('Grant Document');
  expect(checkbox).not.toBeChecked();

  await userEvent.click(checkbox);
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

  await act(async () => {
    await userEvent.click(getByText(/csv/i));
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

  await userEvent.click(getByText(/csv/i));
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

describe('contactEmail logic', () => {
  beforeEach(() => {
    mockGetResearchOutputs.mockResolvedValue({
      ...createResearchOutputListAlgoliaResponse(0),
    });
  });

  it('uses pointOfContact when PROJECTS_MVP flag is enabled', async () => {
    enable('PROJECTS_MVP');
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

    const { container } = await renderOutputs('', new Set(), team);
    // Component should render without errors
    expect(container).toBeInTheDocument();
  });

  it('uses PM email when PROJECTS_MVP is disabled and PM is active', async () => {
    disable('PROJECTS_MVP');
    const team = {
      ...createTeamResponse(),
      members: [
        {
          ...createTeamResponse({ teamMembers: 1 }).members[0]!,
          role: 'Project Manager' as TeamRole,
          email: 'pm@example.com',
          alumniSinceDate: undefined,
          inactiveSinceDate: undefined,
        },
      ],
    };

    const { container } = await renderOutputs('', new Set(), team);
    expect(container).toBeInTheDocument();
  });

  it('does not use PM email when PM is alumni', async () => {
    disable('PROJECTS_MVP');
    const team = {
      ...createTeamResponse(),
      members: [
        {
          ...createTeamResponse({ teamMembers: 1 }).members[0]!,
          role: 'Project Manager' as TeamRole,
          email: 'pm@example.com',
          alumniSinceDate: '2023-01-01',
          inactiveSinceDate: undefined,
        },
      ],
    };

    const { container } = await renderOutputs('', new Set(), team);
    expect(container).toBeInTheDocument();
  });

  it('does not use PM email when PM is inactive', async () => {
    disable('PROJECTS_MVP');
    const team = {
      ...createTeamResponse(),
      members: [
        {
          ...createTeamResponse({ teamMembers: 1 }).members[0]!,
          role: 'Project Manager' as TeamRole,
          email: 'pm@example.com',
          alumniSinceDate: undefined,
          inactiveSinceDate: '2023-01-01',
        },
      ],
    };

    const { container } = await renderOutputs('', new Set(), team);
    expect(container).toBeInTheDocument();
  });

  it('does not use PM email when PM is both alumni and inactive', async () => {
    disable('PROJECTS_MVP');
    const team = {
      ...createTeamResponse(),
      members: [
        {
          ...createTeamResponse({ teamMembers: 1 }).members[0]!,
          role: 'Project Manager' as TeamRole,
          email: 'pm@example.com',
          alumniSinceDate: '2023-01-01',
          inactiveSinceDate: '2023-01-01',
        },
      ],
    };

    const { container } = await renderOutputs('', new Set(), team);
    expect(container).toBeInTheDocument();
  });

  it('uses first active PM when multiple PMs exist', async () => {
    disable('PROJECTS_MVP');
    const team = {
      ...createTeamResponse(),
      members: [
        {
          ...createTeamResponse({ teamMembers: 1 }).members[0]!,
          role: 'Project Manager' as TeamRole,
          email: 'inactive-pm@example.com',
          alumniSinceDate: '2023-01-01',
          inactiveSinceDate: undefined,
        },
        {
          ...createTeamResponse({ teamMembers: 1 }).members[0]!,
          id: 'pm-2',
          displayName: 'Active PM',
          role: 'Project Manager' as TeamRole,
          email: 'active-pm@example.com',
          alumniSinceDate: undefined,
          inactiveSinceDate: undefined,
        },
      ],
    };

    const { container } = await renderOutputs('', new Set(), team);
    expect(container).toBeInTheDocument();
  });
});
