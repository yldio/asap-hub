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
import ResearchOutputForm from '../ResearchOutputForm';
import { ENTER_KEYCODE } from '../../atoms/Dropdown';

const defaultProps: ComponentProps<typeof ResearchOutputForm> = {
  onSave: jest.fn(() => Promise.resolve()),
  onSaveDraft: jest.fn(() => Promise.resolve()),
  published: false,
  tagSuggestions: [],
  researchTags: [],
  documentType: 'Article',
  selectedTeams: [],
  typeOptions: Array.from(researchOutputDocumentTypeToType.Article.values()),
  permissions: {
    canEditResearchOutput: true,
    canPublishResearchOutput: true,
    canShareResearchOutput: true,
  },
  getRelatedResearchSuggestions: jest.fn(),
  getRelatedEventSuggestions: jest.fn(),
  getShortDescriptionFromDescription: jest.fn(),
};

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

  const expectedRequest: ResearchOutputPostRequest = {
    documentType: 'Article',
    doi: '10.1234',
    link: 'http://example.com',
    title: 'example title',
    description: '',
    descriptionMD: 'example description',
    shortDescription: 'short description',
    type: 'Preprint',
    labs: [],
    authors: [],
    teams: ['TEAMID'],
    sharingStatus: 'Network Only',
    methods: [],
    organisms: [],
    environments: [],
    usageNotes: '',
    workingGroups: [],
    relatedResearch: [],
    keywords: [],
    published: false,
    relatedEvents: [],
  };
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
        type: 'Preprint',
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
        type: 'Preprint',
        link: 'http://example.com',
      },
      documentType: 'Article',
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

    const descriptionEditor = screen.getByTestId('editor');
    userEvent.click(descriptionEditor);
    userEvent.tab();
    fireEvent.input(descriptionEditor, { data: data.descriptionMD });
    userEvent.tab();

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
  const submitForm = async () => {
    const button = screen.getByRole('button', { name: /Publish/i });
    userEvent.click(button);
    userEvent.click(screen.getByRole('button', { name: /Publish Output/i }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Publish' })).toBeEnabled();
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeEnabled();
    });
  };

  const saveForm = async () => {
    const button = screen.getByRole('button', { name: /save/i });
    userEvent.click(button);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeEnabled();
    });
  };

  it('can submit a form with minimum data', async () => {
    await setupForm();
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith(expectedRequest);
    expect(history.location.pathname).toEqual(
      `/shared-research/${id}/publishedNow`,
    );
  });

  it('can update a published form with minimum data', async () => {
    await setupForm({ propOverride: { published: true } });
    await saveForm();
    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
      published: true,
    });
    expect(history.location.pathname).toEqual(`/shared-research/${id}`);
  });

  it('will show you confirmation dialog and allow you to cancel it', async () => {
    await setupForm();
    const button = screen.getByRole('button', { name: /Publish/i });
    userEvent.click(button);
    expect(
      screen.getByRole('button', { name: 'Publish Output' }),
    ).toBeVisible();
    userEvent.click(screen.getAllByRole('button', { name: /Cancel/i })[0]!);
    expect(screen.queryByRole('button', { name: 'Publish Output' })).toBeNull();
    expect(saveFn).not.toHaveBeenCalled();
  });

  const saveDraft = async () => {
    const button = screen.getByRole('button', { name: /Save Draft/i });
    userEvent.click(button);

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
