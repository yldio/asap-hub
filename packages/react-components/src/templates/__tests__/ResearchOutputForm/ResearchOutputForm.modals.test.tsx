import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router';
import {
  InnerToastContext,
  ResearchOutputAvailableActions,
} from '@asap-hub/react-context';

import { createResearchOutputResponse } from '@asap-hub/fixtures';
import {
  researchOutputDocumentTypeToType,
  ResearchOutputResponse,
  ResearchTagResponse,
} from '@asap-hub/model';
import { render, screen, waitFor } from '@testing-library/react';
import ResearchOutputForm from '../../ResearchOutputForm';
import { getDefaultProps } from '../../test-utils/research-output-form';
import { mockActErrorsInConsole } from '../../../test-utils';

jest.setTimeout(60000);

let consoleMock: ReturnType<typeof mockActErrorsInConsole>;

describe('ResearchOutputForm confirmation modals', () => {
  const id = '42';
  const saveFn = jest.fn();
  const saveDraftFn = jest.fn();
  const getLabSuggestions = jest.fn();
  const getAuthorSuggestions = jest.fn();

  beforeEach(() => {
    saveFn.mockResolvedValue({ id } as ResearchOutputResponse);
    saveDraftFn.mockResolvedValue({ id } as ResearchOutputResponse);
    getLabSuggestions.mockResolvedValue([]);
    getAuthorSuggestions.mockResolvedValue([]);

    consoleMock = mockActErrorsInConsole();
  });

  afterEach(() => {
    consoleMock.mockRestore();
    jest.resetAllMocks();
  });

  const setupForm = async ({
    canEditResearchOutput = true,
    canPublishResearchOutput = true,
    canShareResearchOutput = true,
    published = false,
    documentType = 'Article',
    researchTags = [{ id: '1', name: 'research tag 1' }],
    researchOutputData = undefined,
    versionAction = undefined,
    isImportedFromManuscript = false,
    availableActions = { canSaveDraft: true },
    flowId = 'team-create-manual',
  }: {
    canEditResearchOutput?: boolean;
    canPublishResearchOutput?: boolean;
    canShareResearchOutput?: boolean;
    published?: boolean;
    documentType?: ComponentProps<typeof ResearchOutputForm>['documentType'];
    versionAction?: ComponentProps<typeof ResearchOutputForm>['versionAction'];
    researchTags?: ResearchTagResponse[];
    researchOutputData?: ComponentProps<
      typeof ResearchOutputForm
    >['researchOutputData'];
    isImportedFromManuscript?: ComponentProps<
      typeof ResearchOutputForm
    >['isImportedFromManuscript'];
    availableActions?: ResearchOutputAvailableActions;
    flowId?: ComponentProps<typeof ResearchOutputForm>['flowId'];
  } = {}) => {
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
            onSaveDraft={saveDraftFn}
            getLabSuggestions={getLabSuggestions}
            getAuthorSuggestions={getAuthorSuggestions}
            researchTags={researchTags}
            published={published}
            isImportedFromManuscript={isImportedFromManuscript}
            availableActions={availableActions}
            flowId={flowId}
            permissions={{
              canEditResearchOutput,
              canPublishResearchOutput,
              canShareResearchOutput,
            }}
          />
        </MemoryRouter>
      </InnerToastContext.Provider>,
    );
  };

  describe('same description confirmation', () => {
    it('shows the save variant when saving a draft of a duplicate with an unchanged description', async () => {
      await setupForm({
        flowId: 'team-duplicate',
        researchOutputData: createResearchOutputResponse(),
      });
      await userEvent.click(
        screen.getByRole('button', { name: /Save Draft/i }),
      );
      expect(screen.getByText(/Keep the same description/i)).toBeVisible();
      expect(
        screen.getByRole('button', { name: /Keep and save/i }),
      ).toBeVisible();
    });

    it('shows the publish variant when publishing a duplicate with an unchanged description', async () => {
      await setupForm({
        flowId: 'team-duplicate',
        researchOutputData: createResearchOutputResponse(),
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(screen.getByText(/Keep the same description/i)).toBeVisible();
      expect(
        screen.getByRole('button', { name: /Keep and publish/i }),
      ).toBeVisible();
    });

    it('does not show on a flow that does not require the confirmation', async () => {
      await setupForm({
        flowId: 'team-edit-published',
        availableActions: { canSaveDraft: false },
        researchOutputData: createResearchOutputResponse(),
        published: true,
      });
      await userEvent.click(screen.getByRole('button', { name: /Save/i }));
      expect(screen.queryByText(/Keep the same description/i)).toBeNull();
    });

    it('does not show on a create flow even with an unchanged description', async () => {
      await setupForm({
        flowId: 'team-create-manual',
        availableActions: { canSaveDraft: false },
        researchOutputData: createResearchOutputResponse(),
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(screen.queryByText(/Keep the same description/i)).toBeNull();
      expect(
        screen.getByText(/Publish output for the whole hub?/i),
      ).toBeVisible();
    });

    it('is cancelable', async () => {
      await setupForm({
        flowId: 'team-duplicate',
        researchOutputData: createResearchOutputResponse(),
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(screen.getByText(/Keep the same description/i)).toBeVisible();
      await userEvent.click(
        screen.getAllByRole('button', { name: /Cancel/i })[0]!,
      );
      expect(screen.queryByText(/Keep the same description/i)).toBeNull();
      expect(saveFn).not.toHaveBeenCalled();
    });

    it('is dismissed if there are errors on the form', async () => {
      await setupForm({
        flowId: 'team-duplicate',
        researchOutputData: {
          ...createResearchOutputResponse(),
          link: '',
        },
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(screen.getByText(/Keep the same description/i)).toBeVisible();
      await userEvent.click(
        screen.getByRole('button', { name: /Keep and publish/i }),
      );
      await waitFor(() => {
        expect(screen.queryByText(/Keep the same description/i)).toBeNull();
        expect(screen.getByText(/Please enter a valid URL/i)).toBeVisible();
      });
    });

    it('will not reappear once dismissed', async () => {
      await setupForm({
        flowId: 'team-duplicate',
        researchOutputData: {
          ...createResearchOutputResponse(),
          link: '',
        },
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(screen.getByText(/Keep the same description/i)).toBeVisible();
      await userEvent.click(
        screen.getByRole('button', { name: /Keep and publish/i }),
      );
      await waitFor(() => {
        expect(screen.queryByText(/Keep the same description/i)).toBeNull();
        expect(screen.getByText(/Please enter a valid URL/i)).toBeVisible();
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(screen.queryByText(/Keep the same description/i)).toBeNull();
    });

    it('routes the keep and save action through the draft save and never the publish save', async () => {
      await setupForm({
        flowId: 'team-duplicate',
        researchOutputData: {
          ...createResearchOutputResponse(),
          link: '',
        },
      });
      await userEvent.click(
        screen.getByRole('button', { name: /Save Draft/i }),
      );
      await userEvent.click(
        screen.getByRole('button', { name: /Keep and save/i }),
      );
      await waitFor(() => {
        expect(screen.queryByText(/Keep the same description/i)).toBeNull();
        expect(screen.getByText(/Please enter a valid URL/i)).toBeVisible();
      });
      expect(saveFn).not.toHaveBeenCalled();
    });
  });

  describe('new version confirmation', () => {
    it('shows on an add-version flow regardless of versionAction', async () => {
      await setupForm({
        flowId: 'team-add-version',
        availableActions: { canSaveDraft: false },
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.getByText(/Publish new version for the whole hub?/i),
      ).toBeVisible();
      expect(
        screen.getByRole('button', { name: /Publish new version/i }),
      ).toBeVisible();
    });

    it('does not show on a create flow even when versionAction is set', async () => {
      await setupForm({
        flowId: 'team-create-manual',
        availableActions: { canSaveDraft: false },
        versionAction: 'create',
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.queryByText(/Publish new version for the whole hub?/i),
      ).toBeNull();
      expect(
        screen.getByText(/Publish output for the whole hub?/i),
      ).toBeVisible();
    });

    it('is cancelable', async () => {
      await setupForm({
        flowId: 'team-add-version',
        availableActions: { canSaveDraft: false },
        researchOutputData: createResearchOutputResponse(),
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.getByText(/Publish new version for the whole hub?/i),
      ).toBeVisible();
      await userEvent.click(
        screen.getAllByRole('button', { name: /Cancel/i })[0]!,
      );
      expect(
        screen.queryByText(/Publish new version for the whole hub?/i),
      ).toBeNull();
      expect(saveFn).not.toHaveBeenCalled();
    });

    it('is dismissed if there are errors on the form', async () => {
      await setupForm({
        flowId: 'team-add-version',
        availableActions: { canSaveDraft: false },
        researchOutputData: {
          ...createResearchOutputResponse(),
          link: '',
        },
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.getByText(/Publish new version for the whole hub?/i),
      ).toBeVisible();
      await userEvent.click(
        screen.getByRole('button', { name: /Publish new version/i }),
      );
      await waitFor(() => {
        expect(
          screen.queryByText(/Publish new version for the whole hub?/i),
        ).toBeNull();
        expect(screen.getByText(/Please enter a valid URL/i)).toBeVisible();
      });
    });

    it('will not reappear once dismissed', async () => {
      await setupForm({
        flowId: 'team-add-version',
        availableActions: { canSaveDraft: false },
        researchOutputData: {
          ...createResearchOutputResponse(),
          link: '',
        },
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.getByText(/Publish new version for the whole hub?/i),
      ).toBeVisible();
      await userEvent.click(
        screen.getByRole('button', { name: /Publish new version/i }),
      );
      await waitFor(() => {
        expect(
          screen.queryByText(/Publish new version for the whole hub?/i),
        ).toBeNull();
        expect(screen.getByText(/Please enter a valid URL/i)).toBeVisible();
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.queryByText(/Publish new version for the whole hub?/i),
      ).toBeNull();
    });
  });

  describe('publish confirmation', () => {
    it('shows on a create flow that has not been published yet', async () => {
      await setupForm({ flowId: 'team-create-manual', published: false });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.getByText(/Publish output for the whole hub?/i),
      ).toBeVisible();
      expect(
        screen.getByRole('button', { name: /Publish Output/i }),
      ).toBeVisible();
    });

    it('is cancelable', async () => {
      await setupForm({ flowId: 'team-create-manual', published: false });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.getByText(/Publish output for the whole hub?/i),
      ).toBeVisible();
      await userEvent.click(
        screen.getAllByRole('button', { name: /Cancel/i })[0]!,
      );
      expect(
        screen.queryByText(/Publish output for the whole hub?/i),
      ).toBeNull();
      expect(saveFn).not.toHaveBeenCalled();
    });

    it('does not show on an edit-published flow', async () => {
      await setupForm({
        flowId: 'team-edit-published',
        availableActions: { canSaveDraft: false },
        published: true,
        researchOutputData: createResearchOutputResponse(),
      });
      await userEvent.click(screen.getByRole('button', { name: /Save/i }));
      expect(
        screen.queryByText(/Publish output for the whole hub?/i),
      ).toBeNull();
    });
  });

  describe('working group flows', () => {
    it('shows the new version confirmation on a working-group add-version flow', async () => {
      await setupForm({
        flowId: 'working-group-add-version',
        availableActions: { canSaveDraft: false },
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.getByText(/Publish new version for the whole hub?/i),
      ).toBeVisible();
    });

    it('shows the publish confirmation on a working-group create flow', async () => {
      await setupForm({
        flowId: 'working-group-create',
        availableActions: { canSaveDraft: false },
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.getByText(/Publish output for the whole hub?/i),
      ).toBeVisible();
    });

    it('shows the same description confirmation on a working-group duplicate flow', async () => {
      await setupForm({
        flowId: 'working-group-duplicate',
        researchOutputData: createResearchOutputResponse(),
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(screen.getByText(/Keep the same description/i)).toBeVisible();
    });
  });
});
