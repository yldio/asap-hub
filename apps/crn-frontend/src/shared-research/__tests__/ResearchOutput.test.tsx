import { Suspense } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { sharedResearch } from '@asap-hub/routing';
import { UserTeam, WorkingGroupMembership } from '@asap-hub/model';
import * as flags from '@asap-hub/flags';
import {
  createResearchOutputResponse,
  createUserResponse,
} from '@asap-hub/fixtures';

import { RecoilRoot } from 'recoil';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { User } from '@asap-hub/auth';

import ResearchOutput from '../ResearchOutput';
import { getResearchOutput } from '../api';
import { refreshResearchOutputState } from '../state';
import {
  getManuscriptVersionByManuscriptId,
  updateTeamResearchOutput,
} from '../../network/teams/api';
import { getImpacts } from '../../shared-api/impact';

jest.setTimeout(30000);
jest.mock('../../network/teams/api');
jest.mock('../../network/users/api');
jest.mock('../../network/working-groups/api');
jest.mock('../api');
jest.mock('../../shared-api/impact');

beforeEach(() => {
  window.scrollTo = jest.fn();
});

const id = '42';

const mockGetResearchOutput = getResearchOutput as jest.MockedFunction<
  typeof getResearchOutput
>;
const mockUpdateTeamResearchOutput =
  updateTeamResearchOutput as jest.MockedFunction<
    typeof updateTeamResearchOutput
  >;

const mockGetImpacts = getImpacts as jest.MockedFunction<typeof getImpacts>;

const mockGetManuscriptVersionByManuscriptId =
  getManuscriptVersionByManuscriptId as jest.MockedFunction<
    typeof getManuscriptVersionByManuscriptId
  >;

beforeEach(() => {
  mockGetImpacts.mockResolvedValue({
    total: 0,
    items: [],
  });
  mockGetResearchOutput.mockClear();
  mockGetResearchOutput.mockResolvedValue({
    ...createResearchOutputResponse(),
    documentType: 'Article',
    id,
  });
});

const teams: UserTeam[] = [
  {
    id: 't0',
    displayName: 'Jakobsson, J',
    role: 'Project Manager',
  },
];

const workingGroups: WorkingGroupMembership[] = [
  {
    id: 'wg0',
    name: 'Working Group',
    role: 'Project Manager',
    active: true,
  },
];

const defaultUser: User = {
  ...createUserResponse({}, 1),
  teams,
  workingGroups,
  algoliaApiKey: 'algolia-mock-key',
};

const researchOutputRoute = sharedResearch({}).researchOutput({
  researchOutputId: id,
});

const renderComponent = async (path: string, user = defaultUser) => {
  const result = render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(refreshResearchOutputState(id), Math.random())
      }
    >
      <Auth0Provider user={user}>
        <WhenReady>
          <Suspense fallback="Loading...">
            <MemoryRouter initialEntries={[path]} initialIndex={1}>
              <Switch>
                <Route path="/prev">Previous Page</Route>
                <Route
                  path={
                    sharedResearch.template +
                    sharedResearch({}).researchOutput.template
                  }
                >
                  <ResearchOutput />
                </Route>
              </Switch>
            </MemoryRouter>
          </Suspense>
        </WhenReady>
      </Auth0Provider>
    </RecoilRoot>,
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

