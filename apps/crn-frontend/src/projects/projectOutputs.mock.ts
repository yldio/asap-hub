import {
  createListUserResponse,
  createResearchOutputResponse,
} from '@asap-hub/fixtures';
import type { ProjectOutput } from '@asap-hub/react-components';

const TEAM_POOL = [
  {
    id: 'team-1',
    displayName: 'Jakobsson, J',
    teamType: 'Discovery Team' as const,
  },
  {
    id: 'team-2',
    displayName: 'Smith, A',
    teamType: 'Discovery Team' as const,
  },
  {
    id: 'team-3',
    displayName: 'Okafor, B',
    teamType: 'Resource Team' as const,
  },
  {
    id: 'team-4',
    displayName: 'Müller, K',
    teamType: 'Discovery Team' as const,
  },
  {
    id: 'team-5',
    displayName: 'Ribeiro, L',
    teamType: 'Resource Team' as const,
  },
  {
    id: 'team-6',
    displayName: 'Yamamoto, H',
    teamType: 'Discovery Team' as const,
  },
];

const EXTRA_PROJECTS = [
  {
    id: 'mock-project-2',
    title: 'Cross-cohort Synuclein Imaging',
    projectType: 'resource' as const,
    href: '/projects/resource/mock-project-2',
  },
  {
    id: 'mock-project-3',
    title: 'Neuro-immune Trainee Initiative',
    projectType: 'trainee' as const,
    href: '/projects/trainee/mock-project-3',
  },
];

const currentProject = (id: string, title: string) => ({
  id,
  title,
  projectType: 'discovery' as const,
  href: `/projects/discovery/${id}`,
});

const userPool = createListUserResponse(10).items;

type Entry = {
  id: string;
  title: string;
  documentType: ProjectOutput['documentType'];
  type?: ProjectOutput['type'];
  addedDate: string;
  lastModifiedDate: string;
  keywords: string[];
  authorCount: number;
  teamIds: string[];
  extraProjects: number;
  source: 'team' | 'project';
  link?: string;
  published: boolean;
  isInReview?: boolean;
};

const buildOutput = (
  entry: Entry,
  projectId: string,
  projectTitle: string,
  itemIndex: number,
): ProjectOutput => ({
  ...createResearchOutputResponse(itemIndex),
  id: entry.id,
  title: entry.title,
  documentType: entry.documentType,
  type: entry.type,
  addedDate: entry.addedDate,
  lastModifiedDate: entry.lastModifiedDate,
  keywords: entry.keywords,
  authors: userPool.slice(0, entry.authorCount),
  teams: entry.teamIds
    .map((tid) => TEAM_POOL.find((t) => t.id === tid))
    .filter((t): t is (typeof TEAM_POOL)[number] => Boolean(t)),
  published: entry.published,
  isInReview: entry.isInReview ?? false,
  link: entry.link,
  source: entry.source,
  projects: [
    currentProject(projectId, projectTitle),
    ...EXTRA_PROJECTS.slice(0, entry.extraProjects),
  ],
});

