import { ProjectOutputListCard } from '@asap-hub/react-components';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import { number } from './knobs';

export default {
  title: 'Organisms / Project Outputs / List Card',
};

export const Normal = () => (
  <ProjectOutputListCard
    researchOutputs={Array.from({
      length: number('Outputs', 5, { min: 0, max: 20 }),
    }).map((_, i) => ({
      ...createResearchOutputResponse(i),
      teams: [],
      projects: [
        { id: 'p1', title: 'Project Alpha', href: '/projects/p1' },
      ],
    }))}
  />
);

export const Mixed = () => (
  <ProjectOutputListCard
    researchOutputs={Array.from({
      length: number('Outputs', 4, { min: 0, max: 20 }),
    }).map((_, i) => ({
      ...createResearchOutputResponse(i),
      source: i % 2 === 0 ? 'project' as const : 'team' as const,
      projects: [
        { id: 'p1', title: 'Project Alpha', href: '/projects/p1' },
      ],
    }))}
  />
);
