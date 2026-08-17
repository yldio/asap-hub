import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import {
  createResearchOutputResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import { createTestQueryClient } from '@asap-hub/frontend-utils';
import {
  ManuscriptVersionResponse,
  ResearchOutputResponse,
  UserResponse,
} from '@asap-hub/model';
import { network, OutputDocumentTypeParameter } from '@asap-hub/routing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { editorRef } from '@asap-hub/react-components';
import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  createResearchOutput,
  updateTeamResearchOutput,
} from '../../../network/teams/api';
import { getImpacts } from '../../../shared-api/impact';
import ProjectOutput from '../../ProjectOutput';

jest.setTimeout(60000);
jest.mock('../../../network/teams/api');
jest.mock('../../../network/users/api');
jest.mock('../../../shared-api/impact');
jest.mock('../../../shared-research/api');
jest.mock('../../../shared-api/content-generator');
jest.mock('../../../network/teams/state', () => ({
  ...jest.requireActual('../../../network/teams/state'),
  usePostPreprintResearchOutput: jest.fn(),
}));

beforeEach(() => {
  window.scrollTo = jest.fn();
  // TODO: fix act error
  jest.spyOn(console, 'error').mockImplementation();
});

const baseUser = createUserResponse();
const baseResearchOutput: ResearchOutputResponse = {
  ...createResearchOutputResponse(),
  teams: [
    {
      id: '42',
      displayName: 'Jakobsson, J',
      teamType: 'Discovery Team',
    },
  ],
  labs: [{ id: 'l0', name: 'Example 1' }],
};

const findConfirmModalButton = async (name: RegExp) => {
  await screen.findByText(/for the whole hub\?/i);
  return screen.getByRole('button', { name });
};

const mandatoryFields = async (
  {
    link = 'http://example.com',
    title = 'example title',
    descriptionMD = 'example description',
    shortDescription = 'example short description',
    type = 'Preprint',
    doi = '10.1234',
  }: {
    link?: string;
    title?: string;
    descriptionMD?: string;
    shortDescription?: string;
    type?: string;
    doi?: string;
  },
  isLinkRequired: boolean = false,
  isEditMode: boolean = false,
  published: boolean = true,
  user = userEvent.setup({ delay: null }),
) => {
  const url = isLinkRequired ? /url \(required\)/i : /url \(optional\)/i;

  if (link) {
    fireEvent.change(screen.getByRole('textbox', { name: url }), {
      target: { value: link },
    });
  }
  if (title) {
    fireEvent.change(screen.getByRole('textbox', { name: /title/i }), {
      target: { value: title },
    });
  }

  await waitFor(() => expect(editorRef.current).not.toBeNull());

  if (descriptionMD) {
    editorRef.current?.focus();

    const descriptionEditor = screen.getByTestId('editor');
    await user.click(descriptionEditor);
    await user.keyboard('{Tab}');
    fireEvent.input(descriptionEditor, { data: descriptionMD });
    await user.keyboard('{Tab}');
  }

  if (shortDescription) {
    fireEvent.change(
      screen.getByRole('textbox', { name: /short description/i }),
      { target: { value: shortDescription } },
    );
  }

  const typeInput = screen.getByRole('combobox', { name: /Select the type/i });
  await user.type(typeInput, type);
  await user.keyboard('{Enter}');

  const identifier = screen.getByRole('combobox', { name: /identifier/i });
  await user.type(identifier, 'DOI');
  await user.keyboard('{Enter}');
  fireEvent.change(screen.getByPlaceholderText('e.g. 10.5555/YFRU1371'), {
    target: { value: doi },
  });
  return {
    publish: async () => {
      if (isEditMode && published) {
        const button = screen.getByRole('button', { name: /Save/i });
        await user.click(button);
        await waitFor(() => {
          expect(button).not.toBeInTheDocument(); // asserts navigation happened
        });
      } else {
        await user.click(screen.getByRole('button', { name: /Publish/i }));
        const button = await findConfirmModalButton(/Publish Output/i);
        await user.click(button);
        await waitFor(() => {
          expect(button).not.toBeInTheDocument();
        });
      }
    },
    saveDraft: async () => {
      const saveDraftButton = screen.queryByRole('button', {
        name: /Save Draft/i,
      });
      if (saveDraftButton) {
        await user.click(saveDraftButton);
        await waitFor(() => {
          expect(saveDraftButton).not.toBeInTheDocument(); // asserts navigation happened
        });
      }
    },
    // Confirms publish for forms with errors
    clickPublish: async () => {
      if (isEditMode && published) {
        const button = screen.getByRole('button', { name: /Save/i });
        await user.click(button);
        await waitFor(() => {
          expect(button).toBeEnabled();
        });
      } else {
        await user.click(screen.getByRole('button', { name: /Publish/i }));
        const button = await findConfirmModalButton(/Publish Output/i);
        await user.click(button);
        await waitFor(() => {
          expect(button).toBeEnabled(); // asserts user's still in the form
        });
      }
    },
  };
};

