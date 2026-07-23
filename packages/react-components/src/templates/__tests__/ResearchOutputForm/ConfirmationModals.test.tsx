import userEvent from '@testing-library/user-event';

import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { ResearchOutputFlowId, ResearchOutputResponse } from '@asap-hub/model';
import { screen, waitFor } from '@testing-library/react';
import {
  defaultAvailableActions,
  renderPrefilledForm,
} from '../../test-utils/research-output-form';
import { mockActErrorsInConsole } from '../../../test-utils';

describe('ResearchOutputForm confirmation modals', () => {
  const id = '42';
  const saveFn = jest.fn();
  let consoleMock: ReturnType<typeof mockActErrorsInConsole>;

  beforeEach(() => {
    saveFn.mockResolvedValue({ id } as ResearchOutputResponse);

    consoleMock = mockActErrorsInConsole();
  });

  afterEach(() => {
    consoleMock.mockRestore();
    jest.resetAllMocks();
  });

  const renderFormWithSave = (
    propOverride: Parameters<typeof renderPrefilledForm>[0] = {},
  ) =>
    renderPrefilledForm({
      onSave: saveFn,
      ...propOverride,
    });

  describe('general modal behavior', () => {
    it('is cancelable', async () => {
      renderFormWithSave({
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
      renderFormWithSave({
        flowId: 'team-add-version',
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
  });

  describe('same description confirmation', () => {
    it.each(['team-duplicate', 'working-group-duplicate'])(
      'shows the save variant when saving a draft of a duplicate with an unchanged description and the flow is %s',
      async (flowId) => {
        renderFormWithSave({
          flowId: flowId as ResearchOutputFlowId,
          researchOutputData: createResearchOutputResponse(),
        });
        await userEvent.click(
          screen.getByRole('button', { name: /Save Draft/i }),
        );
        expect(screen.getByText(/Keep the same description/i)).toBeVisible();
        expect(
          screen.getByRole('button', { name: /Keep and save/i }),
        ).toBeVisible();
      },
    );

    it.each(['team-duplicate', 'working-group-duplicate'])(
      'shows the publish variant when publishing a duplicate with an unchanged description and the flow is %s',
      async (flowId) => {
        renderFormWithSave({
          flowId: flowId as ResearchOutputFlowId,
          researchOutputData: createResearchOutputResponse(),
        });
        await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
        expect(screen.getByText(/Keep the same description/i)).toBeVisible();
        expect(
          screen.getByRole('button', { name: /Keep and publish/i }),
        ).toBeVisible();
      },
    );

    it('does not show on a flow that does not require the confirmation', async () => {
      renderFormWithSave({
        flowId: 'team-edit-published',
        availableActions: { ...defaultAvailableActions, canSaveDraft: false },
        researchOutputData: createResearchOutputResponse(),
        published: true,
      });
      await userEvent.click(screen.getByRole('button', { name: /Save/i }));
      expect(screen.queryByText(/Keep the same description/i)).toBeNull();
    });

    it('does not show on a create flow even with an unchanged description', async () => {
      renderFormWithSave({
        flowId: 'team-create-manual',
        researchOutputData: createResearchOutputResponse(),
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(screen.queryByText(/Keep the same description/i)).toBeNull();
      expect(
        screen.getByText(/Publish output for the whole hub?/i),
      ).toBeVisible();
    });

    it('will not reappear once dismissed', async () => {
      renderFormWithSave({
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
  });

  describe('new version confirmation', () => {
    it.each([
      'team-add-version',
      'working-group-add-version',
      'team-add-version-from-manuscript',
    ])('shows on %s flow regardless of versionAction', async (flowId) => {
      renderFormWithSave({
        flowId: flowId as ResearchOutputFlowId,
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
      renderFormWithSave({
        flowId: 'team-create-manual',
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

    it('will not reappear once dismissed', async () => {
      renderFormWithSave({
        flowId: 'team-add-version',
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
      renderFormWithSave({
        flowId: 'team-create-manual',
        published: false,
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.getByText(/Publish output for the whole hub?/i),
      ).toBeVisible();
      expect(
        screen.getByRole('button', { name: /Publish Output/i }),
      ).toBeVisible();
    });

    it('does not show on an edit-published flow', async () => {
      renderFormWithSave({
        flowId: 'team-edit-published',
        availableActions: { ...defaultAvailableActions, canSaveDraft: false },
        published: true,
        researchOutputData: createResearchOutputResponse(),
      });
      await userEvent.click(screen.getByRole('button', { name: /Save/i }));
      expect(
        screen.queryByText(/Publish output for the whole hub?/i),
      ).toBeNull();
    });
  });
});
