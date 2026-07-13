import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router';
import {
  InnerToastContext,
  resolveResearchOutputAvailableActions,
} from '@asap-hub/react-context';

import {
  researchOutputDocumentTypeToType,
  ResearchOutputResponse,
  ResearchTagResponse,
} from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import ResearchOutputForm from '../../ResearchOutputForm';
import { fern, paper } from '../../../colors';
import { getDefaultProps } from '../../test-utils/research-output-form';
import { mockActErrorsInConsole } from '../../../test-utils';

jest.setTimeout(60000);

let consoleMock: ReturnType<typeof mockActErrorsInConsole>;

describe('form buttons', () => {
  const id = '42';
  const saveFn = jest.fn();
  const getLabSuggestions = jest.fn();
  const getAuthorSuggestions = jest.fn();

  beforeEach(() => {
    saveFn.mockResolvedValue({ id } as ResearchOutputResponse);
    getLabSuggestions.mockResolvedValue([]);
    getAuthorSuggestions.mockResolvedValue([]);

    consoleMock = mockActErrorsInConsole();
  });

  afterEach(() => {
    consoleMock.mockRestore();
    jest.resetAllMocks();
  });

  const setupForm = async (
    {
      canEditResearchOutput = false,
      canPublishResearchOutput = false,
      published = false,
      documentType = 'Article',
      researchTags = [{ id: '1', name: 'research tag 1' }],
      researchOutputData = undefined,
      versionAction = undefined,
      isImportedFromManuscript = false,
      flowId = 'team-create-manual',
    }: {
      canEditResearchOutput?: boolean;
      canPublishResearchOutput?: boolean;

      published?: boolean;
      documentType?: ComponentProps<typeof ResearchOutputForm>['documentType'];
      versionAction?: ComponentProps<
        typeof ResearchOutputForm
      >['versionAction'];
      researchTags?: ResearchTagResponse[];
      researchOutputData?: ComponentProps<
        typeof ResearchOutputForm
      >['researchOutputData'];
      isImportedFromManuscript?: ComponentProps<
        typeof ResearchOutputForm
      >['isImportedFromManuscript'];
      flowId?: ComponentProps<typeof ResearchOutputForm>['flowId'];
    } = {
      documentType: 'Article',
      researchTags: [],
    },
  ) => {
    const permissions = {
      canEditResearchOutput,
      canPublishResearchOutput,
      canShareResearchOutput: true,
    };
    render(
      <InnerToastContext.Provider value={jest.fn()}>
        <MemoryRouter>
          <ResearchOutputForm
            {...getDefaultProps()}
            versionAction={versionAction}
            researchOutputData={researchOutputData}
            selectedTeams={[{ value: 'TEAMID', label: 'Example Team' }]}
            documentType={documentType}
            typeOptions={Array.from(
              researchOutputDocumentTypeToType[documentType],
            )}
            onSave={saveFn}
            getLabSuggestions={getLabSuggestions}
            getAuthorSuggestions={getAuthorSuggestions}
            researchTags={researchTags}
            published={published}
            isImportedFromManuscript={isImportedFromManuscript}
            flowId={flowId}
            availableActions={resolveResearchOutputAvailableActions({
              flowId,
              permissions,
            })}
            permissions={permissions}
          />
        </MemoryRouter>
      </InnerToastContext.Provider>,
    );
  };

  const primaryButtonBg = fern.rgb;
  const notPrimaryButtonBg = paper.rgb;

  it('shows Cancel, Save Draft and Publish buttons when user has editing and publishing permissions and the research output has not been published yet', async () => {
    await setupForm({
      canEditResearchOutput: true,
      canPublishResearchOutput: true,
      published: false,
    });

    const publishButton = screen.getByRole('button', {
      name: /Publish/i,
    });
    expect(publishButton).toBeInTheDocument();
    expect(publishButton).toHaveStyle(`background-color:${primaryButtonBg}`);

    const saveDraftButton = screen.getByRole('button', { name: /Save Draft/i });
    expect(saveDraftButton).toBeInTheDocument();
    expect(saveDraftButton).toHaveStyle(
      `background-color:${notPrimaryButtonBg}`,
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveStyle(`background-color:${notPrimaryButtonBg}`);
  });

  it('shows only Cancel and Save buttons when user has editing and publishing permission and the research output has already been published', async () => {
    await setupForm({
      canEditResearchOutput: true,
      canPublishResearchOutput: true,
      published: true,
      flowId: 'team-edit-published',
    });

    expect(
      screen.queryByRole('button', { name: /Publish/i }),
    ).not.toBeInTheDocument();

    const saveDraftButton = screen.getByRole('button', { name: /Save/i });
    expect(saveDraftButton).toBeInTheDocument();
    expect(saveDraftButton).toHaveStyle(`background-color:${primaryButtonBg}`);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveStyle(`background-color:${notPrimaryButtonBg}`);
  });

  it('shows only Cancel and Save buttons when research output is manuscript output and the research output has already been published', async () => {
    await setupForm({
      isImportedFromManuscript: true,
      canPublishResearchOutput: true,
      published: true,
      flowId: 'team-edit-published',
    });

    expect(
      screen.queryByRole('button', { name: /Publish/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Save Draft/i }),
    ).not.toBeInTheDocument();

    const saveButton = screen.getByRole('button', { name: /Save/i });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveStyle(`background-color:${primaryButtonBg}`);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveStyle(`background-color:${notPrimaryButtonBg}`);
  });

  it('shows only Cancel and Publish buttons when research output is manuscript output and the research output has not been published', async () => {
    await setupForm({
      isImportedFromManuscript: true,
      canPublishResearchOutput: true,
      published: false,
      flowId: 'team-create-imported-from-manuscript',
    });

    expect(
      screen.queryByRole('button', { name: /Save/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Save Draft/i }),
    ).not.toBeInTheDocument();

    const saveButton = screen.getByRole('button', { name: /Publish/i });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveStyle(`background-color:${primaryButtonBg}`);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveStyle(`background-color:${notPrimaryButtonBg}`);
  });

  it('shows only Cancel and Save Draft buttons when user has editing permission and the research output has not been published yet', async () => {
    await setupForm({
      canEditResearchOutput: true,
      canPublishResearchOutput: false,
      published: false,
    });

    expect(
      screen.queryByRole('button', { name: /Publish/i }),
    ).not.toBeInTheDocument();

    const saveDraftButton = screen.getByRole('button', { name: /Save Draft/i });
    expect(saveDraftButton).toBeInTheDocument();
    expect(saveDraftButton).toHaveStyle(`background-color:${primaryButtonBg}`);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveStyle(`background-color:${notPrimaryButtonBg}`);
  });

  it('disables CRN Only option when importing from manuscript', async () => {
    await setupForm({
      isImportedFromManuscript: true,
    });

    expect(screen.getByRole('radio', { name: /CRN Only/i })).toBeDisabled();
    expect(screen.getByRole('radio', { name: /Public/i })).toBeEnabled();
  });

  it('pre-selects DOI on identifier type when importing from manuscript', async () => {
    await setupForm({ isImportedFromManuscript: true });

    const identifierType = await screen.findByDisplayValue('DOI');
    expect(identifierType).toHaveValue('DOI');
  });

  it('shows placeholder text when not importing from manuscript', async () => {
    await setupForm({ isImportedFromManuscript: false });

    expect(await screen.findByText('Choose an identifier')).toBeInTheDocument();
  });
});
