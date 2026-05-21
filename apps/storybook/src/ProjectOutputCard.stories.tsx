import {
  createListTeamResponse,
  createListUserResponse,
} from '@asap-hub/fixtures';
import { ProjectOutputCard } from '@asap-hub/react-components';

import { boolean, date, number, select, text } from './knobs';

export default {
  title: 'Organisms / Project Outputs / Card',
};

const PROJECT_POOL = [
  { id: 'p1', title: 'Project Alpha', href: '/projects/discovery/p1' },
  { id: 'p2', title: 'Cross-cohort Synuclein Imaging', href: '/projects/resource/p2' },
  { id: 'p3', title: 'Neuro-immune Trainee Initiative', href: '/projects/trainee/p3' },
];

export const Normal = () => (
  <ProjectOutputCard
    id="r42"
    title={text(
      'Title',
      'Tracing the Origin and Progression of Parkinson’s Disease through the Neuro-Immune Interactome',
    )}
    link={text('Link', 'https://hub.asap.science')}
    documentType={select(
      'Document type',
      ['Article', 'Protocol', 'Dataset', 'Bioinformatics', 'Lab Material', 'Presentation', 'Grant Document', 'Report'],
      'Article',
    )}
    type={select(
      'Type',
      ['Preprint', 'Code', 'Antibody', 'Cell Culture & Differentiation', 'Genetic Data - RNA'],
      'Preprint',
    )}
    source={select('Source', ['project', 'team'], 'project')}
    keywords={['Neuroinflammation', 'Single-cell', 'Parkinson', 'Cohort']}
    created={new Date(date('Created', new Date(2024, 5, 1))).toISOString()}
    addedDate={new Date(date('Added', new Date(2024, 9, 14))).toISOString()}
    lastModifiedDate={new Date(
      date('Last Modified', new Date(2024, 11, 2)),
    ).toISOString()}
    teams={createListTeamResponse(number('Number of Teams', 2)).items}
    authors={createListUserResponse(number('Number of Authors', 5)).items}
    projects={PROJECT_POOL.slice(0, number('Number of Projects', 1, { min: 1, max: 3 }))}
    published={boolean('Published', true)}
    isInReview={boolean('In Review', false)}
  />
);

export const Draft = () => (
  <ProjectOutputCard
    id="d1"
    title="Draft: Longitudinal cohort analysis (work in progress)"
    documentType="Article"
    type="Preprint"
    keywords={['Cohort', 'Longitudinal']}
    created={new Date(2024, 11, 1).toISOString()}
    addedDate={new Date(2025, 0, 5).toISOString()}
    lastModifiedDate={new Date(2025, 1, 1).toISOString()}
    teams={[]}
    authors={createListUserResponse(3).items}
    projects={[PROJECT_POOL[0]!]}
    source="project"
    published={false}
    isInReview={false}
  />
);

export const InReview = () => (
  <ProjectOutputCard
    id="r1"
    title="In review: Team-shared sequencing dataset"
    documentType="Dataset"
    type="Genetic Data - RNA"
    link="https://example.com/dataset"
    keywords={['Sequencing', 'Dataset']}
    created={new Date(2024, 10, 1).toISOString()}
    addedDate={new Date(2024, 11, 20).toISOString()}
    lastModifiedDate={new Date(2025, 0, 10).toISOString()}
    teams={createListTeamResponse(1).items}
    authors={createListUserResponse(5).items}
    projects={[PROJECT_POOL[0]!]}
    source="team"
    published={false}
    isInReview={true}
  />
);

export const TeamBasedWithOverflow = () => (
  <ProjectOutputCard
    id="r6"
    title="Anti-α-Synuclein antibody validation across six labs"
    documentType="Lab Material"
    type="Antibody"
    link="https://example.com/output-6"
    keywords={['Antibody', 'Validation', 'Synuclein', 'Reproducibility']}
    created={new Date(2024, 4, 15).toISOString()}
    addedDate={new Date(2024, 5, 30).toISOString()}
    lastModifiedDate={new Date(2024, 10, 1).toISOString()}
    teams={createListTeamResponse(5).items}
    authors={createListUserResponse(6).items}
    projects={PROJECT_POOL}
    source="team"
    published
    isInReview={false}
  />
);

export const Minimal = () => (
  <ProjectOutputCard
    id="m1"
    title="Single-author presentation"
    documentType="Presentation"
    type="ASAP annual meeting"
    keywords={[]}
    created={new Date(2024, 3, 2).toISOString()}
    addedDate={new Date(2024, 3, 2).toISOString()}
    teams={[]}
    authors={createListUserResponse(1).items}
    projects={[PROJECT_POOL[0]!]}
    source="project"
    published
    isInReview={false}
  />
);
