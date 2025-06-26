import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';

import {
  createResearchOutputResponse,
  researchTagMethodResponse,
} from '@asap-hub/fixtures';
import { researchOutputDocumentTypeToType } from '@asap-hub/model';
import { fireEvent } from '@testing-library/dom';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { ENTER_KEYCODE } from '../../../atoms/Dropdown';
import ResearchOutputForm from '../../ResearchOutputForm';
import {
  defaultProps,
  initialResearchOutputData,
} from '../../test-utils/research-output-form';

jest.setTimeout(60000);

describe('on submit', () => {
  const id = '42';
  const saveDraftFn = jest.fn();
  const saveFn = jest.fn();
  const getLabSuggestions = jest.fn();
  const getAuthorSuggestions = jest.fn();
  const getRelatedResearchSuggestions = jest.fn();
  const getShortDescriptionFromDescription = jest.fn();

  const history = createMemoryHistory();
  saveDraftFn.mockResolvedValue({ ...createResearchOutputResponse(), id });
  saveFn.mockResolvedValue({ ...createResearchOutputResponse(), id });
  getLabSuggestions.mockResolvedValue([]);
  getAuthorSuggestions.mockResolvedValue([]);
  getRelatedResearchSuggestions.mockResolvedValue([]);
  getShortDescriptionFromDescription.mockReturnValue('short description');

  afterEach(() => {
    jest.resetAllMocks();
  });

  const submitForm = async () => {
    const button = screen.getByRole('button', { name: /Publish/i });
    userEvent.click(button);

    userEvent.click(screen.getByRole('button', { name: /Publish Output/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Publish' })).toBeEnabled();
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeEnabled();
    });
  };

  it('can submit a method', async () => {
    const researchTags = [researchTagMethodResponse];
    const documentType = 'Dataset';
    const type = 'Spectroscopy';
    render(
      <Router history={history}>
        <ResearchOutputForm
          {...defaultProps}
          researchOutputData={{
            ...initialResearchOutputData,
            type,
          }}
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
        />
      </Router>,
    );
    userEvent.click(await screen.findByRole('textbox', { name: /methods/i }));
    userEvent.click(screen.getByText('ELISA'));
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith(
      expect.objectContaining({
        documentType,
        type,
        methods: ['ELISA'],
      }),
    );
  });

  it('resetting the type resets methods', async () => {
    const type = 'Spectroscopy';
    const researchTags = [researchTagMethodResponse];
    const documentType = 'Dataset';
    render(
      <Router history={history}>
        <ResearchOutputForm
          {...defaultProps}
          researchOutputData={{
            ...initialResearchOutputData,
            type,
          }}
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
        />
      </Router>,
    );

    const typeDropdown = screen.getByRole('textbox', {
      name: /Select the type/i,
    });
    fireEvent.change(typeDropdown, {
      target: { value: type },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });

    const methods = await screen.findByRole('textbox', { name: /methods/i });
    userEvent.click(methods);
    userEvent.click(screen.getByText('ELISA'));

    expect(screen.getByText(/ELISA/i)).toBeInTheDocument();

    fireEvent.change(typeDropdown, {
      target: { value: 'Protein Data' },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });

    await waitFor(() =>
      expect(screen.queryByText(/ELISA/i)).not.toBeInTheDocument(),
    );
    expect(methods).toBeInTheDocument();
  });
});
