import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { Router } from 'react-router-dom';

import {
  createResearchOutputResponse,
  researchTagSubtypeResponse,
} from '@asap-hub/fixtures';
import { researchOutputDocumentTypeToType } from '@asap-hub/model';
import { fireEvent } from '@testing-library/dom';
import { render, screen, waitFor, within } from '@testing-library/react';
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

  const submitForm = async () => {
    const button = screen.getByRole('button', { name: /Publish/i });
    userEvent.click(button);
    userEvent.click(screen.getByRole('button', { name: /Publish Output/i }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Publish' })).toBeEnabled();
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeEnabled();
    });
  };
  const initialResearchOutputData = {
    id: 'id',
    created: '2020-09-07T17:36:54Z',
    addedDate: '2020-10-08T16:35:54Z',
    lastUpdatedPartial: '2020-11-09T20:36:54Z',
    lastModifiedDate: '2020-12-10T20:36:54Z',
    title: 'Output',
    description: 'description',
    descriptionMD: 'descriptionMD',
    shortDescription: 'shortDescription',
    documentType: 'Article' as const,
    authors: [],
    teams: [],
    publishingEntity: 'Working Group' as const,
    workingGroups: undefined,
    relatedEvents: [],
    relatedResearch: [],
    sharingStatus: 'Public' as const,
    contactEmails: [],
    labs: [],
    methods: [],
    organisms: [],
    environments: [],
    subtype: 'Metabolite',
    keywords: [],
    published: true,
    isInReview: false,
    versions: [],
    link: 'http://example.com',
    type: 'Preprint' as const,
  };

  it('resetting the type resets subtype', async () => {
    const documentType = 'Protocol';
    const type = 'Model System';
    const subtypeValue = 'Metabolite';
    const researchTags = [researchTagSubtypeResponse];

    render(
      <Router history={history}>
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
      </Router>,
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
      <Router history={history}>
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
      </Router>,
    );

    const sharingStatus = screen.getByRole('group', {
      name: /sharing status/i,
    });
    userEvent.click(
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
      <Router history={history}>
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
      </Router>,
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
