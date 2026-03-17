import { ProjectAims } from '@asap-hub/react-components';
import { Aim } from '@asap-hub/model';

export default {
  title: 'Organisms / Project Aims',
  component: ProjectAims,
};

const mockFetchArticles = () => Promise.resolve([]);

const createAim = (
  id: string,
  order: number,
  description: string,
  status: Aim['status'],
  articleCount: number = 0,
): Aim => ({
  id,
  order,
  description,
  status,
  articleCount,
});

const shortDescription = 'Complete initial research and literature review.';

const mediumDescription =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

const longDescription =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const defaultAims: Aim[] = [
  createAim('1', 1, longDescription, 'Complete', 3),
  createAim('2', 2, mediumDescription, 'In Progress', 5),
  createAim('3', 3, longDescription, 'Pending', 0),
  createAim('4', 4, shortDescription, 'Complete', 1),
];

export const Default = () => (
  <ProjectAims
    originalGrantAims={defaultAims}
    supplementGrantAims={[]}
    fetchArticles={mockFetchArticles}
  />
);

export const WithSupplementGrant = () => {
  const supplementAims: Aim[] = [
    createAim('s1', 1, longDescription, 'Complete', 3),
    createAim('s2', 2, mediumDescription, 'In Progress', 5),
    createAim('s3', 3, longDescription, 'Pending', 0),
    createAim('s4', 4, mediumDescription, 'Terminated', 2),
  ];
  return (
    <ProjectAims
      originalGrantAims={defaultAims}
      supplementGrantAims={supplementAims}
      fetchArticles={mockFetchArticles}
    />
  );
};

export const AllStatuses = () => (
  <ProjectAims
    originalGrantAims={[
      createAim('1', 1, 'This aim is complete.', 'Complete', 2),
      createAim('2', 2, 'This aim is in progress.', 'In Progress', 1),
      createAim('3', 3, 'This aim is pending.', 'Pending', 0),
      createAim('4', 4, 'This aim is terminated.', 'Terminated', 0),
    ]}
    supplementGrantAims={[]}
    fetchArticles={mockFetchArticles}
  />
);

export const WithMoreAims = () => (
  <ProjectAims
    originalGrantAims={[
      createAim('1', 1, longDescription, 'Complete', 3),
      createAim('2', 2, mediumDescription, 'In Progress', 5),
      createAim('3', 3, longDescription, 'Pending', 0),
      createAim('4', 4, shortDescription, 'Complete', 1),
      createAim('5', 5, mediumDescription, 'Terminated', 2),
      createAim('6', 6, longDescription, 'In Progress', 0),
      createAim('7', 7, shortDescription, 'Complete', 4),
      createAim('8', 8, mediumDescription, 'Pending', 0),
    ]}
    supplementGrantAims={[]}
    fetchArticles={mockFetchArticles}
  />
);

export const SingleAim = () => (
  <ProjectAims
    originalGrantAims={[createAim('1', 1, mediumDescription, 'In Progress', 2)]}
    supplementGrantAims={[]}
    fetchArticles={mockFetchArticles}
  />
);

export const LongDescriptions = () => (
  <ProjectAims
    originalGrantAims={[
      createAim('1', 1, longDescription, 'Complete', 1),
      createAim('2', 2, longDescription, 'In Progress', 3),
      createAim('3', 3, longDescription, 'Pending', 0),
      createAim('4', 4, longDescription, 'Complete', 5),
    ]}
    supplementGrantAims={[]}
    fetchArticles={mockFetchArticles}
  />
);

export const ShortDescriptions = () => (
  <ProjectAims
    originalGrantAims={[
      createAim('1', 1, 'Complete literature review.', 'Complete', 0),
      createAim('2', 2, 'Analyze initial data.', 'In Progress', 1),
      createAim('3', 3, 'Prepare interim report.', 'Pending', 0),
      createAim('4', 4, 'Submit findings.', 'Complete', 2),
    ]}
    supplementGrantAims={[]}
    fetchArticles={mockFetchArticles}
  />
);

export const SupplementGrantWithMoreAims = () => {
  const supplementAims: Aim[] = [
    createAim('s1', 1, longDescription, 'Complete', 3),
    createAim('s2', 2, mediumDescription, 'In Progress', 5),
    createAim('s3', 3, longDescription, 'Pending', 0),
    createAim('s4', 4, mediumDescription, 'Terminated', 2),
    createAim('s5', 5, shortDescription, 'Complete', 1),
    createAim('s6', 6, longDescription, 'In Progress', 0),
  ];
  const originalAims: Aim[] = [
    createAim('o1', 1, mediumDescription, 'Complete', 2),
    createAim('o2', 2, longDescription, 'In Progress', 0),
  ];
  return (
    <ProjectAims
      originalGrantAims={originalAims}
      supplementGrantAims={supplementAims}
      fetchArticles={mockFetchArticles}
    />
  );
};

export const RealWorldExample = () => (
  <ProjectAims
    originalGrantAims={[
      createAim(
        '1',
        1,
        "Identify and characterize novel alpha-synuclein interacting proteins in dopaminergic neurons using proximity-labeling proteomics and validate their relevance to Parkinson's disease pathogenesis.",
        'Complete',
        8,
      ),
      createAim(
        '2',
        2,
        'Develop and optimize a high-throughput screening platform to evaluate small molecule modulators of alpha-synuclein aggregation in patient-derived iPSC neurons, with a focus on identifying drug candidates with favorable pharmacokinetic profiles.',
        'In Progress',
        3,
      ),
      createAim(
        '3',
        3,
        'Establish a multi-site longitudinal cohort study to track biomarker trajectories in pre-symptomatic LRRK2 mutation carriers, integrating clinical, imaging, and molecular data to define prodromal disease signatures.',
        'In Progress',
        1,
      ),
      createAim(
        '4',
        4,
        "Characterize the role of mitochondrial dynamics in GBA-associated Parkinson's disease using patient-derived midbrain organoids and CRISPR-corrected isogenic controls.",
        'Pending',
        0,
      ),
      createAim(
        '5',
        5,
        'Validate candidate neuroprotective compounds identified in Aim 2 in a preclinical mouse model of progressive alpha-synucleinopathy and prepare for IND-enabling studies.',
        'Pending',
        0,
      ),
    ]}
    supplementGrantAims={[]}
    fetchArticles={mockFetchArticles}
  />
);
