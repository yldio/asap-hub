import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import {
  createManuscriptVersionResponse,
  createResearchOutputResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import { disable, enable } from '@asap-hub/flags';
import type { Flag } from '@asap-hub/flags';
import { BackendError } from '@asap-hub/frontend-utils';
import {
  ManuscriptLifecycle,
  ManuscriptVersionResponse,
  ResearchOutputResponse,
  UserResponse,
  ValidationErrorResponse,
} from '@asap-hub/model';
import { network, OutputDocumentTypeParameter } from '@asap-hub/routing';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent, { specialChars } from '@testing-library/user-event';
import { editorRef } from '@asap-hub/react-components';
import { Suspense } from 'react';
import { Route, StaticRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { getGeneratedShortDescription } from '../../../shared-api/content-generator';
import {
  createResearchOutput,
  getManuscriptVersions,
  getTeam,
  updateTeamResearchOutput,
} from '../api';
import { getImpacts } from '../../../shared-api/impact';
import { refreshTeamState, usePostPreprintResearchOutput } from '../state';
import TeamOutput from '../TeamOutput';

jest.mock(
  'react-lottie',
  () =>
    function MockLottie() {
      return <div>Loading...</div>;
    },
);

jest.setTimeout(60000);
jest.mock('../api');
jest.mock('../../users/api');
jest.mock('../../../shared-api/impact');
jest.mock('../../../shared-research/api');
jest.mock('../../../shared-api/content-generator');
jest.mock('../state', () => ({
  ...jest.requireActual('../state'),
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
    },
  ],
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
) => {
  const url = isLinkRequired ? /url \(required\)/i : /url \(optional\)/i;

  userEvent.type(screen.getByRole('textbox', { name: url }), link);
  userEvent.type(screen.getByRole('textbox', { name: /title/i }), title);

  await waitFor(() => expect(editorRef.current).not.toBeNull());

  editorRef.current?.focus();

  const descriptionEditor = screen.getByTestId('editor');
  userEvent.click(descriptionEditor);
  userEvent.tab();
  fireEvent.input(descriptionEditor, { data: descriptionMD });
  userEvent.tab();

  userEvent.type(
    screen.getByRole('textbox', { name: /short description/i }),
    shortDescription,
  );

  const typeInput = screen.getByRole('textbox', { name: /Select the type/i });
  userEvent.type(typeInput, type);
  userEvent.type(typeInput, specialChars.enter);

  const identifier = screen.getByRole('textbox', { name: /identifier/i });
  userEvent.type(identifier, 'DOI');
  userEvent.type(identifier, specialChars.enter);
  userEvent.type(screen.getByPlaceholderText('e.g. 10.5555/YFRU1371'), doi);
  return {
    publish: async () => {
      if (isEditMode && published) {
        const button = screen.getByRole('button', { name: /Save/i });
        userEvent.click(button);
        await waitFor(() => {
          expect(button).toBeEnabled();
        });
      } else {
        userEvent.click(screen.getByRole('button', { name: /Publish/i }));
        const button = screen.getByRole('button', { name: /Publish Output/i });
        userEvent.click(button);
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
        userEvent.click(saveDraftButton);
        await waitFor(() => {
          expect(saveDraftButton).toBeEnabled();
        });
      }
    },
  };
};

const mockCreateResearchOutput = createResearchOutput as jest.MockedFunction<
  typeof createResearchOutput
>;

const mockGetTeam = getTeam as jest.MockedFunction<typeof getTeam>;

const mockUpdateResearchOutput =
  updateTeamResearchOutput as jest.MockedFunction<
    typeof updateTeamResearchOutput
  >;

const mockGetGeneratedShortDescription =
  getGeneratedShortDescription as jest.MockedFunction<
    typeof getGeneratedShortDescription
  >;

const mockGetImpacts = getImpacts as jest.MockedFunction<typeof getImpacts>;

const mockUsePostPreprintResearchOutput =
  usePostPreprintResearchOutput as jest.MockedFunction<
    typeof usePostPreprintResearchOutput
  >;

const mockGetManuscriptVersions = getManuscriptVersions as jest.MockedFunction<
  typeof getManuscriptVersions
>;

interface RenderPageOptions {
  user?: UserResponse;
  teamId: string;
  versionAction?: 'create' | 'edit';
  outputDocumentType?: OutputDocumentTypeParameter;
  researchOutputData?: ResearchOutputResponse;
  latestManuscriptVersion?: ManuscriptVersionResponse;
}

beforeEach(() => {
  disable('MANUSCRIPT_OUTPUTS' as Flag);
  mockGetImpacts.mockResolvedValue({
    total: 0,
    items: [],
  });
});

it('Renders the research output', async () => {
  await renderPage({
    teamId: '42',
    outputDocumentType: 'bioinformatics',
  });

  expect(
    screen.getByRole('heading', { name: /Share Team Bioinformatics/i }),
  ).toBeInTheDocument();
});

it('Shows the not found page if the team does not exist', async () => {
  mockGetTeam.mockResolvedValueOnce(undefined);
  await renderPage({
    teamId: '42',
    outputDocumentType: 'bioinformatics',
  });
  expect(screen.getByText(/Sorry.+page/i)).toBeVisible();
});

it('displays the publish button for new research outputs', async () => {
  await renderPage({
    teamId: '42',
    outputDocumentType: 'bioinformatics',
  });

  expect(screen.getByRole('button', { name: /Publish/i })).toBeInTheDocument();
});

it('displays the save button for existing research outputs', async () => {
  await renderPage({
    teamId: '42',
    outputDocumentType: 'bioinformatics',
    researchOutputData: baseResearchOutput,
  });

  expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
});

it('displays the research output with one version in create mode', async () => {
  await renderPage({
    teamId: '42',
    outputDocumentType: 'bioinformatics',
    researchOutputData: baseResearchOutput,
    versionAction: 'create',
  });

  expect(screen.getByText(/#1/i)).toBeInTheDocument();
});

it('displays the research output with no version in edit mode', async () => {
  await renderPage({
    teamId: '42',
    outputDocumentType: 'bioinformatics',
    researchOutputData: baseResearchOutput,
    versionAction: 'edit',
  });

  expect(screen.queryByText(/#1/i)).not.toBeInTheDocument();
});

it('switches research output type based on parameter', async () => {
  await renderPage({ teamId: '42', outputDocumentType: 'article' });

  expect(
    screen.getByRole('heading', { name: /Share a Team Article/i }),
  ).toBeInTheDocument();
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

  const { publish } = await mandatoryFields({
    link,
    title,
    descriptionMD,
    shortDescription,
    type,
    doi,
  });

  userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
  userEvent.click(screen.getByText('Example 1 Lab'));
  userEvent.click(screen.getByRole('textbox', { name: /Authors/i }));
  userEvent.click(screen.getByText('Person A 3'));

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

  const { saveDraft } = await mandatoryFields({
    link,
    title,
    descriptionMD,
    shortDescription,
    type,
    doi,
  });

  userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
  userEvent.click(screen.getByText('Example 1 Lab'));
  userEvent.click(screen.getByRole('textbox', { name: /Authors/i }));
  userEvent.click(screen.getByText('Person A 3'));

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
  });

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
  });

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
  });

  const initiallyPublished = false;
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
  );

  userEvent.type(
    screen.getByRole('textbox', { name: /changelog/i }),
    changelog,
  );

  userEvent.click(screen.getByRole('button', { name: /Save/i }));
  const button = screen.getByRole('button', { name: /Publish new version/i });
  userEvent.click(button);

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

it('generates the short description based on the current description', async () => {
  mockGetGeneratedShortDescription.mockResolvedValueOnce({
    shortDescription: 'test generated short description 1',
  });

  await renderPage({
    teamId: '42',
    outputDocumentType: 'bioinformatics',
    researchOutputData: {
      ...baseResearchOutput,
      descriptionMD: 'output description',
    },
  });

  userEvent.click(screen.getByRole('button', { name: /Generate/i }));

  await waitFor(() => {
    expect(
      screen.getByRole('textbox', { name: /short description/i }),
    ).toHaveValue('test generated short description 1');
  });
});

it('will show server side validation error for link', async () => {
  const validationResponse: ValidationErrorResponse = {
    message: 'Validation error',
    error: 'Bad Request',
    statusCode: 400,
    data: [
      { instancePath: '/link', keyword: '', params: {}, schemaPath: 'link' },
    ],
  };

  mockCreateResearchOutput.mockRejectedValue(
    new BackendError('example', validationResponse, 400),
  );

  await renderPage({
    teamId: '42',
    outputDocumentType: 'bioinformatics',
  });
  const { publish } = await mandatoryFields({ type: 'Code' }, true);

  await publish();

  expect(mockCreateResearchOutput).toHaveBeenCalled();
  expect(
    screen.queryAllByText(
      'A Research Output with this URL already exists. Please enter a different URL.',
    ).length,
  ).toBeGreaterThan(1);

  const url = screen.getByRole('textbox', { name: /URL \(required\)/i });
  userEvent.type(url, 'a');
  url.blur();

  expect(
    screen.queryByText(
      'A Research Output with this URL already exists. Please enter a different URL.',
    ),
  ).toBeNull();
});

it('will toast server side errors for unknown errors', async () => {
  mockCreateResearchOutput.mockRejectedValue(new Error('Something went wrong'));

  await renderPage({
    teamId: '42',
    outputDocumentType: 'bioinformatics',
  });
  const { publish } = await mandatoryFields({ type: 'Code' }, true);

  await publish();

  expect(mockCreateResearchOutput).toHaveBeenCalled();
  expect(
    screen.queryByText(
      'There was an error and we were unable to save your changes. Please try again.',
    ),
  ).toBeInTheDocument();
  expect(window.scrollTo).toHaveBeenCalled();

  userEvent.click(screen.getByRole('button', { name: /Close/i }));

  expect(
    screen.queryByText(
      'There was an error and we were unable to save your changes. Please try again.',
    ),
  ).not.toBeInTheDocument();
});

it('will toast server side errors for unknown errors in edit mode', async () => {
  const link = 'https://example42.com';
  const title = 'example42 title';
  const descriptionMD = 'example42 description';
  const type = 'Animal Model';
  const doi = '10.0777';
  mockUpdateResearchOutput.mockRejectedValue(new Error('Something went wrong'));

  await renderPage({
    teamId: '42',
    outputDocumentType: 'article',
    researchOutputData: { ...baseResearchOutput, doi },
  });

  const { publish } = await mandatoryFields(
    {
      link,
      title,
      descriptionMD,
      type,
      doi,
    },
    true,
    true,
  );
  await publish();

  expect(mockUpdateResearchOutput).toHaveBeenCalled();
  expect(
    screen.queryByText(
      'There was an error and we were unable to save your changes. Please try again.',
    ),
  ).toBeInTheDocument();
  expect(window.scrollTo).toHaveBeenCalled();
});

it('display a toast warning when creating a new version', async () => {
  await renderPage({
    teamId: '42',
    outputDocumentType: 'article',
    researchOutputData: baseResearchOutput,
    versionAction: 'create',
  });

  expect(
    screen.queryByText(
      'The previous output page will be replaced with a summarised version history section.',
    ),
  ).toBeInTheDocument();
});

it('renders an empty changelog input field when creating a new version of a research output', async () => {
  await renderPage({
    teamId: '42',
    outputDocumentType: 'article',
    researchOutputData: baseResearchOutput,
    versionAction: 'create',
  });

  expect(screen.getByRole('textbox', { name: /changelog/i })).toHaveValue('');
});

it('shows changelog input with existing data when editing a versioned research output', async () => {
  await renderPage({
    teamId: '42',
    outputDocumentType: 'article',
    researchOutputData: {
      ...baseResearchOutput,
      changelog: 'example changelog',
      versions: [
        {
          documentType: 'Article',
          title: 'test title',
          id: '1',
        },
      ],
    },
    versionAction: 'edit',
  });

  expect(screen.getByRole('textbox', { name: /changelog/i })).toHaveValue(
    'example changelog',
  );
});

it('hides changelog input when editing a research output with no version history', async () => {
  await renderPage({
    teamId: '42',
    outputDocumentType: 'article',
    researchOutputData: {
      ...baseResearchOutput,
      versions: [],
    },
    versionAction: 'edit',
  });

  expect(
    screen.queryByRole('textbox', { name: /changelog/i }),
  ).not.toBeInTheDocument();
});

describe('when MANUSCRIPT_OUTPUTS flag is enabled', () => {
  beforeEach(() => {
    enable('MANUSCRIPT_OUTPUTS' as Flag);
  });

  describe('preprint automatically created', () => {
    beforeEach(() => {
      mockUsePostPreprintResearchOutput.mockReset();
    });

    const title = 'Version One';
    const id = 'mv-manuscript-id-1';
    const type = 'Original Research';
    const lifecycle = 'Publication';
    const versionId = 'version-id-1';
    const manuscriptId = 'DA1-000463-002-org-G-1';
    const url = 'http://example.com';
    const authors = [
      {
        displayName: 'First Author',
        email: 'first.author@gmail.com',
        firstName: 'First',
        id: 'first-author-id-1',
        lastName: 'Author',
      },
    ];
    const categories = [
      {
        id: 'category-id-1',
        name: 'Methods',
      },
    ];
    const impact = {
      id: 'impact-id-1',
      name: 'New method/model to explore PD mechanism',
    };
    const description = 'example42 description';
    const shortDescription = 'example42 short description';
    const teams = [
      {
        displayName: 'Team One',
        id: '42',
      },
    ];

    const manuscriptVersion: ManuscriptVersionResponse = {
      id,
      hasLinkedResearchOutput: false,
      title,
      type,
      lifecycle,
      versionId,
      manuscriptId,
      url,
      authors,
      categories,
      description,
      shortDescription,
      impact,
      teams,
    };

    mockGetManuscriptVersions.mockResolvedValue({
      total: 1,
      items: [manuscriptVersion],
    });

    it('handles error during preprint research output creation', async () => {
      (usePostPreprintResearchOutput as jest.Mock).mockReturnValue(() =>
        Promise.reject(new Error('Failed to create preprint')),
      );

      await renderPage({ teamId: '42', outputDocumentType: 'article' });

      expect(
        screen.getByLabelText('Import from manuscript'),
      ).toBeInTheDocument();

      userEvent.click(screen.getByLabelText('Import from manuscript'));
      const input = screen.getByRole('textbox');
      userEvent.type(input, 'Error');
      const option = await screen.findByText('DA1-000463-002-org-G-1');
      userEvent.click(option);

      userEvent.click(screen.getByRole('button', { name: /import/i }));

      await waitFor(() => {
        expect(
          screen.getByText('An error has occurred. Please try again later.'),
        ).toBeInTheDocument();
      });

      userEvent.click(screen.getByRole('button', { name: /Close/i }));

      expect(
        screen.queryByText('An error has occurred. Please try again later.'),
      ).not.toBeInTheDocument();
    });

    it('handles successful preprint research output creation', async () => {
      (usePostPreprintResearchOutput as jest.Mock).mockReturnValue(() =>
        Promise.resolve({
          id: 'preprint-output-1',
          title: 'Preprint Output',
          documentType: 'Article',
          teams: [{ id: '42', displayName: 'Team One' }],
          published: true,
        }),
      );

      await renderPage({ teamId: '42', outputDocumentType: 'article' });

      userEvent.click(screen.getByLabelText('Import from manuscript'));
      const input = screen.getByRole('textbox');
      userEvent.type(input, 'Version One');
      const option = await screen.findByText('DA1-000463-002-org-G-1');
      userEvent.click(option);

      userEvent.click(screen.getByRole('button', { name: /import/i }));

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'What are you sharing?' }),
        ).toBeInTheDocument();
      });
      const changelog = 'creating new version with manuscript';

      userEvent.type(
        screen.getByRole('textbox', { name: /changelog/i }),
        changelog,
      );

      const doi = '10.1234/5678';
      const identifier = screen.getByRole('textbox', { name: /identifier/i });
      userEvent.type(identifier, 'DOI');
      userEvent.type(identifier, specialChars.enter);
      userEvent.type(screen.getByPlaceholderText('e.g. 10.5555/YFRU1371'), doi);

      userEvent.click(screen.getByRole('button', { name: /Publish/i }));

      const button = screen.getByRole('button', {
        name: /Publish new version/i,
      });

      userEvent.click(button);

      await waitFor(() => {
        expect(mockUpdateResearchOutput).toHaveBeenCalledWith(
          'preprint-output-1',
          expect.objectContaining({
            relatedManuscriptVersion: 'version-id-1',
          }),
          expect.anything(),
        );
      });
    });

    it('handles preprint research output creation without id', async () => {
      (usePostPreprintResearchOutput as jest.Mock).mockReturnValue(() =>
        Promise.resolve({
          title: 'Preprint Output',
          documentType: 'Article',
          teams: [{ id: '42', displayName: 'Team One' }],
          published: true,
        }),
      );

      mockGetManuscriptVersions.mockResolvedValue({
        total: 1,
        items: [manuscriptVersion],
      });

      await renderPage({ teamId: '42', outputDocumentType: 'article' });

      userEvent.click(screen.getByLabelText('Import from manuscript'));
      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'Version One');
      const option = await screen.findByText('DA1-000463-002-org-G-1');
      await userEvent.click(option);

      userEvent.click(screen.getByRole('button', { name: /import/i }));

      expect(
        screen.getByText('How would you like to create your output?'),
      ).toBeInTheDocument();
    });
  });

  it('displays manuscript output selection options for Article document type', async () => {
    await renderPage({
      teamId: '42',
      outputDocumentType: 'article',
    });

    expect(
      screen.getByText('How would you like to create your output?'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Create manually')).toBeInTheDocument();
    expect(screen.getByLabelText('Import from manuscript')).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', { name: 'What are you sharing?' }),
    ).not.toBeInTheDocument();
  });

  it.each(['bioinformatics', 'dataset', 'lab-material', 'protocol', 'report'])(
    'skips manuscript output selection for %s document type',
    async (documentType) => {
      await renderPage({
        teamId: '42',
        outputDocumentType: documentType as OutputDocumentTypeParameter,
      });

      expect(
        screen.queryByText('How would you like to create your output?'),
      ).not.toBeInTheDocument();

      expect(
        screen.getByRole('heading', { name: 'What are you sharing?' }),
      ).toBeInTheDocument();
    },
  );

  it('skips manuscript output selection when editing existing research output', async () => {
    await renderPage({
      teamId: '42',
      researchOutputData: {
        ...baseResearchOutput,
        id: '1',
        documentType: 'Article',
      },
    });

    expect(
      screen.queryByText('How would you like to create your output?'),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'What are you sharing?' }),
    ).toBeInTheDocument();
  });

  it('skips manuscript output selection when creating a new research output version', async () => {
    await renderPage({
      teamId: '42',
      researchOutputData: {
        ...baseResearchOutput,
        id: '1',
        documentType: 'Article',
      },
      versionAction: 'create',
    });

    expect(
      screen.queryByText('How would you like to create your output?'),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'What are you sharing?' }),
    ).toBeInTheDocument();
  });

  it('displays create button and hides import button when manual creation is selected', async () => {
    await renderPage({
      teamId: '42',
      outputDocumentType: 'article',
    });

    userEvent.click(screen.getByLabelText('Create manually'));

    expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Import/i }),
    ).not.toBeInTheDocument();
  });

  it('displays import button and hides create button when manuscript import is selected', async () => {
    await renderPage({
      teamId: '42',
      outputDocumentType: 'article',
    });
    userEvent.click(screen.getByLabelText('Import from manuscript'));

    expect(screen.getByRole('button', { name: /Import/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Create/i }),
    ).not.toBeInTheDocument();
  });

  it('fetches manuscript version suggestions', async () => {
    await renderPage({
      teamId: '42',
      outputDocumentType: 'article',
    });
    userEvent.click(screen.getByLabelText('Import from manuscript'));

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Version One');
    await userEvent.tab();

    expect(screen.getByRole('button', { name: /import/i })).toBeEnabled();
  });

  it('can publish a form with selected manuscript version data', async () => {
    const title = 'Version One';
    const id = 'mv-manuscript-id-1';
    const type = 'Original Research';
    const lifecycle = 'Preprint';
    const versionId = 'version-id-1';
    const manuscriptId = 'DA1-000463-002-org-G-1';
    const url = 'http://example.com';
    const authors = [
      {
        displayName: 'First Author',
        email: 'first.author@gmail.com',
        firstName: 'First',
        id: 'first-author-id-1',
        lastName: 'Author',
      },
    ];
    const categories = [
      {
        id: 'category-id-1',
        name: 'Methods',
      },
    ];
    const impact = {
      id: 'impact-id-1',
      name: 'New method/model to explore PD mechanism',
    };
    const description = 'example42 description';
    const shortDescription = 'example42 short description';
    const teams = [
      {
        displayName: 'Team One',
        id: '42',
      },
    ];
    const doi = '10.1234/5678';

    mockGetManuscriptVersions.mockResolvedValue({
      total: 1,
      items: [
        {
          id,
          hasLinkedResearchOutput: false,
          title,
          type,
          lifecycle,
          versionId,
          manuscriptId,
          url,
          authors,
          categories,
          description,
          shortDescription,
          impact,
          teams,
        },
      ],
    });

    await renderPage({ teamId: '42', outputDocumentType: 'article' });

    userEvent.click(screen.getByLabelText('Import from manuscript'));
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Version');
    const option = await screen.findByText('Version One');
    await userEvent.click(option);

    userEvent.click(screen.getByRole('button', { name: /import/i }));

    expect(
      screen.getByRole('heading', { name: /Imported Manuscript Version/i }),
    ).toBeInTheDocument();

    const identifier = screen.getByRole('textbox', { name: /identifier/i });
    userEvent.type(identifier, 'DOI');
    userEvent.type(identifier, specialChars.enter);
    userEvent.type(screen.getByPlaceholderText('e.g. 10.5555/YFRU1371'), doi);

    userEvent.click(screen.getByRole('button', { name: /Publish/i }));
    const button = screen.getByRole('button', { name: /Publish Output/i });
    userEvent.click(button);
    await waitFor(() => {
      expect(button).not.toBeInTheDocument();
    });

    expect(mockCreateResearchOutput).toHaveBeenCalledWith(
      {
        documentType: 'Article',
        sharingStatus: 'Public',
        teams: [teams[0]?.id],
        link: url,
        title,
        descriptionMD: description,
        description: '',
        shortDescription,
        changelog: '',
        subtype: type,
        type: lifecycle,
        authors: [
          {
            userId: authors[0]?.id,
          },
        ],
        methods: [],
        labs: [],
        organisms: [],
        environments: [],
        keywords: [],
        workingGroups: [],
        relatedResearch: [],
        relatedEvents: [],
        labCatalogNumber: undefined,
        publishDate: undefined,
        usageNotes: '',
        asapFunded: true,
        usedInPublication: true,
        published: true,
        categories: ['category-id-1'],
        impact: 'impact-id-1',
        relatedManuscript: 'manuscript-id-1',
        relatedManuscriptVersion: versionId,
        doi,
      },
      expect.anything(),
    );
  });

  it('can publish a new version for a manuscript output', async () => {
    const teamId = '42';
    const doi = '10.0777';
    const description = 'version description';
    const shortDescription = 'version short description';
    const lifecycle = 'Publication' as ManuscriptLifecycle;
    const changelog = 'importing new version';
    const latestManuscriptVersion = {
      ...createManuscriptVersionResponse(),
      impact: { id: 'impact-id-1', name: 'Impact 1' },
      categories: [{ id: 'category-id-1', name: 'Category 1' }],
      description,
      shortDescription,
      doi,
      lifecycle,
      teams: [{ id: teamId, displayName: 'Test Team' }],
    };

    await renderPage({
      teamId,
      researchOutputData: {
        ...baseResearchOutput,
        documentType: 'Article',
        relatedManuscript: 'manuscript-id-1',
      },
      versionAction: 'create',
      latestManuscriptVersion,
    });

    userEvent.type(
      screen.getByRole('textbox', { name: /changelog/i }),
      changelog,
    );

    userEvent.click(screen.getByRole('button', { name: /Save/i }));
    const button = screen.getByRole('button', { name: /Publish new version/i });
    userEvent.click(button);

    await waitFor(() => {
      expect(mockUpdateResearchOutput).toHaveBeenCalledWith(
        baseResearchOutput.id,
        expect.objectContaining({
          changelog,
          relatedManuscriptVersion: latestManuscriptVersion.versionId,
          createVersion: true,
          type: 'Published',
          documentType: 'Article',
        }),
        expect.anything(),
      );
    });
  });

  it('navigates to standard output form when manual creation is confirmed', async () => {
    await renderPage({
      teamId: '42',
      outputDocumentType: 'article',
    });

    userEvent.click(screen.getByLabelText('Create manually'));

    expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: /Create/i }));

    expect(
      screen.getByRole('heading', { name: 'What are you sharing?' }),
    ).toBeInTheDocument();
  });
});

