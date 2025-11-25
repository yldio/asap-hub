import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { Router } from 'react-router-dom';

import { createResearchOutputResponse } from '@asap-hub/fixtures';
import {
  researchOutputDocumentTypeToType,
  ResearchOutputPostRequest,
  ResearchOutputResponse,
  ResearchTagResponse,
} from '@asap-hub/model';
import { fireEvent } from '@testing-library/dom';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, History } from 'history';
import { ENTER_KEYCODE } from '../../../atoms/Dropdown';
import ResearchOutputForm from '../../ResearchOutputForm';
import {
  defaultProps,
  expectedRequest,
} from '../../test-utils/research-output-form';
import { editorRef } from '../../../atoms';

jest.setTimeout(60000);

describe('on submit', () => {
  let history!: History;
  const id = '42';
  const saveDraftFn = jest.fn();
  const saveFn = jest.fn();
  const getLabSuggestions = jest.fn();
  const getAuthorSuggestions = jest.fn();
  const getRelatedResearchSuggestions = jest.fn();
  const getShortDescriptionFromDescription = jest.fn();

  beforeEach(() => {
    history = createMemoryHistory();
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

  type Data = Pick<
    ResearchOutputPostRequest,
    'link' | 'title' | 'descriptionMD' | 'shortDescription' | 'type'
  >;

  const setupForm = async (
    {
      data = {
        descriptionMD: 'example description',
        shortDescription: 'short description',
        title: 'example title',
        type: 'Code',
        link: 'http://example.com',
      },
      propOverride = {},
      documentType = 'Article',
      researchTags = [{ id: '1', name: 'research tag 1' }],
      researchOutputData = undefined,
    }: {
      data?: Data;
      propOverride?: Partial<ComponentProps<typeof ResearchOutputForm>>;
      documentType?: ComponentProps<typeof ResearchOutputForm>['documentType'];
      researchTags?: ResearchTagResponse[];
      researchOutputData?: ResearchOutputResponse;
    } = {
      data: {
        descriptionMD: 'example description',
        shortDescription: 'short description',
        title: 'example title',
        type: 'Code',
        link: 'http://example.com',
      },
      documentType: 'Bioinformatics',
      researchTags: [],
    },
  ) => {
    render(
      <Router history={history}>
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
      </Router>,
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
  };

  const saveDraft = async () => {
    const button = screen.getByRole('button', { name: /Save Draft/i });
    await userEvent.click(button);

    expect(
      await screen.findByRole('button', { name: /Save Draft/i }),
    ).toBeEnabled();
    expect(
      await screen.findByRole('button', { name: /Cancel/i }),
    ).toBeEnabled();
  };

  it('can save draft with minimum data', async () => {
    await setupForm();
    await saveDraft();
    expect(saveDraftFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
      published: false,
    });
    await waitFor(() => {
      expect(history.location.pathname).toEqual(`/shared-research/${id}`);
      expect(history.location.search).toEqual('?draftCreated=true');
    });
  });
});