describe('a grant document research output', () => {
  it('renders with its teams', async () => {
    mockGetResearchOutput.mockResolvedValue({
      ...createResearchOutputResponse(),
      id,
      documentType: 'Grant Document',
      teams: [
        {
          displayName: 'Grant Document Team',
          id: teams[0]!.id,
        },
      ],
      title: 'Grant Document title!',
    });
    await renderComponent(researchOutputRoute.$);

    expect(
      screen.getByRole('heading', { name: 'Grant Document title!' }),
    ).toBeVisible();
  });
  it('links to a teams', async () => {
    mockGetResearchOutput.mockResolvedValue({
      ...createResearchOutputResponse(),
      id,
      documentType: 'Grant Document',
      teams: [
        {
          id: teams[0]!.id,
          displayName: 'Sulzer, D',
        },
      ],
    });

    const { getByText } = await renderComponent(researchOutputRoute.$);
    expect(getByText('Team Sulzer, D')).toHaveAttribute(
      'href',
      expect.stringMatching(teams[0]!.id),
    );
  });

  it('renders the edit page when you have permissions for teams', async () => {
    mockGetResearchOutput.mockResolvedValue({
      ...createResearchOutputResponse(),
      documentType: 'Bioinformatics',
      teams: [
        {
          id: 't0',
          displayName: 'Jakobsson, J',
        },
      ],
      workingGroups: undefined,
      published: true,
    });

    await renderComponent(researchOutputRoute.editResearchOutput({}).$);

    expect(
      screen.getByRole('heading', { name: /Share Team Bioinformatics/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeVisible();
  });
});

describe('a not-grant-document research output', () => {
  it('renders with keywords', async () => {
    mockGetResearchOutput.mockResolvedValue({
      ...createResearchOutputResponse(),
      id,
      documentType: 'Protocol',
      keywords: ['Example Keyword'],
      title: 'Not-Grant-Document title!',
      teams: [
        {
          id: teams[0]!.id,
          displayName: 'Sulzer, D',
        },
      ],
    });
    const { getByRole, getByText } = await renderComponent(
      researchOutputRoute.$,
    );
    expect(getByText(/Example Keyword/i)).toBeVisible();
    expect(getByRole('heading', { level: 1 }).textContent).toEqual(
      'Not-Grant-Document title!',
    );
  });
});

describe('a working group research output', () => {
  it('renders a research output form for ASAP Staff', async () => {
    mockGetResearchOutput.mockResolvedValue({
      ...createResearchOutputResponse(),
      documentType: 'Article',
      workingGroups: [{ title: 'Example Working Group', id: 'wg0' }],
    });
    const { getByRole } = await renderComponent(
      researchOutputRoute.editResearchOutput({}).$,
      {
        ...defaultUser,
        role: 'Staff',
        teams: [
          {
            id: 'any',
            role: 'Key Personnel',
          },
        ],
        workingGroups: [
          {
            id: 'wg1',
            name: 'Example Working Group',
            role: 'Chair',
            active: true,
          },
        ],
      },
    );
    expect(getByRole('heading', { level: 1 }).textContent).toEqual(
      'Share a Working Group Article',
    );
  });

  it('renders a research output form for a Project Manager', async () => {
    mockGetResearchOutput.mockResolvedValue({
      ...createResearchOutputResponse(),
      documentType: 'Article',
      workingGroups: [{ title: 'Example Working Group', id: 'wg0' }],
    });
    const { getByRole } = await renderComponent(
      researchOutputRoute.editResearchOutput({}).$,
      {
        ...defaultUser,
        workingGroups: [
          {
            id: 'wg0',
            name: 'Example Working Group',
            role: 'Project Manager',
            active: true,
          },
        ],
      },
    );
    expect(getByRole('heading', { level: 1 }).textContent).toEqual(
      'Share a Working Group Article',
    );
  });

  it('renders the sorry page if you are not a member of the working group', async () => {
    mockGetResearchOutput.mockResolvedValue({
      ...createResearchOutputResponse(),
      documentType: 'Article',
      workingGroups: [{ title: 'Example Working Group', id: 'wg0' }],
    });
    const { getByText } = await renderComponent(
      researchOutputRoute.editResearchOutput({}).$,
      {
        ...defaultUser,
        workingGroups: [
          {
            id: 'not-related-to-research-output',
            name: 'Example Working Group',
            role: 'Project Manager',
            active: true,
          },
        ],
      },
    );
    expect(getByText(/sorry.+page/i)).toBeVisible();
  });

  it('renders the sorry page if you do not belong to that working group', async () => {
    mockGetResearchOutput.mockResolvedValue({
      ...createResearchOutputResponse(),
      documentType: 'Article',
      workingGroups: [{ title: 'Example Working Group', id: 'wg0' }],
    });
    const { getByText } = await renderComponent(
      researchOutputRoute.editResearchOutput({}).$,
      {
        ...defaultUser,
        workingGroups: [
          {
            id: 'wg1',
            name: 'Example Working Group',
            role: 'Project Manager',
            active: true,
          },
        ],
      },
    );
    expect(getByText(/sorry.+page/i)).toBeVisible();
  });
});

it('renders the 404 page for a missing research output', async () => {
  mockGetResearchOutput.mockResolvedValue(undefined);
  const { getByText } = await renderComponent(researchOutputRoute.$);
  expect(getByText(/sorry.+page/i)).toBeVisible();
});

it('switches a draft research output to in review', async () => {
  const researchOutput = createResearchOutputResponse();
  mockGetResearchOutput.mockResolvedValue({
    ...researchOutput,
    documentType: 'Article',
    published: false,
    workingGroups: undefined,
  });

  const { queryByText, getAllByText } = await renderComponent(
    researchOutputRoute.$,
    {
      ...defaultUser,
      teams: [
        {
          id: researchOutput.teams[0]!.id,
          role: 'Key Personnel',
          displayName: researchOutput.teams[0]!.displayName,
        },
      ],
    },
  );

  const showModalButton = queryByText('Ready for PM Review');

  expect(showModalButton).toBeVisible();

  fireEvent.click(showModalButton as HTMLElement);
  const saveButton = getAllByText('Ready for PM Review')[1];

  fireEvent.click(saveButton as HTMLElement);
  await waitFor(() => {
    expect(saveButton).toBeEnabled();
  });

  expect(mockUpdateTeamResearchOutput).toHaveBeenCalledWith(
    researchOutput.id,
    expect.objectContaining({
      statusChangedById: defaultUser.id,
    }),
    expect.anything(),
  );
});

it('switches a in review research output back to draft', async () => {
  const researchOutput = createResearchOutputResponse();
  mockGetResearchOutput.mockResolvedValue({
    ...researchOutput,
    documentType: 'Article',
    published: false,
    workingGroups: undefined,
    statusChangedBy: { ...defaultUser },
    isInReview: true,
  });

  const { queryByText, getAllByText } = await renderComponent(
    researchOutputRoute.$,
    {
      ...defaultUser,
      teams: [
        {
          id: researchOutput.teams[0]!.id,
          role: 'Project Manager',
          displayName: researchOutput.teams[0]!.displayName,
        },
      ],
    },
  );

  const showModalButton = queryByText('Switch to Draft');

  expect(showModalButton).toBeVisible();

  fireEvent.click(showModalButton as HTMLElement);
  const saveButton = getAllByText('Switch to Draft')[1];

  fireEvent.click(saveButton as HTMLElement);
  await waitFor(() => {
    expect(saveButton).toBeEnabled();
  });

  expect(mockUpdateTeamResearchOutput).toHaveBeenCalledWith(
    researchOutput.id,
    expect.objectContaining({
      statusChangedById: defaultUser.id,
      hasStatusChanged: true,
      isInReview: false,
    }),
    expect.anything(),
  );
});

it('publishes a research output', async () => {
  const researchOutput = createResearchOutputResponse();
  mockGetResearchOutput.mockResolvedValue({
    ...researchOutput,
    documentType: 'Article',
    published: false,
    workingGroups: undefined,
    statusChangedBy: { ...defaultUser },
  });

  const { queryByText, getByText } = await renderComponent(
    researchOutputRoute.$,
    {
      ...defaultUser,
      teams: [
        {
          id: researchOutput.teams[0]!.id,
          role: 'Project Manager',
          displayName: researchOutput.teams[0]!.displayName,
        },
      ],
    },
  );

  const showPublishModalButton = queryByText('Publish');

  expect(showPublishModalButton).toBeVisible();

  fireEvent.click(showPublishModalButton as HTMLElement);
  const publishButton = getByText('Publish Output');

  fireEvent.click(publishButton);
  await waitFor(() => {
    expect(publishButton).toBeEnabled();
  });

  expect(mockUpdateTeamResearchOutput).toHaveBeenCalledWith(
    researchOutput.id,
    expect.objectContaining({
      published: true,
    }),
    expect.anything(),
  );
});

describe('a research output linked to a manuscript', () => {
  beforeEach(() => {
    jest.spyOn(flags, 'isEnabled').mockReturnValue(true);
  });
  it('renders add version form on clicking Import Manuscript Version if manuscript output has new manuscript version', async () => {
    const researchOutput = createResearchOutputResponse();
    mockGetResearchOutput.mockResolvedValue({
      ...researchOutput,
      documentType: 'Article',
      published: true,
      workingGroups: undefined,
      statusChangedBy: { ...defaultUser },
      relatedManuscript: 'manuscript-id-1',
      relatedManuscriptVersion: 'version-id-1',
    });

    const { queryByText, getByText } = await renderComponent(
      researchOutputRoute.$,
      {
        ...defaultUser,
        teams: [
          {
            id: researchOutput.teams[0]!.id,
            role: 'Project Manager',
            displayName: researchOutput.teams[0]!.displayName,
          },
        ],
      },
    );

    const importVersionButton = queryByText('Import Manuscript Version');
    expect(importVersionButton).toBeVisible();

    fireEvent.click(importVersionButton as HTMLElement);
    await waitFor(() => {
      expect(getByText('Imported Manuscript Version')).toBeInTheDocument();
    });

    expect(
      screen.getByRole('heading', { name: /Share a Team Article/i }),
    ).toBeInTheDocument();
  });

  it('renders no new version modal on clicking Import Manuscript Version if manuscript output does not have a new manuscript version', async () => {
    const researchOutput = createResearchOutputResponse();
    const recentVersionId = 'version-id-2';
    mockGetResearchOutput.mockResolvedValue({
      ...researchOutput,
      documentType: 'Article',
      published: true,
      workingGroups: undefined,
      statusChangedBy: { ...defaultUser },
      relatedManuscript: 'manuscript-id-1',
      relatedManuscriptVersion: recentVersionId,
    });

    const { queryByText, getByText } = await renderComponent(
      researchOutputRoute.$,
      {
        ...defaultUser,
        teams: [
          {
            id: researchOutput.teams[0]!.id,
            role: 'Project Manager',
            displayName: researchOutput.teams[0]!.displayName,
          },
        ],
      },
    );

    const importVersionButton = queryByText('Import Manuscript Version');
    expect(importVersionButton).toBeVisible();

    fireEvent.click(importVersionButton as HTMLElement);
    await waitFor(() => {
      expect(getByText('No new manuscript versions available')).toBeVisible();
    });
  });

  it('renders no new version modal on clicking Import Manuscript Version if unable to fetch manuscript version', async () => {
    const researchOutput = createResearchOutputResponse();

    mockGetResearchOutput.mockResolvedValue({
      ...researchOutput,
      documentType: 'Article',
      published: true,
      workingGroups: undefined,
      statusChangedBy: { ...defaultUser },
      relatedManuscript: 'manuscript-id-1',
      relatedManuscriptVersion: 'version-id-1',
    });
    mockGetManuscriptVersionByManuscriptId.mockRejectedValue(
      new Error('error'),
    );

    const { queryByText, getByText } = await renderComponent(
      researchOutputRoute.$,
      {
        ...defaultUser,
        teams: [
          {
            id: researchOutput.teams[0]!.id,
            role: 'Project Manager',
            displayName: researchOutput.teams[0]!.displayName,
          },
        ],
      },
    );

    const importVersionButton = queryByText('Import Manuscript Version');
    expect(importVersionButton).toBeVisible();

    fireEvent.click(importVersionButton as HTMLElement);
    await waitFor(() => {
      expect(getByText('No new manuscript versions available')).toBeVisible();
    });
  });
});