const mockCreateResearchOutput = createResearchOutput as jest.MockedFunction<
  typeof createResearchOutput
>;

const mockUpdateResearchOutput =
  updateTeamResearchOutput as jest.MockedFunction<
    typeof updateTeamResearchOutput
  >;

const mockGetImpacts = getImpacts as jest.MockedFunction<typeof getImpacts>;

interface RenderPageOptions {
  user?: UserResponse;
  teamId: string;
  versionAction?: 'create' | 'edit';
  outputDocumentType?: OutputDocumentTypeParameter;
  researchOutputData?: ResearchOutputResponse;
  latestManuscriptVersion?: ManuscriptVersionResponse;
  isDuplicate?: boolean;
}

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation();
  mockGetImpacts.mockResolvedValue({
    total: 0,
    items: [],
  });
});

it('can publish a form when the data is valid', async () => {
  const teamId = '42';
  const link = 'https://example42.com';
  const title = 'example42 title';
  const descriptionMD = 'example42 description';
  const shortDescription = 'example42 short description';
  const type = 'Animal Model';
  const doi = '10.0777';

  await renderPage({ teamId, outputDocumentType: 'lab-material' });

  const user = userEvent.setup({ delay: null });
  const { publish } = await mandatoryFields(
    {
      link,
      title,
      descriptionMD,
      shortDescription,
      type,
      doi,
    },
    false,
    false,
    true,
    user,
  );

  await user.click(screen.getByRole('combobox', { name: /Labs/i }));
  await user.click(
    await screen.findByText('Example 1 Lab', {}, { timeout: 5000 }),
  );
  await user.click(screen.getByRole('combobox', { name: /Authors/i }));
  await user.click(
    await screen.findByText('Person A 3', {}, { timeout: 5000 }),
  );

  await publish();

  expect(mockCreateResearchOutput).toHaveBeenCalledWith(
    {
      doi,
      documentType: 'Lab Material',
      sharingStatus: 'Network Only',
      teams: [teamId],
      link,
      title,
      description: '',
      descriptionMD,
      shortDescription,
      changelog: '',
      type,
      labs: ['l0'],
      authors: [
        {
          userId: 'user-id-2',
        },
      ],
      methods: [],
      organisms: [],
      environments: [],
      keywords: [],
      workingGroups: [],
      relatedResearch: [],
      relatedEvents: [],
      labCatalogNumber: undefined,
      publishDate: undefined,
      subtype: undefined,
      usageNotes: '',
      asapFunded: undefined,
      usedInPublication: undefined,
      published: true,
      categories: [],
      impact: '',
      layImpactStatement: '',
    },
    expect.anything(),
  );
});

it('can save draft when form data is valid', async () => {
  const teamId = '42';
  const link = 'https://example42.com';
  const title = 'example42 title';
  const descriptionMD = 'example42 description';
  const shortDescription = 'example42 short description';
  const type = 'Animal Model';
  const doi = '10.0777';

  await renderPage({ teamId, outputDocumentType: 'lab-material' });

  const user = userEvent.setup({ delay: null });
  const { saveDraft } = await mandatoryFields(
    {
      link,
      title,
      descriptionMD,
      shortDescription,
      type,
      doi,
    },
    false,
    false,
    true,
    user,
  );

  await user.click(screen.getByRole('combobox', { name: /Labs/i }));
  await user.click(
    await screen.findByText('Example 1 Lab', {}, { timeout: 5000 }),
  );
  await user.click(screen.getByRole('combobox', { name: /Authors/i }));
  await user.click(
    await screen.findByText('Person A 3', {}, { timeout: 5000 }),
  );

  await saveDraft();

  expect(mockCreateResearchOutput).toHaveBeenCalledWith(
    {
      doi,
      documentType: 'Lab Material',
      sharingStatus: 'Network Only',
      teams: [teamId],
      link,
      title,
      descriptionMD,
      shortDescription,
      changelog: '',
      description: '',
      type,
      labs: ['l0'],
      authors: [
        {
          userId: 'user-id-2',
        },
      ],
      methods: [],
      organisms: [],
      environments: [],
      keywords: [],
      workingGroups: [],
      relatedResearch: [],
      relatedEvents: [],
      labCatalogNumber: undefined,
      publishDate: undefined,
      subtype: undefined,
      usageNotes: '',
      asapFunded: undefined,
      usedInPublication: undefined,
      published: false,
      categories: [],
      impact: '',
      layImpactStatement: '',
    },
    expect.anything(),
  );
});

it('can edit a research output', async () => {
  const teamId = baseResearchOutput.teams[0]!.id;
  const { type, descriptionMD, title } = baseResearchOutput;
  const link = 'https://example42.com';
  const doi = '10.0777';

  await renderPage({
    teamId: '42',
    outputDocumentType: 'article',
    researchOutputData: { ...baseResearchOutput, doi },
    versionAction: 'edit',
  });

  const user = userEvent.setup({ delay: null });
  const { publish } = await mandatoryFields(
    {
      link,
      title: '',
      descriptionMD: '',
      shortDescription: '',
      type,
      doi,
    },
    true,
    true,
    true,
    user,
  );
  await publish();

  expect(mockUpdateResearchOutput).toHaveBeenCalledWith(
    baseResearchOutput.id,
    expect.objectContaining({
      link,
      title,
      descriptionMD,
      teams: [teamId],
    }),
    expect.anything(),
  );
});

