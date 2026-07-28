import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import {
  createManuscriptVersionResponse,
  createResearchOutputResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import { BackendError } from '@asap-hub/frontend-utils';
import {
  ResearchOutputPostRequest,
  ResearchOutputResponse,
  ResearchOutputVersion,
  UserResponse,
  ValidationErrorResponse,
} from '@asap-hub/model';
import { network, OutputDocumentTypeParameter } from '@asap-hub/routing';
import {
  act,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { RecoilRoot } from 'recoil';
import {
  createResearchOutput,
  getTeam,
  updateTeamResearchOutput,
} from '../../network/teams/api';
import { refreshTeamState } from '../../network/teams/state';
import ProjectOutput from '../ProjectOutput';

jest.mock('../../network/teams/api');
jest.mock('../../network/users/api');
jest.mock('../../shared-api/impact');
jest.mock('../../shared-research/api');
jest.mock('../../shared-api/content-generator');
jest.mock('../../network/teams/state', () => ({
  ...jest.requireActual('../../network/teams/state'),
  usePostPreprintResearchOutput: jest.fn(() =>
    jest.fn().mockResolvedValue({ id: 'preprint-ro' }),
  ),
}));

type ResearchOutputFormProps = {
  documentType: string;
  published: boolean;
  flowId: string;
  researchOutputData?: ResearchOutputResponse;
  isImportedFromManuscript?: boolean;
  serverValidationErrors?: ValidationErrorResponse['data'];
  availableActions: {
    showSaveDraftButton: boolean;
    showVersionHistory: boolean;
    showChangelog: boolean;
  };
  onSave: (output: ResearchOutputPostRequest) => void | Promise<unknown>;
  onSaveDraft?: (output: ResearchOutputPostRequest) => void | Promise<unknown>;
};

let capturedFormProps: ResearchOutputFormProps | undefined;
let capturedManuscriptSelectionProps:
  | {
      onSelectCreateManually: () => void;
      onImportManuscript: () => void | Promise<void>;
      onChangeManuscriptOutputSelection: (
        value: 'manually' | 'import' | '',
      ) => void;
      setSelectedVersion: (option: unknown) => void;
    }
  | undefined;

jest.mock('@asap-hub/react-components', () => {
  /* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, global-require, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
  const React = require('react');

  const headerTextMap: Record<string, string> = {
    Protocol: 'Share a Team Protocol',
    Dataset: 'Share a Team Dataset',
    Bioinformatics: 'Share Team Bioinformatics',
    'Lab Material': 'Share a Team Lab Material',
    Article: 'Share a Team Article',
    Report: 'Share a Team Report',
  };

  return {
    __esModule: true,
    ResearchOutputForm: (props: ResearchOutputFormProps) => {
      capturedFormProps = props;
      return <div data-testid="research-output-form" />;
    },
    ResearchOutputHeader: ({ documentType }: { documentType: string }) => (
      <h1>{headerTextMap[documentType] ?? documentType}</h1>
    ),
    OutputVersions: ({
      versions,
      formLayout,
    }: {
      versions: ResearchOutputVersion[];
      formLayout?: boolean;
    }) =>
      formLayout ? (
        <div data-testid="output-versions">
          {versions.map((_: ResearchOutputVersion, index: number) => (
            <span key={index}>{`#${index + 1}`}</span>
          ))}
        </div>
      ) : null,
    Toast: ({
      children,
      accent,
    }: {
      children?: React.ReactNode;
      accent?: string;
    }) => <div data-testid={`toast-${accent ?? 'default'}`}>{children}</div>,
    NotFoundPage: () => <div>Sorry! We cannot find that page.</div>,
    Loading: () => <div>loading</div>,
    ManuscriptVersionImportCard: () => (
      <div data-testid="manuscript-import-card" />
    ),
    ManuscriptOutputSelection: (props: {
      onSelectCreateManually: () => void;
      onImportManuscript: () => void | Promise<void>;
      onChangeManuscriptOutputSelection: (
        value: 'manually' | 'import' | '',
      ) => void;
      setSelectedVersion: (option: unknown) => void;
    }) => {
      capturedManuscriptSelectionProps = props;
      return (
        <div data-testid="manuscript-output-selection">
          <button
            type="button"
            onClick={() => {
              props.onChangeManuscriptOutputSelection('manually');
              props.onSelectCreateManually();
            }}
          >
            Create manually
          </button>
        </div>
      );
    },
    usePrevious: (value: unknown) => {
      const ref = React.useRef();
      React.useEffect(() => {
        ref.current = value;
      });
      return ref.current;
    },
  };
  /* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, global-require, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
});

beforeEach(() => {
  window.scrollTo = jest.fn();
  jest.spyOn(console, 'error').mockImplementation();
  jest.spyOn(console, 'warn').mockImplementation();
  capturedFormProps = undefined;
  capturedManuscriptSelectionProps = undefined;
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

const minimalOutputPayload = {
  title: 'example title',
  documentType: 'Lab Material',
  description: '',
  descriptionMD: 'example description',
  shortDescription: 'example short description',
  changelog: '',
  sharingStatus: 'Network Only',
  published: true,
  teams: ['42'],
  labs: [],
  authors: [],
  methods: [],
  organisms: [],
  environments: [],
  keywords: [],
  workingGroups: [],
  relatedResearch: [],
  relatedEvents: [],
  categories: [],
  impact: '',
  layImpactStatement: '',
  usageNotes: '',
} as ResearchOutputPostRequest;

const mockCreateResearchOutput = createResearchOutput as jest.MockedFunction<
  typeof createResearchOutput
>;
const mockGetTeam = getTeam as jest.MockedFunction<typeof getTeam>;
const mockUpdateResearchOutput =
  updateTeamResearchOutput as jest.MockedFunction<
    typeof updateTeamResearchOutput
  >;

interface RenderPageOptions {
  user?: UserResponse;
  teamId: string;
  versionAction?: 'create' | 'edit';
  outputDocumentType?: OutputDocumentTypeParameter;
  existingOutput?: ResearchOutputResponse;
  latestManuscriptVersion?: ReturnType<typeof createManuscriptVersionResponse>;
  isDuplicate?: boolean;
}

async function renderPage({
  user = {
    ...baseUser,
    teams: [{ ...baseUser.teams[0]!, id: '42', role: 'Project Manager' }],
  },
  teamId,
  outputDocumentType = 'bioinformatics',
  existingOutput,
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
    <RecoilRoot
      initializeState={({ set }) =>
        set(refreshTeamState(teamId), Math.random())
      }
    >
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
                      existingOutput={existingOutput}
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
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
}

it('renders the research output form for non-article document types', async () => {
  await renderPage({
    teamId: '42',
    outputDocumentType: 'bioinformatics',
  });

  expect(
    screen.getByRole('heading', { name: /Share Team Bioinformatics/i }),
  ).toBeInTheDocument();
  expect(screen.getByTestId('research-output-form')).toBeInTheDocument();
  expect(capturedFormProps?.documentType).toBe('Bioinformatics');
  expect(capturedFormProps?.published).toBe(false);
});

it('shows the not found page if the team does not exist', async () => {
  mockGetTeam.mockResolvedValueOnce(undefined);
  await renderPage({
    teamId: '42',
    outputDocumentType: 'bioinformatics',
  });
  expect(screen.getByText(/Sorry.+page/i)).toBeVisible();
});

it('passes create flow actions for new research outputs', async () => {
  await renderPage({
    teamId: '42',
    outputDocumentType: 'bioinformatics',
  });

  expect(capturedFormProps?.availableActions.showSaveDraftButton).toBe(true);
  expect(capturedFormProps?.flowId).toContain('create');
});

it('passes edit flow for existing published research outputs', async () => {
  await renderPage({
    teamId: '42',
    outputDocumentType: 'bioinformatics',
    existingOutput: baseResearchOutput,
    versionAction: 'edit',
  });

  expect(capturedFormProps?.published).toBe(true);
  expect(capturedFormProps?.researchOutputData?.id).toBe(baseResearchOutput.id);
  expect(capturedFormProps?.flowId).toContain('edit');
});

it('shows version history when creating a new version', async () => {
  await renderPage({
    teamId: '42',
    outputDocumentType: 'bioinformatics',
    existingOutput: baseResearchOutput,
    versionAction: 'create',
  });

  expect(screen.getByTestId('output-versions')).toBeInTheDocument();
  expect(screen.getByText(/#1/i)).toBeInTheDocument();
  expect(capturedFormProps?.availableActions.showVersionHistory).toBe(true);
});

it('hides version history when editing without prior versions', async () => {
  await renderPage({
    teamId: '42',
    outputDocumentType: 'bioinformatics',
    existingOutput: { ...baseResearchOutput, versions: [] },
    versionAction: 'edit',
  });

  expect(screen.queryByTestId('output-versions')).not.toBeInTheDocument();
  expect(capturedFormProps?.availableActions.showVersionHistory).toBe(false);
});

it('switches research output type based on parameter', async () => {
  await renderPage({ teamId: '42', outputDocumentType: 'article' });

  expect(
    screen.getByRole('heading', { name: /Share a Team Article/i }),
  ).toBeInTheDocument();
  expect(screen.getByTestId('manuscript-output-selection')).toBeInTheDocument();
  expect(screen.queryByTestId('research-output-form')).not.toBeInTheDocument();
});

it('publishes a new research output through onSave', async () => {
  await renderPage({ teamId: '42', outputDocumentType: 'lab-material' });

  await capturedFormProps!.onSave(minimalOutputPayload);

  await waitFor(() => {
    expect(mockCreateResearchOutput).toHaveBeenCalledWith(
      expect.objectContaining({
        ...minimalOutputPayload,
        published: true,
      }),
      expect.anything(),
    );
  });
});

it('saves a draft through onSaveDraft', async () => {
  await renderPage({ teamId: '42', outputDocumentType: 'lab-material' });

  await capturedFormProps!.onSaveDraft!(minimalOutputPayload);

  await waitFor(() => {
    expect(mockCreateResearchOutput).toHaveBeenCalledWith(
      expect.objectContaining({
        ...minimalOutputPayload,
        published: false,
      }),
      expect.anything(),
    );
  });
});

it('updates an existing research output through onSave', async () => {
  const link = 'https://example42.com';
  await renderPage({
    teamId: '42',
    outputDocumentType: 'bioinformatics',
    existingOutput: baseResearchOutput,
    versionAction: 'edit',
  });

  await capturedFormProps!.onSave({
    ...minimalOutputPayload,
    link,
    title: baseResearchOutput.title,
    descriptionMD: baseResearchOutput.descriptionMD ?? '',
  });

  await waitFor(() => {
    expect(mockUpdateResearchOutput).toHaveBeenCalledWith(
      baseResearchOutput.id,
      expect.objectContaining({
        link,
        title: baseResearchOutput.title,
        published: true,
      }),
      expect.anything(),
    );
  });
});

it('publishes a new version through onSave', async () => {
  await renderPage({
    teamId: '42',
    outputDocumentType: 'bioinformatics',
    existingOutput: baseResearchOutput,
    versionAction: 'create',
  });

  await capturedFormProps!.onSave(minimalOutputPayload);

  await waitFor(() => {
    expect(mockUpdateResearchOutput).toHaveBeenCalledWith(
      baseResearchOutput.id,
      expect.objectContaining({
        published: true,
        createVersion: true,
      }),
      expect.anything(),
    );
  });
});

it('surfaces server-side validation errors for link', async () => {
  const validationResponse: ValidationErrorResponse = {
    message: 'Validation error',
    error: 'Bad Request',
    statusCode: 400,
    data: [
      {
        instancePath: '/link',
        schemaPath: '',
        keyword: 'unique',
        message: 'must be unique',
        params: {},
      },
    ],
  };
  mockCreateResearchOutput.mockRejectedValueOnce(
    new BackendError('Validation error', validationResponse, 400),
  );

  await renderPage({ teamId: '42', outputDocumentType: 'lab-material' });
  await capturedFormProps!.onSave(minimalOutputPayload);

  await waitFor(() => {
    expect(capturedFormProps?.serverValidationErrors).toEqual(
      validationResponse.data,
    );
  });
});

it('rejects unknown server errors on create (form toasts are covered in react-components)', async () => {
  mockCreateResearchOutput.mockRejectedValueOnce(new Error('Unknown'));

  await renderPage({ teamId: '42', outputDocumentType: 'lab-material' });

  await expect(capturedFormProps!.onSave(minimalOutputPayload)).rejects.toThrow(
    'Unknown',
  );
});

it('displays a toast warning when creating a new version', async () => {
  await renderPage({
    teamId: '42',
    outputDocumentType: 'bioinformatics',
    existingOutput: baseResearchOutput,
    versionAction: 'create',
  });

  expect(screen.getByTestId('toast-warning')).toHaveTextContent(
    /previous output page will be replaced/i,
  );
});

it('passes an empty changelog when creating a new version', async () => {
  await renderPage({
    teamId: '42',
    outputDocumentType: 'bioinformatics',
    existingOutput: {
      ...baseResearchOutput,
      changelog: 'previous changelog',
      versions: [{ ...baseResearchOutput, id: 'v1' }],
    },
    versionAction: 'create',
  });

  expect(capturedFormProps?.availableActions.showChangelog).toBe(true);
  expect(capturedFormProps?.flowId).toContain('add-version');
});

describe('manuscript outputs flow', () => {
  it('shows manuscript selection for Article document type', async () => {
    await renderPage({ teamId: '42', outputDocumentType: 'article' });

    expect(
      screen.getByTestId('manuscript-output-selection'),
    ).toBeInTheDocument();
  });

  it('skips manuscript selection when editing an existing output', async () => {
    await renderPage({
      teamId: '42',
      outputDocumentType: 'article',
      existingOutput: baseResearchOutput,
      versionAction: 'edit',
    });

    expect(
      screen.queryByTestId('manuscript-output-selection'),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('research-output-form')).toBeInTheDocument();
  });

  it('skips manuscript selection when duplicating', async () => {
    await renderPage({
      teamId: '42',
      outputDocumentType: 'article',
      isDuplicate: true,
    });

    expect(
      screen.queryByTestId('manuscript-output-selection'),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('research-output-form')).toBeInTheDocument();
  });

  it('skips manuscript selection when creating a new version', async () => {
    await renderPage({
      teamId: '42',
      outputDocumentType: 'article',
      existingOutput: baseResearchOutput,
      versionAction: 'create',
    });

    expect(
      screen.queryByTestId('manuscript-output-selection'),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('research-output-form')).toBeInTheDocument();
  });

  it('navigates to the form after choosing create manually', async () => {
    await renderPage({ teamId: '42', outputDocumentType: 'article' });

    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByRole('button', { name: /Create manually/i }));

    expect(screen.getByTestId('research-output-form')).toBeInTheDocument();
    expect(capturedFormProps?.documentType).toBe('Article');
  });

  it('shows the manuscript import card after importing a preprint version', async () => {
    const manuscriptVersion = {
      ...createManuscriptVersionResponse(),
      lifecycle: 'Preprint' as const,
      researchOutputId: undefined,
    };

    await renderPage({ teamId: '42', outputDocumentType: 'article' });

    await act(async () => {
      capturedManuscriptSelectionProps!.onChangeManuscriptOutputSelection(
        'import',
      );
      capturedManuscriptSelectionProps!.setSelectedVersion({
        version: manuscriptVersion,
        label: manuscriptVersion.title,
        value: manuscriptVersion.id,
      });
    });

    await act(async () => {
      await capturedManuscriptSelectionProps!.onImportManuscript();
    });

    expect(screen.getByTestId('research-output-form')).toBeInTheDocument();
    expect(screen.getByTestId('manuscript-import-card')).toBeInTheDocument();
    expect(capturedFormProps?.isImportedFromManuscript).toBe(true);
  });
});
