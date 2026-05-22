import { ProjectOutputListCard } from '@asap-hub/react-components';
import {
  createListUserResponse,
  createResearchOutputResponse,
} from '@asap-hub/fixtures';
import type { ProjectOutput } from '@asap-hub/react-components';

import { number } from './knobs';

export default {
  title: 'Organisms / Project Outputs / List Card',
};

const projectAlpha = {
  id: 'p1',
  title: 'Project Alpha',
  projectType: 'discovery' as const,
  href: '/projects/discovery/p1',
};

const teamPool = [
  {
    id: 't1',
    displayName: 'Jakobsson, J',
    teamType: 'Discovery Team' as const,
  },
  { id: 't2', displayName: 'Smith, A', teamType: 'Discovery Team' as const },
  { id: 't3', displayName: 'Okafor, B', teamType: 'Resource Team' as const },
];

const baseOutput = (i: number): ProjectOutput => ({
  ...createResearchOutputResponse(i),
  source: 'project',
  teams: [],
  projects: [projectAlpha],
});

export const ProjectBasedOnly = () => (
  <ProjectOutputListCard
    researchOutputs={Array.from({
      length: number('Outputs', 5, { min: 0, max: 20 }),
    }).map((_, i) => baseOutput(i))}
  />
);

export const Mixed = () => (
  <ProjectOutputListCard
    researchOutputs={[
      {
        ...baseOutput(0),
        title: 'Project-based: dataset shared across cohorts',
        documentType: 'Dataset',
        type: 'Genetic Data - RNA',
        link: 'https://example.com/output-1',
        authors: createListUserResponse(4).items,
      },
      {
        ...baseOutput(1),
        title: 'Team-based: antibody validation',
        documentType: 'Lab Material',
        type: 'Antibody',
        source: 'team',
        teams: teamPool,
        authors: createListUserResponse(6).items,
        link: 'https://example.com/output-2',
      },
      {
        ...baseOutput(2),
        title: 'Draft: in progress preprint',
        documentType: 'Article',
        type: 'Preprint',
        published: false,
        isInReview: false,
        authors: createListUserResponse(2).items,
      },
      {
        ...baseOutput(3),
        title: 'In review: team protocol',
        documentType: 'Protocol',
        type: 'Sample Prep',
        published: false,
        isInReview: true,
        source: 'team',
        teams: teamPool.slice(0, 2),
        authors: createListUserResponse(3).items,
      },
    ]}
  />
);

export const Empty = () => <ProjectOutputListCard researchOutputs={[]} />;
