import { DecisionOption, ListResponse } from './common';
import { ExternalAuthorInput, ExternalAuthorResponse } from './external-author';
import { LabResponse } from './lab';
import { TeamResponse } from './team';
import { UserResponse } from './user';

export const researchOutputDocumentTypes = [
  'Grant Document',
  'Presentation',
  'Dataset',
  'Bioinformatics',
  'Protocol',
  'Lab Resource',
  'Article',
] as const;

export type ResearchOutputDocumentType =
  typeof researchOutputDocumentTypes[number];

export const researchOutputTypes = [
  '3D Printing',
  'ASAP annual meeting',
  'ASAP subgroup meeting',
  'Analysis',
  'Animal Model',
  'Antibody',
  'Assay',
  'Behavioral',
  'Biosample',
  'Cell Culture & Differentiation',
  'Cell line',
  'Cloning',
  'Code',
  'Compound',
  'Data portal',
  'Electrophysiology',
  'External meeting',
  'Genetic Data - DNA',
  'Genetic Data - RNA',
  'Genotyping',
  'Microscopy & Imaging',
  'Model System',
  'Plasmid',
  'Preprint',
  'Proposal',
  'Protein Data',
  'Protein expression',
  'Published',
  'Report',
  'Sample Prep',
  'Shipment Procedure',
  'Software',
  'Spectroscopy',
  'Team meeting',
  'Viral Vector',
] as const;

export type ResearchOutputType = typeof researchOutputTypes[number];

export const researchOutputDocumentTypeToType: Record<
  ResearchOutputDocumentType,
  Set<ResearchOutputType>
> = {
  Article: new Set<ResearchOutputType>(['Preprint', 'Published']),
  Dataset: new Set<ResearchOutputType>([
    'Behavioral',
    'Electrophysiology',
    'Genetic Data - DNA',
    'Genetic Data - RNA',
    'Protein Data',
    'Microscopy & Imaging',
    'Spectroscopy',
  ]),
  Bioinformatics: new Set<ResearchOutputType>([
    'Code',
    'Data portal',
    'Software',
  ]),
  Protocol: new Set<ResearchOutputType>([
    '3D Printing',
    'Analysis',
    'Assay',
    'Cell Culture & Differentiation',
    'Cloning',
    'Genotyping',
    'Microscopy & Imaging',
    'Model System',
    'Protein expression',
    'Sample Prep',
    'Shipment Procedure',
  ]),
  'Lab Resource': new Set<ResearchOutputType>([
    'Animal Model',
    'Antibody',
    'Assay',
    'Biosample',
    'Cell line',
    'Compound',
    'Plasmid',
    'Viral Vector',
  ]),
  Presentation: new Set<ResearchOutputType>([
    'ASAP annual meeting',
    'ASAP subgroup meeting',
    'External meeting',
    'Team meeting',
  ]),
  'Grant Document': new Set<ResearchOutputType>(['Proposal', 'Report']),
};

export const isResearchOutputDocumentType = (
  type: string,
): type is ResearchOutputDocumentType =>
  (researchOutputDocumentTypes as ReadonlyArray<string>).includes(type);

export const isResearchOutputType = (
  type: string,
): type is ResearchOutputType =>
  (researchOutputTypes as ReadonlyArray<string>).includes(type);

export const researchOutputMapType = (
  type?: string | null,
): ResearchOutputType | null => {
  if (type && isResearchOutputType(type)) {
    return type;
  }

  return null;
};

export enum ResearchOutputIdentifierType {
  Empty = '',
  DOI = 'DOI',
  AccessionNumber = 'Accession Number',
  RRID = 'RRID',
}

export const researchOutputToIdentifierType: Record<
  ResearchOutputDocumentType,
  ResearchOutputIdentifierType[]
> = {
  Article: [ResearchOutputIdentifierType.DOI],
  Bioinformatics: [
    ResearchOutputIdentifierType.DOI,
    ResearchOutputIdentifierType.RRID,
  ],
  'Lab Resource': [
    ResearchOutputIdentifierType.DOI,
    ResearchOutputIdentifierType.RRID,
  ],
  Dataset: [
    ResearchOutputIdentifierType.DOI,
    ResearchOutputIdentifierType.AccessionNumber,
  ],
  Protocol: [ResearchOutputIdentifierType.DOI],
  'Grant Document': [],
  Presentation: [],
};

export const sharingStatuses = ['Public', 'Network Only'] as const;

export type ResearchOutputSharingStatus = typeof sharingStatuses[number];

export type ResearchOutputResponse = {
  readonly id: string;

  readonly accessInstructions?: string;
  readonly accession?: string;
  readonly addedDate: string;
  readonly asapFunded?: boolean;
  readonly authors: ReadonlyArray<UserResponse | ExternalAuthorResponse>;
  readonly contactEmails: string[];
  readonly created: string;
  readonly description: string;
  readonly documentType: ResearchOutputDocumentType;
  readonly doi?: string;
  readonly environments: string[];
  readonly labCatalogNumber?: string;
  readonly labs: LabResponse[];
  readonly lastModifiedDate?: string;
  readonly lastUpdatedPartial: string;
  readonly link?: string;
  readonly methods: string[];
  readonly organisms: string[];
  readonly publishDate?: string;
  readonly rrid?: string;
  readonly sharingStatus: ResearchOutputSharingStatus;
  readonly subtype?: string;
  readonly tags: ReadonlyArray<string>;
  readonly teams: ReadonlyArray<Pick<TeamResponse, 'id' | 'displayName'>>;
  readonly title: string;
  readonly type?: ResearchOutputType;
  readonly usedInPublication?: boolean;
};

export type ResearchOutputPostRequest = {
  accessInstructions?: string;
  accession?: string;
  addedDate: string;
  asapFunded?: boolean;
  authors?: ExternalAuthorInput[];
  description: string;
  documentType: ResearchOutputDocumentType;
  doi?: string;
  environments: string[];
  labCatalogNumber?: string;
  labs?: string[];
  link?: string;
  methods: string[];
  organisms: string[];
  publishDate?: string;
  rrid?: string;
  sharingStatus: ResearchOutputSharingStatus;
  subtype?: string;
  tags: string[];
  teams: string[];
  title: string;
  type: ResearchOutputType;
  usedInPublication?: boolean;
};

export type ResearchOutputPutRequest = ResearchOutputPostRequest;

export type ListResearchOutputResponse = ListResponse<ResearchOutputResponse>;

export const convertDecisionToBoolean = (
  decision: string | null | DecisionOption,
): boolean | undefined =>
  decision && ['Yes', 'No'].includes(decision) ? decision === 'Yes' : undefined;

export const convertBooleanToDecision = (bool?: boolean): DecisionOption => {
  if (typeof bool === 'undefined') {
    return 'Not Sure';
  }
  return bool ? 'Yes' : 'No';
};