it('can edit a draft research output', async () => {
  const researchOutput = baseResearchOutput;
  const teamId = researchOutput.teams[0]!.id;
  const { type, descriptionMD, title } = researchOutput;
  const link = 'https://example42.com';
  const doi = '10.0777';

  await renderPage({
    teamId: '42',
    outputDocumentType: 'article',
    researchOutputData: { ...researchOutput, doi, published: false },
    versionAction: 'edit',
  });

  const user = userEvent.setup({ delay: null });
  const { saveDraft } = await mandatoryFields(
    {
      link,
      title: '',
      descriptionMD: 'descriptionMD',
      type,
      doi,
    },
    true,
    true,
    false,
    user,
  );
  await saveDraft();

  expect(mockUpdateResearchOutput).toHaveBeenCalledWith(
    researchOutput.id,
    expect.objectContaining({
      link,
      title,
      descriptionMD,
      teams: [teamId],
    }),
    expect.anything(),
  );
});

it('can edit and publish a draft research output', async () => {
  const researchOutput = baseResearchOutput;
  const teamId = researchOutput.teams[0]!.id;
  const { type, title } = researchOutput;
  const link = 'https://example42.com';
  const doi = '10.0777';

  await renderPage({
    teamId: '42',
    outputDocumentType: 'article',
    researchOutputData: {
      ...researchOutput,
      doi,
      published: false,
      statusChangedBy: {
        firstName: 'John',
        lastName: 'Doe',
        id: 'user-2-id',
      },
      isInReview: false,
    },
    versionAction: 'edit',
  });

  const initiallyPublished = false;
  const user = userEvent.setup({ delay: null });
  const { publish } = await mandatoryFields(
    {
      link,
      title: '',
      type,
      doi,
    },
    true,
    true,
    initiallyPublished,
    user,
  );
  await publish();

  expect(mockUpdateResearchOutput).toHaveBeenCalledWith(
    researchOutput.id,
    expect.objectContaining({
      link,
      title,
      published: true,
      teams: [teamId],
      statusChangedById: 'user-2-id',
      isInReview: false,
    }),
    expect.anything(),
  );
});

it('can publish a new version for an output', async () => {
  const { descriptionMD, title, shortDescription } = baseResearchOutput;
  const link = 'https://example42.com';
  const doi = '10.0777';
  const changelog = 'creating new version';

  await renderPage({
    teamId: '42',
    researchOutputData: { ...baseResearchOutput, documentType: 'Article' },
    versionAction: 'create',
  });

  const user = userEvent.setup({ delay: null });
  await mandatoryFields(
    {
      link,
      title,
      descriptionMD: '',
      shortDescription,
      type: 'Preprint',
      doi,
    },
    true,
    false,
    true,
    user,
  );

  fireEvent.change(screen.getByRole('textbox', { name: /changelog/i }), {
    target: { value: changelog },
  });

  await user.click(screen.getByRole('button', { name: /Save/i }));
  const button = await findConfirmModalButton(/Publish new version/i);
  await user.click(button);

  await waitFor(() => {
    expect(mockUpdateResearchOutput).toHaveBeenCalledWith(
      baseResearchOutput.id,
      expect.objectContaining({
        changelog,
        relatedManuscriptVersion: undefined,
        descriptionMD,
        doi,
        link,
        createVersion: true,
        type: 'Preprint',
        documentType: 'Article',
      }),
      expect.anything(),
    );
  });
});

async function renderPage({
  user = {
    ...baseUser,
    teams: [{ ...baseUser.teams[0]!, id: '42', role: 'Project Manager' }],
  },
  teamId,
  outputDocumentType = 'bioinformatics',
  researchOutputData,
  versionAction,
  latestManuscriptVersion,
  isDuplicate,
}: RenderPageOptions) {
  const path =
    network.template +
    network({}).teams.template +
    network({}).teams({}).team.template +
    network({}).teams({}).team({ teamId }).createOutput.template;

  const initialPath = network({})
    .teams({})
    .team({ teamId })
    .createOutput({ outputDocumentType }).$;

  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <Suspense fallback="loading">
        <Auth0Provider user={user}>
          <WhenReady>
            <MemoryRouter initialEntries={[initialPath]}>
              <Routes>
                <Route
                  path={path}
                  element={
                    <ProjectOutput
                      teamId={teamId}
                      researchOutputData={researchOutputData}
                      versionAction={versionAction}
                      latestManuscriptVersion={latestManuscriptVersion}
                      isDuplicate={isDuplicate}
                    />
                  }
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
}
