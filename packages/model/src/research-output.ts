import { TeamResponse } from './team';
import { ListResponse } from './common';
import { UserResponse } from './user';
import { Lab } from './lab';

export const researchOutputTypes = [
  'Grant Document',
  'Proposal',
  'Presentation',
  'Dataset',
  'Bioinformatics',
  'Protocol',
  'Lab Resource',
  'Article',
  'Grant Document',
] as const;

export type ResearchOutputType = typeof researchOutputTypes[number];

export const researchOutputSubtypes = [
  'ASAP annual meeting',
  'ASAP subgroup meeting',
  'External meeting',
  'Preprint',
  'Published',
  'Genetic Data - DNA',
  'Genetic Data - RNA',
  'Protein Data',
  'Microscopy',
  'Electrophysiology',
  'Mass Spectrometry',
  'Code',
  'Data portal',
  'Web Portal',
  'Analysis',
  'Assays',
  'Cell Culture & Differentiation',
  'Cloning',
  'Imaging',
  'Model System',
  'Protein expression',
  'Sample Collection',
  'Shipment Procedures',
  '3D Printing',
  'Animal Models',
  'Antibodies',
  'Biosample',
  'Cell line',
  'Compounds',
  'Plasmid',
  'Protein',
  'Viral Vector',
  'Proposal',
  'Report',
] as const;

export type ResearchOutputSubtype = typeof researchOutputSubtypes[number];

export const sharingStatuses = ['Public', 'Network Only'] as const;

export type ResearchOutputSharingStatus = typeof sharingStatuses[number];

export type ExternalAuthor = Pick<UserResponse, 'displayName' | 'orcid'>;

export const isInternalAuthor = (
  author: ExternalAuthor | UserResponse,
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
  readonly addedDate?: string;
  readonly lastModifiedDate?: string;
  readonly lastUpdatedPartial: string;
  readonly accessInstructions?: string;
  readonly sharingStatus: ResearchOutputSharingStatus;
  readonly asapFunded?: boolean;
  readonly usedInPublication?: boolean;

  readonly authors: ReadonlyArray<UserResponse | ExternalAuthor>;
  readonly teams: ReadonlyArray<Pick<TeamResponse, 'id' | 'displayName'>>;
  readonly contactEmails: string[];

  readonly labs: Lab[];
};

export const researchOutputLabels: Record<ResearchOutputType, string> = {
  'Grant Document': 'Open External Link',
  Proposal: 'Open External Link',
  Presentation: 'View on Google',
  Dataset: 'Open External Link',
  Bioinformatics: 'Open External Link',
  Protocol: 'View on Protocols.io',
  'Lab Resource': 'Open External Link',
  Article: 'Open External Link',
};

export type ListResearchOutputResponse = ListResponse<ResearchOutputResponse>;
