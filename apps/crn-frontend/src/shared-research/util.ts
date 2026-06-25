import {
  mapManuscriptLifecycleToType,
  mapManuscriptTypeToSubType,
  ManuscriptVersionResponse,
  ResearchOutputPublishingEntities,
  ResearchOutputResponse,
  ResearchOutputFlowId,
  RESEARCH_OUTPUT_FLOW_IDS,
} from '@asap-hub/model';

export const mapManuscriptVersionToResearchOutput = (
  output: ResearchOutputResponse | undefined,
  manuscriptVersion: ManuscriptVersionResponse,
  publishingEntity: ResearchOutputPublishingEntities,
): ResearchOutputResponse => ({
  ...output,
  id: output?.id || '',
  title: manuscriptVersion.title,
  link: manuscriptVersion.url,
  type:
    manuscriptVersion.lifecycle &&
    mapManuscriptLifecycleToType(manuscriptVersion.lifecycle),
  subtype:
    manuscriptVersion.type &&
    mapManuscriptTypeToSubType(manuscriptVersion.type),
  descriptionMD: manuscriptVersion.description,
  shortDescription: manuscriptVersion.shortDescription,
  labs: manuscriptVersion.labs || [],
  authors: manuscriptVersion.authors || [],
  teams: manuscriptVersion.teams || [],
  isInReview: false,
  published: output?.published ?? false,
  sharingStatus: 'Public',
  asapFunded: true,
  usedInPublication: true,
  environments: [],
  documentType: 'Article',
  methods: [],
  created: '',
  contactEmails: [],
  organisms: [],
  versions: output?.versions || [],
  relatedEvents: [],
  relatedResearch: [],
  keywords: [],
  publishingEntity,
  lastUpdatedPartial: '',
  workingGroups: undefined,
  impact: manuscriptVersion.impact,
  layImpactStatement: manuscriptVersion.layImpactStatement,
  categories: manuscriptVersion.categories,
  relatedManuscriptVersion: manuscriptVersion.versionId,
  relatedManuscript: manuscriptVersion.id.split('mv-')[1],
  doi: manuscriptVersion.doi,
  publishDate: manuscriptVersion.preprintDate,
});

export type ResolveFlowIdParams = {
  entityType: 'team' | 'working-group';
  versionAction?: 'create' | 'edit';
  published: boolean;
  isImportedFromManuscript?: boolean;
  isDuplicate: boolean;
  hasResearchOutputId: boolean;
};

export const resolveResearchOutputFlowId = ({
  entityType,
  versionAction,
  published,
  isImportedFromManuscript = false,
  isDuplicate,
  hasResearchOutputId,
}: ResolveFlowIdParams): ResearchOutputFlowId => {
  const isTeam = entityType === 'team';

  if (isDuplicate) {
    return isTeam
      ? RESEARCH_OUTPUT_FLOW_IDS.TEAM_DUPLICATE
      : RESEARCH_OUTPUT_FLOW_IDS.WORKING_GROUP_DUPLICATE;
  }

  if (versionAction === 'create' && hasResearchOutputId) {
    if (isTeam && isImportedFromManuscript) {
      return RESEARCH_OUTPUT_FLOW_IDS.TEAM_ADD_VERSION_FROM_MANUSCRIPT;
    }

    return isTeam
      ? RESEARCH_OUTPUT_FLOW_IDS.TEAM_ADD_VERSION
      : RESEARCH_OUTPUT_FLOW_IDS.WORKING_GROUP_ADD_VERSION;
  }

  if (versionAction === 'edit' && hasResearchOutputId) {
    if (published) {
      return isTeam
        ? RESEARCH_OUTPUT_FLOW_IDS.TEAM_EDIT_PUBLISHED
        : RESEARCH_OUTPUT_FLOW_IDS.WORKING_GROUP_EDIT_PUBLISHED;
    }

    return isTeam
      ? RESEARCH_OUTPUT_FLOW_IDS.TEAM_EDIT_DRAFT
      : RESEARCH_OUTPUT_FLOW_IDS.WORKING_GROUP_EDIT_DRAFT;
  }

  if (isTeam && isImportedFromManuscript) {
    return RESEARCH_OUTPUT_FLOW_IDS.TEAM_CREATE_IMPORTED_FROM_MANUSCRIPT;
  }

  return isTeam
    ? RESEARCH_OUTPUT_FLOW_IDS.TEAM_CREATE_MANUAL
    : RESEARCH_OUTPUT_FLOW_IDS.WORKING_GROUP_CREATE;
};
