import {
  mapManuscriptLifecycleToType,
  mapManuscriptTypeToSubType,
  ManuscriptVersionResponse,
  ResearchOutputPublishingEntities,
  ResearchOutputResponse,
  ResearchOutputVersion,
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
  published: false,
  sharingStatus: 'Public',
  asapFunded: true,
  usedInPublication: true,
  environments: [],
  documentType: 'Article',
  methods: [],
  created: '',
  contactEmails: [],
  organisms: [],
  versions: [],
  relatedEvents: [],
  relatedResearch: [],
  keywords: [],
  publishingEntity,
  lastUpdatedPartial: '',
  workingGroups: undefined,
  impact: manuscriptVersion.impact,
  categories: manuscriptVersion.categories,
  relatedManuscriptVersion: manuscriptVersion.versionId,
  relatedManuscript: manuscriptVersion.id.split('mv-')[1],
  doi: manuscriptVersion.doi,
});

export const mapResearchOutputToVersion = (
  researchOutput: ResearchOutputResponse,
): ResearchOutputVersion =>
  ({
    documentType: researchOutput.documentType,
    type: researchOutput.type,
    title: researchOutput.title,
    link: researchOutput.link,
    addedDate: researchOutput.addedDate,
    doi: researchOutput.doi,
    rrid: researchOutput.rrid,
    accession: researchOutput.accession,
    relatedManuscriptVersion: researchOutput.relatedManuscriptVersion,
  }) as ResearchOutputVersion;
