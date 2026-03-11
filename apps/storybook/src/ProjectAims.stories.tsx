import { ProjectAims } from '@asap-hub/react-components';
import { Aim, ProjectAimsGrant } from '@asap-hub/model';

export default {
  title: 'Organisms / Project Aims',
  component: ProjectAims,
};

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

const originalGrant: ProjectAimsGrant = {
  grantTitle: 'Original Grant',
  aims: defaultAims,
};

export const Default = () => <ProjectAims aims={[originalGrant]} />;

export const WithSupplementGrant = () => {
  const supplementGrant: ProjectAimsGrant = {
    grantTitle: 'Supplement Grant',
    aims: [
      createAim('s1', 1, longDescription, 'Complete', 3),
      createAim('s2', 2, mediumDescription, 'In Progress', 5),
      createAim('s3', 3, longDescription, 'Pending', 0),
      createAim('s4', 4, mediumDescription, 'Terminated', 2),
    ],
  };
  return <ProjectAims aims={[supplementGrant, originalGrant]} />;
};

export const AllStatuses = () => (
  <ProjectAims
    aims={[
      {
        grantTitle: 'Original Grant',
        aims: [
          createAim('1', 1, 'This aim is complete.', 'Complete', 2),
          createAim('2', 2, 'This aim is in progress.', 'In Progress', 1),
          createAim('3', 3, 'This aim is pending.', 'Pending', 0),
          createAim('4', 4, 'This aim is terminated.', 'Terminated', 0),
        ],
      },
    ]}
  />
);

export const WithMoreAims = () => (
  <ProjectAims
    aims={[
      {
        grantTitle: 'Original Grant',
        aims: [
          createAim('1', 1, longDescription, 'Complete', 3),
          createAim('2', 2, mediumDescription, 'In Progress', 5),
          createAim('3', 3, longDescription, 'Pending', 0),
          createAim('4', 4, shortDescription, 'Complete', 1),
          createAim('5', 5, mediumDescription, 'Terminated', 2),
          createAim('6', 6, longDescription, 'In Progress', 0),
          createAim('7', 7, shortDescription, 'Complete', 4),
          createAim('8', 8, mediumDescription, 'Pending', 0),
        ],
      },
    ]}
  />
);

export const SingleAim = () => (
  <ProjectAims
    aims={[
      {
        grantTitle: 'Original Grant',
        aims: [createAim('1', 1, mediumDescription, 'In Progress', 2)],
      },
    ]}
  />
);

export const LongDescriptions = () => (
  <ProjectAims
    aims={[
      {
        grantTitle: 'Original Grant',
        aims: [
          createAim('1', 1, longDescription, 'Complete', 1),
          createAim('2', 2, longDescription, 'In Progress', 3),
          createAim('3', 3, longDescription, 'Pending', 0),
          createAim('4', 4, longDescription, 'Complete', 5),
        ],
      },
    ]}
  />
);

export const ShortDescriptions = () => (
  <ProjectAims
    aims={[
      {
        grantTitle: 'Original Grant',
        aims: [
          createAim('1', 1, 'Complete literature review.', 'Complete', 0),
          createAim('2', 2, 'Analyze initial data.', 'In Progress', 1),
          createAim('3', 3, 'Prepare interim report.', 'Pending', 0),
          createAim('4', 4, 'Submit findings.', 'Complete', 2),
        ],
      },
    ]}
  />
);

export const SupplementGrantWithMoreAims = () => {
  const supplementGrant: ProjectAimsGrant = {
    grantTitle: 'Supplement Grant',
    aims: [
      createAim('s1', 1, longDescription, 'Complete', 3),
      createAim('s2', 2, mediumDescription, 'In Progress', 5),
      createAim('s3', 3, longDescription, 'Pending', 0),
      createAim('s4', 4, mediumDescription, 'Terminated', 2),
      createAim('s5', 5, shortDescription, 'Complete', 1),
      createAim('s6', 6, longDescription, 'In Progress', 0),
    ],
  };
  const original: ProjectAimsGrant = {
    grantTitle: 'Original Grant',
    aims: [
      createAim('o1', 1, mediumDescription, 'Complete', 2),
      createAim('o2', 2, longDescription, 'In Progress', 0),
    ],
  };
  return <ProjectAims aims={[supplementGrant, original]} />;
};

export const RealWorldExample = () => (
  <ProjectAims
    aims={[
      {
        grantTitle: 'Original Grant',
        aims: [
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
        ],
      },
    ]}
  />
);
