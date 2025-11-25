import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import {
  createResearchOutputResponse,
  researchTagEnvironmentResponse,
} from '@asap-hub/fixtures';
import { researchOutputDocumentTypeToType } from '@asap-hub/model';
import { fireEvent } from '@testing-library/dom';
import { render, screen, waitFor } from '@testing-library/react';
import { ENTER_KEYCODE } from '../../../atoms/Dropdown';
import ResearchOutputForm from '../../ResearchOutputForm';
import {
  defaultProps,
  expectedRequest,
} from '../../test-utils/research-output-form';
import { editorRef } from '../../../atoms';

jest.setTimeout(60000);

describe('on submit 3', () => {
  const id = '42';
  const saveDraftFn = jest.fn();
  const saveFn = jest.fn();
  const getLabSuggestions = jest.fn();
  const getAuthorSuggestions = jest.fn();
  const getRelatedResearchSuggestions = jest.fn();
  const getShortDescriptionFromDescription = jest.fn();

  beforeEach(() => {
    saveDraftFn.mockResolvedValue({ ...createResearchOutputResponse(), id });
    saveFn.mockResolvedValue({ ...createResearchOutputResponse(), id });
    getLabSuggestions.mockResolvedValue([]);
    getAuthorSuggestions.mockResolvedValue([]);
    getRelatedResearchSuggestions.mockResolvedValue([]);
    getShortDescriptionFromDescription.mockReturnValue('short description');

    // TODO: fix act error
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const submitForm = async () => {
    const button = screen.getByRole('button', { name: /Publish/i });
    await userEvent.click(button);
    await userEvent.click(
      screen.getByRole('button', { name: /Publish Output/i }),
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Publish' })).toBeEnabled();
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeEnabled();
    });
  };

  it('can submit an environment', async () => {
    const documentType = 'Protocol';
    const type = 'Model System';
    const researchTags = [researchTagEnvironmentResponse];

    const data = {
      descriptionMD: 'example description',
      shortDescription: 'short description',
      title: 'example title',
      type: 'Preprint',
      link: 'http://example.com',
    };
    const propOverride = {};
    const researchOutputData = undefined;

    // setup
    await render(
      <MemoryRouter>
        <ResearchOutputForm
          {...defaultProps}
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
          getRelatedResearchSuggestions={getRelatedResearchSuggestions}
          getShortDescriptionFromDescription={
            getShortDescriptionFromDescription
          }
          researchTags={researchTags}
          {...propOverride}
        />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/url/i), {
      target: { value: data.link },
    });
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: data.title },
    });

    await waitFor(() => expect(editorRef.current).not.toBeNull());
    editorRef.current?.focus();

    const descriptionEditor = screen.getByTestId('editor');
    await userEvent.click(descriptionEditor);
    await userEvent.tab();
    fireEvent.input(descriptionEditor, { data: data.descriptionMD });
    await userEvent.tab();

    fireEvent.change(
      screen.getByRole('textbox', { name: /short description/i }),
      {
        target: { value: data.shortDescription },
      },
    );

    const identifier = screen.getByRole('textbox', { name: /identifier/i });
    fireEvent.change(identifier, {
      target: { value: 'DOI' },
    });
    fireEvent.keyDown(identifier, {
      keyCode: ENTER_KEYCODE,
    });
    fireEvent.change(screen.getByPlaceholderText('e.g. 10.5555/YFRU1371'), {
      target: { value: '10.1234' },
    });

    // test
    const typeDropdown = screen.getByRole('textbox', {
      name: /Select the type/i,
    });
    fireEvent.change(typeDropdown, {
      target: { value: type },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });

    await userEvent.click(
      await screen.findByRole('textbox', { name: /environments/i }),
    );
    await userEvent.click(screen.getByText('In Vitro'));
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
      documentType,
      type,
      environments: ['In Vitro'],
    });
  });
});