const PUBLISHED_ENTRIES: Entry[] = [
  {
    id: 'mock-output-1',
    title:
      'Tracing the Origin and Progression of Parkinson’s Disease through the Neuro-Immune Interactome',
    documentType: 'Article',
    type: 'Preprint',
    addedDate: new Date(2024, 9, 14).toISOString(),
    lastModifiedDate: new Date(2024, 11, 2).toISOString(),
    keywords: ['Neuroinflammation', 'Single-cell', 'Parkinson'],
    authorCount: 5,
    teamIds: ['team-1', 'team-2'],
    extraProjects: 0,
    source: 'team',
    link: 'https://example.com/output-1',
    published: true,
  },
  {
    id: 'mock-output-2',
    title: 'iPSC-derived dopaminergic neuron differentiation protocol v3',
    documentType: 'Protocol',
    type: 'Cell Culture & Differentiation',
    addedDate: new Date(2024, 8, 20).toISOString(),
    lastModifiedDate: new Date(2024, 11, 8).toISOString(),
    keywords: ['iPSC', 'Dopaminergic', 'Differentiation', 'Protocol'],
    authorCount: 3,
    teamIds: ['team-1'],
    extraProjects: 0,
    source: 'team',
    link: 'https://example.com/output-2',
    published: true,
  },
  {
    id: 'mock-output-3',
    title: 'Cross-cohort RNA-Seq dataset of substantia nigra samples',
    documentType: 'Dataset',
    type: 'Genetic Data - RNA',
    addedDate: new Date(2024, 8, 1).toISOString(),
    lastModifiedDate: new Date(2024, 10, 28).toISOString(),
    keywords: ['RNA-Seq', 'Substantia Nigra', 'Cohort', 'Open Data'],
    authorCount: 8,
    teamIds: [],
    extraProjects: 2,
    source: 'project',
    link: 'https://example.com/output-3',
    published: true,
  },
  {
    id: 'mock-output-4',
    title: 'Bioinformatics pipeline for proteomics analysis (snakemake)',
    documentType: 'Bioinformatics',
    type: 'Code',
    addedDate: new Date(2024, 7, 18).toISOString(),
    lastModifiedDate: new Date(2024, 10, 5).toISOString(),
    keywords: ['Proteomics', 'Pipeline', 'Snakemake'],
    authorCount: 2,
    teamIds: ['team-2'],
    extraProjects: 0,
    source: 'team',
    link: 'https://example.com/output-4',
    published: true,
  },
  {
    id: 'mock-output-5',
    title: 'Multi-author consortium paper on PD biomarkers',
    documentType: 'Article',
    type: 'Published',
    addedDate: new Date(2024, 6, 22).toISOString(),
    lastModifiedDate: new Date(2024, 9, 30).toISOString(),
    keywords: ['Biomarkers', 'Consortium', 'Parkinson', 'Cohort'],
    authorCount: 10,
    teamIds: [],
    extraProjects: 1,
    source: 'project',
    link: 'https://example.com/output-5',
    published: true,
  },
  {
    id: 'mock-output-6',
    title: 'Anti-α-Synuclein antibody validation across six labs',
    documentType: 'Lab Material',
    type: 'Antibody',
    addedDate: new Date(2024, 5, 30).toISOString(),
    lastModifiedDate: new Date(2024, 10, 1).toISOString(),
    keywords: ['Antibody', 'Validation', 'Synuclein', 'Reproducibility'],
    authorCount: 6,
    teamIds: ['team-1', 'team-2', 'team-3', 'team-4', 'team-5'],
    extraProjects: 2,
    source: 'team',
    link: 'https://example.com/output-6',
    published: true,
  },
  {
    id: 'mock-output-7',
    title: 'Mitochondrial complex I assay (96-well format)',
    documentType: 'Protocol',
    type: 'Assay',
    addedDate: new Date(2024, 5, 10).toISOString(),
    lastModifiedDate: new Date(2024, 8, 12).toISOString(),
    keywords: ['Mitochondria', 'Complex I', 'Assay'],
    authorCount: 2,
    teamIds: ['team-3'],
    extraProjects: 0,
    source: 'team',
    link: 'https://example.com/output-7',
    published: true,
  },
  {
    id: 'mock-output-8',
    title: 'Open dataset: gait dynamics in early-stage PD patients',
    documentType: 'Dataset',
    type: 'Clinical',
    addedDate: new Date(2024, 4, 4).toISOString(),
    lastModifiedDate: new Date(2024, 10, 18).toISOString(),
    keywords: ['Gait', 'Clinical', 'Wearable', 'Early-Stage'],
    authorCount: 4,
    teamIds: ['team-4'],
    extraProjects: 1,
    source: 'team',
    link: 'https://example.com/output-8',
    published: true,
  },
  {
    id: 'mock-output-9',
    title: 'AAV9-SNCA viral vector for in vivo PD modeling',
    documentType: 'Lab Material',
    type: 'Viral Vector',
    addedDate: new Date(2024, 3, 15).toISOString(),
    lastModifiedDate: new Date(2024, 7, 22).toISOString(),
    keywords: ['AAV', 'SNCA', 'In Vivo'],
    authorCount: 3,
    teamIds: ['team-5'],
    extraProjects: 0,
    source: 'team',
    published: true,
  },
  {
    id: 'mock-output-10',
    title: 'Tutorial: integrating single-cell atlases with bulk PD cohorts',
    documentType: 'Presentation',
    type: 'ASAP annual meeting',
    addedDate: new Date(2024, 3, 2).toISOString(),
    lastModifiedDate: new Date(2024, 5, 19).toISOString(),
    keywords: ['Single-cell', 'Integration', 'Tutorial'],
    authorCount: 1,
    teamIds: [],
    extraProjects: 0,
    source: 'project',
    link: 'https://example.com/output-10',
    published: true,
  },
  {
    id: 'mock-output-11',
    title: 'Computational model of α-synuclein aggregation kinetics',
    documentType: 'Bioinformatics',
    type: 'Computational Model',
    addedDate: new Date(2024, 2, 8).toISOString(),
    lastModifiedDate: new Date(2024, 9, 14).toISOString(),
    keywords: ['Modeling', 'Kinetics', 'Synuclein'],
    authorCount: 3,
    teamIds: ['team-6'],
    extraProjects: 1,
    source: 'team',
    link: 'https://example.com/output-11',
    published: true,
  },
  {
    id: 'mock-output-12',
    title: 'Grant supplement: cross-team trainee exchange program',
    documentType: 'Grant Document',
    type: 'Proposal',
    addedDate: new Date(2024, 1, 25).toISOString(),
    lastModifiedDate: new Date(2024, 4, 30).toISOString(),
    keywords: ['Trainees', 'Exchange'],
    authorCount: 2,
    teamIds: [],
    extraProjects: 2,
    source: 'project',
    published: true,
  },
];

