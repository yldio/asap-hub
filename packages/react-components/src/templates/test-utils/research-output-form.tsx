/* istanbul ignore file */
import {
  InnerToastContext,
  ResearchOutputAvailableActions,
  ResearchOutputPermissions,
  resolveResearchOutputAvailableActions,
} from '@asap-hub/react-context';
import { MemoryRouter, useLocation } from 'react-router';
import {
  ResearchOutputDocumentType,
  ResearchOutputFlowId,
  ResearchOutputResponse,
  researchOutputDocumentTypeToType,
  ResearchOutputPostRequest,
} from '@asap-hub/model';
import { ComponentProps, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import ResearchOutputForm from '../ResearchOutputForm';

export const capturedLocation: {
  current: {
    pathname: string;
    search: string;
    state: unknown;
  } | null;
} = { current: null };

const LocationCapture = () => {
  const location = useLocation();
  useEffect(() => {
    capturedLocation.current = {
      pathname: location.pathname,
      search: location.search,
      state: location.state,
    };
  }, [location]);
  return null;
};

export const defaultPermissions: ResearchOutputPermissions = {
  canEditResearchOutput: true,
  canPublishResearchOutput: true,
  canShareResearchOutput: true,
};

type GetAvailableActionsInput = {
  flowId?: ResearchOutputFlowId;
  permissions?: ResearchOutputPermissions;
  researchOutputData?: ResearchOutputResponse;
  documentType?: ResearchOutputDocumentType;
  versions?: readonly unknown[];
  isImportedFromManuscript?: boolean;
};

export const getAvailableActions = ({
  flowId = 'team-create-manual',
  permissions = defaultPermissions,
  researchOutputData,
  documentType = 'Article',
  versions = researchOutputData?.versions ?? [],
  isImportedFromManuscript = false,
}: GetAvailableActionsInput = {}): ResearchOutputAvailableActions =>
  resolveResearchOutputAvailableActions({
    flowId,
    permissions,
    researchOutputData,
    documentType,
    versions,
    isImportedFromManuscript,
  });

export const defaultAvailableActions = getAvailableActions();

export const getDefaultProps = (): ComponentProps<
  typeof ResearchOutputForm
> => ({
  onSave: jest.fn(),
  onSaveDraft: jest.fn(),
  published: false,
  tagSuggestions: [],
  researchTags: [],
  documentType: 'Article',
  selectedTeams: [],
  flowId: 'team-create-manual',
  availableActions: defaultAvailableActions,
  typeOptions: Array.from(researchOutputDocumentTypeToType.Article.values()),
  permissions: defaultPermissions,
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

const resolveFormProps = (
  propOverride: Partial<ComponentProps<typeof ResearchOutputForm>> = {},
): ComponentProps<typeof ResearchOutputForm> => {
  const props = {
    ...getDefaultProps(),
    ...propOverride,
  };

  if (propOverride.availableActions) {
    return props;
  }

  return {
    ...props,
    availableActions: getAvailableActions({
      flowId: props.flowId,
      permissions: props.permissions,
      researchOutputData: props.researchOutputData,
      documentType: props.documentType,
      isImportedFromManuscript: !!props.isImportedFromManuscript,
    }),
  };
};

export const renderForm = (
  propOverride: Partial<ComponentProps<typeof ResearchOutputForm>> = {},
) =>
  render(
    <InnerToastContext.Provider value={jest.fn()}>
      <MemoryRouter>
        <LocationCapture />
        <ResearchOutputForm {...resolveFormProps(propOverride)} />
      </MemoryRouter>
    </InnerToastContext.Provider>,
  );

export const renderPrefilledForm = (
  propOverride: Partial<ComponentProps<typeof ResearchOutputForm>> = {},
) =>
  renderForm({
    researchOutputData: initialResearchOutputData,
    documentType: 'Bioinformatics',
    typeOptions: Array.from(researchOutputDocumentTypeToType.Bioinformatics),
    selectedTeams: [{ value: 'TEAMID', label: 'Example Team' }],
    ...propOverride,
  });
