import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import {
  createResearchOutputResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import { researchOutputDocumentTypeToType } from '@asap-hub/model';
import { fireEvent } from '@testing-library/dom';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { ENTER_KEYCODE } from '../../../atoms/Dropdown';
import ResearchOutputForm from '../../ResearchOutputForm';
import {
  defaultProps,
  expectedRequest,
} from '../../test-utils/research-output-form';
import { editorRef } from '../../../atoms';
import { mockActErrorsInConsole } from '../../../test-utils';

jest.setTimeout(60000);

let consoleMock: ReturnType<typeof mockActErrorsInConsole>;

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

    consoleMock = mockActErrorsInConsole();
  });

  afterEach(() => {
    consoleMock.mockRestore();
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

  it('field tests', async () => {
    getLabSuggestions.mockResolvedValue([
      { label: 'One Lab', value: '1' },
      { label: 'Two Lab', value: '2' },
    ]);
    getRelatedResearchSuggestions.mockResolvedValue([
      { label: 'First Related Research', value: '1' },
      { label: 'Second Related Research', value: '2' },
    ]);
    getAuthorSuggestions.mockResolvedValue([
      {
        author: { ...createUserResponse(), displayName: 'Chris Blue' },
        label: 'Chris Blue',
        value: 'u2',
      },
      {
        author: {
          id: 'external-chris',
          displayName: 'Chris Reed',
        },
        label: 'Chris Reed (Non CRN)',
        value: 'u1',
      },
    ]);

    const researchOutputData = undefined;
    const data = {
      descriptionMD: 'example description',
      shortDescription: 'short description',
      title: 'example title',
      type: 'Code',
      link: 'http://example.com',
    };
    const propOverride = {};
    const documentType = 'Bioinformatics';
    const researchTags = [{ id: '1', name: 'research tag 1' }];

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

    const typeDropdown = screen.getByRole('textbox', {
      name: /Select the type/i,
    });
    fireEvent.change(typeDropdown, {
      target: { value: data.type },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });

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

    // can submit a lab

    await userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
    await userEvent.click(screen.getByText('One Lab'));

    // related research
    await userEvent.click(
      screen.getByRole('textbox', { name: /Related Outputs/i }),
    );
    await userEvent.click(screen.getByText('First Related Research'));

    // authors
    const authors = screen.getByRole('textbox', { name: /Authors/i });
    await userEvent.click(authors);
    await userEvent.click(screen.getByText(/Chris Reed/i));
    await userEvent.click(authors);
    await userEvent.click(screen.getByText('Chris Blue'));
    await userEvent.click(authors);
    await userEvent.type(authors, 'Alex White');
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByText('Alex White')[1]!);

    // access instructions
    await userEvent.type(
      screen.getByRole('textbox', { name: /usage notes/i }),
      'Access Instructions',
    );

    await submitForm();

    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
      labs: ['1'],
      relatedResearch: ['1'],
      authors: [
        {
          externalAuthorId: 'u1',
        },
        { userId: 'u2' },
        { externalAuthorName: 'Alex White' },
      ],
      usageNotes: 'Access Instructions',
      documentType: 'Bioinformatics',
      type: 'Code',
    });
  });
});