it('bypasses manuscript output selection when MANUSCRIPT_OUTPUTS flag is disabled', async () => {
  disable('MANUSCRIPT_OUTPUTS' as Flag);
  await renderPage({
    teamId: '42',
    outputDocumentType: 'article',
  });

  expect(
    screen.queryByText('How would you like to create your output?'),
  ).not.toBeInTheDocument();
  expect(screen.queryByLabelText('Create manually')).not.toBeInTheDocument();
  expect(
    screen.queryByLabelText('Import from manuscript'),
  ).not.toBeInTheDocument();

  expect(
    screen.getByRole('heading', { name: 'What are you sharing?' }),
  ).toBeInTheDocument();
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
}: RenderPageOptions) {
  const path =
    network.template +
    network({}).teams.template +
    network({}).teams({}).team.template +
    network({}).teams({}).team({ teamId }).createOutput.template;

  render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(refreshTeamState(teamId), Math.random())
      }
    >
      <Suspense fallback="loading">
        <Auth0Provider user={user}>
          <WhenReady>
            <StaticRouter
              location={
                network({})
                  .teams({})
                  .team({ teamId })
                  .createOutput({ outputDocumentType }).$
              }
            >
              <Route path={path}>
                <TeamOutput
                  teamId={teamId}
                  researchOutputData={researchOutputData}
                  versionAction={versionAction}
                  latestManuscriptVersion={latestManuscriptVersion}
                />
              </Route>
            </StaticRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
}