const DRAFT_ENTRIES: Entry[] = [
  {
    id: 'mock-draft-1',
    title: 'Draft: Longitudinal cohort analysis (work in progress)',
    documentType: 'Article',
    type: 'Preprint',
    addedDate: new Date(2025, 0, 5).toISOString(),
    lastModifiedDate: new Date(2025, 1, 1).toISOString(),
    keywords: ['Cohort', 'Longitudinal'],
    authorCount: 3,
    teamIds: [],
    extraProjects: 0,
    source: 'project',
    published: false,
  },
  {
    id: 'mock-draft-2',
    title: 'In review: Team-shared sequencing dataset',
    documentType: 'Dataset',
    type: 'Sequencing',
    addedDate: new Date(2024, 11, 20).toISOString(),
    lastModifiedDate: new Date(2025, 0, 10).toISOString(),
    keywords: ['Sequencing', 'Dataset'],
    authorCount: 5,
    teamIds: ['team-1'],
    extraProjects: 0,
    source: 'team',
    link: 'https://example.com/draft-2',
    isInReview: true,
    published: false,
  },
  {
    id: 'mock-draft-3',
    title: 'Draft: Multi-team protocol harmonization across resource teams',
    documentType: 'Protocol',
    type: 'Sample Prep',
    addedDate: new Date(2024, 11, 1).toISOString(),
    lastModifiedDate: new Date(2025, 0, 22).toISOString(),
    keywords: ['Harmonization', 'Protocol', 'Resource'],
    authorCount: 4,
    teamIds: ['team-3', 'team-5'],
    extraProjects: 1,
    source: 'team',
    published: false,
  },
  {
    id: 'mock-draft-4',
    title: 'Draft: PD-specific imaging analysis software',
    documentType: 'Bioinformatics',
    type: 'Software',
    addedDate: new Date(2024, 10, 14).toISOString(),
    lastModifiedDate: new Date(2025, 0, 30).toISOString(),
    keywords: ['Software', 'Imaging', 'Analysis'],
    authorCount: 2,
    teamIds: ['team-2'],
    extraProjects: 0,
    source: 'team',
    link: 'https://example.com/draft-4',
    published: false,
  },
  {
    id: 'mock-draft-5',
    title: 'Draft: Cross-cohort proposal for early biomarker study',
    documentType: 'Grant Document',
    type: 'Proposal',
    addedDate: new Date(2024, 9, 28).toISOString(),
    lastModifiedDate: new Date(2025, 1, 3).toISOString(),
    keywords: ['Proposal', 'Biomarker', 'Cross-Cohort'],
    authorCount: 6,
    teamIds: [],
    extraProjects: 2,
    source: 'project',
    published: false,
  },
];

export const createProjectOutputsMock = (
  projectId: string,
  projectTitle: string,
): ProjectOutput[] =>
  PUBLISHED_ENTRIES.map((entry, i) =>
    buildOutput(entry, projectId, projectTitle, i),
  );

export const createProjectDraftOutputsMock = (
  projectId: string,
  projectTitle: string,
): ProjectOutput[] =>
  DRAFT_ENTRIES.map((entry, i) =>
    buildOutput(entry, projectId, projectTitle, 100 + i),
  );
