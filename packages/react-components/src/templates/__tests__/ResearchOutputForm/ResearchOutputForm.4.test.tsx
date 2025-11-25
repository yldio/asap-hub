import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import {
  createResearchOutputResponse,
  researchTagSubtypeResponse,
} from '@asap-hub/fixtures';
import { researchOutputDocumentTypeToType } from '@asap-hub/model';
import { fireEvent } from '@testing-library/dom';
import { render, screen, waitFor, within } from '@testing-library/react';
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

  it('resetting the type resets subtype', async () => {
    const documentType = 'Protocol';
    const type = 'Model System';
    const subtypeValue = 'Metabolite';
    const researchTags = [researchTagSubtypeResponse];

    render(
      <MemoryRouter>
        <ResearchOutputForm
          {...defaultProps}
          researchOutputData={{
            ...initialResearchOutputData,
            documentType,
            type,
            subtype: subtypeValue,
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
      </MemoryRouter>,
    );

    expect(screen.getByText(/metabolite/i)).toBeInTheDocument();

    const typeDropdown = screen.getByRole('textbox', {
      name: /Select the type/i,
    });

    fireEvent.change(typeDropdown, {
      target: { value: 'Microscopy' },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });
    await waitFor(() =>
      expect(screen.queryByText(/metabolite/i)).not.toBeInTheDocument(),
    );
    const subtype = screen.getByRole('textbox', {
      name: /subtype/i,
    });
    expect(subtype).toBeInTheDocument();
  });

  it('can submit published date', async () => {
    const { documentType } = initialResearchOutputData;
    render(
      <MemoryRouter>
        <ResearchOutputForm
          {...defaultProps}
          researchOutputData={initialResearchOutputData}
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
          researchTags={[]}
        />
      </MemoryRouter>,
    );

    const sharingStatus = screen.getByRole('group', {
      name: /sharing status/i,
    });
    await userEvent.click(
      within(sharingStatus).getByRole('radio', { name: 'Public' }),
    );
    fireEvent.change(screen.getByLabelText(/date published/i), {
      target: { value: '2022-03-24' },
    });
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith(
      expect.objectContaining({
        sharingStatus: 'Public',
        publishDate: new Date('2022-03-24').toISOString(),
      }),
    );
  });

  it('can submit labCatalogNumber for lab material', async () => {
    const documentType = 'Lab Material' as const;
    const type = 'Animal Model';
    render(
      <MemoryRouter>
        <ResearchOutputForm
          {...defaultProps}
          researchOutputData={{
            ...initialResearchOutputData,
            type,
            documentType,
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
          researchTags={[]}
        />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByRole('textbox', { name: /Catalog Number/i }), {
      target: { value: 'abc123' },
    });
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: 'Animal Model',
        documentType: 'Lab Material',
        labCatalogNumber: 'abc123',
      }),
    );
  });
});
