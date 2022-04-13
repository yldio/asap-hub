import { TeamResponse } from './team';
import { ListResponse } from './common';
import { UserResponse } from './user';
import { ExternalAuthorInput, ExternalAuthorResponse } from './external-author';
import { LabResponse } from './lab';

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

export const researchOutputDocumentTypeToSubtype: Record<
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
  None = 'None',
  DOI = 'DOI',
  AccessionNumber = 'Accession Number',
  RRID = 'RRID',
  LabCatalogNumber = 'Lab Catalog Number',
}

export const researchOutputToIdentifierType: Record<
  ResearchOutputDocumentType,
  ResearchOutputIdentifierType[]
> = {
  Article: [
    ResearchOutputIdentifierType.None,
    ResearchOutputIdentifierType.DOI,
  ],
  Bioinformatics: [
    ResearchOutputIdentifierType.None,
    ResearchOutputIdentifierType.DOI,
    ResearchOutputIdentifierType.RRID,
  ],
  'Lab Resource': [
    ResearchOutputIdentifierType.None,
    ResearchOutputIdentifierType.DOI,
    ResearchOutputIdentifierType.RRID,
    ResearchOutputIdentifierType.LabCatalogNumber,
  ],
  Dataset: [
    ResearchOutputIdentifierType.None,
    ResearchOutputIdentifierType.DOI,
    ResearchOutputIdentifierType.AccessionNumber,
  ],
  Protocol: [
    ResearchOutputIdentifierType.None,
    ResearchOutputIdentifierType.DOI,
  ],
  'Grant Document': [],
  Presentation: [],
};

export const sharingStatuses = ['Public', 'Network Only'] as const;

export type ResearchOutputSharingStatus = typeof sharingStatuses[number];

export type ResearchOutputResponse = {
  readonly id: string;
  readonly documentType: ResearchOutputDocumentType;
  readonly type?: ResearchOutputType;
  readonly title: string;
  readonly description: string;
  readonly tags: ReadonlyArray<string>;
  readonly link?: string;

  readonly created: string;
  readonly publishDate?: string;
  readonly labCatalogNumber?: string;
  readonly doi?: string;
  readonly accession?: string;
  readonly rrid?: string;
  readonly addedDate: string;
  readonly lastModifiedDate?: string;
  readonly lastUpdatedPartial: string;
  readonly accessInstructions?: string;
  readonly sharingStatus: ResearchOutputSharingStatus;
  readonly asapFunded?: boolean;
  readonly usedInPublication?: boolean;

  readonly authors: ReadonlyArray<UserResponse | ExternalAuthorResponse>;
  readonly teams: ReadonlyArray<Pick<TeamResponse, 'id' | 'displayName'>>;
  readonly contactEmails: string[];

  readonly labs: LabResponse[];
};

export type ResearchOutputPostRequest = {
  description: string;
  documentType: ResearchOutputDocumentType;
  type: ResearchOutputType;
  title: string;
  tags: string[];
  link?: string;

  labs?: string[];
  authors?: ExternalAuthorInput[];
  teams: string[];

  doi?: string;
  accession?: string;
  labCatalogNumber?: string;
  rrid?: string;

  addedDate: string;
  asapFunded?: boolean;
  sharingStatus: ResearchOutputSharingStatus;
  publishDate?: string;
  usedInPublication?: boolean;
  accessInstructions?: string;
};

export type ListResearchOutputResponse = ListResponse<ResearchOutputResponse>;
