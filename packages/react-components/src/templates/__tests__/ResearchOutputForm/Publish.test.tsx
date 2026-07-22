import userEvent from '@testing-library/user-event';

import { ResearchOutputResponse } from '@asap-hub/model';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import {
  initialResearchOutputData,
  renderPrefilledForm,
} from '../../test-utils/research-output-form';
import { mockActErrorsInConsole } from '../../../test-utils';
import { ENTER_KEYCODE } from '../../../atoms/Dropdown';
import { editorRef } from '../../../atoms';

describe('ResearchOutputForm Published Flows', () => {
  const id = '42';
  const saveFn = jest.fn();
  const getLabSuggestions = jest.fn();
  let consoleMock: ReturnType<typeof mockActErrorsInConsole>;

  beforeEach(() => {
    saveFn.mockResolvedValue({ id } as ResearchOutputResponse);
    getLabSuggestions.mockResolvedValue([{ label: 'One Lab', value: '1' }]);

    consoleMock = mockActErrorsInConsole();
  });

  afterEach(() => {
    consoleMock.mockRestore();
    jest.resetAllMocks();
  });

  it('can submit a form with minimum data', async () => {
    renderPrefilledForm({
      onSave: saveFn,
      flowId: 'team-create-manual',
      researchOutputData: undefined,
      published: false,
      getLabSuggestions,
    });

    fireEvent.change(screen.getByLabelText(/url/i), {
      target: { value: initialResearchOutputData.link },
    });
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: initialResearchOutputData.title },
    });

    await waitFor(() => expect(editorRef.current).not.toBeNull());

    editorRef.current?.focus();

    const descriptionEditor = screen.getByTestId('editor');
    await userEvent.click(descriptionEditor);
    await userEvent.tab();
    fireEvent.input(descriptionEditor, {
      data: initialResearchOutputData.descriptionMD,
    });
    await userEvent.tab();

    const shortDescription = screen.getByRole('textbox', {
      name: /short description/i,
    });
    await userEvent.clear(shortDescription);
    await userEvent.type(
      shortDescription,
      initialResearchOutputData.shortDescription,
    );
    await userEvent.tab();

    const typeDropdown = screen.getByRole('combobox', {
      name: /Select the type/i,
    });
    fireEvent.change(typeDropdown, {
      target: { value: initialResearchOutputData.type },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });

    const identifier = screen.getByRole('combobox', {
      name: /identifier/i,
    });
    fireEvent.change(identifier, {
      target: { value: 'DOI' },
    });
    fireEvent.keyDown(identifier, {
      keyCode: ENTER_KEYCODE,
    });
    fireEvent.change(screen.getByPlaceholderText('e.g. 10.5555/YFRU1371'), {
      target: { value: '10.1234' },
    });

    await userEvent.click(
      await screen.findByRole('combobox', { name: /Labs/i }),
    );
    await userEvent.click(await screen.findByText('One Lab'));

    const button = screen.getByRole('button', { name: /Publish/i });
    await userEvent.click(button);

    await userEvent.click(
      screen.getByRole('button', { name: /Publish Output/i }),
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Publish' })).toBeEnabled();
    });

    expect(saveFn).toHaveBeenLastCalledWith(
      expect.objectContaining({
        title: initialResearchOutputData.title,
        link: initialResearchOutputData.link,
      }),
    );
  }, 60000);

  it('can update a published form with minimum data', async () => {
    renderPrefilledForm({
      onSave: saveFn,
      flowId: 'team-edit-published',
      researchOutputData: initialResearchOutputData,
      published: true,
    });

    const button = screen.getByRole('button', { name: /Save/i });
    await userEvent.click(button);

    expect(saveFn).toHaveBeenLastCalledWith(
      expect.objectContaining({
        published: true,
      }),
    );
  });
});
