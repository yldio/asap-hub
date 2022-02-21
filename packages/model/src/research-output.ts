import { TeamResponse } from './team';
import { ListResponse } from './common';
import { UserResponse } from './user';
import { ExternalAuthorResponse } from './external-author';
import { LabResponse } from './lab';
import { ExternalAuthorResponse } from './external-author';

export const researchOutputTypes = [
  'Grant Document',
  'Presentation',
  'Dataset',
  'Bioinformatics',
  'Protocol',
  'Lab Resource',
  'Article',
] as const;

export type ResearchOutputType = typeof researchOutputTypes[number];

export const researchOutputSubtypes = [
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
  'Microscopy',
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

export type ResearchOutputSubtype = typeof researchOutputSubtypes[number];

export const isResearchOutputType = (
  type: string,
): type is ResearchOutputType =>
  (researchOutputTypes as ReadonlyArray<string>).includes(type);

export const isResearchOutputSubtype = (
  subtype: string,
): subtype is ResearchOutputSubtype =>
  (researchOutputSubtypes as ReadonlyArray<string>).includes(subtype);

export const researchOutputMapSubtype = (
  subtype?: string | null,
): ResearchOutputSubtype | null => {
  if (subtype && isResearchOutputSubtype(subtype)) {
    return subtype;
  }

  return null;
};

export const sharingStatuses = ['Public', 'Network Only'] as const;

export type ResearchOutputSharingStatus = typeof sharingStatuses[number];

export const isInternalAuthor = (
  author: ExternalAuthorResponse | UserResponse,
): author is UserResponse => (author as UserResponse).id !== undefined;

export type ResearchOutputResponse = {
  readonly id: string;
  readonly type: ResearchOutputType;
  readonly subTypes: ResearchOutputSubtype[];
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
  teamId: string;

  description: string;
  type: ResearchOutputType;
  title: string;
  tags: string[];
  link: string;

  addedDate: string;
  asapFunded?: boolean;
  sharingStatus: ResearchOutputSharingStatus;
  usedInPublication?: boolean;
};

export const researchOutputLabels: Record<ResearchOutputType, string> = {
  'Grant Document': 'Open External Link',
  Presentation: 'View on Google',
  Dataset: 'Open External Link',
  Bioinformatics: 'Open External Link',
  Protocol: 'View on Protocols.io',
  'Lab Resource': 'Open External Link',
  Article: 'Open External Link',
};

export type ListResearchOutputResponse = ListResponse<ResearchOutputResponse>;
