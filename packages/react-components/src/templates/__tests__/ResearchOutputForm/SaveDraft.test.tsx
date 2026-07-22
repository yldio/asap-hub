import userEvent from '@testing-library/user-event';

import { ResearchOutputResponse } from '@asap-hub/model';
import { screen } from '@testing-library/react';
import {
  initialResearchOutputData,
  renderPrefilledForm,
} from '../../test-utils/research-output-form';
import { mockActErrorsInConsole } from '../../../test-utils';

jest.setTimeout(60000);

describe('ResearchOutputForm Save Draft', () => {
  const id = '42';
  const saveFn = jest.fn();
  const saveDraftFn = jest.fn();
  let consoleMock: ReturnType<typeof mockActErrorsInConsole>;

  beforeEach(() => {
    saveFn.mockResolvedValue({ id } as ResearchOutputResponse);
    saveDraftFn.mockResolvedValue({ id } as ResearchOutputResponse);

    consoleMock = mockActErrorsInConsole();
  });

  afterEach(() => {
    consoleMock.mockRestore();
    jest.resetAllMocks();
  });

  it('can save draft with minimum data', async () => {
    const researchOutputWithoutId = {
      ...initialResearchOutputData,
      id: undefined,
      published: false,
    } as unknown as ResearchOutputResponse;

    renderPrefilledForm({
      onSave: saveFn,
      onSaveDraft: saveDraftFn,
      flowId: 'team-edit-draft',
      researchOutputData: researchOutputWithoutId,
    });

    const button = screen.getByRole('button', { name: /Save Draft/i });
    await userEvent.click(button);

    expect(saveDraftFn).toHaveBeenLastCalledWith(
      expect.objectContaining({
        published: false,
      }),
    );
    expect(saveFn).not.toHaveBeenCalled();
  });
});
