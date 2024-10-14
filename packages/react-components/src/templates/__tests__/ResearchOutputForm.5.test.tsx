import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { Router } from 'react-router-dom';

import { createResearchOutputResponse } from '@asap-hub/fixtures';
import {
  researchOutputDocumentTypeToType,
  ResearchOutputPostRequest,
} from '@asap-hub/model';
import { render, screen, waitFor, within } from '@testing-library/react';
import { network } from '@asap-hub/routing';
import { createMemoryHistory, History } from 'history';
import ResearchOutputForm from '../ResearchOutputForm';

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
  const submitForm = async () => {
    const button = screen.getByRole('button', { name: /Publish/i });
    userEvent.click(button);
    userEvent.click(screen.getByRole('button', { name: /Publish Output/i }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Publish' })).toBeEnabled();
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeEnabled();
    });
  };

  describe.each`
    fieldName              | selector
    ${'asapFunded'}        | ${/Has this output been funded by ASAP/i}
    ${'usedInPublication'} | ${/Has this output been used in a publication/i}
  `('$fieldName can submit', ({ fieldName, selector }) => {
    it.each`
      value         | expected
      ${'Yes'}      | ${true}
      ${'No'}       | ${false}
      ${'Not Sure'} | ${undefined}
    `('when $value then $expected', async ({ value, expected }) => {
      const documentType = 'Article' as const;

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

      const funded = screen.getByRole('group', {
        name: selector,
      });
      userEvent.click(within(funded).getByText(value));

      await submitForm();
      expect(saveFn).toHaveBeenLastCalledWith(
        expect.objectContaining({
          [fieldName]: expected,
        }),
      );
    });
  });

  it('should disable "No" and "Not Sure" options', async () => {
    history = createMemoryHistory({
      initialEntries: [
        network({}).teams({}).team({ teamId: 'TEAMID' }).createOutput({
          outputDocumentType: 'article',
        }).$,
      ],
    });

    const documentType = 'Article' as const;

    render(
      <Router history={history}>
        <ResearchOutputForm
          {...defaultProps}
          researchOutputData={{
            ...createResearchOutputResponse(),
            usedInPublication: undefined,
            sharingStatus: 'Network Only',
            documentType: 'Article',
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

    const usedInPublication = screen.getByRole('group', {
      name: /Has this output been used in a publication/i,
    });

    expect(
      within(usedInPublication).getByRole('radio', { name: 'No' }),
    ).toBeDisabled();
    expect(
      within(usedInPublication).getByRole('radio', { name: 'Not Sure' }),
    ).toBeDisabled();
  });
});
