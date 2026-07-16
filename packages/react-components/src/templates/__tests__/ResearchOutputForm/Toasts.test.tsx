import userEvent from '@testing-library/user-event';

import { ResearchOutputResponse } from '@asap-hub/model';
import { screen, waitFor } from '@testing-library/react';
import {
  capturedLocation,
  initialResearchOutputData,
  renderPrefilledForm,
} from '../../test-utils/research-output-form';
import { mockActErrorsInConsole } from '../../../test-utils';

describe('ResearchOutputForm toasts', () => {
  const id = '42';
  const saveFn = jest.fn();
  const saveDraftFn = jest.fn();
  let consoleMock: ReturnType<typeof mockActErrorsInConsole>;

  beforeEach(() => {
    capturedLocation.current = null;
    saveFn.mockResolvedValue({ id } as ResearchOutputResponse);
    saveDraftFn.mockResolvedValue({ id } as ResearchOutputResponse);

    consoleMock = mockActErrorsInConsole();
  });

  afterEach(() => {
    consoleMock.mockRestore();
    jest.resetAllMocks();
  });

  const researchOutputWithoutId = {
    ...initialResearchOutputData,
    id: undefined,
    published: false,
  } as unknown as ResearchOutputResponse;

  it('navigates with draftCreated toast when saving a new draft', async () => {
    renderPrefilledForm({
      onSave: saveFn,
      onSaveDraft: saveDraftFn,
      researchOutputData: researchOutputWithoutId,
      published: false,
      flowId: 'team-create-manual',
    });

    await userEvent.click(screen.getByRole('button', { name: /Save Draft/i }));

    await waitFor(() => {
      expect(capturedLocation.current).not.toBeNull();
      expect(capturedLocation.current?.pathname).toEqual(
        `/shared-research/${id}`,
      );
      expect(capturedLocation.current?.search).toEqual('');
      expect(capturedLocation.current?.state).toEqual({
        toast: 'draftCreated',
      });
    });
  });

  it('navigates with published toast when publishing', async () => {
    renderPrefilledForm({
      onSave: saveFn,
      onSaveDraft: saveDraftFn,
      researchOutputData: {
        ...initialResearchOutputData,
        published: false,
      },
      published: false,
      flowId: 'team-create-manual',
    });

    await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
    await userEvent.click(
      screen.getByRole('button', { name: /Publish Output/i }),
    );

    await waitFor(() => {
      expect(capturedLocation.current).not.toBeNull();
      expect(capturedLocation.current?.pathname).toEqual(
        `/shared-research/${id}`,
      );
      expect(capturedLocation.current?.state).toEqual({ toast: 'published' });
    });
  });
});
