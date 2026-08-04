import {
  researchTagEnvironmentResponse,
  researchTagMethodResponse,
  researchTagOrganismResponse,
} from '@asap-hub/fixtures';
import {
  researchOutputDocumentTypeToType,
  ResearchOutputResponse,
  ResearchOutputType,
} from '@asap-hub/model';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ENTER_KEYCODE } from '../../../atoms/Dropdown';
import { mockActErrorsInConsole } from '../../../test-utils';
import {
  defaultAvailableActions,
  initialResearchOutputData,
  renderForm,
  renderPrefilledForm,
  submitForm,
} from '../../test-utils/research-output-form';

describe('ResearchOutputForm extra information', () => {
  const saveFn = jest.fn();
  let consoleMock: ReturnType<typeof mockActErrorsInConsole>;

  beforeEach(() => {
    saveFn.mockResolvedValue({ id: '42' } as ResearchOutputResponse);
    consoleMock = mockActErrorsInConsole();
  });

  afterEach(() => {
    consoleMock.mockRestore();
    jest.resetAllMocks();
  });

  const selectType = (value: ResearchOutputType) => {
    const typeDropdown = screen.getByRole('combobox', {
      name: /Select the type/i,
    });
    fireEvent.change(typeDropdown, { target: { value } });
    fireEvent.keyDown(typeDropdown, { keyCode: ENTER_KEYCODE });
  };

  describe('research tag fields', () => {
    const researchTagFields = [
      {
        field: 'methods',
        name: /methods/i,
        researchTag: researchTagMethodResponse,
        tag: 'ELISA',
        documentType: 'Dataset',
        type: 'Spectroscopy',
        otherType: 'Protein Data',
      },
      {
        field: 'organisms',
        name: /organisms/i,
        researchTag: researchTagOrganismResponse,
        tag: 'Rat',
        documentType: 'Protocol',
        type: 'Model System',
        otherType: 'Microscopy & Imaging',
      },
      {
        field: 'environments',
        name: /environments/i,
        researchTag: researchTagEnvironmentResponse,
        tag: 'In Vitro',
        documentType: 'Protocol',
        type: 'Model System',
        otherType: 'Microscopy & Imaging',
      },
    ] as const;

    const renderFormWithResearchTag = ({
      documentType,
      type,
      researchTag,
    }: (typeof researchTagFields)[number]) =>
      renderPrefilledForm({
        onSave: saveFn,
        documentType,
        typeOptions: Array.from(researchOutputDocumentTypeToType[documentType]),
        researchOutputData: {
          ...initialResearchOutputData,
          documentType,
          type,
        },
        researchTags: [researchTag],
      });

    const selectResearchTag = async ({
      name,
      tag,
    }: (typeof researchTagFields)[number]) => {
      await userEvent.click(await screen.findByRole('combobox', { name }));
      await userEvent.click(screen.getByText(tag));
    };

    it.each(researchTagFields)('submits $field', async (testCase) => {
      renderFormWithResearchTag(testCase);
      await selectResearchTag(testCase);

      await submitForm();

      expect(saveFn).toHaveBeenLastCalledWith(
        expect.objectContaining({
          documentType: testCase.documentType,
          type: testCase.type,
          [testCase.field]: [testCase.tag],
        }),
      );
    });

    it.each(researchTagFields)(
      'resets $field when the type changes',
      async (testCase) => {
        renderFormWithResearchTag(testCase);
        await selectResearchTag(testCase);
        expect(screen.getByText(testCase.tag)).toBeInTheDocument();

        selectType(testCase.otherType);

        await waitFor(() =>
          expect(screen.queryByText(testCase.tag)).not.toBeInTheDocument(),
        );
        expect(
          screen.getByRole('combobox', { name: testCase.name }),
        ).toBeInTheDocument();
      },
    );
  });

  it('submits the usage notes', async () => {
    renderPrefilledForm({ onSave: saveFn });

    fireEvent.change(screen.getByRole('textbox', { name: /usage notes/i }), {
      target: { value: 'Access Instructions' },
    });

    await submitForm();

    expect(saveFn).toHaveBeenLastCalledWith(
      expect.objectContaining({ usageNotes: 'Access Instructions' }),
    );
  });

  it('pre populates the usage notes with the markdown value when it is defined', () => {
    renderPrefilledForm({
      researchOutputData: {
        ...initialResearchOutputData,
        usageNotes: 'rich text',
        usageNotesMD: 'markdown',
      },
    });

    expect(screen.queryByText('rich text')).not.toBeInTheDocument();
    expect(screen.getByText('markdown')).toBeVisible();
  });

  it('submits the catalog number when showCatalogNumber is true', async () => {
    const documentType = 'Lab Material';
    const type = 'Animal Model';
    renderPrefilledForm({
      onSave: saveFn,
      documentType,
      typeOptions: Array.from(researchOutputDocumentTypeToType[documentType]),
      researchOutputData: { ...initialResearchOutputData, documentType, type },
      availableActions: { ...defaultAvailableActions, showCatalogNumber: true },
    });

    fireEvent.change(screen.getByRole('textbox', { name: /Catalog Number/i }), {
      target: { value: 'abc123' },
    });

    await submitForm();

    expect(saveFn).toHaveBeenLastCalledWith(
      expect.objectContaining({
        documentType,
        type,
        labCatalogNumber: 'abc123',
      }),
    );
  });

  it('displays the keyword suggestions', async () => {
    renderForm({ tagSuggestions: ['2D Cultures', 'Adenosine', 'Adrenal'] });

    await userEvent.click(
      screen.getByText(/Start typing\.\.\. \(E\.g\. Cell Biology\)/i),
    );

    expect(screen.getByText('2D Cultures')).toBeVisible();
    expect(screen.getByText('Adenosine')).toBeVisible();
    expect(screen.getByText('Adrenal')).toBeVisible();
  });
});
