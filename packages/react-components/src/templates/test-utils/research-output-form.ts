import {
  researchOutputDocumentTypeToType,
  ResearchOutputPostRequest,
} from '@asap-hub/model';
import { ComponentProps } from 'react';
import ResearchOutputForm from '../ResearchOutputForm';

export const getDefaultProps = (): ComponentProps<
  typeof ResearchOutputForm
> => ({
  displayChangelog: false,
  onSave: jest.fn(),
  onSaveDraft: jest.fn(),
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
  getImpactSuggestions: jest.fn(() => Promise.resolve([])),
  getCategorySuggestions: jest.fn(),
});

export const defaultProps = getDefaultProps();

export const expectedRequest: ResearchOutputPostRequest = {
  documentType: 'Bioinformatics',
  doi: '10.1234',
  link: 'http://example.com',
  title: 'example title',
  description: '',
  descriptionMD: 'example description',
  shortDescription: 'short description',
  changelog: '',
  type: 'Code',
  labs: ['1'],
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
  categories: [],
  impact: '',
  layImpactStatement: '',
};

export const initialResearchOutputData = {
  id: 'id',
  created: '2020-09-07T17:36:54Z',
  addedDate: '2020-10-08T16:35:54Z',
  lastUpdatedPartial: '2020-11-09T20:36:54Z',
  lastModifiedDate: '2020-12-10T20:36:54Z',
  title: 'Output',
  description: 'description',
  descriptionMD: 'descriptionMD',
  shortDescription: 'shortDescription',
  documentType: 'Bioinformatics' as const,
  authors: [],
  teams: [],
  publishingEntity: 'Working Group' as const,
  workingGroups: undefined,
  projects: [],
  relatedEvents: [],
  relatedResearch: [],
  sharingStatus: 'Public' as const,
  publishDate: '2020-12-10T20:36:54.000Z',
  contactEmails: [],
  labs: [{ id: '1', name: 'One Lab' }],
  methods: [],
  organisms: [],
  environments: [],
  subtype: 'Metabolite',
  keywords: [],
  published: true,
  isInReview: false,
  versions: [],
  link: 'http://example.com',
  type: 'Code' as const,
};
